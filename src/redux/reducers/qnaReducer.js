import { GET_QUESTIONS_BY_SURVEY_ID, GET_QUESTIONS_BY_SURVEY_ID_ERROR, GET_QUESTIONS_BY_SURVEY_ID_ORDER_NO, GET_QUESTIONS_BY_SURVEY_ID_ORDER_NO_ERROR, GET_QUESTION_BY_ID, GET_QUESTION_BY_ID_ERROR, GET_SURVEYS, GET_SURVEYS_ERROR, GET_SURVEYS_LOADING, QUESTION_CONTROL_TYPE, QUESTION_CONTROL_TYPE_ERROR, SAVE_ANSWER, SAVE_ANSWER_ERROR, SAVE_QUESTION, SAVE_QUESTION_ERROR } from "../type"

const intialState = {
    loading: false,
    getSurveys: null,
    getSurveysError: null,

    getQuestionById: null,
    getQuestionByIdError: null,

    getQuestionBySurveyId: null,
    getQuestionBySurveyIdError: null,

    saveQuestion: null,
    saveQuestionError: null,

    saveAnswer: null,
    saveAnswerError: null,
    
    questionControlType: null,
    questionControlTypeError: null,
    
    getQuestionByIdAndOrderNo: null,
    getQuestionByIdAndOrderNoError: null,

};

export const qnaReducer = (state = intialState, action) => {
    switch (action?.type) {
        case GET_SURVEYS_LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        case GET_SURVEYS:
            return {
                ...state,
                getSurveys: action.payload,
            };
        case GET_SURVEYS_ERROR:
            return {
                ...state,
                getSurveysError: action.payload,
            };


        case GET_QUESTION_BY_ID:
            return {
                ...state,
                getQuestionById: action.payload,
            };
        case GET_QUESTION_BY_ID_ERROR:
            return {
                ...state,
                getQuestionByIdError: action.payload,
            };


        case GET_QUESTIONS_BY_SURVEY_ID:
            return {
                ...state,
                getQuestionBySurveyId: action.payload,
            };
        case GET_QUESTIONS_BY_SURVEY_ID_ERROR:
            return {
                ...state,
                getQuestionBySurveyIdError: action.payload,
            };


        case SAVE_QUESTION:
            return {
                ...state,
                saveQuestion: action.payload,
            };
        case SAVE_QUESTION_ERROR:
            return {
                ...state,
                saveQuestionError: action.payload,
            };


        case SAVE_ANSWER:
            return {
                ...state,
                saveAnswer: action.payload,
            };
        case SAVE_ANSWER_ERROR:
            return {
                ...state,
                saveAnswerError: action.payload,
            };


        case QUESTION_CONTROL_TYPE:
            return {
                ...state,
                questionControlType: action.payload,
            };
        case QUESTION_CONTROL_TYPE_ERROR:
            return {
                ...state,
                questionControlTypeError: action.payload,
            };

        case GET_QUESTIONS_BY_SURVEY_ID_ORDER_NO:
            return {
                ...state,
                getQuestionByIdAndOrderNo: action.payload,
            };
        case GET_QUESTIONS_BY_SURVEY_ID_ORDER_NO_ERROR:
            return {
                ...state,
                getQuestionByIdAndOrderNoError: action.payload,
            };


        default:
            return state;
    }
}