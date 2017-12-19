import React, { Component } from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {Button, Form, InputNumber, message} from 'antd'

import {resetPhoneToken} from 'actions/User'

class ResetPhone extends Component {
  state = {
    phone: undefined
  }

  sendReset = (phone, e) => {
    const {history, resetPhoneToken} = this.props
    e.preventDefault()

    if (phone === undefined || phone.toString().length < 10) {
      return message.warn('Phone number must be 10 numbers long')
    }

    resetPhoneToken(phone)
    .then(res => {
      message.success('Please check your phone for your verification code')
      this.setState({
        phone: undefined
      })
      history.replace('/verify-phone')
    })
    .catch(err => {
      console.error(err)
      const errMessage = err.response.data.message || 'Reset failed'
      console.error('Error resetting email token: ', err.response)
      message.error(errMessage)
    })
  }

  handleChange = (value) => {
    if (value && value.toString().length > 10) {
      return this.setState(this.state)
    }
    this.setState(prevState => ({
      ...prevState,
      phone: value
    }))
  }

   render() {
     const FormItem = Form.Item
     const {phone} = this.state

      return (
        <Form className='login-form-wrapper' onSubmit={(e) => this.sendReset(phone, e)}>
          <h2 className='primary-color text-center'>Reset using Phone Number</h2>
          <p className='text-center'>
            Please enter the phone number associated with the account including area code
          </p>
          <div className='row'>
              <FormItem>
                <InputNumber
                  value={phone}
                  onChange={value => this.handleChange(value)}
                  size="large"
                  placeholder='xxx-xxx-xxxx'
                  style={{
                  maxWidth: 400,
                  width: '100%'
                }}
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
                disabled={phone === undefined ? true : phone.toString().length < 10 ? true : false}
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
  resetPhoneToken
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResetPhone))
