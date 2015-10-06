'use strict';

var rocketComments = rocketComments || {};

rocketComments.CommentsCollection = wp.api.collections.Comments.extend({
	initialize: function () {
		this.order = jQuery('.comments-area').data('comment-order');
		this.model = rocketComments.CommentModel;
		this.state = {};
	},

	url: function () {
		if (this.post_id) {
			return WP_API_Settings.root + '/comments/?orderby=id&order=' + this.order + '&post=' + this.post_id;
		}
		return WP_API_Settings.root + '/comments/';
	},

	commentDepth: function (item) {
		var depth = 1;
		while (item && item.get('parent') > 0) {
			item = this.where({id: item.get('parent')})[0];
			depth += 1;
		}
		if (! this.threaded) {
			this.threaded = jQuery('div#comments').data('threaded');
		}
		return depth < this.threaded ? depth : this.threaded;
	}
});
