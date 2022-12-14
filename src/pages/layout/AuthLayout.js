import React, { useEffect } from 'react'
import AuthFooter from './footer/AuthFooter'
import AuthHeader from './header/AuthHeader'
import LoginHeader from './header/LoginHeader';
import $ from "jquery";

const AuthLayout = ({ children }) => {
  useEffect(() => {
    $(document).ready(function () {   
      $(window).scrollTop(0);
    });
  }, [children]);
  return (
    <>
      <LoginHeader />
      <AuthHeader />
      <div style={{ paddingTop: '130px', minHeight:'66.3vh' }}>
        {children}
      </div>
      <AuthFooter />
    </>
  )
}

export default AuthLayout