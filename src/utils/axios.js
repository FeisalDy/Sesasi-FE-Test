import axios from 'axios'

const Axios = axios.create({
  baseURL: 'https://test-fe.sidak.co.id',
  headers: {
    timeout: 1000
  }
})

export default Axios
