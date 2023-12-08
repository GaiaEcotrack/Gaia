import { useState } from 'react';
import { useAccount } from '@gear-js/react-hooks';
import { TbWalletOff } from "react-icons/tb";

import { AccountsModal } from './accounts-modal';
// import
import { Wallet } from './wallet';

function AccountIcon() {
  const { account, accounts } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {account ? (
        <Wallet balance={account.balance} address={account.address} name="" onClick={openModal} />
      ) : (
        <button type="button" onClick={openModal} aria-label="Abrir modal"><TbWalletOff className='w-8 h-8' /></button>
      )}
      {isModalOpen && <AccountsModal accounts={accounts} close={closeModal} />}
    </>
  );
}

export { AccountIcon };
