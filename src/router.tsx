import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import { Editor } from "./pages/Editor";
import Callback from "./pages/Callback";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/editor",
        element: <Editor />,
    },
    {
        path: "/callback",
        element: <Callback />,
    }
]);