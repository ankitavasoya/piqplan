import { IS_ERROR } from '../type'

export const setIsLoginPopup = (value) => (dispatch) => {
    dispatch({
        type: IS_ERROR,
        payload: value,
    })
}