import { endPoints } from "../../config/endPoints"
import { ApiPost } from "../../helper/API/ApiData"
import { SAVE_CONTACT_US_LOADING, SAVE_CONTACT_US, SAVE_CONTACT_US_ERROR} from "../type";

export const saveContact = (body) => async (dispatch) => {
    try {
        dispatch({
            type: SAVE_CONTACT_US_LOADING,
            payload: true
        })

        await ApiPost(endPoints.saveContact, body)
            .then((res) => {
                dispatch({
                    type: SAVE_CONTACT_US,
                    payload: res
                })
                dispatch({
                    type: SAVE_CONTACT_US_LOADING,
                    payload: false
                })
            }).catch((error) => {
                dispatch({
                    type: SAVE_CONTACT_US_ERROR,
                    payload: error
                })
            })

    } catch (error) {
        dispatch({
            type: SAVE_CONTACT_US_ERROR,
            payload: error
        })

        dispatch({
            type: SAVE_CONTACT_US_LOADING,
            payload: false
        })
    }
}