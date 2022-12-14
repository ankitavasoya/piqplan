import { baseUrl } from "../baseURL";

const protocol = 'http';
const host = baseUrl;
const port = '';
const trailUrl = 'api';

const hostUrl = `${host}/`;
// const endpoint = `${protocol}://${host}${(port ? ':' + port : '')}`;
const endpoint = `${host}${(port ? `':' + ${port}` : '')}/${trailUrl}`;

export default {
    // protocol: protocol,
    host,
    // port: port,
    apiUrl: trailUrl,
    endpoint,
    hostUrl,
};