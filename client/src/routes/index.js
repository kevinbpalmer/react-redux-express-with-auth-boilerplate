import React from 'react'
import {Route, Switch} from 'react-router-dom'

// Components
import HomePage from 'containers/HomePage'

  // auth
import Login from 'containers/Login'
import Register from 'containers/Register'
import Profile from 'containers/Profile'
import VerifyEmail from 'containers/VerifyEmail'
import VerifyPhone from 'containers/VerifyPhone'
import ResetToken from 'containers/ResetToken'
import FinalizeFacebook from 'containers/FinalizeFacebook'
import ForgotPassword from 'containers/ForgotPassword'

// Routing components
import PrivateRoute from 'components/PrivateRoute'

const Routes = props => (
  <Switch>
    <Route className='app-wrapper' exact path='/' component={HomePage} {...props} />
    <Route className='app-wrapper' exact path='/register' component={Register} {...props} />
    <Route className='app-wrapper' exact path='/login' component={Login} {...props} />
    <Route className='app-wrapper' exact path='/verify-email/:token' component={VerifyEmail} {...props} />
    <Route className='app-wrapper' exact path='/verify-phone' component={VerifyPhone} {...props} />
    <Route className='app-wrapper' exact path='/reset-token' component={ResetToken} {...props} />
    <Route className='app-wrapper' path='/forgot-password/:token' component={ForgotPassword} {...props} />
    <Route className='app-wrapper' path='/forgot-password' component={ForgotPassword} {...props} />

    {/* Any routes that shound only be accessible if you ARE logged in */}
    <PrivateRoute className='app-wrapper' exact path='/profile' component={Profile} {...props} />
    <PrivateRoute className='app-wrapper' path='/finalize-facebook' component={FinalizeFacebook} {...props} />
    <PrivateRoute className='app-wrapper' exact path='/test' component={() => (
      <h1>Test</h1>
    )} {...props} />

    <Route
      render={() => {
      return (
        <div className='container'>
          <div className="row">
            <h1>404 Page Not Found</h1>
          </div>
        </div>
      )
    }}/>
  </Switch>
)

export default Routes
