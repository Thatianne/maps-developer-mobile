import React, { Component } from 'react'
import { StatusBar } from 'react-native'

import Routes from './src/routes'

export default class App extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#7d40e7" />
        <Routes />
      </>
    )
  }
}