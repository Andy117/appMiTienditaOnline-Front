import axios from "axios"

const apiURL = import.meta.env.VITE_API_URL

const login = async (credentials) => {
    return axios.post(`${apiURL}/login`, credentials)
}

const authService = {
    login
}

export default authService