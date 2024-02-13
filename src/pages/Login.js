import React, { PureComponent } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Alert,
  Dimensions,
  BackHandler,
  Platform,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import InputField from '../component/InputField';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Form, Field } from 'react-native-validate-form';
import { SafeAreaView, withNavigationFocus } from 'react-navigation';
import { encode as btoa } from 'base-64';
import { Bars } from 'react-native-loader';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import Endpoint from '../res/url_endpoint';
import NetInfo from '@react-native-community/netinfo';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import firebase from 'react-native-firebase';
import Toast from 'react-native-simple-toast';


const required = value => (value ? undefined : 'This is a required field.');
const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
    ? 'Invalid email address!'
    : undefined;
const Device = require('react-native-device-detection');
class Login extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      showPassword: true,
      errorText: '',
      token: '',
      user_id: '',
      userName: '',
      billing_type: '',
      following_count: '',
      email_verified: '',
      hasError: false,
      loading: false,
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

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  // componentWillUnmount() {
  //   BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  // }

  handleBackButton = () => {
    if (this.props.isFocused) {
      return BackHandler.exitApp();
    }
  };

  storeData = async () => {

    console.log("Storedata===>");
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
    console.log('loginobj', obj);
    try {
      await AsyncStorage.setItem('visited_onces', JSON.stringify(obj));
      await AsyncStorage.setItem('onces', JSON.stringify(ok));
      this.props.navigation.navigate('personalizeFeed', {
        files: this.state.files,
      });
    } catch (e) {
      console.log(e);
      // alert(e);
    }
    return true;
  };

  submitForm = () => {
    let submitResults = this.myForm.validate();
    let errors = [];
    submitResults.forEach(item => {
      errors.push({ field: item.fieldName, error: item.error });
    });
    this.setState({ errors: errors });
  };

  submitFailed() {
    console.log('Login Faield!');
  }

  login = () => {
    // console.log("Browser==>", 'mobile app');
    // console.log("device==>", DeviceInfo.getModel());
    // console.log("os==>", Platform.OS + " " + DeviceInfo.getSystemVersion());
    // console.log("uuid==>", DeviceInfo.getUniqueId());
    this.setState({ loading: true });
    var data = new FormData();
    data.append('grant_type', 'password');
    data.append('client_id', 3);
    data.append('email', this.state.email);
    data.append('password', this.state.password);
    data.append('browser', 'mobile app');
    data.append('device', DeviceInfo.getModel());
    data.append('os', Platform.OS + " " + DeviceInfo.getSystemVersion());
    data.append('uuid', DeviceInfo.getUniqueId());

    console.log(data);
    var headers = new Headers();
    let encode = btoa('bbdev:bbdev01!');
    let auth = 'Basic ' + encode;
    headers.append('Authorization', auth);
    console.log(headers);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.login, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log("Login Response", responseJson);
        this.setState({ loading: false });
        // this.mobilePushNotification(responseJson);
        if (responseJson.status == true) {
          if (responseJson.data.authenticator == false) {
            this.props.navigation.navigate('otp', {
              email: this.state.email,
              password: this.state.password,
            });
          } else {
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
          }
        }
        else if (responseJson.status == false) {
          Toast.show(responseJson.msg, Toast.LONG);
          // if (responseJson.msg == 'Unauthorised Login') {
          //   alert(responseJson.msg);
          // } else {
          //   this.props.navigation.navigate('otp', {
          //     email: this.state.email,
          //     password: this.state.password,
          //     msg: responseJson.msg,
          //     value: 'otp',
          //   });
          // }
        }
        else {
          alert('Something went wrong');
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
      console.log(title, body);
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

    console.log("DATA==>", data)
    console.log("API==>", Endpoint.endPoint.url + Endpoint.endPoint.mobile_push_update_notification);

    fetch(Endpoint.endPoint.url + Endpoint.endPoint.mobile_push_update_notification, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseNotification => {
        console.log("Notification Login =>", responseNotification);
      })
      .catch(error => {
        console.log(error);
      });
  };

  // mobilePushNotification = responseJson => {
  //   var headers = new Headers();
  //   headers.append('Accept', 'application/json');
  //   var data = new FormData();
  //   data.append('uuid', DeviceInfo.getUniqueId());
  //   data.append('platform', Platform.OS);
  //   data.append('push_id', this.state.push_id_token);
  //   data.append('type', 'android');
  //   data.append('user_id', responseJson.data.token.user_id);

  //   console.log("DATA==>", data)

  //   fetch(Endpoint.endPoint.url + Endpoint.endPoint.mobile_push_notification, {
  //     method: 'POST',
  //     headers: headers,
  //     body: data,
  //   })
  //     .then(response => response.json())
  //     .then(responseNotification => {
  //       console.log("Notification Login =>", responseNotification);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#11075e" />
        {this.state.loading == true ? (
          <View style={styles.spinner}>
            <Bars size={wp('5%')} color="#11075e" />
          </View>
        ) : null}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}>
            <View
              style={{
                height: hp('50%'),
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#11075e',
              }}>
              <Image
                source={require('../images/logo.png')}
                style={{ height: hp('30%'), width: hp('35%') }}
              />
            </View>
            <View style={{ alignSelf: 'center', marginTop: 10 }}>
              <Form
                ref={ref => (this.myForm = ref)}
                validate={true}
                submit={this.login.bind(this)}
                failed={this.submitFailed.bind(this)}
                errors={this.state.errors}>
                <Field
                  required
                  component={InputField}
                  validations={[required, email]}
                  name="Email"
                  value={this.state.email}
                  onChangeText={text => this.setState({ email: text })}
                  blurOnSubmit={false}
                  onSubmitEditing={() => this.passwordRef.focus()}
                  customStyle={styles.inputtype_css}
                  returnKeyType="next"
                  placeholder="Email"
                  placeholderTextColor="grey"
                  secureTextEntry={false}
                />
                <View>
                  <Field
                    required
                    ref={passwordRef => (this.passwordRef = passwordRef)}
                    component={InputField}
                    validations={[required]}
                    name="Password"
                    value={this.state.password}
                    onChangeText={text => this.setState({ password: text })}
                    customStyle={styles.inputtype_css}
                    returnKeyType="done"
                    placeholder="Password"
                    placeholderTextColor="grey"
                    secureTextEntry={this.state.showPassword}
                    errors={this.state.errors}
                  />
                  <View
                    style={{ position: 'absolute', right: wp('2%'), top: 25 }}>
                    {this.state.showPassword == true ? (
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ showPassword: false });
                        }}>
                        <FontAwesomeIcon
                          icon={faEyeSlash}
                          color={'grey'}
                          size={
                            Device.isPhone
                              ? wp('4.5%')
                              : Device.isTablet
                                ? wp('2.5%')
                                : null
                          }
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ showPassword: true });
                        }}>
                        <FontAwesomeIcon
                          icon={faEye}
                          color={'grey'}
                          size={
                            Device.isPhone
                              ? wp('4.5%')
                              : Device.isTablet
                                ? wp('2.5%')
                                : null
                          }
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.btnCss}
                  onPress={() => {
                    this.submitForm();
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: Device.isPhone
                        ? wp('4.5%')
                        : Device.isTablet
                          ? wp('2.5%')
                          : null,
                      textAlign: 'center',
                      padding: 10,
                    }}>
                    Login
                  </Text>
                </TouchableOpacity>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('forgetPassword', {
                        value: 'Password',
                      });
                    }}>
                    <Text
                      style={{
                        marginTop: 10,
                        fontSize: Device.isPhone
                          ? wp('4.5%')
                          : Device.isTablet
                            ? wp('2.5%')
                            : null,
                        textAlign: 'center',
                      }}>
                      Forgotten password?
                    </Text>
                  </TouchableOpacity>
                </View>
              </Form>
            </View>
            <View
              style={{
                height: height * 0.08,
                alignItems: 'flex-end',
                paddingHorizontal: 10,
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: Device.isPhone
                      ? wp('4.5%')
                      : Device.isTablet
                        ? wp('2%')
                        : null,
                    textAlign: 'center',
                    padding: 10,
                  }}>
                  New user?
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('registration');
                  }}>
                  <Text
                    style={{
                      color: '#11075e',
                      fontSize: Device.isPhone
                        ? wp('4.5%')
                        : Device.isTablet
                          ? wp('2%')
                          : null,
                      textAlign: 'center',
                      fontWeight: 'bold',
                      paddingVertical: 10,
                    }}>
                    Sign up
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <Text
                  style={{
                    color: '#11075e',
                    fontSize: Device.isPhone
                      ? wp('4.5%')
                      : Device.isTablet
                        ? wp('2%')
                        : null,
                    textAlign: 'center',
                    padding: 10,
                    fontWeight: 'bold',
                  }}
                  onPress={() => {
                    this.props.navigation.navigate('forgetPassword', {
                      value: 'Email',
                    });
                  }}>
                  Verify Email
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

export default withNavigationFocus(Login);
var { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    position: 'relative',
  },
  inputtype_css: {
    borderBottomColor: 'grey',
    paddingLeft: 5,
    borderBottomWidth: 1,
    paddingBottom: 0,
    marginTop: 10,
    marginBottom: 0,
    textAlignVertical: 'top',
    width: wp('70%'),
    color: 'black',
    flexWrap: 'wrap',
    fontSize: Device.isPhone ? wp('4.5%') : Device.isTablet ? wp('2.5%') : null,
  },
  btnCss: {
    backgroundColor: '#11075e',
    marginTop: 20,
    width: wp('40%'),
    alignSelf: 'center',
    borderRadius: 5,
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
});
