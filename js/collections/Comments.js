'use strict';

var rocketComments = rocketComments || {};
rocketComments.collections = rocketComments.collections || {};

/**
 * Creates a new collection of post comments.
 *
 * @class
 */
rocketComments.collections.Comments = (function () {
	var collection = wp.api.collections.Comments.extend({

		/**
		 * Set up the collection defaults.
		 */
		initialize: function () {
			this.order = jQuery( '.comments-area' ).data( 'comment-order' );
			this.model = rocketComments.models.Comment;
			this.state = {};
		},

		/**
		 * Return the WP-API URL for comments associated with a post.
		 */
		url: function () {
			if ( this.post_id ) {
				return WP_API_Settings.root + '/comments/?orderby=id&order=' +
					this.order + '&post=' + this.post_id;
			}

			return WP_API_Settings.root + '/comments/';
		},

		/**
		 * Traverse up the model tree via the parent attribute to find
		 * a model's depth.
		 *
		 * @param {rocketComments.models.Comment} item The source model.
		 */
		commentDepth: function ( item ) {
			var depth = 1;

			if ( ! _.isObject( item ) || ! ( 'get' in item ) ) {
				return depth;
			}

			while ( item && item.get( 'parent' ) > 0 ) {
				item = this.where({ id: item.get( 'parent' ) })[0];
				depth += 1;
			}

			if ( undefined === this.threaded ) {
				this.threaded = jQuery( 'div#comments' ).data( 'threaded' ) || 1;
			}

			return depth < this.threaded ? depth : this.threaded;
		}
	});

	return collection;
}());
