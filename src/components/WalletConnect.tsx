import { useState } from "react";
import { ethers } from "ethers";

const WalletConnect = ({ onWalletConnected }: { onWalletConnected: (addr: string) => void }) => {
  const [account, setAccount] = useState("");

  const connectWallet = async () => {
    if ((window as any).ethereum) {
      const provider = new ethers.BrowserProvider((window as any).ethereum);   // ethers v6
      await provider.send("eth_requestAccounts", []);
      const signer   = await provider.getSigner();
      const address  = await signer.getAddress();
      setAccount(address);
      onWalletConnected(address);          // tell parent component
    } else {
      alert("Please install MetaMask");
    }
  };

  return (
    <button onClick={connectWallet}>
      {account ? "Wallet Connected" : "Connect Wallet"}
    </button>
  );
};

export default WalletConnect;
