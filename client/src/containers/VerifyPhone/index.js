import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Redirect, NavLink} from 'react-router-dom'
import {Spin, message, InputNumber, Row, Col, Form, Button} from 'antd'

// actions
import {verifyPhoneToken} from 'actions/User'

class VerifyPhone extends Component {
  state = {
    verifying: false,
    success: false,
    justVerified: false,
    failed: false,
    redirectTo: '/login',
    code: undefined,
    num1: undefined,
    num2: undefined,
    num3: undefined,
    num4: undefined,
  }

  sendVerification(e) {
    e.preventDefault()
    const {verifyPhoneToken} = this.props
    const {num1, num2, num3, num4} = this.state
    const code = '' + num1 + num2 + num3 + num4
    if (num1 < 0 || num2 < 0 || num3 < 0 || num4 < 0) {
      return message.error('Please fill out all of the numbers')
    }

    this.setState(prevState => ({
      ...prevState,
      verifying: true,
      success: false
    }))

    verifyPhoneToken(parseFloat(code))
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
      const errMessage = err.response.data.message || 'Verification failed. Please try code again.'
      this.setState(prevState => ({
        ...prevState,
        failed: errMessage === 'You are already verified' ? true : errMessage === 'Token is expired' ? true : errMessage === 'Invalid token' ? true : false,
        redirectTo: errMessage === 'You are already verified' ? '/login' : errMessage === 'Token is expired' ? '/reset-token' : errMessage === 'Invalid token' ? '/reset-token' : '/verify-phone',
        justVerified: errMessage === 'You are already verified' ? true : false,
        verifying: false
      }))
      message.error(errMessage)
    })
  }

  handleInputChange(value, identifier) {
    if (value && value.toString().length > 1) {
      return this.setState(this.state)
    }
    else {
      let newState = {}
      newState[identifier] = value ? value : value === 0 ? 0 : undefined
      let modifiedState = Object.assign({}, this.state, newState)

      this.setState(modifiedState)
      this.nextFocus(newState)
    }
  }

  nextFocus(modifiedValues) {
      const key = Object.keys(modifiedValues)[0]
      const value = modifiedValues[Object.keys(modifiedValues)[0]]

      if (value === undefined) {
        return
      }
      else {
        if (key === 'num1' && value !== undefined) {
          this.number2.focus()
        }
        else if (key === 'num2' && value !== undefined) {
          this.number3.focus()
        }
        else if (key === 'num3' && value !== undefined) {
          this.number4.focus()
        }
      }
  }

  // this just makes sure all 4 inputs are filled and have valid data
  verifyInput() {
    const {num1, num2, num3, num4} = this.state
    if (num1 < 0 || num1 === undefined || num2 < 0 || num2 === undefined || num3 < 0 || num3 === undefined || num4 < 0 || num4 === undefined) {
      return true
    }
    const code = '' + num1 + num2 + num3 + num4

    if (code.length >= 4) {
      return false
    } else {
      return true
    }
  }

  render() {
    const FormItem = Form.Item;
    const {verifying, success, justVerified, failed, redirectTo, num1, num2, num3, num4} = this.state
    const {isLoggedIn, isVerified} = this.props

    if (isLoggedIn && isVerified && !justVerified) {
      return <Redirect to='/profile' />
    }

    if (failed) {
      return <Redirect to={redirectTo} />
    }

    if (success) {
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

    return (
      <Row className='login-wrapper row' type='flex' justify='center'>
        <Col className='login-inner-wrapper' type='flex' justify='center' xs={24} sm={22} md={20} lg={18} xl={16}>
          <Form className='login-form-wrapper' onSubmit={this.sendVerification.bind(this)}>
            <h1 className='primary-color text-center'>Verify Account</h1>
            <p className='text-center'>
              Please enter the 4-digit verification code you received on your phone. Codes are valid for 5 minutes.
            </p>
            <p className='text-center'>
              Alternatively, <NavLink activeClassName='nav-active-item' className='text-center' exact to='/reset-token'>Click here to request a new token</NavLink>
            </p>
            <div className='row'>
              <div className="form-row">
                <FormItem>
                  <InputNumber
                    value={num1}
                    size="large"
                    min={0}
                    max={9}
                    onChange={value => (this.handleInputChange(value, 'num1'))}
                    placeholder={1}
                    style={{
                      maxWidth: 75,
                      width: '100%'
                    }}
                   />
                </FormItem>
                <FormItem>
                  <InputNumber
                    value={num2}
                    size="large"
                    min={0}
                    max={9}
                    onChange={value => (this.handleInputChange(value, 'num2'))}
                    placeholder={2}
                    style={{
                      maxWidth: 75,
                      width: '100%'
                    }}
                    ref={(input) => { this.number2 = input }}
                   />
                </FormItem>
                <FormItem>
                  <InputNumber
                    value={num3}
                    size="large"
                    min={0}
                    max={9}
                    onChange={value => (this.handleInputChange(value, 'num3'))}
                    placeholder={3}
                    style={{
                      maxWidth: 75,
                      width: '100%'
                    }}
                    ref={(input) => { this.number3 = input }}
                   />
                </FormItem>
                <FormItem>
                  <InputNumber
                    value={num4}
                    size="large"
                    min={0}
                    max={9}
                    onChange={value => (this.handleInputChange(value, 'num4'))}
                    placeholder={4}
                    style={{
                      maxWidth: 75,
                      width: '100%'
                    }}
                    ref={(input) => { this.number4 = input }}
                   />
                </FormItem>
              </div>
            </div>
            <div className="row login-button-wrapper">
              <FormItem>
                <Button
                  type='primary'
                  htmlType='submit'
                  style={{
                    width: '100%'
                  }}
                  disabled={this.verifyInput()}
                  ref={(input) => { this.num4 = input }}
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
}

VerifyPhone.propTypes = {
  isLoggedIn: PropTypes.bool,
  isVerified: PropTypes.bool
}

const mapStateToProps = (store) => ({
  isLoggedIn: store.User.isLoggedIn,
  isVerified: store.User.isVerified
})

const mapDispatchToProps = {
  verifyPhoneToken
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyPhone)
