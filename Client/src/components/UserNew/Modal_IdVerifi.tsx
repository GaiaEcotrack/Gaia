interface MoodalConfig {
  showIdVerifi: boolean;
  setShowIdVerifi(showIdVerifi: boolean): void;
}

function ModalIdVerifi(props:MoodalConfig) {
  const { showIdVerifi, setShowIdVerifi } = props;
    return showIdVerifi ? (
      <div className="bg-[#0000003d] fixed top-0 left-0 h-full w-full flex justify-center items-center">
        
        <div className="flex flex-col justify-start items-center bg-white h-[100%] md:h-full w-full md:w-[60%] p-4 md:p-6 mt-40 md:mt-0">
          
          <div className="text-[#000000] text-2xl flex justify-end w-full">
            <button
            type="button"
            onClick={() => {setShowIdVerifi(false)}}            
            >
            Cerrar
            </button>          
          </div>
        
          <h1 className="text-[#000000] text-xl md:text-2xl md:mb-6">
            Identity Verification
          </h1>

          
        </div>
      </div>
    ) : null
  } 

  export { ModalIdVerifi };