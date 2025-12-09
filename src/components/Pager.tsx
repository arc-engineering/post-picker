import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { NUMBER_POSTS } from '../constants';

const Pager = ( { totalPosts, pagerPosition, setPrevious, setNext }: PagerProps ) => {
    return (
        <div className='post-picker-container--pager'>
            <Button 
                disabled={pagerPosition === 1} 
                onClick={setPrevious}
            >
                {__('<', 'post-picker')}
            </Button>
            <div className='pager-info'>Page {pagerPosition} of {Math.ceil(totalPosts / NUMBER_POSTS)}</div>
            <Button
                disabled={pagerPosition >= Math.ceil(totalPosts / NUMBER_POSTS)}
                onClick={setNext}
            >
                {__('>', 'post-picker')}
            </Button>
        </div>
    );
};

export default Pager;
