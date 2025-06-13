import { config } from './deploy.js';
export default {

    // called when the user attempts to log in
    //syntax {jwtToken, profileId} deconstructs object parameter compared to (token, profileId), which would require token.jwtToken
    login: ({jwtToken, profileId }) => {
        console.log(" << login");
        const apiUri = config[process.env.NODE_ENV].auth_host + config[process.env.NODE_ENV].user_uri;
        const apiKey = config[process.env.NODE_ENV].api_key;
        console.log('Auth URL %s', apiUri);

        //no JWT token
        if (!jwtToken || jwtToken === '') {
            console.log('No JWT token provided in request');
            return Promise.reject();
        }

        return fetch(`${apiUri}`, {
            method: 'GET',
            headers: { 'Authorization' : `Bearer ${jwtToken}` , 'x-api-key' : `${apiKey}`},
        }).then(response => {
            //non-200 response (ie error)
            if (response.status < 200 || response.status >= 300) {
                return response;
            }
            //valid response
            else {
                return response.json()
            }
        }).then( (auth) => {
            //json response
            if (auth && auth.name) {
                //request parameters
                localStorage.setItem('jwtToken', jwtToken);
                localStorage.setItem('profileId', profileId);
                //response parameters
                localStorage.setItem('username', auth.name);
            }
            else {
                console.log('JWT token failed validation with value %s', jwtToken);
                throw new Error('Unable to login')
            }
        }).catch(() => {
            throw new Error('Unable to login')
        });
    },
    // called when the user clicks on the logout button
    logout: () => {
        console.log("<< logout");

        localStorage.removeItem('username');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('profileId');

        const logoutURL = config[process.env.NODE_ENV].logout_url;
        window.location.assign(logoutURL);

        console.log(">> logout");
    },
    // called when the API returns an error
    checkError: (status) => {
        console.log("<< checkError");

        const logoutURL = config[process.env.NODE_ENV].logout_url;

        if (status?.message === 401 || status?.message === 403) {
            localStorage.removeItem('username');
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('profileId');

            console.log("Unable to login with Authentication failure.")
            return Promise.reject({ redirectTo: logoutURL });
        }

        console.log(">> checkError");
        return Promise.resolve();
    },
    // called when the user navigates to a new location, to check for authentication
    checkAuth: () => {
        console.log("<< checkAuth");
        const logoutURL = config[process.env.NODE_ENV].logout_url;
        return localStorage.getItem('jwtToken')
            ? Promise.resolve()
            : Promise.reject({ redirectTo: logoutURL });
    },
    // called when the user navigates to a new location, to check for permissions / roles
    getPermissions: () => Promise.resolve(),
};