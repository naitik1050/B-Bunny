import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Switch,
} from 'react-native';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import SideMenuDrawer from '../component/SideMenuDrawer';
import Navbar from '../component/NavBar';
import { Button, Left, Right } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { Bars } from 'react-native-loader';
import Toast from 'react-native-simple-toast';
import RadioGroup from 'react-native-radio-buttons-group';
import Endpoint from '../res/url_endpoint';
import {
  widthPercentageToDP as wp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';

export default class Notification extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userDetail: '',
      token: '',
      user_id: '',
      dataSource: [],
      loading: false,
      type: this.props.navigation.getParam('value'),
      replyNotificationStatus: '1',
      PostNotificationStatus: '1',
      commentNotificationStatus: '1',
      warrenNotificationStatus: '1',
      newletterStatus: '1',
      warrenStatus: '1',
      postStatus: '1',
      replyStatus: '1',
      newLetterData: '',
      reportData: [],
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
        this.getStatus();
      }
    } catch (error) {
      alert(error);
    }
  };

  onPress = (newLetterData) => {
    this.typeClicked(newLetterData);
  };

  typeClicked = (newLetterType) => {
    this.setState({ newLetterData: newLetterType });
    let newLetter = newLetterType.find((e) => e.selected == true);
    newLetterType = newLetter
      ? newLetter.value
      : this.state.newLetterData[0].label;
    this.statusChange('subscription_type', newLetterType, 'email');
  };

  getStatus = () => {
    this.setState({ loading: true });
    // var headers = new Headers();
    // let auth = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiOTg0YjYzOWE1NDc2YmJiZTYxZmZkMWY4ZDhkNzQ3NTJlOTIxYzhlYjMwMDc4MzUxY2QzY2FhZDk5MDY3NjcwNDk0MTkwY2NjYjNkMWY2NzAiLCJpYXQiOjE1Nzg2NDk0MjMsIm5iZiI6MTU3ODY0OTQyMywiZXhwIjoxNTg2NTExODIzLCJzdWIiOiI2Iiwic2NvcGVzIjpbXX0.ZU4NBybhNLiVJBhnqBh9UWt40UBtrVpODr4xrlnhhILgxW-HJQ0RFL4yzDgtUcuV6kiE55wgnsUtsDBojepetWnIrDxRsF6AnP7Sk7jjhKgkK-_tadkmK3h7bqm5PDPxLUyxuzCLF3UezjxLHJy0L86apxeIohaKvIMUm3yKi43x42PV653uAycHm6NqynP2wMiupb-IwDpAP41hWh9klOgpeyPbdcbyz2p7DB3WuTy81nhpL1KIEQz16JB47hZNugGAyGpQsmSVTnDdebROn4UIdUjujqDoU1ux2ChfbthCZWqwOmV9EvddzYgKKIw0fP3QamNPRHEWgiQTlEa6O6n4tVuT_h8p9VFIm7PPsfpcop1vwqeSIljIZG7FIxKNiFnfbJlcHyr9RgyhS1eDrUxELOq9k5OwTVOWkP0bQg8ICHC5Q7mfAvPW8rUVpfZhNbD_jAN53j4-8RtN68PT8Ezdm1-_JCHfXOasyNkNAatqx0n8l6lEvYT9Pqa_RCZ6K0LxbUdL-VZi7XKgSh3pmcjqsDcErNQqG16OyyioCUo5t8zvUV09j6Lu1_76BD3GpZ9ueDUZNhlPEMRM2HDnvODhxOcYgQIPDKf1xDzi5ANxSbwHAp2P5gLHGIFTeudGipmPi4sy-c_F27IgS8EUs2GR-7MHQsJY6zbG1xEtdo8';
    // headers.append("Authorization", auth);
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);

    fetch(Endpoint.endPoint.url + Endpoint.endPoint.userSettings, {
      method: 'GET',
      headers: headers,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);

        if (responseJson.status == true) {
          this.setState({
            warrenNotificationStatus: responseJson.data.inbox.warren,
            PostNotificationStatus: responseJson.data.inbox.post,
            commentNotificationStatus: responseJson.data.inbox.comment,
            replyNotificationStatus: responseJson.data.inbox.reply_on_comment,
            warrenStatus: responseJson.data.email.warren,
            postStatus: responseJson.data.email.post,
            replyStatus: responseJson.data.email.reply_on_comment,
            newletterStatus: responseJson.data.email.newsletter,
          });
          if (responseJson.data.email.subscription_type == 'w') {
            this.state.reportData = [
              {
                label: 'Daily',
                value: 'd',
              },
              {
                label: 'Weekly',
                value: 'w',
                selected: true,
              },
            ];
          } else {
            this.state.reportData = [
              {
                label: 'Daily',
                value: 'd',
                selected: true,
              },
              {
                label: 'Weekly',
                value: 'w',
              },
            ];
          }
          this.setState({ loading: false });
        } else {
          this.setState({ loading: false });
          alert('Something went wrong');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  statusChange = (notification_type, notification_data, flag) => {
    this.setState({ loading: true });
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    var data = new FormData();
    data.append('notification_type', notification_type);
    data.append('notification_data', notification_data);
    data.append('flag', flag);
    console.log(data);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.userSettings, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({ loading: false });
        if (responseJson.status == true) {
          Toast.show(responseJson.msg, Toast.LONG);
          this.getStatus();
        } else if (responseJson.status == false) {
          Toast.show(responseJson.msg, Toast.LONG);
        } else {
          alert('Something went wrong');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
      <SideMenuDrawer
        ref={(ref) => (this._sideMenuDrawer = ref)}
        style={{ zIndex: 1 }}
        navigation={this.props}>
        <View style={styles.container}>
          {this.state.type == 'Email' ? (
            <Navbar
              left={left}
              title="Email Notification"
              navigation={this.props}
              right={right}
            />
          ) : (
              <Navbar
                left={left}
                title="Inbox Notification"
                navigation={this.props}
                right={right}
              />
            )}
          {this.state.loading == true ? (
            <View style={styles.spinner}>
              <Bars size={25} color="#11075e" />
            </View>
          ) : null}
          <ScrollView>
            {this.state.type == 'Email' ? (
              <View style={{ padding: 15 }}>
                <Text
                  style={{
                    marginBottom: 10,
                    fontSize: height > width ? wp('3.8%') : wp('2%'),
                  }}>
                  If turned off, you will still receive administrative emails
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.innerTitle}>Warren Approval/Deny</Text>
                  </View>
                  <View>
                    {this.state.warrenStatus == '1' ? (
                      <Switch
                        onValueChange={() =>
                          this.statusChange('warren', 0, 'email')
                        }
                        thumbColor="#fff"
                        trackColor={{ true: "#11075e" }}
                        value={true}
                        style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                      />
                    ) : (
                        <Switch
                          onValueChange={() =>
                            this.statusChange('warren', 1, 'email')
                          }
                          thumbColor="#fff"
                          trackColor={{ true: "#11075e" }}
                          value={false}
                          style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                        />
                      )}
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.innerTitle}>Post Approval/Deny</Text>
                  </View>
                  <View>
                    {this.state.postStatus == '1' ? (
                      <Switch
                        onValueChange={() =>
                          this.statusChange('post', 0, 'email')
                        }
                        thumbColor="#fff"
                        trackColor={{ true: "#11075e" }}
                        value={true}
                        style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                      />
                    ) : (
                        <Switch
                          onValueChange={() =>
                            this.statusChange('post', 1, 'email')
                          }
                          thumbColor="#fff"
                          trackColor={{ true: "#11075e" }}
                          value={false}
                          style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                        />
                      )}
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.innerTitle}>
                      Replies on my comments
                    </Text>
                  </View>
                  <View>
                    {this.state.replyStatus == '1' ? (
                      <Switch
                        onValueChange={() =>
                          this.statusChange('reply_on_comment', 0, 'email')
                        }
                        thumbColor="#fff"
                        trackColor={{ true: "#11075e" }}
                        value={true}
                        style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                      />
                    ) : (
                        <Switch
                          onValueChange={() =>
                            this.statusChange('reply_on_comment', 1, 'email')
                          }
                          thumbColor="#fff"
                          trackColor={{ true: "#11075e" }}
                          value={false}
                          style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                        />
                      )}
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.innerTitle}>
                      Newsletter Subscription
                    </Text>
                  </View>
                  <View>
                    {this.state.newletterStatus == '1' ? (
                      <Switch
                        onValueChange={() =>
                          this.statusChange('newsletter', 0, 'email')
                        }
                        thumbColor="#fff"
                        trackColor={{ true: "#11075e" }}
                        value={true}
                        style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                      />
                    ) : (
                        <Switch
                          onValueChange={() =>
                            this.statusChange('newsletter', 1, 'email')
                          }
                          thumbColor="#fff"
                          trackColor={{ true: "#11075e" }}
                          value={false}
                          style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                        />
                      )}
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                    alignContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.innerTitle}>
                      Newsletter Subscription Type
                    </Text>
                  </View>
                  <View>
                    {this.state.reportData.length > 0 ? (
                      <RadioGroup
                        radioButtons={this.state.reportData}
                        onPress={this.onPress}
                        style={{
                          fontSize: height > width ? wp('3.8%') : wp('1.8%'),
                        }}
                        flexDirection="row"
                      />
                    ) : null}
                  </View>
                </View>
              </View>
            ) : (
                <View style={{ padding: 15 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.innerTitle}>Warren Approval/Deny</Text>
                    </View>
                    <View>
                      {this.state.warrenNotificationStatus == '1' ? (
                        <Switch
                          onValueChange={() =>
                            this.statusChange('warren', 0, 'inbox')
                          }
                          thumbColor="#fff"
                          trackColor={{ true: "#11075e" }}
                          value={true}
                          style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                        />
                      ) : (
                          <Switch
                            onValueChange={() =>
                              this.statusChange('warren', 1, 'inbox')
                            }
                            thumbColor="#fff"
                            trackColor={{ true: "#11075e" }}
                            value={false}
                            style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                          />
                        )}
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 5,
                    }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.innerTitle}>Post Approval/Deny</Text>
                    </View>
                    <View>
                      {this.state.PostNotificationStatus == '1' ? (
                        <Switch
                          onValueChange={() =>
                            this.statusChange('post', 0, 'inbox')
                          }
                          thumbColor="#fff"
                          trackColor={{ true: "#11075e" }}
                          value={true}
                          style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                        />
                      ) : (
                          <Switch
                            onValueChange={() =>
                              this.statusChange('post', 1, 'inbox')
                            }
                            thumbColor="#fff"
                            trackColor={{ true: "#11075e" }}
                            value={false}
                            style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                          />
                        )}
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 5,
                    }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.innerTitle}>Comments on my post</Text>
                    </View>
                    <View>
                      {this.state.commentNotificationStatus == '1' ? (
                        <Switch
                          onValueChange={() =>
                            this.statusChange('comment', 0, 'inbox')
                          }
                          thumbColor="#fff"
                          trackColor={{ true: "#11075e" }}
                          value={true}
                          style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                        />
                      ) : (
                          <Switch
                            onValueChange={() =>
                              this.statusChange('comment', 1, 'inbox')
                            }
                            thumbColor="#fff"
                            trackColor={{ true: "#11075e" }}
                            value={false}
                            style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                          />
                        )}
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 5,
                    }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.innerTitle}>
                        Replies on my comments
                    </Text>
                    </View>
                    <View>
                      {this.state.replyNotificationStatus == '1' ? (
                        <Switch
                          onValueChange={() =>
                            this.statusChange('reply_on_comment', 0, 'inbox')
                          }
                          thumbColor="#fff"
                          trackColor={{ true: "#11075e" }}
                          value={true}
                          style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                        />
                      ) : (
                          <Switch
                            onValueChange={() =>
                              this.statusChange('reply_on_comment', 1, 'inbox')
                            }
                            thumbColor="#fff"
                            trackColor={{ true: "#11075e" }}
                            value={false}
                            style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                          />
                        )}
                    </View>
                  </View>
                </View>
              )}
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
