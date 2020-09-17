import firebase from "../FirebaseCon";

export const signOut = () => {
  firebase.auth().signOut();

  return {
    type: "changeStatus",
    payload: {
      status: 2,
    },
  };
};

export const checkLogin = () => {
  return (dispatch) => {
    // Status 0 - Não foi requisitado se usuário logado ou não
    // Status 1 - Usuário Logado - Página de Conversas
    // Status 2 - Usuário não está logado - Página Home
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // Usuário está logado, ele chega com o USER capturado do firebase, pra saber se
        // tá logado ou não, caso esteja ele manda o uid pelo type
        dispatch({
          type: "changeUid",
          payload: {
            uid: user.uid,
          },
        });
      } else {
        // Usuário não está logado
        dispatch({
          type: "changeStatus",
          payload: {
            status: 2,
          },
        });
      }
    });
  };
};

export const signUp = (name, email, password, callback) => {
  console.disableYellowBox = true;
  return (dispatch) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        let uid = firebase.auth().currentUser.uid;

        firebase.database().ref("users").child(uid).set({
          name: name,
        });
        callback();
        dispatch({
          type: "changeUid",
          payload: {
            uid: uid,
          },
        });
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/weak-password":
            alert("Sua senha deve ter pelo menos 6 caracteres!");
            break;
          case "auth/invalid-email":
            alert("E-mail inválido para cadastro!");
            break;
          case "auth/email-already-in-use":
            alert("Este e-mail já está em uso por outro usuário!");
            break;
          case "auth/operation-is-not-allowed":
            alert("Tente novamente mais tarde!");
            break;
          default:
            alert("Ocorreu um erro!");
            break;
        }
        callback();
      });
  };
};

export const signIn = (email, password, callback) => {
  return (dispatch) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        let uid = firebase.auth().currentUser.uid;
        callback();
        dispatch({
          type: "changeUid",
          payload: {
            uid: uid,
          },
        });
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/invalid-email":
            alert("Email invalido!");
            break;
          case "auth/user-disabled":
            alert("Seu usuário está desativado!");
            break;
          case "auth/user-not-found":
            alert("Usuário não encontrado!");
            break;
          case "auth/wrong-password":
            alert("E-mail e/ou senha errados!");
            break;
        }
        callback();
      });
  };
};

export const changeEmail = (email) => {
  return {
    type: "changeEmail",
    payload: {
      email: email,
    },
  };
};

export const changePassword = (password) => {
  return {
    type: "changePassword",
    payload: {
      password: password,
    },
  };
};
export const changeName = (name) => {
  return {
    type: "changeName",
    payload: {
      name: name,
    },
  };
};
