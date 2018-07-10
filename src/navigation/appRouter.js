import {StackNavigator} from "react-navigation";
import LoginContainer from "../login/LoginContainer";
import RegisterContainer from "../register/RegisterContainer";
import ChatContainer from "../chat/ChatContainer";
export const RootStack = StackNavigator({
    Login : {screen : LoginContainer},
    Register : {screen : RegisterContainer},
    Chat : {screen : ChatContainer},
}, {headerMode : "none"})