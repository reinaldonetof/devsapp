import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyDLAsISHXCDc_2c4Ikve3RMUaXduFLu-lM",
    authDomain: "devsapp-cb5bd.firebaseapp.com",
    databaseURL: "https://devsapp-cb5bd.firebaseio.com",
    projectId: "devsapp-cb5bd",
    storageBucket: "devsapp-cb5bd.appspot.com",
    messagingSenderId: "415802615591",
    appId: "1:415802615591:web:99422198c9b2b320"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;