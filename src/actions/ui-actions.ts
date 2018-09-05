export const updateView = view => ({
  type: 'UPDATE_VIEW',
  payload: view
});


export const loadingStart = () => ({
  type: 'SET_LOADING',
  payload: true,
});

export const loadingEnd = () => ({
  type: 'SET_LOADING',
  payload: false,
});