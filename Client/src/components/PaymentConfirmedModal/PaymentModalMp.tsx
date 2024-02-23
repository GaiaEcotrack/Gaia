import {useEffect , useState} from 'react';
import { Link} from 'react-router-dom';
import axios from 'axios';


const PaymentModalMp = () => {
    const [status, setStatus] = useState("")
    const [mensagge, setMensagge] = useState("")
    const idUser =localStorage.getItem('idUserRedux');

    
    useEffect(() => {
        // Obtener la URL actual
        const currentUrl = window.location.href;
        console.log(currentUrl);

               // Verificar si la URL contiene una palabra específica
            if (currentUrl.includes('approved&payment_id')) {
                setStatus("Aproved")
                setMensagge('Your payment was confirmed, thank you for your purchase 😎')
                axios.put(`http://127.0.0.1:5000/users/${idUser}`, {
                    membresia: true
                  })
                // Hacer algo si la palabra está presente en la URL
            } else {
                // Hacer algo si la palabra no está presente en la URL
                setStatus('failed')
                setMensagge('There was a problem with your payment, please try again later😢')
            }
        
        // Guardar la URL en el localStorage
        localStorage.setItem('paymentUrl', currentUrl);
      }, [idUser]);
    
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <img
        className='w-full h-full'
        src="/payment.jpg"
        alt="Payment"
      />
      <div className='fixed flex flex-col items-center justify-center'>
      <h1 className='text-7xl text-center ' style={{ textShadow: '0 0 2px black' }}>{mensagge}</h1>
      <Link className='w-[150px] bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-[#009b49] before:to-[rgb(105,184,141)] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0 text-[#fff]' to="/home">Back To Home</Link>
      </div>
    </div>
  );
};

export default PaymentModalMp;
