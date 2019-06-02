function showAllIssuesOfRepo(options) {
	const response = request(`/repos/${options.repo}/issues?page=${options.page}&state=open`);
	const items = (response.data || []).map((issue) => {
		return formatIssueInfo(issue);
	});

	if (hasMore(response)) {
		items.push(nextPage('showAllIssuesOfRepo', options));
	}

	return items;
}


function formatIssueInfo(issue) {
	return {
		title: issue.title,
		// badge: issue.state,
		subtitle: `Created by ${issue.user.login} at ${fd(issue.created_at)}`,
		alwaysShowsSubtitle: true,
		icon: ICONS.INFO,
		label: issue.pull_request ? 'PR' : 'ISSUE',
		children: formatIssueDetail(issue),
		url: issue.html_url
	};
}


function formatIssueDetail(issue) {
	const items = [{
		title: issue.title,
		label: 'Title',
		icon: ICONS.INFO
	}, {
		title: issue.body,
		label: 'Description',
		icon: ICONS.INFO
	}, {
		title: issue.user.login,
		label: 'Repoter',
		icon: ICONS.INFO,
		action: 'showUserInfo',
		actionReturnsItems: true,
		actionArgument: {
			username: issue.user.login
		}
	}];

	if (issue.milestone) {
		items.push({
			title: issue.milestone.description,
			label: 'Milestore',
			icon: ICONS.INFO
		});
	}

	if (issue.assignees) {
		const names = issue.assignees.map((assignee) => assignee.login);
		items.push({
			title: names.join(', '),
			label: 'Assignees',
			icon: ICONS.INFO
		});
	}

	items.push({
		title: `${issue.comments}`,
		icon: ICONS.INFO,
		label: 'Comments'
	});

	return items;
}