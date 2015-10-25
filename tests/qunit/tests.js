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

	var view = new rocketComments.views.Comments();
	assert.ok(
		shotgun( _.bind( view.submitComment, view ) ),
		'Shotgun tests for Comments view submitComment'
	);

	assert.ok(
		shotgun( _.bind( view.showNotify, view ) ),
		'Shotgun tests for Comments view showNotify'
	);

	assert.ok(
		shotgun( _.bind( view.handleError, view ) ),
		'Shotgun tests for Comments view handleError'
	);

	var collection = new rocketComments.collections.Comments();
	assert.ok(
		shotgun( _.bind( collection.commentDepth, collection ) ),
		'Shotgun tests for Comments collection commentDepth'
	);
});
