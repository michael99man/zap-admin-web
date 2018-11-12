import * as React from 'react';
import { loadProvider } from '../utils';
import { ZapProvider } from '@zapjs/provider/lib/src';
import { setProviderParam, getProviderParam, getAllProviderParams} from '../provider';

interface State {
  provider: ZapProvider;
  error: string;
  success: string;
  param: string;
  loading: boolean;
  params: object;
}

/* CSS Styling */
const tableStyle = {
  "border-spacing": '5px',
  border: "1px solid black",
  "border-collapse": "collapse"
};
const cellStyle = {
  border: "1px solid black"
};


export class ProviderParams extends React.PureComponent<{web3: any; address: string}, State> {

  constructor(props) {
    super(props);
    this.state = {
      provider: null,
      error: null,
      success: null,
      param: '',
      loading: false,
      params: {}
    };
  }

  /* Load a new ZapProvider object and pull all params data */
  componentDidMount() {
    loadProvider(this.props.web3, this.props.address).then(async(provider) => {
      console.log(provider)
      this.setState({ provider: provider });

      let params = {};
      let keys = await getAllProviderParams(provider);
      for(var i=0; i<keys.length; i++){
        console.log(keys[i]);
        var value = await getProviderParam(provider, keys[i]);
        console.log(value);
        params[keys[i]] = value
      }
      this.setState({params: params});
    });
  }

  setParam(name, value, form) {
    return setProviderParam(this.state.provider, name, value).then((txid: any) => {
      console.log('txid', txid);
      form.reset();
      this.setState({ param: '', success: `Parameter ${name} has been set. Tx: ${txid.transactionHash}` });
    });
  }

  getAllParams(){
      console.log(this.state);
      return getAllProviderParams(this.state.provider).then(params => {
        console.log(params)
      });
  }

  /* Handle the submission of the add/change param form */
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
    (this.setParam(name, value, form)).then(() => {
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
    const {success, error, loading, param, params} = this.state;

    var rows = [];
    for (var key in params) {
      rows.push(<tr><td style={cellStyle}>{key}</td><td style={cellStyle}>{params[key]}</td></tr>)
    }

    return (
      <form className={loading ? 'disabled' : undefined} onSubmit={e => {this.handleSubmit(e)}}>
      {success && <div className="message message-success">{success}</div>}
      {error && <div className="message message-error">{error}</div>}

      <h3>My Provider Parameters</h3>
      <table className="params-table" style={tableStyle}><tbody>
        <tr>
        <th style={cellStyle}>Name</th>
        <th style={cellStyle}>Value</th>
        </tr>
        {rows}
        </tbody>
      </table>
      <h3>Add/Change Parameters</h3>
      <div className="form-group">
      <label htmlFor="set-param-name">Parameter key</label>
      <input type="text" id="set-param-name" name="name" required/>
      </div>
      <div className="form-group">
      <label htmlFor="set-param-value">Parameter value</label>
      <input type="text" id="set-param-value" name="value" />
      </div>
      <div className="form-group">
      <button type="submit">Set provider parameter</button>
      </div>
      </form>
      );
  }
}
