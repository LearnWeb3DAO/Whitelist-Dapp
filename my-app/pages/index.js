import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useState } from "react";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../contants";

export default function Home() {
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  // joinedWhitelist keeps track of whether the current metamask address has joined the waitlist or not
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  // loading is set to true when we are waiting for a transaction to get mined
  const [loading, setLoading] = useState(false);
  // numberOfWhitelisted tracks the number of addresses's whitelisted
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  const [web3Modal, setWeb3Modal] = useState(null);

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
    if (web3Modal) {
      connectWallet();
    }
  }, [web3Modal]);

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      setWeb3Modal(
        new Web3Modal({
          network: "rinkeby",
          providerOptions: {},
          disableInjectedProvider: false,
        })
      );
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
