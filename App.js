import React from "react";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import { StyleSheet, View } from "react-native";
import productsReducer from "./store/reducers/products";

const rootReducer = combineReducers({ products: productsReducer });
const store = createStore(rootReducer);

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}></View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
