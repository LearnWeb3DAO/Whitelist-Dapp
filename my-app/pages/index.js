import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useState } from "react";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../contants";
let web3Modal;

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);

  const addAddressToWhitelist = async () => {
    try {
      const provider = await web3Modal.connect();
      const _web3Provider = new providers.Web3Provider(provider);
      const { chainId } = await _web3Provider.getNetwork();
      if (chainId !== 4) {
        window.alert("Change the network to Rinkeby");
      } else {
        const signer = _web3Provider.getSigner();
        const whitelistContract = new Contract(
          WHITELIST_CONTRACT_ADDRESS,
          abi,
          signer
        );
        const tx = await whitelistContract.addAddressToWhitelist();
        setLoading(true);
        await tx.wait();
        setLoading(false);
        await getNumberOfWhitelisted();
        setJoinedWhitelist(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getNumberOfWhitelisted = async () => {
    try {
      const provider = await web3Modal.connect();
      const _web3Provider = new providers.Web3Provider(provider);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        _web3Provider
      );
      const _numberOfWhitelisted = await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (err) {
      console.error(err);
    }
  };

  const checkIfAddressInWhitelist = async (web3Provider) => {
    try {
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        web3Provider
      );
      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );
      setJoinedWhitelist(_joinedWhitelist);
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      setWalletConnected(true);
      const _web3Provider = new providers.Web3Provider(provider);
      const { chainId } = await _web3Provider.getNetwork();
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

// TODO: CHANGE THE README and ADD COMMENTS
// TODO: VERCEL
