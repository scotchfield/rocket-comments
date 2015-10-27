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

rocketComments.startForm = function ( event, action ) {
	var commentId = jQuery( event.target ).data( 'id' ),
		cancel = this.getCache( '#cancel-comment-' + action + '-link' ),
		respond = this.getCache( '#respond' ),
		comment = this.getCache( '#div-comment-' + commentId );

	if ( action === 'edit' ) {
		comment.hide();
	}

	rocketComments.setupTempForm();

	respond.data( 'comment-id', commentId );
	respond.data( 'action', action );
	respond.insertBefore( comment.next() );
	cancel.show();

	this.getCache( '.comment-reply-title' ).hide();
	this.getCache( '.title-' + action ).show();
	this.getCache( '#cancel-comment-reply-link' ).show();

	this.getCache( '#comment' ).focus();

	cancel.click(function () {
		rocketComments.cancelForm.call( this, comment );
	});

	return true;
};

rocketComments.setupForm = function ( options ) {
	var respond = this.getCache( '#respond' ),
		comment = this.getCache( '#div-comment-' + options.commentId );

	if ( ! options ) {
		return false;
	}

	if ( options.action === 'edit' ) {
		comment.hide();
	}

	rocketComments.setupTempForm();

	respond.data( 'comment-id', options.commentId );
	respond.data( 'action', options.action );
	respond.insertBefore( comment.next() );
	options.cancel.show();

	this.getCache( '.comment-reply-title' ).hide();
	this.getCache( '.title-' + options.action ).show();
	this.getCache( '#cancel-comment-reply-link' ).show();

	this.getCache( '#comment' ).focus();

	options.cancel.click(function () {
		rocketComments.cancelForm.call( this, comment );
	});

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

rocketComments.resetForm = function ( cancel ) {
	var temp = jQuery( '#wp-temp-form-div' ),
		respond = this.getCache( '#respond' );

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

rocketComments.cancelForm = function ( comment ) {
	if ( undefined !== comment ) {
		comment.show();
	}

	rocketComments.resetForm( this );
	rocketComments.getCache( '.comment-author-not-logged-in' ).hide();
	rocketComments.getCache( '.comment-author-logged-in' ).show();

	return false;
}

rocketComments.setParentValue = function ( id ) {
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
