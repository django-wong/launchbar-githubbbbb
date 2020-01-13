include('utilities.js');
include('user.js');
include('stars.js');
include('follower.js');
include('repository.js');
include('commit.js');
include('branch.js');
include('issue.js');
include('search.js');

Action.preferences.users = Action.preferences.users || [];

function run(argument) {
    if (argument === undefined) {
        if (Action.preferences.users.length === 0) {
            return [{
                title: 'No Account Found',
                icon: 'font-awesome:exclamation-circle',
                subtitle: 'Go back and press <SPACE> to enter your certificate',
                alwaysShowsSubtitle: true
            }];
        }

        return listUsers();
    }

    if (!throttle(300)) {
        return [];
    }

    argument = argument.trim();
    if (argument === '') {
        return [{
            title: 'Type "?" for help',
            icon: 'font-awesome:info-circle'
        }];
    }

    if (argument.match(/.{1,}\|[a-z0-9]{10,}/)) {
        return addAccount(argument.replace('|', ':'));
    }

    if (argument === '?') {
        return [{
            title: 'Add New User',
            badge: '<user-name>|<token>'
        },{
            title: 'Built In Command',
            badge: '>'
        }, {
            title: 'Help List',
            badge: '?'
        }, {
            title: 'Search Anything',
            badge: '<type>:<search>',
        }, {
            title: 'Sort Search Results',
            badge: '?sort-key'
        }].map((item) => Object.assign(item, {icon: ICONS.INFO}));
    }

    if (argument === '>') {
        return [{
            title: "Delete all account",
            action: 'deleteAllAccount',
            icon: 'font-awesome:trash'
        }, {
            title: "Preferences",
            url: `file://${Action.supportPath}/Preferences.plist`,
            icon: 'font-awesome:cog'
        }];
    }


    return search({
        text: argument,
        page: 1
    });
}
