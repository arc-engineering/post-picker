<?php
/**
 * Render post picker block.
 *
 * @var array $attributes Attributes of the block.
 * @var string $content Inner content of the block.
 * @var WP_Block $block Block instance.
 *
 * @package post-picker
 */

declare(strict_types = 1);

// Return is accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Get attributes.
$link       = ! empty( $attributes['link'] ) ? $attributes['link'] : '#';
$link_color = ! empty( $attributes['linkColor'] ) ? $attributes['linkColor'] : '#007cba';
$title      = ! empty( $attributes['title'] ) ? $attributes['title'] : '';

?>
<div class="dmg-read-more-block">
    <?php 
        printf('Read More: <a href="%1$s" style="color: %2$s;">%3$s</a>',
            esc_url( $link ),
            esc_attr( $link_color ),
            esc_html( $title )
        );
    ?>
</div>