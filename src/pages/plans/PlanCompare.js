import { Button, FormControlLabel, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import BackArrow from '../../assets/images/back-arrow.png'
import Print from '../../assets/images/print-icon.png'
import Share from '../../assets/images/share-icon.png'
// import Wellcare from '../../assets/images/wellcare.png'
// import Aetna from '../../assets/images/aetna.png'
// import Amerigroup from '../../assets/images/amerigroup.png'
// import PDFLOGO from '../../assets/images/PDFLOGO.png'
// import Like from '../../assets/images/like.png'
// import Close from '../../assets/images/close.png'
import { styled } from '@material-ui/core'
import SmallPlanCard from './SmallPlanCard'
import ReactHtmlParser from 'react-html-parser';
import STORAGEKEY from '../../config/APP/app.config'
import AuthStorage from '../../helper/AuthStorage'
import $ from "jquery";
import { useDispatch } from 'react-redux'
import { setIsLoading } from '../../redux/actions/loadingAction'
import jsPDF from 'jspdf'


const PlanCompare = () => {
    const pdfRef = useRef()
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const [cardData, setCardData] = useState([])
    const [smallplandata, setSmallplandata] = useState([])
    const [isHighlight, setIsHighlight] = useState(true)

    useEffect(() => {
        $('html, body').animate({
            scrollTop: $(`${location.hash}`).offset()?.top - 220
        }, 500);
    }, [location.hash])

    useEffect(() => {
        setCardData(AuthStorage.getStorageJsonData(STORAGEKEY.comparePlans));
    }, [])

    useEffect(() => {
        if (cardData) {
            const cardArr = [];
            cardData && cardData.map((data) => {
                cardArr.push({
                    planId: data.PlanId,
                    img: data.LogoFileMediumTransparent,
                    name: data.planName
                })
            });
            setSmallplandata(cardArr)
        }
        console.log('🧨 cardData', cardData)
    }, [cardData])


    const IOSSwitch = styled((props) => (
        <Switch focusVisibleClassName="Mui-focusVisible" disableRipple {...props} />
    ))(({ theme }) => ({
        width: 58,
        height: 38,
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
            width: 26,
            height: 26,
            padding: '5px 0px'
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

    const HighlightsData = (name, wellcare, Aetna, Amerivantage, additionalnotes) => {
        return { name, wellcare, Aetna, Amerivantage, additionalnotes };
    }

    const basicInfoRaws = [
        { name: 'Est. drug cost', key: 'DrugDeductibleTinyValue' },
        { name: 'Health cost', key: 'HealthMonthlyPremiumTinyValue' },
        { name: 'Maximum Annual Out Of Pocket', key: 'MaximumAnnualOutOfPocketTinyValue' },
        { name: 'Medical Deductible', key: 'MaximumAnnualOutOfPocketTinyValue' },
        { name: 'Doctor Office Visit', key: 'OfficeVisitsPrimaryTinyValue' },
        { name: 'Specialist Office Visit', key: 'OfficeVisitsSpecialistTinyValue' },
        { name: 'Skilled Nursing Facility coinsurance', key: 'SkilledNursingFacilityTinyValue' },
        { name: 'Home Health Care', key: 'HomeHealthCareTinyValue' },
        { name: 'Outpatient Mental Health Care', key: 'OutpatientMentalHealthCareTinyValue' },
        { name: 'Emergency Room', key: 'EmergencyRoomTinyValue' },
        { name: 'Hospital Inpatient Stay', key: 'HospitalInpatientStayTinyValue' },
    ]

    const highlightsTableRaws = [
        { name: 'Plan type', key: 'PlanType' },
        { name: 'Monthly premium', key: 'MonthlyPremium' },
        { name: 'Annual medical deductible', key: 'Deductible' },
        { name: 'Out-of-pocket maximum', key: 'MaximumAnnualCopay' },
        { name: 'Prescription drug deductible', key: 'DrugDeductible' },
        { name: 'Acute inpatient hospital stay', key: 'InpatientHospitalCare' },
        { name: 'OTC benefits', key: 'OTCItems' },
        { name: 'Dental', key: 'DentalServices' },
        { name: 'Vision', key: 'VisionService' },
        { name: 'Hearing', key: 'HearingService' },
    ]

    const doctorTableRows = [
        { name: 'Primary doctor visit', key: 'OfficeVisitsPrimary' },
        { name: 'Specialist visit', key: 'UrgentCare' },
    ]

    const rgDrugTableRows = [
        {
            name: 'Annual Costs',
            description: '',
            fields: [
                { name: 'Prescription drug deductible', key: 'OfficeVisitsPrimary' }
            ]
        },
        {
            name: 'Coverage GAP (Donut Hole)',
            description: 'Initial Coverage starts after you pay your deductible, if applicable, and covers up to the Initial Coverage Limit of $4,430.',
            fields: [
                { name: 'Generic drugs', key: '' },
                { name: 'Brand-name drugs', key: '' },
            ]
        },
        {
            name: 'Catastrophic Coverage',
            description: 'Catastrophic Coverage starts when your annual out-of-pocket costs exceed $7,050.',
            fields: [
                { name: 'Generic drugs', key: 'DrugCatastrophicCoverage' },
                { name: 'Brand-name drugs', key: '' },
            ]
        },

    ]

    const initialCoverageCopays = [
        {
            name: 'Initial Coverage Copays',
            description: 'Initial Coverage starts after you pay your deductible, if applicable, and covers up to the Initial Coverage Limit of $4,430.',
            fields: [
                { name: 'Preferred retail cost-sharing', key: 'InitialCovstanRetail' },
                { name: 'Standard retail cost-sharing', key: 'InitialCovStanMail' },
                { name: 'Preferred mail order cost-sharing', key: 'InitialCovPrefMail' },
            ]
        },
    ]

    const preferredMailOrderCostSharing = [
        {
            name: 'Preferred mail order cost-sharing',
            description: '',
            fields: [
                { name: 'Standard retail cost-sharing', key: 'CovGapStanRetail' },
                { name: 'Standard mail cost-sharing', key: 'CovGapStanMail' },
                { name: 'Preferred mail order cost-sharing', key: 'CovGapPrefMail' },
            ]
        },
    ]

    const dental = [
        {
            name: '',
            description: '',
            fields: [
                { name: 'Copays', key: 'ComprehensiveDental' },
            ]
        },
    ]

    const vision = [
        {
            name: '',
            description: '',
            fields: [
                { name: 'Copays', key: 'VisionServices' },
            ]
        },
    ]

    const hearing = [
        {
            name: '',
            description: '',
            fields: [
                { name: 'Copays', key: 'HearingServices' },
            ]
        },
    ]

    const getDiff = (key) => {
        const temp = []
        if (isHighlight) {
            cardData.map((item, index) => {
                temp.push(item[key])
            })
            const res = temp.every((ele) => {
                if (ele === temp[0]) {
                    return true;
                }
            })
            return !res
        }
    }

    const generatePDF = () => {
        try {
            dispatch(setIsLoading(true))
            const content = pdfRef.current;
            const doc = new jsPDF();
            doc.html(content, {
                x: 0,
                y: 0,
                autoPaging: 'text',
                html2canvas: { scale: 0.1 },
                margin: [10, 10, 15, 10],
                callback: function (doc) {
                    doc.save('eligibility_report.pdf');
                    dispatch(setIsLoading(false))
                },
            });
        } catch (error) {
            dispatch(setIsLoading(false))
        }
    }

    useEffect(() => { if (isHighlight) getDiff(); }, [isHighlight])


    return (
        <>
            <div ref={pdfRef}>
                <div className='plan-list-main'>
                    <div data-html2canvas-ignore="true" className='plan-list-content w-90 mx-auto' style={{ textAlign: "left", padding: '35px 0px', display: 'flex', columnGap: '45px', rowGap: '20px', flexWrap: 'wrap' }}>
                        {/* <div className='d-flex' style={{ justifyContent: 'space-between', flexWrap:'wrap'}}>
                        <div>
                            <Button
                                className='back-to-plans-btn p-12-24'
                                onClick={() => navigate('/planlist')}
                                style={{ gap: "10px" }}
                            >
                                <img src={BackArrow} alt='' />
                                Back to Plans
                            </Button>
                            <div style={{ display: 'flex', gap: '16px', flexDirection: 'column', flexWrap: 'wrap', marginTop: '20px' }}>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <Button
                                        className='primary-button p-12-43'
                                        onClick={() => navigate('/planlist')}
                                        style={{ gap: "10px" }}
                                    >
                                        <img src={Print} alt='' />
                                        Print
                                    </Button>
                                    <Button
                                        className='primary-button p-12-43'
                                        onClick={() => navigate('/planlist')}
                                        style={{ gap: "10px" }}
                                    >
                                        <img src={Share} alt='' />
                                        Share
                                    </Button>
                                </div>
                                <div className='d-flex' style={{ backgroundColor: "#FFFFFF", borderRadius: '6px', justifyContent: 'space-between', alignItems: "center", padding: '0px 0px 0px 24px' }}>
                                    <p className="highlight-text">Highlight differences</p>
                                    <FormControlLabel
                                        control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                                    // label="iOS style"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', columnGap: '32px', rowGap:'20px', flexWrap:'wrap' }}>
                        {
                            smallplandata.map((item) => (
                                <SmallPlanCard data={item} />
                            ))
                        }
                    </div> */}
                        {/* <div className='w-90' style={{ margin: '50px auto', textAlign: 'center' }} id="highlights"> */}
                        <TableContainer className='plan-details-table'>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead style={{ backgroundColor: "transparent" }}>
                                    <TableRow style={{ border: '1px solid transparent' }}>
                                        <TableCell style={{ border: '1px solid transparent', color: '#4197F7', width: '25%' }}></TableCell>
                                        {smallplandata && smallplandata.map((data) => {
                                            return <TableCell style={{ border: '1px solid transparent', width: '25%' }}></TableCell>
                                        })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow
                                        key={"card"}
                                        sx={{ border: '1px solid transparent' }}
                                    >
                                        <TableCell sx={{ border: '1px solid transparent' }}>
                                            <div>
                                                <Button
                                                    className='back-to-plans-btn p-12-24'
                                                    onClick={() => navigate('/planlist')}
                                                    style={{ gap: "10px" }}
                                                >
                                                    <img src={BackArrow} alt='' />
                                                    Back to Plans
                                                </Button>
                                                <div style={{ display: 'flex', gap: '16px', flexDirection: 'column', flexWrap: 'wrap', marginTop: '20px' }}>
                                                    <div style={{ display: 'flex', gap: '16px' }}>
                                                        <Button
                                                            className='primary-button p-12-43'
                                                            onClick={generatePDF}
                                                            style={{ gap: "10px" }}
                                                        >
                                                            <img src={Print} alt='' />
                                                            Print
                                                        </Button>
                                                        <Button
                                                            className='primary-button p-12-43'
                                                            onClick={() => { }}
                                                            style={{ gap: "10px" }}
                                                        >
                                                            <img src={Share} alt='' />
                                                            Share
                                                        </Button>
                                                    </div>
                                                    <div className='d-flex' style={{ backgroundColor: "#FFFFFF", borderRadius: '6px', justifyContent: 'space-between', alignItems: "center", padding: '0px 0px 0px 24px', maxWidth: '313px' }}>
                                                        <p className="highlight-text">Highlight differences</p>
                                                        <FormControlLabel checked={isHighlight} onChange={() => setIsHighlight(!isHighlight)}
                                                            control={<IOSSwitch sx={{ m: 1 }} />}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        {
                                            smallplandata.map((item) => (
                                                <TableCell component="" style={{ border: '1px solid transparent' }}>
                                                    <div style={{ display: 'flex', columnGap: '32px', rowGap: '20px', flexWrap: 'wrap' }}>
                                                        <SmallPlanCard data={item} />
                                                    </div>
                                                </TableCell>
                                            ))
                                        }
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {/* </div> */}
                    </div>
                </div>
                <div style={{}}>
                    <div data-html2canvas-ignore="true" className='plan-tab'>
                        <a href='#basic'>Basic</a>
                        <a href='#benefits'>Benefits</a>
                        <a href='#doctors'>Doctors</a>
                        <a href='#rx-drugs'>Rx Drugs</a>
                        {/* <a href='#hospital'>Hospital</a> */}
                        <a href='#dental'>Dental</a>
                        <a href='#vision'>Vision</a>
                        <a href='#hearing'>Hearing</a>
                        {/* <a href='#more'>More</a> */}
                    </div>
                    <div className='w-90' style={{ margin: '50px auto', textAlign: 'center' }} id="basic">
                        <TableContainer className='plan-details-table'>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead style={{ backgroundColor: "#ECF5FE" }}>
                                    <TableRow style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                        <TableCell style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#4197F7', width: '25%' }}>Basic info</TableCell>
                                        {cardData && cardData.map((data) => {
                                            return <TableCell style={{ border: '1px solid rgba(224, 224, 224, 1)', width: '25%' }}>{data.planName}</TableCell>
                                        })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {basicInfoRaws.map((row) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                        >
                                            <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                                {row.name}
                                            </TableCell>
                                            {console.log('cardData', cardData)}
                                            {
                                                cardData && cardData.map((rowData) => {
                                                    return <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', backgroundColor: getDiff(row.key) ? '#FFEBAD' : '' }}>{ReactHtmlParser(rowData[row.key])}</TableCell>
                                                })
                                            }
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <div className='w-90' style={{ margin: '50px auto', textAlign: 'center' }} id="benefits">
                        <TableContainer className='plan-details-table'>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead style={{ backgroundColor: "#ECF5FE" }}>
                                    <TableRow style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                        <TableCell style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#4197F7', width: '25%' }}>Benefits</TableCell>
                                        {cardData && cardData.map((data) => {
                                            return <TableCell style={{ border: '1px solid rgba(224, 224, 224, 1)', width: '25%' }}>{data.planName}</TableCell>
                                        })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {highlightsTableRaws.map((row) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                        >
                                            <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                                {row.name}
                                            </TableCell>
                                            {
                                                cardData && cardData.map((rowData) => {
                                                    return <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', backgroundColor: getDiff(row.key) ? '#FFEBAD' : '' }}>{ReactHtmlParser(rowData[row.key])}</TableCell>
                                                })
                                            }
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>

                    <div className='w-90' style={{ margin: '50px auto', textAlign: 'center' }} id="doctors">
                        <TableContainer className='plan-details-table'>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead style={{ backgroundColor: "#ECF5FE" }}>
                                    <TableRow style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                        <TableCell style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#4197F7', width: '25%' }}>Doctors</TableCell>
                                        {cardData && cardData.map((data) => {
                                            return <TableCell style={{ border: '1px solid rgba(224, 224, 224, 1)', width: '25%' }}>{data.planName}</TableCell>
                                        })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {doctorTableRows.map((row) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                        >
                                            <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                                {row.name}
                                            </TableCell>
                                            {
                                                cardData && cardData.map((rowData) => {
                                                    return <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', backgroundColor: getDiff(row.key) ? '#FFEBAD' : '' }}>{ReactHtmlParser(rowData[row.key])}</TableCell>
                                                })
                                            }
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <div className='w-90' style={{ margin: '50px auto', textAlign: 'center' }} id="rx-drugs">

                        <TableContainer className='plan-details-table'>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead style={{ backgroundColor: "#ECF5FE" }}>
                                    <TableCell style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#4197F7', width: '25%' }}>Rx Drugs</TableCell>
                                    {cardData && cardData.map((data, i) => {
                                        return <TableCell style={{ border: '1px solid rgba(224, 224, 224, 1)', width: '25%' }}>{data.planName}</TableCell>
                                    })}
                                </TableHead>
                                <TableBody>

                                    {rgDrugTableRows.map((row) => (
                                        <>
                                            <TableCell className='col-span-header' scope="row" colSpan={4} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center', background: '#F3F3F3' }}>
                                                <h1>{row.name}</h1>
                                                {row.description ? <p>{row.description}</p> : ''}
                                            </TableCell>
                                            {
                                                row.fields.map((item) => {
                                                    return (<TableRow
                                                        key={row.name}
                                                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                                    >
                                                        <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                                            {item.name}
                                                        </TableCell>
                                                        {
                                                            cardData && cardData.map((rowData) => {
                                                                return <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', backgroundColor: getDiff(item.key) ? '#FFEBAD' : '' }}>{ReactHtmlParser(rowData[item.key])}</TableCell>
                                                            })
                                                        }
                                                    </TableRow>)
                                                })
                                            }
                                        </>
                                    ))}


                                    {initialCoverageCopays.map((row) => (
                                        <>
                                            <TableRow>
                                                <TableCell className='col-span-header' scope="" colSpan={cardData ? cardData.length + 1 : 4} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center', background: '#F3F3F3' }}>
                                                    <h1>{row.name}</h1>
                                                    {row.description ? <p>{row.description}</p> : ''}
                                                </TableCell>
                                            </TableRow>
                                            {
                                                row.fields.map((item) => {
                                                    return (
                                                        <>
                                                            <TableCell className='col-span-header' scope="row" colSpan={cardData ? cardData.length + 1 : 4} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center', background: '#F3F3F3' }}>
                                                                <h1>{item.name}</h1>
                                                            </TableCell>
                                                            {
                                                                (cardData && cardData.length) ?
                                                                    <>
                                                                        {cardData[0][item.key].map((x, i) => {
                                                                            return (
                                                                                <TableRow
                                                                                    key={x.ServiceType}
                                                                                    sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                                                                >
                                                                                    <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                                                                        {x?.ServiceType}
                                                                                    </TableCell>
                                                                                    {
                                                                                        cardData.map((y) => {
                                                                                            return <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>{ReactHtmlParser(y[item.key][i]?.Description)}</TableCell>
                                                                                        })
                                                                                    }
                                                                                </TableRow>
                                                                            )
                                                                        })}

                                                                    </>
                                                                    :
                                                                    <TableRow className='col-span-header' scope="row" colSpan={4} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center', background: '#F3F3F3' }}>
                                                                        <h1>No data found!</h1>
                                                                    </TableRow>
                                                            }
                                                        </>
                                                    )
                                                })
                                            }
                                        </>
                                    ))}


                                    {preferredMailOrderCostSharing.map((row) => (
                                        <>
                                            <TableRow>
                                                <TableCell className='col-span-header' scope="" colSpan={cardData ? cardData.length + 1 : 4} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center', background: '#F3F3F3' }}>
                                                    <h1>{row.name}</h1>
                                                    {row.description ? <p>{row.description}</p> : ''}
                                                </TableCell>
                                            </TableRow>
                                            {
                                                row.fields.map((item) => {
                                                    return (
                                                        <>
                                                            <TableCell className='col-span-header' scope="row" colSpan={cardData ? cardData.length + 1 : 4} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center', background: '#F3F3F3' }}>
                                                                <h1>{item.name}</h1>
                                                            </TableCell>
                                                            {
                                                                (cardData && cardData.length) ?
                                                                    <>
                                                                        {cardData[0][item.key].map((x, i) => {
                                                                            return (
                                                                                <TableRow
                                                                                    key={x.ServiceType}
                                                                                    sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                                                                >
                                                                                    <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                                                                        {x?.ServiceType}
                                                                                    </TableCell>
                                                                                    {
                                                                                        cardData.map((y) => {
                                                                                            return <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>{ReactHtmlParser(y[item.key][i]?.Description)}</TableCell>
                                                                                        })
                                                                                    }
                                                                                </TableRow>
                                                                            )
                                                                        })}

                                                                    </>
                                                                    :
                                                                    <TableRow className='col-span-header' scope="row" colSpan={4} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center', background: '#F3F3F3' }}>
                                                                        <h1>No data found!</h1>
                                                                    </TableRow>
                                                            }
                                                        </>
                                                    )
                                                })
                                            }
                                        </>
                                    ))}

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>

                    <div className='w-90' style={{ margin: '50px auto', textAlign: 'center' }} id="dental">
                        <TableContainer className='plan-details-table'>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead style={{ backgroundColor: "#ECF5FE" }}>
                                    <TableCell style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#4197F7', width: '25%' }}>Dental</TableCell>
                                    {cardData && cardData.map((data) => {
                                        return <TableCell style={{ border: '1px solid rgba(224, 224, 224, 1)', width: '25%' }}>{data.planName}</TableCell>
                                    })}
                                </TableHead>
                                <TableBody>
                                    {dental.map((row) => (
                                        <>
                                            {
                                                row.fields.map((item) => {
                                                    return (
                                                        <>
                                                            <TableCell className='col-span-header' scope="row" colSpan={cardData ? cardData.length + 1 : 4} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center', background: '#F3F3F3' }}>
                                                                <h1>{item.name}</h1>
                                                            </TableCell>
                                                            {
                                                                (cardData && cardData.length) ?
                                                                    <>
                                                                        {cardData[0][item.key].map((x, i) => {
                                                                            return (
                                                                                <TableRow
                                                                                    key={x.ServiceType}
                                                                                    sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                                                                >
                                                                                    <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                                                                        {x?.ServiceType}
                                                                                    </TableCell>
                                                                                    {
                                                                                        cardData.map((y) => {
                                                                                            return <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>{ReactHtmlParser(y[item.key][i]?.Description)}</TableCell>
                                                                                        })
                                                                                    }
                                                                                </TableRow>
                                                                            )
                                                                        })}

                                                                    </>
                                                                    :
                                                                    <TableRow className='col-span-header' scope="row" colSpan={4} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center', background: '#F3F3F3' }}>
                                                                        <h1>No data found!</h1>
                                                                    </TableRow>
                                                            }
                                                        </>
                                                    )
                                                })
                                            }
                                        </>
                                    ))}
                                </TableBody>
                            </Table>


                        </TableContainer>
                    </div>
                    <div className='w-90' style={{ margin: '50px auto', textAlign: 'center' }} id="vision">
                        <TableContainer className='plan-details-table'>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead style={{ backgroundColor: "#ECF5FE" }}>
                                    <TableCell style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#4197F7', width: '25%' }}>Vision</TableCell>
                                    {cardData && cardData.map((data) => {
                                        return <TableCell style={{ border: '1px solid rgba(224, 224, 224, 1)', width: '25%' }}>{data.planName}</TableCell>
                                    })}
                                </TableHead>
                                <TableBody>
                                    {vision.map((row) => (
                                        <>
                                            {
                                                row.fields.map((item) => {
                                                    return (
                                                        <>
                                                            <TableCell className='col-span-header' scope="row" colSpan={cardData ? cardData.length + 1 : 4} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center', background: '#F3F3F3' }}>
                                                                <h1>{item.name}</h1>
                                                            </TableCell>
                                                            {
                                                                (cardData && cardData.length) ?
                                                                    <>
                                                                        {cardData[0][item.key].map((x, i) => {
                                                                            return (
                                                                                <TableRow
                                                                                    key={x.ServiceType}
                                                                                    sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                                                                >
                                                                                    <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                                                                        {x?.ServiceType}
                                                                                    </TableCell>
                                                                                    {
                                                                                        cardData.map((y) => {
                                                                                            return <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>{ReactHtmlParser(y[item.key][i]?.Description)}</TableCell>
                                                                                        })
                                                                                    }
                                                                                </TableRow>
                                                                            )
                                                                        })}

                                                                    </>
                                                                    :
                                                                    <TableRow className='col-span-header' scope="row" colSpan={4} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center', background: '#F3F3F3' }}>
                                                                        <h1>No data found!</h1>
                                                                    </TableRow>
                                                            }
                                                        </>
                                                    )
                                                })
                                            }
                                        </>
                                    ))}
                                </TableBody>
                            </Table>


                        </TableContainer>
                    </div>
                    <div className='w-90' style={{ margin: '50px auto', textAlign: 'center' }} id="hearing">
                        <TableContainer className='plan-details-table'>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead style={{ backgroundColor: "#ECF5FE" }}>
                                    <TableCell style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#4197F7', width: '25%' }}>Hearing</TableCell>
                                    {cardData && cardData.map((data) => {
                                        return <TableCell style={{ border: '1px solid rgba(224, 224, 224, 1)', width: '25%' }}>{data.planName}</TableCell>
                                    })}
                                </TableHead>
                                <TableBody>
                                    {hearing.map((row) => (
                                        <>
                                            {
                                                row.fields.map((item) => {
                                                    return (
                                                        <>
                                                            <TableCell className='col-span-header' scope="row" colSpan={cardData ? cardData.length + 1 : 4} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center', background: '#F3F3F3' }}>
                                                                <h1>{item.name}</h1>
                                                            </TableCell>
                                                            {
                                                                (cardData && cardData.length) ?
                                                                    <>
                                                                        {cardData[0][item.key].map((x, i) => {
                                                                            return (
                                                                                <TableRow
                                                                                    key={x.ServiceType}
                                                                                    sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                                                                >
                                                                                    <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                                                                        {x?.ServiceType}
                                                                                    </TableCell>
                                                                                    {
                                                                                        cardData.map((y) => {
                                                                                            return <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>{ReactHtmlParser(y[item.key][i]?.Description)}</TableCell>
                                                                                        })
                                                                                    }
                                                                                </TableRow>
                                                                            )
                                                                        })}

                                                                    </>
                                                                    :
                                                                    <TableRow className='col-span-header' scope="row" colSpan={4} style={{ border: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center', background: '#F3F3F3' }}>
                                                                        <h1>No data found!</h1>
                                                                    </TableRow>
                                                            }
                                                        </>
                                                    )
                                                })
                                            }
                                        </>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div >
            </div>
        </>
    )
}

export default PlanCompare