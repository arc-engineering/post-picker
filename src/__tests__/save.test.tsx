import { render, screen } from '@testing-library/react';

import Save from '../save';

jest.mock('@wordpress/block-editor', () => ({
	useBlockProps: {
		save: jest.fn(),
	},
	RichText: {
		Content: ({ className, tagName: Tag, href, value, style }: any) => (
			<Tag className={className} href={href} style={style}>
				{value}
			</Tag>
		),
	},
}));

describe('Save component', () => {
	it('should render without errors', () => {
		render(
			<Save
				attributes={{
					title: 'Post Title',
					link: 'http://www.url.com',
					linkColor: '#000000',
				}}
			/>
		);
		expect(screen.getByText(/Post Title/)).toBeTruthy();
	});
});
