
import React, { useEffect, useState } from 'react'
import SolutionsHero from '../../assets/images/SolutionsHero.png'
import EnrollmentSection from '../../components/EnrollmentSection'
import ReactHtmlParser from 'react-html-parser';
import { Grid } from '@mui/material'
import { ApiGet } from '../../helper/API/ApiData'
import { endPoints } from '../../config/endPoints'
import { setIsLoading } from "../../redux/actions/loadingAction"
import { useDispatch } from 'react-redux';
import IMG01 from '../../assets/images/01.png'
import IMG02 from '../../assets/images/02.png'
import IMG03 from '../../assets/images/03.png'
const Home = () => {
  const dispatch = useDispatch();
  const [surveyData, setSurveyData] = useState()
  const [singleQuestionData, setSingleQuestionData] = useState(null);

  useEffect(() => {
    getSurveysAPI()
  }, [])


  const getSurveysAPI = () => {
    dispatch(setIsLoading(true));
    ApiGet(endPoints.getSurveys)
      .then((res) => {
        if (res.length) {
          setSurveyData(res[0])
          getQuestionByIdAndOrderNoAPI(0, res[0].Surveyid)
        }
      }).catch((error) => {
        dispatch(setIsLoading(false));
      })
  }


  const getQuestionByIdAndOrderNoAPI = (currentOrderNo, surveyId) => {
    ApiGet(`${endPoints.getQuestionBySurveyIdAndOrderNo}/${currentOrderNo}/${surveyId}`)
      .then((res) => {
        dispatch(setIsLoading(false));
        if (res) {
          setSingleQuestionData(res)
        }
      }).catch((error) => {
        dispatch(setIsLoading(false));
      })
    dispatch(setIsLoading(false));
  }

  return (
    <>
      <div className='solutions-main' style={{ marginBottom: "100px" }}>
        <div className='hero-content' style={{ backgroundImage: `url(${SolutionsHero})` }}>
          <div className='hero-text'>
            <div className=''>
              <h3>{singleQuestionData?.Questiontitle}</h3>
              <h5>{ReactHtmlParser(singleQuestionData?.Questiontext)}</h5>
            </div>
            <EnrollmentSection singleQuestionData={singleQuestionData} />
          </div>
        </div>
        <div>
          <div className='learn'>
            <h1 className='title'>The Medicare advisor I wish my parents had.</h1>
            <div className='w-90 mx-auto'>
              {/* <Container maxWidth="xl"> */}
              <Grid container spacing={5}>
                <Grid item lg={4} md={12} sm={12} xs={12}>
                  <div className='medicare-advisor-card bg-7ab6f1'>
                    <div className='card-number-img' style={{ display: 'flex', justifyContent: 'space-between', minHeight: '150px' }}>
                      <h2 className='card-number'>01</h2>
                      <img src={IMG01} alt='' />
                    </div>
                    <div>
                      <h3 className='card-header'>No cold calls. No skeezy sales tactics. We treat you like family.</h3>
                      <h5 className='card-last-text'>You can read about Medicare and shop for Medigap or Medicare Advantage plans on our site. Or you call us if you want to talk to one of our licensed advisors.</h5>
                    </div>
                  </div>
                </Grid>
                <Grid item lg={4} md={12} sm={12} xs={12}>
                  <div className='medicare-advisor-card bg-8CDEDC'>
                    <div className='card-number-img' style={{ display: 'flex', justifyContent: 'space-between', minHeight: '150px', flexWrap: 'wrap' }}>
                      <h2 className='card-number'>02</h2>
                      <img src={IMG02} alt='' />
                    </div>
                    <div>
                      <h3 className='card-header'>Our recommendations aren't influenced by commission.</h3>
                      <h5 className='card-last-text'>Like any health insurance brokerage, we make money when you enroll in a plan. Unlike other brokerages, our recommendations aren't biased by our commissions.</h5>
                    </div>
                  </div>
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                  <div className='medicare-advisor-card bg-F6C185'>
                    <div className='card-number-img' style={{ display: 'flex', justifyContent: 'space-between', minHeight: '150px', flexWrap: 'wrap' }}>
                      <h2 className='card-number'>03</h2>
                      <img src={IMG03} alt='' />
                    </div>
                    <div>
                      <h3 className='card-header'>Every year, we make sure you have the best deal.</h3>
                      <h5 className='card-last-text'>We help you decide on your first Medicare Advantage or Medigap plan. Then every year we reshop your coverage to make sure you're getting the best deal.</h5>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
            {/* </Container> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default Home