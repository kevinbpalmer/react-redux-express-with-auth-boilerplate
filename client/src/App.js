import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {BrowserRouter} from 'react-router-dom'
import {Spin} from 'antd'

// components
import Routes from './routes'
import Header from 'components/Header'

// actions
import {checkAuth, verify} from 'actions/User'

// styling
import 'styling/index.css'

class App extends Component {
  state = {
    currentPath: undefined
  }

  componentDidMount() {
    const {checkAuth, verify, isVerified} = this.props

    checkAuth()
    .then(res => {
      if (!isVerified) {
        verify()
        .then(res => {
          console.log('Verifying in App.js: ', res)
        })
        .catch(err => {
          console.error('Failed to verify in App.js: ', err)
        })
      }
    })
    .catch(err => {
      console.error('Not currently logged in!')
    })
  }

  render() {
    const {isLoggedIn} = this.props

    if (isLoggedIn === null) {
      return (
        <Spin className='default-spinner' size='large' />
      )
    }

    return (
      <BrowserRouter>
        <div className="app-wrapper">
          <Header />
          <Routes />
        </div>
      </BrowserRouter>
    )
  }
}

const mapStateToProps = (store) => ({
  isLoggedIn: store.User.isLoggedIn,
  isVerified: store.User.isVerified
})

const mapDispatchToProps = {
  checkAuth,
  verify
}

App.propTypes = {
  isLoggedIn: PropTypes.bool,
  isVerified: PropTypes.bool
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
