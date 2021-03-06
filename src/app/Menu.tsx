import { PureComponent } from 'react';
import * as React from 'react';
import { ViewsEnum } from '../views.enum';

export default class Menu extends PureComponent<{onMenuChange: any, providerTitle: string, view: ViewsEnum}> {
  render() {
    const title = this.props.providerTitle;
    const view = this.props.view;
    const onMenuChange = this.props.onMenuChange;
    return (
      <div className="menu">
        <div>
          <a
            className={view === ViewsEnum.MAIN ? 'active' : undefined}
            onClick={() => {onMenuChange(ViewsEnum.MAIN)}}>My Info</a>
        </div>
        <div>
          {!title
            ? <a className={view === ViewsEnum.CREATE_PROVIDER ? 'active' : undefined}
                onClick={() => {onMenuChange(ViewsEnum.CREATE_PROVIDER)}}>Create provider</a>
            : <a className={view === ViewsEnum.INIT_CURVE ? 'active' : undefined}
                onClick={() => {onMenuChange(ViewsEnum.INIT_CURVE)}}>Instantiate Bonding Curve</a>}
        </div>
        <div>
          {!title
            ? <a className="disabled">My provider params (unavailable)</a>
            : <a className={view === ViewsEnum.PROVIDER_PARAMS ? 'active' : undefined}
                onClick={() => {onMenuChange(ViewsEnum.PROVIDER_PARAMS)}}>Provider params</a>}
        </div>
        <div>
          {!title
            ? <a className="disabled">Set endpoint params (unavailable)</a>
            : <a className={view === ViewsEnum.ENDPOINT_PARAMS ? 'active' : undefined}
                onClick={() => {onMenuChange(ViewsEnum.ENDPOINT_PARAMS)}}>Set endpoint params</a>}
        </div>
        <div>
          <a className={view === ViewsEnum.GET_ENDPOINT ? 'active' : undefined}
            onClick={() => {onMenuChange(ViewsEnum.GET_ENDPOINT)}}>Get Endpoint</a>
        </div>
        <div>
          <a
            className={view === ViewsEnum.BONDAGE ? 'active' : undefined}
            onClick={() => {onMenuChange(ViewsEnum.BONDAGE)}}>Bond Zap</a>
        </div>
        <div>
          <a className={view === ViewsEnum.UNBONDAGE ? 'active' : undefined}
            onClick={() => {onMenuChange(ViewsEnum.UNBONDAGE)}}>Unbond Zap</a>
        </div>
        <div>
          <a className={view === ViewsEnum.QUERY ? 'active' : undefined}
            onClick={() => {onMenuChange(ViewsEnum.QUERY)}}>Query</a>
        </div>
        <div>
          {!title
            ? <a className="disabled">Respond to Queries (unavailable)</a>
            : <a className={view === ViewsEnum.RESPONSE ? 'active' : undefined}
                onClick={() => {onMenuChange(ViewsEnum.RESPONSE)}}>Respond to Queries</a>}
        </div>
        <div>
          <a className={view === ViewsEnum.ORACLES ? 'active' : undefined}
            onClick={() => {onMenuChange(ViewsEnum.ORACLES)}}>List Oracles</a>
        </div>
      </div>
    );
  }
}
