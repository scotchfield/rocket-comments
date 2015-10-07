'use strict';

var rocketComments = rocketComments || {};

rocketComments.start = function () {
	jQuery('#wp-loading').show();

	if (undefined === rocketComments.commentsView) {
		rocketComments.commentsView = new rocketComments.CommentsView();
	}

	jQuery('.comment-navigation .nav-previous a').on('click', function () {
		rocketComments.shiftPage(-1);
	});
	jQuery('.comment-navigation .nav-next a').on('click', function () {
		rocketComments.shiftPage(1);
	});

	jQuery('form#commentform').submit(function (e) {
		e.preventDefault();
	});
};

rocketComments.shiftPage = function (delta) {
	rocketComments.commentsView.comment_page += delta;
	rocketComments.commentsView.fetchComments(rocketComments.commentsView.collection);
};
