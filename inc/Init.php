<?php
/**
 * This is the init file for the block
 *
 * @package post-picker
 * @since next
 */

declare(strict_types = 1);

namespace Post\Picker\Inc;

use InvalidArgumentException;
use ReflectionException;
use Post\Picker\Inc\Traits\ClassResolver;
use Post\Picker\Inc\Interfaces\Registrable;
use Post\Picker\Inc\Services\CLI\SearchBlock;
use Post\Picker\Inc\Services\Meta\PostPicked;

/**
 * Class Init
 *
 * @package post6-picker
 * @since next
 */
final class Init {

	use ClassResolver;

	/**
	 * This function returns all classes that are to be registered
	 *
	 * @since next
	 *
	 * @return string[]
	 */
	public function get_services(): array {
		$services = [
			PostPicked::class,
			SearchBlock::class,
		];

		return $services;
	}

	/**
	 * This function registers all included classes
	 *
	 * @since next
	 */
	public function register_services(): void {
		foreach ( $this->get_services() as $class ) {
			$service = $this->instantiate( $class );
			$this->register( $service );
		}
	}

	/**
	 * This function unregister all included classes
	 *
	 * @since next
	 */
	public function deactivate(): void {
		foreach ( $this->get_services() as $class ) {
			if ( method_exists( $class, 'unregister' ) ) {
				$class::unregister();
			}
		}
	}

	/**
	 * This function registers registrable class
	 *
	 * @since next
	 *
	 * @param  Registrable $class_instance Class that implements the interface.
	 * @return mixed
	 */
	private function register( Registrable $class_instance ) {
		return $class_instance->register();
	}

	/**
	 * This returns the instance of a class.
	 *
	 * @since next
	 *
	 * @throws ReflectionException If the instantiated object does not implement Registrable.
	 * @throws InvalidArgumentException If the instantiated object does not implement Registrable.
	 * @param class-string $class_name callable class name.
	 * @return Registrable
	 */
	private function instantiate( string $class_name ): Registrable {
		$instance = $this->resolve( $class_name );
		if ( ! ( $instance instanceof Registrable ) ) {
			// Handle the case where the instantiated object does not implement Registrable.
			throw new InvalidArgumentException( sprintf( 'Class %s must implement Registrable interface.', esc_html( $class_name ) ) );
		}

		return $instance;
	}
}
