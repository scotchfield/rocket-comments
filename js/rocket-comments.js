jQuery(function () {
	'use strict';

	var CommentModel = wp.api.models.Comment.extend({
		template: _.template(jQuery('#comment-template').html()),
		children: [],

		initialize: function () {
			var date = new Date(wp.api.utils.parseISO8601(this.get('date')));
			this.set({'date_string': date.toLocaleString()});
			this.set({'iso_string': date.toISOString()});
		},

		render: function () {
			var $el = jQuery('li#comment-' + this.get('id'));
			$el.html(this.template(this.attributes));
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
		el: 'ol#comment-root',
		collection: new CommentsCollection(),

		initialize: function () {
			this.collection.on('all', function(eventName) {
				console.log(eventName + ' was triggered!');
			});
			this.listenTo(this.collection, 'add', this.render);
			this.collection.post_id = this.$el.data('post-id');
			this.collection.user_id = this.$el.data('user-id');
			this.collection.fetch();
		},

		render: function () {
			this.$el.empty();
			jQuery('div#wp-loading').fadeOut(400, function () {
				jQuery('ol#comment-root').fadeIn(400);
			});
			if (!_.isEmpty(this.collection)) {
				this.collection.each(function (item) {
					var $el = this.$el,
						depth = this.collection.commentDepth(item),
						bypostauthor = '';

					if (item.get('parent') > 0 && depth > 1) {
						$el = jQuery('ol#ol-comment-' + item.get('parent'));
					}

					$el.append('<li id="comment-' + item.get('id') + '" class="comment depth-' + depth + bypostauthor + '"></li>');
					item.render();
					console.log(item);
				}, this);
				if (this.collection.length == 1) {
					jQuery('.comments-area #comment-single').fadeIn();
				} else {
					jQuery('span#comment-count').html(this.collection.length);
					jQuery('.comments-area #comment-multiple').fadeIn();
				}
			}
		},
	});

	var commentsView = new CommentsView();
});
