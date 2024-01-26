import Identicon from '@polkadot/react-identicon';
import { buttonStyles } from '@gear-js/ui';

type Props = {
  address: string;
  name: string | undefined;
  onClick: () => void;
  isActive?: boolean;
  block?: boolean;
};

function AccountButton({ address, name, onClick, isActive, block }: Props) {

  return (
    <button type="button" className='flex flex-col items-center justify-center text-white' onClick={onClick}>
      <Identicon value={address} className={buttonStyles.icon} theme="polkadot" size={28} />
      {name}
    </button>
  );
}

export { AccountButton };
