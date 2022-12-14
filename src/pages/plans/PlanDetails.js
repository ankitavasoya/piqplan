
import { styled } from '@material-ui/core'
import { Button, Dialog, DialogActions, DialogContent, FormControlLabel, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { useEffect, useState, useRef } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import BackArrow from '../../assets/images/back-arrow.png'
import Print from '../../assets/images/print-icon.png'
import Share from '../../assets/images/share-icon.png'
import Wellcare from '../../assets/images/wellcare.png'
import Like from '../../assets/images/like.png'
import { useDispatch, useSelector } from 'react-redux'
import { getPlanDetailsByPlanId } from '../../redux/actions/planAction'
import ReactHtmlParser from 'react-html-parser';
import AuthStorage from '../../helper/AuthStorage'
import STORAGEKEY from '../../config/APP/app.config'
import { saveAnswer } from '../../redux/actions/qnaAction'
import { SAVE_ANSWER } from '../../redux/type'
import { isJson } from '../../helper/utils'
import jsPDF from 'jspdf'
import $ from "jquery";
import { setIsLoading } from '../../redux/actions/loadingAction'

const PlanDetails = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const id = queryParams.get("id")
  const getPlanDetailsData = useSelector((state) => state.planData.getPlanDetails)
  const getSaveAnswer = useSelector((state) => state.qnaData.saveAnswer)
  const [planDetails, setPlanDetails] = useState()
  const [open, setOpen] = useState(false)
  const [showmore, setShowmore] = useState(false)
  const pdfRef = useRef(null);


  useEffect(() => {
    $('html, body').animate({
      scrollTop: $(`${location.hash}`).offset()?.top - 220
    }, 500);
  }, [location.hash])


  useEffect(() => {
    if (id) {
      const body = {
        "RemoteAccessKey": "C62D4B2E-588A-4653-8CB3-616E9EF99E85",
        "WebsiteAccessKey": "C62D4B2E-588A-4653-8CB3-616E9EF99E85",
        "BrokerId": "23656670",    //-----static
        "IfpRateFactors": {
          "EffectiveDate": "2022-07-01",   //-----static
          "ZipCode": "75014",  // ------questions zip code
          "Members": [
            {
              "MemberId": "123",     //------questions MUI
              "MemberType": "Subscriber",    //---------- static
              "RelationshipType": "Self",    //----- questions / defualt self 
              "DateOfBirth": "1988-07-21",  //------ questions DOB
              "Gender": "Male",   //------ questions Gender
              "LivesInHousehold": "true"  //---------- static
            }
          ]
        },
        "Preferences": {  //---------- static
          "InsuranceTypes": [
            "MedicareAdvantage"
          ],
          "PlanVisibility": "All",
          "QuoteFormat": "Summary",
          "Addons": [
            "CarrierData",
            "PlanData",
            "BenefitsTiny",
            "BenefitsFull",
            "BenefitsFlag",
          ],
          "DrugFilter": {
            "RxCUIs": [""]
          },
          "PlanFilters": [
            {
              "PlanId": id
            }
          ]
        },
      }
      dispatch(getPlanDetailsByPlanId(body))
    }
  }, [])
  const enrollPlan = () => {
    if (AuthStorage.getToken()) {
      AuthStorage.setStorageJsonEncreptedData(STORAGEKEY.enrollPlanData, planDetails, true)
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

  useEffect(() => {
    if (getPlanDetailsData) {
      getPlanDetailsData?.IfpQuote?.Carriers.map((item) => {
        const img = item.CarrierDetails.LogoFileSmall
        const CarrierId = item?.CarrierId
        item?.PlanRates?.map((planrates) => {
          if (planrates.PlanId === id) {
            let data = planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "CovGapPrefMail") //Preferred mail order cost-sharing
            let CovGapStanmail = planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "CovGapStanMail") //Standard mail order cost-sharing
            let CovGapStanretail = planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "CovGapStanRetail") //Standard retail cost-sharing
            let InitialcovstanRetail = planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "InitialCovStanRetail") //Initial Coverage Copays -- Standard retail cost-sharing 
            let InitialCovprefMail = planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "InitialCovPrefMail") //Initial Coverage Copays -- Preferred mail order cost-sharing 
            let InitialCovstanMail = planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "InitialCovStanMail") //Initial Coverage Copays -- Standard mail order cost-sharing 
            let Comprehensivedental = planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "ComprehensiveDental") //Initial Coverage Copays -- Standard mail order cost-sharing 
            let Visionservices = planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "VisionServices") //Initial Coverage Copays -- Standard mail order cost-sharing 
            let hearingServices = planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "HearingServices") //hearing

            let ComprehensiveDental = []
            Comprehensivedental?.Coverages?.map((item) => {
              item?.ViewPoints?.map((viewItem) => {
                viewItem?.Services?.map((serviceItem) => {
                  ComprehensiveDental.push({
                    ServiceType: serviceItem?.ServiceType,
                    Description: serviceItem?.Description,
                  })
                })
              })
            })

            let HearingServices = []
            hearingServices?.Coverages?.map((item) => {
              item?.ViewPoints?.map((viewItem) => {
                viewItem?.Services?.map((serviceItem) => {
                  HearingServices.push({
                    ServiceType: serviceItem?.ServiceType,
                    Description: serviceItem?.Description,
                  })
                })
              })
            })

            let VisionServices = []
            Visionservices?.Coverages?.map((item) => {
              item?.ViewPoints?.map((viewItem) => {
                viewItem?.Services?.map((serviceItem) => {
                  VisionServices.push({
                    ServiceType: serviceItem?.ServiceType,
                    Description: serviceItem?.Description,
                  })
                })
              })
            })

            let CovGapPrefMail = []
            data?.Coverages?.map((item) => {
              item?.ViewPoints?.map((viewItem) => {
                viewItem?.Services?.map((serviceItem) => {
                  CovGapPrefMail.push({
                    ServiceType: serviceItem?.ServiceType,
                    Description: serviceItem?.Description,
                  })
                })
              })
            })

            let CovGapStanMail = []
            CovGapStanmail?.Coverages?.map((item) => {
              item?.ViewPoints?.map((viewItem) => {
                viewItem?.Services?.map((serviceItem) => {
                  CovGapStanMail.push({
                    ServiceType: serviceItem?.ServiceType,
                    Description: serviceItem?.Description,
                  })
                })
              })
            })

            let CovGapStanRetail = []
            CovGapStanretail?.Coverages?.map((item) => {
              item?.ViewPoints?.map((viewItem) => {
                viewItem?.Services?.map((serviceItem) => {
                  CovGapStanRetail.push({
                    ServiceType: serviceItem?.ServiceType,
                    Description: serviceItem?.Description,
                  })
                })
              })
            })

            let InitialCovstanRetail = []
            InitialcovstanRetail?.Coverages?.map((item) => {
              item?.ViewPoints?.map((viewItem) => {
                viewItem?.Services?.map((serviceItem) => {
                  InitialCovstanRetail.push({
                    ServiceType: serviceItem?.ServiceType,
                    Description: serviceItem?.Description,
                  })
                })
              })
            })

            let InitialCovPrefMail = []
            InitialCovprefMail?.Coverages?.map((item) => {
              item?.ViewPoints?.map((viewItem) => {
                viewItem?.Services?.map((serviceItem) => {
                  InitialCovPrefMail.push({
                    ServiceType: serviceItem?.ServiceType,
                    Description: serviceItem?.Description,
                  })
                })
              })
            })

            let InitialCovStanMail = []
            InitialCovstanMail?.Coverages?.map((item) => {
              item?.ViewPoints?.map((viewItem) => {
                viewItem?.Services?.map((serviceItem) => {
                  InitialCovStanMail.push({
                    ServiceType: serviceItem?.ServiceType,
                    Description: serviceItem?.Description,
                  })
                })
              })
            })
            setPlanDetails({
              CarrierId: CarrierId,
              LogoFileSmall: img, // image
              Name: planrates?.PlanDetails?.Name, // name
              PlanType: planrates?.PlanDetails?.PlanType, //plan type
              Deductible: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "Deductible")?.FullValue, //annual medical 
              DrugDeductible: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "DrugDeductible")?.FullValue, //prescription drug deductible
              OTCItems: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "OTCItems")?.FullValue,   //OTC benefits
              DentalServices: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "DentalServices")?.FullValue,   //dental
              VisionService: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "VisionServices")?.FullValue,   //vision
              HearingService: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "HearingServices")?.FullValue,   //hearing
              OfficeVisitsPrimary: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "OfficeVisitsPrimary")?.FullValue,   //Primary doctor visit
              UrgentCare: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "UrgentCare")?.FullValue,   //Specialist visit
              DrugCatastrophicCoverage: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "DrugCatastrophicCoverage")?.FullValue,   //Generic drugs Catastrophic Coverage
              MonthlyPremium: planrates?.PlanDetails?.Benefits?.find(it => it?.Enum === "DrugMonthlyPremium")?.FullValue, //MonthlyPremium
              PartBPremiumReduction: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "PartBPremiumReduction")?.FullValue,
              InpatientHospitalCare: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "InpatientHospitalCare")?.FullValue,   //Acute inpatient hospital stay
              MaximumAnnualCopay: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "MaximumAnnualCopay")?.FullValue,   //Out-of-pocket maximum
              FilterDrugCov: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "IncludeRx" && it?.FlagValue === 1)?.FullValue,
              FilterDrugNotCov: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "RxCovered" && it?.FlagValue === 1)?.FullValue,
              FilterRating: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "OverallPlanRating")?.FullValue.replaceAll(/(<([^>]+)>)/ig, ''),
              FilterPlanType: planrates?.PlanDetails?.PlanType,
              CovGapPrefMail: CovGapPrefMail,
              CovGapStanMail: CovGapStanMail,
              CovGapStanRetail: CovGapStanRetail,
              InitialCovstanRetail: InitialCovstanRetail,
              InitialCovPrefMail: InitialCovPrefMail,
              InitialCovStanMail: InitialCovStanMail,
              ComprehensiveDental: ComprehensiveDental,
              VisionServices: VisionServices,
              HearingServices: HearingServices,

              DrugMonthlyPremiumTinyValue: planrates?.PlanDetails?.Benefits?.find(it => it?.Enum === "DrugMonthlyPremium")?.TinyValue,
              DrugDeductibleTinyValue: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "DrugDeductible")?.TinyValue,
              OfficeVisitsSpecialistTinyValue: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "OfficeVisitsSpecialist")?.TinyValue,
              OfficeVisitsPrimaryTinyValue: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "OfficeVisitsPrimary")?.TinyValue,
              SkilledNursingFacilityTinyValue: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "SkilledNursingFacility")?.TinyValue,
              HealthMonthlyPremiumTinyValue: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "HealthMonthlyPremium")?.TinyValue,
              MaximumAnnualOutOfPocketTinyValue: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "MaximumAnnualCopay")?.TinyValue,
              HomeHealthCareTinyValue: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "HomeHealthCare")?.TinyValue,
              OutpatientMentalHealthCareTinyValue: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "OutpatientMentalHealthCare")?.TinyValue,
              EmergencyRoomTinyValue: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "EmergencyRoom")?.TinyValue,
              HospitalInpatientStayTinyValue: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "InpatientHospitalCare")?.TinyValue,
              // TotalEstAnnualCost: `$${parseInt(planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "DrugDeductible")?.TinyValue.replace('$', '')) + parseInt(planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "HealthMonthlyPremium")?.TinyValue.replace('$', ''))}`,
            })
          }
        })
      })
    }
  }, [getPlanDetailsData])

  const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName="Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 20,
    height: 26,
    padding: 0,
    '& MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '& Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + MuiSwitch-track': {
          // backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
          opacity: 1,
          border: 0,
        },
        '&Mui-disabled + MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '& Mui-focusVisible MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '& Mui-disabled  MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      '& Mui-disabled + MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));

  const HighlightsData = (name, calories) => {
    return { name, calories };
  }

  const Highlights = [
    HighlightsData('Plan type', 'Medicare Advantage (HMO)'),
    HighlightsData('Monthly premium', '$0 + Part B Premium'),
    HighlightsData('Annual medical deductible', '$0'),
    HighlightsData('Out-of-pocket maximum', '$6,700'),
    HighlightsData('Prescription drug deductible', '$300 (applies to Tier 3, 4 and 5)'),
    HighlightsData('Acute inpatient hospital stay', 'Up to 90 days covered'),
    HighlightsData('OTC benefits', 'Not covered'),
    HighlightsData('Dental', '$2,000 allowance every year'),
    HighlightsData('Vision', 'Eyewear: $100 allowance every year'),
    HighlightsData('Hearing', 'Hearing aids: $1,500 allowance every year, for both ears combined'),
  ];

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

  // const generatePDF = () => {
  //   const content = pdfRef.current;
  //   const doc = new jsPDF();
  //   doc.html(content, {
  //     x: 0,
  //     y: 0,
  //     autoPaging: 'text',
  //     html2canvas: { scale: 0.1 },
  //     margin: [10, 10, 15, 10],
  //     callback: function (doc) {
  //       doc.save(planDetails?.Name + '.pdf');
  //     },
  //   });
  // }

  const generatePDF = () => {
    try {
      setShowmore(true)
      dispatch(setIsLoading(true))
      const content = pdfRef.current;
      const doc = new jsPDF();
      doc.html(content, {
        x: 0,
        y: 0,
        autoPaging: 'text',
        html2canvas: { scale: 0.1 },
        margin: [20, 10, 15, 10],
        callback: function (doc) {
          doc.save(`${planDetails?.Name ? `${planDetails?.Name}` : 'plan_detail'}`);
          dispatch(setIsLoading(false))
          setShowmore(false)
        },
      });
    } catch (error) {
      setShowmore(false)
      dispatch(setIsLoading(false))
    }
  }

  return (
    <>
      <div>
        <div className='plan-list-main'>
          <div className='plan-list-content w-90 mx-auto' style={{ textAlign: "left", padding: '35px 0px' }}>
            <div className='' style={{ justifyContent: 'space-between', display: 'flex', flexWrap: 'wrap', rowGap: '20px' }}>
              <Button
                className='back-to-plans-btn p-12-24'
                onClick={() => navigate('/planlist')}
                style={{ gap: "10px" }}
              >
                <img src={BackArrow} alt='' />
                Back to Plans
              </Button>
              <div style={{ display: 'flex', columnGap: '16px', flexWrap: 'wrap', rowGap: '20px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <Button
                    className='primary-button p-12-24'
                    onClick={generatePDF}
                    style={{ gap: "10px" }}
                  >
                    <img src={Print} alt='' />
                    Print
                  </Button>
                  <Button
                    className='primary-button p-12-24'
                    onClick={() => navigate('/planlist')}
                    style={{ gap: "10px" }}
                  >
                    <img src={Share} alt='' />
                    Share
                  </Button>
                </div>
                {/* <div className='highlight-main'>
                  <p className="highlight-text">Highlight differences</p>
                  <FormControlLabel sx={{ margin: '0px' }}
                    control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                  // label="iOS style"
                  />
                </div> */}
              </div>
            </div>
            <div className='header-plan-card' style={{}}>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <img src={planDetails?.LogoFileSmall} />
                <p className='enroll-card-text'>{planDetails?.Name}</p>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <Button
                  className='primary-button p-12-24'
                  disabled={!planDetails}
                  // variant="outlined"
                  onClick={() => enrollPlan()}
                  style={{ gap: "10px" }}
                >
                  Enroll
                </Button>
                {/* <div className='like'>
                <img src={Like} />
              </div>
              <div className='close'></div> */}
              </div>
            </div>
          </div>
        </div>
        <div >
          <div className='plan-tab'>
            <a href='#basic'>Basic</a>
            {showmore &&
              <>
                <a href='#benefits'>Benefits</a>
                <a href='#doctors'>Doctors</a>
                <a href='#rx-drugs'>Rx Drugs</a>
                {/* <a href='#hospital'>Hospital</a> */}
                <a href='#dental'>Dental</a>
                <a href='#vision'>Vision</a>
                <a href='#hearing'>Hearing</a>
                {/* <a href='#more'>More</a> */}
              </>}
          </div>
          <div  ref={pdfRef} style={{ height: '100%', overflow: 'auto' }}>
            <div className='w-90' style={{ margin: '50px auto', textAlign: 'center' }} id="Basic">
              <TableContainer className='plan-details-table'>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead style={{ backgroundColor: "#ECF5FE" }}>
                    <TableRow style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                      <TableCell style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#4197F7', width: '50%' }}>Basic Info</TableCell>
                      <TableCell align="" sx={{ color: '#1C2C54' }}>{planDetails?.Name}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* {Highlights.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                  >
                    <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                      {row.name}
                    </TableCell>
                    <TableCell align="left">{row.calories}</TableCell>
                  </TableRow>
                ))} */}

                    <TableRow
                      sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                    >
                      <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        Est. drug cost
                      </TableCell>
                      <TableCell align="left">{ReactHtmlParser(planDetails?.DrugDeductibleTinyValue)}</TableCell>
                    </TableRow>

                    <TableRow
                      sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                    >
                      <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        Health cost
                      </TableCell>
                      <TableCell align="left">{ReactHtmlParser(planDetails?.HealthMonthlyPremiumTinyValue)}</TableCell>
                    </TableRow>

                    <TableRow
                      sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                    >
                      <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        Maximum Annual Out Of Pocket
                      </TableCell>
                      <TableCell align="left">{ReactHtmlParser(planDetails?.MaximumAnnualOutOfPocketTinyValue)}</TableCell>
                    </TableRow>

                    <TableRow
                      sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                    >
                      <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        Medical Deductible
                      </TableCell>
                      <TableCell align="left">{ReactHtmlParser(planDetails?.MaximumAnnualOutOfPocketTinyValue)}</TableCell>
                    </TableRow>

                    <TableRow
                      sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                    >
                      <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        Doctor Office Visit
                      </TableCell>
                      <TableCell align="left">{ReactHtmlParser(planDetails?.OfficeVisitsPrimaryTinyValue)}</TableCell>
                    </TableRow>

                    <TableRow
                      sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                    >
                      <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        Specialist Office Visit
                      </TableCell>
                      <TableCell align="left">{ReactHtmlParser(planDetails?.OfficeVisitsSpecialistTinyValue)}</TableCell>
                    </TableRow>

                    <TableRow
                      sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                    >
                      <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        Skilled Nursing Facility coinsurance
                      </TableCell>
                      <TableCell align="left">{ReactHtmlParser(planDetails?.SkilledNursingFacilityTinyValue)}</TableCell>
                    </TableRow>

                    <TableRow
                      sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                    >
                      <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        Home Health Care
                      </TableCell>
                      <TableCell align="left">{ReactHtmlParser(planDetails?.HomeHealthCareTinyValue)}</TableCell>
                    </TableRow>

                    <TableRow
                      sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                    >
                      <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        Outpatient Mental Health Care
                      </TableCell>
                      <TableCell align="left">{ReactHtmlParser(planDetails?.OutpatientMentalHealthCareTinyValue)}</TableCell>
                    </TableRow>

                    <TableRow
                      sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                    >
                      <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        Emergency Room
                      </TableCell>
                      <TableCell align="left">{ReactHtmlParser(planDetails?.EmergencyRoomTinyValue)}</TableCell>
                    </TableRow>

                    <TableRow
                      sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                    >
                      <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        Hospital Inpatient Stay
                      </TableCell>
                      <TableCell align="left">{ReactHtmlParser(planDetails?.HospitalInpatientStayTinyValue)}</TableCell>
                    </TableRow>

                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            {showmore && <>
              <div className='w-90' style={{ margin: '50px auto', textAlign: 'center' }} id="benefits">
                <TableContainer className='plan-details-table'>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead style={{ backgroundColor: "#ECF5FE" }}>
                      <TableRow style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        <TableCell style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#4197F7', width: '50%' }}>Benefits</TableCell>
                        <TableCell align="" sx={{ color: '#1C2C54' }}>{planDetails?.Name}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* {Highlights.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                  >
                    <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                      {row.name}
                    </TableCell>
                    <TableCell align="left">{row.calories}</TableCell>
                  </TableRow>
                ))} */}

                      <TableRow
                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                      >
                        <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                          Plan type
                        </TableCell>
                        <TableCell align="left">{ReactHtmlParser(planDetails?.PlanType)}</TableCell>
                      </TableRow>

                      <TableRow
                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                      >
                        <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                          Monthly premium
                        </TableCell>
                        <TableCell align="left">{ReactHtmlParser(planDetails?.MonthlyPremium)}</TableCell>
                      </TableRow>

                      <TableRow
                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                      >
                        <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                          Annual medical deductible
                        </TableCell>
                        <TableCell align="left">{ReactHtmlParser(planDetails?.PartBPremiumReduction)}</TableCell>
                      </TableRow>

                      <TableRow
                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                      >
                        <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                          Out-of-pocket maximum
                        </TableCell>
                        <TableCell align="left">{ReactHtmlParser(planDetails?.MaximumAnnualCopay)}</TableCell>
                      </TableRow>

                      <TableRow
                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                      >
                        <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                          Prescription drug deductible
                        </TableCell>
                        <TableCell align="left">{ReactHtmlParser(planDetails?.DrugDeductible)}</TableCell>
                      </TableRow>

                      <TableRow
                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                      >
                        <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                          Acute inpatient hospital stay
                        </TableCell>
                        <TableCell align="left">{ReactHtmlParser(planDetails?.InpatientHospitalCare)}</TableCell>
                      </TableRow>

                      <TableRow
                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                      >
                        <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                          OTC benefits
                        </TableCell>
                        <TableCell align="left">{ReactHtmlParser(planDetails?.OTCItems)}</TableCell>
                      </TableRow>

                      <TableRow
                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                      >
                        <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                          Dental
                        </TableCell>
                        <TableCell align="left">{ReactHtmlParser(planDetails?.DentalServices)}</TableCell>
                      </TableRow>

                      <TableRow
                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                      >
                        <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                          Vision
                        </TableCell>
                        <TableCell align="left">{ReactHtmlParser(planDetails?.VisionService)}</TableCell>
                      </TableRow>

                      <TableRow
                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                      >
                        <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                          Hearing
                        </TableCell>
                        <TableCell align="left">{ReactHtmlParser(planDetails?.HearingService)}</TableCell>
                      </TableRow>

                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div className='w-90' style={{ margin: '50px auto', textAlign: 'center' }} id="doctors">
                <TableContainer className='plan-details-table'>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead style={{ backgroundColor: "#ECF5FE" }}>
                      <TableRow style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        <TableCell style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#4197F7', width: '50%' }}>Doctors</TableCell>
                        <TableCell colSpan={2} align="" sx={{ color: '#1C2C54' }}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow key={'Doctors'} sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                          Primary doctor visit
                        </TableCell>
                        <TableCell align="left">
                          {/* $0 copay */}
                          {ReactHtmlParser(planDetails?.OfficeVisitsPrimary)}
                        </TableCell>
                      </TableRow>
                      <TableRow key={'Doctors'} sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                          Specialist visit
                        </TableCell>
                        <TableCell align="left">
                          {/* $50 copay */}
                          {ReactHtmlParser(planDetails?.UrgentCare)}
                        </TableCell>
                      </TableRow>
                      {/* <TableRow key={'Doctors'} sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                  <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                    <a href='#'>Add my doctors</a>
                  </TableCell>
                  <TableCell align="left">
                    By adding your doctors, we can determine if they're in network when you choose a plan.
                  </TableCell>
                </TableRow> */}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div className='w-90' style={{ margin: '50px auto', textAlign: 'center' }} id="rx-drugs">
                <TableContainer className='plan-details-table'>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead style={{ backgroundColor: "#ECF5FE" }}>
                      <TableRow style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        <TableCell style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#4197F7', width: '50%' }}>Rx Drugs</TableCell>
                        <TableCell colSpan={2} align="" sx={{ color: '#1C2C54' }}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow key={'Doctors'} sx={{ border: '1px solid rgba(224, 224, 224, 1)', background: '#F3F3F3' }}>
                        <TableCell className='col-span-header' scope="row" colSpan={2} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center' }}>
                          <h1>Annual Costs</h1>
                        </TableCell>
                      </TableRow>
                      <TableRow key={'Doctors'} sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        <TableCell scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                          Prescription drug deductible
                        </TableCell>
                        <TableCell align="left">
                          {/* $300 (applies to Tier 3, 4 and 5) */}
                          {ReactHtmlParser(planDetails?.DrugDeductible)}
                        </TableCell>
                      </TableRow>
                      {/* <TableRow key={'Doctors'} sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                  <TableCell scope="row">
                    <a href='#'>Add my pharmacy</a>
                  </TableCell>
                  <TableCell align="left">
                    Tell us the pharmacy where you fill your prescriptions and we can make a more accurate estimate of your out-of-pocket costs.
                  </TableCell>
                </TableRow> */}
                      {/* <TableRow key={'Doctors'} sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                  <TableCell scope="row">
                    <a href='#'>Add my Rx drugs</a>
                  </TableCell>
                  <TableCell align="left">
                    By knowing your drugs, we can give you a better idea of coverage pricing and out-of-pocket costs.
                  </TableCell>
                </TableRow> */}
                      <TableRow key={'Doctors'} sx={{ border: '1px solid rgba(224, 224, 224, 1)', background: '#F3F3F3' }}>
                        <TableCell className='col-span-header' scope="row" colSpan={2} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center' }}>
                          <h1>Annual Costs</h1>
                          <p>Initial Coverage starts after you pay your deductible, if applicable, and covers up to the Initial Coverage Limit of $4,430.</p>
                        </TableCell>
                      </TableRow>
                      <TableRow key={'Doctors'} sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        <TableCell align="left">
                          Preferred retail cost-sharing
                        </TableCell>
                        <TableCell align="right">
                          <a href='#'>Show Details</a>
                        </TableCell>
                      </TableRow>
                      <TableRow key={'Doctors'} sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        <TableCell align="left">
                          Standard retail cost-sharing
                        </TableCell>
                        <TableCell align="right">
                          <a href='#'>Show Details</a>
                        </TableCell>
                      </TableRow>

                      <TableRow key={'Doctors'} sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        <TableCell align="left">
                          Preferred mail order cost-sharing
                        </TableCell>
                        <TableCell align="right">
                          <a href='#'>Show Details</a>
                        </TableCell>

                      </TableRow>
                      <TableRow key={'Doctors'} sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        <TableCell align="left">
                          Standard mail order cost-sharing
                        </TableCell>
                        <TableCell align="right">
                          <a href='#'>Show Details</a>
                        </TableCell>
                      </TableRow>
                      <TableRow key={'Doctors'} sx={{ border: '1px solid rgba(224, 224, 224, 1)', background: '#F3F3F3' }}>
                        <TableCell className='col-span-header' scope="row" colSpan={2} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center' }}>
                          <h1>Coverage GAP (Donut Hole)</h1>
                          <p>Initial Coverage starts after you pay your deductible, if applicable, and covers up to the Initial Coverage Limit of $4,430.</p>
                        </TableCell>
                      </TableRow>
                      <TableRow key={'Doctors'} sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        <TableCell scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                          Generic drugs
                        </TableCell>
                        <TableCell align="left">
                          25% coinsurance
                        </TableCell>
                      </TableRow>
                      <TableRow key={'Doctors'} sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        <TableCell scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                          Brand-name drugs
                        </TableCell>
                        <TableCell align="left">
                          25% coinsurance
                        </TableCell>
                      </TableRow>

                      <TableRow key={'nothing'} sx={{ border: '1px solid rgba(224, 224, 224, 1)', background: '#F3F3F3' }}>
                        <TableCell className='col-span-header' scope="row" colSpan={2} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center' }}>
                          <h1>Initial Coverage Copays</h1>
                          <p>Initial Coverage starts after you pay your deductible, if applicable, and covers up to the Initial Coverage Limit of $4,430.</p>
                        </TableCell>
                      </TableRow>

                      <TableRow key={'nothing'} sx={{ border: '1px solid rgba(224, 224, 224, 1)', background: '#F3F3F3' }}>
                        <TableCell className='col-span-header' scope="row" colSpan={2} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center' }}>
                          <h1>Standard retail cost-sharing</h1>
                        </TableCell>
                      </TableRow>
                      <>
                        {planDetails?.InitialCovstanRetail?.map((row) => (
                          <TableRow
                            key={'nothing'}
                            sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                          >
                            <TableCell scope="" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                              {`${row?.ServiceType}`}
                            </TableCell>

                            <TableCell scope="" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                              {ReactHtmlParser(row?.Description)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>

                      <TableRow key={'nothing'} sx={{ border: '1px solid rgba(224, 224, 224, 1)', background: '#F3F3F3' }}>
                        <TableCell className='col-span-header' scope="row" colSpan={2} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center' }}>
                          <h1>Preferred mail order cost-sharing</h1>
                        </TableCell>
                      </TableRow>
                      <>
                        {planDetails?.InitialCovPrefMail?.map((row) => (
                          <TableRow
                            key={'nothing'}
                            sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                          >
                            <TableCell scope="" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                              {`${row?.ServiceType}`}
                            </TableCell>

                            <TableCell scope="" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                              {ReactHtmlParser(row?.Description)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>

                      <TableRow key={'nothing'} sx={{ border: '1px solid rgba(224, 224, 224, 1)', background: '#F3F3F3' }}>
                        <TableCell className='col-span-header' scope="row" colSpan={2} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center' }}>
                          <h1>Standard mail order cost-sharing</h1>
                        </TableCell>
                      </TableRow>
                      <>
                        {planDetails?.InitialCovStanMail?.map((row) => (
                          <TableRow
                            key={'nothing'}
                            sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                          >
                            <TableCell scope="" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                              {`${row?.ServiceType}`}
                            </TableCell>

                            <TableCell scope="" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                              {ReactHtmlParser(row?.Description)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>

                      <TableRow key={'nothing'} sx={{ border: '1px solid rgba(224, 224, 224, 1)', background: '#F3F3F3' }}>
                        <TableCell className='col-span-header' scope="row" colSpan={2} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center' }}>
                          <h1>Preferred mail order cost-sharing </h1>
                        </TableCell>
                      </TableRow>

                      <>
                        {planDetails?.CovGapPrefMail?.map((row) => (
                          <TableRow
                            key={'nothing'}
                            sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                          >
                            <TableCell scope="" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                              {`${row?.ServiceType}:Preferred mail`}
                            </TableCell>

                            <TableCell scope="" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                              {ReactHtmlParser(row?.Description)}
                            </TableCell>
                          </TableRow>
                        ))}

                        <TableRow key={'nothing'} sx={{ border: '1px solid rgba(224, 224, 224, 1)', background: '#F3F3F3' }}>
                          <TableCell className='col-span-header' scope="row" colSpan={2} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center' }}>
                            <h1>Standard retail cost-sharing </h1>
                          </TableCell>
                        </TableRow>

                        {planDetails?.CovGapStanRetail?.map((row) => (
                          <TableRow
                            key={'nothing'}
                            sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                          >
                            <TableCell scope="" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                              {`${row?.ServiceType}:Standard retail`}
                            </TableCell>

                            <TableCell scope="" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                              {ReactHtmlParser(row?.Description)}
                            </TableCell>
                          </TableRow>
                        ))}

                        <TableRow key={'nothing'} sx={{ border: '1px solid rgba(224, 224, 224, 1)', background: '#F3F3F3' }}>
                          <TableCell className='col-span-header' scope="row" colSpan={2} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center' }}>
                            <h1>Preferred mail order cost-sharing</h1>
                          </TableCell>
                        </TableRow>

                        {planDetails?.CovGapStanMail?.map((row) => (
                          <TableRow
                            key={'nothing'}
                            sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                          >
                            <TableCell scope="" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                              {`${row?.ServiceType}:Standard mail`}
                            </TableCell>

                            <TableCell scope="" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                              {ReactHtmlParser(row?.Description)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>

                      <TableRow key={'Doctors'} sx={{ border: '1px solid rgba(224, 224, 224, 1)', background: '#F3F3F3' }}>
                        <TableCell className='col-span-header' scope="row" colSpan={2} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center' }}>
                          <h1>Catastrophic Coverage</h1>
                          <p>Catastrophic Coverage starts when your annual out-of-pocket costs exceed $7,050.</p>
                        </TableCell>
                      </TableRow>
                      <TableRow key={'Doctors'} sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        <TableCell scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                          Generic drugs
                        </TableCell>
                        <TableCell align="left">
                          {ReactHtmlParser(planDetails?.DrugCatastrophicCoverage)}
                        </TableCell>
                      </TableRow>
                      <TableRow key={'Doctors'} sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        <TableCell scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                          Brand-name drugs
                        </TableCell>
                        <TableCell align="left">
                          $9.85 copay OR 5% coinsurance*
                        </TableCell>
                      </TableRow>
                      {/* <TableRow key={'Doctors'} sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                    <TableCell scope="row" colSpan={2} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center' }}>
                      * Whichever is more.
                    </TableCell>
                  </TableRow> */}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div className='w-90' style={{ margin: '50px auto', textAlign: 'center' }} id="dental">
                <TableContainer className='plan-details-table'>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead style={{ backgroundColor: "#ECF5FE" }}>
                      <TableRow style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        <TableCell style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#4197F7', width: '50%' }}>Dental</TableCell>
                        <TableCell colSpan={2} align="" sx={{ color: '#1C2C54' }}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow key={'Doctors'} sx={{ border: '1px solid rgba(224, 224, 224, 1)', background: '#F3F3F3' }}>
                        <TableCell className='col-span-header' scope="row" colSpan={2} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center' }}>
                          <h1>Copays</h1>
                          {/* <p>Catastrophic Coverage starts when your annual out-of-pocket costs exceed $7,050.</p> */}
                        </TableCell>
                      </TableRow>

                      <>
                        {planDetails?.ComprehensiveDental?.map((row) => (
                          <TableRow
                            key={'nothing'}
                            sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                          >
                            <TableCell scope="" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                              {`${row?.ServiceType}`}
                            </TableCell>

                            <TableCell scope="" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                              {ReactHtmlParser(row?.Description)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                      {/* <TableRow key={'Doctors'} sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                    <TableCell scope="row" colSpan={2} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center' }}>
                      * Whichever is more.
                    </TableCell>
                  </TableRow> */}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              <div className='w-90' style={{ margin: '50px auto', textAlign: 'center' }} id="vision">
                <TableContainer className='plan-details-table'>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead style={{ backgroundColor: "#ECF5FE" }}>
                      <TableRow style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        <TableCell style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#4197F7', width: '50%' }}>Vision</TableCell>
                        <TableCell colSpan={2} align="" sx={{ color: '#1C2C54' }}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow key={'Doctors'} sx={{ border: '1px solid rgba(224, 224, 224, 1)', background: '#F3F3F3' }}>
                        <TableCell className='col-span-header' scope="row" colSpan={2} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center' }}>
                          <h1>Copays</h1>
                          {/* <p>Catastrophic Coverage starts when your annual out-of-pocket costs exceed $7,050.</p> */}
                        </TableCell>
                      </TableRow>

                      <>
                        {planDetails?.VisionServices?.map((row) => (
                          <TableRow
                            key={'nothing'}
                            sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                          >
                            <TableCell scope="" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                              {`${row?.ServiceType}`}
                            </TableCell>

                            <TableCell scope="" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                              {ReactHtmlParser(row?.Description)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                      <TableRow key={'Doctors'} sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        <TableCell scope="row" colSpan={2} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center' }}>
                          See Summary of Benefits for more details.
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div className='w-90' style={{ margin: '50px auto', textAlign: 'center' }} id="hearing">
                <TableContainer className='plan-details-table'>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead style={{ backgroundColor: "#ECF5FE" }}>
                      <TableRow style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        <TableCell style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#4197F7', width: '50%' }}>Hearing</TableCell>
                        <TableCell colSpan={2} align="" sx={{ color: '#1C2C54' }}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow key={'Doctors'} sx={{ border: '1px solid rgba(224, 224, 224, 1)', background: '#F3F3F3' }}>
                        <TableCell className='col-span-header' scope="row" colSpan={2} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center' }}>
                          <h1>Copays</h1>
                          {/* <p>Catastrophic Coverage starts when your annual out-of-pocket costs exceed $7,050.</p> */}
                        </TableCell>
                      </TableRow>

                      <>
                        {planDetails?.HearingServices?.map((row) => (
                          <TableRow
                            key={'nothing'}
                            sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                          >
                            <TableCell scope="" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                              {`${row?.ServiceType}`}
                            </TableCell>

                            <TableCell scope="" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                              {ReactHtmlParser(row?.Description)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                      <TableRow key={'Doctors'} sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                        <TableCell scope="row" colSpan={2} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center' }}>
                          * Depending on service provided. See Summary of Benefits for more details.
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div> </>}
            <div data-html2canvas-ignore="true" style={{ textAlign: 'center', marginBottom: '16px' }}>
              <Button onClick={() => setShowmore(!showmore)} className="primary-button p-16-60" >{!showmore ? "Show More" : 'Show less'}</Button>
            </div>
          </div>
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

export default PlanDetails