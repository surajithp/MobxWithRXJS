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
  bottom: 0,
  left: 180
});

const MainviewComponent = glamorous.view({
  height: dimensions.height - 25,
  width: dimensions.width
});
@observer
export default class App extends Component {
  @observable maximumValue = null;
  @observable buttonTitle = "Start";
  @observable toggleButton = true;
  @observable currentvalues = [];
  dataObserver = {};
  subscription = null;

  componentDidMount = () => {
    console.log("did mount");
    this.createNewobserver();
  };

  createNewobserver = () => {
    this.dataObserver = Rx.Observable.from([56, 84, 321, 421, 621])
      .concat(
        Rx.Observable.interval(1000).concatMap(val =>
          Rx.Observable.of(Math.floor(Math.random() * 1000)).delay(
            Math.floor(Math.random() * 4) * 1000
          )
        )
      )
      .scan((acc, curr) => {
        this.currentvalues.push(curr);
        return acc > curr ? acc : curr;
      }, 0);
  };
  createNewSubscription() {
    this.unsubscribeIfNecessary();
    this.subscription = this.dataObserver.subscribe(
      val => (this.maximumValue = val)
    );
  }

  unsubscribeIfNecessary() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  @action //Where multiple observables values can be modify
  onPressStart = () => {
    console.log("Button Clicked");
    this.buttonTitle = this.toggleButton ? "Stop" : "Start";
    if (!this.toggleButton) {
      //stop
      console.log("called unsubscribe");
      this.unsubscribeIfNecessary();
    } else {
      //start
      console.log("called New subscription");
      this.createNewSubscription();
    }
    this.toggleButton = !this.toggleButton;
  };

  render() {
    return (
      <MainviewComponent>
        <Buttoncomponent>
          <Button onPress={this.onPressStart} title={this.buttonTitle} />
        </Buttoncomponent>
        <Text>
          Current Values:
          {this.currentvalues.map((item, i) => (
            <Text key={i}>{item},</Text>
          ))}
        </Text>
        <Text>Max Value:{this.maximumValue}</Text>
      </MainviewComponent>
    );
  }
}
