import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {
  Row,
  Col,
  Input,
  Button,
  Form,
  message,
  Select,
  Icon
} from 'antd'
import {NavLink} from 'react-router-dom'
import {withRouter} from 'react-router-dom';

// actions
import {registerUser} from 'actions/Register'

// styles
import './style.css'

class Register extends Component {
  constructor(props) {
    super(props)

    this.state = {
      firstName: null,
      lastName: null,
      email: null,
      phoneNumber: null,
      password: null,
      passwordConf: null,
      ustaRating: undefined
    }
  }

  handleSelectChange(value) {
    this.setState(prevState => ({
      ...prevState,
      ustaRating: value
    }))
  }

  handleInputChange = (event, inputName) => {
    let newValueObj = {}
    newValueObj[inputName] = event.target.value
    const newObj = Object.assign({}, this.state, newValueObj)
    this.setState(newObj)
  }

  handleSubmit = e => {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      passwordConf,
      ustaRating
    } = this.state
    const {history, registerUser} = this.props

    e.preventDefault()
    if (!firstName || !lastName || !email || !password || !passwordConf) {
      console.error('Missing required fields')
      return
    }

    registerUser(firstName, lastName, email, phoneNumber, password, passwordConf, ustaRating)
    .then(response => {
      if (response.value.data.message) {
        console.error(response.value.data.message);
        message.error(response.value.data.message)
        return
      } else {
        message.success('Success! Please check your email or phone for your verification link.')
        history.push('/login')
      }
    })
    .catch(error => {
      console.error('ERROR REGISTERING: ', error)
      message.error('Error registering. Please try again.')
    })
  }

  loginToFacebook() {
    console.log('Trying to do facebook login')
    window.location = `${process.env.REACT_APP_API_URL}/auth/facebook`
  }

  render() {
    const FormItem = Form.Item
    const Option = Select.Option
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      passwordConf,
      ustaRating
    } = this.state

    return (
      <Row className='register-wrapper' type='flex' justify='center'>
        <Col className='register-inner-wrapper' type='flex' justify='center' xs={24} sm={22} md={20} lg={18} xl={16}>
          <Form className='register-form-wrapper' onSubmit={this.handleSubmit}>
            <h1 className='primary-color text-center'>Register</h1>
            <p className='text-center'>
              Please tell us a little bit about yourself
            </p>
            <div className='row'>
              <div className='form-row register-name-row horizontal-row'>
                <FormItem>
                  <Input value={firstName} style={{
                    maxWidth: 400,
                    width: '100%'
                  }} placeholder='first name' onChange={value => (this.handleInputChange(value, 'firstName'))}/>
                </FormItem>

                <FormItem>
                  <Input value={lastName} style={{
                    maxWidth: 400,
                    width: '100%'
                  }} placeholder='last name' onChange={value => (this.handleInputChange(value, 'lastName'))}/>
                </FormItem>
              </div>
              <div className='form-row'>
                <FormItem>
                  <Input value={email} style={{
                    maxWidth: 400,
                    width: '100%'
                  }} placeholder='email address' onChange={value => (this.handleInputChange(value, 'email'))}/>
                </FormItem>
              </div>

              <div className='form-row'>
                <FormItem>
                  <Input value={phoneNumber} style={{
                    maxWidth: 400,
                    width: '100%'
                  }} placeholder='phone number' onChange={value => (this.handleInputChange(value, 'phoneNumber'))}/>
                </FormItem>
              </div>
              <div className="form-row">
                <FormItem>
                  <Select
                    value={ustaRating}
                    placeholder={2.5}
                    style={{
                      width: '100%'
                    }}
                    onChange={value => (this.handleSelectChange(value))}>
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
              <div className='form-row'>
                <FormItem>
                  <Input
                    value={password}
                    style={{
                    maxWidth: 400,
                    width: '100%'
                  }}
                  placeholder='password'
                  onChange={value => (this.handleInputChange(value, 'password'))}
                  type='password'/>
                </FormItem>
              </div>
              <div className='form-row'>
                <FormItem>
                  <Input value={passwordConf} style={{
                    maxWidth: 400,
                    width: '100%'
                  }} placeholder='confirm password' onChange={value => (this.handleInputChange(value, 'passwordConf'))} type='password'/>
                </FormItem>
              </div>
            </div>
            <div className='row'>
              <FormItem>
                <Button type='primary' htmlType='submit' style={{
                  width: '100%'
                }} disabled={!firstName || !lastName || !email || !password || !ustaRating || !passwordConf
                  ? true
                  : false}>
                  Submit
                </Button>
              </FormItem>
            </div>
            <div className="row" style={{margin: '.7rem'}}>
              <Button
                style={{
                  backgroundColor: '#3B5998',
                  color: '#ffffff',
                  width: '100%',
                  margin: '0 auto'
                }}
                onClick={this.loginToFacebook.bind(this)}
              >
                <Icon type="facebook" /> Signup with Facebook
              </Button>
            </div>
            <div className='row'>
              <p>
                or <NavLink to='/login' exact className='primary-color'>login</NavLink>
              </p>
            </div>
          </Form>
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = (store) => ({})

const mapDispatchToProps = {
  registerUser
}

Register.propTypes = {
  registerUser: PropTypes.func
}

Register = Form.create()(Register)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register))
