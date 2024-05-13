import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

function FormGaia() {
  const refForm = useRef<HTMLFormElement | null>(null);
  const [membership, setMembership] = useState('');
  const [typeCompany, setTypeCompany] = useState('');
  const [cost, setCost] = useState('');
  const [aspect, setAspect] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const serviceId = import.meta.env.VITE_EJS_SERVICEID
    const templateId = import.meta.env.VITE_EJS_TEMPLATEID
    const apikey = import.meta.env.VITE_EJS_APIKEY

    if (refForm.current) {
      const formData = new FormData(refForm.current);
      formData.append('membership', membership);
      formData.append('typeCompany', typeCompany);
      formData.append('cost', cost);
      formData.append('aspect', aspect);

      emailjs.sendForm(serviceId, templateId, refForm.current, apikey)
        .then((result) => {
          console.log(result.text);
        })
        .catch((error) => {
          console.log(error.text);
        });
    } else {
      console.error("Error: refForm.current is null.");
    }
  }

  const handleMembership = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMembership(event.target.value);
  }
  const handleTypeCompany = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeCompany(event.target.value);
  }
  const handleCost = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCost(event.target.value);
  }
  const handleAspect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAspect(event.target.value);
  }

  return (
    <div className='ml-[20%] mr-[20%] pt-10 pb-32'>

      <button className="flex flex-row justify-center items-center w-full gap-2 mb-16">
        <h1>
          <a 
          href="https://www.gaiaecotrack.com"
          target="_blank"
          rel="noreferrer">
            <img
            src="/LOGOGAIASOLO.png"
            alt=""
            className="h-20 w-20"
          />
          </a>            
        </h1>

        <h1 className='text-5xl mt-auto'>
          <a href="https://www.gaiaecotrack.com"
          target="_blank" rel="noreferrer">GaiaEcotrack.com</a>
        </h1>

      </button>

      <form ref={refForm} action="" onSubmit={handleSubmit} className='flex flex-col gap-6'>

        <fieldset className='flex flex-col'>
          <label htmlFor="">Nombre</label>
          <input className="border-2 rounded-lg p-2 flex text-black border-gray-300 bg-[#ecf0f3] h-8" name='name' type="text" placeholder='' required />
        </fieldset>

        <fieldset className='flex flex-col'>
          <label htmlFor="">Apellido</label>
          <input className="border-2 rounded-lg p-2 flex text-black border-gray-300 bg-[#ecf0f3] h-8" name='lastName' type="text" placeholder='' required />
        </fieldset>

        <fieldset className='flex flex-col'>
          <label htmlFor="">Nombre de la empresa (si aplica) </label>
          <input className="border-2 rounded-lg p-2 flex text-black border-gray-300 bg-[#ecf0f3] h-8" name='company' type="text" placeholder='' required />
        </fieldset>

        <fieldset className='flex flex-col'>
          <label htmlFor="">Cargo de la empresa (si aplica) </label>
          <input className="border-2 rounded-lg p-2 flex text-black border-gray-300 bg-[#ecf0f3] h-8" name='position' type="text" placeholder='' required />
        </fieldset>

        <fieldset className='flex flex-col'>
          <label htmlFor="">Seleccione la opción que más le representa:</label>
          <select name="typeCompany" value={typeCompany} onChange={handleTypeCompany} className='border-2 rounded-lg flex text-black border-gray-300 bg-[#ecf0f3] h-8'>
            <option value="">Selecciona una opción</option>
            <option value="Empresa instaladora de sistemas fotovoltaicos">Empresa instaladora de sistemas fotovoltaicos</option>
            <option value="Autoconsumidor con sistema fotovoltaico residencial">Autoconsumidor con sistema fotovoltaico residencial</option>
            <option value="Autoconsumidor con sistema fotovoltaico comercial/industrial">Autoconsumidor con sistema fotovoltaico comercial/industrial</option>
            <option value="Otro">Otro</option>
          </select>
        </fieldset>

        <fieldset className='flex flex-col'>
          <label htmlFor="">¿Estaría dispuesto a pagar una licencia anual para utilizar la plataforma Gaia EcoTrack? sabiendo que obtendrá beneficios económicos solo por producir su energía limpia?</label>
          <select name="membership" value={membership} onChange={handleMembership} className='border-2 rounded-lg flex text-black border-gray-300 bg-[#ecf0f3] h-8'>
            <option value="">Selecciona una opción</option>
            <option value="Si">Si</option>
            <option value="No">No</option>
          </select>
        </fieldset>

        <fieldset className='flex flex-col'>
          <label htmlFor="">¿Si su respuesta fue Sí, ¿qué rango de precio anual consideraría razonable?</label>
          <select name="cost" value={cost} onChange={handleCost} className='border-2 rounded-lg flex text-black border-gray-300 bg-[#ecf0f3] h-8'>
            <option value="">Selecciona una opción</option>
            <option value="Hasta $60 (USD)">Hasta $60 (USD)</option>
            <option value="$100">$100</option>
            <option value="$200">$200</option>
            <option value="$500">$500</option>
            <option value="Mas de $500">Mas de $500</option>
          </select>
        </fieldset>

        <fieldset className='flex flex-col'>
          <label htmlFor="">¿Qué aspecto de Gaia EcoTrack le parece más atractivo?</label>
          <select name="aspect" value={aspect} onChange={handleAspect} className='border-2 rounded-lg flex text-black border-gray-300 bg-[#ecf0f3] h-8'>
            <option value="">Selecciona una opción</option>
            <option value="Monetización de excedentes de energía renovable">Monetización de excedentes de energía renovable</option>
            <option value="Uso de tecnología blockchain">Uso de tecnología blockchain</option>
            <option value="Herramientas de monitoreo y análisis de rendimiento">Herramientas de monitoreo y análisis de rendimiento</option>
            <option value="Solución integral de generación distribuida">Solución integral de generación distribuida</option>
            <option value="Incentivos/tokenizacion de la energía producida">Incentivos/tokenizacion de la energía producida</option>
          </select>
        </fieldset>

        <fieldset className='flex flex-col'>
          <label htmlFor="">Email</label>
          <input className="border-2 rounded-lg p-2 flex text-black border-gray-300 bg-[#ecf0f3] h-8" name='email' type="text" placeholder='' required />
        </fieldset>

        <fieldset className='flex flex-col'>
          <label htmlFor="">Mensaje</label>
          <textarea className='text-black border-2 rounded-lg p-2 flex border-gray-300 bg-[#ecf0f3]' name='message' placeholder='' maxLength={500} rows={5}  required />
        </fieldset>

        <button className="mt-4 inline-block rounded w-full bg-[#4574c1] px-6 pb-2 pt-2.5 text-sm font-semibold uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]" type="submit">Enviar</button>
      </form>
    </div>
  )
}

export default FormGaia;