import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { NUMBER_POSTS, POST_ENDPOINT } from '../constants';

/**
 * Search callback.
 * 
 * @param postType     The post type.
 * @param postId       The post ID.
 * @param setIsLoading Are we currently loading?
 * @param setFilter    Set the filter/search input.
 * @param setPosts     Set the posts.
 * @returns Return a function that performs the search.
 */
export function createSearchCallback(
	postType: string,
	postId: number,
	setIsLoading: Function,
	setFilter: Function,
	setPosts: Function,
	setTotalPosts: Function,
	restBase: string
) {
	return async ( search: string, offSet: number ) => {
		setIsLoading( true );
		setFilter( search );
		
		// If search is empty, return empty results.
		if ( search.trim() === '' ) {
			setPosts( [] );
			setIsLoading( false );
		}

		// Fetch posts based on search string or ID.
		const result = await fetchPosts(
			postType,
			postId,
			search,
			offSet,
			restBase
		);

		// Update state with fetched posts.
		setPosts( result.posts );
		setTotalPosts( result.total );
		setIsLoading( false );
	};
}

/**
 * Fetch posts by string || ID number.
 * 
 * @param postType The post type to fetch.
 * @param postId   The current post ID to exclude from results.
 * @param search   The search string or ID number.
 * @param offset   The offset for pagination (default: 0).
 * @returns Return an object with posts array and total count.
 */
export async function fetchPosts(
	postType: string,
	postId: number,
	search: string,
	offset: number = 0,
	restBase: string
): Promise<{ posts: ArticlePost[], total: number }> {

	const parseSearch = parseInt( search );
	let queryArgs;

	// Query args for Number/ID search.
	if ( ! isNaN( parseSearch ) ) {
		queryArgs = addQueryArgs(
			`${POST_ENDPOINT}${restBase}/${parseSearch}`
		);
	}

	// Query args for "string" search with pagination support.
	if ( isNaN( parseSearch ) ) {
		queryArgs = addQueryArgs( `${POST_ENDPOINT}${restBase}/`, {
			status: 'publish',
			search: search,
			per_page: NUMBER_POSTS,
			post_type: postType,
			exclude: [postId],
			offset: offset
		});
	}

	// Fetch posts from API.
	try {
		const response = await apiFetch({
			method: 'GET',
			path: queryArgs,
			parse: false, // Get raw response to access headers
		}) as Response;

		// Handle non-OK responses.
		if ( ! response.ok ) {
			throw new Error( `HTTP error! status: ${response.status}` );
		}

		const posts = await response.json() as ArticlePost[];
		const total = parseInt(response.headers.get('X-WP-Total') || '0');

		// If single post is returned, wrap it in an array.
		if ( ! Array.isArray( posts ) ) {
			return { posts: [posts], total: 0 };
		}
		
		return { posts, total };
	} catch (error) {
		/* eslint-disable no-console */
		// console.error('Error fetching posts:', error);
		return { posts: [], total: 0 };
	}
}
