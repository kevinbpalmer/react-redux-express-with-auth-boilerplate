import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Spin, message, Row, Col, Form, Input, Button} from 'antd'
import {withRouter} from 'react-router-dom'

// actions
import {checkPasswordResetToken, resetThePassword} from 'actions/User'

class WithToken extends Component {
  state = {
    tokenIsValid: false,
    password: undefined,
    passwordConf: undefined
  }

  componentDidMount() {
    const {checkPasswordResetToken, match, history} = this.props
    if (!match.params.token) {
      history.replace('/forgot-password')
    }
    checkPasswordResetToken(match.params.token)
    .then(res => {
      message.success('Token is valid. Please enter a new password below.')
      this.setState({
        tokenIsValid: true
      })
    })
    .catch(err => {
      console.error('Token is invalid: ', err)
      message.error('Token is invalid. Please request a new one.')
      history.replace('/forgot-password')
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const {password, passwordConf} = this.state
    const {resetThePassword, match, history} = this.props
    if (!password) {
      return message.warn('Please enter a password')
    }
    else if (!passwordConf) {
      return message.warn('Please confirm password')
    }
    else if (password !== passwordConf) {
      return message.warn('Passwords do not match')
    }
    else if (password.length < 8) {
      return message.warn('Password must be at least 8 characters')
    }

    resetThePassword(password, match.params.token)
    .then(res => {
      console.log('Password reset success!', res)
      message.success('Your password has been successfully reset')
      history.replace('/login')
    })
    .catch(err => {
      const errMessage = err.response.data.message || 'Failed to reset password.'
      console.error(err)
      
      message.error(errMessage)
    })
  }

  handleChange = (event, inputName) => {

    let newValueObj = {}
    newValueObj[inputName] = event.target.value
    const newObj = Object.assign({}, this.state, newValueObj)
    this.setState(newObj)
  }

  render() {
    const FormItem = Form.Item
    const {tokenIsValid, password, passwordConf} = this.state

    if (tokenIsValid === true) {
      return (
        <Row className='login-wrapper row' type='flex' justify='center'>
          <Col className='login-inner-wrapper' type='flex' justify='center' xs={24} sm={22} md={20} lg={18} xl={16}>
            <Form className='login-form-wrapper' onSubmit={this.handleSubmit}>
              <h1 className='primary-color text-center'>Reset Password</h1>
              <p className='text-center'>
                Please enter your new password
              </p>
              <div className='row'>
                <FormItem>
                  <Input
                    value={password}
                    style={{
                      maxWidth: 400,
                      width: '100%'
                    }}
                  placeholder='password'
                  type='password'
                  onChange={e => this.handleChange(e, 'password')}
                  />
                </FormItem>
              </div>
              <div className='row'>
                <FormItem>
                  <Input
                    value={passwordConf}
                    style={{
                      maxWidth: 400,
                      width: '100%'
                    }}
                  placeholder='password confirmation'
                  type='password'
                  onChange={e => this.handleChange(e, 'passwordConf')}
                  />
                </FormItem>
              </div>
              <div className='row'>
                <FormItem>
                  <Button
                    type='primary'
                    htmlType='submit'
                    style={{
                      width: '100%'
                    }}
                    >
                      Submit
                    </Button>
                </FormItem>
              </div>
            </Form>
          </Col>
        </Row>
      )
    }


    return (
      <div className='container'>
        <h1 style={{
          margin: '1rem 0'
        }} className='primary-color text-center'>Verifying token</h1>
        <Spin className='default-spinner' size='large' />
      </div>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    // get props from store
  }
}

const mapDispatchToProps = {
  checkPasswordResetToken,
  resetThePassword
}

WithToken.propTypes = {
  checkPasswordResetToken: PropTypes.func,
  resetThePassword: PropTypes.func
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WithToken))
