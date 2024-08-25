import { TbWallet } from "react-icons/tb"; 
import { Wallet } from './wallet';
import { AccountsModal } from './accounts-modal';
import { useApi, useAccount, useBalance, useBalanceFormat } from '@gear-js/react-hooks';
import { useState } from 'react';
// import { TbWalletOff } from "react-icons/tb";

export function AccountInfo() {
  const { isApiReady } = useApi();
  const { account, accounts } = useAccount();
  const { balance } = useBalance(account?.address);
  const { getFormattedBalance } = useBalanceFormat();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formattedBalance = isApiReady && balance ? getFormattedBalance(balance) : undefined;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  return (
    <>
      {account ? (
        <Wallet balance={formattedBalance} address={account.address} name={account.meta.name} onClick={openModal} />
      ) : (
        // <TbWalletOff  />
        
        <div className="flex flex-grow flex-no" onClick={openModal}>
          <span><TbWallet size='37px' /></span>
          <span className="cursor-pointer hover:bg-light-white text-slate-400 hover:text-white text-sm items-center ml-3 gap-x-4 mt-2 hidden sm:inline">Connect Wallet</span>
        </div>
      )}
      {isModalOpen && <AccountsModal accounts={accounts} close={closeModal} />}
    </>
  );
}


// return (
  //   <>
  //     <div className={clsx(styles.wrapper, className)}>
  //       {!!account && (
  //         <>
  //           {formattedBalance && (
  //             <VaraBalance value={formattedBalance.value} unit={formattedBalance.unit} className={styles.balance} />
  //           )}

  //           <Button variant="text" className={styles.openWallet} onClick={openWallet}>
  //             {isOpen ? (
  //               <CrossIcon />
  //             ) : (
  //               <>
  //                 <AvaVaraBlack width={24} height={24} />
  //                 <ChevronDown />
  //               </>
  //             )}
  //           </Button>
  //         </>
  //       )}
  //     </div>
  //   </>
  // );