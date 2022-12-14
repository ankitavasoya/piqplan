import { endPoints } from "../../config/endPoints"
import { ApiPost } from "../../helper/API/ApiData"
import { ELIGIBLECHECK, ELIGIBLECHECK_ERROR, ELIGIBLECHECK_LOADING, IS_LOADING } from "../type"

export const eligiblecheck = (body) => async (dispatch) => {
    try {
        dispatch({
            type: IS_LOADING,
            payload: true
        })
        dispatch({
            type: ELIGIBLECHECK_LOADING,
            payload: true
        })

        await ApiPost(endPoints.eligiblecheck, body)
            .then((res) => {
                dispatch({
                    type: ELIGIBLECHECK,
                    payload: res
                })
                dispatch({
                    type: IS_LOADING,
                    payload: false
                })
            }).catch((error) => {
                console.log(error)
                dispatch({
                    type: ELIGIBLECHECK_ERROR,
                    payload: error
                })
                dispatch({
                    type: IS_LOADING,
                    payload: false
                })
            })

        dispatch({
            type: ELIGIBLECHECK_LOADING,
            payload: false
        })

    } catch (error) {
        dispatch({
            type: IS_LOADING,
            payload: false
        })

        dispatch({
            type: ELIGIBLECHECK_ERROR,
            payload: error
        })

        dispatch({
            type: ELIGIBLECHECK_LOADING,
            payload: false
        })
    }
}