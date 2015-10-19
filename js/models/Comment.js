'use strict';

var rocketComments = rocketComments || {};
rocketComments.models = rocketComments.models || {};

/**
 * Creates a new single comment model.
 *
 * @class
 */
rocketComments.models.Comment = (function () {
	var model = Backbone.Model.extend({
		children: [],
		idAttribute: 'id',
		defaults: {
			id: null,
			author: null,
			author_avatar_urls: {
				'24': '',
				'48': '',
				'56': '',
				'96': ''
			},
			author_email: '',
			author_ip: '',
			author_name: '',
			author_url: '',
			author_user_agent: '',
			content: {},
			date: new Date(),
			date_gmt: new Date(),
			karma: 0,
			link: '',
			parent: 0,
			post: null,
			type: '',
			_links: {}
		},

		/**
		 * Set nonce header before every Backbone sync
		 * Borrowed from wp-api.js
		 *
		 * @param {string} method
		 * @param {Backbone.Model} model
		 * @param {{beforeSend}, *} options
		 * @returns {*}
		 */
		sync: function( method, model, options ) {
			options = options || {};

			if ( 'undefined' !== typeof WP_API_Settings.nonce ) {
				var beforeSend = options.beforeSend;

				options.beforeSend = function( xhr ) {
					xhr.setRequestHeader(
						'X-WP-Nonce',
						WP_API_Settings.nonce
					);

					if ( beforeSend ) {
						return beforeSend.apply( this, arguments );
					}
				};
			}

			if ( ! model ||
					typeof model !== 'object' ||
					! ( 'url' in model ) ) {
				return;
			}

			return Backbone.sync( method, model, options );
		},

		/**
		 * Return the WP-API URL for this comment.
		 */
		url: function() {
			var id = this.get( 'id' );
			id = id || '';

			return WP_API_Settings.root + '/comments/' + id;
		},

		/**
		 * Set up any additional attributes for the model.
		 */
		initialize: function () {
			var date = new Date( this.get( 'date' ) );

			this.set({ iso_string: date.toISOString() });
		}

	});

	return model;
}());
