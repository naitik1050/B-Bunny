import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Picker,
  ScrollView,
  Dimensions,
} from 'react-native';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { SafeAreaView } from 'react-navigation';
import { Form, Field } from 'react-native-validate-form';
import InputField from '../component/InputField';
import Navbar from '../component/NavBar';
import { Button, Left, Right } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { Bars } from 'react-native-loader';
import Toast from 'react-native-simple-toast';
import {
  widthPercentageToDP as wp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Endpoint from '../res/url_endpoint';

const required = value => (value ? undefined : 'This is a required field.');
export default class Feedback extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userDetail: '',
      token: '',
      user_id: '',
      dataSource: [],
      loading: false,
      feedbackType: '',
      feedbackText: '',
      errors: [],
      hasError: false,
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

    if (this.state.feedbackType == '') {
      this.setState({
        hasError: true,
        feedbackType: 'This is a required field.',
      });
    }

    submitResults.forEach(item => {
      errors.push({ field: item.fieldName, error: item.error });
    });

    this.setState({ errors: errors });
  };

  submitFailed() {
    console.log('Register Faield!');
  }

  submitFeedback() {
    this.setState({ loading: true });
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    var data = new FormData();
    data.append('suggestion', this.state.feedbackText);
    data.append('suggestion_type', parseInt(this.state.feedbackType));
    console.log(headers);
    console.log(data);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.suggestion, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({ loading: false });
        if (responseJson.status == true) {
          this.setState({ feedbackText: '', feedbackType: 0 });
          Toast.show(responseJson.msg, Toast.LONG);
        } else {
          Toast.show('Something went wrong', Toast.LONG);
        }
      })
      .catch(error => {
        console.log(error);
      });
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
        <Navbar
          left={left}
          title="Suggestion and comment"
          navigation={this.props}
          right={right}
        />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}>
          <View style={{ alignSelf: 'center', marginTop: 20 }}>
            <Form
              ref={ref => (this.myForm = ref)}
              validate={true}
              submit={this.submitFeedback.bind(this)}
              failed={this.submitFailed.bind(this)}
              errors={this.state.errors}>
              <View>
                <View
                  style={{
                    borderColor: 'grey',
                    backgroundColor: 'white',
                    borderWidth: 1,
                  }}>
                  <Picker
                    selectedValue={this.state.feedbackType}
                    onValueChange={itemValue =>
                      this.setState({ feedbackType: itemValue, hasError: false })
                    }>
                    <Picker.Item label="Select Suggestion Type..." />
                    <Picker.Item label="Design" value="0" />
                    <Picker.Item label="Functionality" value="1" />
                    <Picker.Item label="Other" value="2" />
                  </Picker>
                </View>
                <View>
                  {this.state.hasError == true ? (
                    <Text style={{ color: 'red' }}>
                      {this.state.feedbackType}
                    </Text>
                  ) : null}
                </View>
              </View>
              <Field
                required
                component={InputField}
                validations={[required]}
                name="Suggestion"
                value={this.state.feedbackText}
                onChangeText={feedbackText =>
                  this.setState({ feedbackText: feedbackText })
                }
                numberOfLines={5}
                multiline={true}
                customStyle={styles.inputtype_dialog}
                placeholder="Enter your suggestion here..."
                placeholderTextColor="grey"
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
    backgroundColor: '#F5FCFF',
  },
  card_style: {
    overflow: 'hidden',
    padding: 0,
    borderRadius: 10,
    shadowColor: '#11075e',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  btnCss: {
    backgroundColor: '#11075e',
    marginTop: 20,
    width: wp('90%'),
    alignSelf: 'center',
    borderRadius: 5,
  },
  inputtype_dialog: {
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
