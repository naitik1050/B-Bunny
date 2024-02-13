import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Form, Field } from 'react-native-validate-form';
import InputField from '../component/InputField';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Navbar from '../component/NavBar';
import { Button, Left, Right } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { Bars } from 'react-native-loader';
import Toast from 'react-native-simple-toast';
import Endpoint from '../res/url_endpoint';
import {
  widthPercentageToDP as wp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const required = value => (value ? undefined : 'This is a required field.');
// const password = value =>
//   value && !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{9,32}$/.test(value)
//     ? 'Password must contain atleast 9 characters with \n1 lowercase letter, 1 uppercase letter, 1 number \nand 1 special character'
//     : undefined;

const password = value =>
  value && !/^.{10,32}$/.test(value)
    ? 'Password must contain atleast 10 characters.'
    : undefined;

export default class ChangePassword extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userDetail: '',
      token: '',
      user_id: '',
      dataSource: [],
      searchText: '',
      sortBy: 'created_at',
      loading: false,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      errors: [],
      passwordlength: 0,
      cpasswordlength: 0
    };
    this._retrieveData();
  }

  componentDidMount() {
    loc(this);
  }

  componentWillUnMount() {
    rol();
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('visited_onces');
      if (value !== null) {
        const valueRecieve = JSON.parse(value);
        console.log(valueRecieve);
        this.setState({
          user_id: valueRecieve.user_id,
          token: valueRecieve.token,
        });
      }
    } catch (error) {
      alert(error);
    }
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
    console.log('Change Password Failed!');
  }

  changePassword() {
    this.setState({ loading: true });
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    var data = new FormData();
    data.append('current_password', this.state.oldPassword);
    data.append('new_password', this.state.newPassword);
    data.append('new_password_confirmation', this.state.confirmPassword);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.changePassword, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({ loading: false });
        if (responseJson.status == true) {
          this.setState({
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
          Toast.show(responseJson.msg, Toast.LONG);
        } else if (responseJson.status == false) {
          Toast.show(responseJson.msg, Toast.LONG);
        } else {
          alert('Something went wrong');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {

    const mismatch = value =>
      value && this.state.password != this.state.confirmPassword
        ? 'Passwords do not match.'
        : undefined;

    var left = (
      <Left style={{ flex: 0.2 }}>
        <Button
          onPress={() => {
            this.props.navigation.goBack();
          }}
          transparent>
          <FontAwesomeIcon
            icon={faArrowLeft}
            color={'white'}
            size={height > width ? wp('5.5%') : wp('2.5%')}
          />
        </Button>
      </Left>
    );
    var right = (
      <Right style={{ flex: 0.2 }}></Right>
    );

    return (
      <View style={styles.container}>
        <Navbar left={left} title="Change Password" right={right} navigation={this.props} />
        {this.state.loading == true ? (
          <View style={styles.spinner}>
            <Bars size={25} color="#11075e" />
          </View>
        ) : null}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}>
          <View style={{ alignSelf: 'center', marginTop: 10 }}>
            <Form
              ref={ref => (this.myForm = ref)}
              validate={true}
              submit={this.changePassword.bind(this)}
              failed={this.submitFailed.bind(this)}
              errors={this.state.errors}>
              <Field
                required
                component={InputField}
                validations={[required, password]}
                name="Current Password"
                value={this.state.oldPassword}
                onChangeText={oldPassword =>
                  this.setState({ oldPassword: oldPassword })
                }
                customStyle={styles.inputtype_css}
                placeholder="Current Password"
                placeholderTextColor="grey"
                numberOfLines={1}
                secureTextEntry={true}
              />
              <Field
                required
                component={InputField}
                validations={[required, password]}
                name="New Password"
                value={this.state.newPassword}
                maxLength={10}
                onChangeText={newPassword => {
                  this.setState({ newPassword: newPassword })
                  if (newPassword.length) {
                    console.log("PassText Length==>", newPassword.length);
                    this.setState({ passwordlength: newPassword.length })
                  }
                }
                }
                customStyle={styles.inputtype_css}
                placeholder="New Password"
                placeholderTextColor="grey"
                numberOfLines={1}
                secureTextEntry={true}
              />
              <View>
                <Text style={{ textAlign: 'right', color: 'grey', marginTop: 2, fontSize: hp('2%'), margin: 2, marginLeft: 10 }}>{this.state.passwordlength}/10</Text>
              </View>

              <Field
                required
                component={InputField}
                validations={[required, mismatch]}
                name="Confirm New Password"
                maxLength={10}
                value={this.state.confirmPassword}
                onChangeText={confirmPassword => {
                  this.setState({ confirmPassword: confirmPassword })
                  if (confirmPassword.length) {
                    console.log("CpassText Length==>", confirmPassword.length);
                    this.setState({ cpasswordlength: confirmPassword.length })
                  }
                }
                }
                customStyle={styles.inputtype_css_confirm}
                placeholder="Confirm New Password"
                placeholderTextColor="grey"
                numberOfLines={1}
                secureTextEntry={true}
              />

              <View>
                <Text style={{ textAlign: 'right', color: 'grey', marginTop: 2, fontSize: hp('2%'), margin: 2, marginLeft: 10 }}>{this.state.cpasswordlength}/10</Text>
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
                  Change Password
                </Text>
              </TouchableOpacity>
            </Form>
          </View>
        </ScrollView>
      </View>
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
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 1,
    paddingLeft: 10,
    paddingVertical: 10,
    marginTop: 20,
    // textAlignVertical: 'top',
    color: 'black',
    flexWrap: 'wrap',
    width: wp('90%'),
    fontSize: Device.isPhone ? wp('4.5%') : Device.isTablet ? wp('2.5%') : null,
  },
  inputtype_css_confirm: {
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 1,
    paddingLeft: 10,
    paddingVertical: 10,
    // textAlignVertical: 'top',
    color: 'black',
    flexWrap: 'wrap',
    width: wp('90%'),
    fontSize: Device.isPhone ? wp('4.5%') : Device.isTablet ? wp('2.5%') : null,
  },

  btnCss: {
    backgroundColor: '#11075e',
    marginTop: 20,
    width: wp('90%'),
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
