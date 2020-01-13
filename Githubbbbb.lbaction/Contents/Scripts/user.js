function addAccount(auth) {
    const result = request(`${HOST}/user`, auth);
    if (result.data && result.data.login) {
        const answer = LaunchBar.alert(
            'Are you sure to add this account?',
            result.data.login,
            'Nice!',
            'Cancel'
        );

        if (answer === 0) {
            Action.preferences.users.push([auth, JSON.stringify(result.data)]);
            return useUserProfile({user: result.data, auth});
        }

        return [];
    } else {
        LaunchBar.alert('Invalid Certificate');
    }
}


function refreshAccount(auth) {
    const result = request(`${HOST}/user`, auth);
    if (result.data && result.data.login) {
        Action.preferences.users = Action.preferences.users.map((user) => {
            const [$auth, $data] = user;
            if ($auth === auth) {
                return [auth, JSON.stringify(result.data)]
            }
            return user;
        });
        return result.data;
    }
    return null;
}


/**
 * Builds an user information.
 */
function useUserProfile(args) {
	let data = args.user;
	const auth = Action.preferences.auth = args.auth;
	const options = {
		username: data.login,
		auth: auth,
		page: 1
	};

    if (LaunchBar.options.commandKey) {
        data = refreshAccount(auth) || data;
    }

    return [{
        title: `${data.login}<${data.email}>`,
        subtitle: data.bio,
        badge: data.plan.name.toUpperCase(),
        url: data.html_url,
        icon: ICONS.USER
    }, {
        title: 'Repostories',
        badge: `${data.public_repos} Public, ${data.total_private_repos} Private`,
        icon: ICONS.REPOSITORIES,
        action: 'showAllRepositoriesOfMine',
        actionArgument: options,
        actionReturnsItems: true
    }, {
        title: 'Gists',
        badge: `${data.public_gists} Public, ${data.private_gists} Private`,
        icon: ICONS.GISTS
    }, {
        title: 'Followers',
        badge: `${data.followers}`,
        // url: `https://github.com/${data.login}?tab=followers`,
        icon: ICONS.FOLLOWERS,
        action: 'listFollowers',
        actionReturnsItems: true,
        actionArgument: options
    }, {
        title: 'Starred',
        icon: ICONS.STARRED,
        // url: `https://github.com/${data.login}?tab=stars`,
        label: 'Press <ENTER> to view',
        action: 'showStarred',
        actionReturnsItems: true,
        actionArgument: options
    }, {
		title: 'Two Factor Authentication',
		badge: data.two_factor_authentication ? 'Enabled' : 'Disabled',
		icon: data.two_factor_authentication ? ICONS.TOGGLE_ON : ICONS.TOGGLE_OFF
    }];
}



function formatUserDetail(user) {
    const options = {
        username: user.login,
        page: 1
    };

    const items = [{
        title: `${user.name ? user.name + ', ' : ''}${user.login}${user.email ? '<' + user.email +'>' : ''}`,
        url: user.html_url,
        icon: ICONS.USER
    }, {
        title: 'View Avatar',
        url: user.avatar_url,
        icon: ICONS.AVATAR,
        quickLookURL: user.avatar_url,
        badge: 'COMMAND + Y',
    }, {
        title: `${user.public_repos} Public Repositories`,
        icon: ICONS.REPOSITORIES,
        action: 'showAllRepositoriesOfUser',
        actionArgument: options,
        actionReturnsItems: true
    }, {
        title: `${user.public_gists} Public Gists`,
        icon: ICONS.GISTS
    }, {
        title: `${user.followers} Followers`,
        icon: ICONS.FOLLOWERS,
        action: 'listFollowers',
        actionReturnsItems: true,
        actionArgument: options
    }];

    if (user.bio) {
        items.splice(1, 0, {
            title: user.bio,
            icon: ICONS.BIO,
            label: 'Bio'
        })
    }

    if (user.location) {
        items.push({
            title: user.location,
            label: 'Location',
            icon: ICONS.LOCATION
        });
    }

    if (user.blog) {
        items.push({
            title: user.blog,
            url: user.blog,
            label: 'Blog, <ENTER> to visit',
            icon: ICONS.WEBSITE
        })
    }
    return items;
}


function formatUserInfo(user) {
    return {
        title: (user.name || user.login) + (user.email ? `<${user.email}>` : ''),
        subtitle: user.bio || '',
        icon: ICONS.USER,
        action: 'showUserInfo',
        actionReturnsItems: true,
        actionArgument: {
            username: user.login
        },
        url: user.html_url
    }
}



function listUsers() {
    return Action.preferences.users.map((account) => {
        const user = JSON.parse(account[1]);
        return {
            title: user.login,
            action: 'useUserProfile',
            actionArgument: {
				user: user, auth: account[0]
            },
            actionReturnsItems: true,
            icon: ICONS.USER
        }
    });
}



function showUserInfo(options) {
    const response = request(`/users/${options.username}`);
    if (!response.data) {
        return [];
    }
    return formatUserDetail(response.data);
}