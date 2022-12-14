import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux'
import { Button, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { authenticate, regiSter } from '../../redux/actions/accountAction';
import AuthStorage from '../../helper/AuthStorage';
import STORAGEKEY from '../../config/APP/app.config';
import { POPUP_TIMER } from '../../helper/utils';
//import { toast } from 'material-react-toastify';
import swal from 'sweetalert';
import { POST_REGISTER, POST_REGISTER_ERROR, SAVE_AUTHDATA, SAVE_AUTHENTDATA_ERROR } from '../../redux/type';
import $ from "jquery";
import { setIsLoading } from '../../redux/actions/loadingAction';
import CaptchaPopup from '../../components/common/CaptchaPopup';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loginCaptchaRef = useRef()
    const registerCaptchaRef = useRef()

    const [register, setRegister] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        phone: "+1",
        roles: 'agent',
        npn: "",
    })
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    })
    const [formErrors, setFormErrors] = useState()
    const [formError, setFormError] = useState()
    const [showLoginCaptcha, setShowLoginCaptcha] = useState(false)
    const [showRegistrationCaptcha, setShowRegistrationCaptcha] = useState(false)
    const isLoading = useSelector((state) => state.loading.loading)
    const authData = useSelector((state) => state.registerData.saveAuthData)
    const authDataError = useSelector((state) => state.registerData.saveAuthError)
    const registerData = useSelector((state) => state.registerData.register)
    const registerDataError = useSelector((state) => state.registerData.registerError)

    useEffect(() => {
        $(document).ready(function () {
            $(window).scrollTop(0);
        });
    }, [])


    /*  useEffect(() => {
         const data = authData?.Claim?.UserRoles?.map((item) => item.Roleid);
         if (data?.includes(2) || data?.includes(3)) {
             // navigate('/')
             var getCurrentUrl = AuthStorage.getStorageData(STORAGEKEY.currentUrl)
             if (getCurrentUrl) {
                 navigate(getCurrentUrl)
             }
             else {
                 navigate('/')
             }
         }
     }, [authData]) */

    useEffect(() => {
        if (authData) {
            const data = authData?.Claim?.UserRoles?.map((item) => item.Rolename.toLowerCase());
            if (!(data?.includes('user') || data?.includes('agent'))) {
                dispatch({
                    type: SAVE_AUTHDATA,
                    payload: null,
                })
                //toast.error("User not found")
                swal("Failed", "User not found", "error", {
                    timer: POPUP_TIMER,
                });
            }
            else {
                var getCurrentUrl = AuthStorage.getStorageData(STORAGEKEY.currentUrl)
                dispatch({
                    type: SAVE_AUTHDATA,
                    payload: null,
                })
                if (getCurrentUrl) {
                    navigate(getCurrentUrl)
                    swal({
                        title: "Success",
                        text: "You are logged in successfully!",
                        icon: "success",
                        buttons: "Ok",
                        timer: POPUP_TIMER
                    })
                }
                else {
                    navigate('/')
                    swal({
                        title: "Success",
                        text: "You are logged in successfully!",
                        icon: "success",
                        buttons: "Ok",
                        timer: POPUP_TIMER
                    })
                }
            }
        }
    }, [authData])

    useEffect(() => {
        if (registerData) {
            const emaptyData = {
                firstname: "",
                lastname: "",
                email: "",
                password: "",
                phone: "+1",
                roles: 'agent',
                npn: "",
            }
            setRegister(emaptyData)
            //toast.success("Verification email has been sent")
            swal("Success", "Verification email has been sent", "success", {
                timer: POPUP_TIMER,
            });
            dispatch({
                type: POST_REGISTER,
                payload: null
            })
        }
    }, [registerData])

    useEffect(() => {
        if (registerDataError) {
            //toast.error("Registration failed.")
            swal("Failed", "Registration failed.", "error", {
                timer: POPUP_TIMER,
            });
            dispatch({
                type: POST_REGISTER_ERROR,
                payload: null
            })
        }
    }, [registerDataError])

    useEffect(() => {
        if (authDataError) {
            if (authDataError && authDataError.StatusCode === 500) {
                //toast.error("User not verified")
                swal("Failed", "User not verified", "error", {
                    timer: POPUP_TIMER,
                });
            }
            else if (authDataError && authDataError != null) {
                swal("Failed", authDataError, "error", {
                    timer: POPUP_TIMER,
                });
                //toast.error(authDataError);
            }
            dispatch({
                type: SAVE_AUTHENTDATA_ERROR,
                payload: null,
            })
        }
    }, [authDataError])

    const onChnageHandle = (e, name) => {
        if (name === 'phone' && (e.target.value === "+1" || e.target.value === "+" || e.target.value === "")) {
            setRegister({ ...register, [name]: (e.target.value === "+" || e.target.value === "") ? "+1" : e.target.value })
            setFormErrors({ ...formErrors, [name]: "" })
        } else {
            if (name === 'phone' && !e.target.value.includes("+1")) {
                setRegister({ ...register, [name]: "+1" + e.target.value?.replace("+", "") })// newData[index].userInputValue = "+1" + e.target.value?.replace("+", "")
            }
            else {
                setRegister({ ...register, [name]: e.target.value })
            }
            setFormErrors({ ...formErrors, [name]: "" })
        }
        setRegister({ ...register, [name]: e.target.value })
        setFormErrors({ ...formErrors, [name]: "" })
    }

    const handleChange = (e, name) => {
        setLoginData({ ...loginData, [name]: e.target.value })
        setFormError({ ...formError, [name]: "" })
    }

    const saveData = () => {
        if (valiDation()) {
            dispatch(setIsLoading(false));
            return;
        }
        setShowRegistrationCaptcha(true)
    }

    const submit = () => {
        if (validations()) {
            dispatch(setIsLoading(false));
            return;
        }
        setShowLoginCaptcha(true)
    }

    const validations = () => {
        dispatch(setIsLoading(true));
        let flag = false
        const error = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!loginData.email) {
            error.email = "Enter email address"
            flag = true;
        }
        if (loginData.email && !loginData.email.match(regex)) {
            error.email = "Please enter a valid email address";
            flag = true;
        }
        if (!loginData.password) {
            error.password = "Enter password";
            flag = true;
        }
        setFormError(error);
        return flag
    }

    const valiDation = () => {
        dispatch(setIsLoading(true));
        let flag = false
        const error = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        const regexPhone = /^\+?([1]{1})([0-9]{10})$/;

        if (!register.firstname) {
            error.firstname = "Enter First Name"
            flag = true
        }
        if (!register.lastname) {
            error.lastname = "Enter Last Name"
            flag = true
        }
        if (!register.email) {
            error.email = "Enter Email"
            flag = true
        }
        if (register.email && !register.email.match(regex)) {
            error.email = 'Please enter a valid Email';
            flag = true;
        }
        if (!register.password) {
            error.password = 'Enter Password'
            flag = true
        }
        if (register.phone && register.phone !== "+1") {
            if (!regexPhone.test(register.phone)) {
                error.phone = 'Please enter a valid phone number';
                flag = true
            }
        }
        if (register.roles === 'agent') {
            if (!register.npn) {
                error.npn = "Enter Npn"
                flag = true
            }
        }
        setFormErrors(error);
        return flag
    }

    const verifyCaptcha = (data) => {
        if (data?.verified) {
            if (data?.name === "Registration") {
                const body = {
                    firstname: register.firstname,
                    lastname: register.lastname,
                    email: register.email,
                    password: register.password,
                    roles: register.roles,
                    npn: register.npn,
                    phone: register.phone === "+1" ? '' : register.phone,
                }
                dispatch(regiSter(body))
            }
            if (data?.name === "Login") {
                const body = {
                    email: loginData.email,
                    password: loginData.password,
                }
                dispatch(authenticate(body))
            }
        }
    }

    return (
        <>
            <div className='welcome-bg'>
                <div className='welcome-content'>
                    <div className='welcome-title'>
                        <h1 className='title'>Welcome to Piqplan</h1>
                        <div className='login'>
                            <h2 className='title'>Log in</h2>
                            <h6 className='text'>Lorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy and typesetting industry.</h6>
                            <form>
                                <div className='error-main'>
                                    <label className='login-lable'>User Name</label>
                                    <input placeholder='User Name' type="text" className="login-input" name='email' value={loginData.email} style={{ marginBottom: '24px' }} onChange={(e) => handleChange(e, "email")} />
                                    {formError?.email && <p className='error-text'>{formError.email}</p>}
                                </div>

                                <div className='error-main'>
                                    <label className='login-lable'>Password</label>
                                    <input placeholder='Password' type="password" className="login-input" name='password' value={loginData.password} style={{ marginBottom: '24px' }} onChange={(e) => handleChange(e, "password")} />
                                    {formError?.password && <p className='error-text'>{formError.password}</p>}
                                </div>
                            </form>
                            <div style={{ textAlign: 'end', marginBottom: '24px' }}>
                                <a className='forgot-password'>Forgot Password ?</a>
                            </div>
                            <Button disabled={isLoading} className='login-btn' onClick={() => submit()} >Log in</Button>
                        </div>
                    </div>
                    <div className='border-div'></div>
                    <div>
                        <div className='login create-account'>
                            <h2 className='title'>Create new account</h2>
                            <h6 className='text'>Lorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy and typesetting industry.</h6>
                            <form>
                                <div className='select-role'>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                    >
                                        <FormControlLabel value="agent" name="roles" checked={register.roles === "agent"} control={<Radio />} label="Agent" onChange={(e) => onChnageHandle(e, "roles")} />
                                        <FormControlLabel value="user" name="roles" checked={register.roles === "user"} control={<Radio />} label="User" onChange={(e) => onChnageHandle(e, "roles")} />
                                    </RadioGroup>
                                </div>
                                <div className='error-main'>
                                    <label className='login-lable'>First Name</label>
                                    <input placeholder='First Name' type="text" className="login-input" name='firstname' value={register.firstname} onChange={(e) => onChnageHandle(e, "firstname")} style={{ marginBottom: '24px' }} />
                                    {formErrors?.firstname && <p className='error-text'>{formErrors.firstname}</p>}
                                </div>
                                <div className='error-main'>
                                    <label className='login-lable'>Last Name</label>
                                    <input placeholder='Last Name' type="text" className="login-input" name='lastname' value={register.lastname} onChange={(e) => onChnageHandle(e, "lastname")} style={{ marginBottom: '24px' }} />
                                    {formErrors?.lastname && <p className='error-text'>{formErrors.lastname}</p>}
                                </div>
                                <div className='error-main'>
                                    <label className='login-lable'>Email</label>
                                    <input placeholder='Email' type="email" className="login-input" name="email" value={register.email} onChange={(e) => onChnageHandle(e, "email")} style={{ marginBottom: '24px' }} />
                                    {formErrors?.email && <p className='error-text'>{formErrors.email}</p>}
                                </div>

                                <div className='error-main'>
                                    <label className='login-lable'>Phone</label>
                                    <input placeholder='Phone' type='text' className="login-input" name="phone" value={register.phone} onChange={(e) => onChnageHandle(e, "phone")} style={{ marginBottom: '24px' }} />
                                    {formErrors?.phone && <p className='error-text'>{formErrors.phone}</p>}
                                </div>

                                <div className='error-main'>
                                    <label className='login-lable'>Password</label>
                                    <input placeholder='Password' type='password' className="login-input" name="password" value={register.password} onChange={(e) => onChnageHandle(e, "password")} style={{ marginBottom: '24px' }} />
                                    {formErrors?.password && <p className='error-text'>{formErrors.password}</p>}
                                </div>
                                <div>
                                    {register.roles === 'agent' ?
                                        <div className='error-main'>
                                            <label className='login-lable'>Npn</label>
                                            <input placeholder='Npn' type='text' className="login-input" name="npn" value={register.npn} onChange={(e) => onChnageHandle(e, "npn")} style={{ marginBottom: '24px' }} />
                                            {formErrors?.npn && <p className='error-text'>{formErrors.npn}</p>}
                                        </div>
                                        : <></>
                                    }

                                </div>
                            </form>
                            <Button disabled={isLoading} onClick={() => saveData()} className='login-btn'>Create account</Button>
                        </div>
                    </div>
                </div>
            </div>
            {showLoginCaptcha && <CaptchaPopup name="Login" open={showLoginCaptcha} handleClose={() => setShowLoginCaptcha(false)} verifyCaptcha={(e) => verifyCaptcha(e)} />}
            {showRegistrationCaptcha && <CaptchaPopup name="Registration" open={showRegistrationCaptcha} handleClose={() => setShowRegistrationCaptcha(false)} verifyCaptcha={(e) => verifyCaptcha(e)} />}

        </>
    )
}

export default Login