function showStarred(options) {
	const {
		username, page
	} = options;
	const response = request(`/users/${username}/starred?page=${page}`);
	const items = (response.data || []).map((star) => formatStar(star));
	if (hasMore(response)) {
		items.push(nextPage('showStarred', options));
	}
	return items;
}


function formatStar(star) {
	return {
		title: star.full_name,
		subtitle: star.description || '',
		url: star.html_url,
		icon: ICONS.REPOSITORY,
		badge: `${star.stargazers_count} Stars`,
		action: 'showRepository',
		actionReturnsItems: true,
		actionArgument: {
			repo: star.full_name
		}
	};
}