export function NotificacionesConfig() {
  return (
    <div>
      <div className="flex items-center justify-center md:h-screen h-full ">
        <div className="bg-gradient-to-tr from-[#181745] from-10%  via-[#181745] via-30% to-[#216e93] to-90% text-whitew-[95%] h-[50vh] md:h-[70%] sm:w-2/5 sm:h-2/4 flex flex-col justify-around items-center rounded-lg ">
          <div className="flex items-center gap-2 sm:gap-10">
            <div className="ml-4">
              <img
                className="rounded-full h-28 ml-[-0.5vh] md:ml-0"
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
              <svg
                className="h-8 mt-[-4vh] ml-[-1vh] md:ml-0"
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="41"
                viewBox="0 0 40 41"
                fill="none"
              >
                <path
                  d="M28.3941 0H11.6258C4.34216 0 0 4.34216 0 11.6258V28.3741C0 35.6778 4.34216 40.0199 11.6258 40.0199H28.3741C35.6578 40.0199 39.9999 35.6778 39.9999 28.3942V11.6258C40.0199 4.34216 35.6778 0 28.3941 0ZM17.9089 31.0355C17.3286 31.6158 16.2281 32.176 15.4277 32.2961L10.5052 32.9964C10.3251 33.0165 10.1451 33.0365 9.96497 33.0365C9.14456 33.0365 8.38418 32.7563 7.84391 32.2161C7.18358 31.5557 6.90344 30.5952 7.06352 29.5347L7.76387 24.6123C7.88393 23.7919 8.4242 22.7113 9.0245 22.131L17.9489 13.2066C18.109 13.6268 18.2691 14.047 18.4892 14.5272C18.6893 14.9475 18.9094 15.3877 19.1495 15.7879C19.3496 16.128 19.5698 16.4482 19.7498 16.6883C19.9699 17.0285 20.2301 17.3486 20.3902 17.5287C20.4902 17.6688 20.5702 17.7689 20.6103 17.8089C21.1105 18.4092 21.6908 18.9695 22.1911 19.3897C22.3311 19.5297 22.4112 19.6098 22.4512 19.6298C22.7513 19.8699 23.0515 20.11 23.3116 20.2901C23.6318 20.5302 23.9519 20.7503 24.2921 20.9304C24.6923 21.1706 25.1325 21.3907 25.5727 21.6108C26.033 21.8109 26.4532 21.991 26.8734 22.131L17.9089 31.0355ZM30.7553 18.1891L28.9144 20.05C28.7943 20.1701 28.6343 20.2301 28.4742 20.2301C28.4142 20.2301 28.3341 20.2301 28.2941 20.2101C24.2321 19.0495 20.9905 15.8079 19.8299 11.7459C19.7698 11.5257 19.8299 11.2856 19.99 11.1456L21.8509 9.28463C24.8924 6.24311 27.7938 6.30314 30.7753 9.28463C32.2961 10.8054 33.0365 12.2661 33.0365 13.7869C33.0165 15.2276 32.2761 16.6683 30.7553 18.1891Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className="md:w-52 w-72 lg:w-96 bg-[#1d335b]  text-white h-34 md:h-40  ml-[1vh] md:ml-0  rounded-md flex flex-col justify-center items-center">
              <p className=" ml-[-8vh] md:ml-[-9.7vh]">Nombre: mr Jackson</p>
              <p>Correo: mrJackson@gmail.com</p>
              <p className="ml-[-12.5vh] md:ml-[-15.5vh]">Edad: 21 años</p>
              <p className="ml-[-6.9vh] md:ml-[-8.5vh]">Telefono: 2975367833</p>
              <p>Cambiar contraseña</p>
            </div>
          </div>
          <div className="bg-[#142545] text-xs md:text-base w-[95%] h-[30vh] md:h-4/6  xl:h-2/4 rounded-lg flex justify-center items-center">
            <div className="flex flex-col p-2.5 items-center mt-[1vh] md:mt-0">
              <div className="flex space-y-4 items-center text-white lg:gap-40 2xl:gap-60">
                <p className="ml-[0.2vh] md:ml-0 mt-[-3vh] md:mt-0">Recibir notificaciones por transacciones</p>
                <div>
                  <label className="relative inline-flex  mt-[-2vh] items-center md:ml-0 ml-[27vh] cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="group peer ring-0 bg-rose-400 mt-[0.5vh] rounded-full outline-none duration-300 after:duration-300 md:w-16 lg:w-16 h-10 w-14 shadow-md peer-checked:bg-emerald-500  peer-focus:outline-none  after:content-['✖️']  after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-10 ml:after:w-8 lg:after:w-8 after:top-1 after:left-[0.5vh] after:flex after:justify-center after:items-center peer-checked:after:translate-x-6 peer-checked:after:content-['✔️'] peer-hover:after:scale-95"> </div>
                  </label>
                </div>
              </div>
        
              <div className="flex space-y-4 items-center text-white lg:gap-40 2xl:gap-60">
                <p className="ml-[0.2vh] md:ml-0 w-42">Recibir notificaciones 
sobre actualizaciones de la cuenta</p>
                <div>
                  <label className="relative inline-flex  mt-[-2vh] md:ml-0 ml-8 items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="group peer ring-0 bg-rose-400 mt-[0.5vh] rounded-full outline-none duration-300 after:duration-300 md:w-16 lg:w-16 h-10 w-14 shadow-md peer-checked:bg-emerald-500  peer-focus:outline-none  after:content-['✖️']  after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-10 ml:after:w-8 lg:after:w-8 after:top-1 after:left-[0.5vh] after:flex after:justify-center after:items-center peer-checked:after:translate-x-6 peer-checked:after:content-['✔️'] peer-hover:after:scale-95"> </div>
                  </label>
                </div>
              </div>
              <div className="flex space-y-4 items-center text-white lg:gap-40 2xl:gap-60">
                <p className="ml-[0.3vh] md:ml-0">Recibir notificaciones
                  sobre noticias </p>
                <div>
                  <label className="relative ml-[22vh]  inline-flex  mt-[-2vh] items-center md:ml-6 cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="group peer ring-0 bg-rose-400 mt-[0.5vh] rounded-full outline-none duration-300  after:duration-300 md:w-16 lg:w-16 h-10 w-14 shadow-md peer-checked:bg-emerald-500  peer-focus:outline-none  after:content-['✖️']  after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-10 ml:after:w-8 lg:after:w-8 after:top-1 after:left-[0.5vh] after:flex after:justify-center after:items-center peer-checked:after:translate-x-6 peer-checked:after:content-['✔️'] peer-hover:after:scale-95"> </div>
                  </label>
                </div>
              </div>
              <div className="flex space-y-4 items-center text-white lg:gap-40 2xl:gap-60">
                <div className="ml-[0.4vh] md:ml-0 ">
                  <p>Recibir alertas cuando lo
                    producción de energia sea optima</p>
                </div>
                <div>
                  <label className="relative ml-3 md:ml-0 inline-flex mt-[-2vh] items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="group peer ring-0 bg-rose-400 mt-[0.5vh] rounded-full outline-none duration-300 after:duration-300 md:w-16 lg:w-16 w-14 h-10 shadow-md peer-checked:bg-emerald-500  peer-focus:outline-none  after:content-['✖️']  after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-10 ml:after:w-8 lg:after:w-8 after:top-1 after:left-[0.5vh] after:flex after:justify-center after:items-center peer-checked:after:translate-x-6 peer-checked:after:content-['✔️'] peer-hover:after:scale-95"> </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}