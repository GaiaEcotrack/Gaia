import { VarasBalance } from "../../pages/home/VarasBalance"

interface Props {
    image:string,
    quantity:any,
    name:string,
    onClick:any,
    metric:any,
}

function CryptoCardVara ({image,quantity,name,onClick,metric}:Props) {
  return (
    <div>
  <div className="bg-gradient-to-br from-vara to-white  rounded-3xl border shadow-xl p-8 w-80 h-52">
    <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col gap-5">
        <button type="button" className="inline-flex items-center justify-center w-14 h-14 text-blue-100 bg-black/30 rounded-full">
        <img className="w-8 h-8" src={image} alt="" />
      </button>
      <div>
      <h3 className="font-semibold text-lg text-gray-700">{name}</h3>
      <h1 className="font-semibold text-xl text-gray-700">${quantity}</h1>
    </div>
        </div>
      <div className="flex flex-col gap-1 items-center">
        <span className="font-bold text-black">{metric}</span>
        <span className="font-medium text-xl text-gray-700 flex justify-end">Your Balance</span>
        <span className="font-medium text-xs text-gray-500 flex justify-end"><VarasBalance/></span>
        <button type="button" onClick={onClick} className="hover:brightness-110 hover:animate-pulse font-bold py-3 px-6 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 text-white">Send</button>
      </div>
    </div>
  </div>
</div>
  )
}

export {CryptoCardVara}