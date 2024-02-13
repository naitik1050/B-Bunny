import React, { PureComponent } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Bars } from 'react-native-loader';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import CheckBox from 'react-native-check-box';
import Endpoint from '../res/url_endpoint';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import OTPTextView from 'react-native-otp-textinput';
import {
  widthPercentageToDP as wp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import firebase from 'react-native-firebase';


export default class Otp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.navigation.getParam('email'),
      password: this.props.navigation.getParam('password'),
      msg: this.props.navigation.getParam('msg'),
      value: this.props.navigation.getParam('value'),
      showPassword: true,
      errorText: '',
      hasError: false,
      loading: false,
      token: '',
      user_id: '',
      isChecked: false,
      userName: '',
      billing_type: '',
      following_count: '',
      email_verified: '',
      otp: '',
      push_id_token: ''
    };

    this.checkPermission();
    this.messageListener();

    NetInfo.addEventListener(state => {
      if (state.isConnected.toString() == 'false') {
        Alert.alert(
          'No network connection',
          'No internet connection. connect to the internet and try again.',
          [
            {
              text: 'ok',
              onPress: () => { },
            },
          ],
          { cancelable: false },
        );
      } else {
        this.storeData = this.storeData.bind(this);
      }
    });
  }

  componentDidMount() {
    console.log(this.state.msg);
    loc(this);
  }

  componentWillUnMount() {
    rol();
  }

  storeData = async () => {
    let obj = {
      user_id: this.state.user_id,
      token: this.state.token,
      userName: this.state.userName,
      billing_type: this.state.billing_type,
    };
    let ok = {
      following_count: this.state.following_count,
      email_verified: this.state.email_verified,
      from: 'login',
    };
    console.log('obj', obj);
    try {
      await AsyncStorage.setItem('visited_onces', JSON.stringify(obj));
      await AsyncStorage.setItem('onces', JSON.stringify(ok));
      this.props.navigation.navigate('personalizeFeed');
    } catch (e) {
      alert(e);
    }
    return true;
  };

  resendOTP = () => {
    var data = new FormData();
    data.append('email', this.state.email);
    console.log(data);

    fetch(Endpoint.endPoint.url + Endpoint.endPoint.resend_otp, {
      method: 'POST',
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status == true) {
          Toast.show(responseJson.msg, Toast.LONG);
        } else if (responseJson.status == false) {
          Toast.show(responseJson.msg, Toast.LONG);
        } else {
          Toast.show('Something went wrong', Toast.LONG);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  verifyOTP = () => {
    this.setState({ loading: true });
    var data = new FormData();

    if (this.state.value == 'otp') {
      data.append('active', this.state.isChecked == true ? 1 : 0)
    }
    // {
    //   this.state.value == 'otp'
    //     ? data.append('active', this.state.isChecked == true ? 1 : 0)
    //     : null;
    // }
    data.append('otp', this.state.otp);
    data.append('email', this.state.email);
    data.append('password', this.state.password);
    console.log(data);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.login_otp, {
      method: 'POST',
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({ loading: false });
        if (responseJson.status == true) {
          this.setState({
            token: responseJson.data.accessToken,
            user_id: responseJson.data.token.user_id,
            userName: responseJson.user.name,
            billing_type: responseJson.user.billing_type,
            following_count: responseJson.user.following_count,
            email_verified: responseJson.user.email_verified,
          });
          this.mobilePushNotification(responseJson);
          this.storeData();
        } else {
          Toast.show('Something went wrong', Toast.LONG);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };


  checkPermission = async () => {
    console.log("Check Permission");
    const enabled = await firebase.messaging().hasPermission();
    console.log('enabled==>', enabled);
    if (enabled) {
      this.getFcmToken();
    } else {
      this.requestPermission();
    }
  };

  getFcmToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    // alert(fcmToken)
    if (fcmToken) {
      console.log("FCM Token", fcmToken);
      //this.showAlert('Your Firebase Token is:', fcmToken);
      this.storeDeviceToken(fcmToken);
    } else {
      this.showAlert('Failed', 'No token received');
    }
  };

  messageListener = async () => {
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();

    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      // this.showAlert(title, body);
    }

    this.messageListener = firebase.messaging().onMessage(message => {
      console.log(JSON.stringify(message));
    });
  };

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
    } catch (error) {
      // User has rejected permissions
    }
  };

  showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: false },
    );
  };

  storeDeviceToken = async token => {
    this.setState({ push_id_token: token });
  };

  mobilePushNotification = responseJson => {
    var headers = new Headers();
    let auth = 'Bearer ' + responseJson.data.accessToken;
    // headers.append('Accept', 'application/json');
    // headers.append('Content-Type', 'application/json');
    headers.append('Authorization', auth);
    var data = new FormData();
    data.append('uuid', DeviceInfo.getUniqueId());
    data.append('push_id', this.state.push_id_token);
    data.append('platform', Platform.OS);
    data.append('type', 'android');
    // data.append('push_id', this.state.push_id_token);
    // data.append('user_id', responseJson.data.token.user_id);

    console.log("OTP Notification Data==>", auth);

    fetch(Endpoint.endPoint.url + Endpoint.endPoint.mobile_push_update_notification, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseNotification => {
        console.log("Notification OTP", responseNotification);
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const Device = require('react-native-device-detection');
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled">
            <StatusBar backgroundColor="#11075e" />
            {this.state.loading == true ? (
              <View style={styles.spinner}>
                <Bars size={wp('5%')} color="#11075e" />
              </View>
            ) : null}
            <View>
              <Text style={styles.heading}>One Time Password</Text>
              <Text style={styles.instruction}>
                Please type the verification code sent to {this.state.email}
              </Text>
              <OTPTextView
                containerStyle={styles.textInputContainer}
                handleTextChange={otp => this.setState({ otp: otp })}
                inputCount={6}
                tintColor="#11075e"
                keyboardType="numeric"
              />
              {this.state.value == 'otp' ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    paddingHorizontal: 10,
                  }}>
                  <CheckBox
                    style={{ flex: 1, padding: 10 }}
                    onClick={() => {
                      this.setState({
                        isChecked: !this.state.isChecked,
                      });
                    }}
                    checkedCheckBoxColor={'#11075e'}
                    isChecked={this.state.isChecked}
                  />
                  <Text
                    style={{
                      color: 'black',
                      fontSize: Device.isPhone
                        ? wp('4.5%')
                        : Device.isTablet
                          ? wp('2%')
                          : null,
                      padding: 10,
                      marginLeft: 10,
                    }}>
                    {this.state.msg}
                  </Text>
                </View>
              ) : null}
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: Device.isPhone
                      ? wp('4.5%')
                      : Device.isTablet
                        ? wp('2%')
                        : null,
                    padding: 10,
                  }}>
                  If you didn't receive a code!
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.resendOTP();
                  }}>
                  <Text
                    style={{
                      color: '#11075e',
                      fontSize: Device.isPhone
                        ? wp('4.5%')
                        : Device.isTablet
                          ? wp('2%')
                          : null,
                      fontWeight: 'bold',
                      paddingVertical: 10,
                    }}>
                    Resend
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: '#11075e',
                  marginTop: 20,
                  borderRadius: 5,
                }}
                onPress={() => {
                  this.verifyOTP();
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: Device.isPhone
                      ? wp('4.5%')
                      : Device.isTablet
                        ? wp('2%')
                        : null,
                    textAlign: 'center',
                    padding: 10,
                    paddingHorizontal: wp('15%'),
                  }}>
                  Validate OTP
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 5,
  },
  spinner: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 99999,
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffffab',
  },
  heading: {
    fontSize: 30,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333333',
    marginTop: 20,
  },
  instruction: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333333',
    marginTop: 20,
  },
  textInputContainer: {
    marginBottom: 20,
  },
});
