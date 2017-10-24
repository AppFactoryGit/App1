import {
  CURRENT_USER_ITEMS,
  CURRENT_USER_ITEMS_EMPTY,
} from '../actions/types';

const INITIAL_STATE = null;

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CURRENT_USER_ITEMS:
      return action.payload;
    case CURRENT_USER_ITEMS_EMPTY:
      return INITIAL_STATE;
    default:
      return state;
  }
};
