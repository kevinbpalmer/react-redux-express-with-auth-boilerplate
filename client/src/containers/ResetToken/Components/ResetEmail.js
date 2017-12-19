import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Button, Form, Input, message} from 'antd'

// actions
import {resetEmailToken} from 'actions/User'

class ResetEmail extends Component {
  state = {
    email: undefined
  }

  sendReset = (email, e) => {
    const {resetEmailToken} = this.props
    e.preventDefault()

    resetEmailToken(email)
    .then(res => {
      message.success('Please check your email for a verification link')
      this.setState({
        email: undefined
      })
    })
    .catch(err => {
      console.error(err)
      const errMessage = err.response.data.message || 'Reset failed'
      console.error('Error resetting email token: ', err.response)
      message.error(errMessage)
    })
  }

  handleChange = (event) => {
    let value = event.target.value
    this.setState(prevState => ({
      ...prevState,
      email: value
    }))
  }

   render() {
     const {email} = this.state
     const FormItem = Form.Item

      return (
        <Form className='login-form-wrapper reset-email-wrapper' onSubmit={(e) => this.sendReset(email, e)}>
          <h2 className='primary-color text-center'>Reset using Email</h2>
          <p className='text-center'>
            Please enter the email address used to create account
          </p>
          <div className='row'>
              <FormItem>
                <Input
                  value={email}
                  size="large"
                  placeholder="email address"
                  style={{
                    maxWidth: 400,
                    width: '100%'
                  }}
                  onChange={this.handleChange}
                />
              </FormItem>
          </div>
            <FormItem>
              <Button
                type='primary'
                htmlType='submit'
                style={{
                  width: '100%'
                }}
                disabled={email === undefined ? true : !email.includes('@') ? true : false}
                >
                  Submit
                </Button>
            </FormItem>
        </Form>
      )
   }
}

const mapStateToProps = (store) => ({})

const mapDispatchToProps = {
  resetEmailToken
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetEmail)
