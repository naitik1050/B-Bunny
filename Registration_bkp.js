import React, { PureComponent } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faEye,
  faEyeSlash,
  faEnvelope,
  faUser,
  faCalendarAlt,
  faChevronCircleDown,
} from '@fortawesome/free-solid-svg-icons';
import { SafeAreaView } from 'react-navigation';
import { Form, Field } from 'react-native-validate-form';
import InputField from '../component/InputField';
import DateField from '../component/DateField';
import RNCountry from 'react-native-countries';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import { Bars } from 'react-native-loader';
import Endpoint from '../res/url_endpoint';
import NetInfo from '@react-native-community/netinfo';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Toast from 'react-native-simple-toast';

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
const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
    ? 'Invalid email address!'
    : undefined;
const password = value =>
  value && !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{9,32}$/.test(value)
    ? 'Password must contain atleast 9 characters\nwith 1 lowercase letter, 1 uppercase letter,\n1 number and 1 special character'
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
      loading: false,
    };

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
    console.log('obj', obj);
    try {
      await AsyncStorage.setItem('visited_onces', JSON.stringify(obj));
      this.props.navigation.navigate('login');
    } catch (e) {
      alert(e);
    }
    return true;
  };

  submitForm = () => {

    let submitResults = this.myForm.validate();

    let errors = [];

    if (this.state.countryCode == '') {
      this.setState({ countryError: true, countryText: 'Country is required' });
    } else {
      this.setState({ countryError: false });
    }

    if (this.state.dob == '') {
      this.setState({ dobError: true, dobText: 'DOB is required' });
    } else {
      this.setState({ dobError: false });
    }

    submitResults.forEach(item => {
      errors.push({ field: item.fieldName, error: item.error });
    });

    this.setState({ errors: errors });
  };

  submitFailed() {
    console.log('Register Faield!');
  }
  register() {
    this.setState({ loading: true })
    var data = new FormData();
    data.append('firstname', this.state.first_name);
    data.append('lastname', this.state.last_name);
    data.append('name', this.state.user_name);
    data.append('email', this.state.email);
    data.append('password', this.state.password);
    data.append('password_confirmation', this.state.confirmPassword);
    data.append('country', this.state.countryCode);
    data.append('dob', this.state.dob);
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
          this.mobilePushNotification(responseJson);
          this.storeData();



        } else if (responseJson.status == false) {
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
        console.log(error);
      });
  }

  mobilePushNotification = responseJson => {
    var headers = new Headers();
    headers.append('Accept', 'application/json');
    var data = new FormData();
    data.append('udid', DeviceInfo.getUniqueId());
    data.append('user_id', parseInt(responseJson.data.user_id));

    fetch(Endpoint.endPoint.url + Endpoint.endPoint.mobile_push_notification, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseNotification => {
        console.log(responseNotification);
      })
      .catch(error => {
        console.log(error);
      });
  };

  submitSuccess() {
    console.log('hi');
  }

  render() {
    const mismatch = value =>
      value && this.state.password != this.state.confirmPassword
        ? 'Passwords do not match.'
        : undefined;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading == true ? (
          <View style={styles.spinner}>
            <Bars size={25} color="#11075e" />
          </View>
        ) : null}

        <ScrollView
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}>
          <View style={{ flex: 1 }}>
            <View style={{ height: hp('22%') }}>
              <Image
                source={require('../images/shape_image.jpg')}
                style={{ height: '100%', width: '100%' }}
                resizeMode="stretch"
              />
            </View>
            <View
              style={{
                padding: 10,
                zIndex: 9999,
                position: 'absolute',
                width: '100%',
                height: hp('15%'),
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={require('../images/logo.png')}
                style={{ width: height > width ? '35%' : "22%" }}
                resizeMode={'contain'}
              />
            </View>
          </View>

          <View style={{ alignSelf: 'center', marginTop: 20 }}>
            <Form
              ref={ref => (this.myForm = ref)}
              validate={true}
              submit={this.register.bind(this)}
              failed={this.submitFailed.bind(this)}
              errors={this.state.errors}>
              <Field
                required
                component={InputField}
                validations={[required, firstname]}
                name="Firstname"
                value={this.state.first_name}
                onChangeText={text => this.setState({ first_name: text })}
                customStyle={styles.inputtype_css}
                placeholder="Firstname"
                placeholderTextColor="grey"
                secureTextEntry={false}
              />
              <Field
                required
                component={InputField}
                validations={[required, lastname]}
                name="Lastname"
                value={this.state.last_name}
                onChangeText={text => this.setState({ last_name: text })}
                customStyle={styles.inputtype_css}
                placeholder="Lastname"
                placeholderTextColor="grey"
                secureTextEntry={false}
              />

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
                onChangeText={text => this.setState({ user_name: text })}
                customStyle={styles.inputtype_css}
                placeholder="Username"
                placeholderTextColor="grey"
                secureTextEntry={false}
              />

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
                validations={[required, email]}
                name="Email"
                value={this.state.email}
                onChangeText={text => this.setState({ email: text })}
                customStyle={styles.inputtype_css}
                placeholder="Email"
                placeholderTextColor="grey"
                secureTextEntry={false}
              />

              <View>
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  color={'#12085f'}
                  size={
                    Device.isPhone
                      ? wp('5.0%')
                      : Device.isTablet
                        ? wp('3.0%')
                        : null
                  }
                  style={{ position: 'absolute', top: height > width ? 35 : 25, right: 10 }}
                />
              </View>
              <Field
                required
                component={DateField}
                validations={[required]}
                name="Date"
                androidMode="spinner"
                style={styles.calender_css}
                date={this.state.dob}
                mode="date"
                placeholder="DOB"
                format="YYYY-MM-DD"
                minDate="1900-01-01"
                maxDate="2007-05-14"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={date => this.setState({ dob: date })}
                customStyles={{
                  dateIcon: {
                    width: 0,
                    height: 0,
                  },
                  dateInput: {
                    borderWidth: 0,
                    alignItems: 'flex-start',
                  },
                  placeholderText: {
                    color: 'grey',
                    fontSize: Device.isPhone
                      ? wp('4.5%')
                      : Device.isTablet
                        ? wp('2.5%')
                        : null,
                  },
                  dateText: {
                    fontSize: Device.isPhone
                      ? wp('4.5%')
                      : Device.isTablet
                        ? wp('2.5%')
                        : null,
                    color: 'black',
                  },
                }}
              />
              <View>
                {this.state.dobError == true ? (
                  <Text style={{ color: 'red' }}>{this.state.dobText}</Text>
                ) : null}
              </View>

              <View>
                <FontAwesomeIcon
                  icon={faChevronCircleDown}
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
              <SearchableDropdown
                onItemSelect={item => this.setState({ countryCode: item.code })}
                containerStyle={{ marginTop: 20 }}
                textInputStyle={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#ccc',
                  backgroundColor: '#FAF7F6',
                }}
                itemStyle={{
                  //single dropdown item style
                  padding: 10,
                  marginTop: 1,
                  backgroundColor: '#FAF9F8',
                  borderColor: '#bbb',
                  borderWidth: 1,
                }}
                itemTextStyle={{
                  //single dropdown item's text style
                  color: 'grey',
                  fontSize: Device.isPhone
                    ? wp('4.5%')
                    : Device.isTablet
                      ? wp('2.5%')
                      : null,
                }}
                itemsContainerStyle={{
                  //items container style you can pass maxHeight
                  //to restrict the items dropdown hieght
                  maxHeight: 145,
                  minWidth: wp('70%'),
                  position: 'absolute',
                  zIndex: 1,
                  top: 50,
                  backgroundColor: 'white',
                }}
                items={this.state.countryNameListWithCode}
                defaultIndex={2}
                placeholder="Select Country"
                resetValue={false}
                textInputProps={{
                  placeholder: 'Select Country',
                  underlineColorAndroid: 'transparent',
                  placeholderTextColor: 'grey',
                  style: {
                    borderColor: '#12085f',
                    borderWidth: 2,
                    borderRadius: 10,
                    padding: 10,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    width: wp('85%'),
                    alignItems: 'center',
                    fontSize: Device.isPhone
                      ? wp('4.5%')
                      : Device.isTablet
                        ? wp('2.5%')
                        : null,
                  },
                  onTextChange: text => console.log(text),
                }}
                listProps={{
                  nestedScrollEnabled: true,
                }}
              />
              <View>
                {this.state.countryError == true ? (
                  <Text style={{ color: 'red' }}>{this.state.countryText}</Text>
                ) : null}
              </View>

              <View>
                <Field
                  required
                  component={InputField}
                  validations={[required, password]}
                  name="Password"
                  value={this.state.password}
                  onChangeText={text => this.setState({ password: text })}
                  customStyle={styles.inputtype_css}
                  placeholder="Password"
                  placeholderTextColor="grey"
                  secureTextEntry={this.state.showPassword}
                  errors={this.state.errors}
                />
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
              </View>
              <View>
                <Field
                  required
                  component={InputField}
                  validations={[required, mismatch]}
                  name="ConfirmPassword"
                  value={this.state.confirmPassword}
                  onChangeText={text => this.setState({ confirmPassword: text })}
                  customStyle={styles.inputtype_css}
                  placeholder="Confirm Password"
                  placeholderTextColor="grey"
                  secureTextEntry={this.state.ConfirmshowPassword}
                  errors={this.state.errors}
                />
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
                  Sign up
                </Text>
              </TouchableOpacity>
            </Form>
          </View>
        </ScrollView>
      </SafeAreaView>
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
  btnCss: {
    backgroundColor: '#11075e',
    marginTop: 20,
    marginBottom: 20,
    width: wp('40%'),
    alignSelf: 'center',
    borderRadius: 25,
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
  // instruction: {
  //   fontSize: Device.isPhone ? wp('8.5%') : Device.isTablet ? wp('5.5%') : null,
  //   fontWeight: 'bold'
  // },

  // signuptext: {
  //   fontSize: Device.isPhone ? wp('4.5%') : Device.isTablet ? wp('3.5%') : null,
  // },
});
