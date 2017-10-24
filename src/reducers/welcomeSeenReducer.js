import {
  WELCOME_SEEN,
} from '../actions/types';

const INITIAL_STATE = null;

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case WELCOME_SEEN:
      return action.payload;
    default:
      return state;
  }
};
