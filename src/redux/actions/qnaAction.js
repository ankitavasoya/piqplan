import { endPoints } from "../../config/endPoints"
import { ApiGet, ApiPost } from "../../helper/API/ApiData"
import { GET_QUESTIONS_BY_SURVEY_ID, GET_QUESTIONS_BY_SURVEY_ID_ERROR, GET_QUESTIONS_BY_SURVEY_ID_LOADING, GET_QUESTIONS_BY_SURVEY_ID_ORDER_NO, GET_QUESTIONS_BY_SURVEY_ID_ORDER_NO_ERROR, GET_QUESTIONS_BY_SURVEY_ORDER_NO_ID_LOADING, GET_QUESTION_BY_ID, GET_QUESTION_BY_ID_ERROR, GET_QUESTION_BY_ID_LOADING, GET_SURVEYS, GET_SURVEYS_ERROR, GET_SURVEYS_LOADING, IS_ERROR, IS_LOADING, QUESTION_CONTROL_TYPE, QUESTION_CONTROL_TYPE_ERROR, QUESTION_CONTROL_TYPE_LOADING, SAVE_ANSWER, SAVE_ANSWER_ERROR, SAVE_ANSWER_LOADING, SAVE_QUESTION, SAVE_QUESTION_ERROR, SAVE_QUESTION_LOADING } from "../type"

export const getSurveys = () => async (dispatch) => {
    try {
        // dispatch({
        //     type: IS_LOADING,
        //     payload: true
        // })

        dispatch({
            type: GET_SURVEYS_LOADING,
            payload: true
        })

        await ApiGet(endPoints.getSurveys)
            .then((res) => {
                dispatch({
                    type: GET_SURVEYS,
                    payload: res
                })
                dispatch({
                    type: GET_SURVEYS_LOADING,
                    payload: false
                })

                // dispatch({
                //     type: IS_LOADING,
                //     payload: false
                // })
            }).catch((error) => {
                dispatch({
                    type: IS_ERROR,
                    payload: error
                })
                dispatch({
                    type: GET_SURVEYS_ERROR,
                    payload: error
                })
            })

    } catch (error) {
        dispatch({
            type: GET_SURVEYS_ERROR,
            payload: error
        })

        dispatch({
            type: GET_SURVEYS_LOADING,
            payload: false
        })

        dispatch({
            type: IS_ERROR,
            payload: error
        })
        // dispatch({
        //     type: IS_LOADING,
        //     payload: false
        // })
    }
}

export const getQuestionById = (id) => async (dispatch) => {
    try {
        // dispatch({
        //     type: IS_LOADING,
        //     payload: true
        // })

        dispatch({
            type: GET_QUESTION_BY_ID_LOADING,
            payload: true
        })

        await ApiGet(`${endPoints.getQuestionById}/${id}`)
            .then((res) => {
                dispatch({
                    type: GET_QUESTION_BY_ID,
                    payload: res
                })
            }).catch((error) => {
                dispatch({
                    type: GET_QUESTION_BY_ID_ERROR,
                    payload: error
                })
            }).catch((error) => {
                dispatch({
                    type: IS_ERROR,
                    payload: error
                })
                dispatch({
                    type: GET_QUESTION_BY_ID_ERROR,
                    payload: error
                })
            })

        dispatch({
            type: GET_QUESTION_BY_ID_LOADING,
            payload: false
        })

        // dispatch({
        //     type: IS_LOADING,
        //     payload: false
        // })

    } catch (error) {

        dispatch({
            type: GET_QUESTION_BY_ID_ERROR,
            payload: error
        })

        dispatch({
            type: GET_QUESTION_BY_ID_LOADING,
            payload: false
        })

        dispatch({
            type: IS_ERROR,
            payload: error
        })

        // dispatch({
        //     type: IS_LOADING,
        //     payload: false
        // })
    }
}

export const getQuestionsBySurveyId = (surveyId) => async (dispatch) => {
    try {
        // dispatch({
        //     type: IS_LOADING,
        //     payload: true
        // })

        dispatch({
            type: GET_QUESTIONS_BY_SURVEY_ID_LOADING,
            payload: true
        })

        await ApiGet(`${endPoints.getQuestionBySurveyId}/${surveyId}`)
            .then((res) => {
                dispatch({
                    type: GET_QUESTIONS_BY_SURVEY_ID,
                    payload: res
                })
            }).catch((error) => {
                dispatch({
                    type: GET_QUESTIONS_BY_SURVEY_ID_ERROR,
                    payload: error
                })
            }).catch((error) => {
                dispatch({
                    type: IS_ERROR,
                    payload: error
                })
                dispatch({
                    type: GET_QUESTIONS_BY_SURVEY_ID_ERROR,
                    payload: error
                })

            })

        dispatch({
            type: GET_QUESTIONS_BY_SURVEY_ID_LOADING,
            payload: false
        })

        // dispatch({
        //     type: IS_LOADING,
        //     payload: false
        // })

    } catch (error) {

        dispatch({
            type: GET_QUESTIONS_BY_SURVEY_ID_ERROR,
            payload: error
        })

        dispatch({
            type: GET_QUESTIONS_BY_SURVEY_ID_LOADING,
            payload: false
        })

        dispatch({
            type: IS_ERROR,
            payload: error
        })

        // dispatch({
        //     type: IS_LOADING,
        //     payload: false
        // })
    }
}

