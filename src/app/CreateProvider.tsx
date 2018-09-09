import * as React from 'react';
import { loadProvider } from '../utils';
import { DEFAULT_GAS } from '@zapjs/types';

export class CreateProvider extends React.PureComponent<{web3: any; address: string}> {
  state = {loading: false, error: null, success: null};
  async handleSubmit(e) {
    e.preventDefault();
    const {web3, address} = this.props;
    const form = e.target;
    const {title, public_key} = form;
    this.setState({loading: true, error: null, success: null});
    try {
      const provider = await loadProvider(web3, address);
      await provider.initiateProvider({ public_key: public_key.value, title: title.value, gas: DEFAULT_GAS });
      form.reset();
      this.setState({laoding: false, success: 'Provider has been created'});
    } catch (e) {
      this.setState({laoding: false, error: e.message});
    }
  }
  render() {
    const { loading, success, error } = this.state;
    return (
      <form className={loading ? 'disabled' : undefined} onSubmit={e => {this.handleSubmit(e)}}>
        {error && <div className="message message-error">{error}</div>}
        {success && <div className="message message-success">{success}</div>}
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" name="title" id="title" required/>
        </div>
        <div className="form-group">
          <label htmlFor="public_key">Public Key</label>
          <input type="text" name="public_key" id="public_key" required/>
        </div>
        <div className="form-group">
          <button type="submit">Create provider</button>
        </div>
      </form>
    )
  }
}