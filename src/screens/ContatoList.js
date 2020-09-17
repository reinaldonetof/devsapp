import React, { Component } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import { FlatList } from "react-native-gesture-handler";
import {
  getContactList,
  createChat,
  setActiveChat,
} from "../actions/ChatActions";
import { ContatoItem } from "../components/ContatoList/ContatoItem";

export class ContatoList extends Component {
  static navigationOptions = {
    title: "",
    tabBarLabel: "Contato",
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };

    this.props.getContactList(this.props.uid, () => {
      this.setState({ loading: false });
    });

    this.contatoClick = this.contatoClick.bind(this);
  }

  contatoClick(item) {
    let found = false;

    for (var i in this.props.chats) {
      if (this.props.chats[i].member == item.key) {
        found = true;
        activeChatKey = this.props.chats[i].key;
        activeTitleChat = this.props.chats[i].title;
      }
    }

    if (found == false) {
      this.props.createChat(this.props.uid, item.key, item.name);
      this.props.navigation.navigate("ConversasStack");
    } else {
      this.props.setActiveChat(activeChatKey, activeTitleChat);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.loading && <ActivityIndicator size="large" />}
        <FlatList
          data={this.props.contacts}
          renderItem={({ item }) => (
            <ContatoItem data={item} onPress={this.contatoClick}></ContatoItem>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
});

const mapStateToProps = (state) => {
  return {
    // auth -> nome dado no script Reducers.js
    uid: state.auth.uid,
    // chat -> nome dado no script Reducers.js
    contacts: state.chat.contacts,
    activeChatTitle: state.chat.activeChatTitle,
    chats: state.chat.chats,
  };
};

const ContatoListConnect = connect(mapStateToProps, {
  getContactList,
  createChat,
  setActiveChat,
})(ContatoList);

export default ContatoListConnect;
