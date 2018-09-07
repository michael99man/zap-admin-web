import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from 'web3';
import { createStore, applyMiddleware } from 'redux';
import { loadAccount, loadProvider, loadSubscriber } from './utils';
import { providerUrl } from './config';
import { render } from 'react-dom';
import App from './app/App';
import * as React from 'react';
import thunk from 'redux-thunk';
import { appReducer } from './reducers';
import { setAddress, updateProviderTitle, setWeb3 } from './actions/data-actions';
import { ViewsEnum } from './views.enum';
import { handleMenuAction } from './actions/menu-actions';

const store = createStore(appReducer, applyMiddleware(thunk));
const dispatch = store.dispatch as any;

const mnemonic = 'silver traffic ready ocean horror shaft foil miss code ribbon liberty glove';

const web3: any = new Web3(new HDWalletProvider(mnemonic, providerUrl));

async function main() {
  const address = await loadAccount(web3);
  dispatch(setWeb3(web3));
  dispatch(setAddress(address));
  dispatch(handleMenuAction(ViewsEnum.MAIN));
  const provider = await loadProvider(web3, address);
  provider.getTitle().then(title => { dispatch(updateProviderTitle(title)); });
}

const appRef = document.getElementById('app');
store.subscribe(() => {
  // console.log('InputAutocomplete', InputAutocomplete);
  render(React.createElement(App, {state: store.getState(), dispatch}, null), appRef);
  // render(React.createElement(InputAutocomplete, {state: store.getState(), dispatch}, null), appRef);
});

main();

