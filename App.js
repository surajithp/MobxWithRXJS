import React, { Component } from "react";
import {
  Platform,
  Text,
  View,
  FlatList,
  Button,
  Dimensions
} from "react-native";
import { observer } from "mobx-react";
import { observable, computed, action, autorun } from "mobx";
import glamorous, { ThemeProvider } from "glamorous-native";
const Rx = require("rxjs/Rx");
const dimensions = Dimensions.get("window");
const Buttoncomponent = glamorous.view({
  position: "absolute",
  bottom: 200,
  left: 180
});

const MainviewComponent = glamorous.view({
  height: dimensions.height - 30,
  width: dimensions.width
});
@observer
export default class App extends Component {
  @observable maximum_value = null;
  @observable current_value = null;
  @observable button_title = "Start";
  @observable toggle_button = true;
  dataObserver = {};
  subscription = null;

  componentDidMount = () => {
    this.createNewobserver();
  };
  createNewobserver = () => {
    this.dataObserver = Rx.Observable.interval(1000)
      .concatMap(val =>
        Rx.Observable.of(Math.floor(Math.random() * 1000)).delay(
          Math.floor(Math.random() * 4) * 1000
        )
      )
      .scan((acc, curr) => {
        this.current_value = curr;
        return acc > curr ? acc : curr;
      }, 0);
  };
  createNewSubscription() {
    this.unsubscribeIfNecessary();
    this.subscription = this.dataObserver.subscribe(
      val => (this.maximum_value = val)
    );
  }

  unsubscribeIfNecessary() {
    console.log(this.subscription);
    console.log(this.subscription.closed);
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  @action //Where multiple observables states can modify
  onPressStart= () => {
    console.log("Button Clicked");
    this.button_title = this.toggle_button ? "Stop" : "Start";
    if (!this.toggle_button) {
      //stop
      this.unsubscribeIfNecessary();
    } else {
      //start
      this.createNewSubscription();
    }
    this.toggle_button = !this.toggle_button;
  };

  render() {
    return (
      <MainviewComponent>
        <Buttoncomponent>
          <Button onPress={this.onPressStart} title={this.button_title} />
        </Buttoncomponent>
        <Text>Current Value:{this.current_value}</Text>
        <Text>Max Value:{this.maximum_value}</Text>
      </MainviewComponent>
    );
  }
}
