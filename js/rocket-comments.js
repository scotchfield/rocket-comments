jQuery(function () {
	'use strict';

	var CommentModel = wp.api.models.Comment.extend({
		template: _.template(jQuery('#comment-template').html()),

		render: function () {
			return this.template(this.attributes);
		}
	}),

	CommentsCollection = wp.api.collections.Comments.extend({
		model: CommentModel
	}),

	CommentsView = Backbone.View.extend({
		el: 'div#comments',
		collection: new CommentsCollection(),

		initialize: function () {
			this.listenTo(this.collection, 'all', this.render);
			this.collection.fetch();
		},

		render: function () {
			this.$el.empty();
			this.collection.each(function (item) {
				console.log(item);
				this.$el.append(item.render());
			}, this);
		},
	});

	var commentsView = new CommentsView();
});
