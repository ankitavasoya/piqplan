import React, { useEffect } from 'react'
import Pages from '../pages'
import { useSelector } from 'react-redux'
import Spinner from '../components/common/Spinner';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import AuthStorage from '../helper/AuthStorage';
import STORAGEKEY from '../config/APP/app.config';
const Routes = () => {
    const isLoading = useSelector((state) => state.loading.loading)
    const isError = useSelector((state) => state.checkError.checkError)
    const navigate = useNavigate()

    useEffect(() => {
        if (isError) {
            if (isError.response?.status === 401) {
                swal({
                    title: "Your session has expired!",
                    text: "Kindly login again",
                    icon: "warning",
                    buttons: "Login",
                })
                    .then((value) => {
                        AuthStorage.deauthenticateUser();
                        navigate('/login')
                    });
            }
        }
    }, [isError])

    return (
        <>
            {isLoading && <Spinner />}
            <Pages />
        </>
    )
}

export default Routes