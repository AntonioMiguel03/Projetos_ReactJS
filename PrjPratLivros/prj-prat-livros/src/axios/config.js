import axios from 'axios';

const agFetch = axios.create({
    //API local
    baseURL: "http://localhost:4000",
    headers: {
        "Content-Type": "application/json"
    },
});

export default agFetch;