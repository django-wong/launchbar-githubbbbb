const ICONS = {
    'SUCCESSFUL': 'font-awesome:check',
    'FAILED': 'font-awesome:times',
    'HALTED': 'font-awesome:hourglass-start',
    'NEXT_PAGE': 'font-awesome:arrow-right',
    'RUNNING': 'font-awesome:running',
    'COMMIT': 'font-awesome:code',
    'COMMITS': 'font-awesome:list-alt',
    'HASH': 'font-awesome:hashtag',
    'LINK': 'font-awesome:fa-external-link',
    'INFO': 'font-awesome:info-circle',
    'BRANCH': 'font-awesome:sitemap',
    'CODE': 'font-awesome:code',
    'STARRED': 'font-awesome:star',
    'GITHUB': 'font-awesome:github',
    'USER': 'font-awesome:user-circle',
    'REPOSITORIES': 'font-awesome:list-alt',
    'GISTS': 'font-awesome:fa-file-code-o',
    'FOLLOWERS': 'font-awesome:users',
    'TOGGLE_ON': 'font-awesome:toggle-on',
    'TOGGLE_OFF': 'font-awesome:toggle-off',
    'HEART': 'font-awesome:gratipay',
    'REPOSITORY': 'font-awesome:github-alt',
    'CODE_LANGUAGE': 'font-awesome:fa-file-text',
    'DATE': 'font-awesome:fa-clock-o',
    'BIO': 'font-awesome:fa-bullhorn',
    'LOCATION': 'font-awesome:fa-location-arrow',
    'WEBSITE': 'font-awesome:fa-globe',
    'AVATAR': 'font-awesome:fa-user-circle'
};

const HOST = "https://api.github.com"


/**
 * Format a date string to relative date
 *
 * @param      {string | Date}  date    The date
 * @return     {string}
 */
function fd(date) {
    return LaunchBar.formatDate(new Date(date), {
        relativeDateFormatting: true
    });
}


/**
 * Try parse a JSON string, or return the fallback value
 *
 * @param      {string}  value     The value
 * @param      {any}     fallback  The fallback
 * @return     {any}
 */
function tryParse(value, fallback) {
    if (typeof value === 'string') {
        try {
            return JSON.parse(value);
        } catch(e) {/**/}
    }
    return fallback;
}

/**
 * Make a HTTP request
 *
 * @param      {string}  url            The url
 * @param      {mixed}   authOrOptions  The auth string or options like {auth:
 *                                      'xxxxx:xxxxxx'}
 * @return     {object}  Response
 */
function request(url, authOrOptions) {
    url = url.indexOf('http') === -1 ? HOST + url : url;

    const options = typeof authOrOptions === 'string' ? {
        auth: authOrOptions
    } : authOrOptions || {};

    options.auth = options.auth || Action.preferences.auth;

    if (typeof options.auth === 'string') {
        options.headerFields = {
            'Authorization': `Basic ${options.auth.toBase64String()}`
        };
    }
    return HTTP.getJSON(url, options);
}


/**
 * Dump an object to LaunchBar output
 *
 * @param      {any}  value   The value
 * @return     {Array}
 */
function dump(value) {
    const items = [];
    if (value && typeof value === 'object') {
        Object.keys(value).forEach((key) => {
            const item = {
                title: key,
                icon: 'font-awesome:info-circle'
            };
            const asdadasd = tryParse(value[key], value[key]);
            if (typeof asdadasd === 'object' && asdadasd) {
                item.badge = Array.isArray(asdadasd) ? `${asdadasd.length} item` : 'Object'
                item.children = dump(asdadasd);
            } else {
                if (asdadasd) {
                    item.label = asdadasd.toString();
                    item.children = [{title: item.label}];
                } else {
                    item.badge = 'null';
                }
            }
            items.push(item);
        })
    }
    return items;
}


/**
 * Increase page by i
 *
 * @param      {object}  options  The options
 * @return     {object}
 */
function increasePage(options) {
    return Object.assign({}, options, {page: (options.page || 1) + 1});
}


function nextPage(action, options) {
    return {
        title: 'Next Page',
        action: action,
        actionReturnsItems: true,
        actionArgument: increasePage(options),
        icon: ICONS.NEXT_PAGE
    };
}


function hasMore(response) {
    if (response &&
        response.response &&
        response.response.headerFields &&
        response.response.headerFields.Link &&
        response.response.headerFields.Link.indexOf('rel="next"') !== -1) {
        return true;
    }
    return false;
}