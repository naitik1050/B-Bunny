import React, {PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
} from 'react-native';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {Form, Field} from 'react-native-validate-form';
import InputField from '../component/InputField';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import Navbar from '../component/NavBar';
import {Button, Left} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import {Bars} from 'react-native-loader';
import Toast from 'react-native-simple-toast';
import Endpoint from '../res/url_endpoint';
import {
  widthPercentageToDP as wp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
const required = value => (value ? undefined : 'This is a required field.');
export default class Deactivate extends PureComponent {
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
      email: '',
      password: '',
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
    this.setState({loading: true});
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
        this.setState({loading: false});
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
      errors.push({field: item.fieldName, error: item.error});
    });

    this.setState({errors: errors});
  };

  submitFailed() {
    console.log('Change Email Failed!');
  }

  deactivate() {
    this.setState({loading: true});
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    var data = new FormData();
    data.append('password', this.state.password);
    console.log(data);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.user_deactivate, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({loading: false});
        if (responseJson.status == true) {
          Toast.show(responseJson.msg, Toast.LONG);
          this.props.navigation.navigate('login');
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
    var left = (
      <Left style={{flex: 0.5}}>
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

    return (
      <View style={styles.container}>
        <Navbar
          left={left}
          title="Deactivate Account"
          navigation={this.props}
        />
        {this.state.loading == true ? (
          <View style={styles.spinner}>
            <Bars size={25} color="#11075e" />
          </View>
        ) : null}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}>
          <View style={{alignSelf: 'center', marginTop: 10}}>
            <Form
              ref={ref => (this.myForm = ref)}
              validate={true}
              submit={this.deactivate.bind(this)}
              failed={this.submitFailed.bind(this)}
              errors={this.state.errors}>
              <View>
                <Text style={styles.title}>
                  Please confirm your login password to deactivate account.
                </Text>
              </View>
              <TextInput
                style={styles.inputtype_css}
                editable={false}
                value={this.state.email}
              />
              <Field
                required
                component={InputField}
                validations={[required]}
                name="Your Password"
                value={this.state.password}
                onChangeText={password => this.setState({password: password})}
                customStyle={styles.inputtype_css}
                placeholder="Your Password"
                placeholderTextColor="grey"
                numberOfLines={1}
                secureTextEntry={true}
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
var {height, width} = Dimensions.get('window');
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
    alignSelf: 'center',
    fontSize: Device.isPhone ? wp('4.5%') : Device.isTablet ? wp('2.5%') : null,
  },
  title: {
    fontSize: height > width ? wp('6%') : wp('3%'),
    color: '#11075e',
    width: wp('90%'),
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
