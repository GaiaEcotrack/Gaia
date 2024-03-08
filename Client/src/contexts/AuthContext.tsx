import React, { useContext, useState, useEffect, ReactNode } from "react"
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail  } from "firebase/auth";
import { auth, storage }  from "../firebase";
import 'firebase/auth';
import 'firebase/storage';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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

  async function upload(file: File, setLoading: (loading: boolean) => void) {
    const fileRef = ref(storage, currentUser.uid + '.png');

    setLoading(true);

    const snapshot = await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);

    updateProfile(currentUser, {photoURL});
    
    setLoading(false);
    alert("Uploaded file!");   
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
    updatePassword,
    upload
  }

  return (
    <AuthContext.Provider value={value}>
      {!loadingE && children}
    </AuthContext.Provider>
  )
}
