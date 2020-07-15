import { NavigationState, NavigationRoute } from 'react-navigation';

export const getActiveRoute = (
  state: NavigationState,
): NavigationRoute => {
  const visit = (route: NavigationRoute): NavigationRoute => {
    if ('index' in route && 'routes' in route && state.routes[state.index]) {
      return visit(route.routes[route.index]);
    }

    return route;
  };

  return visit(state.routes[state.index]);
};
