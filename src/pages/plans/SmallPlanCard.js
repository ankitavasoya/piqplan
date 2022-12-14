import React, { useEffect, useState } from 'react'
import Wellcare from '../../assets/images/wellcare.png'
import Like from '../../assets/images/like.png'
import Close from '../../assets/images/close.png'
import { useNavigate } from 'react-router-dom'
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import AuthStorage from '../../helper/AuthStorage'
import STORAGEKEY from '../../config/APP/app.config'
import { saveAnswer } from '../../redux/actions/qnaAction'
//import { toast } from 'material-react-toastify'
import swal from 'sweetalert';
import { SAVE_ANSWER } from '../../redux/type'
import { isJson, POPUP_TIMER } from '../../helper/utils'

const SmallPlanCard = ({ data }) => {

    const getSaveAnswer = useSelector((state) => state.qnaData.saveAnswer)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [cardData, setCardData] = useState([])

    useEffect(() => {
        setCardData(AuthStorage.getStorageJsonData(STORAGEKEY.comparePlans));
    }, [])
    
    const enrollPlan = (planId) => {
        if (AuthStorage.getToken()) {
            const planForEnroll = cardData.find(item => item?.PlanId === planId)
           // if (!planForEnroll) toast.error("Plan not found for enroll!");
            if (!planForEnroll) swal("Failed", "Plan not found for enroll!", "error",{
                timer: POPUP_TIMER,
            });
            AuthStorage.setStorageJsonEncreptedData(STORAGEKEY.enrollPlanData, planForEnroll, true)
            const questionsData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.questionsData)
            const saveAnswerData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.saveAnswerData)
            const inqueryData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.inqueryData)
            if (!inqueryData) navigate("/piqplan-medicare");
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
                        "answertext": isJson(item?.answertext) === true ? JSON.stringify(item?.answertext) : item?.answertext,
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

    const goToLogin = () => {
        const pathname = window.location.pathname;
        AuthStorage.setStorageData(STORAGEKEY.currentUrl, pathname, true)
        navigate('/login')
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

    return (
        <>
            <div className='plan-compare-card' style={{ backgroundColor: '#FFFFFF', borderRadius: '6px', padding: '16px' }}>
                <div style={{ display: 'flex', gap: '24px', justifyContent: 'space-between' }}>
                    <img src={data.img} />
                    {/* <div style={{ display: 'flex', gap: '12px'}} >
                        <div className='like'>
                            <img src={Like} />
                        </div>
                        <div className='close'></div>
                    </div> */}
                </div>
                <div style={{ marginTop: '15px' }}>
                    <p className='enroll-card-text'>{data.name}</p>
                    <Button
                        className='primary-button p-12-24'
                        // variant="outlined"
                        onClick={() => enrollPlan(data.planId)}
                        style={{ gap: "10px", marginTop: '15px' }}
                    >
                        Enroll
                    </Button>
                </div>
            </div>
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

export default SmallPlanCard