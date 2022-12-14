import React from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderLodo from '../../../assets/images/header-logo.png'

const Footer = () => {

  const navigate = useNavigate()

  return (
    <div className='footer-main'>
      <div className='footer-header'>
        <img src={HeaderLodo} alt='header-logo' className='cursor-pointer responsive-footer-logo' onClick={() => navigate('/')} />
        <p>Phone : 1-888-454-2383</p>
        <img src={HeaderLodo} alt='header-logo' className='cursor-pointer footer-logo' onClick={() => navigate('/')} />
        <p>Email : info@PiqPlan.com</p>
      </div>
      <div className='footer-footer'>
        <div className='footer-terms-service'>
          <p className='borde-right'>Privacy Policy</p>
          <p>Terms of Service</p>
        </div>
        <p>Copyright ©2022 PiqPlan-All rights reserved.</p>
      </div>
    </div>
  )
}

export default Footer