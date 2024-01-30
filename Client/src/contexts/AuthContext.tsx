import React, { useContext, useState, useEffect, ReactNode } from "react"
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail  } from "firebase/auth";
import { auth }  from "../firebase";
import 'firebase/auth';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = React.createContext<any | null>("");

export function useAuth() {
  return useContext(AuthContext)
}

 export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loadingE, setLoadingE] = useState(true)
  
  function signup(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);  
  }

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);   
  }

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);    
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
      setLoadingE(false)
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
      {!loadingE && children}
    </AuthContext.Provider>
  )
}
