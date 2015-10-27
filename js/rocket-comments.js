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
	var respond = rocketComments.getCache( '#respond' );

	if ( ! options ) {
		return false;
	}

	rocketComments.setupTempForm();

	respond.data( 'comment-id', options.commentId );
	respond.data( 'action', options.action );
	respond.insertBefore( options.comment.next() );
	options.cancel.show();

	rocketComments.getCache( '.comment-reply-title' ).hide();
	rocketComments.getCache( '.title-' + options.action ).show();
	rocketComments.getCache( '#cancel-comment-reply-link' ).show();

	rocketComments.getCache( '#comment' ).focus();

	return true;
};

rocketComments.setupTempForm = function () {
	if ( ! jQuery( '#wp-temp-form-div' ).length ) {
		var div = jQuery(
			'<div id="wp-temp-form-div" style="display: none;"></div>'
		);

		rocketComments.getCache( '#respond' ).parent().append( div );
	}
}

rocketComments.resetForm = function( cancel ) {
	var temp = jQuery( '#wp-temp-form-div' ),
		respond = rocketComments.getCache( '#respond' );

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

rocketComments.moveForm = function( event ) {
	var commentId = jQuery( event.target ).data( 'id' ),
		cancel = rocketComments.getCache( '.title-reply #cancel-comment-reply-link' );

	if ( ! cancel.length ) {
		return false;
	}

	rocketComments.setupForm({
		action: 'reply',
		cancel: cancel,
		comment: rocketComments.getCache( '#div-comment-' + commentId ),
		commentId: commentId,
	});

	cancel.click(function () {
		rocketComments.resetForm( this );

		return false;
	});

	return true;
};

rocketComments.editForm = function ( event ) {
	var commentId = jQuery( event.target ).data( 'id' ),
		comment = rocketComments.getCache( '#div-comment-' + commentId ),
		respond = rocketComments.getCache( '#respond' ),
		cancel = rocketComments.getCache( '.title-edit #cancel-comment-reply-link' );

	if ( ! comment.length || ! respond.length || ! cancel.length ) {
		return false;
	}

	rocketComments.setupForm({
		action: 'edit',
		cancel: cancel,
		comment: comment,
		commentId: commentId,
	});

	comment.hide();

	cancel.click(function () {
		rocketComments.resetForm( this );
		comment.show();
		rocketComments.getCache( '.comment-author-not-logged-in' ).hide();
		rocketComments.getCache( '.comment-author-logged-in' ).show();

		return false;
	});

	return true;
};

rocketComments.setParentValue = function( id ) {
	var parent = rocketComments.getCache( '#comment_parent' );

	parent.val( id );
};

rocketComments.getCache = function ( id ) {
	if ( undefined === rocketComments.cache ) {
		rocketComments.cache = {};
	}

	if ( undefined === rocketComments.cache[id] ) {
		rocketComments.cache[id] = jQuery( id );
	}

	return rocketComments.cache[id];
};
