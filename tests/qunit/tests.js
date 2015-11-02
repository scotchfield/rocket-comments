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
		rocketComments.start,
		'start exists'
	);
	assert.ok(
		rocketComments.shiftPage,
		'shiftPage exists'
	);
	assert.ok(
		rocketComments.startForm,
		'startForm exists'
	);
	assert.ok(
		rocketComments.showCommentTitle,
		'showCommentTitle exists'
	);
	assert.ok(
		rocketComments.resetForm,
		'resetForm exists'
	);
	assert.ok(
		rocketComments.cancelForm,
		'cancelForm exists'
	);
	assert.ok(
		rocketComments.get,
		'get exists'
	);
	assert.ok(
		rocketComments.set,
		'set exists'
	);
});

QUnit.test( 'rocketComment functionality tests', function( assert ) {
	var page = 1,
		rc = { fetchComments: function () {} };

	rocketComments.start();

	assert.ok(
		rocketComments.hasOwnProperty( 'cache' ),
		'rocketComments cache created'
	);

	rc.comment_page = page;
	rocketComments.shiftPage.call( rc, 1 );
	assert.ok(
		rc.comment_page === 2,
		'shiftPage can increase page by one'
	);

	rc.comment_page = page;
	rocketComments.shiftPage.call( rc, -1 );
	assert.ok(
		rc.comment_page === 0,
		'shiftPage can increase page by one'
	);
});

QUnit.test( 'Shotgun testing', function( assert ) {
	assert.ok(
		shotgun( _.bind( rocketComments.start, rocketComments ) ),
		'Shotgun tests for rocketComments.start'
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
