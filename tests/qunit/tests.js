QUnit.test('Basic rocketComment object tests', function(assert) {
	assert.ok(rocketComments);
});
QUnit.test('Basic CommentModel testing', function(assert) {
	assert.ok(rocketComments.CommentModel);
	assert.ok(new rocketComments.CommentModel());
});
QUnit.test('Basic CommentView testing', function(assert) {
	assert.ok(rocketComments.CommentView);
	assert.ok(new rocketComments.CommentView());
});
QUnit.test('Basic CommentsCollection testing', function(assert) {
	assert.ok(rocketComments.CommentsCollection);
	assert.ok(new rocketComments.CommentsCollection());
});
QUnit.test('Basic CommentsView testing', function(assert) {
	assert.ok(rocketComments.CommentsView);
	assert.ok(new rocketComments.CommentsView());
});
