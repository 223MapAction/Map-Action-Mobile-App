import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import TabBar from "../../components/TabBar";

describe("TabBar", () => {
  it("should navigate to 'Picture' screen when pressed", () => {
    const navigationMock = { push: jest.fn() };

    const { getByTestId } = render(<TabBar navigation={navigationMock} />);

    const touchableOpacity = getByTestId("tab-bar-button");
    fireEvent.press(touchableOpacity);

    expect(navigationMock.push).toHaveBeenCalledWith("Picture");
  });
});
