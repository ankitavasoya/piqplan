import { Checkbox, Container, FormControlLabel, Grid } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import HomeHero from '../../assets/images/home-hero-bg.png'
import { useLocation } from 'react-router-dom'
import VideoImg from '../../assets/images/video-img.png'
import Contactus from '../../assets/images/contact-us-componen.png'
import Caard1 from '../../assets/images/learn-cards-1.png'
import Caard2 from '../../assets/images/learn-cards-2.png'
import ProductSide from '../../assets/images/product.png'
import CaptchaPopup from '../../components/common/CaptchaPopup'
import { useDispatch, useSelector } from 'react-redux'
import { saveContact } from '../../redux/actions/contactUsAction';
import { PICK_DATE, POPUP_TIMER } from '../../helper/utils';
import swal from 'sweetalert';
import { Button } from '@mui/material'
import $ from "jquery";
const MarketsServed = () => {

    const location = useLocation()

    useEffect(() => {
        $('html, body').animate({
            scrollTop: $(`${location.hash}`).offset()?.top - 140
        }, 500);
    }, [location.hash])

    const openInNewTab = url => {
        window.open(url, '_blank');
    };
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
       /*  if (contactData?.phoneno === "" || contactData?.phoneno === "+1" || contactData?.phoneno === undefined) {
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
    return (
        <>
            <div className='home-main'>
                <div className='hero-content' style={{ backgroundImage: `url(${HomeHero})` }} id="home">
                    <div className='hero-text'>
                        <Container maxWidth="lg" style={{ margin: 'auto', height: '100%' }} >
                            {/* <h1>Online Medicare</h1> */}
                            <h3>“Simplify Member Enrollment and Turbocharge Your Medicare Sales Enablement with PiqPlan”</h3>
                            <Button onClick={() => openInNewTab('/piqplan-medicare')} style={{ marginTop: '20px' }} variant="contained" className='primary-button p-16-60 max-h-54'>Get Started</Button>
                        </Container>
                    </div>
                </div>
                <div className='w-80 mx-auto' id='solutions'>
                    <div className='video-component'>
                        <h1 className='title'>PiqPlan ComparisonDB</h1>
                        <h6 className='text'>Shopping, Recommending, Quoting, Enrollment, Retention--Simplify Member Engagement</h6>
                        <h6 className='text' style={{ color: '#4197F7', cursor: 'pointer' }} onClick={() => openInNewTab('/piqplan-medicare')} >Get Started</h6>
                        <img src={VideoImg} alt='' width="100%" />
                    </div>
                    <div className='get-demo' style={{ marginBottom: "80px" }}>
                        <Grid container>
                            <Grid item lg={5} md={12} sm={12}>
                                <div className='text'>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                </div>
                            </Grid>
                            <Grid item lg={7} md={12} sm={12}>
                                <div style={{ display: 'flex', columnGap: '24px', rowGap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                    <div style={{ flex: 'auto' }}>
                                        <input placeholder='Email id' />
                                        {/* <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" style={{ width: '100%', margin: '0px' }}>
                                            <OutlinedInput
                                                style={{ width: '100%', margin: '0px' }}
                                                id="outlined-adornment-weight"
                                                value={""}
                                                onChange={() => { }}
                                                placeholder="Email id"
                                                aria-describedby="outlined-weight-helper-text"
                                            />
                                        </FormControl> */}
                                    </div>
                                    <div style={{ width: '226px' }}>
                                        <Button onClick={() => { }} style={{}} variant="contained" className='primary-button p-16-60 max-h-54'>Get a Demo</Button>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                    <div className='contact-us-componen'>
                        <Grid container spacing={8}>
                            <Grid item lg={8}>
                                <div className='detail'>
                                    <h1 className='title'>Digital Solutions for Medicare Shopping, Quoting, Enrollment and Retention</h1>
                                    <p className='' style={{ marginTop: "20px" }}>Hosted and API solutions for health plans, large FMOs/agencies, call centers and others.  Our PlanCompare ONE platform ensures beneficiaries have an optimal customer experience (with no cost surprises) when finding their best fit Medicare plans.</p>
                                    <p>Small to mid-sized agencies get the same exceptional features of PlanCompare ONE with Medicare Edge. Ideal for agencies with more than 500 Medicare enrollments annually.</p>
                                    <Button onClick={() => { }} style={{ marginTop: "25px" }} variant="contained" className='primary-button p-16-32'>Contact us</Button>
                                </div>
                            </Grid>
                            <Grid item lg={4}>
                                <div>
                                    <img src={Contactus} alt="" width="100%" />
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                    <div className='learn' id='learn'>
                        <h1 className='title'>Learn</h1>
                        <div className='learn-cards'>
                            <Grid container spacing={3}>
                                <Grid item lg={4}>
                                    <div className='card'>
                                        <img src={Caard1} alt="" width="100%" />
                                        <h2>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. </h2>
                                        <Button onClick={() => { }} style={{ marginTop: "25px" }} variant="contained" className='primary-button p-16-32 max-h-54'>Read more</Button>
                                    </div>
                                </Grid>
                                <Grid item lg={4}>
                                    <div className='card'>
                                        <img src={Caard2} alt="" width="100%" />
                                        <h2>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. </h2>
                                        <Button onClick={() => { }} style={{ marginTop: "25px" }} variant="contained" className='primary-button p-16-32 max-h-54'>Read more</Button>
                                    </div>
                                </Grid>
                                <Grid item lg={4}>
                                    <div className='card'>
                                        <img src={Caard1} alt="" width="100%" />
                                        <h2>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. </h2>
                                        <Button onClick={() => { }} style={{ marginTop: "25px" }} variant="contained" className='primary-button p-16-32 max-h-54'>Read more</Button>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </div>
                <div className='product-main' style={{ marginTop: "100px" }} id='company' >
                    <div className='product-content' style={{ height: '100%' }}>
                        <Grid container style={{ alignItems: "center", height: "100%" }}>
                            <Grid item lg={7} md={12}>
                                <div className='product-data'>
                                    <h4 className='title'>
                                        Your Medicare One-Stop-Shop
                                    </h4>
                                    <h6 className='sub-title'>
                                        Your guide to Medicare Parts A & B, Medicare Advantage, and Medigap 100% free.
                                    </h6>
                                    <Grid container spacing={2} style={{ marginTop: "20px" }}>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <input
                                                name="fullname"
                                                type="text"
                                                value={contactData.fullname}
                                                placeholder="Full Name"
                                                // style={{ minWidth: "310px" }}
                                                className='enrollment-section-input experience-input w-90'
                                                 onChange={(e) => onChnageHandler(e)} 
                                            />
                                            {(errorMessage.fullname) ? <span className='input-error'>{errorMessage.fullname}</span> : ''}
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <input
                                                name="email"
                                                type="text"
                                                value={contactData.email}
                                                placeholder="Email"
                                                // style={{ minWidth: "310px" }}
                                                className='enrollment-section-input experience-input w-90'
                                                 onChange={(e) => onChnageHandler(e)} 
                                            />
                                            {(errorMessage.email) ? <span className='input-error'>{errorMessage.email}</span> : ''}
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <input
                                                name="phoneno"
                                                type="text"
                                                value={contactData.phoneno}
                                                placeholder="Phone No"
                                                // style={{ minWidth: "310px" }}
                                                className='enrollment-section-input experience-input w-90'
                                                 onChange={(e) => onChnageHandler(e)} 
                                            />
                                            {(errorMessage.phoneno) ? <span className='input-error'>{errorMessage.phoneno}</span> : ''}
                                        </Grid>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <input
                                                name="companyname"
                                                type="text"
                                                value={contactData.companyname}
                                                placeholder="Company Name"
                                                // style={{ minWidth: "310px" }}
                                                className='enrollment-section-input experience-input w-90'
                                                 onChange={(e) => onChnageHandler(e)} 
                                            />
                                            {(errorMessage.companyname) ? <span className='input-error'>{errorMessage.companyname}</span> : ''}
                                        </Grid>
                                        <Grid item lg={6} md={12} sm={12} xs={12}>
                                            <input
                                                name="message"
                                                type="text"
                                                value={contactData.message}
                                                placeholder="Message"
                                                // style={{ minWidth: "310px" }}
                                                className='enrollment-section-input experience-input w-90'
                                                 onChange={(e) => onChnageHandler(e)} 
                                            />
                                            {(errorMessage.message) ? <span className='input-error'>{errorMessage.message}</span> : ''}
                                        </Grid>
                                    </Grid>
                                    <div className='product-data-buttons'>
                                        <Button className='primary-button p-16-32'  onClick={() => submitContact()} variant="contained">Submit</Button>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item lg={5} style={{ height: "100%" }} className="">
                                <div className='' style={{ height: "100%", textAlign: 'end' }}>
                                    <img src={ProductSide} className="" height="100%" alt='' />
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </div>
                <div className='learn' style={{ width: "90vw", margin: "40px auto" }} id="markets-served">
                    <h1 className='title' style={{ marginBottom: '50px' }}>Markets Served</h1>
                    <div className='markets-served'>
                        <div className='markets-served-header plan-card-title'
                        >
                            <div>
                                <h4>Health Plans</h4>
                                <h3>“Acquire new members with marketplace tools to help existing and prospective members find their best Medicare plan”</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><p>Star rating: </p><span style={{ width: 'fit-content' }}> 3 out of 5 stars</span></div>
                            </div>
                        </div>
                        <div className='markets-served-body'>
                            <Grid container spacing={2} >
                                <Grid item lg={7} >
                                    <div>
                                        <div className='lable'>
                                            MONTHLY PREMIUM
                                        </div>
                                        <div className='data p-16'>
                                            <h4>$10</h4>
                                            <div style={{ width: "60%" }}>
                                                <h6>Includes: Health & drug coverage</h6>
                                                <h6>Doesn't include: $170.10 Standard Part B premium</h6>
                                            </div>
                                        </div>
                                        <div className='lable'>
                                            YEARLY DRUG & PREMIUM COST
                                        </div>
                                        <div className='data p-16'>
                                            <h4>$10</h4>
                                            <h6>Includes: Only includes premiums for the months left in this year when you don't enter any drugs</h6>
                                        </div>
                                        <div className='lable'>
                                            OTHER COSTS
                                        </div>
                                        <div className='p-16'>
                                            <div className='data other-costs'>
                                                <h4>Drug</h4>
                                                <h6>$200 per year for Part D prescription drugs except for drugs listed on Tier 1, Tier 2, Tier 3 which are excluded from the</h6>
                                            </div>
                                            <div className='data other-costs mt-10'>
                                                <h4>Deductible</h4>
                                                <h6>deductible.</h6>
                                            </div>
                                            <div className='data other-costs mt-10'>
                                                <h4>Rx Copay</h4>
                                                <h6>$0 - $100</h6>
                                            </div>
                                            <div className='data other-costs mt-10'>
                                                <h4>Rx Coins</h4>
                                                <h6>29%</h6>
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={5} >
                                    <div>
                                        <div className='lable'>
                                            PLAN BENEFITSS
                                        </div>
                                        <div className='p-16 plan-benefitss'>
                                            <h4>Transportation</h4>
                                            <h6 className='mt-10'>InNetwork: Not covered, but see brochure for optional supplemental benefits</h6>
                                            <h4 className='mt-10'>Emergency Room</h4>
                                            <h6 className='mt-10'>$90</h6>
                                            <h4 className='mt-10'>Urgent Care</h4>
                                            <h6 className='mt-10'>$0 - $65 copay per visit</h6>
                                            <h4 className='mt-10'>Ambulance</h4>
                                            <h6 className='mt-10'>InNetwork: $250 copay</h6>
                                        </div>
                                        <div className='lable'>
                                            DRUGS
                                        </div>
                                        <div className='p-16'>
                                            <h6>Enter drugs you take regularly (if any) to see your estimated drug + premium cost</h6>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid >
                            <div className='plan-card-footer'>
                                <div className='plan-card-footer-inner'>
                                    <Button className='primary-button p-16-60' variant="contained">Enroll</Button>
                                    <Button className='primary-outline-button p-16-60' variant='outlined'>Compare</Button>
                                    <FormControlLabel control={<Checkbox name="compare" />} label="Add to compare" />
                                </div>
                            </div>
                        </div >
                    </div >
                </div >
            </div>
            {showCaptcha && <CaptchaPopup name="CotactUs" open={showCaptcha} handleClose={() => setShowCaptcha(false)} verifyCaptcha={(e) => verifyCaptcha(e)} />}
        </>
    )
}

export default MarketsServed