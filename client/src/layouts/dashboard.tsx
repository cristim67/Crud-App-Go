import { Route, Routes } from "react-router-dom";
import { Sidenav } from "../widgets/layout/sidenav.tsx";
import routes from "../routes.tsx";
import Navbar from "../widgets/layout/navbar.tsx";
import { useMediaQuery } from "react-responsive";

export function Dashboard() {
  const isSmallScreen = useMediaQuery({ maxWidth: 1140 });
  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav name="Crud App - Cristi Miloiu" routes={routes} />
      {isSmallScreen && <Navbar routes={routes} />}
      <div className="p-4 xl:ml-80">
        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              )),
          )}
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
