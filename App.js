/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from "react-native";
import {
  DocumentPicker,
  DocumentPickerUtil
} from "react-native-document-picker";
import OpenFile from "react-native-doc-viewer";
var RNFS = require("react-native-fs");
import Geocoder from "react-native-geocoder";
import MapView from "react-native-maps";
var SavePath =
  Platform.OS === "ios"
    ? RNFS.MainBundlePath
    : RNFS.ExternalStorageDirectoryPath;
export default class App extends Component {
  constructor(props) {
    super();
    this.state = {
      startAddress: "Your pickup location?",
      region: null,
      originLatitude: 0,
      originLongitude: 0,
      latitude: 37.78825,
      longitude: -122.4324,
      error: null
    };
  }
  // componentDidMount() {
  //   //Get new coordinated on location change.
  //   this.watchID = navigator.geolocation.watchPosition(
  //     position => {
  //       // const { coordinate, routeCoordinates, distanceTravelled } =   this.state;
  //       const { latitude, longitude } = position.coords;

  //       const newCoordinate = {
  //         latitude,
  //         longitude
  //       };
  //       if (Platform.OS === "android") {
  //         if (this.marker) {
  //           this.marker._component.animateMarkerToCoordinate(
  //             newCoordinate,
  //             500
  //           );
  //         }
  //       } else {
  //         coordinate.timing(newCoordinate).start();
  //       }
  //       this.setState({
  //         latitude,
  //         longitude
  //         //  routeCoordinates: routeCoordinates.concat([newCoordinate]),
  //         //  distanceTravelled:
  //         //  distanceTravelled + this.calcDistance(newCoordinate),
  //         //  prevLatLng: newCoordinate
  //       });
  //       console.log("new cords", this.state);
  //     },
  //     error => console.log(error),
  //     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  //   );
  // }
  componentDidMount() {
    //get current position lat and long
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log("get position", position);
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          },
          error: null
        });
        //Get address according to the lat and long.
        let pos = {
          lat: this.state.region.latitude,
          lng: this.state.region.longitude
        };
        Geocoder.geocodePosition(pos).then(res => {
          this.setState({ startAddress: res[0].formattedAddress });
        });
        console.log("ADDRESS", this.state.startAddress);
      },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 }
    );
  }
  mapView = () => (
    <MapView
      style={styles.map}
      ref={ref => {
        this.map = ref;
      }}
      loadingEnabled={true}
      loadingIndicatorColor="red"
      fitToElements={true}
      initialRegion={this.state.region}
      onRegionChange={region => this.setState({ region: region })}
    >
      <MapView.Marker
        draggable
        coordinate={{
          longitude: this.state.region.longitude,
          latitude: this.state.region.latitude
        }}
        onDragEnd={e => console.log(e.nativeEvent.coordinate)}
        pinColor="#000000"
      />
    </MapView>
  );
  renderPicker() {
    console.log("save path", SavePath);
    DocumentPicker.show(
      {
        filetype: [DocumentPickerUtil.allFiles()]
      },
      (error, res) => {
        this.setState({ fileName: res.fileName });
        console.log(
          res.uri,
          res.type, // mime type
          res.fileName,
          res.fileSize
        );
        //  expr = /image/
        //  console.log(res.type.search(expr));
        console.log(
          "SavePath+res.fileName",
          "file:/" + SavePath + res.fileName,
          "fs >>> ",
          SavePath
        );
        if (true) {
          OpenFile.openDoc(
            [
              {
                url: "file:/" + SavePath + res.fileName,
                fileName: "sample",
                cache: false,
                fileType: "jpg"
              }
            ],
            (error, url) => {
              if (error) {
                this.setState({ animating: false });
              } else {
                this.setState({ animating: false });
                console.log(url);
              }
            }
          );
        }
        this.fileuri = res.uri;
      }
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.region ? this.mapView() : <ActivityIndicator />}
        <View style={styles.inputView}>
          <Text style={styles.input} numberOfLines={1}>
            {this.state.startAddress}
          </Text>
        </View>
        <View style={styles.destinationView}>
          <TextInput
            style={styles.destinationInput}
            placeholder="Your drop location?"
          />
        </View>
        {/* <Text style={styles.welcome}>DocPicker</Text> */}
        {/* <TouchableOpacity onPress = {() => {this.renderPicker()}} style ={{borderWidth:2,padding:20,}}>
          <Text>Show Picker</Text>
        </TouchableOpacity>
        <View style ={{padding:20}}>
        {this.state.fileName !==  ""?
        <Text><Text style ={{fontSize:20,fontWeight:"bold"}}>File name:</Text>{this.state.fileName}</Text>:
        null        
      }</View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F5FCFF"
  },
  map: {
    flex: 1
  },
  inputView: {
    backgroundColor: "rgba(0,0,0,0)",
    position: "absolute",
    top: 0,
    left: 5,
    right: 5
  },
  destinationView: {
    backgroundColor: "rgba(0,0,0,0)",
    position: "absolute",
    top: 55,
    left: 5,
    right: 5
  },
  input: {
    height: 50,
    padding: 10,
    paddingLeft: 40,
    marginTop: 40,
    marginLeft: 20,
    marginRight: 10,
    fontSize: 18,
    borderWidth: 1,
    elevation: 10,
    borderColor: "#fff",
    backgroundColor: "white"
  },
  destinationInput: {
    height: 50,
    padding: 10,
    paddingLeft: 40,
    marginTop: 40,
    marginLeft: 20,
    marginRight: 10,
    fontSize: 18,
    borderWidth: 1,
    elevation: 10,
    borderColor: "#fff",
    backgroundColor: "white",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  }
});
