function showAllRepositoriesOfUser(options) {
	const {
		username, page
	} = options;

	const url = `/users/${username}/repos?sort=pushed&type=all&direction=desc&page=${page}`;
	const response = request(url);
	const items = (response.data || []).map((repo) => {
		return formatRepoInfo(repo);
	});

	if (hasMore(response)) {
		items.push(nextPage('showAllRepositoriesOfUser', options))
	}
	return items;
}

function showAllRepositoriesOfMine(options) {
	const response = request(`/user/repos?visibility=all&affiliation=owner,collaborator,organization_member&sort=pushed&page=${options.page || 1}`);
	const items = (response.data || []).map((repo) => {
		return formatRepoInfo(repo, true);
	});
	if (hasMore(response)) {
		items.push(nextPage('showAllRepositoriesOfMine', options));
	}
	return items;
}

function formatRepoInfo(repo, showExtendedInfo) {
	const output = {
		title: repo.full_name,
		subtitle: repo.description || '',
		// ${repo.forks_count} Forks, ${repo.stargazers_count} Stars,
		label: `${repo.open_issues} Open Issues`,
		children: formatRepoDetail(repo),
		icon: ICONS.REPOSITORY,
	}

	if (showExtendedInfo) {
		output.badge = repo.private ? 'Private' : 'Public'
	}

	return output;
}

function formatRepoDetail(repo) {
	const options = {
		repo: repo.full_name,
		page: 1
	};

	return [{
		title: 'View Commits',
		icon: ICONS.CODE,
		action: 'showCommitsOfRepo',
		actionReturnsItems: true,
		actionArgument: options
	},{
		title: 'View Branches',
		icon: ICONS.BRANCH,
		action: 'showBranchesOfRepo',
		actionReturnsItems: true,
		actionArgument: options
	},{
		title: 'View Issues',
		icon: ICONS.INFO,
		badge: `${repo.open_issues} Open Issues`,
		action: 'showAllIssuesOfRepo',
		actionArgument: options,
		actionReturnsItems: true
	},{
		label: `Owner`,
		title: repo.owner.login,
		icon: ICONS.USER,
		url: repo.owner.html_url,
		action: 'showUserInfo',
		actionReturnsItems: true,
		actionArgument: {
			username: repo.owner.login
		}
	}, {
		label: `Language`,
		title: repo.language || '',
		icon: ICONS.CODE_LANGUAGE
	}, {
		label: `Last Updated At`,
		title: fd(repo.pushed_at),
		icon: ICONS.DATE
	}];
}


function showRepository(options) {
	const response = request(`/repos/${options.repo}`);
	if (!response.data) {
		return [];
	}
	return formatRepoDetail(response.data);
}
