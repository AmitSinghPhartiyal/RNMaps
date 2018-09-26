/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,TouchableOpacity} from 'react-native';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import OpenFile from 'react-native-doc-viewer';
var RNFS = require('react-native-fs');
var SavePath = Platform.OS === 'ios' ? RNFS.MainBundlePath : RNFS.ExternalStorageDirectoryPath;
export default class App extends Component{
  constructor(props){
    super();
    this.state = {
      fileName:"",
      imageURI: "",
      pdfURI:"",

    }
  }
  renderPicker(){
    console.log("save path",SavePath);
    DocumentPicker.show(
      {
        filetype: [DocumentPickerUtil.allFiles()]
      },
      (error, res) => {
        this.setState({fileName:res.fileName})
        console.log(
          res.uri,
          res.type, // mime type
          res.fileName,
          res.fileSize
       );
      //  expr = /image/
      //  console.log(res.type.search(expr));
       console.log("SavePath+res.fileName","file:/"+SavePath+res.fileName,"fs >>> ",SavePath)
      if(true){
        OpenFile.openDoc([{
          url:"file:/"+SavePath+res.fileName,
          fileName:"sample",
          cache:false,
          fileType:"jpg"
        }], (error, url) => {
           if (error) {
            this.setState({animating: false});
           } else {
            this.setState({animating: false});
             console.log(url)
           }
         })
            }
              this.fileuri = res.uri;
            }
          );
        }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>DocPicker</Text>
        <TouchableOpacity onPress = {() => {this.renderPicker()}} style ={{borderWidth:2,padding:20,}}>
          <Text>Show Picker</Text>
        </TouchableOpacity>
        <View style ={{padding:20}}>
        {this.state.fileName !==  ""?
        <Text><Text style ={{fontSize:20,fontWeight:"bold"}}>File name:</Text>{this.state.fileName}</Text>:
        null
          
      }</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 30,
    fontWeight:"bold",
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
