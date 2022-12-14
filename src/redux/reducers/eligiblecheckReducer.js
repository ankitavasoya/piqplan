import { ELIGIBLECHECK, ELIGIBLECHECK_ERROR, ELIGIBLECHECK_LOADING } from "../type"

const intialState = {
    eligiblecheckLoading: false,
    
    eligiblecheckData: null,
    eligiblecheckError: null,
};

export const eligiblecheckReducer = (state = intialState, action) => {
    switch (action?.type) {
        case ELIGIBLECHECK_LOADING:
            return {
                ...state,
                eligiblecheckLoading: action.payload,
            };
        case ELIGIBLECHECK:
            return {
                ...state,
                eligiblecheckData: action.payload,
            };
        case ELIGIBLECHECK_ERROR:
            return {
                ...state,
                eligiblecheckError: action.payload,
            };
        default:
            return state;
    }
}