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
		/*this.collection.on('all', function(eventName) {
			console.log(eventName + ' was triggered!');
		});*/
		this.listenTo(this.collection, 'add', this.render);
		this.collection.post_id = this.$el.data('post-id');
		this.collection.user_id = this.$el.data('user-id');
		this.collection.user_name = this.$el.data('user-name');
		this.collection.user_avatar = this.$el.data('user-avatar');

		this.collection.fetch({
			success: function () {
				commentsView.interval = setInterval(commentsView.fetchComments, 5000, commentsView.collection);
			},
			error: function () {
				console.log('Error: Could not retrieve comments!');
			}
		});
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
			author_name = jQuery('.comment-respond input#author').val(),
			author_email = jQuery('.comment-respond input#email').val(),
			author_url = jQuery('.comment-respond input#url').val(),
			content = jQuery('.comment-respond textarea#comment').val(),
			action = jQuery('#respond').data('action'),
			attributes, item;

		if (action == 'edit') {
			item = this.collection.get(jQuery('#respond').data('comment-id'));

			item.set({content: content, type: ''});

			item.save({}, {
				success: function(model, response) {
					if (response !== null) {
						commentsView.collection.set(item, {remove: false});
					}
				},
				error: function(model, response) {
					console.log('Error!');
					console.log(response);
				}
			});
		} else {
			attributes = {
				id: null,
				author: this.collection.user_id,
				author_email: author_email,
				author_name: author_name,
				author_url: author_url,
				content: content,
				parent: parent_id,
				post: this.collection.post_id,
			};

			item = new CommentModel(attributes);

			item.save({}, {
				success: function(model, response) {
					if (response !== null) {
						commentsView.collection.add(item);
					}
				},
				error: function(model, response) {
					console.log('Error!');
					console.log(response);
				}
			});
		}

		jQuery('#cancel-comment-reply-link').trigger('click');
		jQuery('#respond textarea#comment').val('');

		this.render();
	},

	fetchComments: function (collection) {
		collection.fetch({
			error: function () {
				console.log('Error: Could not update collection!');
			}
		});
	},

});

addComment.setupForm = function (commentId, cancel, respond, action) {
	var div, cancel_object;

	jQuery(cancel).trigger('click');

	if ( ! this.I('wp-temp-form-div') ) {
		div = document.createElement('div');
		div.id = 'wp-temp-form-div';
		div.style.display = 'none';
		respond.parentNode.insertBefore(div, respond);
	}

	cancel_object = jQuery('#cancel-comment-reply-link').parent();
	jQuery('h3#reply-title').html(jQuery('div#comments').data('comment-title-' + action))
		.append(jQuery('<small>').append(cancel_object));

	jQuery('#respond').data('comment-id', commentId);
	jQuery('#respond').data('action', action);
};

addComment.moveForm = function(commId, parentId, respondId, postId) {
	var div,
		comm = this.I(commId),
		respond = this.I(respondId),
		cancel = this.I('cancel-comment-reply-link'),
		parent = this.I('comment_parent'),
		post = this.I('comment_post_ID');

	if ( ! comm || ! respond || ! cancel || ! parent ) {
		return;
	}

	addComment.setupForm(commId, cancel, respond, 'reply');

	this.respondId = respondId;
	postId = postId || false;

	comm.parentNode.insertBefore(respond, comm.nextSibling);
	if ( post && postId )
		post.value = postId;
	parent.value = parentId;
	cancel.style.display = '';

	cancel.onclick = function() {
		var temp = addComment.I('wp-temp-form-div'),
			respond = addComment.I(addComment.respondId);

		if ( ! temp || ! respond )
			return;

		addComment.I('comment_parent').value = '0';
		temp.parentNode.insertBefore(respond, temp);
		temp.parentNode.removeChild(temp);
		this.style.display = 'none';
		this.onclick = null;

		jQuery('#respond textarea#comment').val('');
		jQuery('#respond').removeData('action');
		jQuery('#respond').removeData('comment-id');

		return false;
	};

	try { this.I('comment').focus(); }
	catch(e) {}

	return false;
};

addComment.editForm = function(commentId, respondId) {
	var div, cancel_object, model, content,
		comment = this.I('div-comment-' + commentId),
		respond = this.I(respondId),
		cancel = this.I('cancel-comment-reply-link');

	if ( ! comment || ! respond || ! cancel ) {
		return;
	}

	addComment.setupForm(commentId, cancel, respond, 'edit');

	this.respondId = respondId;

	comment.parentNode.insertBefore(respond, comment.nextSibling);
	cancel.style.display = '';

	model = commentsView.collection.get(commentId);

	content = jQuery('#div-comment-' + commentId + ' .comment-content').text();
	jQuery('#respond textarea#comment').val(content.trim());

	jQuery('#div-comment-' + commentId).hide();

	cancel.onclick = function() {
		var temp = addComment.I('wp-temp-form-div');

		if ( ! temp ) {
			return;
		}

		temp.parentNode.insertBefore(respond, temp);
		temp.parentNode.removeChild(temp);
		this.style.display = 'none';
		this.onclick = null;

		jQuery('#div-comment-' + commentId).show();
		jQuery('#respond textarea#comment').val('');
		jQuery('#respond').removeData('action');
		jQuery('#respond').removeData('comment-id');

		return false;
	};

	try { addComment.I('comment').focus(); }
	catch(e) {}

	return false;
};

jQuery('form#commentform').submit(function (e) {
	e.preventDefault();
});

var commentsView = new CommentsView();
