import {
  CURRENT_USER_PROPERTIES,
} from '../actions/types';

const INITIAL_STATE = {
  user: {
    userName: '',
    displayName: '',
  },
  ref: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CURRENT_USER_PROPERTIES:
      return action.payload;
    default:
      return state;
  }
};
