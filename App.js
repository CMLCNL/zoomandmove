import React, {Component} from 'react';
import {StyleSheet, View, Text, PanResponder, Animated} from 'react-native';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';

class Draggable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDraggable: true,
      dropAreaValues: null,
      pan: new Animated.ValueXY(),
      opacity: new Animated.Value(1),
    };
  }

  componentWillMount() {
    this._val = {x: 0, y: 0};
    this.state.pan.addListener(value => (this._val = value));

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderGrant: (e, gesture) => {
        console.log(this._val);
        this.state.pan.setOffset({
          x: this._val.x,
          y: this._val.y,
        });
        this.state.pan.setValue({x: 0, y: 0});
      },
      onPanResponderMove: Animated.event([
        null,
        {dx: this.state.pan.x, dy: this.state.pan.y},
      ]),
      onPanResponderRelease: (e, gesture) => {
        if (this.isDropArea(gesture)) {
          console.log(gesture);
        }
      },
    });
  }

  isDropArea(gesture) {
    return gesture.moveY < 200;
  }

  render() {
    return (
      <View style={{width: '20%', alignItems: 'center'}}>
        {this.renderDraggable()}
      </View>
    );
  }
  logOutZoomState = (event, gestureState, zoomableViewEventObject) => {
    console.log('');
    console.log('');
    console.log('-------------');
    console.log('Event: ', event);
    console.log('GestureState: ', gestureState);
    console.log('ZoomableEventObject: ', zoomableViewEventObject);
    console.log('');
    console.log(
      `Zoomed from ${zoomableViewEventObject.lastZoomLevel} to  ${zoomableViewEventObject.zoomLevel}`,
    );
  };

  renderDraggable() {
    const panStyle = {
      transform: this.state.pan.getTranslateTransform(),
    };
    if (this.state.showDraggable) {
      return (
        <ReactNativeZoomableView
          maxZoom={2}
          minZoom={0.5}
          zoomStep={0.5}
          initialZoom={1}
          bindToBorders={true}
          onZoomAfter={this.logOutZoomState}>
          <View style={{position: 'absolute'}}>
            <Animated.View
              {...this.panResponder.panHandlers}
              style={[panStyle, styles.circle]}
            />
          </View>
        </ReactNativeZoomableView>
      );
    }
  }
}

export default class App extends Component {
  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.ballContainer} />
        <View style={styles.row}>
          <Draggable />
        </View>
      </View>
    );
  }
}

let CIRCLE_RADIUS = 60;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  ballContainer: {
    height: 300,
  },
  circle: {
    backgroundColor: 'red',
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
  },
  row: {
    flexDirection: 'row',
  },
  dropZone: {
    height: 200,
    backgroundColor: '#00334d',
  },
  text: {
    marginTop: 25,
    marginLeft: 5,
    marginRight: 5,
    textAlign: 'center',
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
  },
});
