import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";

import "./app/styles/index.css";

import App from "./app/App";
import Questions from "./app/Questions";
import reportWebVitals from "./reportWebVitals";

import { CASES } from "./research/cases";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
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
