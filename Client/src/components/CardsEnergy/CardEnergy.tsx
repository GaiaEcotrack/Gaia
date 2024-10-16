
const CardEnergy = ({supply ,reward}:any) => {

  





  return (
    <div>
      <div className="relative grid h-[35rem] sm:h-[50rem] w-full max-w-[28rem] flex-col items-end justify-center overflow-hidden rounded-xl bg-white bg-clip-border text-center text-gray-700">
        <div className="absolute inset-0 m-0 h-full w-full overflow-hidden rounded-none bg-transparent bg-[url('/fondo.jpg')] bg-cover bg-clip-border bg-center text-gray-700 shadow-none">
          <div className="absolute inset-0 w-full h-full to-bg-black-10 bg-gradient-to-t from-black/80 via-black/50"></div>
        </div>
        <div className="relative flex items-center justify-center flex-col gap-10  md:px-12">
          <h2 className="mb-6 block font-sans text-4xl font-medium leading-[1.5] tracking-normal text-white antialiased">
          Renewable energy a push towards a sustainable future
          </h2>
          <h5 className="block mb-4 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-white">
          Total tokens
          </h5>
          <h5 className="block mb-4 font-sans text-3xl antialiased font-semibold leading-snug tracking-normal text-white">
          {supply} Gaia's
          </h5>
          <img
            alt="Logo"
            src="/LogoGaia.svg"
            className="relative inline-block h-[74px] w-[74px] !rounded-full border-2 border-white object-cover object-center"
          />
           <button onClick={reward} className="block mb-4 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-white">Reward</button>
        </div>
      </div>
    </div>
  );
};

export default CardEnergy;
