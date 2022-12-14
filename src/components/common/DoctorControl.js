import { Checkbox } from '@material-ui/core'
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { searchpcp } from '../../redux/actions/quotitActions';
import { useState } from 'react';
import { DialogContentText, InputLabel, MenuItem, Select } from '@mui/material';
import {setIsLoading} from "../../redux/actions/loadingAction"
import { debounce } from "lodash";
import AuthStorage from '../../helper/AuthStorage';
import STORAGEKEY from '../../config/APP/app.config';
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .css-1t1j96h-MuiPaper-root-MuiDialog-paper': {
        minWidth: "800px",
    },
}));

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

const DoctorControl = ({ handleClose, open, onAddDoctor,currentQuestion }) => {
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('')
    const [doctorData, setDoctorData] = useState([])
    const [selectedDoctor, setSelectedDoctor] = useState([])
    const [showList, setShowList] = useState(false)
    const [address, setAddress] = useState("")
    const [addresses, setAddresses] = useState([])
    const [showError, setShowError] = useState([])
    const getSearchPcpData = useSelector((state) => state.quotitData.searchPcpData)


    useEffect(() => {
        dispatch(setIsLoading(false));
        if (getSearchPcpData?.Providers && getSearchPcpData?.Providers.length) {
            setDoctorData(getSearchPcpData?.Providers)
        }
    }, [getSearchPcpData])

    useEffect(() => {
        dispatch(setIsLoading(false));
        return () => {
            setDoctorData([])
        }
    }, [])

    const handleChange = (e, data) => {
        // let doctorList = [...selectedDoctor]
        // if (data) {
            // doctorList.push(data)
            // setSelectedDoctor()
            setAddresses(data.Locations)
            setSearchText(data.ProviderName)
            setShowList(false)
           // $(".suggestion-popup").hide()
        // } else {
        //     doctorList = doctorList.filter((item) => item.ProviderName !== e.target.name)
        // }
        data.questionId = currentQuestion
        setSelectedDoctor(data)
    }
    
    const validation = () => {
        const errorMsg = {};
        if(selectedDoctor.length == 0) {
        errorMsg['doctor'] = "Please select any one doctor"
        }
        if(!address) {
        errorMsg['address'] = "Please select any one address" 
        }
        setShowError(errorMsg);
        if(Object.keys(errorMsg).length) {
            return true
        } else {
            return false
        }
    };
    const addDoctor = () => {
        if (validation()) {
            dispatch(setIsLoading(false));
        return
        }
        selectedDoctor.selectedAddress = address
        onAddDoctor(selectedDoctor)
    }

    const searchDoctorByText = () => {
        const questionData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.questionsData)
        if (!questionData) {
            return
        }
        const ZipCode = questionData.find((item) => item.quotitmapparam === "ZipCode")?.answertext
        setShowList(true)
        setDoctorData([])
        const doctorJSONBody =
        {
            "AccessKeys": {
                "RemoteAccessKey": "C62D4B2E-588A-4653-8CB3-611111111111"
            },
            "Inputs": {
                "Location": ZipCode,
                "Distance": 17,
                "ProviderTypes": ["0"],
                "ProviderName": searchText,
                "PageSize": 50,
                "PageNumber": 1,
                "MinimumConfidence": 0,
                "IncludeInsuranceCodes": true,
                "IncludeSpecialities": false,
                "IncludeDegrees": true,
                "IncludeEducations": false
            }
        }
        if (!searchText) {
            dispatch(setIsLoading(false));
            setDoctorData([])
        } else if(searchText && (searchText).toString().length > 2){
            dispatch(setIsLoading(true));
            dispatch(searchpcp(doctorJSONBody))
        }
    }

    const keyDownSearchDoctor = (e) => {
       
        const debounced = debounce(() => {
            searchDoctorByText()
        }, 1500);
        debounced();
        /* if (e.keyCode === 13) {
            searchDoctorByText()
        } else {
            setSearchText(e.target.value)
        } */
    }


    return (
        <>
            {/* <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Doctors
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <div className='doctor-control-section'>
                        <input
                            name="searchText"
                            type="text"
                            value={searchText}
                            placeholder="Search Doctor"
                            className='search-doctor-input experience-input w-90'
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyUp={(e) => keyDownSearchDoctor(e)}
                        />
                        <Button onClick={searchDoctorByText} variant="contained" className='primary-button p-16-32 max-h-54' style={{ minWidth: '200px' }}>Search</Button>
                    </div>
                    <table className='doctor-table'>
                        <tr>
                            <th>Select</th>
                            <th>Doctor Name</th>
                        </tr>
                        {
                            doctorData.length ? doctorData.map((item) => (
                                <tr>
                                    <td>
                                        <Checkbox name={item.ProviderName} onChange={(e) => handleChange(e, item)} inputProps={{ 'aria-label': 'controlled' }} />
                                    </td>
                                    <td>
                                        {item.ProviderName}
                                    </td>
                                </tr>
                            ))
                            :
                                <tr>
                                    <td colspan="2" style={{textAlign: 'center'}}>
                                        <p>No data</p>
                                    </td>
                                </tr>
                        }
                    </table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="outlined" className='p-16-32 max-h-54' style={{ minWidth: '200px' }}>Cancel</Button>
                    <Button onClick={addDoctor} variant="contained" className='primary-button p-16-32 max-h-54' style={{ minWidth: '200px' }}>Add Doctor</Button>
                </DialogActions>
            </BootstrapDialog> */}

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className='add-doctor-dialog'
            >
                <DialogTitle id="alert-dialog-title">
                    {"Add a doctor"}
                </DialogTitle>
                <DialogContent className='add-doctor-body' style={{ borderTop: "1px solid rgb(205 205 205)" }}>
                    <h2>Are there any other doctors you see regularly?</h2>
                    <h4>We'll make sure they're covered by any plans we recommend.</h4>
                    <div className='' style={{ marginTop: "15px" }}>
                        <div className='' style={{ width: "346px", position: "relative" }}>
                            <input
                                name=""
                                type="text"
                                placeholder="Your Doctor's Name"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onKeyUp={(e) => keyDownSearchDoctor(e)}
                                className='experience-input doctorName'
                                style={{ margin: "0px" }}
                            />
                            {(showError?<p style={{color:"red"}}>{showError.doctor}</p>:"")}
                            <div className='suggestion-popup' style={{display: showList ? 'block' : 'none' }}>
                            {
                            doctorData.length ? doctorData.map((item) => (
                                <div className="suggestion-popup-option" onClick={(e) => handleChange(e, item)} >
                                {item.ProviderName}
                                </div>
                                )):
                                <div className="suggestion-popup-option">No data</div>
                            }
                            </div>
                        </div>
                        <div className='mt-20 add-doctor product-select'>
                            <Select
                                id="demo-simple-select"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                style={{ width: "100%" }}
                            >
                                <MenuItem value="">Address</MenuItem>
                                {                            
                                addresses.length ? addresses.map((item) => (
                                    <MenuItem value={item.Address1}>{item.Address1}</MenuItem>
                                )):
                                <MenuItem>No data</MenuItem>
                                }
                            </Select>
                            {(showError?<p style={{color:"red"}}>{showError.address}</p>:"")}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions >
                    <Button
                        className='primary-outline-button p-16-60'
                        variant="outlined"
                        onClick={handleClose} autoFocus>
                        Cancel
                    </Button>
                    <Button
                        style={{ marginTop: "0px" }}
                        className='product-btn p-16-60'
                        variant="contained"
                        onClick={addDoctor}>Add</Button>
                </DialogActions>
            </Dialog>

        </>
    )
}

export default DoctorControl