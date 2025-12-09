<?php
/**
 * Trait to resolve class and inject dependencies.
 *
 * @package post-picker
 * @since next
 */

declare(strict_types = 1);

namespace Post\Picker\Inc\Traits;

use ReflectionClass;
use ReflectionException;
use ReflectionNamedType;

/**
 * Class resolver
 *
 * @package post-picker
 * @since next
 */
trait ClassResolver {

	/**
	 * Array of instances that have already been created.
	 *
	 * @var array<string, object>
	 */
	protected array $share_instances = [];

	/**
	 * Resolves a class name to an instantiated object.
	 *
	 * @param class-string $class_name The fully qualified class name to resolve.
	 *
	 * @throws ReflectionException If no default value set on parameter, throw.
	 *
	 * @return object The instantiated object of the class.
	 */
	protected function resolve( string $class_name ): object {
		$reflection_class = new ReflectionClass( $class_name );

		$constructor = $reflection_class->getConstructor();
		if ( $constructor === null ) {
			return $reflection_class->newInstance();
		}

		$params = $constructor->getParameters();
		if ( $params === [] ) {
			return $reflection_class->newInstance();
		}

		$new_instance_params = [];
		foreach ( $params as $param ) {
			$type = $param->getType();
			if ( $type === null ) {
				$new_instance_params[] = $param->getDefaultValue();
				continue;
			}
			if ( ! ( $type instanceof ReflectionNamedType ) ) {
				continue;
			}
			if ( $type->isBuiltin() ) {
				$new_instance_params[] = $param->getDefaultValue();
				continue;
			}

			/**
			 * Class string.
			 *
			 * @var class-string $name
			 */
			$name = $type->getName();
			if ( ! isset( $this->share_instances[ $name ] ) ) {
				$this->share_instances[ $name ] = $this->resolve( $name );
			}
			$new_instance_params[] = $this->share_instances[ $name ];
		}

		return $reflection_class->newInstanceArgs( $new_instance_params );
	}
}
