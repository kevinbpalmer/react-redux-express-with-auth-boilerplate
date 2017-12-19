import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Spin, message} from 'antd'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

// actions
import {verifyEmailToken} from 'actions/User'

class VerifyEmail extends Component {
  state = {
    verifying: true,
    success: false,
    justVerified: false,
    failed: false,
    redirectTo: '/login'
  }

  componentDidMount() {
    this.sendVerification()
  }

  sendVerification() {
    const {verifyEmailToken} = this.props
    const token = this.props.match.params.token

    verifyEmailToken(token)
    .then(res => {
      if (res.value.data.isVerified === true) {
        this.setState(prevState => ({
          ...prevState,
          verifying: false,
          success: true,
          justVerified: true
        }))
      }
      message.success('Verified successfully. Please login')
    })
    .catch(err => {
      const errMessage = err.response.data.message || 'Verification failed'
      console.error('LOGUU', err.response)
      this.setState(prevState => ({
        ...prevState,
        failed: true,
        redirectTo: errMessage === 'You are already verified' ? '/login' : '/reset-token',
        justVerified: errMessage === 'You are already verified' ? true : false
      }))
      message.error(errMessage)
    })
  }

  render() {
    const {verifying, success, justVerified, failed, redirectTo} = this.state
    const {isLoggedIn, isVerified} = this.props

    if (isLoggedIn && isVerified && !justVerified) {
      return <Redirect to='/profile' />
    }

    if (failed) {
      return <Redirect to={redirectTo} />
    }

    if (verifying && !success) {
      return (
        <div style={{
          width: 400,
          margin: '0 auto'
        }}>
          <h1 className='text-center'>Verifying</h1>
          <div>
            <Spin className='default-spinner' size='large'/>
          </div>
        </div>
      )
    }

    return <Redirect to='/login' />
  }
}

VerifyEmail.propTypes = {
  isLoggedIn: PropTypes.bool,
  isVerified: PropTypes.bool
}

const mapStateToProps = (store) => ({
  isLoggedIn: store.User.isLoggedIn,
  isVerified: store.User.isVerified
})

const mapDispatchToProps = {
  verifyEmailToken
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail)
