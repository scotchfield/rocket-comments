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
			rocketComments.shiftPage.call( rc, -1);
		} );
		jQuery( '.comment-navigation .nav-next a' ).on( 'click', function () {
			rocketComments.shiftPage.call( rc, 1 );
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
rocketComments.shiftPage = function ( delta ) {
	this.comment_page += delta;
	this.fetchComments( this.collection );
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

	this.setupTempForm();
	this.showCommentTitle( action );

	respond.data( 'comment-id', commentId )
		.data( 'action', action )
		.insertBefore( comment.next() );

	this.get( '#comment' ).focus();

	cancel.show()
		.click(function () {
			rocketComments.cancelForm.call( this, comment );
		});
};

/**
 * Create the form placeholder, if it is not already set.
 * The #respond element is detached and reattached near the comment
 * that is either being replied to or edited. This placeholder
 * tells us where to place the form when the action is over.
 *
 * Example: If we first arrive at a page and click on a reply button,
 * we need to create a new temporary form placeholder so we know where
 * to reattach the comment form.
 *
 * Example: If we hit reply in reference to one comment, and then
 * decide to reply to a different comment, we don't want to create
 * another form element.
 */
rocketComments.setupTempForm = function () {
	if ( ! jQuery( '#wp-temp-form-div' ).length ) {
		var div = jQuery(
			'<div id="wp-temp-form-div" style="display: none;"></div>'
		);

		rocketComments.get( '#respond' ).parent().append( div );
	}
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
	var temp = jQuery( '#wp-temp-form-div' ),
		respond = this.get( '#respond' );

	if ( ! temp.length || ! respond.length ) {
		return false;
	}

	temp.parent().append( respond );
	temp.remove();

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
	if ( undefined === rocketComments.cache ) {
		rocketComments.cache = {};
	}

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
	if ( undefined === rocketComments.cache ) {
		rocketComments.cache = {};
	}

	rocketComments.cache[id] = data;
};
