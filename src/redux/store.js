import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { isLoadingReducer } from './reducers/loadingReducer';
import { qnaReducer } from './reducers/qnaReducer';
import { quotitReducer } from './reducers/quotitReducer';
import { planReducer } from './reducers/planReducer';
import { accountReducer } from './reducers/accountReducer';
import { inqueryReducer } from './reducers/inqueryReducer';
import { eligiblecheckReducer } from './reducers/eligiblecheckReducer';
import { checkErrorReducer } from './reducers/checkErrorReducer';
import { contactUsReducer } from './reducers/contactUsReducer';

const middleware = [thunk];

const rootReducer = combineReducers({
    loading: isLoadingReducer,
    checkError: checkErrorReducer,
    qnaData: qnaReducer,
    quotitData: quotitReducer,
    planData: planReducer,
    registerData: accountReducer, 
    inqueryData: inqueryReducer,
    eligiblecheckData: eligiblecheckReducer,
    contactData: contactUsReducer

})

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;