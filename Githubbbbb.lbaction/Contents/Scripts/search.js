const SEARCHES = [{
        abbr: ['repo', 'r'],
        url: '/search/repositories'
    }, {
        abbr: ['commit', 'c'],
        url: '/search/commits'
    },
    // {abbr: ['code'], url: '/search/code'},
    {
        abbr: ['issue', 'pr', 'i'],
        url: '/search/issues'
    }, {
        abbr: ['user', 'u'],
        url: '/search/users'
    }
];

function search(options) {
    if (options.text.toString().indexOf(':') === -1) {
        options.text = 'repo:' + options.text;
    }
    const [input, type, pattern, sort, order] = options.text.match(/([a-z]+):([^?]+)\??(\w+)?([-+])?/);
    const search = SEARCHES.find((search) => {
        return search.abbr.indexOf(type) !== -1;
    });

    if (!search) {
        return [{
            title: 'Invalid Search'
        }];
    }

    const body = {
        q: pattern,
        page: `${options.page || 1}`,
        per_page: 20
    };
    if (sort) {
        body.sort = sort;
        if (order) {
            body.order = order === '-' ? 'desc' : 'asc';
        }
    }

    const response = request(`${search.url}?q=${body.q}&page=${body.page}&per_page=${body.per_page}&sort=${body.sort}&order=${body.order}`);

    if (!response.data || !response.data.items) {
        return [{
            title: 'No Result'
        }].concat(dump(response));
    }

    const items = response.data.items.map((item) => {
        let result;
        switch (search.abbr[0]) {
			case 'commit':
				return formatCommitInfo(item);
			case 'issue':
				return formatIssueInfo(item);
			case 'repo':
				return formatRepoInfo(item);
			case 'user':
				return formatUserInfo(item);
			default:
			return null;
        }
    }).filter((item) => !!item);

    if (hasMore(response)) {
        items.push(nextPage('search', options));
    }
    return items;
}