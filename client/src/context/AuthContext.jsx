import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);

  const storeToken = (token) => {
    localStorage.setItem("authToken", token);
  };

  const authenticateUser = async () => {
    const storedToken = localStorage.getItem("authToken");
    console.log(storedToken)
    if (storedToken) {
      try {
        const response = await axios.get(`${API_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        console.log(response)
        console.log("hello")
        const user = response.data;
        setIsLoggedIn(true);
        setIsLoading(false);
        setUser(user);
      } catch (error) {
        console.log(error)
        if (error.response) {
          setAuthError(error.response?.data?.message);
        }
        setIsLoggedIn(false);
        setIsLoading(false);
        setUser(null);
        localStorage.removeItem("authToken");
      }
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
    }
  };

  const logOutUser = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setIsLoading(false);
    setUser(null);
    setAuthError(null);
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  useEffect(() => {
    console.log("Updated isLoggedIn:", isLoggedIn, "User:", user);
  }, [isLoggedIn, user]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        storeToken,
        authenticateUser,
        logOutUser,
        authError,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthProviderWrapper, AuthContext };
