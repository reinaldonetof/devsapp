import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import Reducers from './src/Reducers';

import Preload from './src/screens/Preload';
import Home from './src/screens/Home';
import Conversas from './src/screens/Conversas';
import SignUp from './src/screens/SingUp';
import SignIn from './src/screens/SingIn';

console.disableYellowBox = true;

let store = createStore(Reducers, applyMiddleware(ReduxThunk));

const Navegador = createAppContainer(createStackNavigator({
  Preload: {
    screen: Preload,
  },
  Home: {
    screen: Home
  },
  Conversas: {
    screen: Conversas,
    navigationOptions: {
      header:null
    }
  },
  SignUp: {
    screen: SignUp
  },
  SignIn: {
    screen: SignIn
  },
}));

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Navegador />
      </Provider>
    );
  }
}