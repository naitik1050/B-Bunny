import React, { PureComponent } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
  FlatList,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faEye,
  faEyeSlash,
  faEnvelope,
  faUser,
  faCheck, faArrowLeft, faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { Form, Field } from 'react-native-validate-form';
import InputField from '../component/InputField';
import RNCountry from 'react-native-countries';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import { Bars } from 'react-native-loader';
import Endpoint from '../res/url_endpoint';
import NetInfo from '@react-native-community/netinfo';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Toast from 'react-native-simple-toast';
import * as Animatable from "react-native-animatable";
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { encode as btoa } from 'base-64';
import firebase from 'react-native-firebase';


const required = value => (value ? undefined : 'This is a required field.');
const firstname = value =>
  value && !/^[a-z]+.{1,}$/i.test(value)
    ? 'Firstname must be atleast 2 character long \nand NOT contain numbers or symbols'
    : undefined;
const lastname = value =>
  value && !/^[a-z]+.{1,}$/i.test(value)
    ? 'Lastname must be atleast 2 character long \nand NOT contain numbers or symbols'
    : undefined;
const username = value =>
  value && !/^[a-z0-9]+.{4,}$/i.test(value)
    ? 'Username must be atleast 5 character long \nand contain only letters or numbers'
    : undefined;


const Date = value => (value ? undefined : 'This is a required field.')
/* Upper case lower case valodation*/
// const password = value =>
//   value && !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,32}$/.test(value)
//     ? 'Password must contain atleast 10 characters\nwith 1 lowercase letter, 1 uppercase letter,\n1 number and 1 special character'
//     : undefined;
const password = value =>
  value && !/^.{10,32}$/.test(value)
    ? 'Password must contain atleast 10 characters.'
    : undefined;

