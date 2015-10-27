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

	assert.ok(
		rocketComments.setupForm,
		'setupForm exists'
	);
	assert.ok(
		rocketComments.resetForm,
		'resetForm exists'
	);
	assert.ok(
		rocketComments.moveForm,
		'moveForm exists'
	);
	assert.ok(
		rocketComments.editForm,
		'editForm exists'
	);
});

QUnit.test( 'Basic rocketComments form testing', function( assert ) {
	assert.notOk(
		rocketComments.setupForm(),
		'Return false for setupForm with undefined options'
	);
	assert.notOk(
		rocketComments.resetForm(),
		'Return false for setupForm with undefined options'
	);
	assert.notOk(
		rocketComments.moveForm(),
		'Return false for setupForm with undefined options'
	);
	assert.notOk(
		rocketComments.editForm(),
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
