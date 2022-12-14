
import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, ClickAwayListener, FormControl, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Typography } from '@mui/material'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import STORAGEKEY from '../../config/APP/app.config'
import AuthStorage from '../../helper/AuthStorage'
import { getAllPlans } from '../../redux/actions/planAction'
import PlanCard from './PlanCard'
import BackArrow from '../../assets/images/back-arrow.png'
import Print from '../../assets/images/print-btn.png'
import { useNavigate } from 'react-router-dom'
import PlanFilter from './PlanFilter'
import openIcone from '../../assets/images/select-arrow-dark.png'
import { setIsLoading } from "../../redux/actions/loadingAction"


const PlanList = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const getallPlansdata = useSelector((state) => state.planData.getPlans)
    const [allPlanData, setAllPlanData] = useState([])
    const [plans, setPlans] = useState([])
    const plantypesData = [
        { name: 'HMO', value: "HMO" },
        { name: 'PPO', value: "PPO" }
    ];
    const benefitData = [
        { name: 'Vision coverage', value: "VisionServices" },
        { name: 'Dental coverage', value: "DentalServices" },
        { name: 'Hearing coverage', value: "HearingServices" },
        { name: 'Transportation', value: "Transportation" },
        { name: 'Fitness benefits', value: "FitnessServices" },
    ];
    const [insuranceData, setInsuranceData] = useState([])
    const drugData = [
        "Includes drug coverage",
        "Doesn't include drug coverage",
    ];
    const rating = ["1 out of 5 stars ", "2 out of 5 stars ", "3 out of 5 stars ", "4 out of 5 stars ", "5 out of 5 stars "];
    const [benefit, setBenefit] = useState([])
    const [insurance, setInsurance] = useState([])
    const [starRating, setStarRating] = useState([])
    const [drugCoverage, setDrugCoverage] = useState([])
    const [sortPlanBy, setSortPlanBy] = useState('Best Recommendate')
    const [planType, setPlanType] = useState([])
    const [location, setLocation] = useState('')
    const [filter, setFilter] = useState([])
    const [closeSelectModel, setCloseSelectModel] = useState(false)

    const handleChangeFromPlan = (e, val) => {
        if (e.target.checked) {
            const tmp = [...plans, val]
            setPlans(tmp)
        } else {
            setPlans(plans.filter((ele) => ele.PlanId !== val.PlanId))
        }
    }

    const compare = () => {
        if (plans.length >= 2) {
            AuthStorage.setStorageJsonData(STORAGEKEY.comparePlans, plans, true)
            navigate('/plan-compare')
        }
    }

    useEffect(() => {
        const locationData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.locationData)
        if (locationData) {
            setLocation(locationData?.Counties[0].CountyName + ", " + locationData?.State);
        }

        const questionData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.questionsData)
        if (!questionData) {
            return
        }
        const DOB = questionData.find((item) => item.quotitmapparam === "DateOfBirth")?.answertext
        // const MemberId = questionData.find((item) => item.multiplechoiceid === 29)?.answertext
        const Gender = questionData.find((item) => item.quotitmapparam === "Gender")?.answertext
        const ZipCode = questionData.find((item) => item.quotitmapparam === "ZipCode")?.answertext
        // *** Do not remove following variables *** / 
        const BrokerId = questionData.find((item) => item.quotitmapparam === "BrokerId")?.answertext
        const EffectiveDate = questionData.find((item) => item.quotitmapparam === "EffectiveDate")?.answertext
        const MemberType = questionData.find((item) => item.quotitmapparam === "MemberType")?.answertext
        const RelationshipType = questionData.find((item) => item.quotitmapparam === "RelationshipType")?.answertext
        const LivesInHousehold = questionData.find((item) => item.quotitmapparam === "LivesInHousehold")?.answertext
        const PlanVisibility = questionData.find((item) => item.quotitmapparam === "PlanVisibility")?.answertext
        const Drugs = questionData.find((item) => item.quotitmapparam === "Drugs")?.answertext
        const body = {
            "RemoteAccessKey": "C62D4B2E-588A-4653-8CB3-616E9EF99E85", // Pass static value as per discussion with @Priyank
            "WebsiteAccessKey": "C62D4B2E-588A-4653-8CB3-616E9EF99E85", // Pass static value as per discussion with @Priyank
            "BrokerId": "23656670", // -- whenevr get value please put "BrokerId" as value
            "IfpRateFactors": {
                "EffectiveDate": "2022-09-26", // -- whenevr get value please put "EffectiveDate" as value
                "ZipCode": ZipCode,
                "Members": [
                    {
                        "MemberId": "1EG4-TE5-MK73", // Pass static value as per discussion with @Priyank
                        "MemberType": "Subscriber", // -- whenevr get value please put "MemberType" as value
                        "RelationshipType": "Self", // -- whenevr get value please put "RelationshipType" as value
                        "DateOfBirth": DOB ? moment(DOB).format('YYYY-MM-DD') : '', //
                        "Gender": Gender,
                        "LivesInHousehold": "true" // -- whenevr get value please put "LivesInHousehold" as value
                    }
                ]
            },
            "Preferences": {
                "InsuranceTypes": [
                    "MedicareAdvantage" // Pass static value as per discussion with @Priyank
                ],
                "PlanVisibility": "All", // -- whenevr get value please put "PlanVisibility" as value
                "QuoteFormat": "Summary", // Pass static value as per discussion with @Priyank
                "Addons": [
                    "CarrierData",
                    "PlanData",
                    "BenefitsTiny",
                    "BenefitsFull",
                    "BenefitsFlag",
                ],
                "DrugFilter":
                {
                    "MinRxMatch": 0,
                    "RxCUIs": (Drugs && Drugs?.length > 0) ? Drugs.map((item) => item.GenericName) : []
                    // [
                    //     "Paracetamol 160 MG ORAL",
                    //     "Benzalkonium chloride .13 G TOPICAL"
                    // ]
                },
                // "PlanFilters": [
                //     {
                //         "PlanId": "TXM_H3288_002_0"
                //     },
                //     {
                //         "PlanId": "TXM_H7678_005_0"
                //     }
                // ]
            }
        }
        dispatch(getAllPlans(body))
    }, [])

    useEffect(() => {
        if (getallPlansdata?.IfpQuote?.Carriers) {
            let newData = []
            let tempInsuranceData = [];
            getallPlansdata?.IfpQuote?.Carriers.map((item) => {
                const LogoFileMediumTransparent = item?.CarrierDetails?.LogoFileMediumTransparent
                const insuranceCarrier = item?.CarrierDetails?.Name
                const CarrierId = item?.CarrierId
                tempInsuranceData.push(item?.CarrierDetails?.Name)
                item?.PlanRates?.map(async (planrates) => {

                    let data = await planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "CovGapPrefMail") //Preferred mail order cost-sharing
                    let CovGapStanmail = await planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "CovGapStanMail") //Standard mail order cost-sharing
                    let CovGapStanretail = await planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "CovGapStanRetail") //Standard retail cost-sharing
                    let InitialcovstanRetail = await planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "InitialCovStanRetail") //Initial Coverage Copays -- Standard retail cost-sharing 
                    let InitialCovprefMail = await planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "InitialCovPrefMail") //Initial Coverage Copays -- Preferred mail order cost-sharing 
                    let InitialCovstanMail = await planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "InitialCovStanMail") //Initial Coverage Copays -- Standard mail order cost-sharing 
                    let Comprehensivedental = await planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "ComprehensiveDental") //Initial Coverage Copays -- Standard mail order cost-sharing 
                    let Visionservices = await planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "VisionServices") //Initial Coverage Copays -- Standard mail order cost-sharing 
                    let hearingServices = await planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "HearingServices") //hearing

                    let ComprehensiveDental = []
                    await Comprehensivedental?.Coverages?.map((item) => {
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
                    await hearingServices?.Coverages?.map((item) => {
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
                    await Visionservices?.Coverages?.map((item) => {
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
                    await data?.Coverages?.map((item) => {
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
                    await CovGapStanmail?.Coverages?.map((item) => {
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
                    await CovGapStanretail?.Coverages?.map((item) => {
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
                    await InitialcovstanRetail?.Coverages?.map((item) => {
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
                    await InitialCovprefMail?.Coverages?.map((item) => {
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
                    await InitialCovstanMail?.Coverages?.map((item) => {
                        item?.ViewPoints?.map((viewItem) => {
                            viewItem?.Services?.map((serviceItem) => {
                                InitialCovStanMail.push({
                                    ServiceType: serviceItem?.ServiceType,
                                    Description: serviceItem?.Description,
                                })
                            })
                        })
                    })


                    const dt = {
                        LogoFileMediumTransparent: LogoFileMediumTransparent,
                        BaseRateUnit: planrates?.BaseRateUnit,
                        Rate: planrates?.Rate,
                        DrugMonthlyPremium: planrates?.PlanDetails?.Benefits?.find(it => it?.Enum === "DrugMonthlyPremium")?.FullValue,
                        DrugMonthlyPremiumTinyValue: planrates?.PlanDetails?.Benefits?.find(it => it?.Enum === "DrugMonthlyPremium")?.TinyValue,
                        PartBPremiumReduction: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "PartBPremiumReduction")?.FullValue,
                        planName: planrates?.PlanDetails?.Name,
                        PlanId: planrates?.PlanDetails?.PlanId,
                        PlanType: planrates?.PlanDetails?.PlanType,
                        OverallPlanRating: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "OverallPlanRating")?.FullValue,
                        DrugDeductible: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "DrugDeductible")?.FullValue,
                        Deductible: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "Deductible")?.FullValue,
                        RxCopay: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "RxCopay")?.FullValue,
                        RxCoins: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "RxCoins")?.FullValue,
                        Transportation: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "Transportation")?.FullValue,
                        EmergencyRoom: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "EmergencyRoom")?.FullValue,
                        UrgentCare: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "UrgentCare")?.FullValue,
                        Ambulance: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "Ambulance")?.FullValue,
                        LogoFileSmall: "",      //img, // image
                        Name: planrates?.PlanDetails?.Name, // name
                        OTCItems: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "OTCItems")?.FullValue,   //OTC benefits
                        DentalServices: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "DentalServices")?.FullValue,   //dental
                        VisionService: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "VisionServices")?.FullValue,   //vision
                        HearingService: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "HearingServices")?.FullValue,   //hearing
                        OfficeVisitsPrimary: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "OfficeVisitsPrimary")?.FullValue,   //Primary doctor visit
                        DrugCatastrophicCoverage: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "DrugCatastrophicCoverage")?.FullValue,   //Generic drugs Catastrophic Coverage
                        MonthlyPremium: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "MonthlyPremium")?.FullValue,   //MonthlyPremium
                        InpatientHospitalCare: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "InpatientHospitalCare")?.FullValue,   //Acute inpatient hospital stay
                        MaximumAnnualCopay: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "MaximumAnnualCopay")?.FullValue,   //Out-of-pocket maximum
                        MaximumAnnualCopayTinyValue: planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "MaximumAnnualCopay")?.TinyValue,   //Out-of-pocket maximum
                        FilterService: planrates?.PlanDetails?.Benefits,
                        FilterinsuranceCarrier: insuranceCarrier,
                        CarrierId: CarrierId,
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
                        TotalEstAnnualCost: `$${parseInt(planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "DrugDeductible")?.TinyValue.replace('$', '')) + parseInt(planrates?.PlanDetails?.Benefits?.find((it) => it?.Enum === "HealthMonthlyPremium")?.TinyValue.replace('$', ''))}`,
                    }
                    newData.push(dt)
                })
            })
            setInsuranceData([...new Set(tempInsuranceData)])
            setAllPlanData(newData)
            setFilter(newData)
        }
    }, [getallPlansdata])


    useEffect(() => {
        if (allPlanData && allPlanData.length > 0) {
            const localPlanFilters = AuthStorage.getStorageJsonData(STORAGEKEY.planFilters)
            if (localPlanFilters) {
                if (localPlanFilters?.benefits?.length) {
                    setBenefit(localPlanFilters.benefits)
                }

                if (localPlanFilters?.insurance?.length) {
                    setInsurance(localPlanFilters.insurance)
                }

                if (localPlanFilters?.drugCoverage.length) {
                    setDrugCoverage(localPlanFilters.drugCoverage)
                }

                if (localPlanFilters?.starRating?.length) {
                    setStarRating(localPlanFilters.starRating)
                }

                if (localPlanFilters?.planType?.length) {
                    setPlanType(localPlanFilters.planType)
                }
                applyFilter({
                    benefits: localPlanFilters.benefits || [],
                    insurance: localPlanFilters.insurance || [],
                    drugCoverage: localPlanFilters.drugCoverage || [],
                    starRating: localPlanFilters.starRating || [],
                    planType: localPlanFilters.planType || [],
                    sortPlanBy: localPlanFilters.sortPlanBy || sortPlanBy,
                })
                setSortPlanBy(localPlanFilters.sortPlanBy || sortPlanBy)
            } else {
                applyFilter({
                    benefits: [],
                    insurance: [],
                    drugCoverage: [],
                    starRating: [],
                    planType: [],
                    sortPlanBy: sortPlanBy,
                })
                // setFilter(allPlanData)
            }
        }
    }, [allPlanData])

    const handleChange = (field, name) => {
        if (field === "Plan Benefits") {
            if (benefit.includes(name)) {
                setBenefit(benefit.filter((ele) => ele !== name))
            } else {
                setBenefit([...benefit, name])
            }
        } else if (field === "Insurance Carrier") {
            if (insurance.includes(name)) {
                setInsurance(insurance.filter((ele) => ele !== name))
            } else {
                setInsurance([...insurance, name])
            }
        } else if (field === "Drug Coverage") {
            if (drugCoverage.includes(name)) {
                setDrugCoverage([])
            } else {
                setDrugCoverage([name])
            }
        } else if (field === "Star Ratings") {
            if (starRating.includes(name)) {
                setStarRating(starRating.filter((ele) => ele !== name))
            } else {
                setStarRating([...starRating, name])
            }
        } else if (field === "planType") {
            if (planType.includes(name)) {
                setPlanType(planType.filter((ele) => ele !== name))
            } else {
                setPlanType([...planType, name])
            }
        }
    }

    const applyFilter = (filterData) => {
        dispatch(setIsLoading(true));
        AuthStorage.setStorageJsonData(STORAGEKEY.planFilters, filterData, true)
        if (filterData.benefits.length > 0 || filterData.insurance.length > 0 || filterData.drugCoverage.length > 0 || filterData.starRating.length > 0 || filterData.planType.length > 0) {
            let temp = [];

            if (filterData.benefits.length) {
                temp = allPlanData.filter((ele) => ele.FilterService.find((el) => filterData.benefits.includes(el.Enum)))

                if (filterData.insurance.length) {
                    temp = temp.filter((ele) => filterData.insurance.includes(ele.FilterinsuranceCarrier))
                }

                if (filterData.drugCoverage.length) {
                    temp = temp.filter((ele) => filterData.drugCoverage.includes(ele.FilterDrugCov))
                }

                if (filterData.starRating.length) {
                    temp = temp.filter((ele) => filterData.starRating.includes(ele.FilterRating))
                }

                if (filterData.planType.length) {
                    temp = temp.filter((ele) => filterData.planType.includes(ele.FilterPlanType))
                }
            } else if (filterData.insurance.length) {
                temp = allPlanData.filter((ele) => filterData.insurance.includes(ele.FilterinsuranceCarrier))
                if (filterData.drugCoverage.length) {
                    temp = temp.filter((ele) => filterData.drugCoverage.includes(ele.FilterDrugCov))
                }

                if (filterData.starRating.length) {
                    temp = temp.filter((ele) => filterData.starRating.includes(ele.FilterRating))
                }

                if (filterData.planType.length) {
                    temp = temp.filter((ele) => filterData.planType.includes(ele.FilterPlanType))
                }
            } else if (filterData.drugCoverage.length) {
                temp = allPlanData.filter((ele) => filterData.drugCoverage.includes(ele.FilterDrugCov))
                if (filterData.starRating.length) {
                    temp = temp.filter((ele) => filterData.starRating.includes(ele.FilterRating))
                }

                if (filterData.planType.length) {
                    temp = temp.filter((ele) => filterData.planType.includes(ele.FilterPlanType))
                }
            } else if (filterData.starRating.length) {
                temp = allPlanData.filter((ele) => filterData.starRating.includes(ele.FilterRating))

                if (filterData.planType.length) {
                    temp = temp.filter((ele) => filterData.planType.includes(ele.FilterPlanType))
                }
            } else if (filterData.planType.length) {
                temp = allPlanData.filter((ele) => filterData.planType.includes(ele.FilterPlanType))
            }

            if (temp.length > 0) {
                sortingPlans(filterData, temp)
            }
            setFilter(temp)
        }
        else {
            sortingPlans(filterData, allPlanData)
        }
        dispatch(setIsLoading(false));
    }

    const handleClear = () => {
        applyFilter({
            benefits: [],
            insurance: [],
            drugCoverage: [],
            starRating: [],
            planType: [],
            sortPlanBy: sortPlanBy,
        })
        setBenefit([])
        setInsurance([])
        setDrugCoverage([])
        setStarRating([])
        setPlanType([])
    }

    // const ITEM_HEIGHT = 48;
    // const ITEM_PADDING_TOP = 8;
    // const MenuProps = {
    //     PaperProps: {
    //         style: {
    //             maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    //             width: 250,
    //         },
    //     },
    // };

    const [expanded, setExpanded] = React.useState(false);

    const handleChangeA = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const filterByPlan = (e) => {
        setSortPlanBy(e)
        applyFilter({
            benefits: benefit,
            insurance: insurance,
            drugCoverage: drugCoverage,
            starRating: starRating,
            planType: planType,
            sortPlanBy: e,
        })
    }

    const sortingPlans = (filterData, data) => {
        let newTemp = JSON.parse(JSON.stringify(data))
        if (filterData.sortPlanBy === "Lowest monthly premium") {
            newTemp.sort(function (a, b) {
                return parseInt(a.MonthlyPremium ? a.MonthlyPremium?.replace(/\D/g, '') : 0) -
                    parseInt(b.MonthlyPremium ? b.MonthlyPremium?.replace(/\D/g, '') : 0)
            });
        }
        if (filterData.sortPlanBy === "Lowest monthly drug deductible") {
            newTemp.sort(function (a, b) {
                return parseInt(a.DrugDeductibleTinyValue ? a.DrugDeductibleTinyValue?.replace(/\D/g, '') : 0)
                    - parseInt(b.DrugDeductibleTinyValue ? b.DrugDeductibleTinyValue?.replace(/\D/g, '') : 0)
            });
        }
        if (filterData.sortPlanBy === "Best Recommendate") {
            newTemp.sort(function (a, b) {
                return (parseInt(a.MaximumAnnualCopayTinyValue ? a.MaximumAnnualCopayTinyValue?.replace(/\D/g, '') : 0) - parseInt(b.MaximumAnnualCopayTinyValue ? b.MaximumAnnualCopayTinyValue?.replace(/\D/g, '') : 0) ||
                    parseInt(a.DrugMonthlyPremiumTinyValue ? a.DrugMonthlyPremiumTinyValue?.replace(/\D/g, '') : 0) - parseInt(b.DrugMonthlyPremiumTinyValue ? b.DrugMonthlyPremiumTinyValue?.replace(/\D/g, '') : 0))
            });
        }
        setFilter(newTemp)
    }


    return (
        <>
            <div className='plan-list-main'>
                <div className='plan-list-content w-90 mx-auto'>
                    <div className='back-print-button'>
                        <Button className='back-to-plans-btn' onClick={() => navigate('/piqplan-medicare')}> <img src={BackArrow} alt='' /> Back</Button>
                        <Button className='print-btn'> <img src={Print} alt='' /> </Button>
                    </div>
                    <div className='plan-list-title'>
                        <h1>Choose a Plan</h1>
                        <div className='filter-main'>
                            <div className='filter-inner'>
                                <label style={{ marginBottom: '8px' }}>My Location</label>
                                <input placeholder='Los Angeles, CA'
                                    value={location} />
                            </div>
                            <div className='filter-inner plan-type-filter'>
                                <label style={{ marginBottom: '8px' }}>Plan Type</label>
                                <FormControl sx={{ width: '100%' }}>
                                    <Select
                                        id="demo-multiple-checkbox"
                                        multiple
                                        className='select-location'
                                        value={planType}
                                        input={<OutlinedInput />}
                                        renderValue={(selected) => {
                                            if (selected.length === 0) {
                                                return <strong>Plan Type</strong>;
                                            }

                                            return selected.join(', ');
                                        }}
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        displayEmpty
                                    >
                                        <div style={{ maxHeight: '310px', overflowX: 'auto' }}>
                                            {plantypesData.map((el) => (
                                                <MenuItem key={el} value={el} onClick={() => handleChange('planType', el.value)}>
                                                    <Checkbox checked={planType?.indexOf(el.value) > -1} />
                                                    <ListItemText primary={el.name} />
                                                </MenuItem>
                                            ))}
                                        </div>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='plan-list-filter' style={{ overflow: 'hidden' }}>
                <div className='w-90 mx-auto plan-list-filter-inner'>
                    {
                        window.innerWidth < 991 ?
                            <Accordion expanded={expanded === 'panel1'} onChange={handleChangeA('panel1')} style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                                <AccordionSummary
                                    // expandIcon={openIcone}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                        Filter by
                                    </Typography>
                                    {/* <Typography sx={{ color: 'text.secondary' }}>I am an accordion</Typography> */}
                                    <img src={openIcone} className={`${expanded ? 'rotate-image' : ''}`} alt='' />
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        <div style={{ display: 'flex', gap: '19px', flexWrap: 'wrap' }}>
                                            <FormControl sx={{ m: 0, width: 300 }}>
                                                <Select
                                                    id="demo-multiple-checkbox"
                                                    multiple
                                                    className='select-location'
                                                    value={planType}
                                                    input={<OutlinedInput />}
                                                    renderValue={(selected) => {
                                                        if (selected.length === 0) {
                                                            return <strong>Plan Type</strong>;
                                                        }

                                                        return selected.join(', ');
                                                    }}
                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                    displayEmpty
                                                >
                                                    <div style={{ maxHeight: '310px', overflowX: 'auto' }}>
                                                        {plantypesData.map((el) => (
                                                            <MenuItem key={el} value={el} onClick={() => handleChange('planType', el.value)}>
                                                                <Checkbox checked={planType?.indexOf(el.value) > -1} />
                                                                <ListItemText primary={el.name} />
                                                            </MenuItem>
                                                        ))}
                                                    </div>
                                                </Select>
                                            </FormControl>
                                            <FormControl className='' sx={{ m: 0, width: 300 }}>
                                                <Select
                                                    id="demo-multiple-checkbox"
                                                    multiple
                                                    className='select-location'
                                                    value={benefit}
                                                    input={<OutlinedInput />}
                                                    renderValue={(selected) => {
                                                        if (selected.length === 0) {
                                                            return <strong>Plan Benefits</strong>;
                                                        }

                                                        return selected.join(', ');
                                                    }}
                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                    displayEmpty
                                                >
                                                    <div style={{ maxHeight: '310px', overflow: 'auto' }}>
                                                        {benefitData.map((el) => (
                                                            <MenuItem key={el} value={el} onClick={() => handleChange('Plan Benefits', el.value)}>
                                                                <Checkbox checked={benefit?.indexOf(el.value) > -1} />
                                                                <ListItemText primary={el.name} />
                                                            </MenuItem>
                                                        ))}
                                                    </div>
                                                </Select>
                                            </FormControl>
                                            <FormControl className='' sx={{ m: 0, width: 300 }}>
                                                <Select
                                                    id="demo-multiple-checkbox"
                                                    multiple
                                                    className='select-location'
                                                    value={insurance}
                                                    input={<OutlinedInput />}
                                                    renderValue={(selected) => {
                                                        if (selected.length === 0) {
                                                            return <strong>Insurance Carrier</strong>;
                                                        }

                                                        return selected.join(', ');
                                                    }}
                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                    displayEmpty
                                                >
                                                    <div style={{ maxHeight: '310px', overflowX: 'hidden', overflowY: 'auto' }}>
                                                        {insuranceData.length > 0 && insuranceData.map((el) => (
                                                            <MenuItem key={el} value={el} onClick={() => handleChange('Insurance Carrier', el)}>
                                                                <Checkbox checked={insurance?.indexOf(el) > -1} />
                                                                <ListItemText primary={el} style={{ wordBreak: 'break-word', whiteSpace: 'normal' }} />
                                                            </MenuItem>
                                                        ))}
                                                    </div>
                                                </Select>
                                            </FormControl>
                                            <FormControl className='' sx={{ m: 0, width: 300 }}>
                                                <Select
                                                    id="demo-multiple-checkbox"
                                                    className='select-location'
                                                    value={drugCoverage}
                                                    input={<OutlinedInput />}
                                                    displayEmpty
                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                    renderValue={(selected) => {
                                                        if (selected.length === 0) {
                                                            return <strong>Drug Coverage</strong>;
                                                        }

                                                        return selected.join(', ');
                                                    }}
                                                    multiple
                                                >
                                                    <div style={{ maxHeight: '310px', overflow: 'auto' }}>
                                                        {drugData.map((name) => (
                                                            <MenuItem key={name} value={name} onClick={() => handleChange('Drug Coverage', name)}>
                                                                <Checkbox checked={drugCoverage?.indexOf(name) > -1} />
                                                                <ListItemText primary={name} />
                                                            </MenuItem>
                                                        ))}
                                                    </div>
                                                </Select>
                                            </FormControl>
                                            <FormControl className='' sx={{ m: 0, width: 300 }}>
                                                <Select
                                                    id="demo-multiple-checkbox"
                                                    multiple
                                                    className='select-location'
                                                    displayEmpty
                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                    value={starRating}
                                                    input={<OutlinedInput />}
                                                    renderValue={(selected) => {
                                                        if (selected.length === 0) {
                                                            return <strong>Star Rating</strong>;
                                                        }

                                                        return selected.join(', ');
                                                    }}
                                                >
                                                    <div style={{ maxHeight: '310px', overflow: 'auto' }}>
                                                        {rating.map((name) => (

                                                            <MenuItem key={name} value={name} onClick={() => handleChange('Star Ratings', name)}>
                                                                <Checkbox checked={starRating?.indexOf(name) > -1} />
                                                                <ListItemText primary={name} />
                                                            </MenuItem>
                                                        ))}
                                                    </div>
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div className='d-flex' style={{ marginTop: '16px', gap: '11px' }}>
                                            <Button onClick={() => {
                                                applyFilter({
                                                    benefits: benefit,
                                                    insurance: insurance,
                                                    drugCoverage: drugCoverage,
                                                    starRating: starRating,
                                                    planType: planType,
                                                    sortPlanBy: sortPlanBy,
                                                })
                                            }} className='apply-btn'>Apply</Button>
                                            <Button onClick={() => handleClear()} className='back-to-plans-btn'>Clear</Button>
                                        </div>
                                        {/* <div className='select-location'>
                        <input placeholder='Special Needs Plans'
                            name=""
                            onClick={() => setShowList('needsplans')}
                            type="text" />
                        <div className='suggestion-popup' style={{ display: showList === "needsplans" ? 'block' : 'none', maxHeight: '400px' }}>
                            {benefits.map((name) => (
                                <div className="suggestion-popup-option d-flex" style={{ alignItems: 'center' }}>
                                    <Checkbox checked={personName?.indexOf(name) > -1} />
                                    <ListItemText primary={name} />
                                </div>
                            ))}
                            <div className='d-flex' style={{ margin: '16px', gap: '11px' }}>
                                <Button onClick={() => setShowList('')} className='apply-btn'>Apply</Button>
                                <Button onClick={() => setShowList('')} className='back-to-plans-btn'>Clear</Button>
                            </div>
                        </div>
                    </div> */}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion> :
                            <>
                                {/* <div style={{ display: 'flex' }} className="plan-list-filter-inner"> */}
                                <Grid container spacing={3}>
                                    <Grid item xl={10} lg={12} md={12} sm={12}>
                                        <Grid container spacing={3}>
                                            <Grid item xl={1} lg={2} md={2} sm={1}>
                                                <a href=''>Filter by :</a>
                                            </Grid>
                                            {/* <div style={{ display: 'flex', gap: '19px'}}> */}
                                            <Grid item xl={11} lg={10} md={10} sm={10}>
                                                <Grid container spacing={3}>
                                                    <Grid item lg={3} sm={3}>
                                                        <FormControl className='filter-select' sx={{ m: 0 }}>
                                                            <Select
                                                                id="demo-multiple-checkbox"
                                                                multiple
                                                                className='select-location'
                                                                value={benefit}
                                                                input={<OutlinedInput />}
                                                                renderValue={(selected) => {
                                                                    if (!selected?.length) {
                                                                        return <strong>Plan Benefits</strong>;
                                                                    }

                                                                    return selected?.join(', ');
                                                                }}
                                                                inputProps={{ 'aria-label': 'Without label' }}
                                                                displayEmpty
                                                            >
                                                                <div style={{ maxHeight: '310px', overflow: 'auto' }}>
                                                                    {benefitData.map((el) => (
                                                                        <MenuItem key={el} value={el} onClick={() => handleChange('Plan Benefits', el.value)}>
                                                                            <Checkbox checked={benefit?.indexOf(el.value) > -1} />
                                                                            <ListItemText primary={el.name} />
                                                                        </MenuItem>
                                                                    ))}
                                                                </div>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item lg={3} sm={3}>
                                                        <FormControl className='filter-select' sx={{ m: 0 }}>
                                                            <Select
                                                                id="demo-multiple-checkbox"
                                                                multiple
                                                                className='select-location'
                                                                value={insurance}
                                                                input={<OutlinedInput />}
                                                                renderValue={(selected) => {
                                                                    if (selected.length === 0) {
                                                                        return <strong>Insurance Carrier</strong>;
                                                                    }

                                                                    return selected.join(', ');
                                                                }}
                                                                inputProps={{ 'aria-label': 'Without label' }}
                                                                displayEmpty
                                                            >
                                                                <div style={{ maxHeight: '310px', overflowX: 'hidden', overflowY: 'auto' }}>
                                                                    {insuranceData.length > 0 && insuranceData.map((el) => (
                                                                        <MenuItem key={el} value={el} onClick={() => handleChange('Insurance Carrier', el)}>
                                                                            <Checkbox checked={insurance?.indexOf(el) > -1} />
                                                                            <ListItemText primary={el} style={{ wordBreak: 'break-word', whiteSpace: 'normal' }} />
                                                                        </MenuItem>
                                                                    ))}
                                                                </div>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item lg={3} sm={3}>
                                                        <FormControl className='filter-select' sx={{ m: 0 }}>
                                                            <Select
                                                                id="demo-multiple-checkbox"
                                                                className='select-location'
                                                                value={drugCoverage}
                                                                input={<OutlinedInput />}
                                                                displayEmpty
                                                                inputProps={{ 'aria-label': 'Without label' }}
                                                                renderValue={(selected) => {
                                                                    if (selected.length === 0) {
                                                                        return <strong>Drug Coverage</strong>;
                                                                    }

                                                                    return selected.join(', ');
                                                                }}
                                                                multiple
                                                            >
                                                                <div style={{ maxHeight: '310px', overflow: 'auto' }}>
                                                                    {drugData.map((name) => (
                                                                        <MenuItem key={name} value={name} onClick={() => handleChange('Drug Coverage', name)}>
                                                                            <Checkbox checked={drugCoverage?.indexOf(name) > -1} />
                                                                            <ListItemText primary={name} />
                                                                        </MenuItem>
                                                                    ))}
                                                                </div>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item lg={3} sm={3}>
                                                        <FormControl className='filter-select' sx={{ m: 0 }}>
                                                            <Select
                                                                id="demo-multiple-checkbox"
                                                                multiple
                                                                className='select-location'
                                                                displayEmpty
                                                                inputProps={{ 'aria-label': 'Without label' }}
                                                                value={starRating}
                                                                input={<OutlinedInput />}
                                                                renderValue={(selected) => {
                                                                    if (selected.length === 0) {
                                                                        return <strong>Star Rating</strong>;
                                                                    }

                                                                    return selected.join(', ');
                                                                }}
                                                            >
                                                                <div style={{ maxHeight: '310px', overflow: 'auto' }}>
                                                                    {rating.map((name) => (

                                                                        <MenuItem key={name} value={name} onClick={() => handleChange('Star Ratings', name)}>
                                                                            <Checkbox checked={starRating?.indexOf(name) > -1} />
                                                                            <ListItemText primary={name} />
                                                                        </MenuItem>
                                                                    ))}
                                                                </div>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    {/* </div> */}
                                    <Grid item xl={2} lg={12} sm={12}>
                                        <div className='d-flex' style={{ gap: '11px', marginLeft: 'auto', justifyContent: 'flex-end' }}>
                                            <Button onClick={() => {
                                                applyFilter({
                                                    benefits: benefit,
                                                    insurance: insurance,
                                                    drugCoverage: drugCoverage,
                                                    starRating: starRating,
                                                    planType: planType,
                                                    sortPlanBy: sortPlanBy,
                                                })
                                            }} className='apply-btn'>Apply</Button>
                                            <Button onClick={() => handleClear()} className='back-to-plans-btn'>Clear</Button>
                                        </div>
                                    </Grid>
                                </Grid>
                                {/* <div className='select-location'>
                        <input placeholder='Special Needs Plans'
                            name=""
                            onClick={() => setShowList('needsplans')}
                            type="text" />
                        <div className='suggestion-popup' style={{ display: showList === "needsplans" ? 'block' : 'none', maxHeight: '400px' }}>
                            {benefits.map((name) => (
                                <div className="suggestion-popup-option d-flex" style={{ alignItems: 'center' }}>
                                    <Checkbox checked={personName?.indexOf(name) > -1} />
                                    <ListItemText primary={name} />
                                </div>
                            ))}
                            <div className='d-flex' style={{ margin: '16px', gap: '11px' }}>
                                <Button onClick={() => setShowList('')} className='apply-btn'>Apply</Button>
                                <Button onClick={() => setShowList('')} className='back-to-plans-btn'>Clear</Button>
                            </div>
                        </div>
                    </div> */}
                            </>
                    }
                </div>
            </div>
            <div className='w-90 mx-auto ' style={{ marginTop: '50px' }}>
                <div className='plan-list-title'>
                    <h5>{`Showing ${filter?.length > 0 ? filter?.length : 0}  Medicare Advantage Plans`}</h5>
                    <div className='filter-main sort-plans-by-main'>
                        <div className='filter-inner select-svg-none'>
                            <label>Sort Plans By</label>
                            <div className='select-location'>
                                <Select
                                    id="demo-simple-select"
                                    name=""
                                    value={sortPlanBy}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    style={{ width: "100%" }}
                                    onChange={(e) => filterByPlan(e.target.value)}
                                >
                                    <MenuItem value="">Sort Plans</MenuItem>
                                    <MenuItem value="Best Recommendate">Best Recommended</MenuItem>
                                    <MenuItem value="Lowest monthly drug deductible">Lowest monthly drug deductible</MenuItem>
                                    {/* <MenuItem value="Lowest health plan deductible">Lowest health plan deductible</MenuItem> */}
                                    {/* <MenuItem value="Lowest drug + premium cost">Lowest drug + premium cost</MenuItem> */}
                                    <MenuItem value="Lowest monthly premium">Lowest monthly premium</MenuItem>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
                {filter.length > 0 ? filter.map((planData) => (
                    <PlanCard planData={planData} select={handleChangeFromPlan} compare={compare} />
                )) :
                    <div className='noplans'>No plans to show</div>
                }
            </div>
        </>
    )
}

export default PlanList