import React from "react";
import { render } from "@testing-library/react-native";
import Icon from "../../shared/icon";

describe("Icon", () => {
  test("renders correctly", () => {
    const { getByTestId } = render(
      <Icon focused={true} name="example-icon" color="red" />
    );
    const icon = getByTestId("icon");
    expect(icon).toBeDefined();
  });

  test("renders correct icon based on focused prop", () => {
    const { getByTestId, rerender } = render(
      <Icon focused={true} name="focused-icon" color="red" />
    );
    let icon = getByTestId("icon");
    expect(icon.props.name).toBe("focused-icon");

    rerender(<Icon focused={false} name="unfocused-icon" color="blue" />);
    icon = getByTestId("icon");
    expect(icon.props.name).toBe("unfocused-icon");
  });

  test("renders correct color", () => {
    const { getByTestId } = render(
      <Icon focused={true} name="example-icon" color="red" />
    );
    const icon = getByTestId("icon");
    expect(icon.props.style.color).toBe("red");
  });
});
