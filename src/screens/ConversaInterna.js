import React, { Component } from "react";
import {
  Text,
  View,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  TouchableHighlight,
  BackHandler,
  Modal,
} from "react-native";
import { connect } from "react-redux";
import {
  setActiveChat,
  sendMessage,
  monitorChat,
  monitorChatOff,
  sendImage,
} from "../actions/ChatActions";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { MensagemItem } from "../components/ConversaInterna/MensagemItem";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "rn-fetch-blob";

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = RNFetchBlob.polyfill.Blob;

export class ConversaInterna extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    headerLeft: (
      <TouchableHighlight
        onPress={() => {
          navigation.state.params.voltarFunction();
        }}
        underlayColor={false}
      >
        <Image
          source={require("../../node_modules/react-navigation-stack/src/views/assets/back-icon.png")}
          style={{ width: 25, height: 25, marginLeft: 20 }}
        />
      </TouchableHighlight>
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      inputText: "",
      actChat: "",
      pct: 0,
      modalVisible: false,
      modalImage: null,
    };

    this.voltar = this.voltar.bind(this);
    this.sendMsg = this.sendMsg.bind(this);
    this.chooseImage = this.chooseImage.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.imagePress = this.imagePress.bind(this);
  }

  // quando a tela é criada
  componentDidMount() {
    this.props.monitorChat(this.props.activeChat);

    this.props.navigation.setParams({ voltarFunction: this.voltar });
    BackHandler.addEventListener("hardwareBackPress", this.voltar);
  }

  // quando a tela é finalizada
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.voltar);
  }

  setModalVisible(status) {
    let state = this.state;
    state.modalVisible = status;
    this.setState(state);
  }

  imagePress(img) {
    let state = this.state;
    state.modalImage = img;
    this.setState(state);

    this.setModalVisible(true);
  }

  voltar() {
    this.props.monitorChatOff(this.props.activeChat);

    this.props.setActiveChat("");
    this.props.navigation.goBack();

    return true;
  }

  chooseImage() {
    ImagePicker.showImagePicker(null, (r) => {
      if (r.uri) {
        let uri = r.uri.replace("file://", "");

        RNFetchBlob.fs
          .readFile(uri, "base64")
          .then((data) => {
            return RNFetchBlob.polyfill.Blob.build(data, {
              type: "image/jpeg;BASE64",
            });
          })
          .then((blob) => {
            this.props.sendImage(
              blob,
              (snapshot) => {
                let pct =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                let state = this.state;
                state.pct = pct;
                this.setState(state);
              },
              (imgName) => {
                let state = this.state;
                state.pct = 0;
                this.setState(state);

                this.props.sendMessage(
                  "image",
                  imgName,
                  this.props.uid,
                  this.props.activeChat
                );
              }
            );
          });
      }
    });
  }

  sendMsg() {
    let txt = this.state.inputText;
    this.props.sendMessage("text", txt, this.props.uid, this.props.activeChat);

    let state = this.state;
    state.inputText = "";
    this.setState(state);
  }

  render() {
    let areaBehavior = Platform.select({ ios: "padding", android: null });
    let areaOffset = Platform.select({ ios: 64, android: null }); //64 é PADRÃO no ios

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={areaBehavior}
        keyboardVerticalOffset={areaOffset}
      >
        <FlatList
          ref={(ref) => {
            this.chatArea = ref;
          }}
          onContentSizeChange={() => {
            this.chatArea.scrollToEnd({ animated: true });
          }}
          onLayout={() => {
            this.chatArea.scrollToEnd({ animated: true });
          }}
          style={styles.chatArea}
          data={this.props.activeChatMessage}
          renderItem={({ item }) => (
            <MensagemItem
              data={item}
              me={this.props.uid}
              onImagePress={this.imagePress}
            />
          )}
        />
        {this.state.pct > 0 && (
          <View style={styles.imageTmp}>
            <View
              style={[{ width: this.state.pct + "%" }, styles.imageTmpBar]}
            ></View>
          </View>
        )}
        <View style={styles.sendArea}>
          <TouchableHighlight
            style={styles.imgButton}
            onPress={this.chooseImage}
          >
            <Image
              style={styles.imgButtonImage}
              source={require("../assets/images/new_image.png")}
            />
          </TouchableHighlight>
          <TextInput
            style={styles.sendInput}
            value={this.state.inputText}
            onChangeText={(inputText) => this.setState({ inputText })}
          />
          <TouchableHighlight
            disabled={this.state.inputText == "" ? true : false}
            style={styles.sendButton}
            onPress={this.sendMsg}
          >
            <Image
              style={styles.sendImage}
              source={require("../assets/images/send.png")}
            />
          </TouchableHighlight>
        </View>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
        >
          <View style={styles.modalView}>
            <TouchableHighlight
              onPress={() => {
                this.setModalVisible(false);
              }}
            >
              <Image
                source={require("../../node_modules/react-navigation-stack/src/views/assets/back-icon.png")}
                style={{
                  width: 25,
                  height: 25,
                  marginLeft: 20,
                  tintColor: "#FFFFFF",
                }}
              />
            </TouchableHighlight>
            <View style={styles.modalViewImage}>
              <Image
                resizeMode="contain"
                style={styles.modalImage}
                source={{ uri: this.state.modalImage }}
              />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatArea: {
    flex: 1,
    backgroundColor: "#CCCCCC",
  },
  sendArea: {
    height: 50,
    backgroundColor: "#EEEEEE",
    flexDirection: "row",
  },
  sendInput: {
    height: 50,
    flex: 1,
  },
  sendButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  sendImage: {
    width: 30,
    height: 30,
  },
  imgButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  imgButtonImage: {
    width: 30,
    height: 30,
  },
  imageTmp: {
    height: 10,
  },
  imageTmpBar: {
    height: 10,
    backgroundColor: "#836FFF",
  },
  modalView: {
    backgroundColor: "#000000",
    flex: 1,
  },
  modalViewImage: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  modalImage: {
    width: "100%",
    height: "100%",
  },
});

const mapStateToProps = (state) => {
  return {
    status: state.auth.status,
    uid: state.auth.uid,
    activeChat: state.chat.chatAtivo,
    activeChatMessage: state.chat.activeChatMessage,
  };
};

const ConversaInternaConnect = connect(mapStateToProps, {
  setActiveChat,
  sendMessage,
  monitorChat,
  monitorChatOff,
  sendImage,
})(ConversaInterna);

export default ConversaInternaConnect;
