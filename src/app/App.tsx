import * as React from 'react';
import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from 'web3';
import { networks } from '../config';
import { loadAccount, loadProvider } from '../utils';
import { ViewsEnum } from '../views.enum';
import { Admin } from './Admin';
import './app.css';

interface AppWindow extends Window {
  web3: any;
  ethereum: any;
}

declare const window: AppWindow;

export class App extends React.Component {

  state = {web3: null, address: null, provider: null, loading: false, error: null};

  async handleLogin(e) {
    e.preventDefault();
    this.setState({error: null, loading: true, provider: null, address: null});
    try {
      const web3 = new Web3(new HDWalletProvider(e.target.mnemonic.value, e.target.network.value));
      this.setProvider(web3);
    } catch (e) {
      this.setState({loading: false, error: e.message});
    }
  }

  async handleMetamaskLogin() {
    this.setState({error: null, loading: true, provider: null, address: null});
    try {
      let web3;
      if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
      } else {
        throw new Error('No web3 provider');
      }
      this.setProvider(web3);
    } catch (e) {
      this.setState({loading: false, error: e.message});
    }
  }

  async setProvider(web3) {
    try {
      const address = await loadAccount(web3);
      const provider = await loadProvider(web3, address);
      await provider.getTitle();
      this.setState({web3, address, provider, loading: false});
    } catch (e) {
      this.setState({loading: false, error: e.message});
    }
  }

  render() {
    const { address, web3, provider, loading, error } = this.state;
    const isMetamaskAvailable = window.ethereum || window.web3;
    return (
      provider && !loading && !error
        ? <Admin
            web3={web3}
            address={address}
            defaultProvider={provider}
            defaultView={ViewsEnum.MAIN}
            />
        : <form className={'login-form ' + (loading ? 'disabled' : '')} onSubmit={e => {this.handleLogin(e)}}>
            {!!error && <div className="message message-error">{error}</div>}
            <fieldset disabled={!isMetamaskAvailable}>
              <legend>Metamask login</legend>
              <button type="button" onClick={() => { this.handleMetamaskLogin() }}>Login</button>
              {!isMetamaskAvailable && <span> Metamask is not available </span>}
            </fieldset>
            <fieldset className="metamask-login">
              <legend>Custom login</legend>
              <div className="form-group">
                <label htmlFor="mnemonic">Mnemonic</label>
                <input type="text" name="mnemonic" id="mnemonic" required/>
              </div>
              <div className="form-group">
                <label htmlFor="network">Network</label>
                <select name="network" id="network" required>
                  {networks.map(network => <option key={network.CHAIN_ID} value={network.url}>{network.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <button type="submit">Login</button>
              </div>
            </fieldset>
          </form>
    );
  }
};
