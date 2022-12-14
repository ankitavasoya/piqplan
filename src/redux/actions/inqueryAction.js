import { endPoints } from "../../config/endPoints"
import { ApiGet, ApiPost } from "../../helper/API/ApiData"
import { SAVE_INQUERY_LOADING, SAVE_INQUERY, SAVE_INQUERY_ERROR, GET_INQUERY_HISTORY_LOADING, GET_INQUERY_HISTORY, GET_INQUERY_HISTORY_ERROR, GET_INQUERY__BY_ID_LOADING, GET_INQUERY_BY_ID, GET_INQUERY__BY_ID_ERROR, IS_LOADING, IS_ERROR } from "../type";

export const saveInquery = (body) => async (dispatch) => {
    try {
        dispatch({
            type: IS_LOADING,
            payload: true
        })

        dispatch({
            type: SAVE_INQUERY_LOADING,
            payload: true
        })

        await ApiPost(endPoints.saveInquery, body)
            .then((res) => {
                dispatch({
                    type: SAVE_INQUERY,
                    payload: res
                })
                dispatch({
                    type: SAVE_INQUERY_LOADING,
                    payload: false
                })
                dispatch({
                    type: IS_LOADING,
                    payload: false
                })

            }).catch((error) => {
                dispatch({
                    type: SAVE_INQUERY_ERROR,
                    payload: error
                })
                dispatch({
                    type: IS_ERROR,
                    payload: error
                })
                dispatch({
                    type: IS_LOADING,
                    payload: true
                })
            })

    } catch (error) {
        dispatch({
            type: IS_ERROR,
            payload: error
        })

        dispatch({
            type: SAVE_INQUERY_ERROR,
            payload: error
        })

        dispatch({
            type: SAVE_INQUERY_LOADING,
            payload: false
        })
        dispatch({
            type: IS_LOADING,
            payload: false
        })

    }
}

export const getInqueryHistory = (body) => async (dispatch) => {
    try {
        dispatch({
            type: IS_LOADING,
            payload: true
        })

        dispatch({
            type: GET_INQUERY_HISTORY_LOADING,
            payload: true
        })

        await ApiGet(`${endPoints.getinquiriesbyuser}/${body.userid}/${body.isComplete}`)
            .then((res) => {
                dispatch({
                    type: GET_INQUERY_HISTORY,
                    payload: res
                })
                dispatch({
                    type: GET_INQUERY_HISTORY_LOADING,
                    payload: false
                })
                dispatch({
                    type: IS_LOADING,
                    payload: false
                })

            }).catch((err) => {
                dispatch({
                    type: GET_INQUERY_HISTORY_ERROR,
                    payload: err
                })
                dispatch({
                    type: IS_LOADING,
                    payload: false
                })
                dispatch({
                    type: IS_ERROR,
                    payload: err
                })

            })

    } catch (error) {
        dispatch({
            type: IS_ERROR,
            payload: error
        })
        dispatch({
            type: GET_INQUERY_HISTORY_ERROR,
            payload: error
        })

        dispatch({
            type: GET_INQUERY_HISTORY_LOADING,
            payload: false
        })
        dispatch({
            type: IS_LOADING,
            payload: false
        })

    }
}

export const getInqueryByID = (inquiryId,userId) => async (dispatch) => {
    try {
        dispatch({
            type: IS_LOADING,
            payload: true
        })


        dispatch({
            type: GET_INQUERY__BY_ID_LOADING,
            payload: true
        })

        await ApiGet(`${endPoints.getinquiriebyid}/${inquiryId}/${userId}`)
            .then((res) => {
                dispatch({
                    type: GET_INQUERY_BY_ID,
                    payload: res
                })
                dispatch({
                    type: GET_INQUERY__BY_ID_LOADING,
                    payload: false
                })
                dispatch({
                    type: IS_LOADING,
                    payload: false
                })

            }).catch((err) => {
                dispatch({
                    type: GET_INQUERY__BY_ID_ERROR,
                    payload: err
                })
                dispatch({
                    type: IS_LOADING,
                    payload: false
                })
                dispatch({
                    type: IS_ERROR,
                    payload: err
                })

            })

    } catch (error) {
        dispatch({
            type: IS_ERROR,
            payload: error
        })
        dispatch({
            type: GET_INQUERY__BY_ID_ERROR,
            payload: error
        })

        dispatch({
            type: GET_INQUERY__BY_ID_LOADING,
            payload: false
        })
        dispatch({
            type: IS_LOADING,
            payload: false
        })

    }
}