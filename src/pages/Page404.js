import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';
// components
// import Page from '../components/Page';
import pageNotFounrImg from '../assets/images/illustration_404.svg'

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <Container>
      <ContentStyle sx={{ textAlign: 'center', alignItems: 'center', minHeight: 'auto' }}>
        <Typography className='title-404' variant="h3" paragraph>
          Sorry, page not found!
        </Typography>

        <Typography className='text-404' sx={{ color: 'text.secondary' }}>
          Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be
          sure to check your spelling.
        </Typography>

        <Box
          component="img"
          src={pageNotFounrImg}
          sx={{ height: 260, width:'100%', height:'100%' ,mx: 'auto', my: { xs: 5, sm: 10 } }}
        />
        <Button variant="contained" className='primary-button p-16-60 max-h-54' to="/" size="large" component={RouterLink}>
          Go to Home
        </Button>
      </ContentStyle>
    </Container>
  );
}
