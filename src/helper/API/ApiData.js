import axios from 'axios'
import AuthStorage from '../AuthStorage';
import { API } from '../../config/API/api.config';
// import { useDispatch } from 'react-redux';
import { setIsLoginPopup } from '../../redux/actions/checkErrorAction';


export const BaseURL = API.endpoint.concat('/');


// const axios = require('axios').default;

// // eslint-disable-next-line react-hooks/rules-of-hooks
// const dispatch = useDispatch()

const defaultHeaders = {
    isAuth: true,
    AdditionalParams: {},
    isJsonRequest: true
};

export const ApiGet = (type) => {
    return new Promise((resolve, reject) => {
        axios.get(`${BaseURL}${type}`, getHttpOptions())
            .then((responseJson) => {
                resolve(responseJson.data);
            })
            .catch((error) => {
                // if (error?.response?.status === 401) {
                //     AuthStorage.deauthenticateUser();
                //     // window.location = "/piqplan-medicare"
                //     // dispatch(setIsLoginPopup(true))
                // }
                if (error && 'response' in error &&
                    error.response && 'data' in error.response && error.response.data &&
                    'error' in error.response.data && error.response.data.error) {
                    reject(error.response.data.error);
                } else {
                    reject(error);
                }
            });
    });
}


export const ApiGetNoAuth = (type) => {
    return new Promise((resolve, reject) => {
        axios.get(`${BaseURL}${type}`, getHttpOptions({ ...defaultHeaders, isAuth: false }))
            .then((responseJson) => {
                resolve(responseJson.data);
            })
            .catch((error) => {
                // if (error?.response?.status === 401) {
                //     AuthStorage.deauthenticateUser();
                //     // window.location = "/piqplan-medicare"
                //     // dispatch(setIsLoginPopup(true))
                // }
                if (error && 'response' in error &&
                    error.response && 'data' in error.response && error.response.data &&
                    'error' in error.response.data && error.response.data.error) {
                    reject(error.response.data.error);
                } else {
                    reject(error);
                }
            });
    });
}


export const ApiPost = (type, userData) => {
    return new Promise((resolve, reject) => {
        axios.post(`${BaseURL}${type}`, userData, getHttpOptions())
            .then((responseJson) => {
                resolve(responseJson.data);
            })
            .catch((error) => {
                // if (error?.response?.status === 401) {
                //     AuthStorage.deauthenticateUser();
                //     // window.location = "/piqplan-medicare"
                //     // dispatch(setIsLoginPopup(true))
                // }
                if (error && 'response' in error &&
                    error.response && 'data' in error.response && error.response.data &&
                    'error' in error.response.data && error.response.data.error) {
                    reject(error.response.data.error);
                } else {
                    reject(error);
                }
            });
    });
}


export const ApiPostNoAuth = (type, userData) => {
    return new Promise((resolve, reject) => {
        axios.post(`${BaseURL}${type}`, userData, getHttpOptions({ ...defaultHeaders, isAuth: false }))
            .then((responseJson) => {
                resolve(responseJson.data);
            })
            .catch((error) => {
                // if (error?.response?.status === 401) {
                //     AuthStorage.deauthenticateUser();
                //     // window.location = "/piqplan-medicare"
                //     // dispatch(setIsLoginPopup(true))
                // }
                if (error && 'response' in error &&
                    error.response && 'data' in error.response && error.response.data &&
                    'message' in error.response.data && error.response.data.message) {
                    reject(error.response.data.message);
                } else {
                    reject(error);
                }
            });
    });
}


export const ApiPatch = (type, userData) => {
    return new Promise((resolve, reject) => {
        axios.patch(`${BaseURL}${type}`, userData, getHttpOptions())
            .then((responseJson) => {
                resolve(responseJson);
            })
            .catch((error) => {
                // if (error?.response?.status === 401) {
                //     AuthStorage.deauthenticateUser();
                //     // window.location = "/piqplan-medicare"
                //     // dispatch(setIsLoginPopup(true))
                // }
                if (error && 'response' in error &&
                    error.response && 'data' in error.response && error.response.data &&
                    'error' in error.response.data && error.response.data.error) {
                    reject(error.response.data.error);
                } else {
                    reject(error);
                }
            });
    });
}


export const ApiDelete = (type, userData) => {
    return new Promise((resolve, reject) => {
        axios.delete(`${BaseURL}${type}`, getHttpOptions())
            .then((responseJson) => {
                resolve(responseJson);
            })
            .catch((error) => {
                // if (error?.response?.status === 401) {
                //     AuthStorage.deauthenticateUser();
                //     // window.location = "/piqplan-medicare"
                //     // dispatch(setIsLoginPopup(true))
                // }
                if (error && 'response' in error &&
                    error.response && 'data' in error.response && error.response.data &&
                    'error' in error.response.data && error.response.data.error) {
                    reject(error.response.data.error);
                } else {
                    reject(error);
                }
            });
    });
}

export const ApiPut = (type, userData) => {
    return new Promise((resolve, reject) => {
        axios.put(`${BaseURL}${type}`, userData, getHttpOptions())
            .then((responseJson) => {
                resolve(responseJson);
            })
            .catch((error) => {
                // if (error?.response?.status === 401) {
                //     AuthStorage.deauthenticateUser();
                //     // window.location = "/piqplan-medicare"
                //     // dispatch(setIsLoginPopup(true))
                // }
                if (error && 'response' in error &&
                    error.response && 'data' in error.response && error.response.data &&
                    'error' in error.response.data && error.response.data.error) {
                    reject(error.response.data.error);
                } else {
                    reject(error);
                }
            });
    });
}



export const getHttpOptions = (options = defaultHeaders) => {
    let headers = {
        Authorization: "",
        'Content-Type': "application/json",
        'Access-Control-Allow-Origin': null,
        'Access-Control-Allow-credentials': true,   
    };
    // "Origin, X-Requested-With, Content-Type, Accept"

    if ('isAuth' in options && options.isAuth) {
        headers.Authorization = AuthStorage.getToken() ?? "";
    }

    if ('isJsonRequest' in options && options.isJsonRequest) {
        headers['Content-Type'] = 'application/json';
    }

    if ('AdditionalParams' in options && options.AdditionalParams) {
        headers = { ...headers, ...options.AdditionalParams };
    }

    return { headers }
}