export const saveQuestion = (body) => async (dispatch) => {
    try {
        // dispatch({
        //     type: IS_LOADING,
        //     payload: true
        // })

        dispatch({
            type: SAVE_QUESTION_LOADING,
            payload: true
        })

        await ApiPost(endPoints.saveQuestion, body)
            .then((res) => {
                dispatch({
                    type: SAVE_QUESTION,
                    payload: res
                })
            }).catch((error) => {
                dispatch({
                    type: SAVE_QUESTION_ERROR,
                    payload: error
                })
            }).catch((error) => {
                dispatch({
                    type: IS_ERROR,
                    payload: error
                })
                dispatch({
                    type: SAVE_QUESTION_ERROR,
                    payload: error
                })
            })

        dispatch({
            type: SAVE_QUESTION_LOADING,
            payload: false
        })

        // dispatch({
        //     type: IS_LOADING,
        //     payload: false
        // })

    } catch (error) {

        dispatch({
            type: SAVE_QUESTION_ERROR,
            payload: error
        })

        dispatch({
            type: SAVE_QUESTION_LOADING,
            payload: false
        })

        dispatch({
            type: IS_ERROR,
            payload: error
        })

        // dispatch({
        //     type: IS_LOADING,
        //     payload: false
        // })
    }
}

export const saveAnswer = (body) => async (dispatch) => {
    try {
        dispatch({
            type: IS_LOADING,
            payload: true
        })

        dispatch({
            type: SAVE_ANSWER_LOADING,
            payload: true
        })

        await ApiPost(endPoints.saveAnswer, body)
            .then((res) => {
                dispatch({
                    type: SAVE_ANSWER,
                    payload: res
                })
            }).catch((error) => {
                dispatch({
                    type: SAVE_ANSWER_ERROR,
                    payload: error
                })
            }).catch((error) => {
                dispatch({
                    type: IS_ERROR,
                    payload: error
                })
                dispatch({
                    type: SAVE_ANSWER_ERROR,
                    payload: error
                })
            })

        dispatch({
            type: SAVE_ANSWER_LOADING,
            payload: false
        })

        dispatch({
            type: IS_LOADING,
            payload: false
        })

    } catch (error) {

        dispatch({
            type: IS_ERROR,
            payload: error
        })

        dispatch({
            type: SAVE_ANSWER_ERROR,
            payload: error
        })

        dispatch({
            type: SAVE_ANSWER_LOADING,
            payload: false
        })

        dispatch({
            type: IS_LOADING,
            payload: false
        })
    }
}

export const questionControlType = () => async (dispatch) => {
    try {
        // dispatch({
        //     type: IS_LOADING,
        //     payload: true
        // })

        dispatch({
            type: QUESTION_CONTROL_TYPE_LOADING,
            payload: true
        })

        await ApiGet(endPoints.questionControlTypes)
            .then((res) => {
                dispatch({
                    type: QUESTION_CONTROL_TYPE,
                    payload: res
                })
            }).catch((error) => {
                dispatch({
                    type: QUESTION_CONTROL_TYPE_ERROR,
                    payload: error
                })
            }).catch((error) => {
                dispatch({
                    type: IS_ERROR,
                    payload: error
                })
                dispatch({
                    type: QUESTION_CONTROL_TYPE_ERROR,
                    payload: error
                })
            })

        dispatch({
            type: QUESTION_CONTROL_TYPE_LOADING,
            payload: false
        })

        // dispatch({
        //     type: IS_LOADING,
        //     payload: false
        // })

    } catch (error) {

        dispatch({
            type: IS_ERROR,
            payload: error
        })

        dispatch({
            type: QUESTION_CONTROL_TYPE_ERROR,
            payload: error
        })

        dispatch({
            type: QUESTION_CONTROL_TYPE_LOADING,
            payload: false
        })

        // dispatch({
        //     type: IS_LOADING,
        //     payload: false
        // })
    }
}

export const getQuestionsBySurveyIdAndOrderNo = (currentQOrderno, surveyId) => async (dispatch) => {
    try {
        // dispatch({
        //     type: IS_LOADING,
        //     payload: true
        // })

        dispatch({
            type: GET_QUESTIONS_BY_SURVEY_ORDER_NO_ID_LOADING,
            payload: true
        })

        await ApiGet(`${endPoints.getQuestionBySurveyIdAndOrderNo}/${currentQOrderno}/${surveyId}`)
            .then((res) => {
                dispatch({
                    type: GET_QUESTIONS_BY_SURVEY_ID_ORDER_NO,
                    payload: res
                })
            }).catch((error) => {
                dispatch({
                    type: GET_QUESTIONS_BY_SURVEY_ID_ORDER_NO_ERROR,
                    payload: error
                })
            }).catch((error) => {
                dispatch({
                    type: IS_ERROR,
                    payload: error
                })
                dispatch({
                    type: GET_QUESTIONS_BY_SURVEY_ID_ORDER_NO_ERROR,
                    payload: error
                })
            })

        dispatch({
            type: GET_QUESTIONS_BY_SURVEY_ORDER_NO_ID_LOADING,
            payload: false
        })

        // dispatch({
        //     type: IS_LOADING,
        //     payload: false
        // })

    } catch (error) {

        dispatch({
            type: GET_QUESTIONS_BY_SURVEY_ID_ORDER_NO_ERROR,
            payload: error
        })

        dispatch({
            type: GET_QUESTIONS_BY_SURVEY_ORDER_NO_ID_LOADING,
            payload: false
        })

        dispatch({
            type: IS_ERROR,
            payload: error
        })

        // dispatch({
        //     type: IS_LOADING,
        //     payload: false
        // })
    }
}
