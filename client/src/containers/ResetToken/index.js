import React from 'react'
import {Row, Col} from 'antd'

// components
import ResetEmail from './Components/ResetEmail'
import ResetPhone from './Components/ResetPhone'

import './style.css'

const ResetToken = () => {
      return (
        <Row className='login-wrapper row' type='flex' justify='center'>
          <Col className='login-inner-wrapper' style={{
            flexDirection: 'column'
          }} xs={24} sm={22} md={20} lg={18} xl={16}>
            <h1 className='primary-color text-center' style={{
              fontSize: '2rem'
            }}>Reset Token</h1>
            <ResetEmail />
            <ResetPhone />
          </Col>
        </Row>
      )
}

export default ResetToken;
