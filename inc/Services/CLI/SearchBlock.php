<?php
/**
 * Class SearchBlock
 *
 * Handles CLI commands for searching a specific block in post content.
 *
 * @package post-picker
 * @since next
 */

declare( strict_types = 1 );

namespace Post\Picker\Inc\Services\CLI;

use Post\Picker\Inc\Interfaces\Registrable;
use WP_Query;
use WP_CLI;

/**
 * Class SearchBlock
 */
class SearchBlock implements Registrable {

	/**
	 * Register the command.
	 *
	 * @return void
	 */
	public function register() {
		if ( ! defined( 'WP_CLI' ) ) {
			return;
		}
		WP_CLI::add_command( 'dmg-read-more search', [ $this, 'search' ] );
	}

	/**
	 * Search for posts containing the specified Gutenberg block within a date range.
	 *
	 * ## OPTIONS
	 * 
	 * [--block-name=<block-name>]
	 * : The block name to search.
	 * 
	 * [--batch-size=<batch-size>]
	 * : The batch size.
	 * 
	 * [--post-type=<post-type>]
	 * : The post type to search in.
	 *
	 * [--date-after=<date-after>]
	 * : The start date for the date range (YYYY-MM-DD).
	 *
	 * [--date-before=<date-before>]
	 * : The end date for the date range (YYYY-MM-DD).
	 *
	 * @when after_wp_load
	 */
	public function search( $args, $assocArgs ) {

		$found         = false;
		$success_total = 0;

		// Batch size (Default: -1 for all - make sure to handle large datasets carefully).
		$batch_size = isset( $assocArgs['batch-size'] ) ? trim ( $assocArgs['batch-size'] ) : -1;

		if ( ! is_numeric( $batch_size ) || ( (int) $batch_size <= 0 && (int) $batch_size !== -1 ) ) {
			WP_CLI::error( 'Please provide a valid batch size using the --batch-size=number.' );
			return;
		}

		// The block name to search for.
		$block_name = isset( $assocArgs['block-name'] ) ? trim ( $assocArgs['block-name'] ) : '';

		// Validate block name.
		if ( $block_name === '' ) {
			WP_CLI::error( 'Please provide a block name using the --block-name=parameter.' );
			return;
		}

		// The post type to search.
		$post_type = isset( $assocArgs['post-type'] ) ? trim ( $assocArgs['post-type'] ) : 'post';

		// Validate post type.
		if ( $post_type === '' ) {
			WP_CLI::error( 'Please provide a post type --post-type=post.' );
			return;
		}

		// Date after.
		$dateAfter = isset( $assocArgs['date-after'] ) ? $assocArgs['date-after'] : date( 'Y-m-d', strtotime( '-30 days' ) );

		// Date before.
		$dateBefore = isset( $assocArgs['date-before'] ) ? $assocArgs['date-before'] : date( 'Y-m-d');

		// Confirm date format.
		if ( ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $dateAfter ) || ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $dateBefore ) ) {
			WP_CLI::error( 'Please provide dates in YYYY-MM-DD format for --date-after and --date-before.' );
			return;
		}

		// Query args.
		$queryArgs = [
			'date_query' => [
				'after'     => $dateAfter,
				'before'    => $dateBefore,
				'inclusive' => true,
			],
			'orderby'        => 'date',
			'order'          => 'DESC',
			'post_type'      => $post_type,
			'posts_per_page' => (int) $batch_size,
		];

		// Query posts.
		$query = new WP_Query( $queryArgs );

		// Check if posts exist.
		if ( $query->have_posts() ) {

			// Loop through posts.
			while ( $query->have_posts() ) {

				// Set up post data.
				$query->the_post();

				$post_id = get_the_ID();

				// Find the read more / post picker block in the content.
				$block_found = has_block( $block_name, $post_id );

				// If block found in post content.
				if ( $block_found ) {

					WP_CLI::success( sprintf( 'Block "%s" found in post %d.', $block_name, $post_id ) );
					$found = true;
					$success_total++;
				}
			}

			// Reset post data.
			wp_reset_postdata();

			// If no posts were found with the block name.
			if ( ! $found ) {
				WP_CLI::error( sprintf( 'Block %s was not found".', $block_name ) );
			}

			// Log total success count.
			if ( $success_total > 0 ) {
				$plural = ( $success_total === 1 ) ? '' : 's';
				WP_CLI::log( sprintf( 'Found %d post%s with block "%s".', $success_total, $plural, $block_name ) );
			}
		} else {
			WP_CLI::warning( 'No posts found.' );
		}
	}
}
