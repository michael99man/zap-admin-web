import * as React from 'react';
import { getEndpointInfo } from '../provider';

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
    e.preventDefault();
    const {web3, address} = this.props;
    const form = e.target;
    this.setState({
      loading: true,
      error: null,
      info: null,
    });
    getEndpointInfo(web3, address, form.oracle.value, form.endpoint.value).then(info => {
      this.setState({
        info,
        loading: false,
      });
      form.reset();
    }).catch(e => {
      this.setState({
        error: e.message,
        loading: false,
      });
    })
  }

  render() {
    const {error, info, loading} = this.state;
    return (
      <React.Fragment>
        {info && <div>
          <div><strong>Curve:</strong> {info.curve}</div>
          <div><strong>Your DOTs Bound:</strong> {info.bound}</div>
          <div><strong>Total DOTs:</strong> {info.totalBound}</div>
          <div><strong>Zap Bound:</strong> {info.zapBound}</div>
        </div>}
        <form className={loading ? 'disabled' : undefined} onSubmit={e => {this.handleSubmit(e)}}>
          {error && <div className="message message-error">{error}</div>}
          <div className="form-group">
            <label htmlFor="oracle">Oracle address</label>
            <input type="text" name="oracle" id="oracle" required />
          </div>
          <div className="form-group">
            <label htmlFor="endpoint">Endpoint</label>
            <input type="text" name="endpoint" id="endpoint" required />
          </div>
          <div className="form-group">
            <button type="submit">Submit</button>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

