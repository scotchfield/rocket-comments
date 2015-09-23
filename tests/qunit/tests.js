QUnit.test( 'CommentModel testing', function( assert ) {
	assert.ok(CommentModel);

	var model = new CommentModel();
	assert.ok(model);
});
QUnit.test( 'CommentView testing', function( assert ) {
	assert.ok(CommentView);

	var view = new CommentView();
	assert.ok(view);
});
