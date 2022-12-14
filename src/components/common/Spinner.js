import React from "react";
import '../../index.css';
import SpinnerLogo from '../../assets/images/header-logo.png'
// import Loader from '../../assets/images/Loader.svg'


export default function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="loader-inner" style={{rowGap:'20px'}}>
        <img src={SpinnerLogo} alt="" />
        {/* <img src={Loader} alt="" /> */}
        <div class="progress"></div>
      </div>
    </div>
  );
}