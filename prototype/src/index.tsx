import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const case1 = <App dataset='case 1' initVis='beeswarm' />
const case2 = <App dataset='case 2' initVis='bar' />
const case3 = <App dataset='case 3' initVis='scatter' />

const router = createBrowserRouter([
    {
        path: "/",
        element: case1,
    },
    {
        path: "case1",
        element: case1,
    },
    {
        path: "case2",
        element: case2,
    },
    {
        path: "case3",
        element: case3,
    },
]);

root.render(
    <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
