import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {Row, Col} from 'antd'

// components
import Login from 'containers/Login'

// styles
import './style.css'

class HomePage extends Component {
  render() {
    const {isLoggedIn} = this.props

    if (!isLoggedIn) {
      return (
        <div className="homepage-login-wrapper">
          <Login/>
        </div>
      )
    }

    return (
      <Row className='homepage-wrapper' gutter={{
        xs: 8,
        sm: 16,
        md: 24,
        lg: 32
      }}>
        <Col span={24}>
          <div className='row'>
            You are logged in
          </div>
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = store => ({isLoggedIn: store.User.isLoggedIn})

const mapDispatchToProps = {}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomePage))
