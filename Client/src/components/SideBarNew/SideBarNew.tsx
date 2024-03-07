import { CgMenu } from "react-icons/cg";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { AccountInfo } from "../layout/header/account-info";
import axios from "axios";

/* eslint-disable */
export interface IHomePageProps {}

function SideBarNew(props: IHomePageProps): JSX.Element {

  const URL = import.meta.env.VITE_APP_API_URL
  const auth = getAuth();

  const signOutWithoutAuth = async () => {
    await signOut(auth);
    // localStorage.clear()
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("profilePic");
    localStorage.removeItem('id');
    localStorage.removeItem('completeCredent');
    localStorage.removeItem('pendingDocs');
  };

  const [open, setOpen] = useState(false);
  const Menus = [
    { id: 1, title: "Graphics ", src: "Graphics", to: "/home" },
    { id: 2, title: "Transactions", src: "Transactions", to: "/dashUser" },
    { id: 3, title: "Devices", src: "Devices", to: "/panelUsuarioFinal" },
    { id: 4, title: "Profile", src: "Profile", to: "/userReg" },
    { id: 5, title: "Information", src: "Info", gap: true, to: "/superUser" },
  ];

  const handleMenuClick = () => {
    setOpen(false);
  };

  const [photo, setPhoto] = useState<string | null>(null);
  const [photoDB, setPhotoDB] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    const actualizarFotoDePerfil = async () => {
      if (user) {
        setPhoto(user.photoURL);
        try {
          const userId = localStorage.getItem('id');
          const response = await axios.get(`${URL}/users/${userId}`);
          const userPhoto = response.data.user.photo_profile;
          if (!userPhoto) {
            // Realizar el PUT solo si el valor de photo_profile es null
            await axios.put(`${URL}/users/${userId}`, {
              photo_profile: photo,
            });
          } else {
            // Almacenar el valor de photo_profile en setPhoto si no es null
            setPhotoDB(userPhoto)
          }
        } catch (error) {
          console.error('Error al actualizar la foto:', error);
        }
      }
    };  
    // Retrasar la ejecución después de 6 segundos
    const timeoutId = setTimeout(() => {
      actualizarFotoDePerfil();
    }, 6000);  
    // Limpieza del timeout si el componente se desmonta antes de que se cumplan los 10 segundos
    return () => clearTimeout(timeoutId);
  }, [photo]);

  return (
    <div className="text-white">
      <div
        className={` ${
          open ? "w-56 bg-[#181745]" : "w-20 sm:bg-[#181745]"
        }  text-white h-full sm:h-screen p-4 pl-5 pt-8 relative duration-300`}
      >
        <button
          type="button"
          className={`${
            open
              ? "-right-3 top-[37px]"
              : "right-5 top-5 sm:top-[37px] sm:-right-3"
          } absolute cursor-pointer  w-7 border-dark-purple  rounded-full ${
            !open && "rotate-180"
          }`}
          onClick={() => setOpen((prevOpen) => !prevOpen)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setOpen((prevOpen) => !prevOpen);
            }
          }}
          tabIndex={0}
        >
          {open && window.innerWidth < 640 ? (
            <img src="/control.png" alt="Toggle Sidebar" className="" />
          ) : window.innerWidth >= 640 ? (
            <img src="/control.png" alt="Toggle Sidebar" className="" />
          ) : (
            <CgMenu size={35} />
          )}
        </button>
        <div
          className={`${
            open
              ? "flex flex-row gap-x-8 items-center"
              : "gap-x-4 items-center"
          }`}
        >
          <Link to="/userReg">
            <img
              onClick={handleMenuClick}
              src={
                photo || localStorage.getItem("profilePic") || photoDB || 
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              alt="Profile"
              className={`h-10 rounded-full cursor-pointer duration-500 ${
                open && "rotate-[360deg] h-16"
              } ${!open ? "hidden sm:block" : ""}`}
            />
          </Link>

          {open && (
            <Link to="/">
              <button
                type="button"
                onClick={signOutWithoutAuth}
                className="text-slate-400 hover:text-white whitespace-nowrap"
              >
                Log Out
              </button>
            </Link>
          )}
        </div>
        <ul className={`${!open && "hidden"} pt-6 sm:block`}>
          {Menus.map((Menu) => (
            <Link to={Menu.to} key={Menu.id}>
              <li
                className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-slate-400 hover:text-white text-sm items-center gap-x-4 
                ${Menu.gap ? "mt-2" : "mt-2"} ${
                  Menu.id === 0 && "bg-light-white"
                } `}
                onClick={handleMenuClick}
              >
                <img src={`/${Menu.src}.png`} alt="logotwo" className=" w-8"/> 
                <span
                  className={`${!open && "hidden"} origin-left duration-200`}
                >
                  {Menu.title}
                </span>
              </li>
            </Link>
          ))}
        </ul>
        <div className="mt-5">{open && <AccountInfo />}</div>

        <div className={` ${open ? "sm:block" : "hidden sm:block"} mt-5`}>
          {!open && <AccountInfo />}
        </div>  
      </div>
    </div>
  );
}

export { SideBarNew };
