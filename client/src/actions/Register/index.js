import axios from 'axios'

import * as constants from 'constants/Register'

export const registerUser = (firstName, lastName, email, phoneNumber, password, passwordConf, ustaRating) => ({
  type: constants.REGISTER_USER,
  payload: axios.post('/api/v1/users', {firstName, lastName, email, phoneNumber, password, passwordConf, ustaRating})
})
