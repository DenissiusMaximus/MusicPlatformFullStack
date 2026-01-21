import {createBrowserRouter} from "react-router";
import type {AppRouteObject} from "./types.ts";
import ProtectedLayout from "./ProtectedLayout.tsx";
import {LoginPage} from "./pages/loginPage.tsx";
import {RegisterPage} from "./pages/registerPage.tsx";
import {CollectionPage} from "./pages/collectionPage.tsx";
import {TrackPage} from "./pages/trackPage.tsx";
import {UserPage} from "./pages/userPage.tsx";
import {CreateCollectionPage} from "./pages/createCollectionPage.tsx";
import {AddPage} from "./pages/addPage.tsx";
import {MonthTop} from "./pages/monthTop.tsx";

const routes: AppRouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout/>,
    children: [
      {
        index: true,
        element: <div className={`flex items-center justify-center text-5xl h-full`}>Оберіть або знайдіть плейлист </div>
      },
      {
        path: "collection/:id",
        element: <CollectionPage />
      },
      {
        path: "track/:id",
        element: <TrackPage />
      },
      {
        path: "user/:id",
        element: <UserPage />
      },
      {
        path: "createCollection",
        element: <CreateCollectionPage />
      },
      {
        path: "add",
        element: <AddPage />
      },
      {
        path: "top",
        element: <MonthTop />
      },
    ],
  },
  {
    element: <ProtectedLayout needAuth={false}/>,
    children: [
      {
        path: "login",
        element: <LoginPage/>,
      },
      {
        path: "register",
        element: <RegisterPage/>,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
