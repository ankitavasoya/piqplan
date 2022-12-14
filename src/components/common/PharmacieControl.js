import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useDispatch, useSelector } from 'react-redux';
import { searchpharmacies, searchrxdrug } from '../../redux/actions/quotitActions';
import { MenuItem, Select } from '@mui/material';
import Button from '@mui/material/Button';
import { setIsLoading } from "../../redux/actions/loadingAction"
import { debounce } from "lodash";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import STORAGEKEY from '../../config/APP/app.config'
import AuthStorage from '../../helper/AuthStorage'
import moment from 'moment';

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
const PharmacieControl = ({ onAddPharmacy, open, currentQuestion, handleClose }) => {
    const dispatch = useDispatch();

    // const [open, setOpen] = useState(true);
    const [searchText, setSearchText] = useState('')
    const [showList, setShowList] = useState(false)
    const [pharmaciesData, setPharmaciesData] = useState([])
    const [selectedPharmacy, setSelectedPharmacy] = useState([])
    const [showDueList, setShowDueList] = useState(false)
    const [hour, setHour] = useState('')
    const [day, setDay] = useState('')
    const [showError, setShowError] = useState([])
    const getPharmaciesData = useSelector((state) => state.quotitData.searchPharmaciesData)

    const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    useEffect(() => {
        dispatch(setIsLoading(false));
        if (getPharmaciesData?.Pharmacies && getPharmaciesData?.Pharmacies.length) {
            setPharmaciesData(getPharmaciesData?.Pharmacies)
        }
    }, [getPharmaciesData])

    // const handleClose = () => {
    //     setOpen(false);
    // };

    const handleChange = (e, data) => {
        setShowList(false)
        setSearchText(data.PharmacyName)
        setSelectedPharmacy(data)
        setShowDueList(true)
    }

    const searchPharmcyByText = () => {
        setShowList(true)
        setPharmaciesData([])
        const questionData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.questionsData)
        console.log(questionData);
        var ZipCode = [];
        if(questionData) {
            ZipCode = questionData.find((item) => item.quotitmapparam === "ZipCode")?.answertext
        }
        const pharmaciesJSONBody =
        {
            "accessKeys": {
              "remoteAccessKey": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
            },
            "inputs": {
              "zipCode": [parseInt(ZipCode), 90001],
              "pharmacyName": searchText,
            //   "asOfDate": moment().toISOString() // As of now not need to pass date, But do not remove
            }
          }
        dispatch(setIsLoading(true));
        dispatch(searchpharmacies(pharmaciesJSONBody))
    }

    const keyDownSearchPharmcy = (e) => {
        const debounced = debounce(() => {
            searchPharmcyByText()
        }, 750);

        if(searchText.toString().length > 2)
            debounced();

    }
    const validation = () => {
        const errorMsg = {};
        if (selectedPharmacy.length == 0) {
            errorMsg['pharmacy'] = "Please select any one pharmacy"
        }
        setShowError(errorMsg);
        if (Object.keys(errorMsg).length) {
            return true
        } else {
            return false
        }
    };
    const addPharmacy = () => {
        if (validation()) {
            return
        }
      
        selectedPharmacy.questionId = currentQuestion
        console.log(selectedPharmacy);
        onAddPharmacy(selectedPharmacy)
    }
    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className='add-doctor-dialog'
            >
                <DialogTitle id="alert-dialog-title">
                    {"Add a Pharmcies"}
                </DialogTitle>

                <DialogContent className='add-doctor-body' style={{ borderTop: "1px solid rgb(205 205 205)" }}>
                    <h4>Search Pharmcies</h4>
                    <div className='' style={{ marginTop: "15px" }}>
                        <div className='' style={{position: "relative" }}>
                            <input
                                name=""
                                type="text"
                                placeholder="Your Pharmacy Name"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onKeyUp={(e) => keyDownSearchPharmcy(e)}
                                className='enrollment-section-input experience-input w-90 doctorName'
                                style={{ margin: "0px" }}
                            />
                            {(showError ? <p style={{ color: "red" }}>{showError.pharmacy}</p> : "")}
                            <div className='suggestion-popup' style={{ display: showList ? 'block' : 'none', width: '95%' }}>
                                {
                                    pharmaciesData.length ? pharmaciesData.map((item) => (
                                        <div className="suggestion-popup-option" onClick={(e) => handleChange(e, item)} >
                                            {item.PharmacyName}
                                        </div>
                                    )) :
                                        <div className="suggestion-popup-option">No data</div>
                                }
                            </div>
                        </div>
                        {/* <div className='prescriptions-detail' style={{ width: "90%", display: showDueList ? "block" : "none", marginTop: '10px' }} >
                            <p>Brand Name: <span>{selectedPharmacy.BrandName}</span></p>
                            <p>Product Type: <span>{selectedPharmacy.ProductType}</span></p>
                            <p style={{ marginBottom: "10px" }}>Labeler Name: <span> {selectedPharmacy.LabelerName} </span></p>
                            <div style={{ display: 'flex', gap: '26px', alignItems: 'center', width: '50%', marginTop: '20px' }}>
                                <div className='product-select' style={{ width: "116px" }}>

                                    <Select
                                        id="demo-simple-select"
                                        value={hour}
                                        onChange={(e) => setHour(e.target.value)}
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        style={{ width: "116px" }}
                                    >
                                        <MenuItem value="">Select</MenuItem>
                                        {
                                            hours.length ? hours.map((item) => (
                                                <MenuItem value={item}>{item}</MenuItem>
                                            )) :
                                                <MenuItem>No data</MenuItem>
                                        }
                                    </Select>
                                    {(showError ? <p style={{ color: "red" }}>{showError.hour}</p> : "")}
                                </div>
                                <div style={{ whiteSpace: 'nowrap' }}>
                                    <h5 className='time-per'>time per</h5>
                                </div>
                                <div className='product-select' style={{ width: "116px" }}>

                                    <Select
                                        id="demo-simple-select"
                                        value={day}
                                        onChange={(e) => setDay(e.target.value)}
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        style={{ width: "116px" }}
                                    >
                                        <MenuItem value="">Select</MenuItem>
                                        <MenuItem value="day">Day</MenuItem>
                                        <MenuItem value="week">Week</MenuItem>
                                        <MenuItem value="month">Month</MenuItem>
                                    </Select>
                                    {(showError ? <p style={{ color: "red" }}>{showError.day}</p> : "")}
                                </div>
                            </div>
                        </div> */}
                    </div>
                </DialogContent>

                <DialogActions className='add-prescription-footer' style={{flexWrap:'wrap', rowGap:'12px', columnGap:'8px'}} >
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
                        onClick={addPharmacy}
                    >Save Pharmcies</Button>
                </DialogActions>
            </Dialog>
        </>
    )

}

export default PharmacieControl
