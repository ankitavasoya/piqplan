import React, { useEffect } from 'react'
import Layout from './layout/Layout'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Home from './home/Home';
import Solutions from './solutions/Solutions';
import Markets from './markets/Markets';
import Learn from './learn/Learn';
import Company from './company/Company';
import Product from '../components/Product';
import Surveys from './surveys/Surveys';
import AuthLayout from './layout/AuthLayout';
import PlanList from './plans/PlanList';
import PlanDetails from './plans/PlanDetails';
import PlanCompare from './plans/PlanCompare';
// import EligibilityReport from './eligibilityReport/EligibilityReport';
import Login from './login/Login';
import Header from './layout/header/Header';
import ContactUs from './contactUs/ContactUs';
import EligibilityReport from './eligibilityReport/EligibilityReport';
import Profile from './profile/Profile';
import Blog from './blog/Blog';
import SubmitInquiry from './inquiry/SubmitInquiry';
import InquiryHistory from './inquiry/InquiryHistory';
import EditInquiry from './inquiry/EditInquiry';
import TalkToAdvisers from './talktoAdvisers/TalkToAdvisers';
import Potentialleads from './leads/Potentialleads';
import Page404 from './Page404';
import AuthStorage from '../helper/AuthStorage';
import STORAGEKEY from '../config/APP/app.config';

const Index = () => {
    const navigate = useNavigate()
    const location = useLocation()
    let { pathname } = { ...location }
    const redirectToMainPage = ["/profile", "/user-activity", "/submit-inquiry"]

    useEffect(() => {
        if (location.pathname === "/login") {
            const token = AuthStorage.getStorageData(STORAGEKEY.token)
            if (token) {
                navigate("/piqplan-medicare")
            } else {
                navigate(location.pathname)
            }
        }
        // else if (!AuthStorage.getStorageData(STORAGEKEY.token)) {
        //     if (!redirectToMainPage.includes(location.pathname)) {
        //         navigate("/piqplan-medicare")
        //     } else {
        //         navigate(location.pathname)
        //     }
        // }
    }, [location.pathname])


    if (["/", "/login"].includes(pathname)) {
        if (["/login"].includes(pathname)) {
            return (
                <>
                    <Header isSpace={true} />
                    <Routes>
                        {/* <Route exact path="/" element={<Markets />} /> */}
                        <Route exact path="/login" element={<Login />} />
                    </Routes>
                </>
            )
        }
        if (["/"].includes(pathname)) {
            return (
                <Layout>
                    <Routes>
                        <Route exact path="/" element={<Markets />} />
                    </Routes>
                </Layout>
            )
        }

    }
    else if (['/solutions', '/piqplan-medicare', '/learn', '/company', '/product', '/surveys', '/planlist', '/plan-details', '/plan-compare',
        '/eligibility-report', '/contact-us', '/profile', '/blog', '/submit-inquiry', '/edit-inquiry', '/user-activity', '/talk-to-advisers', '/potential-leads'
    ].includes(pathname)) {
        return (
            <>
                <AuthLayout>
                    <Routes>
                        {/* <Route exact path="/" element={<Home />} /> */}
                        <Route path="/solutions" element={<Solutions />} />
                        <Route path="/piqplan-medicare" element={<Home />} />
                        <Route path="/learn" element={<Learn />} />
                        <Route path="/company" element={<Company />} />
                        <Route path="/product" element={<Product />} />
                        <Route path="/surveys" element={<Surveys />} />
                        <Route path="/planlist" element={<PlanList />} />
                        <Route path="/plan-details" element={<PlanDetails />} />
                        <Route path="/plan-compare" element={<PlanCompare />} />
                        <Route path="/eligibility-report" element={<EligibilityReport />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/contact-us" element={<ContactUs />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/submit-inquiry" element={<SubmitInquiry />} />
                        <Route path="/edit-inquiry" element={<EditInquiry />} />
                        <Route path="/user-activity" element={<InquiryHistory />} />
                        <Route path="/talk-to-advisers" element={<TalkToAdvisers />} />
                        <Route path="/potential-leads" element={<Potentialleads />} />
                    </Routes>
                </AuthLayout>
            </>
        )
    } else {
        return (
            <Routes>
                {/* <Route exact path="/" element={<Markets />} /> */}
                <Route exact path="*" element={<Page404 />} />
            </Routes>
        )
    }
}

export default Index