import { SAVE_CONTACT_US_LOADING, SAVE_CONTACT_US, SAVE_CONTACT_US_ERROR} from "../type";

const initialState = {
    loading: false,
    saveContactData: null,
    saveContactError:null,
};

export const contactUsReducer = (state = initialState, action) => {
    switch (action?.type) {
        case SAVE_CONTACT_US_LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        case SAVE_CONTACT_US:
            return {
                ...state,
                saveContactData: action.payload,
            };
        case SAVE_CONTACT_US_ERROR:
            return {
                ...state,
                saveContactError: action.payload,
            };
        default:
            return state;
    }
};