import { useState } from "react";

export function NotificacionesConfig() {
  const [buttonStates, setButtonStates] = useState([true, true, true, true]);

  const handleClick = (index: number) => {
    const newButtonStates = [...buttonStates];
    newButtonStates[index] = !newButtonStates[index];
    setButtonStates(newButtonStates);
  };
  return (
    <div>
      <div className="flex items-center justify-center h-screen ">
        <div className="bg-gray-300 w-96 h-96 flex items-center justify-center rounded-lg ">
          <div className="w-48 bg-white text-gray-600 h-32 mt-[-33vh] ml-[-10vh] rounded-md flex">
            <p className="ml-4 mt-2">nombre:</p>
            <p className="mt-3 ml-10 text-xs">mr Jackson</p>
            <p className="mt-9 ml-[-26.5vh]">correo: </p>
            <p style={{ fontSize: "11px" }} className="text-xs mt-10">
              mrJackson@gmail.com
            </p>
            <p className="mt-16 ml-[-27vh]">Edad:</p>
            <p className="mt-16 ml-16">21 años</p>
            <p className="mt-24 ml-[-26vh]">Telefono: </p>
            <p style={{ fontSize: "11px" }} className="mt-[16.4vh] ml-10">
              2975367833
            </p>
            <p
              style={{ fontSize: "10px" }}
              className="text-black mt-[23vh] ml-[-15vh]"
            >
              Cambiar contraseña
            </p>
          </div>
          <img
            className="rounded-full h-28 mt-[-40vh] ml-[-55vh] "
            src="data:image/jpeg;base64,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"
            alt=""
          />
          <svg
            className="mt-[-25vh] ml-[-6vh] h-8"
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
        <div className="bg-white w-[57vh] ml-[-60vh] h-40 mt-36 rounded-lg flex items-center justify-center">
          <p
            style={{
              fontSize: "9px",
              backgroundColor: "re",
              marginLeft: "10px",
            }}
            className="mt-[-10px] ml-[1px] m-20 text-gray-600"
          >
            Recibir notificaciones por transaccion
          </p>
          <p
            style={{ fontSize: "9px" }}
            className="mt-[9vh] ml-[-35vh] m-20  text-gray-600"
          >
            Recibir notificaciones sobre actualizaciones de la cuenta
          </p>
          <p
            style={{ fontSize: "9px" }}
            className="mt-[20vh] ml-[-46vh] m-20 text-gray-600"
          >
            Recibir notificaciones sobre noticias{" "}
          </p>
          <p
            style={{ fontSize: "9px" }}
            className="mt-[30vh] ml-[-34vh] m-20 text-gray-600"
          >
            Recibir alertas cuando lo producción de energia sea optima
          </p>

          <div className="flex  h-[20vh] w-[8vh] items-center justify-center">
            <div className="ml-[-20px]">
              <div
                style={{ marginLeft: "20px" }}
                className="bg-blue-500 w-10 ml-[-6vh] h-5 rounded-lg mt-[-4vh]"
              >
                <button
                  aria-label="x"
                  type="button"
                  style={{
                    backgroundColor: "white",
                    marginLeft: buttonStates[0] ? "0" : "20px",
                  }}
                  onClick={() => handleClick(0)}
                  className="bg-white w-4 h-4 rounded-full"
                />
              </div>
            </div>

            <div className="ml-[-10px]">
              <div className="bg-blue-500 w-10 h-5 rounded-lg ml-[-5vh] mt-[6vh]">
                <button
                  aria-label="x"
                  type="button"
                  style={{
                    backgroundColor: "white",
                    marginLeft: buttonStates[1] ? "0" : "20px",
                  }}
                  onClick={() => handleClick(1)}
                  className="bg-white w-4 h-4 rounded-full"
                />
              </div>
            </div>

            <div className="mt-[-16vh] ml-[10px]">
              <div className="bg-blue-500 w-10 h-5 rounded-lg ml-[-8vh] ">
                <button
                  aria-label="x"
                  type="button"
                  style={{
                    backgroundColor: "white",
                    marginLeft: buttonStates[2] ? "0" : "20px",
                  }}
                  onClick={() => handleClick(2)}
                  className="bg-white w-4 h-4 rounded-full"
                />
              </div>
            </div>

            <div className="mt-[2vh] ml-[-10px]">
              <div className="bg-blue-500 w-10 h-5 rounded-lg ml-[-6.5vh] mt-[16vh]">
                <button
                  aria-label="x"
                  type="button"
                  style={{
                    backgroundColor: "white",
                    marginLeft: buttonStates[3] ? "0" : "20px",
                  }}
                  onClick={() => handleClick(3)}
                  className="bg-white w-4 h-4 rounded-full"
                />
                <p style={{ fontSize: "10px" }} className="text-black mt-4 ">
                  Eliminar cuenta
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
