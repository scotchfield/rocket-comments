'use strict';

var rocketComments = rocketComments || {}
rocketComments.views = rocketComments.views || {};

/**
 * Creates the view for a single comment.
 *
 * @class
 */
rocketComments.views.Comment = (function () {
	var view = Backbone.View.extend({
		tagName: 'li',

		/**
		 * Set up the template for this comment.
		 */
		initialize: function () {
			this.template = jQuery( '#comment-template' ).length ?
				_.template( jQuery( '#comment-template' ).html() ) :
				undefined;
		},

		/**
		 * Render the comment associated with this class.
		 *
		 * @param className An optional CSS class to add.
		 */
		render: function ( className ) {
			if ( undefined === this.template || undefined == this.model ) {
				return this;
			}

			this.$el.html( this.template( this.model ) )
				.attr( 'id', 'comment-' + this.model.get( 'id' ) )
				.addClass( className )
				.data( 'comment-id', this.model.get( 'id' ) );

			return this;
		}
	});

	return view;
}());
