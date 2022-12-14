import React, { useEffect, useRef, useState } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { LoadCanvasTemplate, loadCaptchaEnginge, validateCaptcha } from 'react-simple-captcha';
import { setIsLoading } from '../../redux/actions/loadingAction';
import { useDispatch } from 'react-redux';

const CaptchaPopup = ({ name, handleClose, open, verifyCaptcha }) => {
    const dispatch = useDispatch()
    const [captchaVal, setCaptchaVal] = useState('')
    const [captchaValErr, setCaptchaValErr] = useState('')
    useEffect(() => {
        if(open){
            dispatch(setIsLoading(true));
            setTimeout(() => {
                loadCaptchaEnginge(6,"#83b4eba1");
                dispatch(setIsLoading(false));
            }, 1500);
        }
    }, [open])

    const validCaptcha = () => {
        let flag = true
        if (validateCaptcha(captchaVal) === true) {
            verifyCaptcha({ verified: true, name: name })
            handleClose()
            loadCaptchaEnginge(6,"#83b4eba1");
            setCaptchaVal("")
        } else {
            if (captchaVal) {
                setCaptchaValErr("Please enter captcha!")
            } else {
                setCaptchaValErr("Please enter valid captcha!")
            }
            setCaptchaVal("")
            flag = false
        }
        return flag
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className='add-doctor-dialog captcha-verification'
            >
                <DialogTitle id="alert-dialog-title">
                    {"Captcha Verification"}
                </DialogTitle>
                <DialogContent className='add-doctor-body' style={{ borderTop: "1px solid rgb(205 205 205)" }}>
                    <div className="captcha-code">
                    <h6 className='captcha-text'>Type the characters you see in the image into the text box.</h6>
                        <LoadCanvasTemplate />
                        <div className='error-main'>
                            <label className='login-lable'></label>
                            <input className="login-input" placeholder="Enter Captcha Value" id="user_captcha_input" value={captchaVal} name="user_captcha_input" type="text" onChange={(e) => setCaptchaVal(e.target.value)} />
                            {captchaValErr && <p className='cpatcha-error-text'>{captchaValErr}</p>}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions >
                    <Button
                        className='primary-outline-button p-16-60'
                        variant="outlined"
                        onClick={handleClose} autoFocus>
                        Cancel
                    </Button>
                    <Button
                        style={{ marginTop: "0px" }}
                        className='product-btn p-16-60'
                        variant="contained"
                        onClick={validCaptcha}>Verify</Button>
                </DialogActions>
            </Dialog>

        </>
    )
}

export default CaptchaPopup