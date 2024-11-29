import { createContext, useContext, useState, useEffect } from "react";

const decodeJWT = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

const isTokenExpired = (decodedToken) => {
    if (!decodedToken || !decodedToken.exp) return true;
    const expirationTime = decodedToken.exp * 1000;
    return Date.now() > expirationTime;
};

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            const decoded = decodeJWT(storedToken);
            if (decoded && !isTokenExpired(decoded)) {
                return { ...decoded, token: storedToken };
            }
            localStorage.removeItem("token");
        }
        return null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem("token", user.token);
        } else {
            localStorage.removeItem("token");
        }
    }, [user]);

    const login = (token) => {
        const decodedUser = decodeJWT(token);
        if (decodedUser && !isTokenExpired(decodedUser)) {
            setUser({ ...decodedUser, token });
        } else {
            console.error("Token expired or invalid.");
        }
    };

    const logout = () => {
        setUser(null);
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
