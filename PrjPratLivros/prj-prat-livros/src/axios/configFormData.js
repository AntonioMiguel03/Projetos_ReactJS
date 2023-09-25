import axios from 'axios';

const agFetch = axios.create({
    baseURL: "http://localhost:4000",
    headers: {
        "Content-Type": "application/json"
    },
    maxContentLength: 500 * 1024,
});

const agFetchFormData = axios.create({
    baseURL: "http://localhost:4000",
    headers: {
        "Content-Type": "multipart/form-data"
    },
    maxContentLength: 500 * 1024,
});

export default { agFetch, agFetchFormData };