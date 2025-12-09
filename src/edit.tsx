import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	PanelColorSettings,
	ContrastChecker,
	useBlockProps,
} from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { TextControl, PanelBody, Spinner } from '@wordpress/components';
import PostDisplay from './components/PostDisplay';
import { NUMBER_POSTS } from './constants';
import './styles/editor.scss';
import LinkDisplay from './components/LinkDisplay';
import { createSearchCallback } from './inc/utils';
import Pager from './components/Pager';

const Edit = ({
	attributes,
	setAttributes,
	postId,
	postType,
	recentPosts,
	restBase,
	isSelected,
}: EditProps) => {
	const blockProps = useBlockProps();
	const [posts, setPosts] = useState([]);
	const [filter, setFilter] = useState('');
	const [offSet, setOffSet] = useState(0);
	const [pagerPosition, setPagerPosition] = useState(1);
	const [totalPosts, setTotalPosts] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	const { title, link, linkColor } = attributes;

	/**
	 * Search posts with timeout.
	 * 
	 * Timeout is added to debounce user input.
	 */
	const performSearch = (searchTerm: string, offset: number = 0) => {
		return setTimeout(() => {
			const searchCallback = createSearchCallback(
				postType,
				postId,
				setIsLoading,
				setFilter,
				setPosts,
				setTotalPosts,
				restBase
			);
			searchCallback(searchTerm, offset);
		}, 500);
	};

	/**
	 * Reset filter.
	 */
	useEffect(() => {
		if (!isSelected) {
			setFilter('');
		}
	}, [isSelected]);

	/**
	 * Listen for filter changes and trigger search.
	 */
	useEffect(() => {
		
		// If search term is empty, do nothing.
		if (filter.trim() === '') {
			setPosts([]);
			setTotalPosts(0);
			setOffSet(0);
			setPagerPosition(1);
			return;
		}

		// Reset pagination when search term changes
		setOffSet(0);
		setPagerPosition(1);

		// Perform search.
		const timeoutId = performSearch(filter, 0);

		// Clear timeout if filter changes before timeout completes.
		return () => clearTimeout(timeoutId);
	}, [filter, postType, postId]);

	/**
	 * Set the offset.
	 */
	useEffect(() => {
		const newOffset = (pagerPosition - 1) * NUMBER_POSTS;
		setOffSet(newOffset);		
	}, [pagerPosition]);

	/**
	 * Handle pagination changes (when user clicks pager prev/next)
	 */
	useEffect(() => {
		if (filter.trim() === '') {
			return;
		}

		// Perform search.
		const timeoutId = performSearch(filter, offSet);

		// Clear timeout if filter changes before timeout completes.
		return () => clearTimeout(timeoutId);
	}, [offSet]);

	/**
	 * Update link color
	 */
	const linkColorUpdate = (type: string, color: string) => {
		if (type === 'link') {
			setAttributes({ linkColor: color });
		}
	};

	/**
	 * Handle input change
	 */
	const onInputChange = (value: string) => {
		setFilter(value);
	};

	/**
	 * Set Attributes
	 */
	const onSetAttributes = (link: string, title: string) => {
		setAttributes({ link });
		setAttributes({ title });
	};

	/**
	 * Set Previous
	 */
	const setPrevious = () => {

		const totalPages = Math.ceil(totalPosts / NUMBER_POSTS);

		if ( pagerPosition < 1 ) {
			setPagerPosition(totalPages);
		}

		if ( pagerPosition < totalPosts ) {
			setPagerPosition(pagerPosition - 1);
		}
	};

	/**
	 * Set Next
	 */
	const setNext = () => {

		const totalPages = Math.ceil(totalPosts / NUMBER_POSTS);

		if ( pagerPosition > totalPages ) {
			setPagerPosition(1);
		}

		if ( pagerPosition < totalPages ) {
			setPagerPosition(pagerPosition + 1);
		}
	};

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={__('Settings')}>
					<div className='post-picker-container--input-wrapper'>
						{isLoading && (
							<Spinner className="post-picker-container--loader" />
						)}
						<TextControl
							label={__('Search Posts', 'post-picker')}
							help={__(
								'Add post ID or search by post title to link a post.',
								'post-picker'
							)}
							value={filter}
							onChange={onInputChange}
						/>
					</div>
					{totalPosts > NUMBER_POSTS && (
						<Pager
							totalPosts={totalPosts}
							pagerPosition={pagerPosition}
							setPrevious={setPrevious}
							setNext={setNext}
						/>
					)}
					{recentPosts && filter.length === 0 && (
						<>
							<h4>{__('Recent Posts:', 'post-picker')}</h4>
							<div className="post-picker-container--results">
								{(recentPosts as PostProps[]).map(
									({
										title: postTitle,
										date: postDate,
										link: postLink,
									}: PostProps) => (
										<PostDisplay
											title={postTitle}
											date={postDate}
											link={postLink}
											onClick={onSetAttributes}
											selected={postLink === link}
											key={1} // Make this dynamic and unique
										/>
									)
								)}
							</div>
						</>
					)}
					{posts.length > 0 && filter.length >= 1 && (
						<>
							<h4>{__('Search Results:', 'post-picker')}</h4>
							<div className="post-picker-container--results">
								{posts.map(
									({
										title: postTitle,
										date: postDate,
										link: postLink,
									}: PostProps) => (
										<PostDisplay
											title={postTitle}
											date={postDate}
											link={postLink}
											onClick={onSetAttributes}
											selected={postLink === link}
											key={2} // Make this dynamic and unique
										/>
									)
								)}
							</div>
						</>
					)}
					{posts.length < 1 && filter.length >= 1 && (
						<h4 className='post-picker-container--not-found'>
							{__('No results have been found.', 'post-picker')}
						</h4>
					)}
				</PanelBody>
				<PanelColorSettings
					title={__('Link Styling', 'post-picker')}
					// @ts-ignore
					icon="admin-appearance"
					initialOpen
					disableCustomColors={false}
					colorSettings={[
						{
							value: linkColor,
							onChange: (color) =>
								linkColorUpdate('link', color ?? ''),
							label: __('Link Color', 'post-picker'),
						},
					]}
				>
					<ContrastChecker
						textColor={linkColor}
						backgroundColor="#FFFFFF"
					/>
				</PanelColorSettings>
			</InspectorControls>
			<LinkDisplay link={link} linkColor={linkColor} title={title} />
		</div>
	);
};

/**
 * Apply with select
 */
const applyWithSelect = withSelect((select: any) => {
	const { getCurrentPostType, getCurrentPostId } = select('core/editor');
	const postTypeDetails = select('core').getPostType(getCurrentPostType());
	const recentPosts = select('core').getEntityRecords(
		'postType',
		getCurrentPostType(),
		{ per_page: NUMBER_POSTS, exclude: [getCurrentPostId()] }
	);

	// Set rest_base.
	let restBase = postTypeDetails?.rest_base;

	// Fallback to current post type if rest_base is undefined.
	if ( ! restBase ) {
		restBase = getCurrentPostType();
	}
	
	return {
		postId: getCurrentPostId(),
		postType: getCurrentPostType(),
		restBase,
		recentPosts,
	};
});

export default compose(applyWithSelect)(Edit);
