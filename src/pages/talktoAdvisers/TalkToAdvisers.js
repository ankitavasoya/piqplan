import { Button, Grid, TextField } from '@mui/material'
import { CalendarPicker, LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers'
import React, { useState } from 'react'
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Scheduletime from '../../assets/images/schedule-time.png';
import Scheduledate from '../../assets/images/schedule-date.png';
import TalkToAdvisersDetail from '../../assets/images/TalkToAdvisersDetail.png';
import ReactDatePicker from 'react-datepicker';
import CaptchaPopup from '../../components/common/CaptchaPopup';

const TalkToAdvisers = () => {

    const [value, setValue] = React.useState(() => dayjs('2022-02-01T00:00'));

    const [date, setDate] = React.useState(dayjs('2022-04-07'));

    const [startDate, setStartDate] = useState(new Date());
    const [showCaptcha, setShowCaptcha] = useState(false)

    const ScheduleEvent = () => {
        // Here check only validation
        setShowCaptcha(true)
    }

    const verifyCaptcha = (data) => {
        if (data?.name === "TalkToAdvisor" && data.verified === true) {
            console.log("Cpatch verified", data);
            // API call for Schedule Event here
        }
    }

    return (
        <>
            <div className='talk-to-advisers' style={{ paddingTop: '50px' }}>
                <div className='schedule'>
                    <h1 className='title'>Talk to One of Our Licensed Advisers</h1>
                    <h6 className='description'>Chris Dingess, our Head of Insurance, or one of our other licensed advisers, can help you sort through the many Medicare Advantageand Medicare Supplement plans available to you. Choose a time below for us to call you back.</h6>
                    <div className='card'>
                        <div className='card-header' style={{ flexWrap: 'wrap', rowGap: '10px' }}>
                            <h3 className=''>Fair Square Medicare</h3>
                            <div className='header-time'>
                                <img src={Scheduletime} alt='' />
                                <h6>30min</h6>
                            </div>
                        </div>
                        <h1 className='card-title'>Talk to a Licensed Adviser</h1>
                        <div className='content'>
                            <h6>Our Licensed Advisers have been expertly trained by our CEO, Daniel Petkevich, and our other brokerage leaders with decades of Medicare experience. Fair Square Medicare is proud of our industry leading quality of service. 95% of our clients would recommend us to a friend or family member.</h6>
                            <h6>To speak with one of our Licensed Advisers, book a time using the calendar here, or call 888-454-2383 to have one of our receptionists book a time for you.</h6>
                            <h6>By providing your contact information, you are consenting to receive calls, text messages, and/or emails from a licensed insurance agent about Medicare Plans.</h6>
                        </div>
                        <a className='card-cookie'>Cookie settings</a>
                    </div>
                    <Grid container spacing={3}>
                        <Grid item xl={3} lg={5} md={6} sm={12} xs={12}>
                            <div className='card-2 date-picore'>
                                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <StaticDatePicker
                                        onChange={(newValue) => setValue(newValue)}
                                        value={value}
                                        renderInput={(params) => <TextField {...params} />}
                                        componentsProps={{
                                            actionBar: {
                                                actions: ['today'],
                                            },
                                        }}
                                    />
                                </LocalizationProvider> */}
                                {/* <CalendarPicker date={date} onChange={(newDate) => setDate(newDate)} /> */}
                                <ReactDatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    inline
                                />
                            </div>
                        </Grid>
                        <Grid item xl={9} lg={7} md={6} sm={12} xs={12}>
                            <div className='card-2'>
                                <div className='date-filter' >
                                    Friday, September 10
                                </div>
                                <div style={{ padding: '24px 0px', display: 'flex', flexWrap: 'wrap', columnGap: '15.5px', rowGap: '16px' }}>
                                    <Button className='time-button'>8:30 PM</Button>
                                    <Button className='time-button'>9:00 PM</Button>
                                    <Button className='time-button'>9:30 PM</Button>
                                    <Button className='time-button'>10:00 PM</Button>
                                    <Button className='time-button'>11:30 PM</Button>
                                    <Button className='time-button'>11:30 PM</Button>
                                </div>
                                <Button className='product-btn p-16-32' >Confirm</Button>
                            </div>
                        </Grid>
                    </Grid>
                </div>
                <div className='submit schedule'>
                    <div className='card'>
                        <div className='card-header' style={{ paddingBottom: '0px' }} >
                            <div>
                                <h3 className=''>Fair Square Medicare</h3>
                                <h1 className='card-title'>Talk to a Licensed Adviser</h1>
                            </div>
                            <div>
                                <div className='header-time submit'>
                                    <img src={Scheduletime} alt='' />
                                    <h6>30min</h6>
                                </div>
                                <div className='header-time submit' style={{ marginTop: '13px' }}>
                                    <img src={Scheduledate} alt='' />
                                    <h6>9:00pm - 9:30pm, Friday, September 30, 2022</h6>
                                </div>
                            </div>
                        </div>
                        <a className='card-cookie'>Cookie settings</a>
                    </div>
                    <div className='card detail'>

                        <Grid container >
                            <Grid item xl={8} lg={12} md={12}>
                                <h1 className='title' style={{ marginBottom: '32px' }}>Enter Details</h1>
                                <Grid container>
                                    <Grid item lg={6} md={12} sm={12} xs={12}>
                                        <div className='text-start enrollment-section-input-main' style={{ marginTop: '16px', display: 'flex', flexDirection: 'column' }}>
                                            <label className='schedule-submit-label'>Name</label>
                                            <input
                                                name={"name"}
                                                type="text"
                                                placeholder="Name"
                                                value={""}
                                                className='enrollment-section-input experience-input'
                                                style={{ width: '90%' }}
                                                onChange={() => { }}
                                            />
                                        </div>
                                    </Grid>
                                    <Grid item lg={6} md={12} sm={12} xs={12}>
                                        <div className='text-start enrollment-section-input-main' style={{ marginTop: '16px', display: 'flex', flexDirection: 'column' }}>
                                            <label className='schedule-submit-label'>Email</label>
                                            <input
                                                name={"email"}
                                                type="text"
                                                placeholder="Email Id"
                                                value={""}
                                                className='enrollment-section-input experience-input'
                                                style={{ width: '90%' }}
                                                onChange={() => { }}
                                            />
                                        </div>
                                    </Grid>
                                    <Grid item lg={6} md={12} sm={12} xs={12}>
                                        <div className='text-start enrollment-section-input-main' style={{ marginTop: '16px' }}>
                                            <label className='schedule-submit-label'>Phone Number</label>
                                            <input
                                                name={"phone number"}
                                                type="text"
                                                placeholder="Phone Number"
                                                value={""}
                                                className='enrollment-section-input experience-input'
                                                style={{ width: '90%' }}
                                                onChange={() => { }}
                                            />
                                        </div>
                                    </Grid>
                                    <Grid item lg={6} md={12} sm={12} xs={12}>
                                        <div className='text-start enrollment-section-input-main' style={{ marginTop: '16px' }}>
                                            <label className='schedule-submit-label'>Send text messages to</label>
                                            <input
                                                name={"text messages"}
                                                type="text"
                                                placeholder="Text Messages"
                                                value={""}
                                                className='enrollment-section-input experience-input'
                                                style={{ width: '90%' }}
                                                onChange={() => { }}
                                            />
                                        </div>
                                    </Grid>
                                    <Grid item lg={6} md={12} sm={12} xs={12}>
                                        <div className='text-start enrollment-section-input-main' style={{ marginTop: '16px' }}>
                                            <label className='schedule-submit-label'>Please share anything that will help prepare for our meeting.</label>
                                            <input
                                                name={"phone number"}
                                                type="text"
                                                placeholder="share anything that will help"
                                                value={""}
                                                className='enrollment-section-input experience-input'
                                                style={{ width: '90%' }}
                                                onChange={() => { }}
                                            />
                                        </div>
                                    </Grid>
                                </Grid>
                                <Button className='product-btn p-16-32' style={{ marginTop: '32px' }} onClick={ScheduleEvent}>Schedule Event</Button>
                            </Grid>
                            <Grid item lg={4} className="detail-img" style={{ textAlign: 'end' }}>
                                <img src={TalkToAdvisersDetail} alt="" width='100%' />
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
            {showCaptcha && <CaptchaPopup name="TalkToAdvisor" open={showCaptcha} handleClose={() => setShowCaptcha(false)} verifyCaptcha={(e) => verifyCaptcha(e)} />}
        </>
    )
}

export default TalkToAdvisers