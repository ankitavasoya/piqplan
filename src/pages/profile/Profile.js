import { Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import UserProfile from '../../assets/images/user-profile.png'
import Facebook from '../../assets/images/facebook.png'
import Youtub from '../../assets/images/youtub.png'
import Twitter from '../../assets/images/twitter.png'
import Linkedin from '../../assets/images/linkedin.png'
import AuthStorage from '../../helper/AuthStorage'
import STORAGEKEY from '../../config/APP/app.config'
import { useDispatch, useSelector } from 'react-redux'
import { profile } from '../../redux/actions/accountAction'


const Profile = () => {

    const dispatch = useDispatch()
    const profileData = useSelector((state) => state.registerData.profile)
    const [userProfile, setUserProfile] = useState()

    const userdata = [
        {
            lable: 'Member Id',
            value: 'Ipsum'
        },
        {
            lable: 'Email Id',
            value: userProfile?.Email
            
        },
        {
            lable: 'Phone',
            value: userProfile?.Phone
        },
        {
            lable: 'DOB',
            value: 'Lorem Ipsum '
        },
        {
            lable: 'Brokerid',
            value: 'Lorem Ipsum is simply dummy '
        },
        // {
        //     lable: 'ZipCode',
        //     value: 'Lorem Ipsum '
        // },
        // {
        //     lable: 'County',
        //     value: 'Lorem Ipsum '
        // },
        // {
        //     lable: 'Country',
        //     value: 'Lorem Ipsum '
        // },
        // {
        //     lable: 'State',
        //     value: 'Lorem Ipsum '
        // },
        // {
        //     lable: 'Address',
        //     value: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
        // },
    ]

    useEffect(() => {
        const pathname = window.location.pathname;
        AuthStorage.setStorageData(STORAGEKEY.currentUrl, pathname, true)
        const userData = AuthStorage.getStorageJsonDecreptedData(STORAGEKEY.userData);
        dispatch(profile(userData?.Userid))
    }, [])
    useEffect(() => {
        if (profileData) {
            setUserProfile(profileData)
        }
    }, [profileData])

    return (
        <>
            <div className='profile-bg'>
                <h1 className='profile-title'>User Profile</h1>
                <div className='w-90 mx-auto profile-main'>
                    <div className='user-profile'>
                        <div className='user-name-pic'>
                            <div className='profile-pic'>
                                <img src={UserProfile} alt="Profile" />
                            </div>
                            <div className='user-name'>
                                <h3 className='lable'>Full Name</h3>
                                <h2 className='name'>{userProfile?.Firstname} {userProfile?.Lastname}</h2>
                            </div>
                        </div>
                        {/* <div className='follow-socialmedia'>
                            <h3 className='lable'>Follow</h3>
                            <div className='socialmedia'>
                                <img src={Facebook} alt='header-logo' className='cursor-pointer' />
                                <img src={Youtub} alt='header-logo' className='cursor-pointer' />
                                <img src={Twitter} alt='header-logo' className='cursor-pointer' />
                                <img src={Linkedin} alt='header-logo' className='cursor-pointer' />
                            </div>
                        </div> */}
                    </div>
                    <div className='user-data-main'>
                        {
                            userdata.map((item) => (
                                <div className='user-data'>
                                    <h3 className='lable'>{item.lable}</h3>
                                    <h2 className='value'>{item.value}</h2>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile