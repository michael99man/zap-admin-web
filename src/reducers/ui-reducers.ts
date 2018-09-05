import { ViewsEnum } from "../views.enum";
import { Action } from "../action.interface";
import { bindActionCreators } from "redux";

export const viewReducer = (state = null, action: Action) => {
  switch (action.type) {
    case 'UPDATE_VIEW':
      return action.payload;
    default:
      return state;
  }
}

export const viewLoadingReducer = (state = false, action: Action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return action.payload;
    default:
      return state;
  }
}
