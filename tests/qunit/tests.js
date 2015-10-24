QUnit.test( 'Basic rocketComment object tests', function( assert ) {
	assert.ok(
		rocketComments,
		'rocketComments exists'
	);
	assert.ok(
		rocketComments.models.Comment,
		'Comment model exists'
	);
	assert.ok(
		rocketComments.views.Comment,
		'Comment view exists'
	);
	assert.ok(
		rocketComments.views.Comments,
		'Comments view exists'
	);
	assert.ok(
		rocketComments.collections.Comments,
		'Comments collection exists'
	);
});

QUnit.test( 'Basic addComment object tests', function( assert ) {
	assert.ok(
		addComment,
		'addComment exists'
	);
	assert.ok(
		addComment.setupForm,
		'setupForm exists'
	);
	assert.ok(
		addComment.resetForm,
		'resetForm exists'
	);
	assert.ok(
		addComment.moveForm,
		'moveForm exists'
	);
	assert.ok(
		addComment.editForm,
		'editForm exists'
	);
});

QUnit.test( 'Basic CommentModel testing', function( assert ) {
	var model = new rocketComments.models.Comment();
	assert.ok(
		model,
		'New comment model creation'
	);

	model.initialize();
	assert.ok(
		model.get( 'iso_string' ),
		'Models should have an ISO-formatted string attribute'
	);
	assert.notOk(
		model.get( 'edit' ),
		'Models should not be editable by default'
	);

	model = new rocketComments.models.Comment( { edit: 1 } );
	model.initialize();
	assert.ok(
		model.get( 'edit' ),
		'If edit is 1 when the model is created, edit should be set'
	);

	assert.ok(
		undefined !== model['url'],
		'The url attribute exists'
	);
	assert.ok(
		model.url().indexOf( '/comments/' ) > -1,
		'URL must reference comments'
	);
});

QUnit.test( 'Basic CommentView testing', function( assert ) {
	assert.ok(
		new rocketComments.views.Comment(),
		'New comment view creation'
	);
});

QUnit.test( 'Basic CommentsCollection testing', function( assert ) {
	var collection = new rocketComments.collections.Comments();
	assert.ok(
		collection,
		'New comment collection creation'
	);

	assert.ok(
		collection.url().indexOf( '/comments/' ) > -1,
		'Default collection must reference comments'
	);
	assert.ok(
		collection.url().indexOf( '&post=' ) === -1,
		'Default collection must not reference a post'
	);

	collection.post_id = 1;
	assert.ok(
		collection.url().indexOf( '/comments/' ) > -1,
		'Collection URL must reference comments with post id'
	);
	assert.ok(
		collection.url().indexOf( '&post=1' ) > -1,
		'Collection with post id must reference the post in URL'
	);

	assert.ok(
		1 === collection.commentDepth(),
		'Default commentDepth must be 1'
	);
});

QUnit.test( 'Basic CommentsView testing', function( assert ) {
	var view = new rocketComments.views.Comments();
	assert.ok(
		view,
		'New comments view creation'
	);

	assert.notOk(
		view.updateNavigationLinks(),
		'No navigation menu visible by default'
	);

	view.total_pages = 2;
	assert.ok(
		view.updateNavigationLinks(),
		'Try to show navigation menu with multiple comment pages'
	);

	assert.ok(
		undefined === view.render(),
		'Render completes with no errors'
	);

	assert.notOk(
		view.submitComment(),
		'Get false from submitComment with undefined event'
	);

	assert.ok(
		undefined === view.showNotify(),
		'No errors on showNotify'
	);

	assert.ok(
		undefined === view.fadeNotify(),
		'No errors on fadeNotify'
	);

	assert.notOk(
		view.handleError(),
		'handleError returns false with undefined arguments'
	);

	assert.ok(
		undefined === view.fetchComments(),
		'No errors on fetchComments'
	);
});

QUnit.test( 'Basic addComment testing', function( assert ) {
	assert.notOk(
		addComment.setupForm(),
		'Return false for setupForm with undefined options'
	);
	assert.notOk(
		addComment.resetForm(),
		'Return false for setupForm with undefined options'
	);
	assert.notOk(
		addComment.moveForm(),
		'Return false for setupForm with undefined options'
	);
	assert.notOk(
		addComment.editForm(),
		'Return false for setupForm with undefined options'
	);
});

QUnit.test( 'Shotgun testing', function( assert ) {
	assert.ok(
		shotgun( _.bind( rocketComments.start, rocketComments ) ),
		'Shotgun tests for rocketComments.start'
	);
	assert.ok(
		shotgun( _.bind( rocketComments.shiftPage, rocketComments ) ),
		'Shotgun tests for rocketComments.shiftPage'
	);

	var model = new rocketComments.models.Comment();
	assert.ok(
		shotgun( _.bind( model.initialize, model ) ),
		'Shotgun tests for Comment model initialize'
	);
	assert.ok(
		shotgun( _.bind( model.sync, model ) ),
		'Shotgun tests for Comment model sync'
	);

	var view = new rocketComments.views.Comment();
	assert.ok(
		shotgun( _.bind( view.render, view ) ),
		'Shotgun tests for Comment view render'
	);
});
