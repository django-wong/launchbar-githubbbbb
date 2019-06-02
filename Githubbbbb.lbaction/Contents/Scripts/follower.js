function listFollowers(options) {
	const {
		username, page
	} = options;

	const response = request(`/users/${username}/followers?page=${page}`);
	const items = (response.data || []).map((follower) => {
		return {
			title: follower.login,
			url: follower.html_url,
			icon: ICONS.USER,
			actionReturnsItems: true,
			action: 'showUserInfo',
			actionArgument: {
				username: follower.login
			}
		};
	})
	if (hasMore(response)) {
		items.push(nextPage('listFollowers', options));
	}
	return items;
}