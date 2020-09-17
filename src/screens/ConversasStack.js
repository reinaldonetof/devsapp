import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
// import { connect } from 'react-redux';

import ConversasList from './ConversasList';
import ConversaInterna from './ConversaInterna';


const ConversasStackNavigator = createAppContainer(createStackNavigator({

    ConversasList:{
        screen:ConversasList,
        navigationOptions:{
            header:null
        }
    },
    ConversaInterna:{
        screen:ConversaInterna,
    },
}));

export default ConversasStackNavigator;
