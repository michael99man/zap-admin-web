import * as React from 'react';
import { getZap } from '../subscriber';
import { OracleEndpointSelect } from './OracleEndpointSelect';

interface State {
  error: string;
  zap: string | number;
  loading: boolean;
}

export class Bondage extends React.PureComponent<{web3: any; address: string}, State> {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      zap: null,
      loading: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { web3, address } = this.props;
    getZap(web3, address).then(zap => {
      this.setState({ zap: zap.toString() });
    });
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  render() {
    const { error, loading, zap } = this.state;
    const { web3, address } = this.props;
    return (
      <React.Fragment>
        {error && <div className="message message-error">{error}</div>}
        <TotalZap zap={zap} />
        <BondageForm web3={web3} address={address} handleSubmit={this.handleSubmit} loading={loading} />
      </React.Fragment>
    );
  }
}

const TotalZap = ({zap}) => (
  zap !== null && !console.log('render total zap', zap) && <p>You have {zap} ZAP</p>
);

class BondageForm extends React.PureComponent<{handleSubmit: any; loading: boolean, web3: any, address: string}, {value: string}> {

  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState({value});
  }

  render() {
    const { handleSubmit, loading, web3, address } = this.props;
    return (
      <form className={loading ? 'disabled' : undefined} onSubmit={handleSubmit}>
        <OracleEndpointSelect web3={web3} address={address} onSelect={e => { console.log(e) }} ></OracleEndpointSelect>
        <div className="form-group">
          <button type="submit">Submit</button>
        </div>
      </form>
    );
  }
}
