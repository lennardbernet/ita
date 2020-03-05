import React, {Component} from "react";
import {StyleSheet} from 'react-native';
import {createAppContainer} from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";
import {createDrawerNavigator} from "react-navigation-drawer";
import ExerciseScreen from "./ExerciseScreen";
import DetailScreen from "./DetailScreen";
import WorkoutScreen from "./WorkoutScreen";
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBEN2jBZroQc69QbKhr1l8zswCcIftwip8",
  authDomain: "<YOUR-AUTH-DOMAIN>",
  databaseURL: "https://firsttry-66f87.firebaseio.com/",
  storageBucket: "<YOUR-STORAGE-BUCKET>"
};

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const AppNavigator = createStackNavigator({
  Home: WorkoutScreen,
  Exercise:ExerciseScreen,
  Detail:DetailScreen
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {

  render() {
    console.log(">>> App/render");
    return (
        <AppContainer/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});