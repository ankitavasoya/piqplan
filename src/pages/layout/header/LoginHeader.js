import React, { useEffect, useState } from 'react'
import $ from "jquery";
import ConutryFlag from '../../../assets/images/country-flag.png'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import AuthStorage from '../../../helper/AuthStorage';
import STORAGEKEY from '../../../config/APP/app.config';
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Logout, Person } from '@mui/icons-material'
import usericon from '../../../assets/images/user-icon.png'
import { useDispatch } from 'react-redux';
import { SAVE_AUTHDATA } from '../../../redux/type';
import swal from 'sweetalert';
import { POPUP_TIMER } from '../../../helper/utils';

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

const LoginHeader = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [isAuthencated, setIsAuthencated] = useState(false)
    const [userData, setUserData] = useState([])
    const [isAgent, setIsAgent] = useState(false)
    const redirectToMainPage = ["/profile", "/user-activity", "/submit-inquiry"]
    useEffect(() => {
        const userDataLocalStorage = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.userData)
        if (userDataLocalStorage) {
            setIsAuthencated(true)
            setUserData(userDataLocalStorage)
        }
    }, [])
    useEffect(() => {
        const data = userData?.UserRoles?.map((item) => item.Rolename.toLowerCase());
        if(data?.includes('agent')) {
            setIsAgent(true)
        }
      }, [userData]);

    const goTo = () => {
        const pathname = window.location.pathname;
        AuthStorage.setStorageData(STORAGEKEY.currentUrl, pathname, true)
        navigate('/login')
    }

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        const pathname = window.location.pathname;
        AuthStorage.deauthenticateUser();
        setIsAuthencated(false)
        setUserData([])
        dispatch({
            type: SAVE_AUTHDATA,
            payload: null,
        })
        setAnchorEl(null);
        if (redirectToMainPage.includes(pathname)) {
            navigate("/piqplan-medicare")
        }
        swal({
            title: "Success",
            text: "Logged out successfully!",
            icon: "success",
            buttons: "Ok",
            timer: POPUP_TIMER
        })
    }
    const goToProfile = () => {
        setAnchorEl(null);
        navigate("/profile")
    }
    const goToUserActivity = () => {
        setAnchorEl(null);
        navigate("/user-activity")
    }
    const goToPotentialLeads = () => {
        setAnchorEl(null);
        navigate("/potential-leads")
    }
    return (
        <>
            <div className='login-header'>
                <div className='w-90 mx-auto d-flex' style={{ justifyContent: 'space-between' }} >
                    <div className='d-flex' style={{ gap: '12px', alignItems: 'center' }}>
                        {/* <img src={ConutryFlag} alt='country flag' />
                        <h4 className='zip-code'></h4>
                        <div className='border-div' style={{ height: '100%' }}></div>
                        <Button className='go-to-plan-btn' style={{ padding: '6px 12px' }}>Go to Plan</Button> */}
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginRight: '7px' }}>
                        {
                            (isAuthencated) ?
                                <>
                                    <div onClick={handleClick} className="header-link" style={{ alignItems: 'center', gap: '10px', display: 'flex' }}>
                                        <h4 className='zip-code hover-text' style={{ cursor: 'pointer' }} >Hello, {userData.Email}</h4>
                                        <img src={usericon} alt="" style={{ cursor: 'pointer' }} />
                                    </div>
                                    <StyledMenu
                                        id="demo-customized-menu"
                                        MenuListProps={{
                                            'aria-labelledby': 'demo-customized-button',
                                        }}
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                    >
                                        <MenuItem disableRipple onClick={goToProfile}>
                                            <Person />
                                            Profile
                                        </MenuItem>
                                        <MenuItem disableRipple onClick={goToUserActivity}>
                                            <Person />
                                            My Activity
                                        </MenuItem>
                                        {isAgent && <MenuItem disableRipple onClick={goToPotentialLeads}>
                                            <Person />
                                            Potential leads
                                        </MenuItem>}
                                        <MenuItem disableRipple onClick={handleLogout}>
                                            <Logout />
                                            Logout
                                        </MenuItem>
                                    </StyledMenu>
                                </>
                                :
                                <>
                                    <h4 className='zip-code hover-text' style={{ cursor: 'pointer' }} onClick={goTo}>Log in</h4>
                                    <div className='border-div' style={{ height: '100%', background: '#717171' }}></div>
                                    <h4 className='zip-code hover-text' style={{ cursor: 'pointer' }} onClick={goTo}>Register</h4>
                                </>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginHeader