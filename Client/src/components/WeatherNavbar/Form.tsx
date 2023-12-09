/* eslint-disable */
import { TiWeatherPartlySunny } from "react-icons/ti"; 
import { useState } from "react"

interface FormProps {
    newLocation: any;
  }

function Form ({newLocation}: FormProps){
    const [city, setCity] = useState('')

const onSubmit = (e:any) => {
    e.preventDefault()
    console.log({city})
    // alert('holas')
    if(city === '' || !city) return;

    newLocation(city);
}
  return (
    <div className="flex justify-center mb-2">
        <form onSubmit={onSubmit} action="">
           <div className="flex flex-col justify-center mx-auto mb-4 m-2">

            <div className="flex justify-center items-center text-lg mb-4">
              <TiWeatherPartlySunny className="text-[50px] mr-4 "/>
              <h1>Weather Prediction</h1>
            </div>

            <div className="flex flex-row">
              <input  className="w-full text-black rounded-lg pl-4" type="text" placeholder="City" onChange={(e) =>setCity(e.target.value)} />
              <button className="text-blackpy-2 px-4 ml-1 h-10 rounded-lg w-1/2 bg-[#1d335b] hover:bg-[#2d497c]" type="submit" >Search</button>
            </div>

           </div>
        </form>
    </div>
  )
}

export {Form}