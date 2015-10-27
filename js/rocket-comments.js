'use strict';

var rocketComments = rocketComments || {};

/**
 * Set up the initial Rocket Comments environment and handlers.
 */
rocketComments.start = function () {
	jQuery( '#wp-loading' ).show();

	if ( undefined === rocketComments.started ) {
		var rc = new rocketComments.views.Comments();

		rocketComments.started = true;

		// Attach click handlers to the previous and next page elements.
		jQuery( '.comment-navigation .nav-previous a' ).on( 'click', function () {
			rocketComments.shiftPage( -1, rc );
		} );
		jQuery( '.comment-navigation .nav-next a' ).on( 'click', function () {
			rocketComments.shiftPage( 1, rc );
		} );
	}

	// Don't use the standard form submit; we'll trigger this using JS.
	jQuery( 'form#commentform' ).submit(function ( e ) {
		e.preventDefault();
	});
};

/**
 * Increase or decrease the current page via navigation bar click events.
 *
 * @param {number} delta - Number of pages to shift, may be negative.
 */
rocketComments.shiftPage = function ( delta, rc ) {
	if ( ! _.isObject( rc ) || ! ( 'fetchComments' in rc ) ) {
		return false;
	}

	rc.comment_page += delta;
	rc.fetchComments( rc.collection );
};

rocketComments.setupForm = function( options ) {
	var div, cancel_object;

	if ( ! options || ! options.cancel || ! options.respond ) {
		return false;
	}

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

	return true;
};

rocketComments.resetForm = function( cancel ) {
	var temp = jQuery( '#wp-temp-form-div' ),
		respond = jQuery( '#respond' );

	if ( ! temp.length || ! respond.length ) {
		return false;
	}

	temp.parent().append( respond );
	temp.remove();

	jQuery( cancel )
		.hide()
		.prop( 'onclick', null );

	respond.find( 'textarea#comment' ).val( '' );
	respond.removeData( 'action' ).removeData( 'comment-id' );

	return true;
};

rocketComments.moveForm = function(  ) {
	var parentId = jQuery( event.target ).data( 'id' ),
		commentId = 'div-comment-' + parentId,
		respondId = 'respond',
		postId = undefined,

	    comment = jQuery( '#' + commentId ),
		respond = jQuery( '#respond' ),
		cancel = jQuery( '.title-reply #cancel-comment-reply-link' ),
		post = jQuery( '#comment_post_ID' );

	if ( ! comment.length || ! respond.length || ! cancel.length ) {
		return false;
	}

	rocketComments.setupForm({
		action: 'reply',
		cancel: cancel,
		comment: comment,
		commentId: commentId,
		respond: respond,
		respondId: respondId
	});

	rocketComments.setParentValue( parentId );
	postId = postId || false;
	if ( post.length && postId ) {
		post.val(postId);
	}

	cancel.click(function () {
		rocketComments.resetForm( this );
		rocketComments.setParentValue( '0' );

		return false;
	});

	return true;
};

rocketComments.editForm = function ( event ) {
	console.log( event );

	var commentId = jQuery( event.target ).data( 'id' ), respondId = 'respond',
		model, content,
		comment = jQuery( '#div-comment-' + commentId ),
		respond = jQuery( '#' + respondId ),
		cancel = jQuery( '.title-edit #cancel-comment-reply-link' );

	if ( ! comment.length || ! respond.length || ! cancel.length ) {
		return false;
	}

	rocketComments.setupForm({
		action: 'edit',
		cancel: cancel,
		comment: comment,
		commentId: commentId,
		respond: respond,
		respondId: respondId
	});

	content = comment.children( '.comment-content' ).text();
	respond.find( 'textarea#comment' ).val( content.trim() );

	comment.hide();

	cancel.click(function () {
		console.log( this );
		rocketComments.resetForm( this );
		comment.show();
		jQuery( '.comment-author-not-logged-in' ).hide();
		jQuery( '.comment-author-logged-in' ).show();

		return false;
	});

	return true;
};

rocketComments.setParentValue = function( id ) {
	if ( ! rocketComments.hasOwnProperty( 'commentParent' ) ) {
		rocketComments.commentParent = jQuery( '#comment_parent' );
	}

	rocketComments.commentParent.val( id );
};
