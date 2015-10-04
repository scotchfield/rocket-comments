QUnit.test('Basic rocketComment object tests', function(assert) {
	assert.ok(rocketComments);
	assert.ok(rocketComments.CommentModel);
	assert.ok(rocketComments.CommentView);
	assert.ok(rocketComments.CommentsCollection);
	assert.ok(rocketComments.CommentsView);
});
QUnit.test('Basic CommentModel testing', function(assert) {
	var model = new rocketComments.CommentModel();
	assert.ok(model);

	model.initialize();
	assert.ok(model.get('iso_string'));
	assert.notOk(model.get('edit'));
	assert.strictEqual('hidden', model.get('edit_class'));

	model = new rocketComments.CommentModel({edit: 1});
	model.initialize();
	assert.ok(model.get('edit'));
	assert.notOk(model.get('edit_class'));
});
QUnit.test('Basic CommentView testing', function(assert) {
	assert.ok(new rocketComments.CommentView());
});
QUnit.test('Basic CommentsCollection testing', function(assert) {
	assert.ok(new rocketComments.CommentsCollection());
});
QUnit.test('Basic CommentsView testing', function(assert) {
	assert.ok(new rocketComments.CommentsView());
});
QUnit.test('Shotgun testing', function(assert) {
	var model = new rocketComments.CommentModel();
	assert.ok(shotgun(_.bind(model.initialize, model)))
	assert.ok(shotgun(_.bind(model.sync, model)))

	var view = new rocketComments.CommentView();
	assert.ok(shotgun(_.bind(view.render, view)));
});
