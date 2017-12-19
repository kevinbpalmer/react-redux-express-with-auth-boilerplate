import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

//COMPONENTS
import {Card, Input, Button} from 'antd';

class Profile extends Component {
  componentDidMount() {
    const {location, history} = this.props
    if (location.hash === '#_=_') {
      history.replace({
        hash: ''
      })
    }
  }

  render() {
    return (
      <div>
        <Card title="Profile Page">
        <Input
          placeholder="First Name"
        />
        <Input
          placeholder="Last Name"
        />
        <Input
          placeholder="Email Name"
        />
        <Button
          type="primary"> Submit
          </Button>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = (store) => ({})

const mapDispatchToProps = {}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile))
