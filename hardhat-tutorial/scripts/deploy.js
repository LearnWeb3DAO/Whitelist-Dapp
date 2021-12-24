// Import ethers from Hardhat package
const { ethers } = require("hardhat");

async function main() {
  /*
    A Signer in ethers.js is an object that represents an Ethereum account. It is 
    used to send transactions to contracts and other accounts. Here we are getting a list of accounts 
    in the node we're connected to and only keeping the first one.
 */
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account", deployer.address);

  // here we are trying to get the balance of the address who would deploy the contract
  const accountBalance = await deployer.getBalance();
  const accountBalanceString = accountBalance.toString();

  console.log("Account balance:", accountBalanceString);

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
