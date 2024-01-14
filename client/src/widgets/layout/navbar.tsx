import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Collapse,
  IconButton,
  Navbar as MTNavbar,
  Typography,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

interface Route {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface NavbarProps {
  brandName?: string;
  routes: {
    layout: string;
    title?: string;
    pages: Route[];
  }[];
  action?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ routes, action }: NavbarProps) => {
  const [openNav, setOpenNav] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) {
        setOpenNav(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const renderNavList = (layout: string, pages: Route[]) => {
    if (layout === "dashboard") {
      return (
        <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
          {pages.map(({ name, path, icon }) => (
            <Typography
              key={name}
              as="li"
              variant="small"
              color="blue-gray"
              className="capitalize"
              placeholder={name}
            >
              <Link
                to={"/dashboard" + path}
                className="flex items-center gap-1 p-1 font-normal"
              >
                {icon}
                {name}
              </Link>
            </Typography>
          ))}
        </ul>
      );
    }
    return null;
  };

  return (
    <MTNavbar className="p-3" placeholder>
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <Link to="/">
          <Typography
            variant="small"
            className="mr-4 ml-2 cursor-pointer py-2 font-bold"
            placeholder={"Crud App - Cristi Miloiu"}
          >
            {"Crud App - Cristi Miloiu"}
          </Typography>
        </Link>
        <div className="hidden lg:block">
          {routes.map(({ layout, pages }) => renderNavList(layout, pages))}
        </div>
        {action && React.isValidElement(action)
          ? React.cloneElement(action as React.ReactElement, {
              className: "hidden lg:inline-block",
            })
          : null}
        <IconButton
          variant="text"
          size="sm"
          className="ml-auto text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          onClick={() => setOpenNav(!openNav)}
          placeholder
        >
          {openNav ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <div className="container mx-auto">
          {routes.map(({ layout, pages }) => renderNavList(layout, pages))}
          {action && React.isValidElement(action)
            ? React.cloneElement(action as React.ReactElement, {
                className: "w-full block lg:hidden",
              })
            : null}
        </div>
      </Collapse>
    </MTNavbar>
  );
};

Navbar.propTypes = {
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      layout: PropTypes.string.isRequired,
      title: PropTypes.string,
      pages: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          path: PropTypes.string.isRequired,
          icon: PropTypes.node.isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
  action: PropTypes.node,
};

Navbar.displayName = "Navbar";

export default Navbar;
