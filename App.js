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
  @observable buttonTitle = "Start";
  @observable toggleButton = true;
  @observable currentValue = null;
  @observable maxValues = [0, 0, 0, 0, 0];
  dataObserver = {};
  subscription = null;

  componentDidMount = () => {
    this.createNewobserver();
  };

  createNewobserver = () => {
    this.dataObserver = Rx.Observable.interval(1000).concatMap(val =>
      Rx.Observable.of(Math.floor(Math.random() * 1000)).delay(
        Math.floor(Math.random() * 4) * 1000
      )
    );
  };
  createNewSubscription() {
    this.unsubscribeIfNecessary();
    this.subscription = this.dataObserver.subscribe(val =>
      this.sortingValues(val)
    );
  }

  unsubscribeIfNecessary() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }
  @action
  sortingValues = value => {
    console.log("Called Sorting Values");
    this.currentValue = value;
    this.maxValues.push(value);
  };

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
    console.log("rendered");
    return (
      <MainviewComponent>
        <Buttoncomponent>
          <Button onPress={this.onPressStart} title={this.buttonTitle} />
        </Buttoncomponent>
        <Text>Current Value:{this.currentValue}</Text>
        <Text>
          Maximum Values:
          {this.maxValues
            .sort((a, b) => b - a)
            .filter((item, i) => i < 5)
            .map((item, i) => (
              <Text key={i}>{item},</Text>
            ))}
        </Text>
      </MainviewComponent>
    );
  }
}
