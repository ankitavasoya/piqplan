import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const EligiblecheckModel = ({ handleClose, open, IsEligible, eligibleText, isDataToShow, dateValidationError, effectiveDateValidationError }) => {
    const navigate = useNavigate()
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
                    {"Eligibility"}
                </DialogTitle>
                <DialogContent className='add-doctor-body' style={{ borderTop: "1px solid rgb(205 205 205)" }}>
                    {!isDataToShow ?
                        <>
                            {
                                IsEligible ?
                                    <h4 className='eligibility-report-plan-text' style={{ textAlign: "center" }
                                    } > {eligibleText}</h4>
                                    : <h4 className='no-eligibility-report-plan-text' style={{ textAlign: "center" }}>{eligibleText}</h4>
                            }
                        </>
                        :
                        <>
                            {/* <h4 className='no-eligibility-report-plan-text' style={{ textAlign: "center" }}>{eligibleText}</h4> */}
                            <h4 className='no-eligibility-report-plan-text' style={{ textAlign: "center" }}>No matching beneficiary was found for the given MBI number.</h4>
                            <h4 style={{ textAlign: "center" }}>Please visit <a href='https://www.cms.gov/Medicare/New-Medicare-Card' target="_blank">Centers for Medicare & Medicaid Services</a> for more details.</h4>
                        </>
                    }
                    {dateValidationError && <h4 className='no-eligibility-report-plan-text' style={{ textAlign: "center" }}>{dateValidationError}</h4>}
                    {effectiveDateValidationError && <h4 className='no-eligibility-report-plan-text' style={{ textAlign: "center" }}>{effectiveDateValidationError}</h4>}

                    <br /><br />
                    {IsEligible && !isDataToShow && <a target={"_blank"} href="/eligibility-report" className='link-surveys see-report-link'>Click here to see your eligible report</a>}
                    <br /><br />
                    <DialogActions sx={{ padding: '0px' }}>
                        <Button
                            className='primary-outline-button p-16-60'
                            variant="outlined"
                            onClick={handleClose} autoFocus>
                            Cancel
                        </Button>
                        {IsEligible && !isDataToShow && <Button
                            style={{ marginTop: "0px" }}
                            className='product-btn p-16-60'
                            variant="contained"
                            onClick={() => navigate("/planlist")}>See Plan</Button>}
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default EligiblecheckModel