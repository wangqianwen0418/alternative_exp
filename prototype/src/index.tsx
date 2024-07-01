import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { CASES } from './const'

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

// const router = createBrowserRouter([
//     {
//         path: "/",
//         element: case1,
//     },
//     {
//         path: "case1",
//         element: case1,
//     },
//     {
//         path: "case2",
//         element: case2,
//     },
//     {
//         path: "case3",
//         element: case3,
//     },
// ]);

const cases = CASES.map((c, index) => {
    return {
        path: c.href,
        element: <App {...c} />
    }
})

cases.unshift({
    path: '/',
    element: <App {...CASES[0]} />
})

root.render(
    <RouterProvider router={createBrowserRouter(cases)} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
