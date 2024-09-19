import React, { useContext, useState, useEffect, ReactNode } from "react"
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  updateEmail,
  updatePassword,
  sendPasswordResetEmail,
  User} from "firebase/auth";
import { auth, storage }  from "../firebase";
import 'firebase/auth';
import 'firebase/storage';
import { getDownloadURL, ref } from "firebase/storage";

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

  function updEmail(user: User, email: string) {
    return updateEmail(user, email);
  }

  function updPassword(user: User, password: string) {
    return updatePassword(user, password)
  }

  async function upload(file: File, setLoading: (loading: boolean) => void) {
    const fileRef = ref(storage, currentUser.uid + '.png');

    setLoading(true);

    const photoURL = await getDownloadURL(fileRef);

    updateProfile(currentUser, {photoURL});
    
    setLoading(false);   
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
    updEmail,
    updPassword,
    upload
  }

  return (
    <AuthContext.Provider value={value}>
      {!loadingE && children}
    </AuthContext.Provider>
  )
}
