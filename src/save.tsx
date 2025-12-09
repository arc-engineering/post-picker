import { RichText, useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const Save = ({ attributes }: SaveProps) => {
	const blockProps = useBlockProps.save();
	const { link, title, linkColor } = attributes;
	return (
		<div {...blockProps}>
			{link && (
				<p className="dmg-read-more">
					{__('Read More: ', 'post-picker')}
					<RichText.Content
						className="link"
						tagName="a"
						href={link}
						value={title}
						style={{ color: linkColor }}
					/>
				</p>
			)}
		</div>
	);
};

export default Save;
