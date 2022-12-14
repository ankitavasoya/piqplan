import STORAGEKEY from "../../config/APP/app.config"
import { endPoints } from "../../config/endPoints"
import { ApiGet, ApiPost } from "../../helper/API/ApiData"
import AuthStorage from "../../helper/AuthStorage"
import { IS_LOADING, POST_REGISTER, POST_REGISTER_LOADING, POST_REGISTER_ERROR, SAVE_AUTHDATA, SAVE_AUTHDATA_LOADING, SAVE_AUTHENTDATA_ERROR, PROFILE_LOADING, PROFILE, PROFILE_ERROR, IS_ERROR } from "../type"

export const regiSter = (body) => async (dispatch) => {
    try {
        dispatch({
            type: IS_LOADING,
            payload: true
        })

        dispatch({
            type: POST_REGISTER_LOADING,
            payload: true
        })

        await ApiPost(endPoints.register, body)
            .then((res) => {
                dispatch({
                    type: POST_REGISTER,
                    payload: res
                })
                dispatch({
                    type: IS_LOADING,
                    payload: false
                })
            }).catch((error) => {
                dispatch({
                    type: POST_REGISTER_ERROR,
                    payload: error
                })
                dispatch({
                    type: IS_ERROR,
                    payload: error
                })
                dispatch({
                    type: IS_LOADING,
                    payload: false
                })
            })

        dispatch({
            type: POST_REGISTER_LOADING,
            payload: false
        })

    } catch (error) {
        dispatch({
            type: IS_LOADING,
            payload: false
        })

        dispatch({
            type: IS_ERROR,
            payload: error
        })

        dispatch({
            type: POST_REGISTER_ERROR,
            payload: error
        })

        dispatch({
            type: POST_REGISTER_LOADING,
            payload: false
        })
    }
}

export const profile = (id) => async (dispatch) => {
    try {
        dispatch({
            type: IS_LOADING,
            payload: true
        })
        dispatch({
            type: PROFILE_LOADING,
            payload: true
        })

        await ApiGet(`${endPoints.getuserbyid}/${id}`)
            .then((res) => {
                dispatch({
                    type: PROFILE,
                    payload: res
                })
                dispatch({
                    type: IS_LOADING,
                    payload: false
                })
            }).catch((error) => {
                dispatch({
                    type: PROFILE_ERROR,
                    payload: error
                })
                dispatch({
                    type: IS_ERROR,
                    payload: error
                })
                dispatch({
                    type: IS_LOADING,
                    payload: false
                })
            })

        dispatch({
            type: PROFILE_LOADING,
            payload: false
        })

    } catch (error) {
        dispatch({
            type: IS_LOADING,
            payload: false
        })
        dispatch({
            type: IS_ERROR,
            payload: error
        })

        dispatch({
            type: PROFILE_ERROR,
            payload: error
        })

        dispatch({
            type: PROFILE_LOADING,
            payload: false
        })
    }
}

export const authenticate = (body) => async (dispatch) => {
    try {
        dispatch({
            type: IS_LOADING,
            payload: true
        })
        dispatch({
            type: SAVE_AUTHDATA_LOADING,
            payload: true
        })

        await ApiPost(endPoints.authenticate, body)
            .then((res) => {
                if (res.Succeeded === false) {
                    dispatch({
                        type: SAVE_AUTHENTDATA_ERROR,
                        payload: res.Failure.Message,
                    })
                    dispatch({
                        type: IS_LOADING,
                        payload: false
                    })
                }
                else {
                    dispatch({
                        type: SAVE_AUTHDATA,
                        payload: res
                    })
                    AuthStorage.setStorageData(STORAGEKEY.token, `bearer ${res.Token}`, true)
                    AuthStorage.setStorageJsonEncreptedData(STORAGEKEY.userData, res.Claim, true)
                    AuthStorage.setStorageData(STORAGEKEY.refreshToken, res.RefreshToken, true)
                    dispatch({
                        type: IS_LOADING,
                        payload: false
                    })
                }
            }).catch((error) => {
                dispatch({
                    type: SAVE_AUTHENTDATA_ERROR,
                    payload: error.response.data,
                })
                dispatch({
                    type: IS_LOADING,
                    payload: false
                })
            })

        dispatch({
            type: SAVE_AUTHDATA_LOADING,
            payload: false
        })

    } catch (error) {
        dispatch({
            type: IS_LOADING,
            payload: false
        })

        dispatch({
            type: SAVE_AUTHENTDATA_ERROR,
            payload: error
        })

        dispatch({
            type: SAVE_AUTHDATA_LOADING,
            payload: false
        })
    }
}