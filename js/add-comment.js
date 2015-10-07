'use strict';

var addComment = addComment || {};

addComment.setupForm = function (commentId, cancel, respond, action) {
	var div,
		cancel_object = jQuery('#cancel-comment-reply-link').parent(),
		comment_title = jQuery('div#comments').data('comment-title-' + action);

	jQuery(cancel).trigger('click');

	if ( ! jQuery('#wp-temp-form-div').length ) {
		div = jQuery('<div id="wp-temp-form-div" style="display: none;"></div>');
		jQuery(respond).parent().append(div);
	}

	jQuery('h3#reply-title').html(comment_title)
		.append(jQuery('<small>').append(cancel_object));

	jQuery('#respond').data('comment-id', commentId);
	jQuery('#respond').data('action', action);
};

addComment.resetForm = function (el) {
	var temp = jQuery('#wp-temp-form-div'),
		respond = jQuery('#' + addComment.respondId);

	if ( ! temp.length || ! respond.length )
		return;

	temp.parent().append(respond);
	temp.remove();

	jQuery(el)
		.css('display', 'none')
		.prop('onclick', null);

	jQuery('#respond textarea#comment').val('');
	jQuery('#respond')
		.removeData('action')
		.removeData('comment-id');
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
		addComment.resetForm(this);

		addComment.I('comment_parent').value = '0';
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

	cancel.onclick = function() {
		addComment.resetForm(this);

		jQuery('#div-comment-' + commentId).show();
		jQuery('.comment-author-not-logged-in').hide();
		jQuery('.comment-author-logged-in').show();

		return false;
	};

	try { addComment.I('comment').focus(); }
	catch(e) {}

	return false;
};
