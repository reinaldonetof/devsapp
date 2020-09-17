import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { connect } from 'react-redux';
import { checkLogin } from '../actions/AuthActions';

export class Home extends Component {

    static navigationOptions = {
        title:'',
        header:null
    }

    constructor(props) {
        super(props);
        this.state = {};
        this.singinButton = this.singinButton.bind(this);
        this.singupButton = this.singupButton.bind(this);

    }

    singinButton() {
        this.props.navigation.navigate('SignIn');
    }

    singupButton() {
        this.props.navigation.navigate('SignUp')
    }

    render() {
        return(
            <View style={styles.container}>
                <Text style={styles.h1}> Devs App 1.0 </Text>
                <View style={styles.buttonArea}>
                    <Button onPress={this.singinButton} title='Login' />
                    <Button onPress={this.singupButton} title='cadastrar' />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        margin:10,
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    h1:{
        fontSize:30,
        marginBottom:50
    },
    buttonArea:{
        flexDirection:'row',
        width:'100%',
        justifyContent:'space-around'
    }
});

const mapStateToProps = (state) => {
    return {
        status:state.auth.status
    };
};

const HomeConnect = connect(mapStateToProps, { checkLogin })(Home);

export default HomeConnect;