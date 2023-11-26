import SideBar from "../home/SideBar";

function Usuarios() {
  const users = [
    {
      nombre: "Juan Eduardo",
      energia: "Eolica",
      mesual: "7000Kw",
      historico: "70000Kw",
      foto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      red: "1 %",
    },
    {
      nombre: "Maria Gomez",
      energia: "Solar",
      mesual: "8000Kw",
      historico: "80000Kw",
      foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      red: "1 %",
    },
    {
      nombre: "Steve Jackson",
      energia: "Eolica",
      mesual: "7000Kw",
      historico: "70000Kw",
      foto: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      red: "1 %",
    },
    {
      nombre: "Mari Carmen",
      energia: "Eolica",
      mesual: "10000Kw",
      historico: "100000Kw",
      foto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1061&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      red: "1 %",
    },
    {
      nombre: "Pedro Riera",
      energia: "Eolica",
      mesual: "8000Kw",
      historico: "80000Kw",
      foto: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      red: "1 %",
    },
    {
      nombre: "Ronel Palacios",
      energia: "Eolica",
      mesual: "9000Kw",
      historico: "90000Kw",
      foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      red: "1 %",
    },
    {
      nombre: "Franchesca Puentes",
      energia: "Eolica",
      mesual: "6000Kw",
      historico: "60000Kw",
      foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      red: "1 %",
    },
    {
      nombre: "Miguel Rios",
      energia: "Eolica",
      mesual: "9000Kw",
      historico: "90000Kw",
      foto: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      red: "1 %",
    },
    {
      nombre: "Jazmin Orea",
      energia: "Eolica",
      mesual: "7000Kw",
      historico: "70000Kw",
      foto: "https://plus.unsplash.com/premium_photo-1675034377239-a839117fe934?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      red: "1 %",
    },
  ];

  let contador = 0;

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center gap-10 h-96">
        <div className="flex mt-16 text-white ml-39">
          <div className="w-80 h-48 bg-[#74C7ED] rounded-2xl flex flex-col items-center justify-center flex-wrap">
            <div className="w-56 flex items-center justify-center ">
              <img
                className="mt-4 w-24 h-24 object-cover rounded-full  "
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="User"
              />
            </div>
            <h1 className="text-3xl">Steve Jackson</h1>
          </div>

          <div className="w-80 h-48 bg-[#699CD0] rounded-2xl mt-[-40px] mx-1 flex flex-col items-center justify-center flex-wrap">
            <div className="w-58 flex items-center justify-center">
              <img
                className="mt-4 w-24 h-24 object-cover rounded-full "
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
            </div>
            <h1 className="text-3xl">Juan Eduardo</h1>
          </div>

          <div className="w-80 h-48 bg-[#F0B778] rounded-2xl flex flex-col items-center justify-center flex-wrap">
            <div className="w-56 flex items-center justify-center">
              <img
                className="mt-4 w-24 h-24 object-cover rounded-full"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
            </div>
            <h1 className="text-3xl">Maria Gomez </h1>
          </div>
        </div>
      </div>
      <div className="bg-white w-4/6 p-2.5 rounded-md h-full flex items-center flex-col justify-center text-[#696771] ">
        <div className="flex gap-10">
        <p>Nombres </p>
        <p>Energia </p>
        <p>Mensual </p>
        <p>Historico </p>
        <p>%Red </p>
        </div>
        {users.map((user) => (
          <div
            className="p-2.5 text-[#696771] flex m-5 items-center border-b border-[#696771]"
            style={{ width: "590px" }}
          >
            <span className="mr-1">{(contador += 1)}°</span>
            <img
              className="w-8 h-8 object-cover rounded-full"
              src={user.foto}
              alt="User"
            />
            <h1 className="ml-2" style={{ minWidth: "200px" }}>
              {user.nombre}
            </h1>
            <h1 className="ml-[-35px]" style={{ minWidth: "60px" }}>
              {user.energia}
            </h1>
            <h1 className="ml-12" style={{ minWidth: "60px" }}>
              {user.mesual}
            </h1>
            <h1 className="ml-16" style={{ minWidth: "200px" }}>
              {user.historico}
            </h1>
            <h1 className="ml-[-100px]">{user.red}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}

export { Usuarios };
