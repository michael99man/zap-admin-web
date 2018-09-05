export const setAddress = (value) => ({
  type: 'SET_ADDRESS',
  payload: value
});
export const udpateZap = (value) => ({
  type: 'UPDATE_ZAP',
  payload: value
});
export const udpateEth = (value) => ({
  type: 'UPDATE_ETH',
  payload: value
});

export const updateProviderTitle = (title) => ({
  type: 'UPDATE_PROVIDER_TITLE',
  payload: title
});

export const updateOracles = (oracles) => ({
  type: 'UPDATE_ORACLES',
  payload: oracles
});

export const setWeb3 = (value) => ({
  type: 'SET_WEB3',
  payload: value
});
