
function Record  () {


interface Transaccion {
  From: string;
  usuario: string;
  cantidad: any;
  tipo: string;
  total: any;
}


const dataLocal: Transaccion[] = JSON.parse(localStorage.getItem('transacciones') || '[]');



  return (
    <div className="flex items-center justify-center">
    <div className="bg-white w-[90%] sm:w-4/5 h-full overflow-x-auto whitespace-no-wrap border p-4 rounded-md mt-5 flex flex-col items-center gap-5 p-2.5">
      {dataLocal.map((e) => (
        <div
          className="bg-secondary inline-block rounded-md text-white flex items-center justify-around w-full h-16 p-2.5"
        >
          <h1>{e.From}</h1>
          <h1 className='text-green-500'>Exitosa</h1>
          <h1>{e.tipo}</h1>
          <h1 className=''>{e.usuario}</h1>
          <div className='flex items-center flex-col'>
          <h1>{e.cantidad}</h1>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};

export {Record};
