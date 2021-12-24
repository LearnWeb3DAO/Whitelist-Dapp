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

  }

  ```

- Compile the contract, open up a terminal and execute these commands

  ```bash
     npx hardhat compile
  ```

- Lets deploy the contract to `rinkeby` network. First, create a new file named `deploy.js` under `scripts` folder

- Now we would write some code to deploy the contract in `deploy.js` file.

  ````js

          // Import ethers from Hardhat package
          const { ethers } = require("hardhat");

          async function main() {
          //
          //A Signer in ethers.js is an object that represents an Ethereum account. It is
          //used to send transactions to contracts and other accounts. Here we are getting a list //of accounts
          //in the node we're connected to and only keeping the first one.

          const [deployer] = await ethers.getSigners();

          console.log("Deploying contracts with the account", deployer.address);

          // here we are trying to get the balance of the address who would deploy the contract
          const accountBalance = await deployer.getBalance();
          const accountBalanceString = accountBalance.toString();

          console.log("Account balance:", accountBalanceString);

          /_
          A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
          so whitelistContract here is a factory for instances of our Whitelist contract.
          _/
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
// a new App in its dashboard and select the network as Rinkeby, and replace "KEY" with its key
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
// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL;

// Replace this private key with your Rinkeby account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts

const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: ALCHEMY_API_KEY_URL,
      accounts: [`${RINKEBY_PRIVATE_KEY}`],
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
    npx create-next-app@latest --typescript
```

and press `enter` for all teh questions

- Now to run the app, execute these commands in the terminal

  ```
  cd my-app
  npm run dev
  ```

- Now go to `http://localhost:3000`, your app should be running 🤘
