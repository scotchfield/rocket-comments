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
