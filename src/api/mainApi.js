import axios from 'axios'

export default axios.create({baseURL: 'https://app.lingomed.net/api',crossDomain: true})