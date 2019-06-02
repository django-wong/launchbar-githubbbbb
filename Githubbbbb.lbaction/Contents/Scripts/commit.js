function showCommitsOfRepo(options) {
	const url = `/repos/${options.repo}/commits?sha&path&author&since&until&page=${options.page}`
	const response = request(url);
	const items = (response.data || []).map((commit) => {
		return formatCommitInfo(commit);
	})
	if (hasMore(response)) {
		items.push(nextPage('showCommitsOfRepo', options));
	}
	return items;
}


function formatCommitInfo(commit) {
	return {
		title: commit.commit.message,
		subtitle: `${commit.commit.author.name}<${commit.commit.author.email}> at ${fd(commit.commit.author.date)}`,
		icon: ICONS.CODE,
		alwaysShowsSubtitle: true,
		children: formatCommitDetail(commit)
	}
}


function formatCommitDetail(commit) {
	return [{
		title: commit.sha,
		icon: ICONS.HASH,
		url: commit.html_url
	}, {
		title: commit.author.login,
		label: 'Author',
		icon: ICONS.USER,
		action: 'showUserInfo',
		actionReturnsItems: true,
		actionArgument: {
			username: commit.author.login
		}
	}];
}