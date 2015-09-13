jQuery(function () {
	'use strict';

	var CommentModel = wp.api.models.Comment.extend({
		template: _.template(jQuery('#comment-template').html()),

		render: function () {
			return this.template(this.attributes);
		}
	}),

	CommentsCollection = wp.api.collections.Comments.extend({
		model: CommentModel,
		url: function () {
			if (this.post_id) {
				return WP_API_Settings.root + '/comments/?post=' + this.post_id;
			}
			return WP_API_Settings.root + '/comments/';
		}
	}),

	CommentsView = Backbone.View.extend({
		el: 'ol.comment-list',
		collection: new CommentsCollection(),

		initialize: function () {
			this.listenTo(this.collection, 'add', this.render);
			this.collection.post_id = this.$el.data('post-id');
			this.collection.fetch();
		},

		render: function () {
			this.$el.empty();
			if (!_.isEmpty(this.collection)) {
				this.collection.each(function (item) {
					this.$el.append(item.render());
				}, this);
			}
		},
	});

	var commentsView = new CommentsView();
});
