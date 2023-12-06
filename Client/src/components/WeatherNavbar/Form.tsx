/* eslint-disable */


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
    <div className="flex justify-center">
        <form onSubmit={onSubmit} action="">
           <div className="flex mx-auto mb-3 m-2">
            <input  className="w-full text-black rounded-lg" type="text" placeholder="Ciudad" onChange={(e) =>setCity(e.target.value)} />
            <button className="text-blackpy-2 px-4 h-10 rounded-lg w-1/2 bg-[#74C7ED]" type="submit" >Buscar</button>
           </div>
        </form>
    </div>
  )
}

export {Form}