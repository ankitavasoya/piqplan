import React from 'react'
import blog from '../../assets/images/blog.png'
import BlogBody from '../../assets/images/blog-body-img.png'
import BlogBody2 from '../../assets/images/blog-body-img-2.png'
import BlogBody3 from '../../assets/images/blog-body-img-3.png'
import blogwriter from '../../assets/images/blog-body-img-3.png'
import Facebook from '../../assets/images/facebook.png'
import Youtub from '../../assets/images/youtub.png'
import Twitter from '../../assets/images/twitter.png'
import Caard1 from '../../assets/images/learn-cards-1.png'
import Caard2 from '../../assets/images/learn-cards-2.png'
import { Button, Grid } from '@mui/material'

const Blog = () => {
    return (
        <>
            <div className='blog-head'>
                <div className='blog-head-content'>
                    <div className='blog-head-content-inner'>
                        <h5 className='published-date'>Published on - 20 JAN 2022 </h5>
                        <h2 className='blog-title'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</h2>
                    </div>
                    <img src={blog} alt='' />
                </div>
            </div>
            <div className='blog-body'>
                <h6 className='blog-title'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</h6>
                <p className='blog-text'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</p>
                <img src={BlogBody} alt='' className='' width="100%" />
                <p className='blog-text' style={{ marginBottom: '16px' }} >Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including version</p>
                <p className='blog-text' style={{ marginBottom: '32px' }} >Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</p>
                <h6 className='blog-title' style={{ marginBottom: '12px' }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</h6>
                <p className='blog-text' style={{ marginBottom: '16px' }} >Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</p>
                <p className='blog-text' >Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including version</p>
                {/* <div className='d-flex' style={{ gap: '50px' }} > */}
                    <Grid container spacing={3} >
                        <Grid item lg={6}>
                            <img src={BlogBody2} alt='' className='' width="100%" />
                        </Grid>
                        <Grid item lg={6}>
                            <img src={BlogBody3} alt='' className='' width="100%" />
                        </Grid>
                    </Grid>
                {/* </div> */}
                <h6 className='blog-title' style={{ marginBottom: '12px' }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</h6>
                <p className='blog-text' style={{ marginBottom: '16px' }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including version</p>
                <p className='blog-text' style={{ marginBottom: '16px' }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including version</p>
                <div className='written-by'>
                    <div className='info'>
                        <div className='blogwriter-profile'>
                            <img src={blogwriter} alt='' style={{ width: '65px', height: '65px', borderRadius: '50%', objectFit: 'cover' }} />
                            <div className='blogwriter'>
                                <h5 className='lable'>Written by</h5>
                                <h5 className='writer-name'>Lorem Ipsum is simply</h5>
                            </div>
                        </div>
                        <div className='blogwriter'>
                            <h5 className='lable'>Published on </h5>
                            <h5 className='writer-name'>20 JAN 2022</h5>
                        </div>
                    </div>
                    <div className='socialmedia'>
                        <img src={Facebook} alt='header-logo' className='cursor-pointer' />
                        <img src={Youtub} alt='header-logo' className='cursor-pointer' />
                        <img src={Twitter} alt='header-logo' className='cursor-pointer' />
                    </div>
                </div>
                <div className='learn'>
                    <h1 className='title'>Learn</h1>
                    <div className='learn-cards'>
                        <Grid container spacing={6}>
                            <Grid item lg={6}>
                                <div className='card'>
                                    <img src={Caard1} alt="" width="100%" />
                                    <h2>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. </h2>
                                    <Button onClick={() => { }} style={{ marginTop: "25px" }} variant="contained" className='primary-button p-16-32 max-h-54'>Read more</Button>
                                </div>
                            </Grid>
                            <Grid item lg={6}>
                                <div className='card'>
                                    <img src={Caard2} alt="" width="100%" />
                                    <h2>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. </h2>
                                    <Button onClick={() => { }} style={{ marginTop: "25px" }} variant="contained" className='primary-button p-16-32 max-h-54'>Read more</Button>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Blog