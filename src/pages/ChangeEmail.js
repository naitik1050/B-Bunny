import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
} from 'react-native';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Form, Field } from 'react-native-validate-form';
import InputField from '../component/InputField';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Dialog } from 'react-native-simple-dialogs';
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
} from 'react-native-responsive-screen';
const required = value => (value ? undefined : 'This is a required field.');
const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
    ? 'Invalid email address!'
    : undefined;
const password = value =>
  value && !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{9,32}$/.test(value)
    ? 'Password must contain atleast 9 characters\nwith 1 lowercase letter, 1 uppercase letter,\n1 number and 1 special character'
    : undefined;
export default class ChangeEmail extends PureComponent {
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
      visible: false,
      email: '',
      password: '',
      newEmail: '',
      confirmNewEmail: '',
      errors: [],
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
        this.getUserDetail();
      }
    } catch (error) {
      alert(error);
    }
  };

  getUserDetail = () => {
    this.setState({ loading: true });
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    console.log('header', headers);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.user_details, {
      method: 'GET',
      headers: headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({ loading: false });
        if (responseJson.status == true) {
          this.setState({
            email: responseJson.data.email,
          });
        } else {
          alert('Something went wrong');
        }
      })
      .catch(error => {
        console.log(error);
      });
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
    console.log('Change Email Failed!');
  }

  confirm() {
    this.setState({ visible: true });
  }

  changeEmail() {
    this.setState({ loading: true, visible: false });
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    var data = new FormData();
    data.append('email', this.state.confirmNewEmail);
    data.append('password', this.state.password);
    console.log(data);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.emailChange, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({ loading: false, newEmail: '', confirmNewEmail: '' });
        if (responseJson.status == true) {
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
      value && this.state.newEmail != this.state.confirmNewEmail
        ? 'Emails do not match.'
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
        <Navbar left={left} title="Change Email" right={right} navigation={this.props} />
        {this.state.loading == true ? (
          <View style={styles.spinner}>
            <Bars size={25} color="#11075e" />
          </View>
        ) : null}
        <Dialog
          dialogStyle={{ borderRadius: 9 }}
          titleStyle={{ fontWeight: 'bold', color: '#11075e' }}
          visible={this.state.visible}
          title="Confirm Your Current Password"
          onTouchOutside={() => this.setState({ visible: false })}
          onRequestClose={() => {
            this.setState({ visible: false });
          }}>
          <TextInput
            style={styles.inputdialog_css}
            value={this.state.password}
            onChangeText={cpassword => this.setState({ password: cpassword })}
            placeholder="Current Password"
            placeholderTextColor="grey"
            numberOfLines={1}
            secureTextEntry={true}
          />
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-end',
              marginTop: 10,
            }}>
            <TouchableOpacity
              style={styles.CancelReportPost}
              onPress={() => {
                this.setState({
                  visible: false,
                });
              }}>
              <Text
                style={{
                  color: '#11075e',
                  fontSize: height > width ? wp('4.5%') : wp('1.8%'),
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.reportPost}
              onPress={() => {
                this.changeEmail();
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: height > width ? wp('4.5%') : wp('1.8%'),
                }}>
                Change Email
              </Text>
            </TouchableOpacity>
          </View>
        </Dialog>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}>

          <View style={{ alignSelf: 'center', marginTop: 10 }}>
            <Form
              ref={ref => (this.myForm = ref)}
              validate={true}
              submit={this.confirm.bind(this)}
              failed={this.submitFailed.bind(this)}
              errors={this.state.errors}>
              <TextInput
                style={styles.inputtype_css}
                editable={false}
                value={this.state.email}
              />
              <Field
                required
                component={InputField}
                validations={[required, email]}
                name="New Email"
                value={this.state.newEmail}
                onChangeText={newEmail => this.setState({ newEmail: newEmail })}
                customStyle={styles.inputtype_css}
                placeholder="New Email"
                placeholderTextColor="grey"
                numberOfLines={1}
                secureTextEntry={false}
              />
              <Field
                required
                component={InputField}
                validations={[required, mismatch]}
                name="Confirm New Email"
                value={this.state.confirmNewEmail}
                onChangeText={confirmNewEmail =>
                  this.setState({ confirmNewEmail: confirmNewEmail })
                }
                customStyle={styles.inputtype_css}
                placeholder="Confirm New Email"
                placeholderTextColor="grey"
                numberOfLines={1}
                secureTextEntry={false}
              />
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
                  Confirm
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
    textAlignVertical: 'top',
    color: 'black',
    flexWrap: 'wrap',
    width: wp('90%'),
    fontSize: Device.isPhone ? wp('4.5%') : Device.isTablet ? wp('2.5%') : null,
  },
  inputdialog_css: {
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 1,
    paddingLeft: 10,
    paddingVertical: 10,
    textAlignVertical: 'top',
    color: 'black',
    flexWrap: 'wrap',
    fontSize: Device.isPhone ? wp('4.5%') : Device.isTablet ? wp('2.5%') : null,
  },
  btnCss: {
    backgroundColor: '#11075e',
    marginTop: 20,
    width: wp('90%'),
    alignSelf: 'center',
    borderRadius: 5,
  },
  reportPost: {
    borderRadius: 5,
    backgroundColor: '#11075e',
    padding: 10,
    paddingLeft: 25,
    paddingRight: 25,
    margin: 5,
  },
  CancelReportPost: {
    borderRadius: 5,
    backgroundColor: 'white',
    padding: 10,
    paddingLeft: 25,
    paddingRight: 25,
    margin: 5,
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
