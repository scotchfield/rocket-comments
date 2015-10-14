QUnit.test('Basic rocketComment object tests', function(assert) {
	assert.ok(rocketComments);
	assert.ok(rocketComments.models.Comment);
	assert.ok(rocketComments.views.Comment);
	assert.ok(rocketComments.views.Comments);
	assert.ok(rocketComments.collections.Comments);
});
QUnit.test('Basic addComment object tests', function(assert) {
	assert.ok(addComment);
	assert.ok(addComment.setupForm);
	assert.ok(addComment.resetForm);
	assert.ok(addComment.moveForm);
	assert.ok(addComment.editForm);
});
QUnit.test('Basic CommentModel testing', function(assert) {
	var model = new rocketComments.models.Comment();
	assert.ok(model);

	model.initialize();
	assert.ok(model.get('iso_string'));
	assert.notOk(model.get('edit'));
	assert.strictEqual('hidden', model.get('edit_class'));

	model = new rocketComments.models.Comment({edit: 1});
	model.initialize();
	assert.ok(model.get('edit'));
	assert.notOk(model.get('edit_class'));

	assert.ok('url' in model);
	assert.ok(model.url().indexOf('/comments/') > -1);
});
QUnit.test('Basic CommentView testing', function(assert) {
	assert.ok(new rocketComments.views.Comment());
});
QUnit.test('Basic CommentsCollection testing', function(assert) {
	assert.ok(new rocketComments.collections.Comments());
});
QUnit.test('Basic CommentsView testing', function(assert) {
	assert.ok(new rocketComments.views.Comments());
});
QUnit.test('Shotgun testing', function(assert) {
	assert.ok(shotgun(_.bind(rocketComments.start, rocketComments)));
	assert.ok(shotgun(_.bind(rocketComments.shiftPage, rocketComments)));

	var model = new rocketComments.models.Comment();
	assert.ok(shotgun(_.bind(model.initialize, model)));
	assert.ok(shotgun(_.bind(model.sync, model)));

	var view = new rocketComments.views.Comment();
	assert.ok(shotgun(_.bind(view.render, view)));
});
