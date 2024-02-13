// React native and others libraries imports
import React, { PureComponent } from 'react';
import { Alert, Platform } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import firebase from 'react-native-firebase';
import SplashScreen from 'react-native-splash-screen';
import DeviceInfo from 'react-native-device-info';
import Endpoint from './res/url_endpoint';

// Importing pages
import Login from './pages/Login';
import PersonalizeFeed from './pages/PersonalizeFeed';
import Registration from './pages/Registration';
import Otp from './pages/Otp';
import ForgetPassword from './pages/ForgetPassword';
import Warren from './pages/Warren';
import Following from './pages/Following';
import WarrenPost from './pages/WarrenPost';
import Setting from './pages/Setting';
import Block from './pages/BlockedUser';
import Blank from './pages/Blank';
import Logout from './pages/Logout';
import Pricing from './pages/Pricing';
import Notification from './pages/Notification';
import Privacy from './pages/Privacy';
import Feedback from './pages/Feedback';
import Contact from './pages/Contact';
import MyProfile from './pages/MyProfile';
import MyPost from './pages/MyPost';
import NewPost from './pages/NewPost';
import Message from './pages/Message';
import ChangePassword from './pages/ChangePassword';
import ChangeEmail from './pages/ChangeEmail';
import Deactivate from './pages/Deactivate';
import EditProfile from './pages/EditProfile';
import ViewProfile from './pages/ViewProfile';
import SinglePost from './pages/SinglePost';
import MyRSSFeeds from './pages/MyRSSFeeds';
import SubmitRSSFeed from './pages/SubmitRSSFeed';
import Bookmark from './pages/Bookmark';
import BlockedDomains from './pages/BlockedDomains';
import Aboutus from './pages/Aboutus';
import { Analytics, Event } from 'react-native-googleanalytics';
import AsyncStorage from '@react-native-community/async-storage';
import NavigationService from './res/NavigationService';
import { sha1 } from 'react-native-sha1';

