import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Popup from "../../shared/Popup";
import { Text } from "react-native";
describe("Popup", () => {
  test("renders children correctly", () => {
    const { getByText } = render(
      <Popup onHide={() => {}}>
        <Text>Test content</Text>
      </Popup>
    );
    const testContent = getByText("Test content");
    expect(testContent).toBeDefined();
  });

  test("calls onHide function when modal is closed", () => {
    const onHideMock = jest.fn();
    const { getByTestId } = render(<Popup onHide={onHideMock} />);
    const modal = getByTestId("modal");

    fireEvent(modal, "onRequestClose");

    expect(onHideMock).toHaveBeenCalled();
  });
});
