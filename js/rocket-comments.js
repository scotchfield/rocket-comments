'use strict';

var CommentModel = Backbone.Model.extend({ //wp.api.models.Comment.extend({
	children: [],
	idAttribute: 'id',
	defaults: {
		id: null,
		author: null,
		author_avatar_urls: {
			'24': '',
			'48': '',
			'56': '',
			'96': ''
		},
		author_email: '',
		author_ip: '',
		author_name: '',
		author_url: '',
		author_user_agent: '',
		content: {},
		date: new Date(),
		date_gmt: new Date(),
		karma: 0,
		link: '',
		parent: 0,
		post: null,
		status: 'hold',
		type: '',
		_links: {}
	},

	/**
	 * Set nonce header before every Backbone sync
	 * Borrowed from wp-api.js
	 *
	 * @param {string} method
	 * @param {Backbone.Model} model
	 * @param {{beforeSend}, *} options
	 * @returns {*}
	 */
	sync: function( method, model, options ) {
		options = options || {};

		if ( 'undefined' !== typeof WP_API_Settings.nonce ) {
			var beforeSend = options.beforeSend;

			options.beforeSend = function( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', WP_API_Settings.nonce );

				if ( beforeSend ) {
					return beforeSend.apply( this, arguments );
				}
			};
		}

		return Backbone.sync( method, model, options );
	},

	url: function() {
		var id = this.get( 'id' );
		id = id || '';

		return WP_API_Settings.root + '/comments/' + id;
	},

	initialize: function () {
		var date = new Date(wp.api.utils.parseISO8601(this.get('date')));
		this.set({'date_string': date.toLocaleString()});
		this.set({'iso_string': date.toISOString()});
	},

}),

CommentView = Backbone.View.extend({
	tagName: 'li',
	template: _.template(jQuery('#comment-template').html()),

	render: function (class_list) {
		this.$el.html(this.template(this.model))
			.attr('id', 'comment-' + this.model.get('id'))
			.addClass(class_list)
			.data('comment-id', this.model.get('id'));

		return this;
	}
}),

CommentsCollection = wp.api.collections.Comments.extend({
	model: CommentModel,
	url: function () {
		if (this.post_id) {
			return WP_API_Settings.root + '/comments/?orderby=id&order=ASC&post=' + this.post_id;
		}
		return WP_API_Settings.root + '/comments/';
	},

	commentDepth: function (item) {
		var depth = 1;
		while (item.get('parent') > 0) {
			item = this.where({'id': item.get('parent')})[0];
			depth += 1;
		}
		if (! this.threaded) {
			this.threaded = jQuery('div#comments').data('threaded');
		}
		return depth < this.threaded ? depth : this.threaded;
	}
}),

CommentsView = Backbone.View.extend({
	el: '.comments-area',
	collection: new CommentsCollection(),

	events: {
		'click .comment-respond .submit': 'submitComment'
	},

	initialize: function () {
		this.collection.on('all', function(eventName) {
			console.log(eventName + ' was triggered!');
		});
		this.listenTo(this.collection, 'add', this.render);
		this.collection.post_id = this.$el.data('post-id');
		this.collection.user_id = this.$el.data('user-id');
		this.collection.user_name = this.$el.data('user-name');
		this.collection.user_avatar = this.$el.data('user-avatar');
		this.collection.fetch();

		setInterval(this.intervalFetch, 10000, this.collection);
	},

	render: function () {
		var $ol = this.$el.find('ol#comment-root');
		$ol.empty();

		jQuery('div#wp-loading').fadeOut(400);

		if (!_.isEmpty(this.collection)) {
			this.collection.each(function (item) {
				var depth = this.collection.commentDepth(item),
					bypostauthor = '';

				if (item.get('parent') > 0 && depth > 1) {
					$ol = jQuery('ol#ol-comment-' + item.get('parent'));
				}

				if (item.get('author') == this.collection.user_id) {
					bypostauthor = ' bypostauthor';
				}

				var item_view = new CommentView({model: item});
				$ol.append(item_view.render('comment depth-' + depth + bypostauthor).el);

				console.log(item);
			}, this);
			jQuery('.comments-area .comments-title').css('display', 'none');
			if (this.collection.length == 1) {
				jQuery('.comments-area #comment-single').fadeIn();
			} else {
				jQuery('span#comment-count').html(this.collection.length);
				jQuery('.comments-area #comment-multiple').fadeIn();
			}
		}
	},

	submitComment: function (e) {
		e.preventDefault();

		var $el = jQuery(e.currentTarget).closest('li'),
			parent_id = $el.data('comment-id'),
			author_name = jQuery('.comment-respond textarea#author').val(),
			author_email = jQuery('.comment-respond textarea#email').val(),
			author_url = jQuery('.comment-respond textarea#url').val(),
			content = jQuery('.comment-respond textarea#comment').val(),
			attributes = {
				author: this.collection.user_id,
				author_email: author_email,
				author_name: author_name,
				content: content,
				parent: parent_id,
				post: this.collection.post_id
			},
			item = new CommentModel(attributes);

		item.save();

		item.attributes.author_name = this.collection.user_name;
		item.attributes.author_avatar_urls['56'] = this.collection.user_avatar;
		this.collection.add(item);
	},

	intervalFetch: function (collection) {
		collection.fetch();
	}
});

jQuery(function () {
	jQuery('form#commentform').submit(function (e) {
		e.preventDefault();
	});

	var commentsView = new CommentsView();
});
