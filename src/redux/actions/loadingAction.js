import { IS_LOADING } from '../type'

export const setIsLoading = (value) => (dispatch) => {
    dispatch({
        type: IS_LOADING,
        payload: value,
    })
}