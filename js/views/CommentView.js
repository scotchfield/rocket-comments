'use strict';

var rocketComments = rocketComments || {};

rocketComments.CommentView = Backbone.View.extend({
	tagName: 'li',

	initialize: function () {
		this.template = jQuery('#comment-template').length ? _.template(jQuery('#comment-template').html()) : undefined;
	},

	render: function (class_list) {
		if (undefined === this.template || undefined == this.model) {
			return this;
		}

		this.$el.html(this.template(this.model))
			.attr('id', 'comment-' + this.model.get('id'))
			.addClass(class_list)
			.data('comment-id', this.model.get('id'));

		return this;
	}
});
