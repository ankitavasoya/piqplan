import { endPoints } from "../../config/endPoints"
import { ApiPost } from "../../helper/API/ApiData"
import { GET_PLANS, GET_PLANS_BY_PLAN_ID_LOADING, GET_PLANS_DETAILS, GET_PLANS_ERROR, GET_PLANS_LOADING, GET_PLAN_BY_PLAN_ID_ERROR, IS_ERROR, IS_LOADING } from "../type"

export const getAllPlans = (body) => async (dispatch) => {
    try {
        dispatch({
            type: IS_LOADING,
            payload: true
        })

        // dispatch({
        //     type: GET_PLANS_LOADING,
        //     payload: true
        // })

        await ApiPost(endPoints.getifpquote, body)
            .then((res) => {
                dispatch({
                    type: GET_PLANS,
                    payload: res
                })
                // dispatch({
                //     type: GET_PLANS_LOADING,
                //     payload: false
                // })

                dispatch({
                    type: IS_LOADING,
                    payload: false
                })
            }).catch((error) => {
                dispatch({
                    type: IS_ERROR,
                    payload: error
                })
            })

    } catch (error) {
        dispatch({
            type: GET_PLANS_ERROR,
            payload: error
        })

        // dispatch({
        //     type: GET_PLANS_LOADING,
        //     payload: false
        // })

        dispatch({
            type: IS_ERROR,
            payload: error
        })

        dispatch({
            type: IS_LOADING,
            payload: false
        })
    }
}

export const getPlanDetailsByPlanId = (body) => async (dispatch) => {
    try {
        dispatch({
            type: IS_LOADING,
            payload: true
        })

        dispatch({
            type: GET_PLANS_BY_PLAN_ID_LOADING,
            payload: true
        })

        await ApiPost(endPoints.getifpquote, body)
            .then((res) => {
                dispatch({
                    type: GET_PLANS_DETAILS,
                    payload: res
                })
                dispatch({
                    type: GET_PLANS_BY_PLAN_ID_LOADING,
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
            type: GET_PLAN_BY_PLAN_ID_ERROR,
            payload: error
        })

        dispatch({
            type: GET_PLANS_BY_PLAN_ID_LOADING,
            payload: false
        })

        dispatch({
            type: IS_LOADING,
            payload: false
        })
    }
}