export default class Main extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      message: null,
      sharedText: null,
      sharedImage: null,
      notificationopen: false
    };

    this.checkPermission();
    this.messageListener();

    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
  }

  componentDidMount() {
    console.log('LISTENING TO ANALYTICS');
    firebase.analytics().logEvent('generalevent');

    console.log("Call Google==>");
    const analytics = new Analytics('239960391');
    analytics.event(new Event('TestEvent', 'Play', 'The Big Lebowski', 123));
    console.log("Call Google 20==>", analytics);
  }

  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getFcmToken();
    } else {
      this.requestPermission();
    }
  }



  getFcmToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      console.log("FCM Token Main File==>", fcmToken);
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
      console.log("notification==>", notificationOpen.notification);
      this.setState({ notificationopen: true })
      NavigationService.navigate('singlePost', {
        Slug: notificationOpen.notification._data.slug,
        id: notificationOpen.notification._data.id,
        Opennotification: true
      });
    }

    this.messageListener = firebase.messaging().onMessage(message => {
      console.log(JSON.stringify(message));
    });
  };

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
    } catch (error) {
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

  _retrieveData = async (token) => {
    var newsha = DeviceInfo.getUniqueId() + '-android'
    console.log("NEW SHA==>", newsha);
    sha1(newsha).then(hash => {
      console.log("Hash Key uuid==>", 0 + hash.toLowerCase());
      this.updatenotification(hash, token);
    })
  };

  newupdatenotification = (hash, token) => {
    console.log("Notification Main", token);
    var data = new FormData();
    data.append('uuid', DeviceInfo.getUniqueId());
    data.append('push_id', token);
    data.append('platform', Platform.OS);
    data.append('type', 'android');
    data.append('u_hash', hash.toLowerCase());

    console.log("DATA Main==>", data)
    console.log("API==>", Endpoint.endPoint.url + Endpoint.endPoint.mobile_push_update_notification);

    fetch(Endpoint.endPoint.url + Endpoint.endPoint.mobile_push_update_notification, {
      method: 'POST',
      body: data,
    })
      .then(response => response.json())
      .then(responseNotification => {
        console.log("Notification UUID Main =>", responseNotification);
      })
      .catch(error => {
        console.log(error);
      });
  }

  updatenotification = (hash, token) => {
    console.log("Notification Main", token);
    var data = new FormData();
    data.append('uuid', DeviceInfo.getUniqueId());
    data.append('push_id', token);
    data.append('platform', Platform.OS);
    data.append('type', 'android');
    data.append('u_hash', 0 + hash.toLowerCase());

    console.log("DATA Main==>", data)
    console.log("API==>", Endpoint.endPoint.url + Endpoint.endPoint.mobile_push_update_notification);

    fetch(Endpoint.endPoint.url + Endpoint.endPoint.mobile_push_update_notification, {
      method: 'POST',
      body: data,
    })
      .then(response => response.json())
      .then(responseNotification => {
        console.log("Notification UUID Main =>", responseNotification);
        if (responseNotification.status == false) {
          this.newupdatenotification(hash, token);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  storeDeviceToken = async token => {
    var data = new FormData();
    data.append('uuid', DeviceInfo.getUniqueId());
    data.append('platform', Platform.OS);
    data.append('push_id', token);
    data.append('type', 'android');
    console.log('storeDeviceToken==>', data);

    var headers = new Headers();
    headers.append('Accept', 'application/json');

    fetch(Endpoint.endPoint.url + Endpoint.endPoint.mobile_push_notification, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log("Responce Main notification==>", responseJson);
        if (responseJson.status == false) {
          this._retrieveData(token);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };


  render() {
    return this.state.notificationopen == true ? <AppContainer
      ref={navigatorRef => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }}
    /> : <AppContainer />
  }
}

const AppNavigator = createStackNavigator(
  {
    login: {
      screen: Login,
      navigationOptions: {
        header: null,
      },
    },

    personalizeFeed: {
      screen: PersonalizeFeed,
      navigationOptions: {
        header: null,
      },
    },

    registration: {
      screen: Registration,
      navigationOptions: {
        headerTintColor: '#fff',
        title: 'Sign up',
        headerStyle: {
          backgroundColor: '#11075e',
          elevation: 0,
        },
        headerTitleStyle: {
          // fontWeight: 'bold',
          fontSize: 20,
        },
      },
    },
    otp: {
      screen: Otp,
      navigationOptions: {
        header: null,
      },
    },
    forgetPassword: {
      screen: ForgetPassword,
      navigationOptions: {
        header: null,
      },
    },
    warren: {
      screen: Warren,
      navigationOptions: {
        header: null,
      },
    },
    following: {
      screen: Following,
      navigationOptions: {
        header: null,
      },
    },
    warrenPost: {
      screen: WarrenPost,
      navigationOptions: {
        header: null,
      },
    },
    setting: {
      screen: Setting,
      navigationOptions: {
        header: null,
      },
    },
    blockUser: {
      screen: Block,
      navigationOptions: {
        header: null,
      },
    },
    blank: {
      screen: Blank,
      navigationOptions: {
        header: null,
      },
    },
    logout: {
      screen: Logout,
      navigationOptions: {
        header: null,
      },
    },
    pricing: {
      screen: Pricing,
      navigationOptions: {
        header: null,
      },
    },
    notification: {
      screen: Notification,
      navigationOptions: {
        header: null,
      },
    },
    privacy: {
      screen: Privacy,
      navigationOptions: {
        header: null,
      },
    },
    feedback: {
      screen: Feedback,
      navigationOptions: {
        header: null,
      },
    },
    contact: {
      screen: Contact,
      navigationOptions: {
        header: null,
      },
    },
    myProfile: {
      screen: MyProfile,
      navigationOptions: {
        header: null,
      },
    },
    myPost: {
      screen: MyPost,
      navigationOptions: {
        header: null,
      },
    },
    newPost: {
      screen: NewPost,
      navigationOptions: {
        header: null,
      },
    },
    message: {
      screen: Message,
      navigationOptions: {
        header: null,
      },
    },
    changeEmail: {
      screen: ChangeEmail,
      navigationOptions: {
        header: null,
      },
    },
    changePassword: {
      screen: ChangePassword,
      navigationOptions: {
        header: null,
      },
    },
    editProfile: {
      screen: EditProfile,
      navigationOptions: {
        header: null,
      },
    },
    viewProfile: {
      screen: ViewProfile,
      navigationOptions: {
        header: null,
      },
    },
    singlePost: {
      screen: SinglePost,
      navigationOptions: {
        header: null,
      },
    },
    submitRSSFeed: {
      screen: SubmitRSSFeed,
      navigationOptions: {
        header: null,
      },
    },
    bookmark: {
      screen: Bookmark,
      navigationOptions: {
        header: null,
      },
    },
    blockedDomains: {
      screen: BlockedDomains,
      navigationOptions: {
        header: null,
      },
    },
    myRSSFeeds: {
      screen: MyRSSFeeds,
      navigationOptions: {
        header: null,
      },
    },
    deactivate: {
      screen: Deactivate,
      navigationOptions: {
        header: null,
      },
    },

    Aboutus: {
      screen: Aboutus,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    // initialRouteName: 'personalizeFeed',
    initialRouteName: 'personalizeFeed',
  },
);

const AppContainer = createAppContainer(AppNavigator);
