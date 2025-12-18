import { registerBlockType } from '@wordpress/blocks';

/**
 * Global styles
 */
import './styles/style.scss';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from '../block.json';

/**
 * Register block type definition.
 */
registerBlockType(metadata.name, {
	...metadata,
	edit,
} as any);
