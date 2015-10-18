'use strict';

var addComment = addComment || {};

addComment.setupForm = function( options ) {
	var div,
		cancel_object = options.cancel.parent();

	if ( ! jQuery( '#wp-temp-form-div' ).length ) {
		div = jQuery(
			'<div id="wp-temp-form-div" style="display: none;"></div>'
		);

		jQuery( options.respond ).parent().append( div );
	}

	options.respond.data( 'comment-id', options.commentId );
	options.respond.data( 'action', options.action );
	options.respond.insertBefore( options.comment.next() );
	options.cancel.show();

	this.respondId = options.respondId;

	jQuery( '.comment-reply-title' ).hide();
	jQuery( '.title-' + options.action ).show();
	jQuery( 'a#cancel-comment-reply-link' ).show();

	jQuery( '#comment' ).focus();
};

addComment.resetForm = function( cancel ) {
	var temp = jQuery( '#wp-temp-form-div' ),
		respond = jQuery( '#' + addComment.respondId );

	if ( ! temp.length || ! respond.length ) {
		return;
	}

	temp.parent().append( respond );
	temp.remove();

	jQuery( cancel )
		.hide()
		.prop( 'onclick', null );

	respond.find( 'textarea#comment' ).val( '' );
	respond.removeData( 'action' ).removeData( 'comment-id' );
};

addComment.moveForm = function( commentId, parentId, respondId, postId ) {
	var comment = jQuery( '#' + commentId ),
		respond = jQuery( '#' + respondId ),
		cancel = jQuery( '.title-reply #cancel-comment-reply-link' ),
		post = jQuery( '#comment_post_ID' );

	if ( ! comment.length || ! respond.length || ! cancel.length ) {
		return;
	}

	addComment.setupForm({
		action: 'reply',
		cancel: cancel,
		comment: comment,
		commentId: commentId,
		respond: respond,
		respondId: respondId
	});

	addComment.setParentValue( parentId );
	postId = postId || false;
	if ( post.length && postId ) {
		post.val(postId);
	}

	cancel.click(function () {
		addComment.resetForm( this );
		addComment.setParentValue( '0' );

		return false;
	});

	return false;
};

addComment.editForm = function( commentId, respondId ) {
	var model, content,
		comment = jQuery( '#div-comment-' + commentId ),
		respond = jQuery( '#' + respondId ),
		cancel = jQuery( '.title-edit #cancel-comment-reply-link' );

	if ( ! comment.length || ! respond.length || ! cancel.length ) {
		return;
	}

	addComment.setupForm({
		action: 'edit',
		cancel: cancel,
		comment: comment,
		commentId: commentId,
		respond: respond,
		respondId: respondId
	});

	model = rocketComments.commentsView.collection.get( commentId );

	if ( model.get( 'author' ) !=
			rocketComments.commentsView.collection.user_id ) {
		jQuery( '.comment-author-logged-in' ).hide();
		jQuery( '.comment-author-not-logged-in' ).show();

		respond.find( '#author' ).val( model.get( 'author_name' ) );
		respond.find( '#email' ).val( model.get( 'author_email' ) );
		respond.find( '#url' ).val( model.get( 'author_url' ) );
	}

	content = comment.children( '.comment-content' ).text();
	respond.find( 'textarea#comment' ).val( content.trim() );

	comment.hide();

	cancel.click(function () {
		addComment.resetForm( this );
		comment.show();
		jQuery( '.comment-author-not-logged-in' ).hide();
		jQuery( '.comment-author-logged-in' ).show();

		return false;
	});

	return false;
};

addComment.setParentValue = function( id ) {
	if ( ! addComment.hasOwnProperty( 'commentParent' ) ) {
		addComment.commentParent = jQuery( '#comment_parent' );
	}

	addComment.commentParent.val( id );
};
