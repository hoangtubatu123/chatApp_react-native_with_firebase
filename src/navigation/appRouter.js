import {createStackNavigator} from "react-navigation";
import LoginContainer from "../login/LoginContainer";
import RegisterContainer from "../register/RegisterContainer";
import ChatContainer from "../chat/ChatContainer";
import FriendContainer from "../friends/FriendContainer"
const Chat = createStackNavigator({
    Chat : {screen : ChatContainer}
}, {navigationOptions : {
    title : "Global Chat"
}})




export const RootStack = createStackNavigator({
    Login : {screen : LoginContainer},
    Register : {screen : RegisterContainer},
    Friend : {screen : FriendContainer},
    Chat : {screen : ChatContainer},
}, {headerMode : "none"})