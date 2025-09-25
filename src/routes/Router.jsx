import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App.jsx";
import Main from "../components/Main.jsx";
import FestivalList from "../components/festivals/FestivalList.jsx";
import FestivalShow from "../components/festivals/FestivalShow.jsx";
import Explore from "../components/Explore.jsx";
import StayList from "../components/stays/StayList.jsx";
import StayShow from "../components/stays/StayShow.jsx";
import FoodList from "../components/foods/FoodList.jsx";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        index: true,
        element: <Main />
      },
      { 
        path: '/explore', 
        element: <Explore />
      }, 
      {
        path: '/festivals',
        element: <FestivalList />
      },
      {
        path: '/festivals/:id',
        element: <FestivalShow/>
      },
      {
        path: "/stays",
        element: <StayList />
      },
      {
        path: "/stays/:id",
        element: <StayShow />
      },
      {
        path: "/foods",
        element: <FoodList />  //맛집 추가는 추후에 작업
      }
    ]
  }
]);

function Router() {
  return <RouterProvider router={router} />
}

export default Router;