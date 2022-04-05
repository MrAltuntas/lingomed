import axios from 'axios'

export default axios.create({baseURL: 'http://192.168.155.171:5001/api',crossDomain: true})