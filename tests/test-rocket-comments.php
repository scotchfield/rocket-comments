<?php

class Test_RocketComments extends WP_UnitTestCase {

	/**
	 * @covers RocketComments::__construct
	 */
	public function test_new() {
		$this->assertNotNull( new RocketComments() );
	}

}
