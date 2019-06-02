function showBranchesOfRepo(options) {
	const url = `/repos/${options.repo}/branches?protected&page=${options.page}`
	const response = request(url);
	const items = (response.data || []).map((branch) => {
		return formatBranchInfo(branch);
	});
	if (hasMore(response)) {
		items.push(nextPage('showBranchesOfRepo', options));
	}
	return items;
}


function formatBranchInfo(branch) {
	return {
		title: branch.name,
		badge: branch.protected ? 'Protected' : undefined,
		icon: ICONS.BRANCH,
		children: formatBranchDetail(branch)
	}
}


function formatBranchDetail(branch) {
	const output = [];
	if (branch.commit) {
		output.push({title: branch.commit.sha, icon: ICONS.HASH, label: 'Last Commit'})
	}
	return output;
}