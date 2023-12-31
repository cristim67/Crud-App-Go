import React, { useEffect, useState, ReactElement, ReactNode } from "react";
import PropTypes, { Validator } from "prop-types";
import { Link } from "react-router-dom";
import {
  Navbar as MTNavbar,
  Collapse,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

interface Route {
  name: string;
  path: string;
  icon?: React.ComponentType<{ className: string }>;
}

interface NavbarProps {
  brandName?: string;
  routes: Route[];
  action?: ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ brandName, routes, action }) => {
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

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {routes.map(({ name, path, icon }) => (
        <Typography
          key={name}
          as="li"
          variant="small"
          color="blue-gray"
          className="capitalize"
          placeholder
        >
          <Link to={path} className="flex items-center gap-1 p-1 font-normal">
            {icon &&
              React.createElement(icon, {
                className: "w-[18px] h-[18px] opacity-50 mr-1",
              })}
            {name}
          </Link>
        </Typography>
      ))}
    </ul>
  );

  return (
    <MTNavbar className="p-3" placeholder>
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <Link to="/">
          <Typography
            variant="small"
            className="mr-4 ml-2 cursor-pointer py-1.5 font-bold"
            placeholder
          >
            {brandName}
          </Typography>
        </Link>
        <div className="hidden lg:block">{navList}</div>
        {action && React.isValidElement(action)
          ? React.cloneElement(action as ReactElement, {
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
          {navList}
          {action && React.isValidElement(action)
            ? React.cloneElement(action as ReactElement, {
                className: "w-full block lg:hidden",
              })
            : null}
        </div>
      </Collapse>
    </MTNavbar>
  );
};

Navbar.defaultProps = {
  brandName: "Material Tailwind React",
  action: (
    <a
      href="https://www.creative-tim.com/product/material-tailwind-dashboard-react"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button variant="gradient" size="sm" fullWidth placeholder>
        free download
      </Button>
    </a>
  ),
};

Navbar.propTypes = {
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      icon: PropTypes.elementType,
    }),
  ).isRequired as Validator<Route[]>,
  action: PropTypes.node,
};

Navbar.displayName = "/src/widgets/layout/navbar.jsx";

export default Navbar;
