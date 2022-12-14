import { GET_PLANS, GET_PLANS_BY_PLAN_ID_LOADING, GET_PLANS_DETAILS, GET_PLANS_ERROR, GET_PLANS_LOADING, GET_PLAN_BY_PLAN_ID_ERROR } from "../type";

const intialState = {
    loading: false,
    getPlans: null,
    getPlansError: null,
    
    getPlanDetails: null,
    getPlanDestailsError: null,
};


export const planReducer = (state = intialState, action) => {
    switch (action?.type) {
        case GET_PLANS_LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        case GET_PLANS:
            return {
                ...state,
                getPlans: action.payload,
            };
        case GET_PLANS_ERROR:
            return {
                ...state,
                getPlansError: action.payload,
            };

        case GET_PLANS_BY_PLAN_ID_LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        case GET_PLANS_DETAILS:
            return {
                ...state,
                getPlanDetails: action.payload,
            };
        case GET_PLAN_BY_PLAN_ID_ERROR:
            return {
                ...state,
                getPlanDestailsError: action.payload,
            };

        default:
            return state;
    }
}
