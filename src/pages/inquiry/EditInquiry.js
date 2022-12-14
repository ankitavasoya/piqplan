import { Button, Grid } from '@mui/material'
import React, { useEffect, useReducer, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import BackArrow from '../../assets/images/back-arrow.png'
import STORAGEKEY from '../../config/APP/app.config';
import AuthStorage from '../../helper/AuthStorage';
import ReactHtmlParser from 'react-html-parser';
import { useDispatch, useSelector } from 'react-redux';
import { getInqueryByID, saveInquery } from '../../redux/actions/inqueryAction';
import { GET_INQUERY_BY_ID, SAVE_INQUERY } from '../../redux/type';

const EditInquiry = () => {
  const getInqueryByIdData = useSelector((state) => state.inqueryData.getInqueryByIdData)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [inqueryData, setInqueryData] = useState()

  useEffect(() => {
    const pathname = window.location.pathname;
    AuthStorage.setStorageData(STORAGEKEY.currentUrl, pathname, true)
    if (state?.id) {
      dispatch(getInqueryByID(state?.id, 0))
    }
  }, [state])

  useEffect(() => {
    if (getInqueryByIdData && getInqueryByIdData.length) {
      setInqueryData(getInqueryByIdData[0])
      dispatch({
        type: GET_INQUERY_BY_ID,
        payload: null
      })
    }
  }, [getInqueryByIdData])

  const submitInquiry = () => {
    let body = {
      ...inqueryData,
      Inquiry: {
        ...inqueryData?.Inquiry,
        Iscomplete: true
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

  return (
    <>
      <div className='plan-list-main'>
        <div className='plan-list-content w-90 mx-auto'>
          <Button
            className='back-to-plans-btn p-12-24'
            onClick={() => navigate('/user-activity')}
            style={{ gap: "10px", marginBottom: "25px" }}
          >
            <img src={BackArrow} alt='' />
            Back to Activity
          </Button>
          <div className='plan-list-title inquiry-detail'>
            <div className='inquiry-detail-inner'>
              <label>Full Name</label>
              <h5 className='value'>{inqueryData && inqueryData?.Name}</h5>
            </div>
            <div className='inquiry-detail-inner'>
              <label>Email</label>
              <h5 className='value'>{inqueryData && inqueryData?.Email}</h5>
            </div>
            <div className='inquiry-detail-inner'>
              <label>Phone</label>
              <h5 className='value'>{inqueryData && inqueryData?.Phone}</h5>
            </div>
            <div>
              <label>Member Id</label>
              <h5 className='value'>{inqueryData && inqueryData?.Mbi}</h5>
            </div>
            <div className='inquiry-detail-inner'>
              <label>Zip Code</label>
              <h5 className='value'>{inqueryData && inqueryData?.Zipcode}</h5>
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
          <h6>You’re joining: {inqueryData?.Inquiry?.Planname}</h6>
          <h6>Plan ID: {inqueryData?.Inquiry?.Planid}</h6>
          <h6>Drug Coverage: {inqueryData?.Inquiry?.FilterDrugCov ? "Yes" : "No"}</h6>
        </div>
        <Grid container spacing={3}>
          {/* <div className='d-flex' style={{ gap: '32px' }}> */}
          <Grid item lg={7} md={12}>
            <div className='inquiry-content-detail'>
              <h1 className='title' style={{ textAlign: 'start' }} >{inqueryData?.Inquiry?.Planname}</h1>
              <h5 className='sub-title' style={{ textAlign: 'start' }}>{inqueryData?.Inquiry?.PlanType} | Plan ID: {inqueryData?.Inquiry?.Planid}</h5>
              <h6 className='star-rating' style={{ textAlign: 'start' }}>Star rating: {ReactHtmlParser(inqueryData?.Inquiry?.Starrating)}</h6>
              {/* <div className='lable'>
              <h3>MONTHLY PREMIUM</h3>
            </div> */}
              <div className='markets-served-body'>
                <div>
                  <div className='lable'>
                    MONTHLY PREMIUM
                  </div>
                  <div className='data p-16'>
                    <h4>{ReactHtmlParser(inqueryData?.Inquiry?.Monthlypremium)}</h4>
                    <div style={{ width: "60%" }}>
                      <h6>Includes: {inqueryData?.Inquiry?.FilterDrugCov ? "Yes" : "No"}</h6>
                      {/* <h6>Doesn't include: $170.10 Standard Part B premium</h6> */}
                    </div>
                  </div>
                </div>
                <div>
                  <div className='lable'>
                    MONTHLY DRUG & PREMIUM COST
                  </div>
                  <div className='data p-16'>
                    <h4>{ReactHtmlParser(inqueryData?.Inquiry?.Monthlydrugpremium)}</h4>
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
                <h5>${parseInt(inqueryData?.Inquiry?.MonthlyPremium?.replaceAll(/\$|(<([^>]+)>)/ig, '')) * 12}</h5>
              </div>
              <div className='amount'>
                <h5>Your Subsidy Amount</h5>
                <h5>-$200</h5>
              </div>
              <div className='border-div'></div>
              <div className='amount'>
                <h5>Total Amount</h5>
                <h5>${(parseInt(inqueryData?.Inquiry?.MonthlyPremium?.replaceAll(/\$|(<([^>]+)>)/ig, '')) * 12) - 200}</h5>
              </div>
              <div className='team-condition'>
                <div>
                  <input type="checkbox" id='team-condition' checked={true} disabled />
                </div>
                <label htmlFor='team-condition'>Lorem Ipsum is simply dummy text of the printing and typesetting industry  Ipsum is simply <a> Team & condition </a> industry.</label>
              </div>
              {state?.type === 'pending_inquiry' ? <Button onClick={() => submitInquiry()} className='product-btn p-16-32'>Submit Inquiry</Button> : ''}
            </div>
          </Grid>
          {/* </div> */}
        </Grid>
      </div>
    </>
  )
}

export default EditInquiry