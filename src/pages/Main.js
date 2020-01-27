import React, { Component } from 'react'
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity } from 'react-native'
import MapView, { Marker, Callout } from 'react-native-maps'
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location'
import { MaterialIcons } from '@expo/vector-icons'
import api from '../services/api'
import { connect, disconnect } from '../services/socket'

export default class Main extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentRegion: null,
      devs: [],
      techs: ''
    }

    this.loadInitialLocation = this.loadInitialLocation.bind(this)
    this.loadDevs = this.loadDevs.bind(this)
    this.handlerRegionChange = this.handlerRegionChange.bind(this)
    this.setupWebsocket = this.setupWebsocket.bind(this)
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

  async loadDevs() {
    const { latitude, longitude } = this.state.currentRegion
    const { techs } = this.state

    const res = await api.get('/search', {
      params: {
        latitude,
        longitude,
        techs,
      }
    })

    this.setState({
      devs: res.data
    })

    this.setupWebsocket()
  }

  setupWebsocket() {
    const { currentRegion: { latitude }, currentRegion: { longitude }, techs } = this.state
    connect(
      latitude,
      longitude,
      techs
    )
  }

  handlerRegionChange(region) {
    this.setState({
      currentRegion: region
    })
  }

  render() {
    if (!this.state.currentRegion) return null
    return (
      <>
        <MapView
          onRegionChangeComplete={this.handlerRegionChange}
          initialRegion={this.state.currentRegion}
          style={styles.map}
        >
          {this.state.devs.map(dev => (
            <Marker
              key={dev._id}
              coordinate={{
                latitude: dev.location.coordinates[1],
                longitude: dev.location.coordinates[0]
              }}
            >
              <Image
                style={styles.avatar}
                source={{ uri: dev.avatar_url }}
              />
              <Callout onPress={() => {
                this.props.navigation.navigate('Profile', { github_username: dev.github_username })
              }}>
                <View style={styles.callout}>
                  <Text style={styles.devName}>{dev.name}</Text>
                  <Text style={styles.devBio}>{dev.bio}</Text>
                  <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
        <View style={styles.searchForm}>
          <TextInput
            style={styles.searchInput}
            placeholher="Buscar devs por techs..."
            placeholderTextColor="#999"
            autoCapitalize="words"
            autoCorrect={false}
            value={this.state.tech}
            onChangeText={text => this.setState({ techs: text })} />
          <TouchableOpacity
            onPress={this.loadDevs}
            style={styles.loadButton}
          >
            <MaterialIcons
              name="my-location"
              size={20}
              color="#fff" />
          </TouchableOpacity>
        </View>
      </>
    )
  }
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: '#fff'
  },
  callout: {
    width: 260
  },
  devName: {
    fontWeight: 'bold',
    fontSize: 16
  },
  devBio: {
    color: '#666',
    marginTop: 5
  },
  devTechs: {
    marginTop: 5
  },
  searchForm: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: 'row'
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    color: '#333',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4
    },
    elevation: 2
  },
  loadButton: {
    width: 50,
    height: 50,
    backgroundColor: '#8e4dff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15
  }
})