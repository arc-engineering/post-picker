type ArticlePost = {
	id: number;
	date: string;
	date_gmt: string;
	modified: string;
	modified_gmt: string;
	title: string;
};

type PostProps = {
	title: {
		rendered: string;
	};
	date: Date;
	link: string;
	onClick?: (link: string, title: string) => void;
	selected?: boolean;
};

type Attributes = {
	title: string;
	link: string;
	linkColor: string;
};

type EditProps = {
	attributes: Attributes;
	setAttributes: (attributes: Partial<Attributes>) => void;
	postId: number;
	postType: string;
	recentPosts: object;
	restBase: string;
	isSelected: any;
};

type SaveProps = {
	attributes: Attributes;
};

type LinkProps = {
	link?: string;
	title?: string;
	linkColor?: string;
};

type PagerProps = {
	totalPosts: number;
	pagerPosition: number;
	setPrevious: () => void;
	setNext: () => void;
};
