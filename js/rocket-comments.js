'use strict';

var rocketComments = rocketComments || {};

/**
 * Set up the initial Rocket Comments environment and handlers.
 */
rocketComments.start = function () {
	rocketComments.cache = {};

	rocketComments.get( '#wp-loading' ).show();

	if ( undefined !== rocketComments.started ) {
		return;
	}

	var rc = new rocketComments.views.Comments();
	rocketComments.started = true;

	// Attach click handlers to the previous and next page elements.
	jQuery( '#comment-navigation-previous' ).click(function () {
		rocketComments.shiftPage.call( rc, -1 );
	});
	jQuery( '#comment-navigation-next' ).click(function () {
		rocketComments.shiftPage.call( rc, 1 );
	});

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
rocketComments.shiftPage = function ( delta ) {
	this.comment_page += delta;
	this.fetchComments( true );
};

/**
 * Move the form below or in-place of a comment to reply or edit.
 *
 * @param {Object} event - The link element that triggered the event
 * @param {string} action - Either 'edit' or 'reply' based on the click
 */
rocketComments.startForm = function ( event, action ) {
	var commentId = jQuery( event.target ).data( 'id' ),
		cancel = this.get( '#cancel-comment-' + action + '-link' ),
		respond = this.get( '#respond' ),
		comment = this.get( '#div-comment-' + commentId );

	if ( action === 'edit' ) {
		comment.hide();
	}

	this.showCommentTitle( action );

	respond.data( { 'comment-id': commentId, action: action } )
		.insertBefore( comment.next() );

	this.get( '#comment' ).focus();

	cancel.show()
		.click(function () {
			rocketComments.cancelForm.call( this, comment );
		});
};

/**
 * Hide comment form titles except for the one related to our context
 *
 * @param {string} action - Either 'edit' or 'reply' based on the click
 */
rocketComments.showCommentTitle = function ( action ) {
	this.get( '.comment-reply-title' ).hide();
	this.get( '.title-' + action ).show();
};

/**
 * Return the detached comment form to where it originally started
 * using the placeholder div.
 */
rocketComments.resetForm = function () {
	var respond = this.get( '#respond' );

	rocketComments.get( '#wp-comment-content' ).append( respond );

	this.get( '#comment' ).val( '' );
	this.showCommentTitle( 'reply' );

	respond.removeData( [ 'action', 'comment-id' ] );

	return true;
};

/**
 * React to the cancel click by restoring the comment and resetting
 * the form.
 *
 * @param {Object} comment - An optional reference to the comment object being edited
 */
rocketComments.cancelForm = function ( comment ) {
	if ( undefined !== comment ) {
		comment.show();
	}

	jQuery( this ).hide().prop( 'onclick', null );

	rocketComments.resetForm( this );
	rocketComments.get( '.comment-author-not-logged-in' ).hide();
	rocketComments.get( '.comment-author-logged-in' ).show();

	return false;
}

/**
 * Retrieve data from a cache by id, or get and store if it has not yet
 * been retrieved.
 *
 * @param {String} id - The string selector to pass to jQuery
 */
rocketComments.get = function ( id ) {
	if ( undefined === rocketComments.cache[id] ) {
		rocketComments.set( id, jQuery( id ) );
	}

	return rocketComments.cache[id];
};

/**
 * Set cache data by id.
 *
 * @param {String} id - The string selector
 * @param data - A piece of data to associate with the id in the cache
 */
rocketComments.set = function ( id, data ) {
	rocketComments.cache[id] = data;
};
