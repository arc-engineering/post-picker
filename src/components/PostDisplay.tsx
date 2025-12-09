import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';

const PostDisplay = ( { title, date, link, onClick, selected }: PostProps ) => {

	const buttonClasses = classNames( {
		'selected': selected,
	} );

	const indicatorClasses = classNames( 'indicator', 'dashicons', {
		'dashicons-plus-alt': ! selected,
		'dashicons-yes-alt': selected,
	} );

	const formatDate = ( dateString: Date ) => {
		const dateUpdated = new Date( dateString );
		return new Intl.DateTimeFormat( 'en-US', {
			year: 'numeric',
			month: 'long',
			day: '2-digit',
		} ).format( dateUpdated );
	};

	return (
		<>
			<Button className={ buttonClasses } onClick={() => onClick?.( link, title?.rendered ) }>
				<div className="info">
					<div className="title">{ title?.rendered }</div>
					<span className="date">{ formatDate( date ) }</span>
				</div>
				<div className={indicatorClasses}></div>
			</Button>
		</>
	);
};

export default PostDisplay;
