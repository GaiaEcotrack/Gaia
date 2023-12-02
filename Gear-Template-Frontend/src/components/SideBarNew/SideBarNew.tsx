import { useState } from "react";
import { Link } from "react-router-dom"; 

function SideBarNew() {
  const [open, setOpen] = useState(false);
  const Menus = [
    { id: 3, title: "Graficos ", src: "Calendar"  , to:"/Home"},
    { id: 4, title: "Transactions", src: "User", to:"/transactions" },
    { id: 5, title: "Dispositivos", src: "Search" , to:"/panelUsuarioFinal" },
    { id: 6, title: "Red", src: "Chart" , to:"/Red" },
    { id: 7, title: "Info ", src: "Folder", gap: true , to:"/superUser" },
    { id: 8, title: "Setting", src: "Setting" , to:"/settings" },
    { title: "Notificaciones", src: "Chat", to:"/notificaciones" },
  ];

  return (
    <div className="bg-white text-black">
      <div
        className={` ${
          open ? "w-72" : "w-20 "
        } bg-white text-black h-screen p-5  pt-8 relative duration-300`}
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
            className={`h-16 rounded-full cursor-pointer duration-500 ${
              open && "rotate-[360deg]"
            }`}
          />
          <h1
            className={`text-white origin-left font-medium text-xl duration-200 ${
              !open && "scale-0"
            }`}
          >
            Designer
          </h1>
        </div>
        <ul className="pt-6">
        {Menus.map((Menu) => (
            <Link to={Menu.to}>
  <li
    key={Menu.id}
    className={`flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-black text-sm items-center gap-x-4 
      ${Menu.gap ? "mt-9" : "mt-2"} ${
        Menu.id === 0 && "bg-light-white"
      } `}
  >
    <img src={`/${Menu.src}.png`} alt="logotwo" />
    <span className={`${!open && "hidden"} origin-left duration-200`}>
      {Menu.title}
    </span>
  </li>
  </Link>
))}
        </ul>
      </div>
    </div>
  );
}
export { SideBarNew };
