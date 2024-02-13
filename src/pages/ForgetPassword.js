import React, { PureComponent } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Header, Body, Title, Left, Right, Button } from 'native-base';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-navigation';
import Toast from 'react-native-simple-toast';
import Endpoint from '../res/url_endpoint';
import { Bars } from 'react-native-loader';

export default class ForgetPassword extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      title: this.props.navigation.getParam('value'),
      showPassword: true,
      errorText: '',
      hasError: false,
      loading: false,
    };
  }

  componentDidMount() {
    loc(this);
  }

  componentWillUnMount() {
    rol();
  }

  verifyEmail = () => {
    this.setState({ loading: true });
    var data = new FormData();
    data.append('email', this.state.email);
    console.log(data);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.verifyEmail, {
      method: 'POST',
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.status == true) {
          Toast.show(
            'Plese click on the link that has just been sent to your email account to verify your account.',
            Toast.LONG,
          );
          this.setState({ loading: false });
          setTimeout(() => {
            this.props.navigation.goBack();
          }, 5000);
        } else if (responseJson.status == false) {
          Toast.show(responseJson.msg, Toast.LONG);
          this.setState({ loading: false });
        } else {
          alert('Something went wrong');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  // checkStatus = () => {
  //   console.log("Call");
  //   var data = new FormData();
  //   data.append('email', this.state.email);
  //   console.log(data);
  //   fetch(Endpoint.endPoint.url + Endpoint.endPoint.checkEmail, {
  //     method: 'POST',
  //     body: data,
  //   })
  //     .then(response => response.json())
  //     .then(responseJson => {
  //       console.log(responseJson);
  //       if (responseJson.email_verified == true) {
  //         this.forgetPassword();
  //       } else if (responseJson.email_verified == false) {
  //         Toast.show('Please verify your email.', Toast.LONG);
  //       } else {
  //         alert('Something went wrong');
  //       }
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // };

  forgetPassword = () => {
    console.log("Calling ");
    this.setState({ loading: true });
    if (this.state.email == '') {
      this.setState({
        hasError: true,
        loading: false,
        errorText: 'Email cannot be blank',
      });
    } else {
      var data = new FormData();
      data.append('email', this.state.email);
      console.log(data);
      fetch(Endpoint.endPoint.url + Endpoint.endPoint.forgot_password, {
        method: 'POST',
        body: data,
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          if (responseJson.error == 'false') {
            this.setState({ loading: false });
            alert(responseJson.msg);
          } else if (responseJson.error == 'true') {
            this.setState({
              hasError: true,
              errorText: responseJson.msg,
              loading: false,
            });
          } else {
            alert('Something went wrong');
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  render() {
    var left = (
      <Left style={{ flex: 0.3 }}>
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
      <Right style={{ flex: width > height ? 0.3 : 0.75 }}>
      </Right>);
    return (
      <SafeAreaView style={styles.container}>
        <Header style={{ backgroundColor: '#11075e' }}>
          {left}
          <Body style={{ justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>
            {this.state.title == 'Password' ? (
              <Title style={{ justifyContent: 'center', fontSize: height > width ? wp('5.5%') : wp('1.8%') }}>Forget Password</Title>
            ) : this.state.title == 'Email' ? (
              <Title style={{ justifyContent: 'center', fontSize: height > width ? wp('5.5%') : wp('1.8%') }}>Verify Email</Title>
            ) : null}
          </Body>
          {right}
        </Header>
        <KeyboardAvoidingView>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled">
            <StatusBar backgroundColor="#11075e" />
            {this.state.loading == true ? (
              <View style={styles.spinner}>
                <Bars size={25} color="#11075e" />
              </View>
            ) : null}
            <View style={styles.img_view}>
              <Image
                source={require('../images/logo.png')}
                style={{ height: hp('30%'), width: hp('35%') }}
              />
            </View>
            <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
              {this.state.title == 'Password' ? (
                <Text style={styles.lostText}>
                  Lost your password? Please enter your email address. You will
                  receive a link to create a new password.
                </Text>
              ) : this.state.title == 'Email' ? (
                <Text style={styles.lostText}>
                  Please confirm that you want to use this as your email
                  address.
                </Text>
              ) : null}

              <TextInput
                style={styles.inputtype_css}
                placeholder="Email"
                placeholderTextColor="grey"
                numberOfLines={1}
                onChangeText={email =>
                  this.setState({ email: email, hasError: false })
                }
              />
              {this.state.hasError ? (
                <Text
                  style={{
                    color: '#c0392b',
                    marginTop: 10,
                    fontSize: height > width ? wp('4%') : wp('2.5%'),
                  }}>
                  {this.state.errorText}
                </Text>
              ) : null}
              {this.state.title == 'Password' ? (
                <TouchableOpacity
                  style={{
                    backgroundColor: '#11075e',
                    marginTop: 30,
                    borderRadius: 5,
                  }}
                  onPress={() => this.forgetPassword()}>
                  <Text style={styles.resetText}>Reset Password</Text>
                </TouchableOpacity>
              ) : this.state.title == 'Email' ? (
                <TouchableOpacity
                  style={{
                    backgroundColor: '#11075e',
                    marginTop: 30,
                    borderRadius: 5,
                  }}
                  onPress={() => this.verifyEmail()}>
                  <Text style={styles.resetText}>Verify Email</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}
var { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    position: 'relative',
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
  inputtype_css: {
    borderBottomColor: 'grey',
    paddingLeft: 5,
    borderBottomWidth: 1,
    paddingBottom: 0,
    marginTop: 25,
    marginBottom: 0,
    textAlignVertical: 'top',
    width: '80%',
    color: 'black',
    flexWrap: 'wrap',
    fontSize: height > width ? wp('4%') : wp('3%'),
  },
  lostText: {
    textAlign: 'justify',
    width: '80%',
    fontSize: height > width ? wp('4%') : wp('2.5%'),
    lineHeight: height > width ? wp('5%') : wp('3%'),
    color: 'grey',
  },
  img_view: {
    height: height * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#11075e',
  },
  resetText: {
    color: 'white',
    fontSize: height > width ? wp('4%') : wp('2.5%'),
    textAlign: 'center',
    padding: 10,
    paddingRight: 80,
    paddingLeft: 80,
  },
});
