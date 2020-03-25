import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import reducer from "../../Store/reducers/index";

import { mockUsers } from "../../utils/mocks";
import Home from "./Home";

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

test("Users mock renders correctly", async () => {
  const { getByText, debug } = render(
    <Provider store={store}>
      <Home />
    </Provider>
  );

  expect(getByText("mock1")).toHaveTextContent(mockUsers[0].name);
});
