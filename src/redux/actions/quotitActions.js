import { endPoints } from "../../config/endPoints"
import { ApiGet, ApiPost } from "../../helper/API/ApiData"
import { SEARCHRX_DRUG, SEARCHRX_DRUG_LOADING, SEARCHRX_DRUG_ERROR, SEARCH_PCP, SEARCH_PCP_LOADING, SEARCH_PCP_ERROR, GET_ZIPCODE_LOADING, GET_ZIPCODE, GET_ZIPCODE_ERROR, SEARCH_PHARMACIES_LOADING, SEARCH_PHARMACIES, SEARCH_PHARMACIES_ERROR, IS_ERROR } from "../type"


export const searchrxdrug = (body) => async (dispatch) => {
    try {

        dispatch({
            type: SEARCHRX_DRUG_LOADING,
            payload: true
        })

        await ApiPost(endPoints.searchrxdrug, body)
            .then((res) => {
                dispatch({
                    type: SEARCHRX_DRUG,
                    payload: res
                })
            }).catch((error) => {
                dispatch({
                    type: SEARCHRX_DRUG_ERROR,
                    payload: error
                })
                dispatch({
                    type: IS_ERROR,
                    payload: error
                })
            })

        dispatch({
            type: SEARCHRX_DRUG_LOADING,
            payload: false
        })

    } catch (error) {

        dispatch({
            type: IS_ERROR,
            payload: error
        })

        dispatch({
            type: SEARCHRX_DRUG_ERROR,
            payload: error
        })

        dispatch({
            type: SEARCHRX_DRUG_LOADING,
            payload: false
        })
    }
}

export const searchpcp = (body) => async (dispatch) => {
    try {

        dispatch({
            type: SEARCH_PCP_LOADING,
            payload: true
        })

        await ApiPost(endPoints.searchpcp, body)
            .then((res) => {
                dispatch({
                    type: SEARCH_PCP,
                    payload: res
                })
            }).catch((error) => {
                dispatch({
                    type: SEARCH_PCP_ERROR,
                    payload: error
                })
                dispatch({
                    type: IS_ERROR,
                    payload: error
                })
            })

        dispatch({
            type: SEARCH_PCP_LOADING,
            payload: false
        })

    } catch (error) {

        dispatch({
            type: IS_ERROR,
            payload: error
        })

        dispatch({
            type: SEARCH_PCP_ERROR,
            payload: error
        })

        dispatch({
            type: SEARCH_PCP_LOADING,
            payload: false
        })
    }
}

export const validateZipcode = (body) => async (dispatch) => {
    try {

        dispatch({
            type: GET_ZIPCODE_LOADING,
            payload: true
        })

        await ApiPost(endPoints.getzipcodeinfo, body)
            .then((res) => {
                dispatch({
                    type: GET_ZIPCODE,
                    payload: res
                })
            }).catch((error) => {
                dispatch({
                    type: GET_ZIPCODE_ERROR,
                    payload: error
                })
                dispatch({
                    type: IS_ERROR,
                    payload: error
                })
            })

        dispatch({
            type: GET_ZIPCODE_LOADING,
            payload: false
        })

    } catch (error) {
        dispatch({
            type: IS_ERROR,
            payload: error
        })

        dispatch({
            type: GET_ZIPCODE_ERROR,
            payload: error
        })

        dispatch({
            type: GET_ZIPCODE_LOADING,
            payload: false
        })
    }
}


export const searchpharmacies = (body) => async (dispatch) => {
    try {

        dispatch({
            type: SEARCH_PHARMACIES_LOADING,
            payload: true
        })

        await ApiPost(endPoints.searchpharmacies, body)
            .then((res) => {
                dispatch({
                    type: SEARCH_PHARMACIES,
                    payload: res
                })
            }).catch((error) => {
                dispatch({
                    type: SEARCH_PHARMACIES_ERROR,
                    payload: error
                })
            })

        dispatch({
            type: SEARCH_PHARMACIES_LOADING,
            payload: false
        })

    } catch (error) {

        dispatch({
            type: SEARCH_PHARMACIES_ERROR,
            payload: error
        })

        dispatch({
            type: SEARCH_PHARMACIES_LOADING,
            payload: false
        })
    }
}
