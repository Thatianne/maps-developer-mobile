import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import MapView from 'react-native-maps'
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location'

export default class Main extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentRegion: null
    }

    this.loadInitialLocation = this.loadInitialLocation.bind(this)
  }

  componentDidMount() {
    this.loadInitialLocation()
  }

  async loadInitialLocation() {
    const { granted } = await requestPermissionsAsync()
    if (granted) {
      const { coords } = await getCurrentPositionAsync({
        enableHighAccuracy: true
      })

      const { latitude, longitude } = coords
      this.setState({
        currentRegion: {
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04
        }
      })
    }
  }

  render() {
    if (!this.state.currentRegion) return null
    return (
      <MapView initialRegion={this.state.currentRegion} style={styles.map} />
    )
  }
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  }
})