import axios from 'axios';

const url = "http://localhost:1337/";

const HttpRequest = {
  post: async (endpoint, options, auth = false) => {
    const token = sessionStorage.getItem('jwt'); // Fetch JWT here
    const headers = {
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (auth && token) headers.headers.Authorization = `Bearer ${token}`;

    const response = await axios.post(`${url}${endpoint}`, options, headers);
    return response;
  },

  get: async (endpoint, options, auth = false) => {
    const token = sessionStorage.getItem('jwt'); // Fetch JWT here
    const headers = {
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (auth && token) headers.headers.Authorization = `Bearer ${token}`;
    console.log(headers)
    const response = await axios.get(`${url}${endpoint}`, options, headers);
    return response;
  },

  delete: async (endpoint, options, auth = false) => {
    const token = sessionStorage.getItem('jwt'); // Fetch JWT here
    const headers = {
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (auth && token) headers.headers.Authorization = `Bearer ${token}`;

    const response = await axios.delete(`${url}${endpoint}`, options, headers);
    return response;
  },

  put: async (endpoint, options, auth = false) => {
    const token = sessionStorage.getItem('jwt'); // Fetch JWT here
    const headers = {
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (auth && token) headers.headers.Authorization = `Bearer ${token}`;

    const response = await axios.put(`${url}${endpoint}`, options, headers);
    return response;
  },
};

export default HttpRequest;
