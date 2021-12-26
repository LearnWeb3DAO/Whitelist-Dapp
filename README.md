# Whitelist-Dapp

You are launching your NFT collection named `Crypto Devs`. You want to give your early supporters access to a whitelist for your collection, so here you are creating an whitelist dapp for `Crypto Devs`

## Requirements

- Whitelist access would be given to the first `10` users who want to get in.
- There should be a website where people can go and enter into the whitelist.

Lets start building 🚀

## Prerequisites

- Write code in JavaScript (Beginner Track - [Level-0](https://github.com/LearnWeb3DAO/Basic-Programming))
- Set up a Metamask (Beginner Track - [Level-4](https://github.com/LearnWeb3DAO/Crypto-Wallets))
- Your computer has Node Js. If not download [here](https://nodejs.org/en/download/)

---

## Build

### Smart Contract

To build the smart contract we would be using [Hardhat](https://hardhat.org/).
Hardhat is an Ethereum development environment and framework designed for full stack development. In simple words you can write your smart contract, deploy them, run tests, and debug your code.

- To setup a Hardhat project, Open up a terminal and execute these commands

  ```bash
  mkdir hardhat-tutorial
  cd hardhat-tutorial
  npm init --yes
  npm install --save-dev hardhat
  ```

  In the same directory where you installed Hardhat run:

  ```bash
  npx hardhat
  ```

  and press `enter` for all the questions.

- Start by creating a new file inside the `contracts` directory called `Whitelist.sol`.

```go
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Whitelist {

    // Max number of whitelisted addresses allowed
    uint8 public maxWhitelistedAddresses;

    // Create a mapping of whitelistedAddresses
    // if an address is whitelisted, we would set it to true, it is false my default for all other addresses.
    mapping(address => bool) public whitelistedAddresses;

    // numAddressesWhitelisted would be used to keep track of how many addresses have been whitelisted
    uint8 private numAddressesWhitelisted;

    constructor(uint8 _maxWhitelistedAddresses) {
        maxWhitelistedAddresses =  _maxWhitelistedAddresses;
    }

    /**
        addAddressToWhitelist - This function adds the address of the sender to the
        whitelist
     */
    function addAddressToWhitelist() public {
        // check if the numAddressesWhitelisted < maxWhitelistedAddresses, if not then throw an error.
        require(numAddressesWhitelisted < maxWhitelistedAddresses, "More addresses cant be added, limit reached");
        // Add the address which called the function to the whitelistedAddress array
        whitelistedAddresses[msg.sender] = true;
        // Increase the number of whitelisted addresses
        numAddressesWhitelisted += 1;
    }

    /**
        removeAddressFromWhitelist - This function removes an address from the whitelist if the address was in the list.
    */

    function removeAddressFromWhitelist() public {
        // Check if the whitelist is empty, if true then throw an error
        require(numAddressesWhitelisted > 0, "Whitelist is empty, address cant be removed");
        // Check if the address sending the transaction is in the whitelist, if not then throw an error
        require(whitelistedAddresses[msg.sender], "Sender is not in the whitelist");
        whitelistedAddresses[msg.sender] = false;
        numAddressesWhitelisted -= 1;
    }

    /**
        getAddressFromWhitelist checks if the address passed is in the Whitelist or not
     */
    function getAddressFromWhitelist(address checkAddress) public view returns (bool) {
        // this returns true if the address is in the whitelist else false
        return  whitelistedAddresses[checkAddress];
    }

}

```

- Compile the contract, open up a terminal and execute these commands

```bash
   npx hardhat compile
```

- Lets deploy the contract to `rinkeby` network. First, create a new file named `deploy.js` under `scripts` folder

- Now we would write some code to deploy the contract in `deploy.js` file.

  ````js
          /*
          A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
          so whitelistContract here is a factory for instances of our Whitelist contract.
          */
          const whitelistContract = await ethers.getContractFactory("Whitelist");

          // here we deploy the contract
          const deployedWhitelistContract = await whitelistContract.deploy(10);

          // print the address of the deployed contract
          console.log("Whitelist Contract Address:", deployedWhitelistContract.address);
          }

          // Call the main function and catch if there is any error
          main()
          .then(() => process.exit(0))
          .catch((error) => {
          console.error(error);
          process.exit(1);
          });

          ```

  ````

- Now create a `.env` file in the `hardhat-tutorial` folder and add the following lines, use the instructions in the comments to get your Alchemy API Key and RINKEBY Private Key. Make sure that the account from which you get your rinkeby private key is funded with Rinkeby Ether.

```

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard and select the network as Rinkeby, and replace "add-the-alchemy-key-url-here" with its key url
ALCHEMY_API_KEY_URL="add-the-alchemy-key-url-here"

// Replace this private key with your RINKEBY account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
RINKEBY_PRIVATE_KEY="add-the-rinkeby-private-key-here"

```

- Now we would install `dotenv` package to be able to import the env file and use it in our config.
  In your terminal, execute these commands.
  ```bash
  npm install dotenv
  ```
- Now open the hardhat.config.js file, we would add the `rinkeby` network here so that we can deploy our contract to rinkeby. Replace all the lines in the `hardhar.config.js` file with the given below lines

```js
require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: ".env" });

const ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL;

const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: ALCHEMY_API_KEY_URL,
      accounts: [RINKEBY_PRIVATE_KEY],
    },
  },
};
```

- To deploy in your terminal type:
  ```bash
      npx hardhat run scripts/deploy.js --network rinkeby
  ```
- Save the Whitelist Contract Address that was printed on your terminal in your notepad, you would need it.

### Website

- To develop the website we would be using [React](https://reactjs.org/) and [Next Js](https://nextjs.org/). React is a javascript framework which is used to make websites and Next Js is built on top of React.

- First, You would need to create a new `next` app. Your folder structure should look something like

```
   - Whitelist-Dapp
       - hardhat-tutorial
       - next-app
