import { EmptyAction } from 'typesafe-actions';
import { NavigationActions } from 'react-navigation';

export interface NavigateAction extends EmptyAction<typeof NavigationActions.NAVIGATE> {
  routeName: string;
  type: typeof NavigationActions.NAVIGATE;
}

export const navigateAction = (routeName: string): NavigateAction => ({
  routeName,
  type: NavigationActions.NAVIGATE,
});
