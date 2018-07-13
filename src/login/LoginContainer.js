import React, { Component } from 'react'
import {
    ActivityIndicator,
    Alert, AsyncStorage,
    Image,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    TouchableOpacity, Keyboard,
    View, TouchableWithoutFeedback,
    StyleSheet,

} from 'react-native';
import { STRINGS, COLORS, SIZES, FONTS } from '../constants';
import { Container, Item, Button, Text, Input, Form, Label } from 'native-base';
import { InputCommon, ButtonCommon, } from '../commons';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {NavigationActions, StackActions} from "react-navigation";
import firebase from "react-native-firebase";


class LoginContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
             email : "",
             password : "",
             isLoading : false,
             errorMessage : null,
        }
      
    }
    async componentWillMount(){
       const email =  await AsyncStorage.getItem("email");
       const password =  await AsyncStorage.getItem("password");
       this.setState({email : email, password : password});
       this.signInWithAccount() ; 

    }
     signInWithAccount = async () => {
        this.setState({ errorMessage: null, isloading: true });
        const { email, password } = this.state;
       
        firebase
          .auth()
          .signInWithEmailAndPassword(this.state.email, this.state.password)
          .then(() => {
            this.setState({ loading: false });
          })
          .catch(error => {
            var errorCode = error.code;
            var errorMessage = error.message;
            this.setState({
              errorMessage,
              loading: false
            });
          });
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("password", password);
    
        firebase.auth().onAuthStateChanged(user => {
          if (user) {
            this.setState({
              loading: false
            });
            const resetAction = StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'Friend'})
                ]
            })
            this.props.navigation.dispatch(resetAction)
          }
        });

    
      
    }
    renderErrorMessage = () => {
        if (this.state.errorMessage)
          return <Text style={styles.error}>{this.state.errorMessage}</Text>;
      };

    render() {
        const { navigate } = this.props.navigation;
        return (
            <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: COLORS.LIGHT_COLOR }}
            enableOnAndroid={true}
            scrollEnabled={false}
            extraHeight={100}
        >

                <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
                    <Container>
                        <StatusBar
                            barStyle={COLORS.BAR_STYLE_LOGIN}
                            backgroundColor={COLORS.MAIN_COLOR}
                        />

                        {/* logo */}
                        <View style={styles.wrapperLogo}>
                        <Image style={{ width: '50%', height: '50%' }}
                                source={require('../../assets/image/Image_2.png')}
                                resizeMode={'contain'}

                            />
                        </View>

                        <View style={{ flex: 1, backgroundColor: COLORS.LIGHT_COLOR }} />

                        {/* form input */}
                        <View style={styles.contentForm}>
                            <InputCommon
                                returnKeyType={'next'}
                                size={styles.input}
                                value={this.state.email}
                                label={STRINGS.EMAIL.toUpperCase()}
                                onChangeText={(email) => {this.setState({email : email})}}
                            />

                            <InputCommon
                                returnKeyType={'go'}
                                secureTextEntry={true}
                                size={styles.input}
                                value={this.state.password}
                                label={STRINGS.PASSWORD.toUpperCase()}
                                onChangeText={(password) => {this.setState({password : password})}}
                                onSubmitEditing={this.signInWithAccount}
                            />
                            <View height={30} />
                        </View>
                        <View style={styles.wrapperButton}>
                            <ButtonCommon
                                isLoading={this.state.isLoading}
                                onPress={this.signInWithAccount}
                                label={STRINGS.LOGIN.toUpperCase()}
                                text={{
                                    fontFamily: 'Roboto-Bold',
                                    fontSize: SIZES.SUBTITLE_SIZE
                                }}
                            />
                        </View>


                        <View style={[wrapperCenter, { flexDirection: 'row', bottom: 30, backgroundColor: COLORS.NONE_COLOR }]}>
                            <Text style={[styles.textButton, { color: COLORS.GRAY_COLOR }]}>
                                {STRINGS.YOU_HAVE_NOT_ACCOUNT}
                            </Text>
                            <TouchableOpacity
                                activeOpacity={SIZES.ACTIVE_OPACITY}
                                onPress={() => navigate("Register")}>
                                <Text style={styles.textButton}>{STRINGS.REGISTER_HERE}</Text>
                            </TouchableOpacity>

                        </View>
                        {this.renderErrorMessage()}
                    </Container>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
        );
    }
}

const wrapperCenter = {
    justifyContent: 'center',
    alignItems: 'center',
}

const textLogo = {
    fontFamily: FONTS.LOGO_FONT,
    backgroundColor: 'transparent',
    color: COLORS.LIGHT_COLOR,
}

const text = {
    fontFamily: 'Roboto-Regular',
    backgroundColor: 'transparent',
    color: COLORS.DARK_COLOR,
    fontSize: SIZES.TEXT_BUTTON_SIZE,
}

const styles = StyleSheet.create({
    textLogoColor: {
        ...textLogo,
        fontSize: SIZES.LOGO_COLOR_SIZE,
    },
    textLogoMe: {
        ...textLogo,
        fontSize: SIZES.LOGO_ME_SIZE,
        marginTop: -40,
    },
    textButton: {
        ...text
    },
    wrapperButton: {
        ...wrapperCenter,
        width: SIZES.DEVICE_WIDTH_SIZE,
        position: 'absolute',
        bottom: SIZES.DEVICE_HEIGHT_SIZE / 4 - 30,
        paddingHorizontal: 80,
    },
    wrapperLogo: {
        ...wrapperCenter,
        flex: 1,
        backgroundColor: COLORS.MAIN_COLOR,
    },
    contentForm: {
        ...wrapperCenter,
        backgroundColor: COLORS.LIGHT_COLOR,
        width: SIZES.FORM_LOGIN_WIDTH_SIZE,
        borderRadius: SIZES.BORDER_RADIUS_CARD_SIZE,
        elevation: 5,
        bottom: SIZES.DEVICE_HEIGHT_SIZE / 4 - 10,
        shadowColor: COLORS.SHADOW_COLOR,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        marginHorizontal: SIZES.DEVICE_WIDTH_SIZE * 0.1,
        padding: SIZES.PADDING_ELEMENT_IN_CARD,
        position: 'absolute',
    },
    input: {
        width: SIZES.DEVICE_WIDTH_SIZE * 0.7,
        marginBottom: 10,
    }

});
export default LoginContainer