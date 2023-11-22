import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  HStack,
  Heading,
  Image,
} from "@chakra-ui/react";
import { Mint } from "./MintButton";
import { LocalBalanceToken } from "./MyBalanceToken";
import { Burn } from "./Burn";
import { Transfer } from "./Transfer";
import { NameFungibleToken } from "./NameToken";

function Home() {
  return (
    <Center>
      <Card w="300px" h="600px">
        <CardHeader>
          <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png" />
        </CardHeader>
        <CardBody>
          <Center>
            <Heading>
              Token:
              <NameFungibleToken />
            </Heading>
          </Center>
          <Center>
            <LocalBalanceToken />
          </Center>
        </CardBody>
        <CardFooter>
          <Center>
            <HStack>
              <Mint />
              <Burn />
              <Transfer />
            </HStack>
          </Center>
        </CardFooter>
      </Card>
    </Center>
  );
}

export { Home };
