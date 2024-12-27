import axios from "axios"

const API_URL = "http://localhost:1234/api"

const login = async (credentials) => {
    return axios.post(`${API_URL}/login`, credentials)
}

const authService = {
    login
}

export default authService