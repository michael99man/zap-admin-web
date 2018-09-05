import { ViewsEnum } from "../views.enum";
import { updateView, loadingStart, loadingEnd } from "./ui-actions";
import { listOracles, getEth, getZap } from "../subscriber";
import { updateOracles, udpateEth, udpateZap } from "./data-actions";
import { loadAccount } from "../utils";

export const handleMenuAction = (action: ViewsEnum) => (dispatch, getState) => {
  const { web3, address } = getState();
  dispatch(loadingEnd());
  switch(action) {
    case ViewsEnum.MAIN:
      dispatch(updateView(ViewsEnum.MAIN));
      dispatch(loadingStart());
      Promise.all([
        getEth(web3, address).then(eth => dispatch(udpateEth(eth))),
        getZap(web3, address).then(zap => dispatch(udpateZap(zap))),
      ]).then(() => {
        dispatch(loadingEnd());
      });
      break;
    case ViewsEnum.CREATE_PROVIDER:
      dispatch(updateView(ViewsEnum.CREATE_PROVIDER));
      break;
    case ViewsEnum.INIT_CURVE:
      dispatch(updateView(ViewsEnum.INIT_CURVE));
      break;
    case ViewsEnum.GET_ENDPOINT:
      dispatch(updateView(ViewsEnum.GET_ENDPOINT));
      break;
    case ViewsEnum.BONDAGE:
      dispatch(updateView(ViewsEnum.BONDAGE));
      break;
    case ViewsEnum.UNBONDAGE:
      dispatch(updateView(ViewsEnum.UNBONDAGE));
      break;
    case ViewsEnum.QUERY:
      dispatch(updateView(ViewsEnum.QUERY));
      break;
    case ViewsEnum.RESPONSE:
      dispatch(updateView(ViewsEnum.RESPONSE));
      break;
    case ViewsEnum.ORACLES:
      dispatch(updateView(ViewsEnum.ORACLES));
      dispatch(loadingStart());
      listOracles(web3).then(oracles => {
        dispatch(updateOracles(oracles));
        dispatch(loadingEnd());
      });
      break;
  }
}