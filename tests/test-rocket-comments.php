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
		$this->assertNotEmpty( $this->class->comments_template( '' ) );
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
		$this->assertFalse( $this->class->pre_insert_comment( array(), array() ) );
	}

}
