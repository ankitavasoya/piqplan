import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import './App.css'; 
import { ToastContainer } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';
import store from './redux/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { lazy, Suspense } from 'react';
// import Routes from './routes/Routes';
const Routes = lazy(() => import('./routes/Routes'));
const Spinner = lazy(() => import('./components/common/Spinner'));


function App() {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Suspense fallback={<Spinner />}>
          <BrowserRouter>
            <Provider store={store}>
              <ToastContainer
                position="top-right"
              />
              <Routes />
            </Provider>
          </BrowserRouter>
        </Suspense>
      </LocalizationProvider>
    </>
  );
}

export default App;
