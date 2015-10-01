QUnit.test( 'CommentModel testing', function( assert ) {
	assert.ok(rocketComments.CommentModel);

	var model = new rocketComments.CommentModel();
	assert.ok(model);
});
QUnit.test( 'CommentView testing', function( assert ) {
	assert.ok(rocketComments.CommentView);

	var view = new rocketComments.CommentView();
	assert.ok(view);
});
