import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import { EditorV2 } from "./pages/EditorV2";
import Callback from "./pages/Callback";
import { Listing } from "./pages/Listing";
import { Project } from "./pages/Project";

import { BlobMetalBackground } from "./components/BlobMetalBackground";

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
        element: <EditorV2 />,
    },
    {
        path: "/editorv2",
        element: <EditorV2 />,
    },
    {
        path: "/editor/:projectId",
        element: <EditorV2 />,
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
        path: "/dashboard",
        element: <Listing />,
    },
    {
        path: "/project/:userId/:projectId",
        element: <Project />,
    },
    {
        path: "/l/:projectName",
        element: <Project />,
    },
    {
        path: "/test",
        element: <BlobMetalBackground />,
    }
]);