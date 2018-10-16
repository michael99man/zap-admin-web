import * as React from 'react';
import { loadProvider } from '../utils';
import { ZapProvider } from '@zapjs/provider/lib/src';
import { setProviderParam, getProviderParam } from '../provider';

interface State {
  provider: ZapProvider;
  error: string;
  success: string;
  param: string;
  loading: boolean;
}

export class ProviderParams extends React.PureComponent<{web3: any; address: string}, State> {

  constructor(props) {
    super(props);
    this.state = {
      provider: null,
      error: null,
      success: null,
      param: '',
      loading: false,
    };
    this.handleParamChange = this.handleParamChange.bind(this);
  }

  componentDidMount() {
    loadProvider(this.props.web3, this.props.address).then(provider => {
      this.setState({ provider });
    });
  }

  handleParamChange(e) {
    this.setState({param: e.target.value});
  }

  setParam(name, value, form) {
    return setProviderParam(this.state.provider, name, value).then((txid: any) => {
      console.log('txid', txid);
      form.reset();
      this.setState({ param: '', success: `Parameter ${name} has been set. Tx: ${txid.transactionHash}` });
    });
  }

  getParam(name) {
    return getProviderParam(this.state.provider, name).then(param => {
      this.setState({ param });
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const value = this.state.param;
    this.setState({
      error: null,
      success: null,
      loading: true,
    });
    (value ? this.setParam(name, value, form) : this.getParam(name)).then(() => {
      this.setState({ loading: false });
    }).catch(e => {
      console.log(e);
      this.setState({
        error: e.message,
        loading: false,
      });
    });
  }

  render() {
    const {success, error, loading, param} = this.state;
    return (
      <form className={loading ? 'disabled' : undefined} onSubmit={e => {this.handleSubmit(e)}}>
        {success && <div className="message message-success">{success}</div>}
        {error && <div className="message message-error">{error}</div>}
        <div className="form-group">
          <label htmlFor="set-param-name">Parameter key</label>
          <input type="text" id="set-param-name" name="name" required/>
        </div>
        <div className="form-group">
          <label htmlFor="set-param-value">Parameter value</label>
          <input value={param} onChange={this.handleParamChange} type="text" id="set-param-value" name="value" />
        </div>
        <div className="form-group">
          {param ? <button type="submit">Set provider parameter</button> : <button type="submit">Get provider parameter</button>}
        </div>
      </form>
    );
  }
}
