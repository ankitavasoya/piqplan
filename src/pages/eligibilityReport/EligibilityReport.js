import { Button, FormControlLabel, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import AuthStorage from '../../helper/AuthStorage'
import STORAGEKEY from '../../config/APP/app.config'
import { isJson } from '../../helper/utils'
import jsPDF from 'jspdf'
import { useDispatch } from 'react-redux'
import { setIsLoading } from '../../redux/actions/loadingAction'
import DownloadButton from '../../assets/images/download-button.png'

const EligibilityReport = () => {
    const pdfRef = useRef()
    const dispatch = useDispatch()
    const [isEligible, setIsEligible] = useState(false)
    const [eligibilityReportData, setEligibilityReportData] = useState(null)
    const [BeneficiaryInformation, setBeneficiaryInformation] = useState([])
    const [MailingAddress, setMailingAddress] = useState([])
    const [StateCounty, setStateCounty] = useState([])
    const [EntitlementPeriodsA, setEntitlementPeriodsA] = useState([])
    const [EntitlementPeriodsB, setEntitlementPeriodsB] = useState([])
    const [EligibilityPeriodsD, setEligibilityPeriodsD] = useState([])
    const [EnrollmentPeriodsD, setEnrollmentPeriodsD] = useState([])
    const [CurrentEnrollmentPeriods, setCurrentEnrollmentPeriods] = useState([])
    const [PriorEnrollmentPeriods, setPriorEnrollmentPeriods] = useState([])

    useEffect(() => {
        const data = AuthStorage.getStorageJsonData(STORAGEKEY.eligibilityReport)
        const isEligible = AuthStorage.getStorageData(STORAGEKEY.isEligibil)
        if (data) {
            setIsEligible(isEligible)
            setEligibilityReportData(data?.BeneficiaryProfile?.BEQ[0])
        }
    }, [])

    const InformationData = (name, wellcare, Aetna, Amerivantage) => {
        return { name, wellcare, Aetna, Amerivantage };
    }

    useEffect(() => {
        if (eligibilityReportData) {
            getBeneficiaryInformation()
            getMailingAddressData()
            getStateCountyData()
            getEntitlementPeriodsAData()
            getEntitlementPeriodsBData()
            getEligibilityPeriodsDData()
            getEnrollmentPeriodsDData()
            getCurrentEnrollmentPeriodsData()
            getPriorEnrollmentPeriodsData()
        }
    }, [eligibilityReportData])

    const getBeneficiaryInformation = () => {
        const beneficiaryInformation = [
            InformationData('Medicare Beneficiary Identifier', eligibilityReportData?.BeneficiaryInformation?.MedicareBeneficiaryIdentifier ?? '-',
                'Death Date', eligibilityReportData?.BeneficiaryInformation?.DeathDate ?? '-'),
            InformationData('First Name', eligibilityReportData?.BeneficiaryInformation?.FirstName ?? '-',
                'Beneficiary Key', eligibilityReportData?.BeneficiaryInformation?.BeneficiaryKey ?? '-'),
            InformationData('Middle Initial', eligibilityReportData?.BeneficiaryInformation?.MiddleInitial ?? '-',
                'Race', eligibilityReportData?.BeneficiaryInformation?.Race ? eligibilityReportData?.BeneficiaryInformation?.Race : '-'),
            InformationData('Last Name', eligibilityReportData?.BeneficiaryInformation?.LastName ?? '-',
                'Death Date Proof', eligibilityReportData?.BeneficiaryInformation?.DeathDateProof ? eligibilityReportData?.BeneficiaryInformation?.DeathDateProof : '-'),
            InformationData('Birth Date', eligibilityReportData?.BeneficiaryInformation?.BirthDate ?? '-',
                'Sep Use Date', eligibilityReportData?.BeneficiaryInformation?.SepUseDate ?? '-'),
            InformationData('Gender', eligibilityReportData?.BeneficiaryInformation?.Gender ?? '-',
                '', ''),
        ];
        setBeneficiaryInformation(beneficiaryInformation)
    }

    const getMailingAddressData = () => {
        const mailingAddress = [
            InformationData('Address Start Date', eligibilityReportData?.MailingAddress?.AddressStartDate ?? '-',
                'Zip Code', eligibilityReportData?.MailingAddress?.ZipCode ?? '-'),
            InformationData('City', eligibilityReportData?.MailingAddress?.City ?? '-',
                'Address Lines', eligibilityReportData?.MailingAddress?.AddressLines?.join(",") ?? '-'),
            InformationData('Postal State Code', eligibilityReportData?.MailingAddress?.PostalStateCode ?? '-', '', ''),
        ];
        setMailingAddress(mailingAddress)
    }

    const getStateCountyData = () => {
        const stateCounty = [
            InformationData('Ssa County', eligibilityReportData?.StateCounty[0]?.SsaCounty ?? '-',
                'Fips State', eligibilityReportData?.StateCounty[0]?.FipsState ?? '-'),
            InformationData('Ssa State', eligibilityReportData?.StateCounty[0]?.SsaState ?? '-',
                'Zip Code', eligibilityReportData?.StateCounty[0]?.ZipCode ?? '-'),
            InformationData('Fips County', eligibilityReportData?.StateCounty[0]?.FipsCounty ?? '-', '', ''),
        ];
        setStateCounty(stateCounty)
    }

    const getEntitlementPeriodsAData = () => {
        const entitlementPeriodsA = eligibilityReportData?.PartA_EntitlementPeriods?.length ? eligibilityReportData?.PartA_EntitlementPeriods?.map((item) => {
            return InformationData('Start Date', item?.StartDate ?? '-', 'Stop Date', item?.StopDate ?? '-')
        }) : InformationData('Start Date', '-', 'Stop Date', '-')

        setEntitlementPeriodsA(entitlementPeriodsA)
    }

    const getEntitlementPeriodsBData = () => {
        const entitlementPeriodsB = eligibilityReportData?.PartB_EntitlementPeriods?.length ? eligibilityReportData?.PartB_EntitlementPeriods?.map((item) => {
            return InformationData('Start Date', item?.StartDate ?? '-', 'Stop Date', item?.StopDate ?? '-')
        }) : InformationData('Start Date', '-', 'Stop Date', '-')

        setEntitlementPeriodsB(entitlementPeriodsB)
    }

    const getEligibilityPeriodsDData = () => {
        const eligibilityPeriodsD = eligibilityReportData?.PartD_EligibilityPeriods?.length ? eligibilityReportData?.PartD_EligibilityPeriods?.map((item) => {
            return InformationData('Start Date', item?.StartDate ?? '-', 'Stop Date', item?.StopDate ?? '-')
        }) : InformationData('Start Date', '-', 'Stop Date', '-')

        setEligibilityPeriodsD(eligibilityPeriodsD)
    }

    const getEnrollmentPeriodsDData = () => {
        const enrollmentPeriodsD = eligibilityReportData?.PartD_EnrollmentPeriods?.length ? eligibilityReportData?.PartD_EnrollmentPeriods?.map((item) => {
            return InformationData('Start Date', item?.StartDate ?? '-', 'Stop Date', item?.StopDate ?? '-')
        }) : InformationData('Start Date', '-', 'Stop Date', '-')

        setEnrollmentPeriodsD(enrollmentPeriodsD)
    }

    const getCurrentEnrollmentPeriodsData = () => {
        const currentEnrollmentPeriods = [
            InformationData('CurrentEnrollmentPeriods', eligibilityReportData?.CurrentEnrollmentPeriods[0]?.EnrollmentDate ?? '-',
                'PlanType', eligibilityReportData?.CurrentEnrollmentPeriods[0]?.PlanType ?? '-'),
            InformationData('Disenrollment Date', eligibilityReportData?.CurrentEnrollmentPeriods[0]?.DisenrollmentDate ?? '-',
                'Source Type', eligibilityReportData?.CurrentEnrollmentPeriods[0]?.SourceType ?? '-'),
            InformationData('Contract Number', eligibilityReportData?.CurrentEnrollmentPeriods[0]?.ContractNumber ?? '-',
                'Is Employer Group Health Plan', eligibilityReportData?.CurrentEnrollmentPeriods[0]?.IsEmployerGroupHealthPlan.toString() ?? '-'),
            InformationData('Plan Benefit Package Number', eligibilityReportData?.CurrentEnrollmentPeriods[0]?.PlanBenefitPackageNumber ?? '-',
                'Added Date Time', eligibilityReportData?.CurrentEnrollmentPeriods[0]?.AddedDateTime ?? '-'),
            InformationData('Program Type', eligibilityReportData?.CurrentEnrollmentPeriods[0]?.ProgramType ?? '-', '', ''),
        ];
        setCurrentEnrollmentPeriods(currentEnrollmentPeriods)
    }

    const getPriorEnrollmentPeriodsData = () => {
        const priorEnrollmentPeriods = [
            InformationData('Enrollment Date', eligibilityReportData?.PriorEnrollmentPeriods[0]?.EnrollmentDate ?? '-',
                'PlanType', eligibilityReportData?.PriorEnrollmentPeriods[0]?.PlanType ?? '-'),
            InformationData('Disenrollment Date', eligibilityReportData?.PriorEnrollmentPeriods[0]?.DisenrollmentDate ?? '-',
                'Source Type', eligibilityReportData?.PriorEnrollmentPeriods[0]?.SourceType ?? '-'),
            InformationData('Contract Number', eligibilityReportData?.PriorEnrollmentPeriods[0]?.ContractNumber ?? '-',
                'Is Employer Group Health Plan', eligibilityReportData?.PriorEnrollmentPeriods[0]?.IsEmployerGroupHealthPlan.toString() ?? '-'),
            InformationData('Plan Benefit Package Number', eligibilityReportData?.PriorEnrollmentPeriods[0]?.PlanBenefitPackageNumber ?? '-',
                'Added Date Time', eligibilityReportData?.PriorEnrollmentPeriods[0]?.AddedDateTime ?? '-'),
            InformationData('Program Type', eligibilityReportData?.PriorEnrollmentPeriods[0]?.ProgramType ?? '-', '', ''),
        ];
        setPriorEnrollmentPeriods(priorEnrollmentPeriods)
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

    return (
        <div ref={pdfRef}>
            <div className='plan-list-main'>
                <div className='plan-list-content' style={{ padding: '30px 0px', textAlign: 'center' }}>
                    {/* <div className='' style={{ textAlign: 'center' }}> */}
                    <h1 className='eligibility-report-title'>Eligibility Report</h1>
                    {/* </div> */}
                </div>
            </div>
            <div style={{}}>
                <div className='plan-tab'>
                    {isEligible ?
                        <h3 className='eligibility-report-plan-text' style={{ textAlign: "center" }}>Congratulations! Your Profile Is Eligible </h3>
                        : <h3 className='no-eligibility-report-plan-text' style={{ textAlign: "center" }}> Your Profile Is Not Eligible</h3>
                    }
                </div>
                <div className='w-90'style={{ display: 'flex', justifyContent: 'end', margin: '50px auto 0px' }}>
                    <Button className='download-button d-flex p-16-40'  data-html2canvas-ignore="true"  style={{gap:'12px'}} onClick={generatePDF}>
                        <img src={DownloadButton} alt='' />
                        Download Report
                    </Button>
                </div>
                <div className='w-90 eligibility-report-table' style={{ margin: '20px auto', textAlign: 'center' }} id="highlights">
                    <TableContainer className='plan-details-table'>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead style={{ backgroundColor: "#85BDFA" }}>
                                <TableRow style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                    <TableCell colSpan={4} style={{ color: '#FFFFFF', width: '25%', textAlign: 'center' }}>Beneficiary Information</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {BeneficiaryInformation?.map((row) => (
                                    <TableRow
                                        key={row?.name}
                                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                    >
                                        <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)', width: '25%' }}>
                                            {row?.name}
                                        </TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#00BF4C', width: '25%' }}>{row?.wellcare}</TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', width: '25%' }}>{row?.Aetna}</TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#00BF4C', width: '25%' }}>{row?.Amerivantage} <br /> <a href='#'>{row?.additionalnotes}</a></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div className='w-90 eligibility-report-table' style={{ margin: '50px auto', textAlign: 'center' }} id="highlights">
                    <TableContainer className='plan-details-table'>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead style={{ backgroundColor: "#85BDFA" }}>
                                <TableRow style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                    <TableCell colSpan={4} style={{ color: '#FFFFFF', width: '25%', textAlign: 'center' }}>Mailing Address</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {MailingAddress?.map((row) => (
                                    <TableRow
                                        key={row?.name}
                                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                    >
                                        <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)', width: '25%' }}>
                                            {row?.name}
                                        </TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#00BF4C', width: '25%' }}>{row?.wellcare}</TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', width: '25%' }}>{row?.Aetna}</TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#00BF4C', width: '25%' }}>{row?.Amerivantage} <br /> <a href='#'>{row?.additionalnotes}</a></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div className='w-90 eligibility-report-table' style={{ margin: '50px auto', textAlign: 'center' }} id="highlights">
                    <TableContainer className='plan-details-table'>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead style={{ backgroundColor: "#85BDFA" }}>
                                <TableRow style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                    <TableCell colSpan={4} style={{ color: '#FFFFFF', width: '25%', textAlign: 'center' }}>State County</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {StateCounty?.map((row) => (
                                    <TableRow
                                        key={row?.name}
                                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                    >
                                        <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)', width: '25%' }}>
                                            {row?.name}
                                        </TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#00BF4C', width: '25%' }}>{row?.wellcare}</TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', width: '25%' }}>{row?.Aetna}</TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#00BF4C', width: '25%' }}>{row?.Amerivantage} <br /> <a href='#'>{row?.additionalnotes}</a></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div className='w-90 eligibility-report-table' style={{ margin: '50px auto', textAlign: 'center' }} id="highlights">
                    <TableContainer className='plan-details-table'>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead style={{ backgroundColor: "#85BDFA" }}>
                                <TableRow style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                    <TableCell colSpan={4} style={{ color: '#FFFFFF', width: '25%', textAlign: 'center' }}>( Part A ) Entitlement Periods</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {EntitlementPeriodsA?.map((row) => (
                                    <TableRow
                                        key={row?.name}
                                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                    >
                                        <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)', width: '25%' }}>
                                            {row?.name}
                                        </TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#00BF4C', width: '25%' }}>{row?.wellcare}</TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', width: '25%' }}>{row?.Aetna}</TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#00BF4C', width: '25%' }}>{row?.Amerivantage} <br /> <a href='#'>{row?.additionalnotes}</a></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div className='w-90 eligibility-report-table' style={{ margin: '50px auto', textAlign: 'center' }} id="highlights">
                    <TableContainer className='plan-details-table'>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead style={{ backgroundColor: "#85BDFA" }}>
                                <TableRow style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                    <TableCell colSpan={4} style={{ color: '#FFFFFF', width: '25%', textAlign: 'center' }}>( Part B ) Entitlement Periods</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {EntitlementPeriodsB?.map((row) => (
                                    <TableRow
                                        key={row?.name}
                                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                    >
                                        <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)', width: '25%' }}>
                                            {row?.name}
                                        </TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#00BF4C', width: '25%' }}>{row?.wellcare}</TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', width: '25%' }}>{row?.Aetna}</TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#00BF4C', width: '25%' }}>{row?.Amerivantage} <br /> <a href='#'>{row?.additionalnotes}</a></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div className='w-90 eligibility-report-table' style={{ margin: '50px auto', textAlign: 'center' }} id="highlights">
                    <TableContainer className='plan-details-table'>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead style={{ backgroundColor: "#85BDFA" }}>
                                <TableRow style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                    <TableCell colSpan={4} style={{ color: '#FFFFFF', width: '25%', textAlign: 'center' }}>( Part D ) Eligibility Periods</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {EligibilityPeriodsD?.map((row) => (
                                    <TableRow
                                        key={row?.name}
                                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                    >
                                        <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)', width: '25%' }}>
                                            {row?.name}
                                        </TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#00BF4C', width: '25%' }}>{row?.wellcare}</TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', width: '25%' }}>{row?.Aetna}</TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#00BF4C', width: '25%' }}>{row?.Amerivantage} <br /> <a href='#'>{row?.additionalnotes}</a></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div className='w-90 eligibility-report-table' style={{ margin: '50px auto', textAlign: 'center' }} id="highlights">
                    <TableContainer className='plan-details-table'>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead style={{ backgroundColor: "#85BDFA" }}>
                                <TableRow style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                    <TableCell colSpan={4} style={{ color: '#FFFFFF', width: '25%', textAlign: 'center' }}>( Part D ) Enrollment Periods</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {EnrollmentPeriodsD?.map((row) => (
                                    <TableRow
                                        key={row?.name}
                                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                    >
                                        <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)', width: '25%' }}>
                                            {row?.name}
                                        </TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#00BF4C', width: '25%' }}>{row?.wellcare}</TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', width: '25%' }}>{row?.Aetna}</TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#00BF4C', width: '25%' }}>{row?.Amerivantage} <br /> <a href='#'>{row?.additionalnotes}</a></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div className='w-90 eligibility-report-table' style={{ margin: '50px auto', textAlign: 'center' }} id="highlights">
                    <TableContainer className='plan-details-table'>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead style={{ backgroundColor: "#85BDFA" }}>
                                <TableRow style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                    <TableCell colSpan={4} style={{ color: '#FFFFFF', width: '25%', textAlign: 'center' }}>Current Enrollment Periods</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {CurrentEnrollmentPeriods?.map((row) => (
                                    <TableRow
                                        key={row?.name}
                                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                    >
                                        <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)', width: '25%' }}>
                                            {row?.name}
                                        </TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#00BF4C', width: '25%' }}>{row?.wellcare}</TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', width: '25%' }}>{row?.Aetna}</TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#00BF4C', width: '25%' }}>{row?.Amerivantage} <br /> <a href='#'>{row?.additionalnotes}</a></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div className='w-90 eligibility-report-table' style={{ margin: '50px auto', textAlign: 'center' }} id="highlights">
                    <TableContainer className='plan-details-table'>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead style={{ backgroundColor: "#85BDFA" }}>
                                <TableRow style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                    <TableCell colSpan={4} style={{ color: '#FFFFFF', width: '25%', textAlign: 'center' }}>Prior Enrollment Periods</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {PriorEnrollmentPeriods?.map((row) => (
                                    <TableRow
                                        key={row?.name}
                                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                    >
                                        <TableCell component="" scope="row" style={{ border: '1px solid rgba(224, 224, 224, 1)', width: '25%' }}>
                                            {row?.name}
                                        </TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#00BF4C', width: '25%' }}>{row?.wellcare}</TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', width: '25%' }}>{row?.Aetna}</TableCell>
                                        <TableCell align="left" style={{ border: '1px solid rgba(224, 224, 224, 1)', color: '#00BF4C', width: '25%' }}>{row?.Amerivantage} <br /> <a href='#'>{row?.additionalnotes}</a></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

            </div>
        </div>
    )
}

export default EligibilityReport