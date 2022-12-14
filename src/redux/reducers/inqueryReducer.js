import { SAVE_INQUERY_LOADING, SAVE_INQUERY, SAVE_INQUERY_ERROR, GET_INQUERY_HISTORY_LOADING, GET_INQUERY_HISTORY, GET_INQUERY_HISTORY_ERROR, GET_INQUERY__BY_ID_LOADING, GET_INQUERY_BY_ID, GET_INQUERY__BY_ID_ERROR } from "../type";

const initialState = {
    loading: false,
    saveInqueryData: null,
    saveInqueryError:null,

    getInqueryHistoryLoading: null,
    getInqueryHistoryData: null,
    getInqueryHistoryError:null,

    getInqueryByIdLoading: null,
    getInqueryByIdData: null,
    getInqueryByIdError:null
};

export const inqueryReducer = (state = initialState, action) => {
    switch (action?.type) {
        case SAVE_INQUERY_LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        case SAVE_INQUERY:
            return {
                ...state,
                saveInqueryData: action.payload,
            };
        case SAVE_INQUERY_ERROR:
            return {
                ...state,
                saveInqueryError: action.payload,
            };

        case GET_INQUERY_HISTORY_LOADING:
            return {
                ...state,
                getInqueryHistoryLoading: action.payload,
            };
        case GET_INQUERY_HISTORY:
            return {
                ...state,
                getInqueryHistoryData: action.payload,
            };
        case GET_INQUERY_HISTORY_ERROR:
            return {
                ...state,
                getInqueryHistoryError: action.payload,
            };

        case GET_INQUERY__BY_ID_LOADING:
            return {
                ...state,
                getInqueryByIdLoading: action.payload,
            };
        case GET_INQUERY_BY_ID:
            return {
                ...state,
                getInqueryByIdData: action.payload,
            };
        case GET_INQUERY__BY_ID_ERROR:
            return {
                ...state,
                getInqueryByIdError: action.payload,
            };

        default:
            return state;
    }
};