'use strict';

var rocketComments = rocketComments || {};
rocketComments.views = rocketComments.views || {};

rocketComments.views.Comments = (function () {
	var view = Backbone.View.extend({
		el: '.comments-area',

		events: {
			'click .comment-respond .submit': 'submitComment'
		},

		initialize: function () {
			var data = {};

			this.collection = new rocketComments.collections.Comments();

			/*this.collection.on('all', function(eventName) {
				console.log(eventName + ' was triggered!');
			});*/
			this.listenTo( this.collection, 'add', this.render );
			this.collection.post_id = this.$el.data( 'post-id' );
			this.collection.user_id = this.$el.data( 'user-id' );
			this.collection.user_name = this.$el.data( 'user-name' );
			this.collection.user_avatar = this.$el.data( 'user-avatar' );

			this.page_comments = this.$el.data( 'page-comments' );
			this.comment_page = this.$el.data( 'comment-page' );
			this.comments_per_page = this.$el.data( 'comments-per-page' );

			this.fetch_time = parseInt( this.$el.data( 'fetch-time' ) ) * 1000;

			this.loading = true;
			this.fetchComments();
		},

		updateNavigationLinks: function () {
			if ( this.total_pages > 1 ) {
				var nav = jQuery( '.comment-navigation' );

				nav.show();

				if ( this.comment_page > 1 ) {
					if ( undefined !== this.$nav_previous_children ) {
						nav.find( '.nav-previous' )
							.append( this.$nav_previous_children );
						this.$nav_previous_children = undefined;
					}
				} else {
					var $children = nav.find( '.nav-previous' )
						.children().detach();

					if ( $children.length > 0 ) {
						this.$nav_previous_children = $children;
					}
				}

				if ( this.comment_page < this.total_pages ) {
					jQuery( '.nav-next' ).show();
				} else {
					jQuery( '.nav-next' ).hide();
				}

				return true;
			}

			return false;
		},

		render: function () {
			var $ol = this.$el.find( 'ol#comment-root' );
			$ol.empty();

			if ( ! _.isEmpty( this.collection ) ) {
				this.collection.each( function ( item ) {
					var depth = this.collection.commentDepth( item ),
						bypostauthor = '';

					if ( item.get( 'parent' ) > 0 && depth > 1 ) {
						var $parent_ol = jQuery( '#ol-comment-' +
							item.get( 'parent' ) );

						if ( 0 !== $parent_ol.length ) {
							$ol = $parent_ol;
						}
					}

					if ( item.get( 'author' ) == this.collection.user_id ) {
						bypostauthor = ' bypostauthor';
					}

					var item_view = new rocketComments.views.Comment(
						{ model: item }
					);
					$ol.append( item_view.render(
						'comment depth-' + depth + bypostauthor
					).el );
				}, this );
				jQuery( '.comments-area .comments-title' )
					.css( 'display', 'none' );
			}
		},

		submitComment: function ( e ) {
			e.preventDefault();

			var $el = jQuery( e.currentTarget ).closest( 'li' ),
				parent_id = $el.data( 'comment-id' ),
				respond = jQuery( '.comment-respond' ),
				author_name = respond.find( 'input#author' ).val(),
				author_email = respond.find( 'input#email' ).val(),
				author_url = respond.find( 'input#url' ).val(),
				content = respond.find( 'textarea#comment' ).val(),
				action = respond.data( 'action' ),
				attributes, item;

			if ( action == 'edit' ) {
				item = this.collection.get( jQuery( '#respond' )
					.data( 'comment-id' ) );

				item.set({ content: content, type: '' });

				item.save( {}, {
					success: function( model, response ) {
						if ( null !== response ) {
							rocketComments.commentsView.collection.set(
								item,
								{ remove: false }
							);
						}
					},
					error: rocketComments.commentsView.handleError
				} );
			} else {
				attributes = {
					id: null,
					author: this.collection.user_id,
					author_email: author_email,
					author_name: author_name,
					author_url: author_url,
					content: content,
					parent: parent_id,
					post: this.collection.post_id,
				};

				item = new rocketComments.models.Comment( attributes );

				item.save( {}, {
					success: function( model, response ) {
						if ( null !== response ) {
							rocketComments.commentsView.collection.add( item );
						}
					},
					error: rocketComments.commentsView.handleError
				} );
			}

			jQuery( '#cancel-comment-reply-link' ).trigger( 'click' );
			respond.find( 'textarea#comment' ).val( '' );

			this.render();
		},

		showNotify: function ( message, time ) {
			var notify = jQuery( '#comment-notify' );

			notify.text( message ).fadeIn();

			if ( undefined !== time ) {
				setTimeout( rocketComments.commentsView.fadeNotify, time );
			};
		},

		fadeNotify: function () {
			jQuery( '#comment-notify' ).fadeOut();
		},

		handleError: function( model, response ) {
			var responseText = jQuery.parseJSON( response.responseText );

			rocketComments.commentsView.showNotify(
				responseText[0].message,
				5000
			);
		},

		fetchComments: function () {
			var data = {
				page: this.comment_page,
				per_page: this.comments_per_page,
			};

			if ( this.loading ) {
				this.loading = false;
				jQuery( 'div#wp-loading' ).fadeOut( 100, function () {
					jQuery( '#wp-comment-content' ).fadeIn( 100 );
				});
			}

			this.collection.fetch({
				data: data,
				success: _.bind( function ( collection, response, options ) {
					this.total_comments = parseInt(
						options.xhr.getResponseHeader( 'X-WP-Total' ) );
					this.total_pages = parseInt(
						options.xhr.getResponseHeader( 'X-WP-TotalPages' ) );

					if ( this.total_comments == 1 ) {
						jQuery( '.comments-area #comment-single' )
							.fadeIn();
					} else {
						jQuery( 'span#comment-count' )
							.html( this.total_comments );
						jQuery( '.comments-area #comment-multiple' )
							.fadeIn();
					}

					this.updateNavigationLinks();
				}, this ),
				error: function () {
					console.log( 'Error: Could not update collection!' );
				}
			});

			this.timeout = setTimeout(
				this.fetchComments.bind( this ),
				this.fetch_time
			);
		},

	});

	return view;
}());
