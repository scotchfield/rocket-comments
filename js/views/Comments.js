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

			this.loading = true;
			this.fetchComments();
		},

		updateNavigationLinks: function () {
			if ( this.total_pages > 1 ) {
				jQuery( '.comment-navigation' ).show();

				if ( this.comment_page > 1 ) {
					if ( undefined !== this.$nav_previous_children ) {
						jQuery( '.nav-previous' ).append( this.$nav_previous_children );
						this.$nav_previous_children = undefined;
					}
				} else {
					var $children = jQuery( '.nav-previous' ).children().detach();
					if ( $children.length > 0 ) {
						this.$nav_previous_children = $children;
					}
				}

				if ( this.comment_page < this.total_pages ) {
					jQuery( '.nav-next' ).show();
				} else {
					jQuery( '.nav-next' ).hide();
				}
			}
		},

		render: function () {
			var $ol = this.$el.find( 'ol#comment-root' );
			$ol.empty();

			if ( ! _.isEmpty( this.collection ) ) {
				this.collection.each( function ( item ) {
					var depth = this.collection.commentDepth( item ),
						bypostauthor = '';

					if ( item.get( 'parent' ) > 0 && depth > 1 ) {
						var $parent_ol = jQuery( '#ol-comment-' + item.get( 'parent' ) );
						if ( 0 !== $parent_ol.length ) {
							$ol = $parent_ol;
						}
					}

					if ( item.get( 'author' ) == this.collection.user_id ) {
						bypostauthor = ' bypostauthor';
					}

					var item_view = new rocketComments.views.Comment({ model: item });
					$ol.append( item_view.render( 'comment depth-' + depth + bypostauthor ).el );
				}, this );
				jQuery( '.comments-area .comments-title' ).css( 'display', 'none' );
			}
		},

		submitComment: function ( e ) {
			e.preventDefault();

			var $el = jQuery( e.currentTarget ).closest( 'li' ),
				parent_id = $el.data( 'comment-id' ),
				author_name = jQuery( '.comment-respond input#author' ).val(),
				author_email = jQuery( '.comment-respond input#email' ).val(),
				author_url = jQuery( '.comment-respond input#url' ).val(),
				content = jQuery( '.comment-respond textarea#comment' ).val(),
				action = jQuery( '#respond' ).data( 'action' ),
				attributes, item;

			if ( action == 'edit' ) {
				item = this.collection.get( jQuery( '#respond' ).data( 'comment-id' ) );

				item.set({ content: content, type: '' });

				item.save( {}, {
					success: function( model, response ) {
						if ( null !== response ) {
							rocketComments.commentsView.collection.set( item, { remove: false } );
						}
					},
					error: function( model, response ) {
						console.log( 'Error!' );
						console.log( response );
					}
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
					error: function( model, response ) {
						console.log( 'Error!' );
						console.log( response );
					}
				} );
			}

			jQuery( '#cancel-comment-reply-link' ).trigger( 'click' );
			jQuery( '#respond textarea#comment' ).val( '' );

			this.render();
		},

		fetchComments: function () {
			var data = {};

			if ( this.loading ) {
				this.loading = false;
				jQuery( 'div#wp-loading' ).fadeOut( 100, function () {
					jQuery( '#wp-comment-content' ).fadeIn( 100 );
				});
			}

			if ( this.page_comments > 0 ) {
				data = {
					page: this.comment_page,
					per_page: this.comments_per_page,
				};
			}

			this.collection.fetch({
				data: data,
				success: _.bind( function ( collection, response, options ) {
					this.total_comments = options.xhr.getResponseHeader( 'X-WP-Total' );
					this.total_pages = options.xhr.getResponseHeader( 'X-WP-TotalPages' );

					if ( this.total_comments == 1 ) {
						jQuery( '.comments-area #comment-single' ).fadeIn();
					} else {
						jQuery( 'span#comment-count' ).html( this.total_comments );
						jQuery( '.comments-area #comment-multiple' ).fadeIn();
					}

					this.updateNavigationLinks();
				}, this ),
				error: function () {
					console.log( 'Error: Could not update collection!' );
				}
			});

			this.timeout = setTimeout( this.fetchComments.bind( this ), 10000 );
		},

	});

	return view;
}());
