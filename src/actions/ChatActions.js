import firebase from "../FirebaseCon";

export const getChatList = (userUid, callback) => {
  return (dispatch) => {
    firebase
      .database()
      .ref("users")
      .child(userUid)
      .child("chats")
      .on("value", (snapshot) => {
        let chats = [];

        snapshot.forEach((childItem) => {
          chats.push({
            key: childItem.key, //identificar o key do chat
            title: childItem.val().title,
            member: childItem.val().member,
          });
        });

        callback();

        dispatch({
          type: "setChatList",
          payload: {
            chats: chats,
          },
        });
      });
  };
};

export const getContactList = (userUid, callback) => {
  return (dispatch) => {
    firebase
      .database()
      .ref("users")
      .orderByChild("name")
      .once("value")
      .then((snapshot) => {
        let users = [];
        snapshot.forEach((childItem) => {
          if (childItem.key != userUid) {
            users.push({
              key: childItem.key,
              name: childItem.val().name,
            });
          }
        });

        callback();

        dispatch({
          type: "setContactList",
          payload: {
            users: users,
          },
        });
      });
  };
};

export const createChat = (userUidLogado, userUidConversar, titleName) => {
  return (dispatch) => {
    // criando o próprio chat
    let newChat = firebase.database().ref("chats").push();
    newChat.child("members").child(userUidLogado).set({
      id: userUidLogado,
    });
    newChat.child("members").child(userUidConversar).set({
      id: userUidConversar,
    });

    // associando aos envolvidos
    let chatId = newChat.key;

    firebase
      .database()
      .ref("users")
      .child(userUidConversar)
      .once("value")
      .then((snapshot) => {
        firebase
          .database()
          .ref("users")
          .child(userUidLogado)
          .child("chats")
          .child(chatId)
          .set({
            id: chatId,
            title: snapshot.val().name,
            member: userUidConversar,
          });
      });

    firebase
      .database()
      .ref("users")
      .child(userUidLogado)
      .once("value")
      .then((snapshot) => {
        firebase
          .database()
          .ref("users")
          .child(userUidConversar)
          .child("chats")
          .child(chatId)
          .set({
            id: chatId,
            title: snapshot.val().name,
            member: userUidLogado,
          })
          .then(() => {
            dispatch({
              type: "setActiveChat",
              payload: {
                chatId: chatId,
                chatTitleName: titleName,
              },
            });
          });
      });
  };
};

export const setActiveChat = (chatId, chatTitleName) => {
  return {
    type: "setActiveChat",
    payload: {
      chatId: chatId,
      chatTitleName: chatTitleName,
    },
  };
};

export const sendImage = (blob, progressCallback, successCallback) => {
  return (dispatch) => {
    let tmpKey = firebase.database().ref("chats").push().key;

    let fbimage = firebase.storage().ref().child("images").child(tmpKey);

    fbimage.put(blob, { contentType: "image/jpeg" }).on(
      "state_changed",
      progressCallback,

      (error) => {
        alert(error.code);
      },

      () => {
        fbimage.getDownloadURL().then((url) => {
          successCallback(url);
        });
      }
    );
  };
};

export const sendMessage = (msgType, msgContent, userUidLogado, activeChat) => {
  return (dispatch) => {
    let currentDate = "";
    let cDate = new Date();

    // YYYY-MM-DD HH:mm:ss
    currentDate =
      cDate.getFullYear() +
      "-" +
      (cDate.getMonth() + 1 < 10
        ? "0" + (cDate.getMonth() + 1)
        : cDate.getMonth() + 1) +
      "-";
    currentDate +=
      (cDate.getDate() < 10 ? "0" + cDate.getDate() : cDate.getDate()) + " ";
    currentDate +=
      (cDate.getHours() < 10 ? "0" + cDate.getHours() : cDate.getHours()) + ":";
    currentDate +=
      (cDate.getMinutes() < 10
        ? "0" + cDate.getMinutes()
        : cDate.getMinutes()) + ":";
    currentDate +=
      cDate.getSeconds() < 10 ? "0" + cDate.getSeconds() : cDate.getSeconds();

    let msgId = firebase
      .database()
      .ref("chats")
      .child(activeChat)
      .child("messages")
      .push();

    switch (msgType) {
      case "text":
        msgId.set({
          msgType: "text",
          date: currentDate,
          m: msgContent,
          uid: userUidLogado,
        });
        break;
      case "image":
        msgId.set({
          msgType: "image",
          date: currentDate,
          imgSource: msgContent,
          uid: userUidLogado,
        });
        break;
    }
    // Não é necessário dar o dispatch, pois no envio de mensagem só vai mandar pro banco de dados e pronto
  };
};

export const monitorChat = (activeChat) => {
  return (dispatch) => {
    firebase
      .database()
      .ref("chats")
      .child(activeChat)
      .child("messages")
      .orderByChild("date")
      .on("value", (snapshot) => {
        let arrayMsg = [];

        snapshot.forEach((childItem) => {
          switch (childItem.val().msgType) {
            case "text":
              arrayMsg.push({
                key: childItem.key,
                date: childItem.val().date,
                msgType: childItem.val().msgType,
                m: childItem.val().m,
                uid: childItem.val().uid,
              });
              break;

            case "image":
              arrayMsg.push({
                key: childItem.key,
                date: childItem.val().date,
                msgType: childItem.val().msgType,
                imgSource: childItem.val().imgSource,
                uid: childItem.val().uid,
              });
              break;
          }
        });

        dispatch({
          type: "setActiveChatMessage",
          payload: {
            msgs: arrayMsg,
          },
        });
      });
  };
};

export const monitorChatOff = (activeChat) => {
  return (dispatch) => {
    firebase.database().ref("chats").child(activeChat).child("messages").off();
  };
};
