import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import Image from 'react-native-remote-svg';
import {
  faCamera,
  faArrowLeft,
  faTrash,
  faImage,
  faEnvelope,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import ImageView from 'react-native-image-view';
import SideMenuDrawer from '../component/SideMenuDrawer';
import Navbar from '../component/NavBar';
import { Button, Left } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { Bars } from 'react-native-loader';
import Toast from 'react-native-simple-toast';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-picker';
import Endpoint from '../res/url_endpoint';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import { NavigationEvents } from 'react-navigation';


export default class EditProfile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      user_id: '',
      dataSource: [],
      loading: false,
      profilePhoto: '',
      user_name: '',
      changePassword: false,
      reportPostId: '',
      email: '',
      image: '',
      img_uri: '',
      password: '',
      profileVisible: false,
      isImageViewVisible: false,
    };
    this._retrieveData();
  }

  componentDidMount() {
    loc(this);
  }

  componentWillUnMount() {
    rol();
  }

  page_reloaded() {
    this._retrieveData();
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

  launchImageLibrary = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        this.setState({
          img_uri: response.uri,
          image: response,
          profilePhoto: '',
          profileVisible: false,
        });
        this.uploadImage();
      }
    });
  };

  launchCamera = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        this.setState({
          img_uri: response.uri,
          image: response,
          profilePhoto: '',
          profileVisible: false,
        });
        this.uploadImage();
      }
    });
  };

  uploadImage = () => {
    this.setState({ loading: true });
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    console.log(headers);
    var data = new FormData();
    data.append('avatar', {
      name: this.state.image.fileName,
      type: this.state.image.type,
      uri:
        Platform.OS === 'android'
          ? this.state.image.uri
          : this.state.image.uri.replace('file://', ''),
    });
    console.log(data);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.change_profile_pic, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log("Image", responseJson);
        this.setState({ loading: false });
        if (responseJson.status == true) {
          Toast.show(responseJson.msg, Toast.LONG);
          this._retrieveData();
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

  removeAlert = () => {
    Alert.alert(
      'Are you sure',
      'Remove profile photo?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Remove', onPress: () => this.removePhoto() },
      ],
      { cancelable: false },
    );
  };

  removePhoto = () => {
    this.setState({ loading: true, profileVisible: false });
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    console.log(headers);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.remove_profile_pic, {
      method: 'POST',
      headers: headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({ loading: false });
        if (responseJson.status == true) {
          Toast.show(responseJson.msg, Toast.LONG);

          this.componentWillMount();
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

  componentWillMount() {
    this.setState({ profilePhoto: "https://blogsbunny.nyc3.cdn.digitaloceanspaces.com/extra_assets/profile_pic.svg" });
  }

  getUserDetail = () => {
    this.setState({ loading: true });
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);

    fetch(Endpoint.endPoint.url + Endpoint.endPoint.user_details, {
      method: 'GET',
      headers: headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log("getUserDetail", responseJson);
        this.setState({ loading: false });
        if (responseJson) {
          this.setState({
            profilePhoto: responseJson.data.avatar,
            user_name: responseJson.data.name,
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

  render() {
    const images = [
      {
        source: {
          uri:
            this.state.img_uri != ''
              ? this.state.img_uri
              : this.state.profilePhoto != ''
                ? this.state.profilePhoto
                : null,
        },
        width: 806,
        height: 720,
      },
    ];
    var left = (
      <Left style={{ flex: 0.5 }}>
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
      <SideMenuDrawer
        ref={ref => (this._sideMenuDrawer = ref)}
        style={{ zIndex: 1 }}
        navigation={this.props}>
        <View style={styles.container}>
          <Modal
            isVisible={this.state.profileVisible}
            swipeDirection="down"
            onBackdropPress={() => this.setState({ profileVisible: false })}
            style={{ justifyContent: 'flex-end', margin: 0 }}>
            <View
              style={{
                flexDirection: 'column',
                padding: 20,
                backgroundColor: 'white',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}>
              <Text
                style={{
                  fontSize: height > width ? hp('3%') : wp('2%'),
                  fontWeight: '600',
                  marginBottom: 15,
                }}>
                Profile Photo
              </Text>
              <View style={{ flexDirection: 'row' }}>
                {this.state.profilePhoto ==
                  'https://blogsbunny.nyc3.cdn.digitaloceanspaces.com/extra_assets/profile_pic.svg' ? (
                    <View />
                  ) : (
                    <View style={{ flexDirection: 'column' }}>
                      <TouchableOpacity
                        style={{
                          backgroundColor: 'red',
                          borderRadius: 25,
                          padding: 10,
                          height: 50,
                          width: 50,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginHorizontal: 20,
                        }}
                        onPress={() => {
                          this.removeAlert();
                        }}>
                        <FontAwesomeIcon
                          icon={faTrash}
                          color={'white'}
                          size={height > width ? wp('4.5%') : wp('2%')}
                        />
                      </TouchableOpacity>
                      <Text style={{ textAlign: 'center', marginTop: 5 }}>
                        Remove{'\n'}photo
                    </Text>
                    </View>
                  )}
                <View style={{ flexDirection: 'column' }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'purple',
                      borderRadius: 25,
                      padding: 10,
                      height: 50,
                      width: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginHorizontal: 20,
                    }}
                    onPress={() => {
                      this.launchImageLibrary();
                    }}>
                    <FontAwesomeIcon
                      icon={faImage}
                      color={'white'}
                      size={height > width ? wp('4.5%') : wp('2%')}
                    />
                  </TouchableOpacity>
                  <Text style={{ textAlign: 'center', marginTop: 5 }}>
                    Gallery
                  </Text>
                </View>
                <View style={{ flexDirection: 'column' }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'green',
                      borderRadius: 25,
                      padding: 10,
                      height: 50,
                      width: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginHorizontal: 20,
                    }}
                    onPress={() => {
                      this.launchCamera();
                    }}>
                    <FontAwesomeIcon
                      icon={faCamera}
                      color={'white'}
                      size={height > width ? wp('4.5%') : wp('2%')}
                    />
                  </TouchableOpacity>
                  <Text style={{ textAlign: 'center', marginTop: 5 }}>
                    Camera
                  </Text>
                </View>
              </View>
            </View>
          </Modal>
          <Navbar
            left={left}
            title="Customize Profile"
            navigation={this.props}
          />

          <NavigationEvents
            onDidFocus={() => {
              this.page_reloaded();
            }}
          />

          {this.state.loading == true ? (
            <View style={styles.spinner}>
              <Bars size={25} color="#11075e" />
            </View>
          ) : null}
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={{ paddingTop: 5 }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ position: 'relative', padding: 10 }}>
                  {this.state.profilePhoto ==
                    'https://blogsbunny.nyc3.cdn.digitaloceanspaces.com/extra_assets/profile_pic.svg' ? (
                      <TouchableOpacity
                        onPress={() => this.setState({ profileVisible: true })}
                      >
                        <Image
                          source={{ uri: this.state.profilePhoto }}
                          style={{
                            width: height > width ? wp('25%') : wp('12%'),
                            height: height > width ? wp('25%') : wp('12%'),
                          }}
                        />
                      </TouchableOpacity>
                    ) : this.state.img_uri != '' ? (
                      <TouchableOpacity
                        onPress={() => this.setState({ isImageViewVisible: true })}>
                        <Image
                          source={{ uri: this.state.img_uri }}
                          style={{
                            width: height > width ? wp('25%') : wp('12%'),
                            height: height > width ? wp('25%') : wp('12%'),
                          }}
                        />
                      </TouchableOpacity>
                    ) : this.state.profilePhoto != '' ? (
                      <TouchableOpacity
                        onPress={() => this.setState({ isImageViewVisible: true })}>
                        <Image
                          source={{ uri: this.state.profilePhoto }}
                          style={{
                            width: height > width ? wp('25%') : wp('12%'),
                            height: height > width ? wp('25%') : wp('12%'),
                          }}
                        />
                      </TouchableOpacity>
                    ) : (
                          <Image
                            source={require('../images/user.jpg')}
                            style={{
                              width: height > width ? wp('25%') : wp('12%'),
                              height: height > width ? wp('25%') : wp('12%'),
                            }}
                          />
                        )}
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: '#11075e',
                      borderRadius: 75,
                      borderColor: 'white',
                      borderWidth: 5,
                      padding: 10,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ profileVisible: true });
                      }}>
                      <FontAwesomeIcon
                        icon={faCamera}
                        color={'white'}
                        size={height > width ? wp('8%') : wp('4%')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={{ margin: 10 }}>
                <View>
                  <Text style={styles.title}>User Name:</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    margin: 5,
                  }}>
                  <FontAwesomeIcon
                    icon={faUser}
                    color={'grey'}
                    size={height > width ? wp('5%') : wp('2.5%')}
                  />

                  <View
                    style={{
                      backgroundColor: 'lightgrey',
                      borderRadius: 5,
                      paddingHorizontal: 10,
                      width: wp('80%'),
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: height > width ? wp('5%') : wp('2.5%'),
                        textAlign: 'center',
                        fontWeight: '600',
                        paddingVertical: 5,
                        paddingHorizontal: 5,
                      }}>
                      {this.state.user_name}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ marginHorizontal: 10 }}>
                <View>
                  <Text style={styles.title}>Email:</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    margin: 5,
                  }}>
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    color={'grey'}
                    size={height > width ? wp('5%') : wp('2.5%')}
                  />
                  <View
                    style={{
                      backgroundColor: 'lightgrey',
                      borderRadius: 5,
                      paddingHorizontal: 10,
                      width: wp('80%'),
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: height > width ? wp('5%') : wp('2.5%'),
                        textAlign: 'center',
                        fontWeight: '600',
                        paddingVertical: 5,
                        paddingHorizontal: 5,
                      }}
                      ellipsizeMode="tail">
                      {this.state.email}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
          <ImageView
            images={images}
            imageIndex={0}
            animationType="fade"
            isVisible={this.state.isImageViewVisible}
            onClose={() => this.setState({ isImageViewVisible: false })}
            onImageChange={index => {
              console.log(index);
            }}
          />
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
    overflow: 'hidden',
    padding: 0,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#11075e',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  title: {
    fontSize: height > width ? wp('5%') : wp('2.5%'),
    fontWeight: 'bold',
    color: '#11075e',
  },
  innerTitle: {
    fontSize: height > width ? wp('3.5%') : wp('2%'),
    color: '#11075e',
  },
  inputtype_dialog: {
    paddingLeft: 5,
    padding: 5,
    marginTop: 10,
    marginBottom: 15,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'lightgrey',
    color: 'black',
    fontSize: height > width ? wp('4%') : wp('2%'),
    alignItems: 'center',
    backgroundColor: 'white',
  },
  inputtype_dialog_fix: {
    paddingLeft: 5,
    padding: 5,
    marginTop: 5,
    marginBottom: 15,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'lightgrey',
    color: 'black',
    flexWrap: 'wrap',
    fontSize: height > width ? wp('4%') : wp('2%'),
    alignItems: 'center',
    backgroundColor: 'lightgrey',
  },
  selectedType: {
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: '#11075e',
  },
  unSelectedType: {
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: 'white',
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
  updateText: {
    color: 'white',
    fontSize: height > width ? wp('4%') : wp('2.5%'),
    textAlign: 'center',
    padding: 10,
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
