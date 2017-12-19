import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Row, Col, Menu, message} from 'antd'
import {NavLink, withRouter} from 'react-router-dom'

// actions
import {logout} from 'actions/User'

// styling
import './style.css'

class Header extends Component {
  logout = () => {
    const {history, logout} = this.props

    logout()
    .then(res => {
      console.log('Logout success: ', res)
      history.replace('/login')
      message.success('Logged out')
    })
    .catch(err => {
      console.error('Logout failed', err)
      message.error('Could not logout. Try again.')
    })
  }

  render() {
    const {isLoggedIn} = this.props

    return (
      <Row className='header-wrapper' type='flex' justify='space-around'>
        <Col span={12}>
          <div className='row'>
            Logo or something
          </div>
        </Col>
        <Col span={12}>
          <div className='row menu-row'>
            <Menu theme='dark' onClick={this.handleClick} mode='horizontal'>
              <Menu.Item>
                <NavLink activeClassName='nav-active-item' exact to='/'>Home</NavLink>
              </Menu.Item>
              {!isLoggedIn && <Menu.Item>
                <NavLink activeClassName='nav-active-item' exact to='/login'>Login</NavLink>
              </Menu.Item>}
              {isLoggedIn && <Menu.Item>
                <NavLink activeClassName='nav-active-item' exact to='/profile'>Profile</NavLink>
              </Menu.Item>}
              {isLoggedIn && <Menu.Item>
                <a onClick={this.logout}>Logout</a>
              </Menu.Item>}
            </Menu>
          </div>
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = (store) => ({isLoggedIn: store.User.isLoggedIn})

const mapDispatchToProps = {
  logout
}

Header.propTypes = {
  logout: PropTypes.func,
  isLoggedIn: PropTypes.bool
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))
