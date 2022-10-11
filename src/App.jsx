import { useEffect, useState } from "react";
import { ethers, BigNumber } from "ethers";
import contactContract from "./contactContract.json";
import "./App.css";

function App() {
  const [account, setAccount] = useState(0);
  const [isConnected, setIsconnected] = useState(false);
  const [balance, setBalance] = useState();
  const [name, setName] = useState();
  const [contact, setContact] = useState();
  const [hash, setHash] = useState(null);
  const [number, setNumber] = useState();
  const address = "0x40398617709fB1b11E855f07C515595B362dE206";

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    address,
    contactContract.output.abi,
    signer
  );

  const connectAccount = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);
      setIsconnected(true);
    } else {
      alert("Download Metamask or any wallet you wish");
    }
  };

  const getConnectedAccount = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsconnected(true);
      } else {
        setIsconnected(false);
      }
    } else {
      alert("Download Metamask or any wallet you wish");
    }
  };

  const getBal = async () => {
    const res = await contract.balanceOf(account);
    setBalance(Intl.NumberFormat().format(res.toString()));
  };

  const saveContact = async (e) => {
    e.preventDefault();
    const res = await contract.addToStore(name, contact);
    setHash(res.hash);
  };

  const transferToken = async () => {
    const transferTo = prompt("Enter address you wish to transfer to: ");
    const amount = prompt("Enter amount: ");

    const conf = confirm("Do you wish to continue transfer?");

    if (conf) {
      const res = await contract.transfer(transferTo, amount);
      setHash(res.hash);
    }
  };

  const getContact = async (e) => {
    e.preventDefault()

    const res = await contract.store(account, name);
    setNumber(res.number.toString());
  }

  useEffect(() => {
    getConnectedAccount();
  }, []);
  return (
    <>
      <div className="App">
        <h1>Save your contacts to contract</h1>

        {isConnected ? (
          <div>
            <button onClick={getBal}>Get balance</button> &nbsp;
            <button onClick={transferToken}>Send CTT</button>
            { balance ? <p>Balance: {balance}</p> : null }

            <br /> 

            <form onSubmit={saveContact}>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter contact name"
                onChange={(e) => setName(e.target.value)}
              /> <br />
              <input
                type="number"
                name="contact"
                id="contact"
                placeholder="Enter phone number"
                onChange={(e) => setContact(e.target.value)}
              /> <br />

              <button type="submit">Save Contact</button>

              {hash ? (
                <p>
                  Track your transaction:{" "}
                  <a
                    href={`https://goerli.etherscan.io/tx/${hash}`}
                    target="_blank"
                  >
                    {hash}
                  </a>
                </p>
              ) : null}
            </form>

            <hr />

            <h2>Retrieve number</h2>

            <form onSubmit={getContact}>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter contact name"
                onChange={(e) => setName(e.target.value)}
              /> <br />

              <button type="submit">Show Contact</button>
            </form>

            { number ? (
              <p>The number associated with { name } is <b>{ number }</b></p>
            ) : null}
          </div>
        ) : (
          <button onClick={connectAccount}>Connect Wallet</button>
        )}
      </div>
    </>
  );
}

export default App;
