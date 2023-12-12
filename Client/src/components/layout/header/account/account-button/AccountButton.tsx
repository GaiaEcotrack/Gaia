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
    <button type='button' className='w-32 mt-5 ml-2 gap-x-3 h-14 flex flex-row justify-start items-center rounded-full' onClick={onClick}>
      <Identicon value={address} className={buttonStyles.icon} theme="polkadot" size={30} />
      {name}
    </button>
  );
}

export { AccountButton };
