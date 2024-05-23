import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Image,
  PanResponder,
  Easing,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Audio } from "expo-av";

import { omit } from "lodash";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "react-native-elements";
const thumbTouchSize = { width: 50, height: 50 };
const Colors = {
  bgApp2: "#49DD7B",
};
export default class AudioReader extends React.Component {
  state = {
    seek: 0,
    volume: 1,
    isLoaded: false,
    isBuffering: true,
    duration: undefined,
  };

  _isInitialBufferingStarted = false;
  _isInitialBufferingEnded = false;

  render() {
    const { isPlaying, isLoaded } = this.state;

    return (
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Slider
            style={styles.slider}
            thumbStyle={styles.thumb}
            trackStyle={styles.track}
            thumbTouchSize={thumbTouchSize}
            onValueChange={this._onSeekChange}
            value={this._getSeekSliderPosition()}
            onSlidingComplete={this._onSeekComplete}
            minimumTrackTintColor="rgb(64, 224, 190)"
          />

          <View style={{ marginLeft: 3 }}>
            {isLoaded &&
              (isPlaying ? (
                <TouchableOpacity
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 30,
                    backgroundColor: Colors.bgApp2,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={isLoaded ? this._pause : () => null}
                >
                  <Icon
                    {...{
                      name: "pause",
                      type: "antdesign",
                      color: "#FFF",
                      size: 20,
                    }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 30,
                    backgroundColor: Colors.bgApp2,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={isLoaded ? this._play : () => null}
                >
                  <Icon
                    {...{
                      name: "play",
                      type: "antdesign",
                      color: "#FFF",
                      size: 20,
                    }}
                  />
                </TouchableOpacity>
              ))}
            {!isLoaded && (
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 30,
                  backgroundColor: Colors.bgApp2,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator color={"#FFF"} size="small" />
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
  ensureCreated = async (play = false) => {
    if (!this.soundObject) {
      this.timestamp = Date.now();
      const { sound } = await Audio.Sound.createAsync(
        {
          uri: this.props.url,
        },
        {
          shouldPlay: play,
          progressUpdateIntervalMillis: 800,
          positionMillis: 0,
        },
        this._onPlaybackStatusUpdate
      );

      this.soundObject = sound;
    } else {
      this.timestamp = Date.now();
      if (play) {
        this.soundObject.playAsync();
      }
    }
  };
  _play = async () => {
    await this.ensureCreated(true);
  };

  async componentDidMount() {
    await this.ensureCreated();
  }
  _pause = () => this.soundObject.pauseAsync();
  async componentWillUnmount() {
    if (this.soundObject) {
      if (this.state.isPlaying) await this.soundObject.stopAsync();
      this.soundObject._clearSubscriptions();
      this.soundObject.unloadAsync();
    }
  }
  _onPlaybackStatusUpdate = (status) => {
    const statusTimestamp = Date.now() - this.timestamp;

    // console.info("status " + statusTimestamp + ": ", status);
    if (this._prevStatus && !this._prevStatus.isLoaded && status.isLoaded) {
      this.setState({ initialLoadingTimestamp: statusTimestamp });
    }

    if (!this._isInitialBufferingStarted) {
      if (status.isBuffering) {
        this._isInitialBufferingStarted = true;
      }
    } else if (!this._isInitialBufferingEnded && !status.isBuffering) {
      this.setState({ initialBufferingTimestamp: statusTimestamp });

      this._isInitialBufferingEnded = true;
    }

    if (
      !this.state.initialPlayingTimestamp &&
      this._prevStatus &&
      !this._prevStatus.isPlaying &&
      status.isPlaying
    ) {
      this.setState({ initialPlayingTimestamp: statusTimestamp });
    }

    this._prevStatus = status;

    if (status.isLoaded) {
      this.setState({
        duration: getMMSSFromMillis(status.durationMillis),
        volume: status.volume,
        isLoaded: status.isLoaded,
        isPlaying: status.isPlaying,
        playbackInstancePosition: status.positionMillis,
        playbackInstanceDuration: status.durationMillis,
      });
    } else if (status.error) {
      console.log("Status error", status.error);
    }
  };

  _onSeekChange = async (value) => {
    if (this.soundObject != null) {
      if (!this.isSeeking) {
        this.isSeeking = true;
      }
      this.seek = value;
    }
  };

  _onSeekComplete = async (value) => {
    if (this.soundObject != null) {
      this.timestamp = Date.now();

      await this.soundObject.setStatusAsync({
        positionMillis: value * this.state.playbackInstanceDuration,
      });

      this.isSeeking = false;
    }
  };

  _getSeekSliderPosition = () => {
    if (this.isSeeking) {
      return this.seek;
    }

    const { playbackInstancePosition, playbackInstanceDuration } = this.state;

    if (
      this.soundObject != null &&
      playbackInstancePosition != null &&
      playbackInstanceDuration != null
    ) {
      return playbackInstancePosition / playbackInstanceDuration;
    }

    return 0;
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
    // width
  },

  slider: {
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.85,
    bottom: 0,
  },

  thumb: {
    backgroundColor: Colors.bgApp2,
    shadowColor: "rgba(0,0,0,0.18)",
    shadowOffset: { height: 10, width: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },

  track: {
    backgroundColor: "#eee",
  },
});

function getMMSSFromMillis(millis) {
  const totalSeconds = millis / 1000;
  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor(totalSeconds / 60);

  return padWithZero(minutes) + ":" + padWithZero(seconds);

  function padWithZero(number) {
    const string = number.toString();

    if (number < 10) {
      return "0" + string;
    }

    return string;
  }
}

const TRACK_SIZE = 4;
const THUMB_SIZE = 20;

function Rect(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

Rect.prototype.containsPoint = function (x, y) {
  return (
    x >= this.x &&
    y >= this.y &&
    x <= this.x + this.width &&
    y <= this.y + this.height
  );
};

const DEFAULT_ANIMATION_CONFIGS = {
  spring: {
    friction: 7,
    tension: 100,
  },
  timing: {
    duration: 150,
    easing: Easing.inOut(Easing.ease),
    delay: 0,
  },
  // decay : { // This has a serious bug
  //   velocity     : 1,
  //   deceleration : 0.997
  // }
};
class Slider extends PureComponent {
  static defaultProps = {
    value: 0,
    minimumValue: 0,
    maximumValue: 1,
    step: 0,
    minimumTrackTintColor: "#3f3f3f",
    maximumTrackTintColor: "#b3b3b3",
    thumbTintColor: "#343434",
    thumbTouchSize: { width: 40, height: 40 },
    debugTouchArea: false,
    animationType: "timing",
  };

  state = {
    containerSize: { width: 0, height: 0 },
    trackSize: { width: 0, height: 0 },
    thumbSize: { width: 0, height: 0 },
    allMeasured: false,
    value: new Animated.Value(this.props.value),
  };

  render() {
    const {
      minimumValue,
      maximumValue,
      minimumTrackTintColor,
      maximumTrackTintColor,
      thumbTintColor,
      style,
      trackStyle,
      thumbStyle,
      debugTouchArea,
      ...other
    } = this.props;
    const { value, containerSize, thumbSize, allMeasured } = this.state;

    const thumbLeft = value.interpolate({
      inputRange: [minimumValue, maximumValue],
      outputRange: [0, containerSize.width - thumbSize.width],
      //extrapolate: 'clamp',
    });

    const valueVisibleStyle = {};

    if (!allMeasured) {
      valueVisibleStyle.opacity = 0;
    }

    const minimumTrackStyle = {
      position: "absolute",
      width: Animated.add(thumbLeft, thumbSize.width / 2),
      backgroundColor: minimumTrackTintColor,
      ...valueVisibleStyle,
    };

    const touchOverflowStyle = this._getTouchOverflowStyle();

    return (
      <View
        {...other}
        style={[defaultStyles.container, style]}
        onLayout={this._measureContainer}
      >
        <View
          style={[
            { backgroundColor: maximumTrackTintColor },
            defaultStyles.track,
            trackStyle,
          ]}
          renderToHardwareTextureAndroid
          onLayout={this._measureTrack}
        />

        <Animated.View
          renderToHardwareTextureAndroid
          style={[defaultStyles.track, trackStyle, minimumTrackStyle]}
        />

        <Animated.View
          onLayout={this._measureThumb}
          renderToHardwareTextureAndroid
          style={[
            { backgroundColor: thumbTintColor },
            defaultStyles.thumb,
            thumbStyle,
            {
              transform: [{ translateX: thumbLeft }, { translateY: 0 }],
              ...valueVisibleStyle,
            },
          ]}
        >
          {this._renderThumbImage()}
        </Animated.View>

        <View
          renderToHardwareTextureAndroid
          style={[defaultStyles.touchArea, touchOverflowStyle]}
          {...this._panResponder.panHandlers}
        >
          {debugTouchArea === true &&
            this._renderDebugThumbTouchRect(thumbLeft)}
        </View>
      </View>
    );
  }

  _renderDebugThumbTouchRect = (thumbLeft) => {
    const thumbTouchRect = this._getThumbTouchRect();
    const positionStyle = {
      left: thumbLeft,
      top: thumbTouchRect.y,
      width: thumbTouchRect.width,
      height: thumbTouchRect.height,
    };

    return (
      <Animated.View
        style={[defaultStyles.debugThumbTouchArea, positionStyle]}
        pointerEvents="none"
      />
    );
  };

  _renderThumbImage = () => {
    const { thumbImage } = this.props;

    if (!thumbImage) return;

    return <Image source={thumbImage} />;
  };

  UNSAFE_componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminationRequest: this._handlePanResponderRequestEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      if (this.props.animateTransitions) {
        this._setCurrentValueAnimated(nextProps.value);
      } else {
        this._setCurrentValue(nextProps.value);
      }
    }
  }

  _getPropsForComponentUpdate(props) {
    return omit(props, [
      "value",
      "onValueChange",
      "onSlidingStart",
      "onSlidingComplete",
      "style",
      "trackStyle",
      "thumbStyle",
    ]);
  }

  _handleStartShouldSetPanResponder = (e) =>
    // Should we become active when the user presses down on the thumb?
    this._thumbHitTest(e);

  _handleMoveShouldSetPanResponder() {
    // Should we become active when the user moves a touch over the thumb?
    return false;
  }

  _handlePanResponderGrant = () => {
    this._previousLeft = this._getThumbLeft(this._getCurrentValue());
    this._fireChangeEvent("onSlidingStart");
  };

  _handlePanResponderMove = (e, gestureState) => {
    if (this.props.disabled) {
      return;
    }

    this._setCurrentValue(this._getValue(gestureState));
    this._fireChangeEvent("onValueChange");
  };

  _handlePanResponderRequestEnd() {
    // Should we allow another component to take over this pan?
    return false;
  }

  _handlePanResponderEnd = (e, gestureState) => {
    if (this.props.disabled) {
      return;
    }

    this._setCurrentValue(this._getValue(gestureState));
    this._fireChangeEvent("onSlidingComplete");
  };

  _measureContainer = (x) => {
    this._handleMeasure("containerSize", x);
  };

  _measureTrack = (x) => {
    this._handleMeasure("trackSize", x);
  };

  _measureThumb = (x) => {
    this._handleMeasure("thumbSize", x);
  };

  _handleMeasure = (name, x) => {
    const { width, height } = x.nativeEvent.layout;
    const size = { width: width, height: height };

    const storeName = `_${name}`;
    const currentSize = this[storeName];

    if (
      currentSize &&
      width === currentSize.width &&
      height === currentSize.height
    ) {
      return;
    }

    this[storeName] = size;

    if (this._containerSize && this._trackSize && this._thumbSize) {
      this.setState({
        containerSize: this._containerSize,
        trackSize: this._trackSize,
        thumbSize: this._thumbSize,
        allMeasured: true,
      });
    }
  };

  _getRatio = (value) =>
    (value - this.props.minimumValue) /
    (this.props.maximumValue - this.props.minimumValue);

  _getThumbLeft = (value) => {
    const ratio = this._getRatio(value);

    return (
      ratio * (this.state.containerSize.width - this.state.thumbSize.width)
    );
  };

  _getValue = (gestureState) => {
    const length = this.state.containerSize.width - this.state.thumbSize.width;
    const thumbLeft = this._previousLeft + gestureState.dx;

    const ratio = thumbLeft / length;

    if (this.props.step) {
      return Math.max(
        this.props.minimumValue,
        Math.min(
          this.props.maximumValue,
          this.props.minimumValue +
            Math.round(
              (ratio * (this.props.maximumValue - this.props.minimumValue)) /
                this.props.step
            ) *
              this.props.step
        )
      );
    }

    return Math.max(
      this.props.minimumValue,
      Math.min(
        this.props.maximumValue,
        ratio * (this.props.maximumValue - this.props.minimumValue) +
          this.props.minimumValue
      )
    );
  };

  _getCurrentValue = () => this.state.value.__getValue();

  _setCurrentValue = (value) => {
    this.state.value.setValue(value);
  };

  _setCurrentValueAnimated = (value) => {
    const animationType = this.props.animationType;

    const animationConfig = Object.assign(
      {},
      DEFAULT_ANIMATION_CONFIGS[animationType],
      this.props.animationConfig,
      { toValue: value }
    );

    Animated[animationType](this.state.value, animationConfig).start();
  };

  _fireChangeEvent = (event) => {
    if (this.props[event]) {
      this.props[event](this._getCurrentValue());
    }
  };

  _getTouchOverflowSize = () => {
    const state = this.state;
    const props = this.props;

    const size = {};

    if (state.allMeasured === true) {
      size.width = Math.max(
        0,
        props.thumbTouchSize.width - state.thumbSize.width
      );
      size.height = Math.max(
        0,
        props.thumbTouchSize.height - state.containerSize.height
      );
    }

    return size;
  };

  _getTouchOverflowStyle = () => {
    const { width, height } = this._getTouchOverflowSize();

    const touchOverflowStyle = {};

    if (width !== undefined && height !== undefined) {
      const verticalMargin = -height / 2;

      touchOverflowStyle.marginTop = verticalMargin;
      touchOverflowStyle.marginBottom = verticalMargin;

      const horizontalMargin = -width / 2;

      touchOverflowStyle.marginLeft = horizontalMargin;
      touchOverflowStyle.marginRight = horizontalMargin;
    }

    if (this.props.debugTouchArea === true) {
      touchOverflowStyle.backgroundColor = "orange";
      touchOverflowStyle.opacity = 0.5;
    }

    return touchOverflowStyle;
  };

  _thumbHitTest = (e) => {
    const nativeEvent = e.nativeEvent;
    const thumbTouchRect = this._getThumbTouchRect();

    return thumbTouchRect.containsPoint(
      nativeEvent.locationX,
      nativeEvent.locationY
    );
  };

  _getThumbTouchRect = () => {
    const state = this.state;
    const props = this.props;
    const touchOverflowSize = this._getTouchOverflowSize();

    return new Rect(
      touchOverflowSize.width / 2 +
        this._getThumbLeft(this._getCurrentValue()) +
        (state.thumbSize.width - props.thumbTouchSize.width) / 2,
      touchOverflowSize.height / 2 +
        (state.containerSize.height - props.thumbTouchSize.height) / 2,
      props.thumbTouchSize.width,
      props.thumbTouchSize.height
    );
  };
}

const defaultStyles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: "center",
  },

  track: {
    height: TRACK_SIZE,
    borderRadius: TRACK_SIZE / 2,
  },

  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
  },

  touchArea: {
    position: "absolute",
    backgroundColor: "transparent",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  debugThumbTouchArea: {
    position: "absolute",
    backgroundColor: "green",
    opacity: 0.5,
  },
});
