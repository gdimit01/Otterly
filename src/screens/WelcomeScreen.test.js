import React from "react";
import WelcomeScreen from "./WelcomeScreen"; // Update the path as necessary
import { render, fireEvent, act } from "react-native-testing-library";
import { Asset } from "expo-asset";

// Mock the Asset.loadAsync function to resolve immediately
jest.mock("expo-asset", () => ({
  ...jest.requireActual("expo-asset"),
  loadAsync: jest.fn(() => Promise.resolve()),
}));

describe("WelcomeScreen", () => {
  it("renders correctly while loading", async () => {
    const navigation = { navigate: jest.fn() };
    const { queryByTestId } = render(<WelcomeScreen navigation={navigation} />);

    // Ensure the ActivityIndicator is initially present
    const activityIndicator = queryByTestId("loading-indicator");
    expect(activityIndicator).toBeTruthy();

    // Wait for the images to be pre-loaded
    await act(() => Promise.resolve());

    // Ensure the ActivityIndicator is removed after images are pre-loaded
    expect(queryByTestId("loading-indicator")).toBeNull();
  });

  it("navigates to Sign Up screen when Sign Up button is pressed", async () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<WelcomeScreen navigation={navigation} />);

    await act(() => Promise.resolve());

    const signUpButton = getByText("Sign Up");
    fireEvent.press(signUpButton);
    expect(navigation.navigate).toHaveBeenCalledWith("SignUp");
  });

  it("navigates to Login screen when Log in link is pressed", async () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<WelcomeScreen navigation={navigation} />);

    await act(() => Promise.resolve());

    const logInLink = getByText("Log in");
    fireEvent.press(logInLink);
    expect(navigation.navigate).toHaveBeenCalledWith("Login");
  });
});
