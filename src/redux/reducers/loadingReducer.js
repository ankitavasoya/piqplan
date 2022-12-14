import { IS_LOADING } from "../type";

const initialState = {
    loading: false,
};

export const isLoadingReducer = (state = initialState, action) => {
    switch (action?.type) {
        case IS_LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        default:
            return state;
    }
};