import * as React from 'react';
import { getProviderEndpointInfo } from '../provider';
import { OracleEndpointSelect } from './OracleEndpointSelect';

export class GetEndpoint extends React.PureComponent<{web3: any; address: string}, {error: string; info: any; loading: boolean}> {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      info: null,
      loading: false,
    };
  }

  handleSubmit(e) {
    this.setState({
      loading: false,
      error: null,
      info: null,
    });
    if (!e) return;
    const {provider, endpoint} = e;
    this.setState({
      loading: true,
    });
    getProviderEndpointInfo(provider, endpoint, this.props.address).then(info => {
      this.setState({
        info,
        loading: false,
      });
    }).catch(e => {
      this.setState({
        error: e.message,
        loading: false,
      });
    })
  }

  render() {
    const {error, info, loading} = this.state;
    const {web3, address} = this.props;
    return (
      <React.Fragment>
        {info && <div>
          <div><strong>Curve:</strong> {info.curve}</div>
          <div><strong>Your DOTs Bound:</strong> {info.bound}</div>
          <div><strong>Total DOTs:</strong> {info.totalBound}</div>
          <div><strong>Zap Bound:</strong> {info.zapBound}</div>
        </div>}
        <form className={loading ? 'disabled' : undefined}>
          {error && <div className="message message-error">{error}</div>}
          <OracleEndpointSelect showParams={true} web3={web3} address={address} onSelect={e => { this.handleSubmit(e) }} ></OracleEndpointSelect>
        </form>
      </React.Fragment>
    );
  }
}

