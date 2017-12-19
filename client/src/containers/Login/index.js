import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Row, Col, AutoComplete, Icon, Input, Button, Form, message, Spin} from 'antd'
import {NavLink} from 'react-router-dom'
import {withRouter, Redirect} from 'react-router-dom'

// actions
import {login, verify} from 'actions/User'

// styles
import './style.css'

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dataSource: [],
      logemail: null,
      logpassword: null
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  handleAutocompleteChange = value => {
    // we set the autocomplete by default then check to see if the value is not set or if the value now contains an @ symbol. Meaning a user is most likely inputting a different email address than either in the autocomplete.
    let dataSource = [
      `${value}@gmail.com`,
      `${value}@crimson.ua.edu`
    ]
    if (!value || value.indexOf('@') >= 0) {
      dataSource = []
    }
    const newObj = Object.assign({}, this.state, {
      logemail: value,
      dataSource: dataSource
    })
    this.setState(newObj)
  }

  handleInputChange = (event, inputName) => {
    let newValueObj = {}
    newValueObj[inputName] = event.target.value
    const newObj = Object.assign({}, this.state, newValueObj)
    this.setState(newObj)
  }

  handleSubmit = e => {
    const {login, verify} = this.props
    const {logemail, logpassword} = this.state

    e.preventDefault()

    if (!logemail || !logpassword) {
      console.error('Missing username or password')
      return
    }
    console.log('SUBMITTING!', logemail, logpassword)

    login(logemail, logpassword)
    .then(res => {
      message.success('Logged in')
      verify()
      .catch(err => {
        console.error('User is not yet validated: ', err)
      })
    })
    .catch(err => {
      console.error(err)
      return message.error('Incorrect email or password')
    })
  }

  loginToFacebook() {
    window.location = `${process.env.REACT_APP_API_URL}/auth/facebook`
  }

  render() {
    const FormItem = Form.Item
    const {dataSource, logemail, logpassword} = this.state
    const {isLoggedIn, isLoggingIn, isVerified} = this.props
    const {from} = this.props.location.state || {from: {pathname: '/profile'}}

    if (isLoggedIn && isVerified) {
      return <Redirect to={from} />
    }

    if (isLoggedIn && !isVerified) {
      message.warn('Please verify your account before proceeding')
      return <Redirect to='/verify-phone' />
    }

    if (isLoggingIn) {
      return <Spin className='default-spinner' size='large' />
    }

    return (
      <Row className='login-wrapper row' type='flex' justify='center'>
        <Col className='login-inner-wrapper' type='flex' justify='center' xs={24} sm={22} md={20} lg={18} xl={16}>
          <Form className='login-form-wrapper' onSubmit={this.handleSubmit}>
            <h1 className='primary-color text-center'>Login</h1>
            <p className='text-center'>
              Please login to access this application
            </p>
            <div className='row'>
              <FormItem>
                <AutoComplete
                  onChange={this.handleAutocompleteChange}
                  dataSource={dataSource}
                  style={{
                    maxWidth: 400,
                    width: '100%'
                  }}
                  placeholder="email address"
                  type='email'
                />
              </FormItem>
              <FormItem>
                <Input value={logpassword}
                  style={{
                  maxWidth: 400,
                  width: '100%'
                }}
                placeholder="password"
                onChange={value => (this.handleInputChange(value, 'logpassword'))}
                type='password'/>
              </FormItem>
            </div>
            <div className="row login-button-wrapper">
              <FormItem>
                <Button
                  type='primary'
                  htmlType='submit'
                  style={{
                    width: '100%'
                  }}
                  disabled={!logemail || !logpassword ? true : false}
                  >
                    Submit
                  </Button>
              </FormItem>
              <FormItem>
                <Button
                  type='primary'
                  style={{
                    width: '100%'
                  }}
                  >
                  <NavLink to='/register' exact className='primary-color'>Register</NavLink>
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
                <Icon type="facebook" /> Login with Facebook
              </Button>
            </div>
            <div className="row">
              <p className='text-center'>
                <NavLink to='/forgot-password' exact className='primary-color'>
                  Forgot password?
                </NavLink>
              </p>
            </div>
          </Form>
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = (store) => ({
  isLoggedIn: store.User.isLoggedIn,
  isLoggingIn: store.User.isLoggingIn,
  isVerified: store.User.isVerified
})

const mapDispatchToProps = {
  login,
  verify
}

Login.propTypes = {
  isLoggedIn: PropTypes.bool,
  isVerified: PropTypes.bool
}

Login = Form.create()(Login)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))
