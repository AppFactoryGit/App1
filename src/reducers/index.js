import { combineReducers } from 'redux';

import user from './currentUserReducer';
import userP from './currentUserPropertiesReducer';
import userItems from './currentUserItemsReducer';
import alertItems from './currentAlertItemsReducer';
import welcomeSeen from './welcomeSeenReducer';

export default combineReducers({
  user,
  userP,
  welcomeSeen,
  userItems,
  alertItems,
});
