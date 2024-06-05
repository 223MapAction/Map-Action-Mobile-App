import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import AudioReader from "../../shared/AudioReader";

describe("AudioReader", () => {
  test("renders correctly", () => {
    const { getByTestId } = render(<AudioReader />);
    const audioReader = getByTestId("audio-reader");
    expect(audioReader).toBeDefined();
  });

  test("play button works", async () => {
    const { getByTestId } = render(<AudioReader />);
    const playButton = getByTestId("play-button");
    fireEvent.press(playButton);
  });

  test("pause button works", async () => {
    const { getByTestId } = render(<AudioReader />);
    const pauseButton = getByTestId("pause-button");
    fireEvent.press(pauseButton);
  });

  test("seek slider works", async () => {
    const { getByTestId } = render(<AudioReader />);
    const seekSlider = getByTestId("seek-slider");
    fireEvent.change(seekSlider, { nativeEvent: { value: 0.5 } });
  });
});
