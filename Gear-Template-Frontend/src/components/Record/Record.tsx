
import Db from './Db.json'

const Record = () => {
const data = Db

const getTextColor = (estadoPago: string) => {
  switch (estadoPago) {
    case 'Exitosa':
      return 'text-green-500'; // Puedes cambiar el color verde según tu preferencia
    case 'rechazado':
      return 'text-red-500'; // Puedes cambiar el color rojo según tu preferencia
    case 'pendiente':
      return 'text-yellow-500'; // Puedes cambiar el color amarillo según tu preferencia
    default:
      return 'text-gray-500'; // Puedes establecer un color predeterminado para casos no cubiertos
  }
};

  return (
    <div className="flex items-center justify-center">
    <div className="bg-white w-4/5 h-full rounded-md mt-5 flex flex-col items-center gap-5 p-2.5">
      {data.registros.map((e, index) => (
        <div
          key={index}
          className="bg-secondary rounded-md text-white flex items-center justify-around w-full h-16 p-2.5"
        >
          <h1>{e.nombre}</h1>
          <h1 className={getTextColor(e.estado_pago)}>{e.estado_pago}</h1>
          <h1>{e.tipo_transaccion}</h1>
          <h1>{e.cantidad_kw}Kw</h1>
          <div className='flex items-center flex-col'>
          <h1>${e.total}</h1>
          <div className='flex gap-5'>
            <h2>26 de noviembre</h2>
            <h2>13:52 pm</h2>
          </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};

export default Record;
