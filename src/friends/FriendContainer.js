import React, { Component } from "react";
import { StyleSheet, FlatList, TouchableOpacity, View, Text } from "react-native";
import firebase from "react-native-firebase"
import Spinner from "react-native-loading-spinner-overlay";
import Icon from "../commons/Icon";
import { FONTS } from "../constants"

class FriendContainer extends Component {
    static navigationOptions = {
        title: 'Friend!',
      };
    constructor(props) {
        super(props);
        this.friendRef = null;
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
        
        
        this.state = {
            friends : [], 
            isLoading : false
        }
    }
    Friend() {
        this.setState({isLoading : true})
       
        this.friendRef = firebase.database().ref("friends");
        this.friendRef.on("value", snap => {
            let items = [];
            snap.forEach(child => {
                if (child.val().email != this.user.email)
                  items.push({
                    name: child.val().name,
                    uid: child.val().uid,
                    email: child.val().email
                  });
              });
              this.setState({isLoading : false, friends : items})
            //   console.log(items);
        }
         
    )
    }

    componentDidMount(){
        this.Friend();
    }
    render() {
        console.log(this.state.friends);
        return (
                    this.state.isLoading ?
                        <Spinner visible={true} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />

                        :

                    
                        <FlatList
                            style={{ flex: 1, marginLeft : 20, marginTop : 25}}
                            data={this.state.friends}
                            ListHeaderComponent= {(
                                <Text style = {{fontSize : 20, fontFamily : FONTS.MAIN_FONT_BOLD}}>{"Danh sách bạn bè"}</Text>
                            )}
                            renderItem={({ item }) => (
                                <TouchableOpacity activeOpacity={0.8} style={{ flexDirection: "row" , marginTop : 20}}
                                 onPress = {() => this.props.navigation.navigate("Chat", {friend : item})}
                                >
                                    <Icon name="FontAwesome|user" size={20} />
                                    <Text style={{ fontSize: 15, fontFamily: FONTS.MAIN_FONT }}>{item.name + "/"}
                                        <Text style = {{fontSize : 15, fontFamily : FONTS.MAIN_FONT_BOLD}}>
                                            {item.email}
                                        </Text>
                                    </Text>
                                </TouchableOpacity>
                            )}

                        />

                      

                



          
        )
    }
}
export default FriendContainer