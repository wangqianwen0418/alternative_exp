import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import CaseOne from './CaseOne';
import CaseTwo from './CaseTwo';
import reportWebVitals from './reportWebVitals';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <CaseOne />,
  },
  {
    path: "CaseTwo",
    element: <CaseTwo />,
  },
]);

root.render(
  <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
