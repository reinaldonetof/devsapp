import React, { Component } from "react";
import {
  createMaterialTopTabNavigator,
  createAppContainer,
  createStackNavigator,
} from "react-navigation";
// import { connect } from 'react-redux';

import ConversasStack from "./ConversasStack";
import ContatoList from "./ContatoList";
import Config from "./Config";

let hCheck = 0;

const ConversasNavigator = createAppContainer(
  createStackNavigator({
    StackNavegador: {
      screen: createAppContainer(
        createMaterialTopTabNavigator(
          {
            ConversasStack: {
              screen: ConversasStack,
              navigationOptions: ({ navigation }) => {
                let tabBarVisibility = true;

                let { routeName } = navigation.state.routes[
                  navigation.state.index
                ];

                if (routeName == "ConversaInterna") {
                  tabBarVisibility = false;
                  hCheck = null;
                } else {
                  hCheck = 0;
                }
                return {
                  tabBarLabel: "Conversas",
                  tabBarVisible: tabBarVisibility,
                  header: null,
                };
              },
            },
            ContatoList: {
              screen: ContatoList,
              navigationOptions: {
                header: null,
              },
            },
            Config: {
              screen: Config,
              navigationOptions: {
                header: null,
              },
            },
          },
          {
            tabBarPosition: "top",
            swipeEnabled: false,
          }
        )
      ),
      navigationOptions: ({ navigation }) => {
        return {
          title: "DevsApp",
          header: hCheck,
        };
      },
    },
  })
);

export default ConversasNavigator;
