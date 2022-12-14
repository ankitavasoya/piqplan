
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppBar, Box, Button, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import HeaderLogo from '../../../assets/images/header-logo.png'
import CloseManu from '../../../assets/images/close.png'
import OpenManu from '../../../assets/images/manu.png'
import AuthStorage from '../../../helper/AuthStorage';
import STORAGEKEY from '../../../config/APP/app.config';
const AuthHeader = () => {

    const navigate = useNavigate()

    const [mobileOpen, setMobileOpen] = React.useState(false);
    const drawerWidth = "100%";

    const navItems = [
        {
            name: 'Home',
            pathname: '/piqplan-medicare'
        },
        {
            name: 'Medicare 101',
            pathname: '/'
        },
        {
            name: 'Our Solutions',
            pathname: '/'
        },
        {
            name: 'FAQ',
            pathname: '/'
        },
        {
            name: 'About Us',
            pathname: '/'
        },
        // {
        //     name: 'Markets Served',
        //     pathname: '/piqplan-medicare'
        // },
        // {
        //     name: 'Learn',
        //     pathname: '/piqplan-medicare'
        // },
        // {
        //     name: 'Company',
        //     pathname: '/piqplan-medicare'
        // },
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const goToContactUsPage = () => {
        setMobileOpen(false);
        navigate('/contact-us')
    }

    const drawer = (
        <Box onClick={() => { }} className='product-main' sx={{ textAlign: 'center' }}>
            <Typography className='drawer-header' variant="h6" sx={{ my: 2 }}>
                <img src={HeaderLogo} alt="Header Logo" onClick={() => navigate('/')} />
                <div>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ display: { lg: 'none' } }}
                    >
                        <img src={CloseManu} alt="" />
                    </IconButton>
                </div>
            </Typography>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item} disablePadding>
                        <ListItemButton className='header-link' sx={{ textAlign: 'center', justifyContent: 'center' }}>
                            {/* <ListItemText primary={item} /> */}
                            <Link style={{ padding: '12px' }} to={item.pathname} onClick={() => setMobileOpen(false)}>{item.name}</Link>
                        </ListItemButton>
                    </ListItem>
                ))}
                <div className='header-link'>
                    <Button className='p-16-32' onClick={goToContactUsPage}>Contact us</Button>
                </div>
                {/* <Box className='header-link' sx={{ display: { xs: 'none', lg: 'block' } }}>
                    {navItems.map((item) => (
                        <Link to={item.pathname}>{item.name}</Link>
                    ))}
                </Box> */}
            </List>
        </Box>
    );

    return (
        <>
            <Box sx={{ display: 'flex', backgroundColor: '#FFFFFF' }}>
                <AppBar component="nav" className='nav-main' sx={{ backgroundColor: '#FFFFFF', top:'39px' }}>
                    <Toolbar style={{ justifyContent: 'end', color: '#000', padding:'0px' }}>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1, display: { lg: 'none', padding: '16px', height: '60px', } }}
                            style={{paddingLeft:'0px'}}
                            className='header-logo-manu'
                        >
                            <img src={HeaderLogo} alt="Header Logo" height="60px" width="60px" onClick={() => navigate('/')} />
                        </Typography>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            className='header-logo-manu'
                            sx={{ mr: 2, display: { lg: 'none' }, margin: '0px'}}
                        >
                            <img src={OpenManu} alt=""  onClick={handleDrawerToggle}/>
                        </IconButton>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', lg: 'block', padding: '16px', height: '60px' }, paddingLeft:'0px' }}
                           
                        >
                            <img src={HeaderLogo} alt="Header Logo" height="60px"  onClick={() => navigate('/')}/>
                        </Typography>
                        <Box className='header-link' sx={{ display: { xs: 'none', lg: 'block' } }}>
                            {navItems.map((item) => (
                                <Link key={item.name} to={item.pathname}>{item.name}</Link>
                            ))}
                            <Button className='p-16-32' onClick={() => navigate('/contact-us')}>Contact us</Button>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Box component="nav">
                    <Drawer
                        style={{ transition: 'none' }}
                        // container={container}
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            display: { xs: 'block', lg: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Box>
            </Box>
        </>
    )
}

export default AuthHeader