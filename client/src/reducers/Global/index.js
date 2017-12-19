import * as constants from 'constants/Global';

const initialState = {
  notification: {
    showMessage: false,
    message: 'An error has occurred'
  }
}

const Global = (state=initialState, action) => {
  switch (action.type) {
    case constants.GLOBAL_NOTIFICATION: {
      return {
        ...state,
        globalNotification: action.payload
      }
    }
    default:
      return state;
  }
}

export default Global
