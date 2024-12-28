import { createContext, useContext, useState } from "react"

const AuthContext = createContext();

const decodeBase64 = (str) => {
    // Replace characters for Base64 decoding
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if necessary
    while (str.length % 4) {
        str += '=';
    }
    return JSON.parse(atob(str));
};

export const AuthProvider = ({ children }) => {
    const [user, setUser ] = useState(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = decodeBase64(token.split('.')[1]);
                return { ...decodedToken, token };
            } catch (error) {
                console.error("Error decoding token:", error);
                return null;
            }
        }
        return null;
    });

    const login = (token) => {
        localStorage.setItem('token', token);
        try {
            const decodedToken = decodeBase64(token.split('.')[1]);
            setUser ({ ...decodedToken, token });
        } catch (error) {
            console.error("Error decoding token during login:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser (null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);