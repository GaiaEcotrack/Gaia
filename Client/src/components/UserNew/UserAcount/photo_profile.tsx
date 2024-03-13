import { FcEditImage } from "react-icons/fc"; 
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getAuth } from "firebase/auth";
import Swal from "sweetalert2";

export default function Profile() {
 
  const { upload } = useAuth()
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState('');

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  })
  
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user?.photoURL) {
      setPhotoURL(user.photoURL);
    }else{
      setPhotoURL(`https://api.multiavatar.com/c6c7f124c574a60dd2.png?apikey=CRrgM6wP8NoyEx`);
    } 
  }, []);
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  }
  
  async function handleClick() {
    const auth = getAuth();
    const user = auth.currentUser;   
    if (photo && user) {
      await upload(photo, setLoading);  
      setPhoto(null)  
      Toast.fire({
        icon: "success",
        title: "Updated image\nReload"
      });
    }
  }

  return (
    <div className="fields w-[11rem]">
      <div className="flex justify-center w-full">
      <img src={photoURL} alt="Avatar" className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-300" />
      </div>
      {!photo && (
        <div className="flex justify-end flex-row w-full">
          <input type="file" onChange={handleChange} className="hidden" id="fileInput" />
          <label
            htmlFor="fileInput"
            className="cursor-pointer flex items-end text-sm text-indigo-50 hover:text-black"
          >
            Edit image<FcEditImage className="text-3xl"/>
          </label>
        </div>
      )}
      {!loading && photo && (
        <div className="flex justify-end w-full">
          <button onClick={handleClick} className="mt-2 text-white text-xs py-1 px-2 rounded-lg bg-[#4caf4f] hover:bg-[#3ea442]">Upload image</button>
        </div>
      )}
    </div>
  );
}