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

const cases = CASES.map((c) => ({
  path: c.href,
  element: <App {...c} questionIndex={-1} />,
}));

cases.unshift({
  path: "/",
  element: <App {...CASES[0]} questionIndex={-1} />,
});

cases.push({
  path: "/questions",
  element: <Questions />,
});

root.render(<RouterProvider router={createHashRouter(cases)} />);

reportWebVitals();
