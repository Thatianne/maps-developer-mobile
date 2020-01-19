import React, { Component } from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

export default class Profile extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const githubUsername = this.props.navigation.getParam('github_username')
    return (
      <WebView style={{ flex: 1 }} source={{ uri: `https://github.com/${githubUsername}` }} />
    )
  }
}