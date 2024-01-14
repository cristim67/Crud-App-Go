import React, { createContext, useContext, useMemo, useReducer } from "react";
import PropTypes from "prop-types";

interface MaterialTailwindState {
  openSidenav: boolean;
  sidenavColor: string;
  sidenavType: string;
  transparentNavbar: boolean;
  fixedNavbar: boolean;
  openConfigurator: boolean;
}

interface MaterialTailwindContextProps {
  children: React.ReactNode;
}

type MaterialTailwindAction = { type: string; value: any };

const MaterialTailwind = createContext<
  [MaterialTailwindState, React.Dispatch<MaterialTailwindAction>] | null
>(null);
MaterialTailwind.displayName = "MaterialTailwindContext";

export function reducer(
  state: MaterialTailwindState,
  action: MaterialTailwindAction,
): MaterialTailwindState {
  switch (action.type) {
    case "OPEN_SIDENAV": {
      return { ...state, openSidenav: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export function MaterialTailwindControllerProvider({
  children,
}: MaterialTailwindContextProps): JSX.Element {
  const initialState: MaterialTailwindState = {
    openSidenav: false,
    sidenavColor: "dark",
    sidenavType: "white",
    transparentNavbar: true,
    fixedNavbar: false,
    openConfigurator: false,
  };

  const [controller, dispatch] = useReducer(reducer, initialState);
  const value: [MaterialTailwindState, React.Dispatch<MaterialTailwindAction>] =
    useMemo(() => [controller, dispatch], [controller, dispatch]);

  return (
    <MaterialTailwind.Provider value={value}>
      {children}
    </MaterialTailwind.Provider>
  );
}

export function useMaterialTailwindController(): [
  MaterialTailwindState,
  React.Dispatch<MaterialTailwindAction>,
] {
  const context = useContext(MaterialTailwind);

  if (!context) {
    throw new Error(
      "useMaterialTailwindController should be used inside the MaterialTailwindControllerProvider.",
    );
  }

  return context;
}

MaterialTailwindControllerProvider.displayName = "/src/context/index.tsx";

MaterialTailwindControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const setOpenSidenav = (
  dispatch: React.Dispatch<MaterialTailwindAction>,
  value: boolean,
) => dispatch({ type: "OPEN_SIDENAV", value });
