import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Row, Col, Form, Input, Button, message} from 'antd'

// actions
import {resetPasswordToken} from 'actions/User'

class NoToken extends Component {
  state = {
    email: undefined
  }

  handleSubmit = (e) => {
    const {resetPasswordToken} = this.props
    const {email} = this.state
    e.preventDefault()

    resetPasswordToken(email)
    .then(res => {
      console.log('Reset user email token: ', res)
      message.success('Please check your email for a reset link')
    })
    .catch(err => {
      console.error(err)
      message.error('Failed to reset user email token')
    })

    this.setState({
      email: undefined
    })
  }

  handleChange = (e) => {
    this.setState({
      email: e.target.value
    })
  }

  render() {
    const FormItem = Form.Item
    const {email} = this.state

    return (
      <Row className='login-wrapper row' type='flex' justify='center'>
        <Col className='login-inner-wrapper' type='flex' justify='center' xs={24} sm={22} md={20} lg={18} xl={16}>
          <Form className='login-form-wrapper' onSubmit={this.handleSubmit}>
            <h1 className='primary-color text-center'>Reset Password</h1>
            <p className='text-center'>
              Please input the email address you signed up with
            </p>
            <div className='row'>
              <FormItem>
                <Input
                  value={email}
                  style={{
                  maxWidth: 400,
                  width: '100%'
                }}
                placeholder='email address'
                onChange={this.handleChange}
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
                  disabled={!email ? true : !email.includes('@') ? true : false }
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

const mapStateToProps = (store) => {
  return {
    // get props from store
  }
}

const mapDispatchToProps = {
  resetPasswordToken
}

NoToken.propTypes = {
  resetPasswordToken: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(NoToken)
