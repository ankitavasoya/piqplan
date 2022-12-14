import React, { useEffect } from 'react'
import Footer from './footer/Footer'
import Header from './header/Header'
import $ from "jquery";
import LoginHeader from './header/LoginHeader';

const Layout = ({ children }) => {
  useEffect(() => {
    $(document).ready(function () {
      $(window).scrollTop(0);
    });
  }, [children]);

  return (
    <>
      <LoginHeader />
      <Header isSpace={false} />
      {children}
      <Footer />
    </>
  )
}

export default Layout