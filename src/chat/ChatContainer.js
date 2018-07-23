import React, { Component } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import Icon from "../commons/Icon";
import { COLORS, FONTS } from "../constants";
import { BackButton } from "../commons/BackButton"
let { height, width } = Dimensions.get("window");
import firebase from "react-native-firebase";
import { GiftedChat } from 'react-native-gifted-chat'

class ChatContainer extends Component {
    constructor(props) {
        super(props)
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.user = user;
            } else {
                firebase
                    .auth()
                    .signInAnonymously()
                    .catch(error => {
                        alert(error.message);
                    });
            }
        });
        this.chatRef = this.getRef().child("messages/"+this.user.uid)
        this.chatRefData = this.chatRef.orderByChild("order");
        this.state = {
            messages : []
        }
    }

    onSend(messages = []) {
        const {params} = this.props.navigation.state;
        messages.forEach(message => {
          //var message = message[0];
          var now = new Date().getTime();
          this.chatRef.push({
            _id: now,
            text: message.text,
            createdAt: now,
            sender_uid: this.user.uid,
            receiver_uid: params.friend.uid,
            order: -1 * now
          });
        });
      }

    loadMessage(chatRef){
        chatRef.on("value", snap => {
            let items = [];
            snap.forEach(child => {
                // console.log(child.val())
                items.push({
                    _id: child.val().createdAt,
                    text: child.val().text,
                    createdAt: new Date(child.val().createdAt),
                    user: {
                      _id: child.val().sender_uid
                      //avatar: avatar
                    }
                })
              });
              this.setState({ messages : items})
            //   console.log(items);
        })
    }

    getRef(){
        return firebase.database().ref();
    }
    componentDidMount(){
        this.loadMessage(this.chatRefData)
    }
    componentWillUnmount(){
        this.chatRefData.off();
    }


    render() {
        const { goBack } = this.props.navigation;
        const { params } = this.props.navigation.state;
        console.log(this.state.messages)
        return (
            <View style = {{flex: 1}}>

                <View style={[styles.wrapperHeader, {}]}>
                    <BackButton style={{ top: 10, left: 10, flex: 1 }} color={COLORS.LIGHT_COLOR} goBack={goBack} />
                    <View style={{ flex: 1, marginTop: 10 }}>
                        <Text style={{
                            fontSize: 20,
                            fontFamily: FONTS.MAIN_FONT,
                            color: COLORS.LIGHT_COLOR,
                        }}>{params.friend.name}</Text>
                    </View>
                    <View style={{ flex: 1, marginRight: -5 }}>
                    </View>
                    </View>
              
                <GiftedChat 
                  messages = {this.state.messages}
                  onSend = {this.onSend.bind(this)}
                  user={{
                    _id: this.user.id,
                  }}
                
                />

            </View>

        )
    }
}
export default ChatContainer;
const styles = StyleSheet.create({
    wrapperHeader: {
        backgroundColor: COLORS.BLUE_COLOR,
        width: width,
        height: 50,
        flexDirection: "row",

    }
})