import { PureComponent } from 'react';
import * as React from 'react';
import { handleMenuAction } from '../actions/menu-actions';
import { ViewsEnum } from '../views.enum';

export default class Menu extends PureComponent<{dispatch: any, providerTitle: string, view: ViewsEnum}> {
  handleAction(type) {
    this.props.dispatch(handleMenuAction(type));
  }
  render() {
    const title = this.props.providerTitle;
    const view = this.props.view;
    return (
      <div className="menu">
        <div>
          <a
            className={view === ViewsEnum.MAIN ? 'active' : undefined}
            onClick={() => {this.handleAction(ViewsEnum.MAIN)}}>My Info</a>
        </div>
        <div>
          {!title
            ? <a className={view === ViewsEnum.CREATE_PROVIDER ? 'active' : undefined}
                onClick={() => {this.handleAction(ViewsEnum.CREATE_PROVIDER)}}>Create provider</a>
            : <a className={view === ViewsEnum.INIT_CURVE ? 'active' : undefined}
                onClick={() => {this.handleAction(ViewsEnum.INIT_CURVE)}}>Instantiate Bonding Curve</a>}
        </div>
        <div>
          <a className={view === ViewsEnum.GET_ENDPOINT ? 'active' : undefined}
            onClick={() => {this.handleAction(ViewsEnum.GET_ENDPOINT)}}>Get Endpoint</a>
        </div>
        <div>
          <a
            className={view === ViewsEnum.BONDAGE ? 'active' : undefined}
            onClick={() => {this.handleAction(ViewsEnum.BONDAGE)}}>Bond Zap</a>
        </div>
        <div>
          <a className={view === ViewsEnum.UNBONDAGE ? 'active' : undefined}
            onClick={() => {this.handleAction(ViewsEnum.UNBONDAGE)}}>Unbond Zap</a>
        </div>
        <div>
          <a
            className={view === ViewsEnum.QUERY ? 'active' : undefined}
            onClick={() => {this.handleAction(ViewsEnum.QUERY)}}>Query</a>
        </div>
        <div>
          {!title
            ? <a className="disabled">Respond to Queries (unavailable)</a>
            : <a className={view === ViewsEnum.RESPONSE ? 'active' : undefined}
                onClick={() => {this.handleAction(ViewsEnum.RESPONSE)}}>Respond to Queries</a>}
        </div>
        <div>
          <a className={view === ViewsEnum.ORACLES ? 'active' : undefined}
            onClick={() => {this.handleAction(ViewsEnum.ORACLES)}}>List Oracles</a>
        </div>
      </div>
    );
  }
}
