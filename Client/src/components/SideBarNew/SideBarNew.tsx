import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { Account } from "components/layout/header/account";

/* eslint-disable */
export interface IHomePageProps {}

function SideBarNew(props: IHomePageProps): JSX.Element {
  const auth = getAuth();
  const signOutWithoutAuth = async () => {
    await signOut(auth);
  };

  const [open, setOpen] = useState(false);
  const Menus = [
    { id: 3, title: "Graficos ", src: "Calendar", to: "/Home" },
    { id: 4, title: "Transactions", src: "User", to: "/transactions" },
    { id: 5, title: "Dispositivos", src: "Search", to: "/panelUsuarioFinal" },
    { id: 6, title: "Red", src: "Chart", to: "/Red" },
    { id: 7, title: "Info ", src: "Folder", gap: true, to: "/superUser" },
    { id: 8, title: "Setting", src: "Setting", to: "/settings" },
    { title: "Notificaciones", src: "Chat", to: "/notificaciones" },
  ];


  return (
    <div className="bg-white text-white">
      <div
        className={` ${
          open ? "w-72" : "w-20 "
        } bg-[#181745] text-white h-screen p-5  pt-8 relative duration-300`}
      >
        <button
          type="button"
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
    border-2 rounded-full ${!open && "rotate-180"}`}
          onClick={() => setOpen((prevOpen) => !prevOpen)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setOpen((prevOpen) => !prevOpen);
            }
          }}
          tabIndex={0}
        >
          <img src="/control.png" alt="Toggle Sidebar" />
        </button>
        <div className="flex gap-x-4 items-center">
          <img
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Logo"
            className={`h-10 rounded-full cursor-pointer duration-500 ${
              open && "rotate-[360deg] h-16"
            }`}
          />

          <div
            className={`text-white origin-left font-medium text-xl duration-200 ${
              !open && "scale-0"
            }`}
          />

          {open && (
            <Link to="/">
            <button type="button" onClick={signOutWithoutAuth} className="text-slate-400 hover:text-white">
              Cerrar sesión
            </button>
            </Link>
          )}
        </div>
        <ul className="pt-6">
          {Menus.map((Menu) => (
            <Link to={Menu.to}>
              <li
                key={Menu.id}
                className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-slate-400 hover:text-white text-sm items-center gap-x-4 
      ${Menu.gap ? "mt-9" : "mt-2"} ${Menu.id === 0 && "bg-light-white"} `}
              >
                <img src={`/${Menu.src}.png`} alt="logotwo" />
                <span
                  className={`${!open && "hidden"} origin-left duration-200`}
                >
                  {Menu.title}
                </span>
              </li>
            </Link>
          ))}
         <Account/>
        </ul>
      </div>
    </div>
  );
}

export { SideBarNew };
