import React from "react";
import { render } from "@testing-library/react-native";
import ImageFullScreen from "../__mocks__/ImageFullScreen";

describe("ImageFullScreen component", () => {
            test("renders with correct image source", () => {
                    const mockRoute = {
                        params: {
                            source: require("../__mocks__/mapaction.jpeg"), // Provide a sample image path
                        },
                    };
                    const { getByTestId } = render( < ImageFullScreen route = { mockRoute }
                        />);

                        // Find the image component by its testID
                        const imageComponent = getByTestId("fullscreen-image");

                        // Assert that the image component is rendered
                        expect(imageComponent).toBeTruthy();

                        // Optionally, you can also assert other properties or styles of the image component
                        expect(imageComponent.props.source).toEqual(mockRoute.params.source);
                    });
            });