
import { Account } from './account';
// import styles from './Header.module.scss';

type Props = {
  isAccountVisible: boolean;
};

function Header({ isAccountVisible }: Props) {
  return (
    <header className="text-white hidden justify-end items-center bg-[#181745]">
      {isAccountVisible && <Account />}
    </header>
  );
}

export { Header };
