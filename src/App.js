import Web3 from "web3";
import Moralis from "./moralis";
import WalletConnectWeb3ConnectorV2 from './WalletConnect';

const onBtnLogin = async () => {

  await Moralis.enableWeb3({ connector: WalletConnectWeb3ConnectorV2 });
  await Moralis.start({
    appId: "HhJtTqzu8ZZmrChihL0g5vRzgp5LyzswXIJ27qrj",
    serverUrl: "https://nrnhzxloybjl.usemoralis.com:2053/server",
  });
  const web3 = new Web3(Moralis.provider);
  const accounts = await web3.eth.getAccounts();
  console.log(Moralis.provider, accounts)
  const temp = await Moralis.authenticate({
    connector: WalletConnectWeb3ConnectorV2
  });
  console.log("Auth complete for user", temp)
};

function App() {
  return (
    <div className="App">
      <button onClick={onBtnLogin}>Connect</button>
    </div>
  );
}

export default App;
