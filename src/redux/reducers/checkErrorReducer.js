import { IS_ERROR } from "../type";

const initialState = {
    checkError: false,
};

export const checkErrorReducer = (state = initialState, action) => {
    switch (action?.type) {
        case IS_ERROR:
            return {
                ...state,
                checkError: action.payload,
            };
        default:
            return state;
    }
};