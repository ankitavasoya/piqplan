import React, { useEffect, useState } from 'react'
import { Button, Grid } from '@mui/material'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import BackArrow from '../../assets/images/back-arrow.png'
import { getInqueryByID } from '../../redux/actions/inqueryAction'
import { GET_INQUERY_BY_ID } from '../../redux/type'
import AuthStorage from '../../helper/AuthStorage'
import STORAGEKEY from '../../config/APP/app.config'

const Potentialleads = () => {
    const getInqueryByIdData = useSelector((state) => state.inqueryData.getInqueryByIdData)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [inqueryData, setInqueryData] = useState()

    useEffect(() => {
        const userData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.userData)
        if (userData?.Userid) {
            dispatch(getInqueryByID(0, userData.Userid))
        }
    }, [])

    useEffect(() => {
        if (getInqueryByIdData && getInqueryByIdData.length) {
            setInqueryData(getInqueryByIdData)
        }
    }, [getInqueryByIdData])

    useEffect(() => {
        if (inqueryData && inqueryData.length) {
            dispatch({
                type: GET_INQUERY_BY_ID,
                payload: null
            })
        }
    }, [inqueryData])

    return (
        <>
            <div className='plan-list-main'>
                <div className='plan-list-content w-90 mx-auto'>
                    <div className='plan-list-title' style={{ gap: '32px', justifyContent: 'normal' }}>
                        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', columnGap: '30px', rowGap: '10px' }}>
                            <Button
                                className='back-to-plans-btn p-12-24'
                                onClick={() => navigate('/piqplan-medicare')}
                                style={{ gap: "10px" }}
                            >
                                <img src={BackArrow} alt='' />
                                Back
                            </Button>
                            <h1>
                                Potential History
                            </h1>
                            {/* //Do not remove this */}
                            <p></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-90 mx-auto' style={{ marginTop: '0px' }}>
                {
                    inqueryData?.length ? inqueryData?.map((item, i) => (
                        <div className='potential-leads-plan-detail' style={{ borderBottom: (inqueryData?.length - 1) === i ? '0px' : '1px solid #717171' }}>
                            <div className='carrier-date'>
                                <div className='' style={{ columnGap: '40px', rowGap: '20px', flexWrap: 'wrap' }}>
                                    <div className='d-flex' style={{ gap: '8px' }}>
                                        <label>Date:</label>
                                        <h6 className='value'>{item?.Createdon ? moment(item?.Createdon).format("LL") : ""}</h6>
                                    </div>
                                </div>
                            </div>
                            <div className='potential-leads-plan-card'>
                                <Grid container>
                                    <Grid item lg={4} md={6} sm={6} xs={12}>
                                        <div className='potentils-leads-texts'>Name: <span className='potentils-leads-values'>{item?.Name}</span></div>
                                    </Grid>
                                    <Grid item lg={4} md={6} sm={6} xs={12}>
                                        <div className='potentils-leads-texts'>Email: <span className='potentils-leads-values'>{item?.Email}</span></div>
                                    </Grid>
                                    <Grid item lg={4} md={6} sm={6} xs={12}>
                                        <div className='potentils-leads-texts'>Phone: <span className='potentils-leads-values'>{item?.Phone}</span></div>
                                    </Grid>
                                    <Grid item lg={4} md={6} sm={6} xs={12}>
                                        <div className='potentils-leads-texts'>MBI: <span className='potentils-leads-values'>{item?.Mbi}</span></div>
                                    </Grid>
                                    <Grid item lg={4} md={6} sm={6} xs={12}>
                                        <div className='potentils-leads-texts'>Zipcode: <span className='potentils-leads-values'>{item?.Zipcode}</span></div>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    )) :
                        <>
                            <div className='noplans'>No potential leads to show</div>
                        </>
                }
            </div>
        </>
    )
}

export default Potentialleads