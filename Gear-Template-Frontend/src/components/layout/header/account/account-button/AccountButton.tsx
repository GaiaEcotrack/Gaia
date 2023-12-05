import Identicon from '@polkadot/react-identicon';
import { buttonStyles } from '@gear-js/ui';
import "./style.css";

type Props = {
  address: string;
  name: string | undefined;
  onClick: () => void;
};

function AccountButton({ address,name, onClick }: Props) {
  

  return (
    <button type='button' className='w-16 mt-5 h-14 bg-[#181745] flex flex-col justify-center items-center rounded-full' onClick={onClick}>
      <Identicon value={address} className={buttonStyles.icon} theme="polkadot" size={28} />
      {name}
    </button>
  );
}

export { AccountButton };
