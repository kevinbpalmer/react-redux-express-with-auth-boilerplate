import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Route, withRouter} from 'react-router-dom'
import {message, Spin} from 'antd'

// actions
import {verify, checkAuth} from 'actions/User'

class PrivateRoute extends Component {
  state = {
    initalCheckComplete: false
  }

  componentDidUpdate(prevProps) {
    const {userData, history} = this.props
    if(userData.allFields !== true && history.location.pathname !== '/finalize-facebook') {
      history.replace('/finalize-facebook')
    }
  }

  componentDidMount() {
    const {verify, checkAuth, history, location, userData} = this.props
    if(userData && userData.allFields !== true) {
      history.replace('/finalize-facebook')
    }

    checkAuth()
    .then(res => {
      console.log('PrivateRoute checkAuth res: ', res)
      verify()
      .then(res => {
        console.log('PrivateRoute verify res: ', res)
        this.setState({
          initalCheckComplete: true
        })
      })
      .catch(err => {
        console.error('Private route verify fail: ', err)
        message.error('Please verify your account first')
        history.replace('/verify-phone')
        this.setState({
          initalCheckComplete: true
        })
      })
    })
    .catch(err => {
      console.error('PrivateRoute checkAuth fail: ', err)
      message.error('Please login first')
      history.push({
        pathname: '/login',
        state: {
          from: location
        }
      })
      this.setState({
        initalCheckComplete: true
      })
    })

  }

  render() {
    const {
      component: Component,
      ...rest
    } = this.props
    const {initalCheckComplete} = this.state

    if (!initalCheckComplete) {
      return <Spin className='default-spinner' size='large' />
    }

    return (
      <Route
        {...rest}
        render={props => <Component {...props}/>}/>
    )
  }
}

const mapStateToProps = (store) => ({
  isLoggedIn: store.User.isLoggedIn,
  isLoggingOut: store.User.isLoggingOut,
  isVerified: store.User.isVerified,
  userData: store.User.userData
})

const mapDispatchToProps = {
  verify,
  checkAuth
}

PrivateRoute.propTypes = {
  isLoggedIn: PropTypes.bool,
  isLoggingIn: PropTypes.bool,
  isVerified: PropTypes.bool
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PrivateRoute))
