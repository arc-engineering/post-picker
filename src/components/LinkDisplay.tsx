import { RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const LinkDisplay = ( { link = '', title = '', linkColor = '' }: LinkProps ) => {
	return (
		<p>
			{ link ? (
				<>
					{ __('Read More: ', 'post-picker') }
					<RichText.Content
						tagName="a"
						href={ '#' }
						value={ title }
						style={ { color: linkColor, display: 'inline-block' } }
					/>
				</>
			) : (
				<div className='none'>
					{ __('Select a post from the Post Picker sidebar.', 'post-picker') }
				</div>
			) }
		</p>
	);
};

export default LinkDisplay;
