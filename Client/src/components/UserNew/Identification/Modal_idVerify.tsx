interface MoodalId {
  showIdVerify: boolean;
  setShowIdVerify(showIdVerify: boolean): void;
}

function ModalIdVerify(props:MoodalId) {
  const { showIdVerify, setShowIdVerify } = props;
    return showIdVerify ? (
      <div className="bg-[#0000003d] backdrop-blur-sm fixed top-0 left-0 h-full w-full flex justify-center items-center">
        
        <div className="flex flex-col justify-start items-center bg-white h-[100%] md:h-full w-full md:w-[60%] p-4 md:p-6 mt-40 md:mt-0">
          
          <div className="text-[#000000] text-2xl flex justify-end w-full">
            <button
            type="button"
            onClick={() => {setShowIdVerify(false)}}            
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

  export { ModalIdVerify };


