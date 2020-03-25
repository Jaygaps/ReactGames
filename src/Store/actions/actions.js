export const ActionTypes = Object.freeze({
  FETCH_USER_DATA: "FETCH_USER_DATA",
  GET_USER_STATUS: "GET_USER_STATUS"
});

export const fetchUsers = userData => async (dispatch, getState) => {
  dispatch({
    type: ActionTypes.FETCH_USER_DATA,
    status: "initalised",
    userData
  });
};
