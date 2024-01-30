function Logo() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      <div>
            <a
              className="flex justify-center items-center m-3"
              href="https://www.gaiaecotrack.com"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/LOGOGAIASOLO.png"
                alt=""
                className="h-28 w-28"
              />
            </a>
            <h1 className="text-black text-4xl font-bold">GAIA ECO-TRACK</h1>
          </div>      
    </div>
  );
}

export default Logo;