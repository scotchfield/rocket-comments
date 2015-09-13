jQuery(function () {
	'use strict';

	var CommentModel = wp.api.models.Comment.extend({
		template: _.template(jQuery('#comment-template').html()),
		children: [],

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
			return depth;
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
			this.collection.fetch();
		},

		render: function () {
			this.$el.empty();
			if (!_.isEmpty(this.collection)) {
				this.collection.each(function (item) {
					var $el = this.$el;
					if (item.get('parent') > 0) {
						$el = jQuery('ol#ol-comment-' + item.get('parent'));
					}
					$el.append('<li id="comment-' + item.get('id') + '" class="comment depth-' + this.collection.commentDepth(item) + '"></li>');
					item.render();
				}, this);
			}
		},
	});

	var commentsView = new CommentsView();
});
