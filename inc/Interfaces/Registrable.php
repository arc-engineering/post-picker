<?php
/**
 * Interface for register
 *
 * @package post-picker
 * @since next
 */

declare(strict_types = 1);

namespace Post\Picker\Inc\Interfaces;

/**
 * Interface Registrable
 *
 * @package post-picker
 * @since next
 */
interface Registrable {

	/**
	 * Registers the class
	 *
	 * @return mixed
	 * @since next
	 */
	public function register();
}
