import {
  CURRENT_ALERT_ITEMS,
  CURRENT_ALERT_ITEMS_EMPTY,
} from '../actions/types';

const INITIAL_STATE = null;

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CURRENT_ALERT_ITEMS:
      return action.payload;
    case CURRENT_ALERT_ITEMS_EMPTY:
      return INITIAL_STATE;
    default:
      return state;
  }
};
