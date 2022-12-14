import API_LOCAL from './api-local';
import API_PROD from './api-prod';

const hostname = window.location.hostname;
const port = window.location.port;
const isLocalApi =  +port >= 5000;

export const API =
    (hostname === 'localhost' && isLocalApi) ? API_LOCAL : API_PROD
