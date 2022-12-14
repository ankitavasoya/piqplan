import { Button, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackArrow from '../../assets/images/back-arrow.png'
import STORAGEKEY from '../../config/APP/app.config';
import AuthStorage from '../../helper/AuthStorage';
import ReactHtmlParser from 'react-html-parser';
import { useDispatch, useSelector } from 'react-redux';
import { saveInquery } from '../../redux/actions/inqueryAction';
import { SAVE_INQUERY } from '../../redux/type';
import CaptchaPopup from '../../components/common/CaptchaPopup';

const SubmitInquiry = () => {
  const saveInqueryData = useSelector((state) => state.inqueryData.saveInqueryData)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [enrollPlanData, setEnrollPlanData] = useState()
  const [saveAnswerData, setSaveAnswerData] = useState()
  const [inqueryData, setInqueryData] = useState()
  const [userData, setUserData] = useState()
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [istermsChecked, setIstermsChecked] = useState(false)

  useEffect(() => {
    const pathname = window.location.pathname;
    AuthStorage.setStorageData(STORAGEKEY.currentUrl, pathname, true)
    const EnrollPlanData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.enrollPlanData)
    setEnrollPlanData(EnrollPlanData)
    const SaveAnswerData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.saveAnswerData)
    setSaveAnswerData(SaveAnswerData)
    const InqueryData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.inqueryData)
    if (!InqueryData) navigate("/piqplan-medicare");
    setInqueryData(InqueryData)
    const UserData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.userData)
    setUserData(UserData)
  }, [])

  useEffect(() => {
    if (inqueryData) {
      let body = {
        ...inqueryData,
        Inquiry: {
          ...inqueryData?.Inquiry,
          Iscomplete: false,
          Ispotentiallead: true,
          Userid: userData?.Userid,
          Planid: enrollPlanData?.PlanId,
          Plantype: enrollPlanData?.PlanType,
          Planname: enrollPlanData?.planName,
          Isrxinclude: enrollPlanData?.FilterDrugCov === "Includes drug coverage",
          Carrierid: enrollPlanData?.CarrierId,
          Carriername: enrollPlanData?.FilterinsuranceCarrier,
          Monthlypremium: enrollPlanData?.MonthlyPremium,
          Monthlydrugpremium: enrollPlanData?.DrugMonthlyPremium,
          Starrating: enrollPlanData?.OverallPlanRating,
          Isapplication: true
        }
      }
      dispatch(saveInquery(body))
    }
  }, [inqueryData])

  useEffect(() => {
    if (saveInqueryData) {
      AuthStorage.setStorageJsonEncreptedData(STORAGEKEY.saveInqueryData, saveInqueryData, true)
    }
  }, [saveInqueryData])

  const submitInquiry = () => {
    setShowCaptcha(true)
  }

  const verifyCaptcha = (data) => {
    if (data?.name === "SubmitInquiry" && data?.verified === true) {
      const savedInqueryData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.saveInqueryData)
      let body = {
        ...savedInqueryData,
        "Inquiry": {
          ...savedInqueryData?.Inquiry,
          "Iscomplete": true
        }
      }
      dispatch(saveInquery(body))

      AuthStorage.deleteKey(STORAGEKEY.enrollPlanData);
      AuthStorage.deleteKey(STORAGEKEY.saveAnswerData);
      AuthStorage.deleteKey(STORAGEKEY.questionsData);
      AuthStorage.deleteKey(STORAGEKEY.inqueryData);
      dispatch({
        type: SAVE_INQUERY,
        payload: null
      })
      navigate("/user-activity")
    }
  }

  // useEffect(() => {
  //   if (saveInqueryData) {

  //   }
  // }, [saveInqueryData])


  return (
    <>
      <div className='plan-list-main'>
        <div className='plan-list-content w-90 mx-auto'>
          <Button
            className='back-to-plans-btn p-12-24'
            onClick={() => navigate('/planlist')}
            style={{ gap: "10px", marginBottom: "25px" }}
          >
            <img src={BackArrow} alt='' />
            Back to Plans
          </Button>
          <div className='plan-list-title inquiry-detail'>
            <div className='inquiry-detail-inner'>
              <label>Full Name</label>
              <h5 className='value'>{saveAnswerData && saveAnswerData[0]?.Answertext}</h5>
            </div>
            <div className='inquiry-detail-inner'>
              <label>Email</label>
              <h5 className='value'>{saveAnswerData && saveAnswerData[1]?.Answertext}</h5>
            </div>
            <div className='inquiry-detail-inner'>
              <label>Phone</label>
              <h5 className='value'>{saveAnswerData && saveAnswerData[2]?.Answertext}</h5>
            </div>
            <div>
              <label>Member Id</label>
              <h5 className='value'>{saveAnswerData && saveAnswerData[3]?.Answertext}</h5>
            </div>
            <div className='inquiry-detail-inner'>
              <label>Zip Code</label>
              <h5 className='value'>{saveAnswerData && saveAnswerData[4]?.Answertext}</h5>
            </div>
          </div>
        </div>
      </div>
      <div className='plan-list-filter'>
        <div className='w-90 mx-auto plan-list-filter-inner d-flex' style={{ textAlign: 'center' }}>
          <a href='' style={{ color: '#00BF4C' }}>Congratulations! Your Profile Is Eligible</a>
        </div>
      </div>
      <div className='inquiry-content w-90 mx-auto' style={{ paddingBottom: '50px' }}>
        <h1 className='title'>Your Medicare information</h1>
        <div className='sub-title'>
          <h6>You’re joining: {enrollPlanData?.planName}</h6>
          <h6>Plan ID: {enrollPlanData?.PlanId}</h6>
          <h6>Drug Coverage: {enrollPlanData?.FilterDrugCov ? "Yes" : "No"}</h6>
        </div>
        <Grid container spacing={3}>
          {/* <div className='d-flex' style={{ gap: '32px' }}> */}
          <Grid item lg={7} md={12}>
            <div className='inquiry-content-detail'>
              <h1 className='title' style={{ textAlign: 'start' }} >{enrollPlanData?.planName}</h1>
              <h5 className='sub-title' style={{ textAlign: 'start' }}>{enrollPlanData?.PlanType} | Plan ID: {enrollPlanData?.PlanId}</h5>
              <h6 className='star-rating' style={{ textAlign: 'start' }}>Star rating: {enrollPlanData?.FilterRating}</h6>
              {/* <div className='lable'>
              <h3>MONTHLY PREMIUM</h3>
            </div> */}
              <div className='markets-served-body'>
                <div>
                  <div className='lable'>
                    MONTHLY PREMIUM
                  </div>
                  <div className='data p-16'>
                    <h4>{ReactHtmlParser(enrollPlanData?.MonthlyPremium)}</h4>
                    <div style={{ width: "60%" }}>
                      <h6>Includes: {enrollPlanData?.FilterDrugCov}</h6>
                      <h6>Doesn't include: $170.10 Standard Part B premium</h6>
                    </div>
                  </div>
                </div>
                <div>
                  <div className='lable'>
                    YEARLY DRUG & PREMIUM COST
                  </div>
                  <div className='data p-16'>
                    <h4>$10</h4>
                    <div style={{ width: "60%" }}>
                      <h6>Includes: Only includes premiums for the months left in this year when you don't enter any drugs</h6>
                      {/* <h6>Doesn't include: $170.10 Standard Part B premium</h6> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item lg={5} md={12}>
            <div className='inquiry-content-amount'>
              <div className='amount'>
                <h5>Your Plan Amount</h5>
                <h5>${parseInt(enrollPlanData?.MonthlyPremium.replaceAll(/\$|(<([^>]+)>)/ig, '')) * 12}</h5>
              </div>
              <div className='amount'>
                <h5>Your Subsidy Amount</h5>
                <h5>-$200</h5>
              </div>
              <div className='border-div'></div>
              <div className='amount'>
                <h5>Total Amount</h5>
                <h5>${(parseInt(enrollPlanData?.MonthlyPremium.replaceAll(/\$|(<([^>]+)>)/ig, '')) * 12) - 200}</h5>
              </div>
              <div className='team-condition'>
                <div>
                  <input type="checkbox" id='team-condition' checked={istermsChecked} onChange={(e) => setIstermsChecked(e.target.checked)} />
                </div>
                <label htmlFor='team-condition'>Lorem Ipsum is simply dummy text of the printing and typesetting industry  Ipsum is simply <a> Team & condition </a> industry.</label>
              </div>
              <Button disabled={!istermsChecked} onClick={() => submitInquiry()} className='product-btn p-16-32'>Submit Inquiry</Button>
            </div>
          </Grid>
          {/* </div> */}
        </Grid>
      </div>
      {showCaptcha && <CaptchaPopup name="SubmitInquiry" open={showCaptcha} handleClose={() => setShowCaptcha(false)} verifyCaptcha={(e) => verifyCaptcha(e)} />}
    </>
  )
}

export default SubmitInquiry