import { useState, useEffect } from "react"
import axios from "axios"

const useFetch = (url, options = {}) => {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(url, options)
                setData(response.data)
            } catch (error) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [url, options])

    return { data, error, loading }
}

export default useFetch