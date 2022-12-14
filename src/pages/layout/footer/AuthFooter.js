import React from 'react'
import HeaderLodo from '../../../assets/images/header-logo.png'
import Facebook from '../../../assets/images/facebook.png'
import Youtub from '../../../assets/images/youtub.png'
import Twitter from '../../../assets/images/twitter.png'
import { useNavigate } from 'react-router-dom'

const AuthFooter = () => {

    const navigate = useNavigate()

    return (
        <div className='footer-main'>
            <div className='footer-header'>
                <img src={HeaderLodo} alt='header-logo' className='cursor-pointer responsive-footer-logo' onClick={() => navigate('/')} />
                <div>
                    <p className='hover-text'>Email : info@PiqPlan.com</p>
                    <p className='hover-text'>Phone : 1-888-454-2383</p>
                </div>
                <img src={HeaderLodo} alt='header-logo' className='cursor-pointer footer-logo' onClick={() => navigate('/')} />
                <div className='socialmedia'>
                    <img src={Facebook} alt='header-logo' className='cursor-pointer' />
                    <img src={Youtub} alt='header-logo' className='cursor-pointer' />
                    <img src={Twitter} alt='header-logo' className='cursor-pointer' />
                </div>
            </div>
            <div className='footer-footer'>
                <div className='footer-terms-service'>
                    <p className='hover-text'>Privacy Policy</p>
                    <div className='border-div'></div>
                    <p className='hover-text'>Terms of Service</p>
                </div>
                <p className='hover-text'>Copyright ©2022 PiqPlan-All rights reserved.</p>
            </div>
        </div>
    )
}

export default AuthFooter