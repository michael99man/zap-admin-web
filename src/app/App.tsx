import * as React from 'react';
import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from 'web3';
import { ViewsEnum } from '../views.enum';
import './app.css';
import { Admin } from './Admin';
import { providerUrl } from '../config';
import { loadAccount, loadProvider } from '../utils';

export class App extends React.Component {
  state = {web3: null, address: null, provider: null, loading: false, error: null};
  async handleLogin(e) {
    e.preventDefault();
    this.setState({error: null, loading: true, provider: null, address: null});
    try {
      const web3: any = new Web3(new HDWalletProvider(e.target.mnemonic.value, providerUrl));
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
    return (
      provider && !loading && !error
        ? <Admin
            web3={web3}
            address={address}
            defaultProvider={provider}
            defaultView={ViewsEnum.MAIN}
            />
        : <form className={loading ? 'disabled' : undefined} onSubmit={e => {this.handleLogin(e)}}>
            {!!error && <div className="message message-error">{error}</div>}
            <div className="form-group">
              <label htmlFor="mnemonic">Mnemonic</label>
              <input type="text" name="mnemonic" id="mnemonic"/>
            </div>
            <div className="form-group">
              <button type="submit">Login</button>
            </div>
          </form>
    );
  }
};
