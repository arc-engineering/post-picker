<?php
/**
 * Class PostPicked
 *
 * Handles the meta for the selected post in post picker block.
 *
 * @package post-picker
 */

declare( strict_types = 1 );

namespace Post\Picker\Inc\Services\Meta;

use Post\Picker\Inc\Interfaces\Registrable;

/**
 * Post picked meta for post picker.
 */
class PostPicked implements Registrable {

	/**
	 * Register filters required.
	 *
	 * @since next
	 */
	final public function register(): void {
		add_action( 'init', [ $this, 'add_post_picker_meta' ] );
	}

	/**
	 * Create post picked meta.
	 */
	public function add_post_picker_meta() {
		register_meta(
			'post',
			'custom_post_picked',
			[
				'type'         => 'string',
				'single'       => true,
				'default'      => 'default',
				'show_in_rest' => true,
			]
		);
	}
}
