import { MintGaia } from "../../pages/home/MintGaia";

interface MoodalMint {
  modalMint: boolean;
  setModalMint(modalMint: boolean): void;
}

interface MintGaiaProps {
  excedenteCapturado: number | null;
  setTotalGenerado: React.Dispatch<React.SetStateAction<number>>;
  setTotalConsumido: React.Dispatch<React.SetStateAction<number>>;
}

interface ModalMintGaiaProps extends MoodalMint, MintGaiaProps {}

function ModalMintGaia(props: ModalMintGaiaProps) {

  const {
    modalMint,
    setModalMint,
    excedenteCapturado,
    setTotalGenerado,
    setTotalConsumido,
  } = props;

  const exdenteKWh = (excedenteCapturado ?? 0) / 10; 

  return modalMint ? (
    <div className="bg-[#0000003d] fixed top-0 left-0 h-full w-full flex justify-center items-center">
      <div className="flex flex-col justify-center items-center bg-slate-50 h-[30%] md:h-[40%] w-[95%] md:w-[50%] p-4 md:p-6 mt-40 md:mt-0">
        <div className="text-[#000000] text-2xl flex justify-end items-start w-full">
          <button
            type="button"
            onClick={() => {
              setModalMint(false);
            }}
          >
            <svg width="18" viewBox="0 0 30 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.09587 0H1.74672C0.197316 0 -0.585701 1.88261 0.513878 2.98219L10.0602 12.5285C12.7925 15.2608 17.2075 15.2608 19.9398 12.5285L29.4861 2.98219C30.5857 1.88261 29.8027 0 28.2533 0H25.9042C24.5214 0 23.1885 0.54979 22.2056 1.53275L16.2412 7.49713C15.5581 8.1802 14.4585 8.1802 13.7755 7.49713L7.81109 1.53275C6.81147 0.54979 5.47868 0 4.09587 0Z" fill="#A7A4B2"/>
              <path d="M4.09587 33.268H1.74672C0.197316 33.268 -0.585701 31.3856 0.513878 30.286L10.0602 20.7396C12.7925 18.0074 17.2075 18.0074 19.9398 20.7396L29.4861 30.286C30.5857 31.3856 29.8027 33.268 28.2533 33.268H25.9042C24.5214 33.268 23.1885 32.7182 22.2056 31.7353L16.2412 25.7709C15.5581 25.0878 14.4585 25.0878 13.7755 25.7709L7.81109 31.7353C6.81147 32.7182 5.47868 33.268 4.09587 33.268Z" fill="#A7A4B2"/>
            </svg>
          </button>
        </div>

        <div className="text-[#000000] text-xl flex justify-center items-center h-[50%] w-[100%] md:text-2xl">
          <h1 className="flex justify-center items-center">
            {exdenteKWh} kWh excedentes equivalen a {excedenteCapturado} Token
          </h1>
        </div>

        <div className="h-[40%]">
          <MintGaia
            excedenteCapturado={excedenteCapturado}
            setTotalGenerado={setTotalGenerado}
            setTotalConsumido={setTotalConsumido}
          />
        </div>
      </div>
    </div>
  ) : null;
}

export { ModalMintGaia };