export default class Registration extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      user_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: true,
      ConfirmshowPassword: true,
      dobText: '',
      countryText: '',
      firstnameError: false,
      lastnameError: false,
      usernameError: false,
      emailError: false,
      Validemail: 0,
      passwordError: false,
      confirmpasswordError: false,
      countryError: false,
      dobError: false,
      token: '',
      user_id: "",
      userName: '',
      billing_type: '',
      dob: '',
      errors: [],
      country: '',
      countryNameListWithCode: [],
      countryCode: '',
      selectedCountryIndex: -1,
      loading: false,
      next: true,
      next1: false,
      next2: false,
      value: 0,
      line1: false,
      line2: false,
      circle2: false,
      circle3: false,
      lastcirclecheck: false,
      usernameresponse: "",
      usernameavailable: false,
      usernameunavailable: "",
      usernamesuggestions: "",
      usernameunavaibleerror: false,
      passwordlength: 0,
      cpasswordlength: 0,
      push_id_token: ''
    };
    this.checkPermission();
    this.messageListener();
    this._retrieveData();
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
    loc(this);
    let countryNamesWithCodes = RNCountry.getCountryNamesWithCodes;
    countryNamesWithCodes.sort((a, b) => a.name.localeCompare(b.name));
    this.setState({
      countryNameListWithCode: countryNamesWithCodes,
    });

    // alert(this.state.countryNamesWithCodes)

  }


  componentWillUnMount() {
    rol();
  }

  usernameavailablity = (usernametext) => {
    console.log("usernameavailablity==>", usernametext);
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    console.log(Endpoint.endPoint.url + Endpoint.endPoint.user_name + "/" + usernametext + "/available");
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.user_name + "/" + usernametext + "/available", {
      method: 'GET',
      headers: headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log("usernamerESPONSE", responseJson);
        if (responseJson.status == true) {
          this.setState({ usernameavailable: true, usernameError: false, usernameunavaibleerror: false, usernameresponse: responseJson.msg })
          console.log("true");
        } else {
          console.log("false");
          this.setState({ usernameunavailable: true, usernameunavaibleerror: true, usernameavailable: false, usernameresponse: responseJson.msg, usernamesuggestions: responseJson.suggestions })
        }
      })
      .catch(error => {
        console.log("Error", error);
      });
  }

  storecountrycode = async () => {
    let obj = {
      countryCode: this.state.countryCode,
    };
    console.log('countrycode==>', this.state.countryCode);
    try {
      await AsyncStorage.setItem('visited_country', JSON.stringify(obj));
    } catch (e) {
      alert(e);
    }
    return true;
  };

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('visited_onces');
      if (value !== null) {
        const valueRecieve = JSON.parse(value);
        console.log("valueRecieve==>", valueRecieve);
        this.setState({
          countryCode: valueRecieve.countryCode,
        });
      }
    } catch (error) {
      alert(error);
    }
  };



  emailavailablity = (email) => {
    console.log("Email==>", email);
    var data = new FormData();
    data.append('email', email);
    var headers = new Headers();
    headers.append('Authorization', 'application/json');
    headers.append('Accept', 'application/json');
    console.log(Endpoint.endPoint.url + Endpoint.endPoint.email_check);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.email_check, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log("Email Response==>", responseJson);
        if (responseJson.status == true) {
          this.setState({ Validemail: 1 })

          if (this.state.countryCode != "") {
            console.log("COUNTRYCODE==>", this.state.countryCode);
          }
          else {
            fetch("https://api.blogsbunny.com/api/ip-info/", {
              method: 'POST'
            })
              .then(response => response.json())
              .then(responseJsoncountrycode => {
                console.log("IP INFO==>", responseJsoncountrycode.data.status);
                if (responseJsoncountrycode.data.status == "success") {
                  console.log("Country==>", responseJsoncountrycode.data.countryCode);
                  this.setState({ countryCode: responseJsoncountrycode.data.countryCode })
                  this.storecountrycode();
                }
              })
          }

          console.log("true");
        } else {
          console.log("false");
          this.setState({ Validemail: 2 })
        }
      })
      .catch(error => {
        console.log("Error", error);
      });


  }

  Next = () => {

    let usernameResult = false
    console.log("The user name : " + this.state.user_name);

    if (this.state.user_name == '') {
      usernameResult = false
      console.log("usernameunavaibleerror==>", this.state.usernameunavaibleerror);
      this.setState({ usernameError: true, usernameText: 'Username is required' });
    } else if (this.state.user_name && !/^[a-z0-9]+.{4,}$/i.test(this.state.user_name)) {
      usernameResult = false
      this.setState({ usernameError: true, usernameText: 'Username must be atleast 5 character long \nand contain only letters or numbers' });
    }
    else {
      usernameResult = true
      console.log("usernameunavaibleerror0==>", this.state.usernameunavaibleerror);
      if (this.state.usernameunavaibleerror == true) {
        console.log("usernameunavaibleerror1==>", this.state.usernameunavaibleerror);
        usernameResult = false
        this.setState({ usernameavailable: false });
      } else {
        usernameResult = true
        this.setState({ usernameError: false });
      }
    }
    console.log("The final result : " + usernameResult);
    if (usernameResult) {
      this.setState({ value: 100, next1: true, line1: true, next: false, circle2: true })
    }
  }

  Back1 = () => {
    this.setState({ value: 100, next1: false, line1: false, next: true, circle2: false })
  }

  Back2 = () => {
    this.setState({ value: 100, next1: true, next2: false, line2: false, circle3: false })
  }

  Next1 = () => {
    console.log('country', this.state.countryCode);
    let firstEmail = false

    if (this.state.email == '') {
      this.setState({ emailError: true, emailText: 'Email is required' });
      firstEmail = false
    }
    else if (this.state.Validemail == 2) {
      this.setState({ Validemail: 2 });
      firstEmail = false
    }
    else {
      this.setState({ emailError: false });
      firstEmail = true
    }

    if (firstEmail) {
      this.setState({ next2: true, line2: true, next1: false })
    }
  }

  storeData = async () => {
    let obj = {
      user_id: this.state.user_id,
      token: this.state.token,
      userName: this.state.userName,
      billing_type: this.state.billing_type,
    };
    console.log('obj', obj);
    try {
      await AsyncStorage.setItem('visited_onces', JSON.stringify(obj));
      this.props.navigation.navigate('login');
    } catch (e) {
      alert(e);
    }
    return true;
  };

  // submitFormfirst = () => {
  //   console.log("next", this.myForm);
  //   let submitResults = this.myForm.validate();
  //   let errors = [];


  //   submitResults.forEach(item => {
  //     errors.push({ field: item.fieldName, error: item.error });
  //   });

  //   this.setState({ errors: errors });
  // };

  submitFormlast = () => {
    let submitResults = this.myForm.validate();
    let errors = [];

    submitResults.forEach(item => {
      errors.push({ field: item.fieldName, error: item.error });
    });

    this.setState({ errors: errors });
  };

  submitFailed() {
    console.log('Register Faield!', this.state.errors);
  }

  register() {
    this.setState({ lastcirclecheck: true })
    console.log('name', this.state.user_name);
    console.log('email', this.state.email);
    console.log('password', this.state.password);
    console.log('password_confirmation', this.state.confirmPassword);
    console.log('country', this.state.countryCode);

    this.setState({ loading: true })
    var data = new FormData();
    data.append('name', this.state.user_name);
    data.append('email', this.state.email);
    data.append('password', this.state.password);
    data.append('password_confirmation', this.state.confirmPassword);
    data.append('country', this.state.countryCode);
    console.log(data);
    var headers = new Headers();
    let encode = btoa('bbdev:bbdev01!');
    let auth = 'Basic ' + encode;
    headers.append('Authorization', auth);
    headers.append('Accept', 'application/json');
    console.log(headers);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.register, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.status == true) {
          this.setState({
            token: responseJson.accessToken,
            user_id: responseJson.data.id,
            userName: responseJson.data.name,
            billing_type: responseJson.data.billing_type,
          });
          Toast.show("Registration Successfully", Toast.LONG);
          Toast.show("Email has been sent your mail please verify.", Toast.LONG);
          this.mobilePushNotification(responseJson);
          this.storeData();

        } else if (responseJson.status == false) {
          this.setState({ loading: false })
          if (responseJson.error.password) {
            Toast.show(responseJson.error.password[0], Toast.LONG);
          } else if (responseJson.error.name) {
            Toast.show(responseJson.error.name[0], Toast.LONG);
          } else if (responseJson.error.email) {
            Toast.show(responseJson.error.email[0], Toast.LONG);
          }
        } else {
          alert('Something went wrong');
        }
      })
      .catch(error => {
        console.log("Error", error);
      });
  }

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
    console.log("Test==>", responseJson);
    var headers = new Headers();
    let auth = 'Bearer ' + responseJson.accessToken;
    headers.append('Authorization', auth);
    var data = new FormData();
    data.append('uuid', DeviceInfo.getUniqueId());
    data.append('platform', Platform.OS);
    data.append('push_id', this.state.push_id_token);
    data.append('type', 'android');
    // data.append('user_id', parseInt(responseJson.data.id));
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.mobile_push_update_notification, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseNotification => {
        console.log("responseNotification", responseNotification);
      })
      .catch(error => {
        console.log("responseNotificationerror", error);
      });
  };

  submitSuccess() {
    console.log('success');
  }

  render() {

    const mismatch = value =>
      value && this.state.password != this.state.confirmPassword
        ? 'Passwords do not match.'
        : undefined;
    return (
      // <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>


        {this.state.loading == true ? (
          <View style={styles.spinner}>
            <Bars size={25} color="#11075e" />
          </View>
        ) : null}


        <Animatable.View animation="slideInRight" direction="alternate" iterationDelaylay={200} >
          <View style={{ flexDirection: 'row', justifyContent: 'center', height: hp('20%') }}>

            <View style={{ flex: 0.25, justifyContent: 'center', alignSelf: 'center' }}>

              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <AnimatedCircularProgress
                  size={height > width ? 40 : 70}
                  width={height > width ? 3 : 4}
                  fill={0}
                  backgroundColor="#11075e" >
                  {
                    (fill) => (
                      <View style={{ justifyContent: 'center' }}>
                        {this.state.line1 == true ?
                          <Animatable.View animation="rotate" iterationCount={0} >
                            <FontAwesomeIcon
                              icon={faCheck}
                              color={'green'}
                              size={
                                Device.isPhone
                                  ? wp('5.0%')
                                  : Device.isTablet
                                    ? wp('2.5%')
                                    : null
                              }
                            /></Animatable.View> :
                          <Text style={{ fontSize: height > width ? hp('2.5%') : hp('4%') }}>
                            {1}
                          </Text>}
                      </View>
                    )
                  }
                </AnimatedCircularProgress>
                <View>
                </View>

              </View>
              <Text style={{ textAlign: 'center', fontSize: height > width ? hp('1.8%') : hp('3%') }}>Name</Text>
            </View>

            {this.state.line1 == true ?
              <View style={{ justifyContent: 'center' }}>
                <ProgressBarAnimated
                  width={height > width ? 40 : 80}
                  height={height > width ? 3 : 5}
                  borderRadius={20}
                  value={this.state.value}
                  barAnimationDuration={500}
                  borderColor="#11075e"
                  backgroundColorOnComplete="#11075e"
                  onComplete={() => { this.setState({ circle2: true }) }}
                />
                <Text style={{ textAlign: 'center' }}></Text>
              </View> :
              <View style={{ justifyContent: 'center' }}>
                <ProgressBarAnimated
                  width={height > width ? 40 : 80}
                  height={height > width ? 3 : 5}
                  borderRadius={20}
                  value={this.state.value}
                  barAnimationDuration={500}
                  backgroundColorOnComplete="grey"
                />
                <Text style={{ textAlign: 'center' }}></Text>
              </View>}

            <View style={{ flex: 0.25, justifyContent: 'center', alignSelf: 'center' }}>
              {this.state.circle2 == true ?
                <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                  <AnimatedCircularProgress
                    size={height > width ? 40 : 70}
                    width={height > width ? 3 : 4}
                    fill={100}
                    tintColor="#11075e"
                    onAnimationComplete={() => console.log('onAnimationComplete')}
                    duration={1000}
                    backgroundColor="grey" >
                    {
                      (fill) => (
                        <View style={{ justifyContent: 'center' }}>
                          {this.state.line2 == true ?
                            <Animatable.View animation="rotate" iterationCount={0} >
                              <FontAwesomeIcon
                                icon={faCheck}
                                color={'green'}
                                size={
                                  Device.isPhone
                                    ? wp('5.0%')
                                    : Device.isTablet
                                      ? wp('2.5%')
                                      : null
                                }
                              /></Animatable.View> :
                            <Text style={{ fontSize: height > width ? hp('2.5%') : hp('4%') }}>
                              {2}
                            </Text>}
                        </View>
                      )
                    }
                  </AnimatedCircularProgress>
                </View> : <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                  <AnimatedCircularProgress
                    size={height > width ? 40 : 70}
                    width={height > width ? 3 : 4}
                    fill={0}
                    backgroundColor="grey" >
                    {
                      (fill) => (
                        <Text style={{ fontSize: height > width ? hp('2.5%') : hp('4%') }}>
                          {2}
                        </Text>
                      )
                    }
                  </AnimatedCircularProgress>
                </View>}
              <Text style={{ textAlign: 'center', fontSize: height > width ? hp('1.8%') : hp('3%') }}>Basic Info</Text>
            </View>

            {this.state.line2 == true ?
              <View style={{ justifyContent: 'center' }}>
                <ProgressBarAnimated
                  width={height > width ? 40 : 80}
                  height={height > width ? 3 : 5}
                  value={this.state.value}
                  barAnimationDuration={1000}
                  borderColor="#11075e"
                  backgroundColorOnComplete="#11075e"
                  onComplete={() => { this.setState({ circle3: true }) }}
                />
                <Text style={{ textAlign: 'center' }}></Text>
              </View> :
              <View style={{ justifyContent: 'center' }}>
                <ProgressBarAnimated
                  width={height > width ? 40 : 80}
                  height={height > width ? 3 : 5}
                  borderRadius={20}
                  value={0}
                  barAnimationDuration={500}
                  backgroundColorOnComplete="grey"
                />
                <Text style={{ textAlign: 'center' }}></Text>
              </View>}

            <View style={{ flex: 0.25, justifyContent: 'center', alignSelf: 'center' }}>
              {this.state.circle3 == true ?
                <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                  <AnimatedCircularProgress
                    size={height > width ? 40 : 70}
                    width={height > width ? 3 : 4}
                    fill={100}
                    tintColor="#11075e"
                    onAnimationComplete={() => console.log('onAnimationComplete')}
                    duration={1000}
                    backgroundColor="grey" >
                    {
                      (fill) => (
                        <View style={{ justifyContent: 'center' }}>
                          {this.state.lastcirclecheck == true ?
                            <Animatable.View animation="rotate" iterationCount={0} >
                              <FontAwesomeIcon
                                icon={faCheck}
                                color={'green'}
                                size={
                                  Device.isPhone
                                    ? wp('5.0%')
                                    : Device.isTablet
                                      ? wp('2.5%')
                                      : null
                                }
                              /></Animatable.View> :
                            <Text style={{ fontSize: height > width ? hp('2.5%') : hp('4%') }}>
                              {3}
                            </Text>}
                        </View>
                      )
                    }
                  </AnimatedCircularProgress>
                </View> : <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                  <AnimatedCircularProgress
                    size={height > width ? 40 : 70}
                    width={height > width ? 3 : 4}
                    fill={0}
                    backgroundColor="grey" >
                    {
                      (fill) => (
                        <Text style={{ fontSize: height > width ? hp('2.5%') : hp('4%') }}>
                          {3}
                        </Text>
                      )
                    }
                  </AnimatedCircularProgress>
                </View>}
              <Text style={{ textAlign: 'center', fontSize: height > width ? hp('1.8%') : hp('3%') }}>Complete</Text>
            </View>

          </View>

        </Animatable.View >

        <KeyboardAvoidingView style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps='always'>
            <View style={{ alignSelf: 'center', height: hp('60%'), justifyContent: 'center' }}>
              {this.state.next == true ?
                <Form
                  ref={ref => (this.myForm = ref)}
                  validate={true}
                  submit={this.Next.bind(this)}
                  failed={this.submitFailed.bind(this)}
                  errors={this.state.errors}>

                  <View>
                    <Animatable.View animation="slideInRight" delay={210}>
                      <View>
                        <FontAwesomeIcon
                          icon={faUser}
                          color={'#12085f'}
                          size={
                            Device.isPhone
                              ? wp('5.0%')
                              : Device.isTablet
                                ? wp('3.0%')
                                : null
                          }
                          style={{ position: 'absolute', top: 35, right: 10 }}
                        />
                      </View>
                      <Field
                        required
                        component={InputField}
                        validations={[required, username]}
                        name="Username"
                        value={this.state.user_name}
                        onChangeText={(uname) => {
                          this.setState({ user_name: uname });
                          if (uname.length > 4) {
                            this.usernameavailablity(uname);
                          } else {
                            this.setState({ usernameError: true, usernameText: 'Username must be atleast 5 character long \nand contain only letters or numbers' });
                          }
                        }}
                        customStyle={styles.inputtype_css}
                        placeholder="Username"
                        placeholderTextColor="grey"
                        secureTextEntry={false}
                      />
                      {this.state.usernameError == true ? (
                        <Text style={{ color: 'red', fontStyle: 'italic', marginLeft: 5, fontSize: height > width ? hp('2%') : hp('2.8%') }}>{this.state.usernameText}</Text>
                      ) :
                        <View>
                          {this.state.usernameavailable == true ? (
                            <Text style={{ color: 'green', marginLeft: 5, fontSize: height > width ? hp('2%') : hp('2.8%') }}>{this.state.usernameresponse}</Text>
                          ) :
                            <View>
                              <Text style={{ color: 'red', fontStyle: 'italic', marginLeft: 5, fontSize: height > width ? hp('2%') : hp('2.8%') }}>{this.state.usernameresponse}</Text>
                              <View style={{ width: wp('85%'), marginTop: 5 }}>
                                <FlatList
                                  horizontal={true}
                                  contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
                                  showsHorizontalScrollIndicator={false}
                                  data={this.state.usernamesuggestions != "" ? this.state.usernamesuggestions : null}
                                  renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => {
                                      this.setState({ user_name: item })
                                      this.usernameavailablity(item)
                                    }} style={{ borderColor: 'green', borderWidth: 2, borderRadius: 5, margin: 8, alignSelf: 'center' }}>
                                      <Text style={{ padding: 5, }}>{item}</Text>
                                    </TouchableOpacity>
                                  )}
                                  keyExtractor={({ id }, index) => id}
                                />
                              </View>
                            </View>
                          }
                        </View>}


                    </Animatable.View>
                    <Animatable.View animation="slideInRight" direction="alternate" delay={250}>


                      <TouchableOpacity
                        style={styles.btnCss1}
                        onPress={() => {
                          this.Next();
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
                          Next
                        </Text>
                      </TouchableOpacity>
                    </Animatable.View>
                  </View>
                </Form> : null}

              {this.state.next1 == true ?
                <Form
                  ref={ref => (this.myForm = ref)}
                  validate={true}
                  submit={this.Next1.bind(this)}
                  failed={this.submitFailed.bind(this)}
                  errors={this.state.errors}>
                  <View>
                    <Animatable.View animation="slideInRight" delay={2}>
                      <View>
                        <FontAwesomeIcon
                          icon={faEnvelope}
                          color={'#12085f'}
                          size={
                            Device.isPhone
                              ? wp('5.0%')
                              : Device.isTablet
                                ? wp('3.0%')
                                : null
                          }
                          style={{ position: 'absolute', top: 35, right: 10 }}
                        />
                      </View>
                      <Field
                        required
                        component={InputField}
                        validations={[required]}
                        name="Email"
                        value={this.state.email}
                        onChangeText={(emailtext) => {
                          this.setState({ email: emailtext });
                          if (emailtext.length == 0) {
                            console.log("Length==>", emailtext.length)
                            this.setState({ emailError: true, Validemail: 0 })
                          }
                          else {
                            this.emailavailablity(emailtext)
                            this.setState({ emailError: false })
                          }
                        }}
                        customStyle={styles.inputtype_css}
                        placeholder="Email"
                        placeholderTextColor="grey"
                        secureTextEntry={false}
                      />
                      <View>

                        {this.state.emailError == true ? (
                          <Text style={{ color: 'red', fontStyle: 'italic', marginLeft: 5, fontSize: height > width ? hp('2%') : hp('2.8%') }}>{this.state.emailText}</Text>
                        ) : null}

                        {this.state.Validemail == 2 ?
                          <Text style={{ color: 'red', marginLeft: 5, fontSize: height > width ? hp('2%') : hp('2.8%') }}>Invalid email address.</Text>
                          : null}
                        {this.state.Validemail == 1 ?
                          <Text style={{ color: 'green', marginLeft: 5, fontSize: height > width ? hp('2%') : hp('2.8%') }}>Email is available!</Text>
                          : null}

                      </View>
                    </Animatable.View>


                    <Animatable.View animation="slideInRight" direction="alternate" delay={250}>
                      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableOpacity
                          style={styles.backbtncss}
                          onPress={() => {
                            this.Back1();
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
                            <FontAwesomeIcon
                              style={{ justifyContent: 'center', alignSelf: 'center' }}
                              icon={faArrowLeft}
                              color={'#AAB7B8'}
                              size={
                                Device.isPhone
                                  ? wp('6.0%')
                                  : Device.isTablet
                                    ? wp('2.5%')
                                    : null
                              }
                            />
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.btnCss}
                          onPress={() => {
                            this.Next1();
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
                            <FontAwesomeIcon
                              style={{ justifyContent: 'center', alignSelf: 'center' }}
                              icon={faArrowRight}
                              color={'#fff'}
                              size={
                                Device.isPhone
                                  ? wp('6.0%')
                                  : Device.isTablet
                                    ? wp('2.5%')
                                    : null
                              }
                            />
                          </Text>
                        </TouchableOpacity>


                      </View>
                    </Animatable.View>
                  </View>
                </Form> : null}

              {this.state.next2 == true ?
                <Form
                  ref={ref => (this.myForm = ref)}
                  validate={true}
                  submit={this.register.bind(this)}
                  failed={this.submitFailed.bind(this)}
                  errors={this.state.errors}>
                  <View>
                    <Animatable.View animation="slideInRight" direction="alternate" deiterationDelaylay={2}>

                      <Field
                        required
                        component={InputField}
                        validations={[required, password]}
                        name="Password"
                        value={this.state.password}
                        maxLength={10}
                        onChangeText={passtext => {
                          this.setState({ password: passtext });
                          if (passtext.length) {
                            console.log("PassText Length==>", passtext.length);
                            this.setState({ passwordlength: passtext.length })
                          }
                        }
                        }
                        customStyle={styles.inputtype_css}
                        placeholder="Password"
                        placeholderTextColor="grey"
                        secureTextEntry={this.state.showPassword}
                        errors={this.state.errors}
                      />
                      <View>
                        <Text style={{ textAlign: 'right', color: 'grey', marginTop: 2, fontSize: hp('2%'), margin: 2, marginLeft: 10 }}>{this.state.passwordlength}/10</Text>
                      </View>

                      <View style={{ position: 'absolute', right: height > width ? wp('2%') : wp('0.8%'), top: 35 }}>
                        {this.state.showPassword == true ? (
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({ showPassword: false });
                            }}>
                            <FontAwesomeIcon
                              icon={faEyeSlash}
                              color={'#12085f'}
                              size={
                                Device.isPhone
                                  ? wp('5.5%')
                                  : Device.isTablet
                                    ? wp('3.2%')
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
                              color={'#12085f'}
                              size={
                                Device.isPhone
                                  ? wp('5.5%')
                                  : Device.isTablet
                                    ? wp('3.2%')
                                    : null
                              }
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      <View>
                        {this.state.passwordError == true ? (
                          <Text style={{ color: 'red', fontStyle: 'italic', marginLeft: 5, fontSize: height > width ? hp('2%') : hp('2.8%') }}>{this.state.passwordText}</Text>
                        ) : null}
                      </View>
                    </Animatable.View>
                    <Animatable.View animation="slideInRight" direction="alternate" iterationDelay={100}>
                      <Field
                        required
                        component={InputField}
                        validations={[required, mismatch]}
                        name="ConfirmPassword"
                        value={this.state.confirmPassword}
                        maxLength={10}
                        onChangeText={cpasstext => {
                          this.setState({ confirmPassword: cpasstext });
                          if (cpasstext.length) {
                            console.log("CpassText Length==>", cpasstext.length);
                            this.setState({ cpasswordlength: cpasstext.length })
                          }
                        }
                        }
                        customStyle={styles.inputtype_css}
                        placeholder="Confirm Password"
                        placeholderTextColor="grey"
                        secureTextEntry={this.state.ConfirmshowPassword}
                        errors={this.state.errors}
                      />
                      <View>
                        <Text style={{ textAlign: 'right', color: 'grey', marginTop: 2, fontSize: hp('2%'), margin: 2, marginLeft: 10 }}>{this.state.cpasswordlength}/10</Text>
                      </View>

                      <View style={{ position: 'absolute', right: height > width ? wp('2%') : wp('0.8%'), top: 35 }}>
                        {this.state.ConfirmshowPassword == true ? (
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({ ConfirmshowPassword: false });
                            }}>
                            <FontAwesomeIcon
                              icon={faEyeSlash}
                              color={'#12085f'}
                              size={
                                Device.isPhone
                                  ? wp('5.5%')
                                  : Device.isTablet
                                    ? wp('3.2%')
                                    : null
                              }
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({ ConfirmshowPassword: true });
                            }}>
                            <FontAwesomeIcon
                              icon={faEye}
                              color={'#12085f'}
                              size={
                                Device.isPhone
                                  ? wp('5.5%')
                                  : Device.isTablet
                                    ? wp('3.2%')
                                    : null
                              }
                            />
                          </TouchableOpacity>
                        )}
                      </View>

                      <View>
                        {this.state.confirmpasswordError == true ? (
                          <Text style={{ color: 'red', fontStyle: 'italic', marginLeft: 5, fontSize: height > width ? hp('2%') : hp('2.8%') }}>{this.state.confirmpasswordText}</Text>
                        ) : null}
                      </View>
                    </Animatable.View>

                    <Animatable.View animation="slideInRight" direction="alternate" iterationDelay={200}>
                      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableOpacity
                          style={styles.backbtncss}
                          onPress={() => {
                            this.Back2();
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
                            <FontAwesomeIcon
                              style={{ justifyContent: 'center', alignSelf: 'center' }}
                              icon={faArrowLeft}
                              color={'#AAB7B8'}
                              size={
                                Device.isPhone
                                  ? wp('6.0%')
                                  : Device.isTablet
                                    ? wp('2.5%')
                                    : null
                              }
                            />
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.btnCss}
                          onPress={() => {
                            this.submitFormlast();
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
                            <FontAwesomeIcon
                              style={{ justifyContent: 'center', alignSelf: 'center' }}
                              icon={faArrowRight}
                              color={'#fff'}
                              size={
                                Device.isPhone
                                  ? wp('6.0%')
                                  : Device.isTablet
                                    ? wp('2.5%')
                                    : null
                              }
                            />
                          </Text>
                        </TouchableOpacity>


                      </View>
                    </Animatable.View>
                  </View>
                </Form> : null}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View >

      // {/* </SafeAreaView> */}
    );
  }
}

var { height, width } = Dimensions.get('window');
const Device = require('react-native-device-detection');
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputtype_css: {
    borderColor: '#12085f',
    borderWidth: 1.7,
    borderRadius: 10,
    padding: 10,
    shadowColor: 'red',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: wp('85%'),
    color: 'black',
    flexWrap: 'wrap',
    fontSize: Device.isPhone ? wp('4.5%') : Device.isTablet ? wp('2.5%') : null,
  },

  calender_css: {
    borderColor: '#12085f',
    borderWidth: 1.7,
    borderRadius: 10,
    padding: 5,
    paddingLeft: 5,
    shadowColor: '#12085f',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    marginTop: 20,
    width: wp('85%'),
    color: 'black',
    flexWrap: 'wrap',
    fontSize: Device.isPhone ? wp('4.5%') : Device.isTablet ? wp('2.5%') : null,
  },
  btnCss1: {
    backgroundColor: '#11075e',
    marginTop: 40,
    marginBottom: 20,
    width: wp('85%'),
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center'
    // borderRadius: 25,
  },

  btnCss: {
    backgroundColor: '#11075e',
    marginTop: 40,
    marginBottom: 20,
    width: wp('15%'),
    marginStart: wp('27%'),
    borderRadius: 5,
    // flex: 0.3,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center'
    // borderRadius: 25,
  },

  backbtncss: {
    backgroundColor: '#F2F3F4',
    marginTop: 40,
    marginBottom: 20,
    width: wp('15%'),
    borderRadius: 5,
    // flex: 0.3,
    marginEnd: wp('27%'),
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center'

    // borderRadius: 25,
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
  line: {
    height: 5,
    width: 50,
    justifyContent: 'center'
    // transform: [{ rotate: '90deg' }]
  }
  // instruction: {
  //   fontSize: Device.isPhone ? wp('8.5%') : Device.isTablet ? wp('5.5%') : null,
  //   fontWeight: 'bold'
  // },

  // signuptext: {
  //   fontSize: Device.isPhone ? wp('4.5%') : Device.isTablet ? wp('3.5%') : null,
  // },
});
