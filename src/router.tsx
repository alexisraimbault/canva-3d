import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import { Editor } from "./pages/Editor";
import Callback from "./pages/Callback";
import { Listing } from "./pages/Listing";
import { Project } from "./pages/Project";

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
    },
    {
        path: "/project/:userId/:projectId",
        element: <Project />,
    },
    {
        path: "/l/:projectName",
        element: <Project />,
    }
]);