import {
    POST_REGISTER, POST_REGISTER_LOADING, POST_REGISTER_ERROR, SAVE_AUTHDATA, SAVE_AUTHDATA_LOADING, SAVE_AUTHENTDATA_ERROR, PROFILE_LOADING, PROFILE, PROFILE_ERROR
} from "../type"

const intialState = {
    loading: false,
    
    register: null,
    registerError: null,

    saveAuthData: null,
    saveAuthError: null,
    saveAuthloading: null,

    profile: null,
    profileError: null,
    profileLoading: null,
};

export const accountReducer = (state = intialState, action) => {
    switch (action?.type) {
        case POST_REGISTER_LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        case POST_REGISTER:
            return {
                ...state,
                register: action.payload,
            };
        case POST_REGISTER_ERROR:
            return {
                ...state,
                registerError: action.payload,
            };

        case PROFILE_LOADING:
            return {
                ...state,
                profileLoading: action.payload,
            };
        case PROFILE:
            return {
                ...state,
                profile: action.payload,
            };
        case PROFILE_ERROR:
            return {
                ...state,
                profileError: action.payload,
            };

            case SAVE_AUTHDATA_LOADING:
                return {
                    ...state,
                    saveAuthloading: action.payload,
                };
            case SAVE_AUTHDATA:
                return {
                    ...state,
                    saveAuthData: action.payload,
                };
            case SAVE_AUTHENTDATA_ERROR:
                return {
                    ...state,
                    saveAuthError: action.payload,
                };

        default:
            return state;
    }
}