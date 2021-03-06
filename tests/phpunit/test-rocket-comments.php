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
	 * @covers RocketComments::init
	 */
	public function test_init_false_on_nojs() {
		$_GET['rocket-nojs'] = true;

		$this->assertFalse( $this->class->init() );

		unset( $_GET['rocket-nojs'] );
	}

	/**
	 * @covers RocketComments::init
	 */
	public function test_init_true() {
		$this->assertTrue( $this->class->init() );
	}

	/**
	 * @covers RocketComments::plugin_deactivate_notice
	 */
	public function test_plugin_deactivate_notice() {
		$_GET['activate'] = true;

		ob_start();
		$this->class->plugin_deactivate_notice();
		$result = ob_get_clean();

		$this->assertNotEmpty( $result );
		$this->assertFalse( isset( $_GET['activate'] ) );
	}

	/**
	 * @covers RocketComments::enqueue_scripts
	 */
	public function test_enqueue_scripts() {
		$this->class->enqueue_scripts();

		$this->assertTrue( wp_script_is( 'rocket-comments-script' ) );
	}

	/**
	 * @covers RocketComments::enqueue_styles
	 */
	public function test_enqueue_styles() {
		$this->class->enqueue_styles();

		$this->assertTrue( wp_style_is( 'rocket-comments-style' ) );
	}

	/**
	 * @covers RocketComments::my_admin_init
	 */
	public function test_my_admin_init() {
		$this->class->my_admin_init();

		$this->assertTrue( has_filter( 'sanitize_option_rocket-comments-commentstyle' ) );
		$this->assertTrue( has_filter( 'sanitize_option_rocket-comments-fetch-time' ) );
	}

	/**
	 * @covers RocketComments::comment_style_callback
	 */
	public function test_comment_style_callback() {
		ob_start();
		$this->class->comment_style_callback();
		$result = ob_get_clean();

		$this->assertNotEmpty( $result );
	}

	/**
	 * @covers RocketComments::comment_style_radio_callback
	 */
	public function test_comment_style_radio_callback() {
		ob_start();
		$this->class->comment_style_radio_callback();
		$result = ob_get_clean();

		$comment_style_list = $this->class->get_comment_style_list();

		foreach ( $comment_style_list as $style_id => $style_data ) {
			$this->assertContains( $style_id, $result );
			$this->assertContains( $style_data['description'], $result );
		}
	}

	/**
	 * @covers RocketComments::fetch_time
	 */
	public function test_fetch_time() {
		$result = $this->class->fetch_time();

		$this->assertInternalType( 'int', $result );
		$this->assertGreaterThanOrEqual( 0, $result );
	}

	/**
	 * @covers RocketComments::fetch_time_callback
	 */
	public function test_fetch_time_callback() {
		ob_start();
		$this->class->fetch_time_callback();
		$result = ob_get_clean();

		$this->assertNotEmpty( $result );
	}

	/**
	 * @covers RocketComments::fetch_time_checkbox_callback
	 */
	public function test_fetch_time_checkbox_callback() {
		ob_start();
		$this->class->fetch_time_checkbox_callback();
		$result = ob_get_clean();

		$this->assertContains( 'rocket-comments-fetch-time', $result );
	}

	/**
	 * @covers RocketComments::use_wp_die_handler
	 */
	public function test_use_wp_die_handler() {
		$this->assertInternalType( 'bool', $this->class->use_wp_die_handler() );
	}

	/**
	 * @covers RocketComments::wp_die_handler_callback
	 */
	public function test_wp_die_handler_callback() {
		ob_start();
		$this->class->wp_die_handler_callback();
		$result = ob_get_clean();

		$this->assertNotEmpty( $result );
	}

	/**
	 * @covers RocketComments::wp_die_handler_checkbox_callback
	 */
	public function test_wp_die_handler_checkbox_callback() {
		ob_start();
		$this->class->wp_die_handler_checkbox_callback();
		$result = ob_get_clean();

		$this->assertContains( 'rocket-comments-wp-die-handler', $result );
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
	 * @covers RocketComments::get_comment_style_list
	 */
	public function test_get_comment_style_list_default() {
		$comment_style_list = $this->class->get_comment_style_list();

		$this->assertTrue( isset( $comment_style_list['default'] ) );
	}

	public function filter_comment_style_list( $comment_style_list ) {
		$comment_style_list['test_key'] = array();

		return $comment_style_list;
	}

	/**
	 * @covers RocketComments::get_comment_style_list
	 */
	public function test_get_comment_style_list_filter() {
		$test_key = 'test_key';

		$comment_style_list = $this->class->get_comment_style_list();
		$this->assertFalse( isset( $comment_style_list[$test_key] ) );

		add_filter( 'rocket-comments-commentstyle', array( $this, 'filter_comment_style_list' ) );

		$comment_style_list = $this->class->get_comment_style_list();
		$this->assertTrue( isset( $comment_style_list[$test_key] ) );

		remove_filter( 'rocket-comments-commentstyle', array( $this, 'filter_comment_style_list' ) );
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

	/**
	 * @covers RocketComments::get_comment_time
	 */
	public function test_get_comment_time_empty() {
		$this->assertEmpty( $this->class->get_comment_time( array() ) );
	}

	/**
	 * @covers RocketComments::get_comment_time
	 */
	public function test_get_comment_time() {
		$post_id = $this->factory->post->create();
		$comment = $this->factory->comment->create_and_get(
			array( 'comment_post_ID' => $post_id )
		);

		$this->assertNotEmpty( $this->class->get_comment_time( $comment ) );
	}

	/**
	 * @covers RocketComments::rest_prepare_comment
	 */
	public function test_rest_prepare_comment_empty() {
		$this->assertEmpty( $this->class->rest_prepare_comment(
			array(), array(), array() )
		);
	}

	/**
	 * @covers RocketComments::rest_prepare_comment
	 */
	public function test_rest_prepare_comment_data_as_array() {
		$post_id = $this->factory->post->create();
		$comment = $this->factory->comment->create_and_get(
			array( 'comment_post_ID' => $post_id )
		);

		$data = array();

		$this->assertEquals(
			$data,
			$this->class->rest_prepare_comment( $data, $comment, array() )
		);
	}

	/**
	 * @covers RocketComments::rest_prepare_comment
	 */
	public function test_rest_prepare_comment_can_edit() {
		$user = new WP_User( $this->factory->user->create( array( 'role' => 'administrator' ) ) );
		$old_user_id = get_current_user_id();
		wp_set_current_user( $user->ID );

		$post_id = $this->factory->post->create();
		$comment = $this->factory->comment->create_and_get(
			array( 'comment_post_ID' => $post_id )
		);

		$data = new stdClass();
		$data->data = array();

		$result = $this->class->rest_prepare_comment( $data, $comment, array() );

		$this->assertEquals( $result->data['edit'], 1 );
		$this->assertTrue( isset( $result->data['comment_date'] ) );
		$this->assertTrue( isset( $result->data['comment_time'] ) );

		wp_set_current_user( $old_user_id );
	}

	/**
	 * @covers RocketComments::get_comment_options
	 */
	public function test_get_comment_options_basic() {
		$result = $this->class->get_comment_options();

		$this->assertTrue( isset( $result[ 'current_user' ] ) );
		$this->assertTrue( isset( $result[ 'data' ] ) );
		$this->assertTrue( isset( $result[ 'require_name_email' ] ) );
		$this->assertTrue( isset( $result[ 'redirect_no_js_url' ] ) );
	}

	/**
	 * @covers RocketComments::comment_style_validate
	 */
	public function test_comment_style_validate_valid() {
		$values = array_keys( $this->class->get_comment_style_list() );

		foreach ( $values as $value ) {
			$this->assertEquals( $value, $this->class->comment_style_validate( $value ) );
		}
	}

	/**
	 * @covers RocketComments::comment_style_validate
	 */
	public function test_comment_style_validate_invalid() {
		$values = array( false, null, '', 'test' );

		foreach ( $values as $value ) {
			$this->assertEquals( 'default', $this->class->comment_style_validate( $value ) );
		}
	}

	/**
	 * @covers RocketComments::fetch_time_validate
	 */
	public function test_fetch_time_validate_valid() {
		$values = array( 0, 1, 2, 1000, 10000000, time() );

		foreach ( $values as $value ) {
			$this->assertEquals( $value, $this->class->fetch_time_validate( $value ) );
		}
	}

	/**
	 * @covers RocketComments::fetch_time_validate
	 */
	public function test_fetch_time_validate_invalid() {
		$values = array( false, null, 'test', -1, -time() );

		foreach ( $values as $value ) {
			$this->assertEquals( 0, $this->class->fetch_time_validate( $value ) );
		}
	}

	/**
	 * @covers RocketComments::wp_die_handler_validate
	 */
	public function test_wp_die_handler_validate_valid() {
		$values = array( 'on', '' );

		foreach ( $values as $value ) {
			$this->assertEquals( $value, $this->class->wp_die_handler_validate( $value ) );
		}
	}

	/**
	 * @covers RocketComments::wp_die_handler_validate
	 */
	public function test_wp_die_handler_validate_invalid() {
		$values = array( false, null, 'test', -1, -time() );

		foreach ( $values as $value ) {
			$this->assertEquals( '', $this->class->wp_die_handler_validate( $value ) );
		}
	}

	/**
	 * @covers RocketComments::plugin_settings_page
	 */
	public function test_plugin_settings_page() {
		ob_start();
		$result = $this->class->plugin_settings_page();
		$result = ob_get_clean();

		$this->assertNotEmpty( $result );
	}

}
