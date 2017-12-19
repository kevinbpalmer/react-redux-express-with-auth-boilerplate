import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {Row, Col, Form, InputNumber, Button, Select, message} from 'antd'
import {Redirect} from 'react-router-dom'

// actions
import {facebookFinalize} from 'actions/User'

class FinalizeFacebook extends Component {
  state = {
    ustaRating: undefined,
    phoneNumber: undefined
  }

  componentDidMount() {
    message.warn('Finalize your account by filling out the fields below')
  }

  handleSubmit = (e) => {
    const {ustaRating, phoneNumber} = this.state
    const {facebookFinalize} = this.props
    e.preventDefault()
    if (!ustaRating || !phoneNumber) {
      message.warn('Please fill out the required fields')
    }
    else if (phoneNumber.toString().length < 10) {
      message.warn('Please make sure phone number has area code')
    }
    else {
      facebookFinalize(ustaRating, phoneNumber)
      .then(res => {
        console.log('Updated user account successfully: ', res)
        message.success('Thank you!')
      })
      .catch(err => {
        console.error('Failed to update user account: ', err)
        const errMessage = err.response.data.message || 'Please check the fields and submit again.'
        message.error(errMessage)
      })
    }
  }

  handleSelectChange = (value) => {
    this.setState(prevState => ({
      ...prevState,
      ustaRating: value
    }))
  }

  handleInputNumberChange = (value) => {

    if (value && value.toString().length > 10) {
      return this.setState(this.state)
    }

    this.setState(prevState => ({
      ...prevState,
      phoneNumber: value
    }))
  }

  render() {
    const {ustaRating, phoneNumber} = this.state
    const {userData} = this.props
    const FormItem = Form.Item
    const Option = Select.Option

    if (userData.allFields === true) {
      return <Redirect to='/profile' />
    }

    return (
      <Row className='login-wrapper row' type='flex' justify='center'>
        <Col
          className='login-inner-wrapper'
          type='flex'
          justify='center'
          xs={24}
          sm={22}
          md={20}
          lg={18}
          xl={16}>
          <Form className='login-form-wrapper' onSubmit={this.handleSubmit}>
            <h1 className='primary-color text-center'>Finalize</h1>
            <p className='text-center'>
              Please finalize your account by filling out the fields below
            </p>
            <div className='row'>
              <div className='form-row'>
                <FormItem>
                  <InputNumber
                    value={phoneNumber}
                    placeholder='phone number'
                    onChange={this.handleInputNumberChange}
                    style={{
                      maxWidth: 400,
                      width: '100%'
                    }}
                  />
                </FormItem>
              </div>
            </div>
            <div className='row'>
              <div className='form-row'>
                <FormItem>
                  <Select
                    value={ustaRating}
                    placeholder='ustaRating'
                    style={{
                      width: '100%'
                    }}
                    onChange={this.handleSelectChange}>
                    <Option value={2.5}>2.5</Option>
                    <Option value={3.0}>3.0</Option>
                    <Option value={3.5}>3.5</Option>
                    <Option value={4.0}>4.0</Option>
                    <Option value={4.5}>4.5</Option>
                    <Option value={5.0}>5.0</Option>
                    <Option value={5.5}>5.5</Option>
                    <Option value={6.0}>6.0</Option>
                    <Option value={7.0}>7.0</Option>
                  </Select>
                </FormItem>
              </div>
            </div>
            <div className='row login-button-wrapper'>
              <FormItem>
                <Button
                  type='primary'
                  htmlType='submit'
                  style={{
                  width: '100%'
                }}
                  disabled={!ustaRating || !phoneNumber
                  ? true
                  : false}>
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

const mapStateToProps = (store) => ({userData: store.User.userData})

const mapDispatchToProps = {
  facebookFinalize
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FinalizeFacebook))
