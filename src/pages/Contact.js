import React, { PureComponent } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { SafeAreaView } from 'react-navigation';
import { Form, Field } from 'react-native-validate-form';
import InputField from '../component/InputField';
import Navbar from '../component/NavBar';
import { Button, Left, Right } from 'native-base';
import countries from 'calling-codes';
import { Bars } from 'react-native-loader';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {
  widthPercentageToDP as wp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Endpoint from '../res/url_endpoint';

const required = value => (value ? undefined : 'This is a required field.');
const firstname = value =>
  value && !/^[a-z]+.{1,}$/i.test(value)
    ? 'Firstname must be atleast 2 character long \nand NOT contain numbers or symbols'
    : undefined;
const lastname = value =>
  value && !/^[a-z]+.{1,}$/i.test(value)
    ? 'Lastname must be atleast 2 character long \nand NOT contain numbers or symbols'
    : undefined;
const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
    ? 'Invalid email address!'
    : undefined;
export default class Contact extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      subject: '',
      contant: '',
      email: '',
      phone: '',
      countryText: '',
      callingCodeText: '',
      hasError: false,
      token: '',
      user_id: '',
      errors: [],
      country: '',
      countryNameListWithCode: [],
      callingCode: '',
      loading: false,
    };
    this._retrieveData();
  }

  componentDidMount() {
    loc(this);
    // let countryNamesWithCodes = RNCountry.getCountryNamesWithCodes;
    let countryNamesWithCodes = countries;
    console.log('country', countryNamesWithCodes);
    countryNamesWithCodes.sort((a, b) => a.name.localeCompare(b.name));
    this.setState({
      countryNameListWithCode: countryNamesWithCodes,
    });
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

    if (this.state.callingCode == '') {
      this.setState({ hasError: true, countryText: 'This is a required field.' });
    }

    if (this.state.phone == '') {
      this.setState({
        hasError: true,
        callingCodeText: 'This is a required field.',
      });
    }

    submitResults.forEach(item => {
      errors.push({ field: item.fieldName, error: item.error });
    });

    this.setState({ errors: errors });
  };

  submitFailed() {
    console.log('Contact Us Faield!');
  }
  contact() {
    this.setState({ loading: true });
    var data = new FormData();
    data.append('first_name', this.state.first_name);
    data.append('last_name', this.state.last_name);
    data.append('subject', this.state.subject);
    data.append('content', this.state.content);
    data.append('email', this.state.email);
    data.append('country_code', this.state.callingCode);
    data.append('phone', this.state.phone);
    console.log(data);
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    console.log(headers);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.contact, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({ loading: false });
        if (responseJson.status == true) {
          Toast.show(responseJson.msg, Toast.LONG);
        } else if (responseJson.status == false) {
          Toast.show('Please check all fields.', Toast.LONG);
        } else {
          Toast.show('Something went wrong', Toast.LONG);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  submitSuccess() {
    console.log('hi');
  }

  render() {
    var left = (
      <Left style={{ flex: 0.3 }}>
        <Button
          onPress={() => {
            this.props.navigation.navigate('setting');
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
      <Right style={{ flex: 0.3 }}>
      </Right>
    );
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading == true ? (
          <View style={styles.spinner}>
            <Bars size={25} color="#11075e" />
          </View>
        ) : null}
        <Navbar left={left} title="Contact Us" navigation={this.props} right={right} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}>
          <View style={{ alignSelf: 'center' }}>
            <Form
              ref={ref => (this.myForm = ref)}
              validate={true}
              submit={this.contact.bind(this)}
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
              <Field
                required
                component={InputField}
                validations={[required]}
                name="Subject"
                value={this.state.subject}
                onChangeText={subject => this.setState({ subject: subject })}
                numberOfLines={3}
                multiline={true}
                customStyle={styles.inputtype_css}
                placeholder="Enter your subject here..."
                placeholderTextColor="grey"
                secureTextEntry={false}
              />
              <Field
                required
                component={InputField}
                validations={[required]}
                name="Content"
                value={this.state.content}
                onChangeText={content => this.setState({ content: content })}
                numberOfLines={3}
                multiline={true}
                customStyle={styles.inputtype_css}
                placeholder="Enter your content here..."
                placeholderTextColor="grey"
                secureTextEntry={false}
              />
              <Field
                required
                component={InputField}
                validations={[required, email]}
                name="Email"
                value={this.state.email}
                onChangeText={text => this.setState({ email: text })}
                customStyle={styles.inputtype_css}
                placeholder="Email"
                keyboardType="email-address"
                placeholderTextColor="grey"
                secureTextEntry={false}
              />
              <View>
                <SearchableDropdown
                  onItemSelect={item =>
                    this.setState({ callingCode: '+' + item.callingCode })
                  }
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
                    minWidth: wp('90%'),
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
                      borderWidth: 1,
                      borderColor: 'grey',
                      paddingLeft: 10,
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
                  {this.state.hasError == true ? (
                    <Text style={{ color: 'red' }}>{this.state.countryText}</Text>
                  ) : null}
                </View>
              </View>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    width: wp('90%'),
                    justifyContent: 'space-between',
                  }}>
                  <TextInput
                    style={styles.inputcode_css}
                    editable={false}
                    placeholder="Code"
                    placeholderTextColor="grey"
                    value={this.state.callingCode}
                    onChangeText={callingCode =>
                      this.setState({ callingCode: callingCode })
                    }
                  />
                  <Field
                    required
                    component={InputField}
                    validations={[required]}
                    name="Phone"
                    value={this.state.phone}
                    onChangeText={phone =>
                      this.setState({ phone: phone, hasError: false })
                    }
                    customStyle={styles.inputphone_css}
                    placeholder="Phone"
                    keyboardType="phone-pad"
                    placeholderTextColor="grey"
                    secureTextEntry={false}
                  />
                </View>
                <View>
                  {this.state.hasError == true ? (
                    <Text style={{ color: 'red' }}>
                      {this.state.callingCodeText}
                    </Text>
                  ) : null}
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
                  Submit
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
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 1,
    paddingLeft: 10,
    paddingVertical: 10,
    marginTop: 20,
    textAlignVertical: 'top',
    width: wp('90%'),
    color: 'black',
    flexWrap: 'wrap',
    fontSize: Device.isPhone ? wp('4.5%') : Device.isTablet ? wp('2.5%') : null,
  },
  inputcode_css: {
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 1,
    paddingLeft: 10,
    paddingVertical: 10,
    marginTop: 20,
    textAlignVertical: 'top',
    width: wp('20%'),
    color: 'black',
    flexWrap: 'wrap',
    fontSize: Device.isPhone ? wp('4.5%') : Device.isTablet ? wp('2.5%') : null,
  },
  inputphone_css: {
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 1,
    paddingLeft: 10,
    paddingVertical: 10,
    marginTop: 20,
    textAlignVertical: 'top',
    width: wp('65%'),
    color: 'black',
    flexWrap: 'wrap',
    fontSize: Device.isPhone ? wp('4.5%') : Device.isTablet ? wp('2.5%') : null,
  },
  btnCss: {
    backgroundColor: '#11075e',
    marginVertical: 20,
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
