'use strict';

var addComment = addComment || {};

addComment.setupForm = function (options) {
	var div,
		cancel_object = jQuery('#cancel-comment-reply-link').parent(),
		comment_title = jQuery('div#comments').data('comment-title-' + options.action);

	if ( ! jQuery('#wp-temp-form-div').length ) {
		div = jQuery('<div id="wp-temp-form-div" style="display: none;"></div>');
		jQuery(options.respond).parent().append(div);
	}

	options.respond.data('comment-id', options.commentId);
	options.respond.data('action', options.action);
	options.respond.insertBefore(options.comment.next());
	options.cancel.show();

	this.respondId = options.respondId;

	jQuery('h3#reply-title').html(comment_title)
		.append(jQuery('<small>').append(cancel_object));

	jQuery(options.cancel).trigger('click');
	jQuery('#comment').focus();
};

addComment.resetForm = function (el) {
	var temp = jQuery('#wp-temp-form-div'),
		respond = jQuery('#' + addComment.respondId);

	if ( ! temp.length || ! respond.length )
		return;

	temp.parent().append(respond);
	temp.remove();

	jQuery(el)
		.hide()
		.prop('onclick', null);

	jQuery('#respond textarea#comment').val('');
	jQuery('#respond')
		.removeData('action')
		.removeData('comment-id');
};

addComment.moveForm = function(commentId, parentId, respondId, postId) {
	var div,
		comment = jQuery('#' + commentId),
		respond = jQuery('#' + respondId),
		cancel = jQuery('#cancel-comment-reply-link'),
		parent = jQuery('#comment_parent'),
		post = jQuery('#comment_post_ID');

	if ( ! comment.length || ! respond.length || ! cancel.length || ! parent.length ) {
		return;
	}

	addComment.setupForm({
		action: 'reply',
		cancel: cancel,
		comment: comment,
		commentId: commentId,
		respond: respond,
		respondId: respondId,
	});

	postId = postId || false;

	if ( post.length && postId ) {
		post.val(postId);
	}
	parent.val(parentId);

	cancel.click(function () {
		addComment.resetForm(this);

		jQuery('#comment_parent').val('0');
		return false;
	});

	return false;
};

addComment.editForm = function(commentId, respondId) {
	var div, cancel_object, model, content,
		comment = jQuery('#div-comment-' + commentId),
		respond = jQuery('#' + respondId),
		cancel = jQuery('#cancel-comment-reply-link');

	if ( ! comment.length || ! respond.length || ! cancel.length ) {
		return;
	}

	addComment.setupForm({
		action: 'edit',
		cancel: cancel,
		comment: comment,
		commentId: commentId,
		respond: respond,
		respondId: respondId,
	});

	model = rocketComments.commentsView.collection.get(commentId);

	if (model.get('author') != rocketComments.commentsView.collection.user_id) {
		jQuery('.comment-author-logged-in').hide();
		jQuery('.comment-author-not-logged-in').show();

		jQuery('.comment-respond #author').val(model.get('author_name'));
		jQuery('.comment-respond #email').val(model.get('author_email'));
		jQuery('.comment-respond #url').val(model.get('author_url'));
	}

	content = jQuery('#div-comment-' + commentId + ' .comment-content').text();
	jQuery('#respond textarea#comment').val(content.trim());

	jQuery('#div-comment-' + commentId).hide();

	cancel.click(function () {
		addComment.resetForm(this);

		jQuery('#div-comment-' + commentId).show();
		jQuery('.comment-author-not-logged-in').hide();
		jQuery('.comment-author-logged-in').show();

		return false;
	});

	return false;
};
