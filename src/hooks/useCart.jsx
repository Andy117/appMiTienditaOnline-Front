import { useState, useEffect } from "react"

const useCart = () => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart')
        return savedCart ? JSON.parse(savedCart) : []
    })

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    })

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingProductIndex = prevCart.findIndex(item => item.idProductos === product.idProductos)
            if (existingProductIndex > -1) {
                const updatedCart = [...prevCart]
                updatedCart[existingProductIndex].cantidad += quantity
            }
        })
    }
}