```

To create this `next-app`, in the terminal point to Whitelist-Dapp folder and type

```bash
    npx create-next-app@latest
```

and press `enter` for all teh questions

- Now to run the app, execute these commands in the terminal

  ```
  cd my-app
  npm run dev
  ```

- Now go to `http://localhost:3000`, your app should be running 🤘

- Now lets install Web3Modal library(https://github.com/Web3Modal/web3modal). Web3Modal is an easy-to-use library to help developers add support for multiple providers in their apps with a simple customizable configuration. By default Web3Modal Library supports injected providers like (Metamask, Dapper, Gnosis Safe, Frame, Web3 Browsers, etc) and WalletConnect, You can also easily configure the library to support Portis, Fortmatic, Squarelink, Torus, Authereum, D'CENT Wallet and Arkane.
  To install in your terminal which points to my-app execute:

```bash
  npm install --save web3modal
```

- In the same terminal also install `ethers.js`

```bash
npm i ethers
```

- In your public folder, download this file [SVG](https://github.com/LearnWeb3DAO/Whitelist-Dapp/blob/main/my-app/public/crypto-devs.svg) and rename it to `crypto-devs.svg`

- Now go to styles folder and replace all the contents of `Home.modules.css` file with the following code:

```css
.main {
  min-height: 90vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-family: "Courier New", Courier, monospace;
}

.footer {
  display: flex;
  padding: 2rem 0;
  border-top: 1px solid #eaeaea;
  justify-content: center;
  align-items: center;
}

.image {
  width: 70%;
  height: 50%;
  margin-left: 20%;
}

.title {
  font-size: 2rem;
  margin: 2rem 0;
}

.description {
  line-height: 1;
  margin: 2rem 0;
  font-size: 1.2rem;
}

.button {
  border-radius: 4px;
  background-color: blue;
  border: none;
  color: #ffffff;
  font-size: 15px;
  padding: 20px;
  width: 200px;
  cursor: pointer;
  margin-bottom: 2%;
}
@media (max-width: 1000px) {
  .main {
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
```

- Open you index.js file under the pages folder and paste the following code, explanation of the code can be found in the comments

```js
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useState } from "react";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../contants";
let web3Modal;
export default function Home() {
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  // joinedWhitelist keeps track of whether the current metamask address has joined the waitlist or not
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  // loading is set to true when we are waiting for a transaction to get mined
  const [loading, setLoading] = useState(false);
  // numberOfWhitelisted tracks the number of addresses's whitelisted
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);

  /*
    addAddressToWhitelist:  Adds the current connected address to the whitelist
  */
  const addAddressToWhitelist = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      const provider = await web3Modal.connect();
      const _web3Provider = new providers.Web3Provider(provider);
      // get the newtwork from the provider
      const { chainId } = await _web3Provider.getNetwork();
      // check if the chainId is 4, 4 is the chainId for rinkeby. We are only supporting rinkeby right now.
      if (chainId !== 4) {
        // Alert the user if the network is not Rinkeby
        window.alert("Change the network to Rinkeby");
      } else {
        // get a signer for the current connected address
        const signer = _web3Provider.getSigner();
        // Create a new instance of the Contract with a Signer, which allows
        // update methods
        const whitelistContract = new Contract(
          WHITELIST_CONTRACT_ADDRESS,
          abi,
          signer
        );
        // call the addAddressToWhitelist from the contract
        const tx = await whitelistContract.addAddressToWhitelist();
        setLoading(true);
        // wait for the transaction to get mined
        await tx.wait();
        setLoading(false);
        // get the updated number of addresses in the whitelist
        await getNumberOfWhitelisted();
        setJoinedWhitelist(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /*
    getNumberOfWhitelisted:  gets the number of whitelisted addresses
  */
  const getNumberOfWhitelisted = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      const provider = await web3Modal.connect();
      const _web3Provider = new providers.Web3Provider(provider);
      // We connect to the Contract using a Provider, so we will only
      // have read-only access to the Contract
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        _web3Provider
      );
      // call the numAddressesWhitelisted from the contract
      const _numberOfWhitelisted = await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (err) {
      console.error(err);
    }
  };

  /*
    checkIfAddressInWhitelist: Checks if the address is in whitelist
  */
  const checkIfAddressInWhitelist = async (web3Provider) => {
    try {
      // We connect to the Contract using a Provider, so we will only
      // have read-only access to the Contract
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        web3Provider
      );
      // Get the signer and the address associated to the signer which is connected to  MetaMask
      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();
      // call the whitelistedAddresses from the contract
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );
      setJoinedWhitelist(_joinedWhitelist);
    } catch (err) {
      console.error(err);
    }
  };

  /*
    connectWallet: Connects the MetaMask wallet
  */
  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      const provider = await web3Modal.connect();
      setWalletConnected(true);
      const _web3Provider = new providers.Web3Provider(provider);

      const { chainId } = await _web3Provider.getNetwork();
      // check if the chainId is 4, 4 is the chainId for rinkeby. We are only supporting rinkeby right now.
      if (chainId !== 4) {
        window.alert("Change the network to Rinkeby");
      } else {
        checkIfAddressInWhitelist(_web3Provider);
        getNumberOfWhitelisted();
      }
    } catch (err) {
      console.error(err);
    }
  };

  /*
    renderButton: Returns a button based on the state of the dapp
  */
  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>
            Thanks for joining the Waitlist!
          </div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      web3Modal = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {numberOfWhitelisted} have already joined the Waitlist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
      </footer>
    </div>
  );
}
```

- Create a new folder under the my-app folder and name it `constants`.

- In the constants folder create a file, `index.js` and paste the following content. Replace `"addres of your whitelist contract"` with the address of the whitelist contract that you deployed. Replace `---your abi---` with the abi of your Whitelist Contract. To get the abi for your contract. Go to your `hardhat-tutorial/artifacts/contracts/Whitelist.sol` folder and from your `Whitelist.json` file get the array marked under the `"abi"` key

```js
export const abi =---your abi---
export const WHITELIST_CONTRACT_ADDRESS = "addres of your whitelist contract"
```

- Now in your terminal which is pointing to `my-app` folder, execute

```bash
npm run dev
```

Your whitelist dapp should now work without errors 🚀
