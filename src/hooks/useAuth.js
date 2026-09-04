import { useState, useCallback, useEffect } from "react";
import {
  getToken,
  getUser,
  setAuth,
  login as authLogin,
  signup as authSignup,
  logout as authLogout,
} from "@/utils/auth";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
  }, []);

  const login = useCallback(
    async (email, password) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authLogin(email, password);
        setAuth(response.token, response.user);
        setToken(response.token);
        setUser(response.user);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Login failed";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const signup = useCallback(
    async (fullname, email, password, confirm_password) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authSignup(fullname, email, password, confirm_password);
        
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Sign up failed";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authLogout();
      setToken(null);
      setUser(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Logout failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    error,
    login,
    signup,
    logout,
  };
};
