// import React from 'react'

export default function TermsAndPolicy() {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="flex flex-col justify-center items-center gap-14">

        <button className="flex flex-row justify-center items-center gap-2 mb-10">
          <h1>
            <a 
            href="https://www.gaiaecotrack.com"
            target="_blank">
              <img
              src="/LOGOGAIASOLO.png"
              alt=""
              className="h-10 w-10"
            />
            </a>            
          </h1>

          <h1>
            <a href="https://www.gaiaecotrack.com"
            target="_blank">GaiaEcotrack.com</a>
          </h1>

        </button>

        <button className="py-3 px-7 w-full rounded-lg bg-[#1d335b] hover:bg-[#213250] hover:scale-110 ease-in duration-200 text-2xl"> 
          <a href="https://www.canva.com/design/DAF6WIHT3nM/o7xY2aFhy7Xr4-Ll-wb6ow/view?utm_content=DAF6WIHT3nM&utm_campaign=designshare&utm_medium=link&utm_source=editor"
          target="_blank"
          >Terms and conditions</a>
        </button>

        <button className="py-3 px-5 w-full rounded-lg bg-[#1d335b] hover:bg-[#1d335b] hover:scale-110 ease-in duration-200 text-2xl">
          <a href="https://www.canva.com/design/DAF6WbOZAkw/HNK0xEuDzRA6nzKVdw4KhA/view?utm_content=DAF6WbOZAkw&utm_campaign=designshare&utm_medium=link&utm_source=editor"
          target="_blank"
          >Privacy policy</a>
        </button>
          
        <button className="py-3 px-5 w-full rounded-lg bg-[#1d335b] hover:bg-[#233169] hover:scale-110 ease-in duration-200 text-2xl">
          <a href="https://www.canva.com/design/DAF6WbcleEU/9muG2t1a9vgopkuYEuqRfQ/view?utm_content=DAF6WbcleEU&utm_campaign=designshare&utm_medium=link&utm_source=editor#1"
          target="_blank"
          >Services</a>
        </button>

      </div>
    </div>
  )
}
