import React from 'react';

// components
import NoToken from './Components/NoToken'
import WithToken from './Components/WithToken'

const ForgotPassword = ({match}) => {
  if (match.params.token) {
    return <WithToken />
  }

  return <NoToken />
}

export default ForgotPassword;
