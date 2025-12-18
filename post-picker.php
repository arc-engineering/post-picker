<?php
/**
 * Plugin Name: Post picker 
 * Plugin URI:  https://www.linkedin.com/in/edwil-j-jonas/
 * Description: Post picker for post types
 * Author:      Edwil Jonas
 * 
 * @package     post-picker
 */

declare( strict_types = 1 );

use Post\Picker\Inc\Init;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Only require autoload.php if it has not already been defined.
if ( ! class_exists( Init::class ) ) {
	include_once __DIR__ . '/vendor/autoload.php';
}

// Initialize the plugin.
$init = new Init();
$init->register_services();

/**
 * Load the block definition file
 */
function load_post_picker() {
	register_block_type_from_metadata( __DIR__ );
}

add_action( "init", "load_post_picker" );
