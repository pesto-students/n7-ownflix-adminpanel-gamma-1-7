import axios from 'axios';

var token = localStorage.getItem('accessToken');
var xKey = process.env.REACT_APP_X_API_KEY;

const instance = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	timeout: 25000,
	headers: {
		Authorization: `Bearer ${token}`,
		'x-api-key': xKey,
	},
});
export default instance;
