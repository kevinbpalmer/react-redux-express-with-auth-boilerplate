import axios from 'axios'

import * as constants from 'constants/User'

export const setUserData = data => ({
  type: constants.SET_USER_DATA,
  payload: data
})

export const checkAuth = () => ({
  type: constants.USER_IS_LOGGED_IN,
  payload: axios.get('/api/v1/authenticate')
})

export const logout = () => ({
  type: constants.USER_LOGOUT,
  payload: axios.get('/api/v1/logout')
})

export const login = (username, password) => ({
  type: constants.USER_LOGIN,
  payload: axios.post('/api/v1/login', {
        username,
        password
      })
})

export const verify = () => ({
  type: constants.USER_IS_VERIFIED,
  payload: axios.get('/api/v1/verify')
})

export const verifyEmailToken = emailToken => ({
  type: constants.VERIFY_EMAIL_TOKEN,
  payload: axios.post('/api/v1/verify-email', {emailToken})
})

export const resetEmailToken = emailAddress => ({
  type: constants.RESET_EMAIL_TOKEN,
  payload: axios.post('/api/v1/verify-email/reset', {emailAddress})
})

export const verifyPhoneToken = phoneToken => ({
  type: constants.VERIFY_PHONE_TOKEN,
  payload: axios.post('/api/v1/verify-phone', {phoneToken})
})

export const resetPhoneToken = phoneNumber => ({
  type: constants.RESET_PHONE_TOKEN,
  payload: axios.post('/api/v1/verify-phone/reset', {phoneNumber})
})

export const facebookFinalize = (ustaRating, phoneNumber) => ({
  type: constants.FINALIZE_USER_FROM_FACEBOOK,
  payload: axios.put('/api/v1/users', {ustaRating, phoneNumber})
})

export const resetPasswordToken = email => ({
  type: constants.RESET_PASSWORD_TOKEN,
  payload: axios.post('/api/v1/reset-password/check', {email})
})

export const checkPasswordResetToken = token => ({
  type: constants.CHECK_PASSWORD_RESET_TOKEN,
  payload: axios.post('/api/v1/reset-password/check-token', {token})
})

export const resetThePassword = (password, token) => ({
  type: constants.RESET_THE_PASSWORD,
  payload: axios.put('/api/v1/reset-password/reset', {password, token})
})
