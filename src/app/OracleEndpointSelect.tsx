import * as React from 'react';
import { ZapProvider } from '@zapjs/provider/lib/src';
import { InputAutocomplete } from './InputAutocomplete';
import { getProvidersWithTitles } from '../subscriber';

interface Props {
  onSelect: ({provider: ZapProvider, endpoint: string}) => void;
  web3: any;
  address: string;
}

interface State {
  providers: ZapProvider[];
  endpoints: string[];
  provider: ZapProvider;
  endpoint: string;
  loading: boolean;
}

export class OracleEndpointSelect extends React.PureComponent<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      providers: [],
      endpoints: [],
      provider: null,
      endpoint: '',
      loading: false,
    }
  }

  componentDidMount() {
    this.setState({loading: true});
    getProvidersWithTitles(this.props.web3, this.props.address).then(providers => {
      this.setState({providers});
    })
  }

  handleProviderSelect(address) {
    const providers = this.state.providers;
    let i = providers.length;
    while (i--) {
      if (providers[i].providerOwner !== address) continue;
      this.setState({
        provider: providers[i],
        endpoint: '',
        endpoints: [],
      });
      this.updateProviderEndpoints(providers[i]);
      break;
    }
  }

  updateProviderEndpoints(provider: ZapProvider) {
    if (!provider) return;
    provider.getEndpoints().then(endpoints => {
      this.setState({endpoints});
    });
  }

  handleEndpointSelect(endpoint) {
    this.setState({endpoint});
    this.props.onSelect({
      endpoint,
      provider: this.state.provider
    });
  }

  render() {
    const { providers, endpoints, provider, endpoint } = this.state;
    const providerOptions = providers.map(provider => ({value: provider.providerOwner, name: provider.title}))
    const endpointOptions  = endpoints.map(endpoint => ({name: endpoint, value: endpoint}));
    return (
      <React.Fragment>
        <div className="form-group">
          <label>Oracle address</label>
          <InputAutocomplete value={provider ? provider.providerOwner : ''} options={providerOptions} onSelect={e => this.handleProviderSelect(e)} />
        </div>
        <div className="form-group">
          <label>Endpoint</label>
          <InputAutocomplete value={endpoint} options={endpointOptions} onSelect={e => this.handleEndpointSelect(e)} />
        </div>
      </React.Fragment>
    )
  }
}
