import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { saveAnswer } from '../redux/actions/qnaAction'
import AuthStorage from '../helper/AuthStorage';
import STORAGEKEY from '../config/APP/app.config';
import { setIsLoading } from "../redux/actions/loadingAction"
import { saveInquery } from '../redux/actions/inqueryAction'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { getQuestionById, getQuestionsBySurveyId, getSurveys } from '../redux/actions/qnaAction'
import { GET_ZIPCODE, GET_ZIPCODE_ERROR, SAVE_INQUERY } from '../redux/type';
import { validateZipcode } from '../redux/actions/quotitActions';
import moment from 'moment';
import { POPUP_TIMER } from '../helper/utils';
import swal from 'sweetalert';
import CaptchaPopup from './common/CaptchaPopup';

const EnrollmentSection = ({ singleQuestionData }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showCaptcha, setShowCaptcha] = useState(false)
  // const [enrollMentData, setEnrollMentData] = useState({
  //   firstName: "",
  //   lastName: "",
  //   phone: "",
  //   email: "",
  //   zipCode: ""
  // })
  // const [error, setError] = useState([])
  const [answerQuestions, setAnswerQuestions] = useState([
    {
      userid: "1",
      multiplechoiceid: 0,
      questionid: 0,
      surveyid: "",
      answertext: "",
      selectiondate: "2022-09-07T12:46:01.221Z",
      submission:
      {
        surveyid: "",
        userid: "1",
      }
    }
  ])
  const [showError, setShowError] = useState(false)
  const [isActiveData, setIsactiveData] = useState([])
  const [open, setOpen] = useState(false)
  const [isZipCodeVerify, setIsZipCodeVerify] = useState(false)
  const getInqueryData = useSelector((state) => state.inqueryData.saveInqueryData)
  const zipCodeData = useSelector((state) => state.quotitData.zipCodeData)
  const zipCodeDataError = useSelector((state) => state.quotitData.zipCodeError)
  useEffect(() => {
    const questionsData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.questionsData)
    if (questionsData && questionsData?.length != 0) {
      setOpen(true)
    }
    return () => {
      dispatch({
        type: SAVE_INQUERY,
        payload: null
      })
    }
  }, [])

  useEffect(() => {
    if (getInqueryData) {
      const questionsData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.questionsData)
      var i;
      for (i = 0; i < questionsData?.length; i++) {
        questionsData[i].inquiryid = getInqueryData.Inquiryid;
      }
      AuthStorage.setStorageJsonEncreptedData(STORAGEKEY.questionsData, questionsData, true)
      AuthStorage.setStorageJsonEncreptedData(STORAGEKEY.inqueryData, getInqueryData, true)
      navigate('/surveys')
    }
  }, [getInqueryData])

  useEffect(() => {
    const questionsData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.questionsData)
    if (questionsData && questionsData?.length != 0) {
      setIsactiveData(singleQuestionData?.Orderno === 1 && singleQuestionData?.Multiplechoices?.filter((item) => item.Isactive === true)?.map((items) => {
        const dt = questionsData?.find((item2) => item2.multiplechoiceid == items.Multiplechoiceid)?.answertext
        if (questionsData?.find((item2) => item2.Multiplechoicetext === "Phone")) {
          return {
            ...items,
            userInputValue: "+1" + dt
          }
        }
        else {
          return {
            ...items,
            userInputValue: dt
          }
        }

      }))

    } else {
      setIsactiveData(singleQuestionData?.Orderno === 1 && singleQuestionData?.Multiplechoices?.filter((item) => item.Isactive === true)?.map((items) => {
        if (items.Multiplechoicetext === "Phone") {
          return {
            ...items,
            userInputValue: "+1"
          }
        }
        else {
          return {
            ...items,
            userInputValue: ''
          }
        }
      }))
    }
  }, [singleQuestionData])

  const goToLastQuestion = () => {
    const questionsData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.questionsData)
    if (questionsData) {
      navigate('/surveys')
      dispatch(getQuestionById(questionsData?.slice(-1)[0]['nextQuestionId']))
    }
  }

  const tryWithNew = () => {
    AuthStorage.deleteKey(STORAGEKEY.questionsData)
    AuthStorage.deleteKey(STORAGEKEY.planFilters)
    AuthStorage.deleteKey(STORAGEKEY.saveAnswerData)
    AuthStorage.deleteKey(STORAGEKEY.enrollPlanData)
    AuthStorage.deleteKey(STORAGEKEY.comparePlans)
    AuthStorage.deleteKey(STORAGEKEY.saveInqueryData)
    AuthStorage.deleteKey(STORAGEKEY.locationData)
    AuthStorage.deleteKey(STORAGEKEY.inqueryData)
    const newData = isActiveData.map((item) => {
      if (item.Multiplechoicetext == "Phone") {
        item.userInputValue = "+1"
      } else {
        item.userInputValue = ""
      }
      return item;
    });
    setIsactiveData(newData);
    setOpen(false)
  }

  const validation = () => {
    // let error = [];
    let flag = false;

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    // const regexPhone = /^\d{10}$/;
    // const regexPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    const regexPhone = /^\+?([1]{1})([0-9]{10})$/;
    const regexPincode = /^[1-9][0-9]{4}$/;
    const regexMbi = /^[1-9][^SLOIBZsloibz0-9][^SLOIBZsloibz][0-9]-[^SLOIBZsloibz0-9][^SLOIBZsloibz][0-9]-[^SLOIBZsloibz0-9][^SLOIBZsloibz0-9][0-9][0-9]$/;

    // const returnError = isActiveData.filter((item) => item.userInputValue === "")
    const newData = isActiveData.map((item) => {
      item.error = false;
      item.errorMsg = "";
      if (item?.userInputValue === "" || item?.userInputValue === undefined) {
        item.error = true;
        item.errorMsg = 'Please enter ' + item.Multiplechoicetext;
        flag = true
      } else if (item?.userInputValue && item.Multiplechoicetext == "Email") {
        if (!item?.userInputValue.match(regex)) {
          item.error = true;
          item.errorMsg = 'Please enter a valid Email';
          flag = true
        }
      } else if (item?.userInputValue && item.Multiplechoicetext == "Phone") {
        if (!regexPhone.test(item?.userInputValue)) {
          item.error = true;
          item.errorMsg = 'Please enter a valid phone number';
          flag = true
        }
      } else if (item?.userInputValue && item.Multiplechoicetext == "Zipcode") {
        if (!item?.userInputValue.match(regexPincode)) {
          item.error = true;
          item.errorMsg = 'Please enter a valid Zipcode';
          flag = true
        }
        if (!isZipCodeVerify) {
          item.error = true;
          item.errorMsg = 'Zipcode is not verified';
          flag = true
        }
      } else if (item?.userInputValue && item.Multiplechoicetext == "MBI") {
        console.log();
        if (!regexMbi.test(item?.userInputValue)) {
          item.error = true;
          item.errorMsg = 'Please enter a valid MBI (like, XXXX-XXX-XXXX)';
          flag = true
        }
      }
      return item;
    });
    setIsactiveData(newData);
    /*  }elseif (isActiveData.filter((item) =>  (item.Multiplechoicetext == 'Email' && item.userInputValue.match(regex)))) {
       setShowError("Please enter a valid email address")
       flag = true
       } */

    //   const returnError = isActiveData.map((item) => {
    //   if(item.userInputValueErr !== "") {
    //     setShowError(true)
    //     flage = true
    //   }
    // })

    // const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    // const regexPhone = /^\d{10}$/;
    // const regexPincode = /^[1-9][0-9]{5}$/;

    // if (enrollMentData.firstName === '' && isActiveData.find((item) => item?.Multiplechoicetext.replace(" ", "").toLowerCase() === "firstname")) {
    //   error['First Name'] = 'Enter firstname';
    //   flage = true;
    // }
    // if (enrollMentData.lastName === '' && isActiveData.find((item) => item?.Multiplechoicetext.replace(" ", "").toLowerCase() === "lastname")) {
    //   error["Last name"] = 'Enter lastname';
    //   flage = true;
    // }
    // if (enrollMentData.phone === '' && isActiveData.find((item) => item?.Multiplechoicetext.replace(" ", "").toLowerCase() === "phone")) {
    //   error["Phone"] = 'Enter phone number';
    //   flage = true;
    // }
    // if (enrollMentData.phone && !enrollMentData.phone.match(regexPhone)) {
    //   error["Phone"] = 'Please enter a valid phone number';
    //   flage = true;
    // }
    // if (enrollMentData.email === '' && isActiveData.find((item) => item?.Multiplechoicetext.replace(" ", "").toLowerCase() === "email")) {
    //   error["Email"] = 'Enter email';
    //   flage = true;
    // }
    // if (enrollMentData.email && !enrollMentData.email.match(regex)) {
    //   error["Email"] = 'Please enter a valid email address';
    //   flage = true;
    // }
    // if (enrollMentData.zipCode === '' && isActiveData.find((item) => item?.Multiplechoicetext.replace(" ", "").toLowerCase() === "zipcode")) {
    //   error["Zip Code"] = 'Enter zipcode';
    //   flage = true;
    // }
    // if (enrollMentData.zipCode && !enrollMentData.zipCode.match(regexPincode)) {
    //   error["Zip Code"] = 'Please enter a valid zipcode';
    //   flage = true;
    // }
    // setError(error);
    return flag;
  };

  const onChnageHandler = (e, name) => {
    let newData = [...isActiveData]
    const index = newData.findIndex((item) => item.Multiplechoiceid === parseInt(e.target.name))
    if (newData[index].Multiplechoicetext === "Phone" && (e.target.value === "+1" || e.target.value === "+" || e.target.value === "")) {
      newData[index].userInputValue = (e.target.value === "+" || e.target.value === "") ? "+1" : e.target.value
    } else if (newData[index].Multiplechoicetext.toLowerCase() === "zipcode") {
      const value = e.target.value
      newData[index].userInputValue = e.target.value
      if (value == "") {
        setIsZipCodeVerify(false)
      }
      if (value?.length === 5) {
        newData[index].userInputValue = value
        dispatch(setIsLoading(true));
        const body = {
          "accessKeys": {
            "remoteAccessKey": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
          },
          "inputs": {
            "zipCode": value,
            "asOfDate": moment().utc()
          }
        }
        dispatch(validateZipcode(body))
      }
    } else {
      if (newData[index].Multiplechoicetext === "Phone" && !newData[index].userInputValue.includes("+1")) {
        newData[index].userInputValue = "+1" + e.target.value?.replace("+", "")
      }
      else {
        newData[index].userInputValue = e.target.value
      }
    }

    setIsactiveData(newData)
  }

  useEffect(() => {
    if (zipCodeData) {
      dispatch(setIsLoading(false));
      setIsZipCodeVerify(true)
      dispatch({
        type: GET_ZIPCODE,
        payload: null
      })
      //toast.success("Zipcode Verified")
      swal("Success", "Zipcode Verified", "success", {
        timer: POPUP_TIMER,
      });
    }
  }, [zipCodeData])

  useEffect(() => {
    if (zipCodeDataError) {
      dispatch(setIsLoading(false));
      setIsZipCodeVerify(false)
      dispatch({
        type: GET_ZIPCODE_ERROR,
        payload: null
      })
      swal("Failed", "Ivalid Zipcode", "error", {
        timer: POPUP_TIMER,
      });
      //toast.error("Ivalid Zipcode")
    }
  }, [zipCodeDataError])

  const reDirect = () => {
    if (validation()) {
      return
    }
    setShowCaptcha(true)
  }

  var globalArray = [];
  const verifyCaptcha = (e) => {
    if (e.name === "Enroll" && e.verified === true) {
      var isInsert = false;
      const questionsData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.questionsData)

      if (questionsData && questionsData?.length != 0) {

        isActiveData.map((item) => {
          if (item.Multiplechoiceid == 27) {
            if (questionsData?.find((item2) => item2?.multiplechoiceid == 27 && item2.answertext != item.userInputValue)) {
              isInsert = true;
            }
          }
          if (item.Multiplechoiceid == 28) {
            if (questionsData?.find((item2) => item2.multiplechoiceid == 28 && item2.answertext != item.userInputValue)) {
              isInsert = true;
            }
          }
          if (item.Multiplechoiceid == 29) {
            if (questionsData?.find((item2) => item2.multiplechoiceid == 29 && item2.answertext != item.userInputValue)) {
              isInsert = true;
            }
          }
        })
      } else {
        isInsert = true;
      }
      if (isInsert) {
        var myArr = {
          inquiryid: 0,
          inquiry: {
            surveyid: isActiveData[0].Surveyid,
            inquiryid: 0,
            ispotentiallead: true,
            isapplication: false,
            iscomplete: false,
          },
          survey: {
            surveyid: isActiveData[0].Surveyid,
          }
        };
      } else {
        var myArr = {
          Createdon: new Date(),
          inquiryid: questionsData[0].inquiryid,
          inquiry: {
            surveyid: isActiveData[0].Surveyid,
            inquiryid: questionsData[0].inquiryid,
            ispotentiallead: true,
            isapplication: false,
            iscomplete: false,
          },
          survey: {
            surveyid: isActiveData[0].Surveyid,
          }
        };
      }
      isActiveData.map((item) => {
        if (item.Multiplechoiceid == 26) {
          myArr.name = item.userInputValue
        }
        if (item.Multiplechoiceid == 27) {
          myArr.email = item.userInputValue
        }
        if (item.Multiplechoiceid == 28) {
          myArr.phone = item.userInputValue
        }
        if (item.Multiplechoiceid == 29) {
          myArr.mbi = item.userInputValue
        }
        if (item.Multiplechoiceid == 30) {
          myArr.zipcode = item.userInputValue
        }
        const body = {
          userid: 1,
          inquiryid: 0,
          multiplechoiceid: item.Multiplechoiceid,
          questionid: item.Questionid,
          surveyid: item.Surveyid,
          answertext: item.userInputValue,
          quotitmapparam: item.Quotitmapparam,
          selectiondate: new Date(),
          submission:
          {
            surveyid: item.Surveyid,
            userid: 1,
          }
        };
        globalArray.push(body)
      })
      dispatch(saveInquery(myArr))
      AuthStorage.setStorageJsonEncreptedData(STORAGEKEY.questionsData, globalArray, true)
      // navigate('/surveys')
    }
  }

  return (
    <>
      <div className='enrollment-section' style={{ gap: "10px" }}>
        {isActiveData && isActiveData.sort((a, b) => a.Orderno - b.Orderno).map((item) => (
          <div className='text-start enrollment-section-input-main' key={item.multiplechoiceid}>
            <input
              name={item.Multiplechoiceid}
              type="text"
              placeholder={item.Multiplechoicetext === "MBI" ? `${item.Multiplechoicetext} (XXXX-XXX-XXXX)` : item.Multiplechoicetext}
              value={item.userInputValue}
              className='enrollment-section-input experience-input'
              onChange={(e) => onChnageHandler(e, item.Multiplechoiceid)}
            />
            {(item.error) ? <span className='input-error'>{item.errorMsg}</span> : ''}
          </div>
        ))
        }
        <div className='text-start enrollment-section-input-main button'>
          <Button onClick={() => reDirect()} variant="contained" className='primary-button p-16-60 max-h-54' style={{ minWidth: '237px' }}>Get Started</Button>
        </div>
      </div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className='add-doctor-dialog'
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to continue?"}
        </DialogTitle>
        <DialogContent className='add-doctor-body' style={{ borderTop: "1px solid rgb(205 205 205)" }}>
          <h2>Do you want to continue from where you left previously ?</h2>
          <div className='' style={{ marginTop: "15px" }}>

          </div>
        </DialogContent>
        <DialogActions >
          <Button
            className='primary-outline-button p-16-60'
            variant="outlined"
            onClick={() => tryWithNew()} autoFocus>
            Ignore
          </Button>
          <Button
            style={{ marginTop: "0px" }}
            className='product-btn p-16-60'
            variant="contained"
            onClick={() => goToLastQuestion()}
          >Continue</Button>
        </DialogActions>
      </Dialog>

      {showCaptcha && <CaptchaPopup name="Enroll" open={showCaptcha} handleClose={() => setShowCaptcha(false)} verifyCaptcha={(e) => verifyCaptcha(e)} />}
    </>
  )
}

export default EnrollmentSection