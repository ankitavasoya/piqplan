import { Button, InputLabel, Checkbox, ListItemIcon, ListItemText } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactHtmlParser from 'react-html-parser';
import ProductSide from '../assets/images/product.png'
import { getQuestionById, getQuestionsBySurveyIdAndOrderNo, getSurveys } from '../redux/actions/qnaAction'
import { setIsLoading } from "../redux/actions/loadingAction"
// import DatePickerForControl from './common/DatePickerForControl';
import BackArrow from '../assets/images/back-arrow.png'
import { FormControl, MenuItem, Select } from '@mui/material';
import DoctorControl from './common/DoctorControl';
import DeleteIcon from '../assets/images/delete.png';
import AuthStorage from '../helper/AuthStorage';
import STORAGEKEY from '../config/APP/app.config';
import { useNavigate } from 'react-router-dom'
import Drugcontrol from './common/RxDrugControl';
import { DatePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import { eligiblecheck } from '../redux/actions/eligiblecheckAction';
import EligiblecheckModel from './common/EligiblecheckModel';
import { PICK_DATE, POPUP_TIMER } from '../helper/utils';
import { validateZipcode } from '../redux/actions/quotitActions';
import PharmacieControl from './common/PharmacieControl';
import moment from 'moment';
//import { toast } from 'material-react-toastify';
import swal from 'sweetalert';
import { GET_ZIPCODE, GET_ZIPCODE_ERROR, GET_QUESTIONS_BY_SURVEY_ID_ORDER_NO_ERROR, ELIGIBLECHECK } from '../redux/type';

const Product = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const getSurveyData = useSelector((state) => state.qnaData.getSurveys)
    const getQuestionByIdData = useSelector((state) => state.qnaData.getQuestionById)
    const getQuestionByIdAndOrderNoData = useSelector((state) => state.qnaData.getQuestionByIdAndOrderNo)
    const getQuestionByIdAndOrderNoDataError = useSelector((state) => state.qnaData.getQuestionByIdAndOrderNoError)
    const eligiblecheckData = useSelector((state) => state.eligiblecheckData.eligiblecheckData)
    const zipCodeData = useSelector((state) => state.quotitData.zipCodeData)
    const zipCodeDataError = useSelector((state) => state.quotitData.zipCodeError)
    const [surveyData, setSurveyData] = useState()
    const [questionData, setQuestionData] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [singleQuestionData, setSingleQuestionData] = useState(null);
    const [showDoctorModal, setShowDoctorModal] = useState(false)
    const [selectedDoctors, setSelectedDoctors] = useState([])
    const [selectedDrug, setSelectedDrug] = useState([])
    const [selectedPharmacy, setSelectedPharmacy] = useState([])
    const [selectButton, setSelectButton] = useState(0)
    const [showError, setShowError] = useState(false)
    const [showErrorText, setShowErrorText] = useState('')
    const [showDrugControl, setShowDrugControl] = useState(false)
    const [showPharmacyControl, setShowPharmacyControl] = useState(false)
    const [date, setDate] = useState()
    const [minDate, setMinDate] = useState()
    const [maxDate, setMaxDate] = useState()
    const [dateError, setDateError] = useState(false)
    const [effectiveDate, setEffectiveDate] = useState()
    const [IsEligible, setIsEligible] = useState(false)
    const [eligibleText, setEligibleText] = useState("Your Profile Is Not Eligible")
    const [isDataToShow, setIsDataToShow] = useState(false)
    const [eligibleModelOpen, setEligibleModelOpen] = useState(false)
    const [isZipCodeVerify, setIsZipCodeVerify] = useState(false)
    const [zipCodeInfo, setZipCodeInfo] = useState(null)
    const [dateValidationError, setDateValidationError] = useState("")
    const [effectiveDateValidationError, setEffectiveDateValidationError] = useState("")
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250
            }
        },
        getContentAnchorEl: null,
        anchorOrigin: {
            vertical: "bottom",
            horizontal: "center"
        },
        transformOrigin: {
            vertical: "top",
            horizontal: "center"
        },
        variant: "menu"
    };

    const [selected, setSelected] = useState([]);
    //const isAllSelected = options.length > 0 && selected.length === options.length;
    const isAllSelected = [];

    useEffect(() => {
        setQuestionData([])
        setQuestions([])
        setSingleQuestionData([])
        dispatch(getSurveys())
        setSelectedDrug([])
        setSelectedDoctors([])
        setSelectedPharmacy([])
        return () => { setSurveyData({}) }
    }, [])

    useEffect(() => {
        setShowError(false)
        setShowErrorText('')
    }, [singleQuestionData])

    useEffect(() => {
        dispatch(setIsLoading(true));
        if (getSurveyData) {
            setSurveyData(getSurveyData[0])
        }
    }, [getSurveyData])

    const getQuestionByIdAndOrderNoAPI = (currentOrderNo, surveyId) => {
        dispatch(getQuestionsBySurveyIdAndOrderNo(currentOrderNo, surveyId))
    }

    useEffect(() => {
        if (getQuestionByIdAndOrderNoDataError && getQuestionByIdAndOrderNoDataError.response.status === 404) {
            dispatch({
                type: GET_QUESTIONS_BY_SURVEY_ID_ORDER_NO_ERROR,
                payload: null
            })
            dispatch(setIsLoading(false));
            const questionsData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.questionsData)
            const DOB = questionsData.find((item) => item.quotitmapparam === "DateOfBirth")?.answertext
            const MemberId = questionsData.find((item) => item.quotitmapparam === "MBI")?.answertext
            const Gender = questionsData.find((item) => item.quotitmapparam === "Gender")?.answertext
            const EffectiveDate = singleQuestionData.answer
            setEffectiveDate(EffectiveDate)
            let body = {
                "mbi": MemberId?.replaceAll("-", ''),
                "dob": moment(DOB).format('YYYY-MM-DD'),
                "gender": Gender === "Male" ? 1 : Gender === "Female" ? 2 : 0
            }
            dispatch(eligiblecheck(body));
        }
    }, [getQuestionByIdAndOrderNoDataError])

    useEffect(() => {
        if (eligiblecheckData) {
            const questionsData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.questionsData)
            const DOB = questionsData.find((item) => item.quotitmapparam === "DateOfBirth")?.answertext
            
            // const EffectiveDate = singleQuestionData.answer
            const EffectiveDate = questionsData.find((item) => item.quotitmapparam === "EffectiveDate")?.answertext
            const PartDEligibilityPeriods = eligiblecheckData?.BeneficiaryProfile?.BEQ[0]?.PartD_EligibilityPeriods[0]?.StartDate
            const startDate = moment(new Date(PartDEligibilityPeriods), "YYYY-MM-DD");
            const endDate = moment(new Date(EffectiveDate), "YYYY-MM-DD");
            
            const dateOfBirth = moment(new Date(DOB), "YYYY-MM-DD");
            const checkThreeMonthPrior = endDate.diff(startDate, 'months') ?? 0
            const PartAEntitlementPeriods = eligiblecheckData?.BeneficiaryProfile?.BEQ[0]?.PartA_EntitlementPeriods[0]?.StartDate
            const checkIfEligible = moment(new Date(EffectiveDate)).isSameOrAfter(new Date(PartAEntitlementPeriods))

            const currentYear = moment().year()
            const birthMonth = moment(dateOfBirth).month()
            const birthDay = moment(dateOfBirth).date()
            const newBirthDate = moment(`${birthDay}/${birthMonth}/${currentYear}`).format('YYYY-MM-DD')

            const pastDates = moment(newBirthDate).subtract(3, 'M').format('YYYY-MM-DD');
            const futureDates = moment(newBirthDate).add(3, 'M').format('YYYY-MM-DD');
            
            const currentDate = moment().format('YYYY-MM-DD');
            const isInBetween = moment(currentDate).isBetween(pastDates, futureDates)
            const newEffectiveDate = moment(new Date(EffectiveDate)).format("YYYY-MM-DD");
            // const checkEffectiveDate = moment(new Date(newEffectiveDate)).isSameOrBefore(new Date(newBirthDate))
            const checkEffectiveDate = moment(newEffectiveDate).isBetween(newBirthDate, futureDates)

            if (!isInBetween) {
                const errorMessage = `The period of signup does not fall under criteria based on your given birthdate. e.g. 
                If your birthday is December 1, 2022, you will be allowed to signup only for period Sep 1, 2022 to Feb 28, 2023.`
                setDateValidationError(errorMessage)
                setEligibleText("")
                setIsDataToShow(false)
                setIsEligible(false)
            } else if (!checkEffectiveDate) {
                setEffectiveDateValidationError('Effective date should be greater than current year birth date.')
                setEligibleText("")
                setIsDataToShow(false)
                setIsEligible(false)
            } else {
                setDateValidationError("")
                setEffectiveDateValidationError("")
                if (eligiblecheckData?.BeneficiaryProfile?.BEQ[0]?.ResponseCodes[0]?.Code === "100") {
                    setIsDataToShow(true)
                    setEligibleText(eligiblecheckData?.BeneficiaryProfile?.BEQ[0]?.ResponseCodes[0]?.Description)
                } else {
                    setIsDataToShow(false)
                    if (checkIfEligible && checkThreeMonthPrior > 3) {
                        setIsEligible(true)
                        setEligibleText("Congratulations! Your Profile Is Eligible")
                    } else {
                        setIsEligible(false)
                        setEligibleText("Your Profile Is Not Eligible")
                    }
                }
            }

            AuthStorage.setStorageData(STORAGEKEY.isEligibil, checkIfEligible, true)
            AuthStorage.setStorageJsonData(STORAGEKEY.eligibilityReport, eligiblecheckData, true)
            setEligibleModelOpen(true)
            dispatch({
                type: ELIGIBLECHECK,
                payload: null
            })
        }
    }, [eligiblecheckData])

    useEffect(() => {
        if (surveyData && surveyData.Surveyid) {
            const questionsData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.questionsData)
            if (questionsData) {

                const findCurrentQuestion = questionsData?.find((item) => item.iscurrent === true)
                const arrayUniqueByKey = [...new Map(questionsData?.map(item => [item['questionid'], item])).values()];
                if (findCurrentQuestion) {
                    if (arrayUniqueByKey.length == 1) {
                        getQuestionByIdAndOrderNoAPI(1, surveyData.Surveyid)
                    } else {
                        dispatch(getQuestionById(findCurrentQuestion.questionid))
                    }
                } else {
                    if (arrayUniqueByKey.length == 1) {
                        getQuestionByIdAndOrderNoAPI(1, surveyData.Surveyid)
                        navigate('/surveys')
                    } else {
                        setSelectButton(questionsData?.slice(-1)[0]['multiplechoiceid'])
                        if (questionsData?.slice(-1)[0]['gotqid']) {
                            dispatch(getQuestionById(questionsData?.slice(-1)[0]['gotqid']))
                        } else {
                            getQuestionByIdAndOrderNoAPI(questionsData?.slice(-1)[0]['Qno'], surveyData.Surveyid)
                        }
                    }
                }
            } else {
                navigate('/piqplan-medicare')
            }
        }
    }, [surveyData])

    useEffect(() => {
        if (getSurveyData && getSurveyData?.Surveyid) {
            const questionsData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.questionsData)
            if (questionsData) {
                const findCurrentQuestion = questionsData?.find((item) => item.iscurrent === true)
                const arrayUniqueByKey = [...new Map(questionsData?.map(item => [item['questionid'], item])).values()];
                if (findCurrentQuestion) {
                    if (arrayUniqueByKey.length == 1) {
                        getQuestionByIdAndOrderNoAPI(1, surveyData.Surveyid)
                    } else {
                        dispatch(getQuestionById(findCurrentQuestion.questionid))
                    }
                } else {
                    if (arrayUniqueByKey.length == 1) {
                        getQuestionByIdAndOrderNoAPI(1, surveyData.Surveyid)
                        navigate('/surveys')
                    } else {
                        setSelectButton(questionsData?.slice(-1)[0]['multiplechoiceid'])
                        if (questionsData?.slice(-1)[0]['gotqid']) {
                            dispatch(getQuestionById(questionsData?.slice(-1)[0]['gotqid']))
                        } else {
                            getQuestionByIdAndOrderNoAPI(questionsData?.slice(-1)[0]['Qno'], surveyData.Surveyid)
                        }
                    }
                }
            } else {
                navigate('/piqplan-medicare')
            }
        }
    }, [getSurveyData])

    useEffect(() => {
        if (getQuestionByIdData) {
            setSelectedDrug([])
            setSelectedDoctors([])
            setSelectedPharmacy([])
            dispatch(setIsLoading(false));
            const questionsData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.questionsData)
            // const answerData = (getQuestionByIdData?.Controltype?.Controlname === 'Date') ? PICK_DATE.AGE_TO : questionsData?.find((item) => item.questionid == getQuestionByIdData.Questionid)?.answertext;
            const answerData = questionsData?.find((item) => item.questionid == getQuestionByIdData.Questionid);
            if (answerData && answerData.quotitmapparam === "Doctors") {
                setSelectedDoctors(answerData?.answertext ? answerData?.answertext : [])
            } else if (answerData && answerData.quotitmapparam === "Drugs") {
                setSelectedDrug(answerData?.answertext ? answerData?.answertext : [])
            } else if (answerData && answerData.quotitmapparam === "Pharmacy") {
                setSelectedPharmacy(answerData?.answertext ? answerData?.answertext : [])
            } else {
                setSelected(answerData?.answertext)
            }
            // if(doctorData && doctorData.length > 0) {
            //     setSelectedDoctors(doctorData)
            // }
            // if(drugData && drugData.length > 0) {
            //     setSelectedDrug(drugData)
            // }
            setSingleQuestionData({
                Qno: getQuestionByIdData?.Orderno,
                Controltypeid: getQuestionByIdData?.Controltypeid,
                QuestionType: getQuestionByIdData?.Controltype?.Controlname,
                QuestionText: getQuestionByIdData?.Questiontext,
                Isrequired: getQuestionByIdData?.Isrequired,
                Status: getQuestionByIdData?.Isactive,
                Questiontitle: getQuestionByIdData?.Questiontitle,
                Requirederrormessage: getQuestionByIdData?.Requirederrormessage,
                Surveyid: getQuestionByIdData?.Surveyid,
                Multiplechoices: getQuestionByIdData?.Multiplechoices,
                Questionid: getQuestionByIdData?.Questionid,
                answer: (answerData?.answertext) ? answerData?.answertext : "",
                Hassupportoption: getQuestionByIdData?.Hassupportoption,
                Supportoptiontext: getQuestionByIdData?.Supportoptiontext,
                Frontendimage: getQuestionByIdData?.Frontendimage
            })
        }
    }, [getQuestionByIdData])

    useEffect(() => {
        const inqueryData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.inqueryData)
        if (!inqueryData) navigate("/piqplan-medicare")
    }, [])
    //Ravi -----
    useEffect(() => {
        if (getQuestionByIdAndOrderNoData) {
            setSelectedDrug([])
            setSelectedDoctors([])
            setSelectedPharmacy([])
            dispatch(setIsLoading(false));
            const questionsData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.questionsData)
            const answerData = questionsData?.find((item) => item.questionid == getQuestionByIdAndOrderNoData.Questionid);
            if (answerData && answerData.quotitmapparam === "Doctors") {
                setSelectedDoctors(answerData?.answertext ? answerData?.answertext : [])
            } else if (answerData && answerData.quotitmapparam === "Drugs") {
                setSelectedDrug(answerData?.answertext ? answerData?.answertext : [])
            } else if (answerData && answerData.quotitmapparam === "Pharmacy") {
                setSelectedPharmacy(answerData?.answertext ? answerData?.answertext : [])
            } else {
                setSelected(answerData?.answertext)
            }
            setSingleQuestionData({
                Qno: getQuestionByIdAndOrderNoData?.Orderno,
                Controltypeid: getQuestionByIdAndOrderNoData?.Controltypeid,
                QuestionType: getQuestionByIdAndOrderNoData?.Controltype?.Controlname,
                QuestionText: getQuestionByIdAndOrderNoData?.Questiontext,
                Isrequired: getQuestionByIdAndOrderNoData?.Isrequired,
                Status: getQuestionByIdAndOrderNoData?.Isactive,
                Questiontitle: getQuestionByIdAndOrderNoData?.Questiontitle,
                Requirederrormessage: getQuestionByIdAndOrderNoData?.Requirederrormessage,
                Surveyid: getQuestionByIdAndOrderNoData?.Surveyid,
                Multiplechoices: getQuestionByIdAndOrderNoData?.Multiplechoices,
                Questionid: getQuestionByIdAndOrderNoData?.Questionid,
                answer: (answerData?.answertext) ? answerData?.answertext : "",
                Hassupportoption: getQuestionByIdAndOrderNoData?.Hassupportoption,
                Supportoptiontext: getQuestionByIdAndOrderNoData?.Supportoptiontext,
                Frontendimage: getQuestionByIdAndOrderNoData?.Frontendimage
            })
        }
    }, [getQuestionByIdAndOrderNoData])

    const goToQuestion = (Questionid, optionId, optionText) => {
        dispatch(setIsLoading(true));
        setShowError(false)
        setShowErrorText('')
        if (singleQuestionData.Isrequired) {
            if (optionText == "") {
                setShowErrorText(singleQuestionData.Requirederrormessage)
                setShowError(true)
                dispatch(setIsLoading(false));
                return
            }
        }
        let questionsData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.questionsData)
        questionsData = questionsData?.map((item) => ({
            ...item,
            iscurrent: false
        }))
        // var QuestionsIdArr = questionsData?.map(function (obj) { return obj.questionid; });
        // QuestionsIdArr = QuestionsIdArr.filter(function (v, i) { return QuestionsIdArr.indexOf(v) == i; });
        if (Questionid) {
            const findQuestionI = questionsData?.findIndex((item) => item.questionid === singleQuestionData.Questionid)
            if (findQuestionI >= 0) {
                if (findQuestionI !== questionsData?.length - 1) {
                    questionsData?.splice(findQuestionI + 1, questionsData?.length - 1)
                }
                questionsData[findQuestionI].answertext = optionText;
                questionsData[findQuestionI].multiplechoiceid = optionId;
                questionsData[findQuestionI].iscurrent = false;
            } else {
                const quotitmapparam = singleQuestionData?.Multiplechoices.find((item) => parseInt(item.Multiplechoiceid) === parseInt(optionId))?.Quotitmapparam
                const body = {
                    userid: 1,
                    multiplechoiceid: optionId,
                    questionid: singleQuestionData.Questionid,
                    surveyid: singleQuestionData.Surveyid,
                    Qno: singleQuestionData.Qno,
                    answertext: optionText,
                    quotitmapparam: quotitmapparam,
                    selectiondate: new Date(),
                    gotqid: Questionid,
                    iscurrent: false,
                    inquiry: {
                        surveyid: singleQuestionData.Surveyid,
                        userid: 1,
                    }
                };
                questionsData?.push(body)
            }
            AuthStorage.setStorageJsonEncreptedData(STORAGEKEY.questionsData, questionsData, true)
            dispatch(getQuestionById(Questionid))
        }
        else {
            goToNext(optionId, optionText, null)
        }
    }

    const backToQuestions = () => {
        dispatch(setIsLoading(true));
        let questionsData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.questionsData)
        let findQ = questionsData?.findIndex((item) => item.iscurrent === true)
        if (findQ >= 0) {
            questionsData = questionsData?.map((it, i) => {
                if ((findQ - 1) === i) {
                    return { ...it, iscurrent: true }
                }

                return { ...it, iscurrent: false }
            })

        } else {
            questionsData = questionsData?.map((item) => ({ ...item, iscurrent: false }))
            const arrayUniqueByKey = [...new Map(questionsData?.map(item => [item['questionid'], item])).values()];
            if (arrayUniqueByKey.length > 1) {
                questionsData[questionsData?.length - 1].iscurrent = true
            }
        }
        const arrayUniqueByKey = [...new Map(questionsData?.map(item => [item['questionid'], item])).values()];
        if (arrayUniqueByKey.length > 1) {
            if (arrayUniqueByKey[1]?.questionid === singleQuestionData.Questionid) {
                const topQue = questionsData.filter((item) => item.questionid === questionsData[0].questionid)
                questionsData?.splice(topQue?.length, questionsData?.length - 1)
                navigate('/piqplan-medicare')
            }
            findQ = questionsData?.findIndex((item) => item.iscurrent === true)
            AuthStorage.setStorageJsonEncreptedData(STORAGEKEY.questionsData, questionsData, true)
            dispatch(getQuestionById(questionsData[findQ]['questionid']))
        } else {
            if (questionsData.length <= 0) {
                navigate('/piqplan-medicare')
            } else {
                dispatch(getQuestionById(questionsData[questionsData.length - 1].questionid))
                if (arrayUniqueByKey.length == 1) {
                    navigate('/piqplan-medicare')
                }
            }
        }
        /* if (questionsData?.length === 1 || !questionsData?.length) {
            if (questionsData) {
                dispatch(getQuestionById(questionsData[0].Questionid))
            }
            // setQuestions([])
        } else {
            // let pop = questions.pop()
            // const lastItem = questions[questions.length - 1];
            // setQuestions([...questions])
            dispatch(getQuestionById(questionsData?.slice(-1)[0]['questionid']))
           // questionsData?.splice(-1)
           // AuthStorage.setStorageJsonData(STORAGEKEY.questionsData,  questionsData, true) 
        } */
    }
    const options = [
        "Oliver Hansen",
        "Van Henry",
        "April Tucker",
        "Ralph Hubbard",
        "Omar Alexander",
        "Carlos Abbott",
        "Miriam Wagner",
        "Bradley Wilkerson",
        "Virginia Andrews",
        "Kelly Snyder"
    ];

    const handleChange = (event) => {
        const value = event.target.value;
        if (value == "") {

        }
        const questionsData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.questionsData)
        /*  if (value[value.length - 1] === "all") {
             setSelected(selected.length === options.length ? [] : options);
             return;
         } */
        var answerVal = (value) ? value : questionsData?.find((item) => item.questionid == parseInt(event.target.name))?.value
        setSingleQuestionData({
            ...singleQuestionData,
            answer: answerVal
        })
        setSelected(value);
    };

    const handleChangeZipCode = (event) => {
        const value = event.target.value.slice(0, 5);
        if (value == "") {
            setZipCodeInfo(null)
            setIsZipCodeVerify(false)
        }
        // if(singleQuestionData.answer.length === 5) {
        //     return
        // }

        if (value?.length === 5) {
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
        // return
        const questionsData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.questionsData)
        /*  if (value[value.length - 1] === "all") {
             setSelected(selected.length === options.length ? [] : options);
             return;
         } */
        var answerVal = (value) ? value : questionsData?.find((item) => item.questionid == parseInt(event.target.name))?.value
        setSingleQuestionData({
            ...singleQuestionData,
            answer: answerVal
        })
        setSelected(value);
    };

    useEffect(() => {
        if (zipCodeData) {
            setZipCodeInfo(zipCodeData?.ZipCodes[0])
            AuthStorage.setStorageJsonEncreptedData(STORAGEKEY.locationData, zipCodeData?.ZipCodes[0], true)
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
            setZipCodeInfo(null)
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

    useEffect(() => {
        var currentDate = new Date();
        currentDate.setFullYear(currentDate.getFullYear() - 65);
        var minDate = '1-' + (currentDate.getMonth()) + '-' + (currentDate.getFullYear());
        currentDate.setFullYear(currentDate.getFullYear() + 150);
        var maxDate = '1-' + (currentDate.getMonth()) + '-' + (currentDate.getFullYear());
        setMinDate(minDate);
        setMaxDate(maxDate);
    }, [date])

    const handleDateChange = (event, name) => {
        const value = event;
        setDate(event?.$y);
        const questionsData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.questionsData)
        /* if (value[value.length - 1] === "all") {
            setSelected(selected.length === options.length ? [] : options);
            return;
        } */;
        let ans = questionsData?.find((item) => item.questionid == parseInt(name))?.value
        var answerVal = (value) ? value : (ans) ? ans : ""
        setSingleQuestionData({
            ...singleQuestionData,
            answer: answerVal
        })
        setSelected(value);
        // setShowError(false);
    };

    const goToNext = (optionId, optionText, nextQuestion) => {
        // if(!singleQuestionData.answer){
        //     setShowError(true)
        //     return
        // }
        dispatch(setIsLoading(true));
        setShowError(false)
        setShowErrorText('')
        setSelected("");
        let answertext = "";
        let questionsData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.questionsData)
        questionsData = questionsData?.map((item) => ({
            ...item,
            iscurrent: false
        }))
        var multiplechoiceid = singleQuestionData.Multiplechoices[0].Multiplechoiceid;
        if (singleQuestionData.QuestionType === "Doctorcontrol") {
            const DoctorAnswer = [];
            selectedDoctors.map((item) => {
                if (item.questionId == singleQuestionData.Questionid) {
                    DoctorAnswer.push(item)
                }
            })
            answertext = DoctorAnswer;
        } else if (singleQuestionData.QuestionType === "Drugcontrol") {
            let newAns = true;
            selectedDrug.map((item) => {
                if (item.questionId != singleQuestionData.Questionid) {
                    newAns = false;
                }
            })
            answertext = (newAns) ? selectedDrug : "";
        } else if (singleQuestionData.QuestionType === "PharmacyControl") {
            const PharmacyAnswer = [];
            selectedPharmacy.map((item) => {
                if (item.questionId == singleQuestionData.Questionid) {
                    PharmacyAnswer.push(item)
                }
            })
            answertext = PharmacyAnswer;
        } else {
            answertext = selected;
        }
        if (optionId != null) {
            multiplechoiceid = optionId;
            answertext = optionText
        }
        if (singleQuestionData.Isrequired) {
            if (answertext == "" || answertext == null || answertext == undefined || answertext.length === 0) {
                setShowErrorText(singleQuestionData.Requirederrormessage)
                setShowError(true)
                dispatch(setIsLoading(false));
                return
            }
        }
        if (singleQuestionData.QuestionType === "Date" || singleQuestionData.QuestionType === "Yeartextbox") {
            const date = singleQuestionData.answer;
            const dateFormat = 'MM-DD-YYYY';
            const toDateFormat = moment(new Date(date)).format(dateFormat);
            const isValid = moment(toDateFormat, dateFormat, true).isValid()

            if (isValid == false || (new Date(PICK_DATE.AGE_FROM).getFullYear() > new Date(singleQuestionData.answer).getFullYear() || new Date(PICK_DATE.AGE_TO).getFullYear() < new Date(singleQuestionData.answer).getFullYear())) {
                setShowError(true)
                setShowErrorText('Please enter a valid date')
                dispatch(setIsLoading(false));
                return
            }
        }
        if (singleQuestionData.QuestionType === "EffectiveDate") {
            const date = singleQuestionData.answer;
            const dateFormat = 'MM-DD-YYYY';
            const toDateFormat = moment(new Date(date)).format(dateFormat);
            const todayDate = moment(new Date()).format(dateFormat);
            const isValid = moment(toDateFormat, dateFormat, true).isValid()
            if (isValid) {
                if (!moment(toDateFormat).isSame(todayDate)) {
                    if (!moment(new Date(toDateFormat)).isAfter(new Date())) {
                        setShowError(true)
                        setShowErrorText('Please enter a valid date')
                        dispatch(setIsLoading(false));
                        return
                    }
                }
            } else {
                setShowError(true)
                setShowErrorText('Please enter a valid date')
                dispatch(setIsLoading(false));
                return
            }
        }
        // let orderNo = singleQuestionData?.Qno + 1
        // getQuestionByIdAndOrderNoAPI(singleQuestionData?.Qno,surveyData.Surveyid)  // If goToId not present
        // const nextQuestion = questionData.find((item) => item.Qno === orderNo)

        // var QuestionsIdArr = questionsData?.map(function (obj) { return obj.questionid; });
        // QuestionsIdArr = QuestionsIdArr.filter(function (v, i) { return QuestionsIdArr.indexOf(v) == i; });
        const findQuestionI = questionsData?.findIndex((item) => item.questionid === singleQuestionData.Questionid)
        if (findQuestionI >= 0) {
            if (findQuestionI !== questionsData?.length - 1) {
                questionsData?.splice(findQuestionI + 1, questionsData?.length - 1)
            }
            // questionsData?.splice(findQuestionI+1, questionsData?.length - 1)
            questionsData[findQuestionI].answertext = answertext;
            questionsData[findQuestionI].multiplechoiceid = multiplechoiceid;
            questionsData[findQuestionI].iscurrent = false;
        } else {
            const quotitmapparam = singleQuestionData?.Multiplechoices.find((item) => parseInt(item.Multiplechoiceid) === parseInt(multiplechoiceid))?.Quotitmapparam
            const body = {
                userid: 1,
                multiplechoiceid: multiplechoiceid,
                questionid: singleQuestionData.Questionid,
                Qno: singleQuestionData.Qno,
                surveyid: singleQuestionData.Surveyid,
                answertext: answertext,
                quotitmapparam: quotitmapparam,
                selectiondate: new Date(),
                // nextQuestionId: (nextQuestion) ? nextQuestion.Questionid : 0,
                gotqid: nextQuestion,
                iscurrent: false,
                inquiry:
                {
                    surveyid: singleQuestionData.Surveyid,
                    userid: 1,
                }
            };
            questionsData?.push(body)
        }
        AuthStorage.setStorageJsonEncreptedData(STORAGEKEY.questionsData, questionsData, true)
        // if (nextQuestion) {
        if (nextQuestion) {
            dispatch(getQuestionById(nextQuestion))
        } else {
            getQuestionByIdAndOrderNoAPI(singleQuestionData?.Qno, surveyData.Surveyid) // If goToId not present
        }
        //setQuestions([...questions, nextQuestion.Questionid])
        // } else {
        //     navigate('/planlist')
        // }
    }

    const openDoctorModal = () => {
        setShowDoctorModal(true)
    }
    const openDrugControl = () => {
        setShowDrugControl(true)
    }
    const openPharmacyControl = () => {
        setShowPharmacyControl(true)
    }

    const closeModal = () => {
        setShowDoctorModal(false)
    }

    const addDoctor = (data) => {
        setSelectedDoctors([...selectedDoctors, { ...data }])
        closeModal()
    }

    const deleteSelectedDoc = (data) => {
        let newData = selectedDoctors.filter((item) => item.ProviderName !== data.ProviderName)
        setSelectedDoctors(newData)
    }

    const addDrug = (data) => {
        setSelectedDrug([...selectedDrug, { ...data }])
        setShowDrugControl(false)
    }

    const deleteSelectedDrug = (data) => {
        let newData = selectedDrug.filter((item) => item.GenericName !== data.GenericName)
        setSelectedDrug(newData)
    }

    const addPharmacy = (data) => {
        setSelectedPharmacy([...selectedPharmacy, { ...data }])
        setShowPharmacyControl(false)
    }

    const deleteSelectedPharmacy = (data) => {
        let newData = selectedPharmacy.filter((item) => item.PharmacyName !== data.PharmacyName)
        setSelectedPharmacy(newData)
    }

    const closeEligibaleModal = () => {
        setSingleQuestionData({
            ...singleQuestionData,
            answer: null
        })
        setEligibleModelOpen(false)
        dispatch({
            type: ELIGIBLECHECK,
            payload: null
        })
    }

    return (
        <>
            <div className='product-main'>
                <div className='product-content' style={{ minHeight: '70vh' }}>
                    <div className='left-content-box' style={{ paddingTop: '50px' }}>
                        <Button
                            className='back-btn'
                            // variant="outlined"
                            onClick={() => backToQuestions()}  // item?.Gotqid
                        >
                            <img src={BackArrow} alt='' />
                            Back
                        </Button>
                        <div className='product-data'>
                            <h4 className='title'>{singleQuestionData?.Qno > 1 && singleQuestionData?.Questiontitle}
                            </h4>
                            <h6 className='sub-title'>
                                {singleQuestionData?.Qno > 1 && ReactHtmlParser(singleQuestionData?.QuestionText)}
                            </h6>
                            <div className='product-data-buttons'>
                                {
                                    singleQuestionData?.QuestionType === "Dropdown" ?
                                        <div style={{ width: "35%" }}>
                                            <div className='product-select'>
                                                {/* <select
                                                id="demo-select-small"
                                                // value={""}
                                                label="Age"
                                                className="enrollment-section-input experience-input w-90"
                                                style={{ color: "#000" }}
                                                onChange={() => { }}
                                            >
                                                {singleQuestionData?.Multiplechoices?.length && singleQuestionData?.Multiplechoices?.map((item) => {
                                                    return (
                                                        <option value={item.Multiplechoiceid}>{item.Multiplechoicetext}</option>
                                                    )
                                                })}
                                            </select> */}
                                                <Select
                                                    id="demo-simple-select"
                                                    name={singleQuestionData.Questionid}
                                                    value={singleQuestionData.answer}
                                                    onChange={handleChange}
                                                    displayEmpty
                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                    style={{ width: "100%" }}
                                                >
                                                    <MenuItem value="" selected>Select</MenuItem>
                                                    {singleQuestionData?.Multiplechoices?.length && singleQuestionData?.Multiplechoices?.map((item) => {
                                                        return (
                                                            <MenuItem value={item.Multiplechoiceid}>{item.Multiplechoicetext}</MenuItem>
                                                        )
                                                    })}
                                                </Select>

                                            </div>
                                            {showError ? showErrorText ? <p style={{ color: "red" }}>{showErrorText}</p> : <p style={{ color: "red" }}>This field is required</p> : ''}
                                            <Button
                                                style={{ marginTop: "15px" }}
                                                className='product-btn p-16-60'
                                                variant="outlined"
                                                onClick={() => goToNext(null, null, singleQuestionData.Multiplechoices[0].Gotqid)}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                        :
                                        singleQuestionData?.QuestionType === "Checkboxlist" ?
                                            <div>
                                                <FormControl className="formControl">
                                                    <InputLabel id="mutiple-select-label">Multiple Select</InputLabel>
                                                    <Select
                                                        labelId="mutiple-select-label"
                                                        multiple
                                                        value={singleQuestionData.answer}
                                                        name={singleQuestionData.Questionid}
                                                        onChange={handleChange}
                                                        className="enrollment-section-input experience-input"
                                                        renderValue={(selected) => selected.join(", ")}
                                                        MenuProps={MenuProps}
                                                    >
                                                        <MenuItem
                                                            value="all"
                                                            classes={{
                                                                root: isAllSelected ? "selectedAll" : ""
                                                            }}
                                                        >
                                                            <ListItemIcon>
                                                                <Checkbox
                                                                    classes={{ indeterminate: "indeterminateColor" }}
                                                                    checked={isAllSelected}
                                                                    indeterminate={
                                                                        selected.length > 0 && selected.length < options.length
                                                                    }
                                                                />
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                classes={{ primary: "selectAllText" }}
                                                                primary="Select All"
                                                            />
                                                        </MenuItem>
                                                        {options.map((option, index) => (
                                                            <MenuItem key={`key:${option}`} value={option}>
                                                                <ListItemIcon>
                                                                    <Checkbox checked={selected.indexOf(option) > -1} />
                                                                </ListItemIcon>
                                                                <ListItemText primary={option} />
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {showError ? showErrorText ? <p style={{ color: "red" }}>{showErrorText}</p> : <p style={{ color: "red" }}>This field is required</p> : ''}
                                                </FormControl>
                                                <Button
                                                    style={{ marginTop: "15px" }}
                                                    className='product-btn p-16-60'
                                                    variant="outlined"
                                                    onClick={() => goToNext(null, null, singleQuestionData.Multiplechoices[0].Gotqid)}
                                                >
                                                    Next
                                                </Button>
                                            </div>
                                            :
                                            singleQuestionData?.QuestionType === "Date" ?
                                                <div style={{ display: "flex", flexDirection: 'column', position: 'relative' }}>
                                                    {/*  <DatePickerForControl
                                                        onChange={(e) => handleDateChange(e, singleQuestionData.Questionid)}
                                                        value={singleQuestionData.answer}
                                                    /> */}
                                                    <DatePicker
                                                        mask="__/__/____"
                                                        views={["day", "month", "year"]}
                                                        // minDate={PICK_DATE.AGE_FROM}
                                                        // maxDate={PICK_DATE.AGE_TO}
                                                        value={singleQuestionData.answer}
                                                        onChange={(e) => handleDateChange(e, singleQuestionData.Questionid)}
                                                        className="enrollment-section-input experience-input"
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                    {showError ? showErrorText ? <p style={{ color: "red" }}>{showErrorText}</p> : <p style={{ color: "red" }}>This field is required</p> : ''}
                                                    <Button
                                                        style={{ marginTop: "15px" }}
                                                        className='product-btn p-16-60'
                                                        variant="contained"
                                                        onClick={() => {
                                                            // if (singleQuestionData.Isrequired) {
                                                            //     if (!singleQuestionData.answer) {
                                                            //         setShowError(true)
                                                            //         setShowErrorText(singleQuestionData.Requirederrormessage)
                                                            //     } else {
                                                            goToNext(null, null, singleQuestionData.Multiplechoices[0].Gotqid)
                                                            //     }
                                                            // }
                                                        }}
                                                    >
                                                        Next
                                                    </Button>
                                                </div>
                                                :
                                                singleQuestionData?.QuestionType === "EffectiveDate" ?
                                                    <div style={{ display: "flex", flexDirection: 'column', position: 'relative' }}>
                                                        {/*  <DatePickerForControl
                                                        onChange={(e) => handleDateChange(e, singleQuestionData.Questionid)}
                                                        value={singleQuestionData.answer}
                                                    /> */}
                                                        <DatePicker
                                                            mask="__/__/____"
                                                            views={["day", "month", "year"]}
                                                            minDate={new Date()}
                                                            value={singleQuestionData.answer}
                                                            onChange={(e) => handleDateChange(e, singleQuestionData.Questionid)}
                                                            className="enrollment-section-input experience-input"
                                                            renderInput={(params) => <TextField {...params} />}
                                                        />
                                                        {showError ? showErrorText ? <p style={{ color: "red" }}>{showErrorText}</p> : <p style={{ color: "red" }}>This field is required</p> : ''}
                                                        <Button
                                                            style={{ marginTop: "15px" }}
                                                            className='product-btn p-16-60'
                                                            variant="contained"
                                                            onClick={() => {
                                                                goToNext(null, null, singleQuestionData.Multiplechoices[0].Gotqid)
                                                            }}
                                                        >
                                                            Next
                                                        </Button>
                                                    </div>
                                                    :
                                                    singleQuestionData?.QuestionType === "Zipcode" ?
                                                        <div style={{ display: "flex", flexDirection: 'column', width: "50%" }}>
                                                            {singleQuestionData?.Multiplechoices?.length && singleQuestionData?.Multiplechoices?.map((item) => {
                                                                return (
                                                                    <>
                                                                        <input
                                                                            // name={item.Multiplechoiceid}
                                                                            name={singleQuestionData.Questionid}
                                                                            type="number"
                                                                            value={singleQuestionData.answer}
                                                                            maxLength={5}
                                                                            onChange={handleChangeZipCode}
                                                                            placeholder="Enter value"
                                                                            className='enrollment-section-input experience-input w-90'
                                                                        // onChange={(e) => onChnageHandler(e, "birthday")}
                                                                        />
                                                                        {zipCodeInfo && (
                                                                            <div className='zipcode-block'>
                                                                                <p className='zipcode-info'>{zipCodeInfo?.Counties[0]?.CountyName}, {zipCodeInfo?.StateName}</p>
                                                                                {/* <p className='zipcode-info'><span className='zipcode-info-label'>State Name:</span> {zipCodeInfo?.StateName}</p>
                                                                                <p className='zipcode-info'><span className='zipcode-info-label'>Area Code:</span> {zipCodeInfo?.AreaCodes}</p> */}
                                                                            </div>
                                                                        )
                                                                        }
                                                                    </>
                                                                )
                                                            })}
                                                            {showError ? showErrorText ? <p style={{ color: "red" }}>{showErrorText}</p> : <p style={{ color: "red" }}>This field is required</p> : ''}
                                                            <Button
                                                                style={{ marginTop: "15px" }}
                                                                className='product-btn p-16-60'
                                                                variant="contained"
                                                                disabled={!isZipCodeVerify}
                                                                onClick={() => goToNext(null, null, singleQuestionData.Multiplechoices[0].Gotqid)}
                                                            >
                                                                Next
                                                            </Button>
                                                            {(singleQuestionData?.Hassupportoption) ? <p>I'm not sure!</p> : ""}
                                                        </div>
                                                        :
                                                        singleQuestionData?.QuestionType === "Numbertextbox" ?
                                                            <div style={{ display: "flex", flexDirection: 'column', width: "50%" }}>
                                                                {singleQuestionData?.Multiplechoices?.length && singleQuestionData?.Multiplechoices?.map((item) => {
                                                                    return (
                                                                        <>
                                                                            <input
                                                                                // name={item.Multiplechoiceid}
                                                                                name={singleQuestionData.Questionid}
                                                                                type="number"
                                                                                value={singleQuestionData.answer}
                                                                                maxLength={5}
                                                                                onChange={handleChange}
                                                                                placeholder="Enter value"
                                                                                className='enrollment-section-input experience-input w-90'
                                                                            // onChange={(e) => onChnageHandler(e, "birthday")}
                                                                            />

                                                                        </>
                                                                    )
                                                                })}
                                                                {showError ? showErrorText ? <p style={{ color: "red" }}>{showErrorText}</p> : <p style={{ color: "red" }}>This field is required</p> : ''}
                                                                <Button
                                                                    style={{ marginTop: "15px" }}
                                                                    className='product-btn p-16-60'
                                                                    variant="contained"
                                                                    onClick={() => goToNext(null, null, singleQuestionData.Multiplechoices[0].Gotqid)}
                                                                >
                                                                    Next
                                                                </Button>
                                                                {(singleQuestionData?.Hassupportoption) ? <p>I'm not sure!</p> : ""}
                                                            </div>
                                                            :
                                                            singleQuestionData?.QuestionType === "Doctorcontrol" ?
                                                                <div style={{ display: "block" }}>
                                                                    <div style={{ display: "flex" }}>
                                                                        <Button
                                                                            style={{ marginTop: "15px", marginRight: "25Px" }}
                                                                            className='product-btn p-16-60'
                                                                            variant="contained"
                                                                            onClick={openDoctorModal}
                                                                        >
                                                                            Add a Doctors
                                                                        </Button>
                                                                        <Button
                                                                            style={{ marginTop: "15px" }}
                                                                            className='p-16-60'
                                                                            variant="outlined"
                                                                            onClick={() => goToNext(null, null, singleQuestionData.Multiplechoices[0].Gotqid)}
                                                                            disabled={selectedDoctors?.find((question) => question.questionId === singleQuestionData.Questionid) ? false : true}
                                                                        >
                                                                            Next
                                                                        </Button>
                                                                    </div>
                                                                    {showError ? showErrorText ? <p style={{ color: "red" }}>{showErrorText}</p> : <p style={{ color: "red" }}>This field is required</p> : ''}
                                                                    {selectedDoctors.length ? <div className='selected-doctor-block'>
                                                                        {selectedDoctors && selectedDoctors.map((item) => (item.questionId == singleQuestionData.Questionid ?
                                                                            <div className='selected-doctor'>
                                                                                <div className='selected-doctor-details'>
                                                                                    <p className='doctor-name'>{item.ProviderName}</p>
                                                                                    <p className='brand'>Primary Doctor | Internal Medicine</p>
                                                                                    <div className='brand-dose'>
                                                                                        <label className='brand'>Address :-</label>
                                                                                        <p className='brand'>{item.selectedAddress}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <img src={DeleteIcon} onClick={() => deleteSelectedDoc(item)} alt="Delete" style={{ cursor: 'pointer' }} />
                                                                            </div> : ""
                                                                        ))
                                                                        }
                                                                    </div>
                                                                        : <></>
                                                                    }
                                                                </div>
                                                                :
                                                                singleQuestionData?.QuestionType === "Drugcontrol" ?
                                                                    <div style={{ display: "block" }}>
                                                                        <div style={{ display: "flex", flexWrap: 'wrap' }}>
                                                                            <Button
                                                                                style={{ marginTop: "15px", marginRight: "25Px" }}
                                                                                className='product-btn p-16-60'
                                                                                variant="contained"
                                                                                onClick={openDrugControl}
                                                                            >
                                                                                Add a Prescriptions
                                                                            </Button>
                                                                            <Button
                                                                                style={{ marginTop: "15px" }}
                                                                                className='p-16-60'
                                                                                variant="outlined"
                                                                                onClick={() => goToNext(null, null, singleQuestionData.Multiplechoices[0].Gotqid)}
                                                                                disabled={selectedDrug?.find((question) => question.questionId === singleQuestionData.Questionid) ? false : true}
                                                                            >
                                                                                I'm Done
                                                                            </Button>
                                                                        </div>
                                                                        {showError ? showErrorText ? <p style={{ color: "red" }}>{showErrorText}</p> : <p style={{ color: "red" }}>This field is required</p> : ''}
                                                                        {selectedDrug.length ? <div className='selected-doctor-block'>
                                                                            {selectedDrug && selectedDrug.map((item) => (item.questionId == singleQuestionData.Questionid ?
                                                                                <div className='selected-doctor' style={{ maxWidth: '456px' }}>
                                                                                    <div className='selected-doctor-details'>
                                                                                        <p className='doctor-name'>{item.GenericName}</p>
                                                                                        {/* <p>{item.GenericName+" "+item.ProductType+" "+item.ProductType+" "+item.selectedHour+" time per "+item.selectedDay}</p> */}
                                                                                        <div className='brand-dose'>
                                                                                            <label className='brand'>Brand Name :-</label>
                                                                                            <p className='brand'>{item.ProductType}</p>
                                                                                        </div>
                                                                                        <div className='brand-dose'>
                                                                                            <label className='dosage'>Dosage :-</label>
                                                                                            <p className='dosage'>{item.selectedHour} time  per {item.selectedDay}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <img src={DeleteIcon} onClick={() => deleteSelectedDrug(item)} alt="Delete" style={{ cursor: 'pointer' }} />
                                                                                </div> : ""
                                                                            ))
                                                                            }
                                                                        </div>
                                                                            : <></>
                                                                        }
                                                                    </div>
                                                                    :
                                                                    singleQuestionData?.QuestionType === "PharmacyControl" ?
                                                                        <div style={{ display: "block" }}>
                                                                            <div style={{ display: "flex", flexWrap: 'wrap' }}>
                                                                                <Button
                                                                                    style={{ marginTop: "15px", marginRight: "25Px" }}
                                                                                    className='product-btn p-16-60'
                                                                                    variant="contained"
                                                                                    onClick={openPharmacyControl}
                                                                                >
                                                                                    Add a Pharmacy
                                                                                </Button>
                                                                                <Button
                                                                                    style={{ marginTop: "15px" }}
                                                                                    className='p-16-60'
                                                                                    variant="outlined"
                                                                                    onClick={() => goToNext(null, null, singleQuestionData.Multiplechoices[0].Gotqid)}
                                                                                    disabled={selectedPharmacy?.find((question) => question.questionId === singleQuestionData.Questionid) ? false : true}
                                                                                >
                                                                                    I'm Done
                                                                                </Button>
                                                                            </div>
                                                                            {showError ? showErrorText ? <p style={{ color: "red" }}>{showErrorText}</p> : <p style={{ color: "red" }}>This field is required</p> : ''}
                                                                            {""}
                                                                            {selectedPharmacy.length ? <div className='selected-doctor-block'>
                                                                                {selectedPharmacy && selectedPharmacy.map((item) => (item.questionId == singleQuestionData.Questionid ?
                                                                                    <div className='selected-doctor' style={{ maxWidth: '456px' }}>
                                                                                        <div className='selected-doctor-details'>
                                                                                            <p className='doctor-name'>{item.PharmacyName}</p>
                                                                                            <p className='brand'>{item.Address1}</p>
                                                                                            <p className='brand'>{item.City + " " + item.State}</p>
                                                                                        </div>
                                                                                        <img src={DeleteIcon} onClick={() => deleteSelectedPharmacy(item)} alt="Delete" style={{ cursor: 'pointer' }} />
                                                                                    </div> : ""
                                                                                ))
                                                                                }
                                                                            </div>
                                                                                : <></>
                                                                            }
                                                                        </div>
                                                                        :
                                                                        singleQuestionData?.Multiplechoices?.length ? singleQuestionData?.Multiplechoices.filter((ite) => ite.Isactive === true).map((item) => {
                                                                            if (singleQuestionData.QuestionType === "Textbox") {
                                                                                return (
                                                                                    <div style={{ display: "flex", flexDirection: "column", width: "35%" }}>
                                                                                        <input
                                                                                            // name={item.Multiplechoiceid}
                                                                                            name={singleQuestionData.Questionid}
                                                                                            type="text"
                                                                                            value={singleQuestionData.answer}
                                                                                            onChange={handleChange}
                                                                                            placeholder="Enter value"
                                                                                            className='enrollment-section-input experience-input w-90'
                                                                                        // onChange={(e) => onChnageHandler(e, "birthday")}
                                                                                        />
                                                                                        {showError ? showErrorText ? <p style={{ color: "red" }}>{showErrorText}</p> : <p style={{ color: "red" }}>This field is required</p> : ''}
                                                                                        <Button
                                                                                            style={{ marginTop: "15px" }}
                                                                                            className='product-btn p-16-60'
                                                                                            variant="contained"
                                                                                            onClick={() => goToNext(null, null, item.Gotqid)}
                                                                                        >
                                                                                            Next
                                                                                        </Button>
                                                                                    </div>
                                                                                )
                                                                            } else if (singleQuestionData.QuestionType === "Yeartextbox") {
                                                                                return (
                                                                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                                                                        <DatePicker
                                                                                            views={['year']}
                                                                                            mask="____"
                                                                                            minDate={PICK_DATE.AGE_FROM}
                                                                                            maxDate={PICK_DATE.AGE_TO}
                                                                                            disableFuture
                                                                                            value={singleQuestionData.answer}
                                                                                            onChange={(e) => handleDateChange(e, singleQuestionData.Questionid)}
                                                                                            className="enrollment-section-input experience-input"
                                                                                            renderInput={(params) => <TextField {...params} />}
                                                                                        />
                                                                                        {showError ? showErrorText ? <p style={{ color: "red" }}>{showErrorText}</p> : <p style={{ color: "red" }}>This field is required</p> : ''}
                                                                                        <Button
                                                                                            style={{ marginTop: "15px" }}
                                                                                            className='product-btn p-16-60'
                                                                                            variant="contained"
                                                                                            onClick={() => goToNext(null, null, singleQuestionData.Multiplechoices[0].Gotqid)}
                                                                                        >
                                                                                            Next
                                                                                        </Button>
                                                                                    </div>
                                                                                )
                                                                            }
                                                                            else if (singleQuestionData.QuestionType === "Twobuttons" || singleQuestionData.QuestionType === "MultipleButtons") {
                                                                                if (item.Isbest) {
                                                                                    return (
                                                                                        <Button
                                                                                            className={singleQuestionData.answer == item?.Multiplechoicetext ? 'product-btn p-16-60 highlight-btn' : 'p-16-60 primary-outline-button highlight-btn'}
                                                                                            variant="contained"
                                                                                            onClick={() => goToQuestion(item?.Gotqid, item?.Multiplechoiceid, item?.Multiplechoicetext)}
                                                                                        >
                                                                                            {item?.Multiplechoicetext}
                                                                                        </Button>
                                                                                    )
                                                                                } else {
                                                                                    return (
                                                                                        <Button
                                                                                            className={singleQuestionData.answer == item?.Multiplechoicetext ? 'product-btn p-16-60' : 'p-16-60 primary-outline-button'}
                                                                                            variant="contained"
                                                                                            onClick={() => goToQuestion(item?.Gotqid, item?.Multiplechoiceid, item?.Multiplechoicetext)}
                                                                                        >
                                                                                            {item?.Multiplechoicetext}
                                                                                        </Button>
                                                                                    )
                                                                                }
                                                                            }
                                                                            else if (singleQuestionData.QuestionType === "Textarea") {
                                                                                return (
                                                                                    <div style={{ width: "35%" }}>
                                                                                        <input
                                                                                            type="text"
                                                                                            value={singleQuestionData.answer}
                                                                                            name={singleQuestionData.Questionid}
                                                                                            onChange={handleChange}
                                                                                            // placeholder="yyyy"
                                                                                            className='enrollment-section-input experience-input w-90'
                                                                                        />
                                                                                        {showError ? showErrorText ? <p style={{ color: "red" }}>{showErrorText}</p> : <p style={{ color: "red" }}>This field is required</p> : ''}
                                                                                        {/* <DatePickerForControl
                                                                        /> */}
                                                                                        <Button
                                                                                            style={{ marginTop: "15px" }}
                                                                                            className='product-btn p-16-60'
                                                                                            variant="contained"
                                                                                            onClick={() => goToNext(null, null, singleQuestionData.Multiplechoices[0].Gotqid)}
                                                                                        >
                                                                                            Next
                                                                                        </Button>
                                                                                    </div>
                                                                                )
                                                                            }
                                                                        }) :
                                                                            <>
                                                                                {/* <Button
                                                        className='product-btn p-16-60'
                                                        variant="contained"
                                                        onClick={() => goToNext()}
                                                    >
                                                        Next
                                                    </Button> */}
                                                                            </>
                                }

                                {/* <Button className='primary-outline-button p-16-60' variant='outlined'>I'm already on Medicare</Button> */}
                            </div>
                            {(singleQuestionData?.Hassupportoption) &&
                                <div style={{paddingTop:'24px'}}>
                                    <a target="_blank" href={process.env.REACT_APP_FRONTEND_URL + 'talk-to-advisers'} className="link-surveys">
                                        {/* <p> */}
                                        {singleQuestionData?.Supportoptiontext ?? "I am not sure"}
                                        {/* </p> */}
                                    </a>
                                </div>
                            }
                        </div>
                    </div>
                    <div className='right-image-box' style={{ height: "100%" }}>
                        <img src={singleQuestionData?.Frontendimage ? singleQuestionData?.Frontendimage : ProductSide} className="" height="100%" alt='' />
                    </div>
                </div>
                {showDoctorModal && <DoctorControl open={showDoctorModal} handleClose={() => closeModal()} onAddDoctor={(e) => addDoctor(e)} currentQuestion={singleQuestionData.Questionid} />}
                {showDrugControl && <Drugcontrol open={showDrugControl} handleClose={() => setShowDrugControl(false)} onAddDrug={(e) => addDrug(e)} currentQuestion={singleQuestionData.Questionid} />}
                {eligibleModelOpen && <EligiblecheckModel open={eligibleModelOpen} handleClose={closeEligibaleModal}
                    IsEligible={IsEligible} eligibleText={eligibleText} isDataToShow={isDataToShow}
                    effectiveDateValidationError={effectiveDateValidationError} dateValidationError={dateValidationError} />}
                {showPharmacyControl && <PharmacieControl open={showPharmacyControl} onAddPharmacy={(e) => addPharmacy(e)} currentQuestion={singleQuestionData.Questionid} handleClose={() => setShowPharmacyControl(false)} />}
            </div>
        </>
    )
}

export default Product