import React, { useContext, useState, useEffect, ReactNode } from "react"
import { getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail  } from "firebase/auth";
import { auth }  from "../firebase";
import 'firebase/auth';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = React.createContext<any | null>(null);

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true)
  const auth = getAuth();

  async function signup(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Signed up
      const user = userCredential.user;
    } catch (error:any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // Handle errors
      console.error(`Error during signup: ${errorCode} - ${errorMessage}`);
      throw error; // Propagate the error for further handling in your UI
    }
  }

  async function login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Logged in
      const user = userCredential.user;
    } catch (error:any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // Handle errors
      console.error(`Error during login: ${errorCode} - ${errorMessage}`);
      throw error; // Propagate the error for further handling in your UI
    }
  }

  function logout() {
    return auth.signOut()
  }

  async function resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error:any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // Handle errors
      console.error(`Error during password reset: ${errorCode} - ${errorMessage}`);
      throw error; // Propagate the error for further handling in your UI
    }
  }

  function updateEmail(email: string) {
    return currentUser.updateEmail(email)
  }

  function updatePassword(password: string) {
    return currentUser.updatePassword(password)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
