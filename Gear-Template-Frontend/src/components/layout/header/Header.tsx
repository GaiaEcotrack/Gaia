
import { Account } from './account';
import styles from './Header.module.scss';

type Props = {
  isAccountVisible: boolean;
};

function Header({ isAccountVisible }: Props) {
  return (
    <header className="text-black flex justify-end items-center bg-white">
      {isAccountVisible && <Account />}
    </header>
  );
}

export { Header };
