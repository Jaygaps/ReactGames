import { combineReducers } from "redux";
import { ActionTypes } from "../actions";

const initialState = {
  user: {},
  status: "INITIAL"
};

const userData = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_USER_DATA:
      return { ...state, status: action.status, user: action.userData };
    default:
      return state;
  }
};

export const dataSet = combineReducers({
  userData
});
