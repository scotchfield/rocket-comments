QUnit.test( 'Basic CommentView testing', function( assert ) {
	var $el, view;

	assert.ok(
		new rocketComments.views.Comment(),
		'New comment view creation'
	);

	view = new rocketComments.views.Comment();
	view.render();
	assert.notOk(
		view.$el[0].id,
		'CommentView render doesn\'t work with no model and template'
	);

	$el = jQuery( '<div id="comment-template"></div>' );
	view = new rocketComments.views.Comment();
	view.model = new rocketComments.models.Comment();
	view.render();
	assert.ok(
		view.$el[0].id,
		'CommentView render actually renders'
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
