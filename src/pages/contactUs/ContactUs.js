import { Button, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Mail from '../../assets/images/contact-mail-btn.png'
import Phone from '../../assets/images/contact-phone-btn.png'
import Map from '../../assets/images/contact-map.png'
import CaptchaPopup from '../../components/common/CaptchaPopup'
import { useDispatch, useSelector } from 'react-redux'
import { saveContact } from '../../redux/actions/contactUsAction';
import { PICK_DATE, POPUP_TIMER } from '../../helper/utils';
import swal from 'sweetalert';
const ContactUs = () => {
    const dispatch = useDispatch()
    const [contactData, setContactData] = useState({
        fullname: "",
        email: "",
        phoneno: "+1",
        companyname: "",
        message: "",
    });
    const [errorMessage, setErrorMessage] = useState({
        fullname: "",
        email: "",
        phoneno: "",
        companyname: "",
        message: "",
    });
    const [showCaptcha, setShowCaptcha] = useState(false)
    const [contactform, setContactform] = useState([
        {
            name: 'fullname',
            lable: 'Full Name',
            placeholder: 'Full Name'
        },
        {
            name: 'email',
            lable: 'Email Id.',
            placeholder: 'Your Email'
        },
        {
            name: 'phoneno',
            lable: 'Phone No.',
            placeholder: 'Your Phone'
        },
        {
            name: 'companyname',
            lable: 'Company Name',
            placeholder: 'Company Name'
        },
    ]);

    const onChnageHandler = (e) => {
        if (e.target.name === "phoneno" && (e.target.value === "+1" || e.target.value === "+" || e.target.value === "")) {
            const val = (e.target.value === "+" || e.target.value === "") ? "+1" : e.target.value
            setContactData({ ...contactData, [e.target.name]: val })
        } else {
            setContactData({ ...contactData, [e.target.name]: e.target.value })
        }
    }
    const validation = () => {
        let flag = false;

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        const regexPhone = /^\+?([1]{1})([0-9]{10})$/;
        const err = {
            fullname: "",
            email: "",
            phoneno: "",
            message: "",
        }
        if (contactData?.fullname === "" || contactData?.fullname === undefined) {
            err.fullname = 'Please enter Full Name';
            flag = true;
        }
        if (contactData?.email === "" || contactData?.email === undefined) {
            err.email = 'Please enter Email';
            flag = true;
        }
        /* if (contactData?.phoneno === "" || contactData?.phoneno === "+1" || contactData?.phoneno === undefined) {
            err.phoneno = 'Please enter Phone No';
            flag = true;
        } */
        if (contactData?.email) {
            if (!contactData?.email.match(regex)) {
                err.email = 'Please enter a valid Email';
                flag = true;
            }
        }
        if (contactData?.phoneno && contactData?.phoneno != "+1") {
            if (!regexPhone.test(contactData?.phoneno)) {
                err.phoneno = 'Please enter a valid Phone No';
                flag = true;
            }
        }
        if (contactData?.message === "" || contactData?.message === undefined) {
            err.message = 'Please enter Message'

            flag = true;
        }
        setErrorMessage(err)
        return flag;
    };


    const submitContact = () => {
        if (validation()) {
            return
        }
        setShowCaptcha(true)
    }

    const verifyCaptcha = (data) => {
        if (data?.name === "CotactUs" && data.verified === true) {
            dispatch(saveContact(contactData))
            swal("Success", "Thanks for connecting us! We will be in touch with you shortly.", "success", {
                timer: POPUP_TIMER,
            });
        }
    }

    /*const contactform = [
        {
            name: 'fullname',
            lable: 'Frist Name',
            placeholder: 'Frist Name'
        },
        {
            name: 'email',
            lable: 'Email Id.',
            placeholder: 'Your Email'
        },
        {
            name: 'phoneno',
            lable: 'Phone No.',
            placeholder: 'Your Phone'
        },
    ] */

    return (
        <>
            <div className='contact-us-bg'>
                <div className='w-90 mx-auto contact-us-main'>
                    <Grid container spacing={5}>
                        <Grid item lg={7} md={6} sm={12} xs={12}>
                            <div className='detail'>
                                <h1>Thanks for your interest in Piqplan</h1>
                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
                                <div className='contact-btn'>
                                    <div className='button'>
                                        <img src={Mail} alt='' />
                                        <h5>Email : info@PiqPlan.com</h5>
                                    </div>
                                    <div className='button'>
                                        <img src={Phone} alt='' />
                                        <h5>Phone : 1-888-454-2383</h5>
                                    </div>
                                </div>
                                <div className='contact-map'>
                                    <img src={Map} />
                                </div>
                            </div>
                        </Grid>
                        <Grid item lg={5} md={6} sm={12} xs={12}>
                            <div className='form'>
                                {/* {
                                    contactform.map((item) => (
                                        <>
                                            <label>{item.lable}</label>
                                            <div className="contact-input">
                                                <input placeholder={item.placeholder}
                                                    name={item.name}
                                                    name={item.value}
                                                    onChange={(e) => onChnageHandler(e)} />
                                                {(errorMessage) ? <span className='input-error'>{item.errorMsg}</span> : ''}
                                            </div>
                                        </>
                                    ))
                                } */}
                                <label>Full Name</label>
                                <div className="contact-input">
                                    <input
                                        placeholder="Full Name"
                                        name="fullname"
                                        value={contactData.fullname}
                                        onChange={(e) => onChnageHandler(e)} />
                                    {(errorMessage.fullname) ? <span className='input-error'>{errorMessage.fullname}</span> : ''}
                                </div>
                                <label>Email</label>
                                <div className="contact-input">
                                    <input
                                        placeholder="Email"
                                        name="email"
                                        value={contactData.email}
                                        onChange={(e) => onChnageHandler(e)} />
                                    {(errorMessage.email) ? <span className='input-error'>{errorMessage.email}</span> : ''}
                                </div>
                                <label>Phone No</label>
                                <div className="contact-input">
                                    <input
                                        placeholder="Phone No"
                                        name="phoneno"
                                        value={contactData.phoneno}
                                        onChange={(e) => onChnageHandler(e)} />
                                    {(errorMessage.phoneno) ? <span className='input-error'>{errorMessage.phoneno}</span> : ''}
                                </div>
                                <label>Company Name</label>
                                <div className="contact-input">
                                    <input
                                        placeholder="Company Name"
                                        name="companyname"
                                        value={contactData.companyname}
                                        onChange={(e) => onChnageHandler(e)} />
                                    {(errorMessage.companyname) ? <span className='input-error'>{errorMessage.companyname}</span> : ''}
                                </div>
                                <label>Message</label>
                                <div className="contact-input">
                                    <textarea
                                        placeholder="Your Message"
                                        name="message"
                                        value={contactData.message}
                                        onChange={(e) => onChnageHandler(e)} />
                                    {(errorMessage.message) ? <span className='input-error'>{errorMessage.message}</span> : ''}
                                </div>
                                <Button onClick={() => submitContact()} className='submit-btn'>Submit</Button>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>
            {showCaptcha && <CaptchaPopup name="CotactUs" open={showCaptcha} handleClose={() => setShowCaptcha(false)} verifyCaptcha={(e) => verifyCaptcha(e)} />}
        </>
    )
}

export default ContactUs