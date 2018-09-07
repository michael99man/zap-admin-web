import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from 'web3';
import { loadAccount, loadProvider } from './utils';
import { providerUrl } from './config';
import { render } from 'react-dom';
import App from './app/App';
import * as React from 'react';
import { ViewsEnum } from './views.enum';

const mnemonic = 'silver traffic ready ocean horror shaft foil miss code ribbon liberty glove';

const web3: any = new Web3(new HDWalletProvider(mnemonic, providerUrl));

async function main() {
  const appRef = document.getElementById('app');
  const address = await loadAccount(web3);
  const provider = await loadProvider(web3, address);
  await provider.getTitle();
  render(React.createElement(App, {defaultProvider: provider, address, web3, defaultView: ViewsEnum.MAIN}, null), appRef);
}

main();

