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
  @observable random_value = null;
  @observable current_value = null;

  @action
  onPressLoadMore = () => {
    console.log("Button Clicked");
    // Rx.Observable.interval(1000)
    //   .take(20)
    //   .subscribe(val => (this.random_value = val));
    Rx.Observable.interval(1000)
      .concatMap(val =>
        Rx.Observable.of(Math.floor(Math.random() * 1000)).delay(
          Math.floor(Math.random() * 4) * 1000
        )
      )
      .scan((acc, curr) => {
        this.current_value = curr;
        return acc > curr ? acc : curr;
      }, 0)
      .subscribe(val => (this.random_value = val));
  };

  render() {
    return (
      <MainviewComponent>
        <Text>Click below button to display random numbers</Text>
        <Buttoncomponent>
          <Button onPress={this.onPressLoadMore} title="Start" />
        </Buttoncomponent>
        <Text>Current Value:{this.current_value}</Text>
        <Text>Max Value:{this.random_value}</Text>
      </MainviewComponent>
    );
  }
}
