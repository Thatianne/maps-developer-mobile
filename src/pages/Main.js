import React, { Component } from 'react'
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity } from 'react-native'
import MapView, { Marker, Callout } from 'react-native-maps'
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location'
import { MaterialIcons } from '@expo/vector-icons'

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
      <>
        <MapView initialRegion={this.state.currentRegion} style={styles.map}>
          <Marker coordinate={{ latitude: -12.2455354, longitude: -38.9573567 }}>
            <Image style={styles.avatar} source={{ uri: "https://avatars1.githubusercontent.com/u/14905849?s=460&v=4" }} />
            <Callout onPress={() => {
              this.props.navigation.navigate('Profile', { github_username: 'Thatianne' })
            }}>
              <View style={styles.callout}>
                <Text style={styles.devName}>Thatianne Carvalho</Text>
                <Text style={styles.devBio}>Web developer</Text>
                <Text style={styles.devTechs}>Javascript, VueJs, PHP</Text>
              </View>
            </Callout>
          </Marker>
        </MapView>
        <View style={styles.searchForm}>
          <TextInput
            style={styles.searchInput}
            placeholher="Buscar devs por techs..."
            placeholderTextColor="#999"
            autoCapitalize="words"
            autoCorrect={false} />
          <TouchableOpacity
            onPress={() => { }}
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