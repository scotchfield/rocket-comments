'use strict';

var rocketComments = rocketComments || {};

/**
 * Set up the initial Rocket Comments environment and handlers.
 */
rocketComments.start = function () {
	jQuery( '#wp-loading' ).show();

	if ( undefined === rocketComments.commentsView ) {
		rocketComments.commentsView = new rocketComments.views.Comments();
	}

	// Attach click handlers to the previous and next page elements.
	jQuery( '.comment-navigation .nav-previous a' ).on( 'click', function () {
		rocketComments.shiftPage( -1 );
	} );
	jQuery( '.comment-navigation .nav-next a' ).on( 'click', function () {
		rocketComments.shiftPage( 1 );
	} );

	// Don't use the standard form submit; we'll trigger this using JS.
	jQuery( 'form#commentform' ).submit(function ( e ) {
		e.preventDefault();
	});
};

/**
 * Increase or decrease the current page via navigation bar click events.
 * @param {number} delta - Number of pages to shift, may be negative.
 */
rocketComments.shiftPage = function ( delta ) {
	this.commentsView.comment_page += delta;
	this.commentsView.fetchComments( this.commentsView.collection );
};
