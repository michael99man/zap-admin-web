import { Action } from "../action.interface";

export const infoReducer = (
  state = {
    eth: null,
    zap: null,
  },
  action: Action
) => {
  switch (action.type) {
    case 'UPDATE_ETH':
      return {...state, eth: action.payload};
    case 'UPDATE_ZAP':
      return {...state, zap: action.payload};
    default:
      return state;
  }
};

export const addressReducer = (state = null, action: Action) => {
  switch (action.type) {
    case 'SET_ADDRESS':
      return action.payload;
    default:
      return state;
  }
}

export const providerReducer = (state: any = {loaded: false}, action: Action) => {
  switch (action.type) {
    case 'UPDATE_PROVIDER_TITLE':
      return {...state, title: action.payload, loaded: true};
    default:
      return state;
  }
};

export const oraclesReducer = (state = [], action: Action) => {
  switch (action.type) {
    case 'UPDATE_ORACLES':
      return action.payload;
    default:
      return state;
  }
}

export const web3Reducer = (state = null, action: Action) => {
  switch (action.type) {
    case 'SET_WEB3':
      return action.payload;
    default:
      return state;
  }
}
