import axios from 'axios'

export default axios.create({baseURL: 'http://192.168.0.21:5001/api',crossDomain: true})