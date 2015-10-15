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
		'New model creation'
	);

	model.initialize();
	assert.ok( model.get( 'iso_string' ) );
	assert.notOk( model.get( 'edit' ) );
	assert.strictEqual( 'hidden', model.get( 'edit_class' ) );

	model = new rocketComments.models.Comment( { edit: 1 } );
	model.initialize();
	assert.ok( model.get( 'edit' ) );
	assert.notOk( model.get( 'edit_class' ) );

	assert.ok( undefined !== model['url'] );
	assert.ok( model.url().indexOf( '/comments/' ) > -1 );
});

QUnit.test( 'Basic CommentView testing', function( assert ) {
	assert.ok( new rocketComments.views.Comment() );
});

QUnit.test( 'Basic CommentsCollection testing', function( assert ) {
	var collection = new rocketComments.collections.Comments();
	assert.ok( collection );

	assert.ok( collection.url().indexOf( '/comments/' ) > -1 );
	assert.ok( collection.url().indexOf( '&post=' ) === -1 );

	collection.post_id = 1;
	assert.ok( collection.url().indexOf( '/comments/' ) > -1 );
	assert.ok( collection.url().indexOf( '&post=1' ) > -1 );

	assert.ok( collection.commentDepth() );
});

QUnit.test( 'Basic CommentsView testing', function( assert ) {
	assert.ok( new rocketComments.views.Comments() );
});

QUnit.test( 'Shotgun testing', function( assert ) {
	assert.ok( shotgun( _.bind( rocketComments.start, rocketComments ) ) );
	assert.ok( shotgun( _.bind( rocketComments.shiftPage, rocketComments ) ) );

	var model = new rocketComments.models.Comment();
	assert.ok( shotgun( _.bind( model.initialize, model ) ) );
	assert.ok( shotgun( _.bind( model.sync, model ) ) );

	var view = new rocketComments.views.Comment();
	assert.ok( shotgun( _.bind( view.render, view ) ) );
});
