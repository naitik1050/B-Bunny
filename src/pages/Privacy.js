import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Switch,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import OTPTextView from 'react-native-otp-textinput';
import { Dialog } from 'react-native-simple-dialogs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import SideMenuDrawer from '../component/SideMenuDrawer';
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

export default class Privacy extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      user_id: '',
      dataSource: [],
      public: '',
      profile_visible: '',
      user_tracking: '',
      authenticator_status: '',
      secret: '',
      url: '',
      image: '',
      otp: '',
      loading: false,
      switchValue: false,
      enableAuth: false,
      type: this.props.navigation.getParam('value'),
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
        this.getPrivate();
      }
    } catch (error) {
      alert(error);
    }
  };

  verifyOTP = () => {
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    var data = new FormData();
    data.append('otp', this.state.otp);
    data.append('secret', this.state.secret);
    console.log(data);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.authenticator_enable, {
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
          this.setState({ enableAuth: false });
          this.getPrivate();
        } else {
          Toast.show('Failed! Please check otp', Toast.LONG);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  getPrivate = () => {
    this.setState({ loading: true });
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);

    fetch(Endpoint.endPoint.url + Endpoint.endPoint.user_privacy, {
      method: 'GET',
      headers: headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('Hello', responseJson);
        this.setState({
          loading: false,
          public: responseJson.public,
          profile_visible: responseJson.profile_visible,
          user_tracking: responseJson.user_tracking,
          authenticator_status: responseJson.authenticator_status,
        });
      })
      .catch(error => {
        console.log(error);
      });

    fetch(Endpoint.endPoint.url + Endpoint.endPoint.authenticator_show, {
      method: 'GET',
      headers: headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('Hello', responseJson);
        this.setState({
          loading: false,
          secret: responseJson.secret,
          url: responseJson.url,
          image: responseJson.image,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  makePrivate = (privacy_type, privacy_data) => {
    // this.setState({loading: true});
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    var data = new FormData();
    data.append('privacy_type', privacy_type);
    data.append('privacy_data', privacy_data);
    console.log(data);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.user_privacy, {
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
          this.getPrivate();
        } else if (responseJson.status == false) {
          Toast.show(responseJson.msg, Toast.LONG);
        } else {
          alert('Something went wrong');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  disableAuth = () => {
    // this.setState({loading: true});
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.authenticator_disable, {
      method: 'POST',
      headers: headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({ loading: false });
        if (responseJson.status == true) {
          Toast.show(responseJson.msg, Toast.LONG);
          this.setState({ authenticator_status: false });
          this.getPrivate();
        } else if (responseJson.status == false) {
          Toast.show(responseJson.msg, Toast.LONG);
        } else {
          alert('Something went wrong');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const srcImage = 'data:image/png;base64,' + this.state.image;
    const Device = require('react-native-device-detection');
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
      <Right style={{ flex: 0.3 }}>
      </Right>
    );

    return (
      <SideMenuDrawer
        ref={ref => (this._sideMenuDrawer = ref)}
        style={{ zIndex: 1 }}
        navigation={this.props}>
        <View style={styles.container}>
          {this.state.type == 'Privacy' ? (
            <Navbar left={left} title="Privacy" navigation={this.props} right={right} />
          ) : this.state.type == 'Security' ? (
            <Navbar left={left} title="Security" navigation={this.props} right={right} />
          ) : null}
          {this.state.loading == true ? (
            <View style={styles.spinner}>
              <Bars size={25} color="#11075e" />
            </View>
          ) : null}
          <KeyboardAvoidingView behavior="padding" enabled>
            <Dialog
              dialogStyle={{ borderRadius: 9 }}
              title="Enable two-factor authentication"
              titleStyle={{
                fontWeight: 'bold',
                color: '#11075e',
                alignItems: 'center',
              }}
              containerStyle={{ margin: 30 }}
              visible={this.state.enableAuth}
              onRequestClose={() => {
                this.setState({ enableAuth: false, authenticator_status: false });
              }}
              onTouchOutside={() =>
                this.setState({ enableAuth: false, authenticator_status: false })
              }>
              <ScrollView keyboardShouldPersistTaps="handled">
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ textAlign: 'justify' }}>
                    Scan the QR code below with an authentication application,
                    such as Google Authenticator on your phone.
                  </Text>
                  <Image
                    style={{
                      width: 200,
                      height: 200,
                    }}
                    source={{ uri: srcImage }}
                    resizeMode="cover"
                  />
                  <Text style={{ textAlign: 'justify' }}>
                    Enter Google Authentication Code
                  </Text>
                  <OTPTextView
                    containerStyle={{ marginTop: 10, marginBottom: 10 }}
                    handleTextChange={otp => this.setState({ otp: otp })}
                    textInputStyle={{
                      margin: 2,
                    }}
                    tintColor="#11075e"
                    inputCount={6}
                  />
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#11075e',
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
                      Verify OTP
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </Dialog>
          </KeyboardAvoidingView>
          <ScrollView>
            {this.state.type == 'Privacy' ? (
              <View style={{ padding: 15 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.innerTitle}>
                      Show profile in search engines
                    </Text>
                  </View>
                  {this.state.public == '1' ? (
                    <Switch
                      onValueChange={() => {
                        this.makePrivate('public', 0);
                      }}
                      thumbColor="#fff"
                      trackColor={{ true: '#11075e' }}
                      value={true}
                      style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                    />
                  ) : (
                      <Switch
                        onValueChange={() => {
                          this.makePrivate('public', 1);
                        }}
                        thumbColor="#fff"
                        trackColor={{ true: '#11075e' }}
                        value={false}
                        style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                      />
                    )}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.innerTitle}>Make profile private</Text>
                  </View>
                  {this.state.profile_visible == '0' ? (
                    <Switch
                      onValueChange={() => {
                        this.makePrivate('profile_visible', 1);
                      }}
                      thumbColor="#fff"
                      trackColor={{ true: '#11075e' }}
                      value={true}
                      style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                    />
                  ) : (
                      <Switch
                        onValueChange={() => {
                          this.makePrivate('profile_visible', 0);
                        }}
                        thumbColor="#fff"
                        trackColor={{ true: '#11075e' }}
                        value={false}
                        style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                      />
                    )}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.innerTitle}>Activity Tracking</Text>
                  </View>
                  {this.state.user_tracking == '1' ? (
                    <Switch
                      onValueChange={() => {
                        this.makePrivate('user_tracking', 0);
                      }}
                      thumbColor="#fff"
                      trackColor={{ true: '#11075e' }}
                      value={true}
                      style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                    />
                  ) : (
                      <Switch
                        onValueChange={() => {
                          this.makePrivate('user_tracking', 1);
                        }}
                        thumbColor="#fff"
                        trackColor={{ true: '#11075e' }}
                        value={false}
                        style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                      />
                    )}
                </View>
              </View>
            ) : this.state.type == 'Security' ? (
              <View style={{ padding: 15 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.innerTitle}>Google Authentication</Text>
                  </View>
                  {this.state.authenticator_status == true ? (
                    <Switch
                      onValueChange={() => {
                        this.disableAuth();
                      }}
                      thumbColor="#fff"
                      trackColor={{ true: '#11075e' }}
                      value={true}
                      style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                    />
                  ) : (
                      <Switch
                        onValueChange={() => {
                          this.setState({
                            authenticator_status: true,
                            enableAuth: true,
                          });
                        }}
                        thumbColor="#fff"
                        trackColor={{ true: '#11075e' }}
                        value={false}
                        style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                      />
                    )}
                </View>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </SideMenuDrawer>
    );
  }
}
var { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    position: 'relative',
    paddingBottom: 10,
  },
  card_style: {
    padding: 0,
    borderRadius: 10,
    shadowColor: '#11075e',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  title: {
    fontSize: height > width ? wp('3.8%') : wp('2%'),
    color: '#11075e',
    fontWeight: 'bold',
    marginBottom: 15,
    margin: 5,
  },
  innerTitle: {
    fontSize: height > width ? wp('3.8%') : wp('2%'),
    margin: 5,
    marginBottom: 15,
    color: 'black',
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
