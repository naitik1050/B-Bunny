import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationEvents } from 'react-navigation';
import { Bars } from 'react-native-loader';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-simple-toast';
import Endpoint from '../res/url_endpoint';
import firebase from 'react-native-firebase';
import { sha1 } from 'react-native-sha1';

export default class Logout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loading: false,
      token: '',
      user_id: '',
      fcmtoken: ''
    };
    this._retrieveData();
    this.checkPermission();
  }


  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getFcmToken();
    } else {
      this.requestPermission();
    }
  }

  storeData = async (token) => {
    let obj = {
      push_token: token
    }
    try {
      await AsyncStorage.setItem('visited_onces', JSON.stringify(obj));
    } catch (e) {
      console.log("Err==>", e);
    }
    return true;
  };

  getFcmToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      console.log("FCM Token logout File==>", fcmToken);
      this.storeDeviceToken(fcmToken);
    } else {
      this.showAlert('Failed', 'No token received');
    }
  };

  storeDeviceToken = (fcmToken) => {
    this.setState({ fcmtoken: fcmToken })
  }


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


  page_reloaded = () => {
    this.logout();
  };

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
        this.logout();
      }
    } catch (error) {
      alert(error);
    }
  };

  DeleteNotification = () => {
    console.log("Delete Token==>", this.state.token);
    console.log("Delete API==>", Endpoint.endPoint.url + Endpoint.endPoint.mobile_delete_push_notification + '/' + DeviceInfo.getUniqueId());
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    headers.append('Content-Type', 'application/json')
    headers.append('Accept', 'application/json')
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.mobile_delete_push_notification + '/' + DeviceInfo.getUniqueId(), {
      method: 'DELETE',
      headers: headers,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("Response logout notification", responseJson);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  updateEndpoint = () => {
    sha1(DeviceInfo.getUniqueId() + '-android').then(hash => {
      console.log("Hash Key uuid==>", hash.toLowerCase());
      this.updatenotification(hash);
    })
  }

  newupdatenotification = (hash, token) => {
    console.log("Notification Main", token);
    var data = new FormData();
    data.append('uuid', DeviceInfo.getUniqueId());
    data.append('push_id', this.state.fcmtoken);
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

  updatenotification = (hash) => {

    var data = new FormData();
    data.append('uuid', DeviceInfo.getUniqueId());
    data.append('push_id', this.state.fcmtoken);
    data.append('platform', Platform.OS);
    data.append('type', 'android');
    data.append('u_hash', 0 + hash.toLowerCase());

    console.log("DATA Logout==>", data)
    console.log("API==>", Endpoint.endPoint.url + Endpoint.endPoint.mobile_push_update_notification);

    fetch(Endpoint.endPoint.url + Endpoint.endPoint.mobile_push_update_notification, {
      method: 'POST',
      // headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseNotification => {
        console.log("Notification UUID Logout =>", responseNotification);
        if (responseNotification.status == false) {
          this.newupdatenotification(hash);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }


  logout = async () => {
    this.DeleteNotification();
    console.log('logout press==>');
    this.setState({ loading: true });
    try {
      const value = await AsyncStorage.removeItem('visited_onces');
      console.log("value", Endpoint.endPoint.url + Endpoint.endPoint.mobile_delete_push_notification);
      console.log("token==>", this.state.token);
      var headers = new Headers();
      let auth = 'Bearer ' + this.state.token;
      headers.append('Authorization', auth);
      headers.append('Content-Type', 'application/json')
      headers.append('Accept', 'application/json')
      fetch(Endpoint.endPoint.url + Endpoint.endPoint.logout, {
        method: 'POST',
        headers: headers,
      })
        .then((response) => response.json())
        .then((responseLogout) => {
          this.setState({ loading: false });
          if (responseLogout.status == true) {
            console.log("logout response==>", responseLogout);
            Toast.show(responseLogout.msg, Toast.LONG);
            this.updateEndpoint();
            this.props.navigation.navigate('personalizeFeed');
          } else if (responseLogout.status == false) {
            Toast.show(responseLogout.msg, Toast.LONG);
          } else {
            Toast.show("Something went wrong.", Toast.LONG);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .catch((error) => {
          console.log("error", error);
        });

    } catch (error) {
      alert(error);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.loading == true ? (
          <View style={styles.spinner}>
            <Bars size={25} color="#11075e" />
          </View>
        ) : null}
        <NavigationEvents
          onDidFocus={() => {
            this.page_reloaded();
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
});

