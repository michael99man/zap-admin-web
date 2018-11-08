import * as React from 'react';
import { ZapProvider } from '@zapjs/provider';
import 'github-markdown-css';
import * as marked from 'marked';
import { InputAutocomplete } from './InputAutocomplete';
import { getProvidersWithTitles } from '../subscriber';
import { loadProvider, getUrlText, formatJSON } from '../utils';
import { getProviderParam } from '../provider';

interface Props {
  onSelect: ({provider: ZapProvider, endpoint: string}) => void;
  web3: any;
  address: string;
  showParams?: boolean;
}

interface State {
  providers: ZapProvider[];
  endpoints: string[];
  provider: ZapProvider;
  endpoint: string;
  loading: boolean;
  providerText: string;
  endpointMd: string;
  endpointJson: string;
}

export class OracleEndpointSelect extends React.PureComponent<Props, State> {

  addressRe = /^(0x)?[0-9a-f]{40}$/i;
  mounted: boolean;

  constructor(props) {
    super(props);
    this.state = {
      providers: [],
      endpoints: [],
      provider: null,
      endpoint: '',
      loading: false,
      providerText: '',
      endpointMd: '',
      endpointJson: '',
    }
  }

  componentDidMount() {
    this.mounted = true;
    this.setState({loading: true});
    getProvidersWithTitles(this.props.web3, this.props.address).then(providers => {
      if (!this.mounted) return;
      this.setState({providers});
    })
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleProviderTextChange(providerText) {
    this.setState({providerText});
    if (this.addressRe.test(providerText) || !providerText) this.handleProviderSelect(providerText);
  }

  handleProviderSelect(address) {
    if (!this.addressRe.test(address)) {
      this.setState({
        provider: null,
        providerText: '',
        endpoint: '',
        endpoints: [],
      });
      this.props.onSelect(null);
      return;
    }
    const providers = this.state.providers;
    let i = providers.length;
    while (i--) {
      if (providers[i].providerOwner !== address) continue;
      this.setState({
        provider: providers[i],
        providerText: providers[i].providerOwner,
        endpoint: '',
        endpoints: [],
      });
      this.updateProviderEndpoints(providers[i]);
      return;
    }
    // if provider address is not in list
    loadProvider(this.props.web3, address).then(provider => {
      this.setState({
        provider: provider,
        providerText: provider.providerOwner,
        endpoint: '',
        endpointMd: '',
        endpointJson: '',
        endpoints: [],
      });
      this.updateProviderEndpoints(provider);
    });
  }

  updateProviderEndpoints(provider: ZapProvider) {
    if (!provider) return;
    provider.getEndpoints().then(endpoints => {
      this.setState({endpoints});
    });
  }

  handleEndpointChange(endpoint) {
    this.setState({endpoint});
  }

  handleEndpointSelect(endpoint) {
    if (!endpoint) {
      this.props.onSelect(null);
      return;
    }
    this.props.onSelect({
      endpoint,
      provider: this.state.provider
    });
    if (!this.props.showParams) return;
    Promise.all([
      getProviderParam(this.state.provider, endpoint + '.md').then(getUrlText).catch(e => { console.log(e); return ''; }),
      getProviderParam(this.state.provider, endpoint + '.json').then(getUrlText).catch(e => { console.log(e); return ''; }),
    ]).then(([markdown, schema]) => {
      this.setState({
        endpointMd: markdown,
        endpointJson: schema,
      });
    }).catch(console.error);
  }

  render() {
    const { providers, endpoints, endpoint, providerText, endpointJson, endpointMd } = this.state;
    const providerOptions = providers.map(provider => ({value: provider.providerOwner, name: provider.title + ' ' + provider.providerOwner}))
    const endpointOptions = endpoints.map(endpoint => ({name: endpoint, value: endpoint}));
    return (
      <React.Fragment>
        <div className="form-group">
          <label>Oracle address</label>
          <InputAutocomplete
            placehoder="Provider address"
            value={providerText}
            options={providerOptions}
            onChange={e => {this.handleProviderTextChange(e)}}
            onSelect={e => {this.handleProviderSelect(e)}} />
        </div>
        <div className="form-group">
          <label>Endpoint</label>
          <InputAutocomplete
            disabled={!endpointOptions.length}
            placehoder={endpointOptions.length ? 'Select endpoint' : 'Provider has no endpoints'}
            value={endpoint}
            onBlur={e => {this.handleEndpointSelect(e)}}
            onChange={e => {this.handleEndpointChange(e)}}
            options={endpointOptions}
            onSelect={e => {this.handleEndpointSelect(e)}}
          />
        </div>
        {this.props.showParams && <div>
          {endpointMd && <Markdown markdown={endpointMd}></Markdown>}
          {endpointJson && <Json json={endpointJson}></Json>}
        </div>}
      </React.Fragment>
    )
  }
}

export const Markdown = ({markdown}) => {
  return <div className="markdown-body" dangerouslySetInnerHTML={{__html: marked(markdown)}}></div>
}

export const Json = ({json}) => {
  return <div className="json"><code><pre>{formatJSON(json)}</pre></code></div>
}