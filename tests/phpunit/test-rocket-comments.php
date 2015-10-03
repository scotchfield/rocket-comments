<?php

class Test_RocketComments extends WP_UnitTestCase {

	public function setUp() {
		parent::setUp();

		$this->class = new RocketComments();
	}

	public function tearDown() {
		unset( $this->class );

		parent::tearDown();
	}

	/**
	 * @covers RocketComments::__construct
	 */
	public function test_new() {
		$this->assertNotNull( new RocketComments() );
	}

	/**
	 * @covers RocketComments::comments_template
	 */
	public function test_comments_template() {
		$this->assertNotEmpty( $this->class->comments_template( dirname( __FILE__ ) . '../../templates/comments.php' ) );
	}

	/**
	 * @covers RocketComments::filter_rest_url
	 */
	public function test_filter_rest_url() {
		$this->assertNotFalse( strpos( 'wp/v2', $this->class->filter_rest_url( '' ) ) );
	}

	/**
	 * @covers RocketComments::avatar_sizes
	 */
	public function test_avatar_sizes() {
		$this->assertTrue( in_array( 56, $this->class->avatar_sizes( array() ) ) );
	}

	/**
	 * @covers RocketComments::pre_insert_comment
	 */
	public function test_pre_insert_comment_not_logged_in_empty_comment() {
		$this->assertEmpty( $this->class->pre_insert_comment( array(), array() ) );
	}

	/**
	 * @covers RocketComments::pre_insert_comment
	 */
	public function test_pre_insert_comment_logged_in_empty_comment() {
		$user = new WP_User( $this->factory->user->create() );
		$old_user_id = get_current_user_id();
		wp_set_current_user( $user->ID );

		$this->assertFalse( $this->class->pre_insert_comment( array(), array() ) );

		wp_set_current_user( $old_user_id );
	}

	/**
	 * @covers RocketComments::pre_insert_comment
	 */
	public function test_pre_insert_comment_logged_in_comment() {
		$author = 'test_author';
		$author_email = 'test_email';
		$author_url = 'test_url';

		$user = new WP_User( $this->factory->user->create( array(
			'display_name' => $author,
			'user_email' => $author_email,
			'user_url' => $author_url
		) ) );
		$old_user_id = get_current_user_id();
		wp_set_current_user( $user->ID );

		$result = $this->class->pre_insert_comment( array( 'user_id' => $user->ID ), array() );

		$this->assertEquals( $result['comment_author'], $author );

		wp_set_current_user( $old_user_id );
	}

}
