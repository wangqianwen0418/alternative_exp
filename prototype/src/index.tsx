import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { CASES } from "./util/cases";
import Questions from "./Questions";

import { createHashRouter, RouterProvider } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const cases = CASES.map((c) => {
  return {
    path: c.href,
    element: <App {...c} />,
  };
});

cases.unshift({
  path: "/",
  element: <App {...CASES[0]} />,
});

cases.push({
  path: "/questions",
  element: <Questions />,
});

root.render(<RouterProvider router={createHashRouter(cases)} />);

reportWebVitals();
