import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import { Editor } from "./pages/Editor";
import Callback from "./pages/Callback";
import { Listing } from "./pages/Listing";

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
        path: "/editor/:projectId",
        element: <Editor />,
    },
    {
        path: "/callback",
        element: <Callback />,
    },
    {
        path: "/listing",
        element: <Listing />,
    }
]);