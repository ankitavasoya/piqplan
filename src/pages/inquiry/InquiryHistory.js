import { Button } from '@mui/material'
import moment from 'moment'
import React, { useEffect, useReducer, useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import STORAGEKEY from '../../config/APP/app.config'
import AuthStorage from '../../helper/AuthStorage'
import { getInqueryHistory } from '../../redux/actions/inqueryAction'
import { debounce } from "lodash";
import { MenuItem, Select } from '@mui/material';

const InquiryHistory = () => {
    const getInqueryHistoryData = useSelector((state) => state.inqueryData.getInqueryHistoryData)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [inqueryHistory, setInqueryHistory] = useState([])
    const [filteredInqueryHistory, setFilteredInqueryHistory] = useState([])
    const [userData, setUserData] = useState()
    const [activeBtn, setActiveBtn] = useState("Recent")
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [searchText, setSearchText] = useState('')
    const [sortingByDate, setSortingByDate] = useState('asc')

    useEffect(() => {
        const pathname = window.location.pathname;
        AuthStorage.setStorageData(STORAGEKEY.currentUrl, pathname, true)
        const userData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.userData)
        setUserData(userData)
    }, [])
    useEffect(() => {
        if (userData) {
            setActiveBtn("Recent")
            dispatch(getInqueryHistory({ userid: userData?.Userid, isComplete: true }))
        }
    }, [userData])

    const getInquiry = (type) => {
        dispatch(getInqueryHistory({ userid: userData?.Userid, isComplete: type }))
    }
    const plandetail = [
        {
            CarrierName: 'Aetna Medicare',
            Date: '21 Sep 2022',
            Time: '04:20',
            planname: 'Aetna Medicare Choice Plan (PPO) (H3288-001-0)',
            plantypename: 'Aetna Medicare Choice Plan (PPO) (H3288-001-0)'
        },
        {
            CarrierName: 'Aetna Medicare',
            Date: '21 Sep 2022',
            Time: '04:20',
            planname: 'Aetna Medicare Choice Plan (PPO) (H3288-001-0)',
            plantypename: 'Aetna Medicare Choice Plan (PPO) (H3288-001-0)'
        },
        {
            CarrierName: 'Aetna Medicare',
            Date: '21 Sep 2022',
            Time: '04:20',
            planname: 'Aetna Medicare Choice Plan (PPO) (H3288-001-0)',
            plantypename: 'Aetna Medicare Choice Plan (PPO) (H3288-001-0)'
        },
        {
            CarrierName: 'Aetna Medicare',
            Date: '21 Sep 2022',
            Time: '04:20',
            planname: 'Aetna Medicare Choice Plan (PPO) (H3288-001-0)',
            plantypename: 'Aetna Medicare Choice Plan (PPO) (H3288-001-0)'
        },
    ]

    useEffect(() => {
        if (getInqueryHistoryData && getInqueryHistoryData.length) {
            setInqueryHistory(getInqueryHistoryData)
            setFilteredInqueryHistory(getInqueryHistoryData)
        } else {
            setInqueryHistory([])
            setFilteredInqueryHistory([])
        }
    }, [getInqueryHistoryData])

    const goToInquiryPage = (item) => {
        if (activeBtn === "Pending") {
            navigate('/edit-inquiry', { state: { type: 'pending_inquiry', id: item.Inquiryid } })
        } else {
            navigate('/edit-inquiry', { state: { type: 'submitted_inquiry', id: item.Inquiryid } })
        }
    }

    const searchInquiryByText = () => {
        const inquiries = [...inqueryHistory]
        const newSerchtext = searchText ? searchText.toLowerCase() : ''
        if (searchText !== "" || searchText !== null || searchText !== undefined) {
            const newData = inquiries.filter((data) => (data?.Planname && data?.Planname?.toLowerCase().includes(newSerchtext) || data?.Plantype && data?.Plantype?.toLowerCase().includes(newSerchtext) || data?.Potentialleads[0]?.Zipcode && data?.Potentialleads[0]?.Zipcode?.toLowerCase().includes(newSerchtext)))
            setFilteredInqueryHistory(newData)
        } else {
            setFilteredInqueryHistory(inquiries)
        }
    }

    const keyDownSearchDoctor = (e) => {
        const debounced = debounce(() => {
            searchInquiryByText()
        }, 1500);
        debounced();
        /* if (e.keyCode === 13) {
            searchDoctorByText()
        } else {
            setSearchText(e.target.value)
        } */
    }

    const sortByDate = (type) => {
        setSortingByDate(type)
        const data = [...filteredInqueryHistory]
        const newData = data.sort(function compare(a, b) {
            var dateA = new Date(a.Submitteddate);
            var dateB = new Date(b.Submitteddate);
            return type === 'desc' ? dateA - dateB : dateB - dateA;
        });
        setFilteredInqueryHistory(newData)

    }


    return (
        <>
            <div className='plan-list-main'>
                <div className='plan-list-content w-90 mx-auto'>
                    <div className='plan-list-title' style={{ gap: '32px', justifyContent: 'normal' }}>
                        <Button className={`${activeBtn === "Recent" ? "product-btn" : "primary-outline-button"} p-16-32`}
                            onClick={() => { getInquiry(true); setActiveBtn("Recent"); setSearchText(''); sortByDate('asc') }}>Recent Inquiry</Button>
                        <Button className={`${activeBtn === "Pending" ? "product-btn" : "primary-outline-button"} p-16-32`}
                            onClick={() => { getInquiry(false); setActiveBtn("Pending"); setSearchText(''); sortByDate('desc') }}>Pending Inquiry</Button>
                    </div>
                </div>
            </div>
            <div className='w-90 mx-auto' style={{ marginTop: '0px' }}>
                <div className='filter-section' >

                    <div className='add-doctor'>
                        <input
                            name="searchText"
                            type="text"
                            placeholder="Search by plan name, zipcode, plan type"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyUp={(e) => keyDownSearchDoctor(e)}
                            className='inquiry-search-control'
                            style={{ margin: "0px" }}
                        />
                    </div>
                    <div className='add-doctor product-select '>
                        <Select
                            id="demo-simple-select"
                            value={sortingByDate}
                            onChange={(e) => sortByDate(e.target.value)}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            style={{ width: "100%" }}
                        >
                            <MenuItem value="asc" defaultChecked>Ascending by date</MenuItem>
                            <MenuItem value="desc">Descending by date</MenuItem>
                        </Select>
                    </div>
                    {/* <div>
                        <label className='filter-label'>Filter by :</label>
                        <ReactDatePicker
                            selectsRange={true}
                            placeholderText="Select Date"
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(update) => {
                                setDateRange(update);
                            }}
                        />
                    </div> */}
                </div>
                {
                    filteredInqueryHistory?.length ? filteredInqueryHistory?.map((item, i) => (
                        <div className='plan-detail' style={{ borderBottom: (filteredInqueryHistory?.length - 1) === i ? '0px' : '1px solid #717171' }}>
                            <div className='carrier-date'>
                                <div className='d-flex' style={{ gap: '8px' }}>
                                    <label>|| Member:</label>
                                    <h6 className='value'><a style={{ textDecoration: 'none' }} href={"mailto:" + item.Potentialleads[0]?.Email}><span style={{ textTransform: 'uppercase' }} >{item.Potentialleads[0]?.Name}</span>({item.Potentialleads[0]?.Mbi})</a> </h6>
                                </div>
                                <div className='d-flex' style={{ columnGap: '40px', rowGap: '20px', flexWrap: 'wrap' }}>
                                    <div className='d-flex' style={{ gap: '8px' }}>
                                        <label>Zipcode:</label>
                                        <h6 className='value'>{item.Potentialleads[0]?.Zipcode}</h6>
                                    </div>
                                    <div className='d-flex' style={{ gap: '8px' }}>
                                        <label>Date:</label>
                                        <h6 className='value'>{moment(item.Submitteddate).format("LL")}</h6>
                                    </div>
                                    {/* <div className='d-flex' style={{ gap: '8px' }}>
                                        <label>Time :</label>
                                        <h6 className='value'>{moment(item.Submitteddate).format("hh:mm:ss a")}</h6>
                                    </div> */}
                                </div>
                            </div>
                            <div className='plan-card'>
                                <div className='card-detail'>
                                    <h1 className='plan-name'>{item.Planname}</h1>
                                    <h1 className='plan-type-number'>{item.Plantype} | {item.Planid}</h1>
                                </div>
                                <Button className='primary-outline-button p-16-32' onClick={() => goToInquiryPage(item)}>View Detalis</Button>
                            </div>
                        </div>
                    )) :
                        <>
                            <div className='noplans'>No activity to show</div>
                        </>
                }
            </div>
        </>
    )
}

export default InquiryHistory