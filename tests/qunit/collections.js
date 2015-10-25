QUnit.test( 'Basic CommentsCollection testing', function( assert ) {
	var collection = new rocketComments.collections.Comments();
	assert.ok(
		collection,
		'New comment collection creation'
	);

	assert.ok(
		collection.url().indexOf( '/comments/' ) > -1,
		'Default collection must reference comments'
	);
	assert.ok(
		collection.url().indexOf( '&post=' ) === -1,
		'Default collection must not reference a post'
	);

	collection.post_id = 1;
	assert.ok(
		collection.url().indexOf( '/comments/' ) > -1,
		'Collection URL must reference comments with post id'
	);
	assert.ok(
		collection.url().indexOf( '&post=1' ) > -1,
		'Collection with post id must reference the post in URL'
	);

	assert.ok(
		1 === collection.commentDepth(),
		'Default commentDepth must be 1'
	);
});
