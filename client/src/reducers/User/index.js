import * as constants from 'constants/User'

const initialState = {
  userData: null,
  isLoggedIn: null,
  isLoggingIn: null,
  isLoggingOut: false,
  isVerified: false
}

const User = (state=initialState, action) => {
  switch (action.type) {
    case constants.FINALIZE_USER_FROM_FACEBOOK_FULFILLED: {
      return {
        ...state,
        userData: action.payload.data
      }
    }
    case constants.VERIFY_EMAIL_TOKEN_FULFILLED: {
      return {
        ...state,
        userData: action.payload.data,
        isVerified: action.payload.data.isVerified
      }
    }
    case constants.USER_IS_VERIFIED_PENDING: {
      return {
        ...state,
        isLoggingIn: true
      }
    }
    case constants.USER_IS_VERIFIED_FULFILLED: {
      return {
        ...state,
        isVerified: action.payload.data,
        isLoggingIn: false
      }
    }
    case constants.USER_IS_VERIFIED_REJECTED: {
      return {
        ...state,
        isVerified: action.payload.data,
        isLoggingIn: false
      }
    }
    case constants.SET_USER_DATA: {
      return {
        ...state,
        userData: action.payload
      }
    }
    case constants.USER_LOGIN_PENDING: {
      return {
        ...state,
        isLoggingIn: true
      }
    }
    case constants.USER_LOGIN_FULFILLED: {
      return {
        ...state,
        userData: action.payload.data,
        isLoggingIn: false,
        isLoggedIn: true
      }
    }
    case constants.USER_LOGIN_REJECTED: {
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: false
      }
    }
    case constants.USER_IS_LOGGED_IN_REJECTED: {
      return {
        ...state,
        isLoggedIn: false
      }
    }
    case constants.USER_IS_LOGGED_IN_FULFILLED: {
      return {
        ...state,
        isLoggedIn: true,
        userData: action.payload.data
      }
    }
    case constants.USER_LOGOUT_FULFILLED: {
      return {
        ...state,
        isLoggedIn: false,
        isLoggingOut: true
      }
    }
    case constants.USER_LOGOUT_REJECTED: {
      return {
        ...state,
        isLoggedIn: true
      }
    }
    default:
      return state
  }
}

export default User
