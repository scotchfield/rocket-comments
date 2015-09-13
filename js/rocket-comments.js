jQuery(function () {
	'use strict';

	var CommentsView = Backbone.View.extend({
		el: 'div#comments',

		initialize: function () {
			this.collection = new wp.api.collections.Comments();
			this.listenTo(this.collection, 'all', this.render);
			this.collection.fetch();
		},

		render: function () {
			this.$el.empty();
			this.collection.each(function (item) {
				this.renderComment(item);
			}, this);
		},

		renderComment: function (item) {
			/*var commentView = new CommentView({
				model: item
			}) ;*/
			console.log(item);
			this.$el.append('<p>' + item.get('author_name') + '</p>');
		}
	});

	var commentsView = new CommentsView();
});
