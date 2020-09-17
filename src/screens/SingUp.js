import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { checkLogin, changeEmail, changePassword, changeName, signUp } from '../actions/AuthActions';
import { TextInput } from 'react-native-gesture-handler';
import LoadingItem from '../components/LoadingItem';

export class SignUp extends Component {

    static navigationOptions = {
        title: 'Cadastrar',
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    // Função quando alguma coisa na tela MUDA
    componentDidUpdate() {
        if (this.props.status == 1) {
            // Keyboard.dismiss(); é pra fechar o teclado! 
            Keyboard.dismiss();
            this.props.navigation.navigate('Conversas');
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Digite seu Nome:</Text>
                <TextInput onChangeText={this.props.changeName} value={this.props.name} style={styles.input} />

                <Text>Digite seu e-mail:</Text>
                <TextInput onChangeText={this.props.changeEmail} value={this.props.email} style={styles.input} />

                <Text>Digite sua senha:</Text>
                <TextInput onChangeText={this.props.changePassword} value={this.props.password} secureTextEntry={true} style={styles.input} />

                <Button title='Cadastrar' onPress={() => {
                    this.setState({ loading: true });
                    this.props.signUp(this.props.name, this.props.email, this.props.password, () => {
                        this.setState({ loading: false })
                    });
                }} />

                <LoadingItem visible={this.state.loading} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        height: 50,
        backgroundColor: '#DDDDDD',
        width: '80%',
        borderBottomWidth: 1,
        borderBottomColor: '#111111',
        fontSize: 23
    }
});

const mapStateToProps = (state) => {
    return {
        name: state.auth.name,
        email: state.auth.email,
        password: state.auth.password,
        status: state.auth.status
    };
};

const SignUpConnect = connect(mapStateToProps, {
    checkLogin,
    changeEmail,
    changePassword,
    changeName,
    signUp
})
    (SignUp);

export default SignUpConnect;