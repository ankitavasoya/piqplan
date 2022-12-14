import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Dialog, DialogActions, DialogContent, FormControlLabel, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ReactHtmlParser from 'react-html-parser';
import { ViewCompactAltRounded } from '@mui/icons-material';
import PDFicon from '../../assets/images/download-pdf.png'
import AuthStorage from '../../helper/AuthStorage';
import STORAGEKEY from '../../config/APP/app.config';
//import { toast } from 'material-react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { saveAnswer } from '../../redux/actions/qnaAction';
import { SAVE_ANSWER } from '../../redux/type';
import { isJson } from '../../helper/utils';

const PlanCard = ({ planData, select, compare }) => {

  const getSaveAnswer = useSelector((state) => state.qnaData.saveAnswer)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const ViewPlan = () => {
    navigate(`/plan-details?id=${planData?.PlanId}`)
  }
  const enrollPlan = () => {
    if (AuthStorage.getToken()) {
      AuthStorage.setStorageJsonEncreptedData(STORAGEKEY.enrollPlanData, planData, true)
      const questionsData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.questionsData)
      const saveAnswerData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.saveAnswerData)
      const inqueryData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.inqueryData)
      if(!inqueryData) navigate("/piqplan-medicare");
      const userData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.userData)
      let data = saveAnswerData ?? questionsData
      const body = data?.map(item => {
        if (item?.Answerid) {
          return {
            "answerid": parseInt(item?.Answerid),
            "userid": parseInt(userData?.Userid),
            "multiplechoiceid": parseInt(item?.Multiplechoiceid),
            "questionid": parseInt(item?.Questionid),
            "surveyid": item?.Surveyid,
            "answertext": item?.Answertext,
            "selectiondate": item?.Selectiondate,
            "inquiryid": parseInt(inqueryData?.Inquiryid),
          }
        } else {
          return {
            "userid": parseInt(userData?.Userid),
            "multiplechoiceid": parseInt(item?.multiplechoiceid),
            "questionid": parseInt(item?.questionid),
            "surveyid": item?.surveyid,
            "answertext": (isJson(item?.answertext) === true) ? JSON.stringify(item?.answertext) : item?.answertext,
            "selectiondate": item?.selectiondate,
            "inquiryid": parseInt(inqueryData?.Inquiryid),
          }
        }
      })
      dispatch(saveAnswer(body))

    } else {
      setOpen(true)
    }

  }

  useEffect(() => {
    if (getSaveAnswer && getSaveAnswer.length) {
      AuthStorage.setStorageJsonEncreptedData(STORAGEKEY.saveAnswerData, getSaveAnswer, true)
      dispatch({
        type: SAVE_ANSWER,
        payload: null
    })
      navigate(`/submit-inquiry`)
    }
  }, [getSaveAnswer])

  const [planId, setPlanId] = useState([])

  const handleChange = (val) => {
    setPlanId(Array.from(document.querySelectorAll('input[type=checkbox]:checked')).map(item => item.getAttribute("name")))
  }

  const redirect = () => {
    // if (data === 3 || data === 2) {
    if (planId.length === 3 || planId.length === 2) {
      localStorage.setItem("planId", planId)
      navigate('/plan-compare')
    }
  }

  const goToLogin = () => {
    const pathname = window.location.pathname;
    AuthStorage.setStorageData(STORAGEKEY.currentUrl, pathname, true)
    navigate('/login')
  }

  return (
    <>
      <div className='learn' style={{ width: "90vw", margin: "40px auto" }}>
        <div className='markets-served'>
          <div className='markets-served-header plan-card-title'
          >
            <div>
              <h4>{planData?.planName}</h4>
              <h3>{planData?.PlanType} | Plan ID: {planData?.PlanId}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><p>Star rating: </p><span style={{ width: 'fit-content' }}>  {ReactHtmlParser(planData?.OverallPlanRating)}</span></div>
            </div>
            <div>
              {/* <Button className='download-pdf-button'> <img src={PDFicon} alt='' />Download  PDF</Button> */}
              <img src={planData?.LogoFileMediumTransparent} alt="" />
            </div>
          </div>
          <div className='markets-served-body'>
            <Grid container spacing={2} >
              <Grid item lg={7} >
                <div>
                  <div className='lable'>
                    {/* {planData?.BaseRateUnit} PREMIUM */}
                    MONTHLY PREMIUM
                  </div>
                  <div className='data p-16'>
                    <h4>{ReactHtmlParser(planData?.MonthlyPremium)}</h4>
                    <div style={{ width: "60%" }}>
                      <h6>{ReactHtmlParser(planData?.FilterDrugCov ?? planData?.FilterDrugNotCov)}</h6>
                    </div>
                  </div>
                  <div className='lable'>
                    MONTHLY DRUG & PREMIUM COST
                  </div>
                  <div className='data p-16'>
                    <h4>{ReactHtmlParser(planData?.DrugMonthlyPremium)}</h4>
                    <h6>Includes: Only includes premiums for the months left in this year when you don't enter any drugs</h6>
                  </div>
                  <div className='lable'>
                    OTHER COSTS
                  </div>
                  <div className='p-16'>
                    <div className='data other-costs'>
                      <h4>Drug</h4>
                      <h6>{ReactHtmlParser(planData?.DrugDeductible)}</h6>
                    </div>
                    <div className='data other-costs mt-10'>
                      <h4>Deductible</h4>
                      <h6>{ReactHtmlParser(planData?.Deductible)}</h6>
                    </div>
                    <div className='data other-costs mt-10'>
                      <h4>Rx Copay</h4>
                      <h6>{ReactHtmlParser(planData?.RxCopay)}</h6>
                    </div>
                    <div className='data other-costs mt-10'>
                      <h4>Rx Coins</h4>
                      <h6>{ReactHtmlParser(planData?.RxCoins)}</h6>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item lg={5} >
                <div>
                  <div className='lable'>
                    PLAN BENEFITS
                  </div>
                  <div className='p-16 plan-benefitss'>
                    <h4>Transportation</h4>
                    <h6 className='mt-10'>{ReactHtmlParser(planData?.Transportation)}</h6>
                    <h4 className='mt-10'>Emergency Room</h4>
                    <h6 className='mt-10'>{ReactHtmlParser(planData?.EmergencyRoom)}</h6>
                    <h4 className='mt-10'>Urgent Care</h4>
                    <h6 className='mt-10'>{ReactHtmlParser(planData?.UrgentCare)}</h6>
                    <h4 className='mt-10'>Ambulance</h4>
                    <h6 className='mt-10'>{ReactHtmlParser(planData?.Ambulance)}</h6>
                  </div>
                  {/* <div className='lable'>
                  DRUGS
                </div>
                <div className='p-16'>
                  <h6>Enter drugs you take regularly (if any) to see your estimated drug + premium cost</h6>
                </div> */}
                </div>
              </Grid>
            </Grid >
            {/* </Grid > */}
            <div className='plan-card-footer'>
              <div className='plan-card-footer-inner'>
                <Button className='primary-button p-16-60' variant="contained" onClick={enrollPlan}>Enroll</Button>
                <Button className='primary-outline-button p-16-60' variant='outlined' onClick={compare}>Compare</Button>
                <FormControlLabel control={<Checkbox name={`${planData.PlanId}`} onChange={(e) => select(e, planData)} />} label="Add to compare" />
              </div>

              <div className='plan-card-footer-inner'>
                <Button className='primary-button p-16-60' variant="contained" onClick={() => ViewPlan()}>View plan</Button>
                <a target="_blank" href={planData?.BenefitsLink}><Button className='download-pdf-button p-16-60'> <img src={PDFicon} alt='' />Download  PDF</Button></a>
              </div>
            </div>
          </div >
        </div >
      </div >
      {open && <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className='add-doctor-dialog'
      >
        {/* <DialogTitle id="alert-dialog-title">
          {"Add a doctor"}
        </DialogTitle> */}
        <DialogContent className='add-doctor-body' style={{ borderTop: "1px solid rgb(205 205 205)" }}>
          <h4>Please first  login / register to enroll.</h4>
        </DialogContent>
        <DialogActions >
          <Button
            className='primary-outline-button p-16-60'
            variant="outlined"
            onClick={() => setOpen(false)} autoFocus>
            Cancel
          </Button>
          <Button
            style={{ marginTop: "0px" }}
            className='product-btn p-16-60'
            variant="contained"
            onClick={goToLogin}>Login</Button>
        </DialogActions>
      </Dialog>}
    </>
  )
}

export default PlanCard