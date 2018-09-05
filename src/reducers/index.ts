import { providerReducer, infoReducer, oraclesReducer, web3Reducer, addressReducer } from "./data-reducers";
import { Action } from "../action.interface";
import { viewReducer, viewLoadingReducer } from "./ui-reducers";

export const appReducer = (state: any = {}, action: Action = {type: null}) => {
  return {
    info: infoReducer(state.info, action),
    address: addressReducer(state.address, action),
    view: viewReducer(state.view, action),
    provider: providerReducer(state.provider, action),
    oracles: oraclesReducer(state.oracles, action),
    web3: web3Reducer(state.web3, action),
    viewLoading: viewLoadingReducer(state.viewLoading, action),
  }
};
