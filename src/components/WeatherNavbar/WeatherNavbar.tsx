

interface WeatherNavbarProps {
    newLocation: any;
  }
  
 function WeatherNavbar() {


  return (
    <nav className=" bg-dark text-ligth mb-5">
       <div className="flex">
           {/* <h3 className="mx-auto text-black">Prediccion del clima</h3> */}
       </div>
       
    </nav>
  )
}

export  {WeatherNavbar}