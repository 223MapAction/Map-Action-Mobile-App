import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import RecordVideo from "../../shared/RecordVideo";

describe("RecordVideo", () => {
  test("renders correctly", () => {
    const { getByTestId } = render(<RecordVideo visible={true} />);
    const recordVideo = getByTestId("record-video");
    expect(recordVideo).toBeDefined();
  });

  test("record button works", async () => {
    const { getByTestId } = render(<RecordVideo visible={true} />);
    const recordButton = getByTestId("record-button");
    fireEvent.press(recordButton);
    // Add assertions to verify the behavior after pressing the record button
  });

  test("camera is displayed", () => {
    const { getByTestId } = render(<RecordVideo visible={true} />);
    const camera = getByTestId("camera");
    expect(camera).toBeDefined();
  });

  test("hides when modal is closed", async () => {
    const onHideMock = jest.fn();
    const { getByTestId } = render(
      <RecordVideo visible={true} onHide={onHideMock} />
    );
    const modal = getByTestId("modal");
    fireEvent.press(modal);
    expect(onHideMock).toHaveBeenCalled();
  });
});
