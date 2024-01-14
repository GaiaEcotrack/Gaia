
import { LocalBalanceToken } from "./MyBalanceToken";
import { NameFungibleToken } from "./NameToken";

function Home() {
  return (
    <div>
    <NameFungibleToken/>
    <LocalBalanceToken/>
    </div>
  );
}

export { Home };
