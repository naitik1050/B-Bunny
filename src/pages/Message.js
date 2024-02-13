import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  RefreshControl,
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Image from 'react-native-remote-svg';
import { Dialog } from 'react-native-simple-dialogs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import SideMenuDrawer from '../component/SideMenuDrawer';
import { NavigationEvents } from 'react-navigation';
import Navbar from '../component/NavBar';
import { Button, Left, Right } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { Card } from 'react-native-elements';
import { Bars } from 'react-native-loader';
import Toast from 'react-native-simple-toast';
import Endpoint from '../res/url_endpoint';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';

// var dataSource = [];
export default class Message extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userDetail: '',
      token: '',
      user_id: '',
      dataSource: [],
      userSource: [],
      loading: false,
      unread: true,
      read: false,
      rowIndex: null,
      customStyleIndex: 0,
      page: 1,
      nextPage: '',
      lastPage: '',
      message: '',
      subject: '',
      viewMsg: false,
      isRefreshing: false,
    };
    this.data = [];
    this._retrieveData();
  }

  componentDidMount() {
    loc(this);
  }

  componentWillUnMount() {
    rol();
  }

  onRefresh() {
    this.setState({ isRefreshing: true, loading: true }); // true isRefreshing flag for enable pull to refresh indicator
    this.getUserInbox();
  }

  page_reloaded = () => {
    this.setState({ loading: true });
    this._retrieveData();
  };

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('visited_onces');
      if (value !== null) {
        const valueRecieve = JSON.parse(value);
        this.setState({ loading: true, page: 1 });
        console.log(valueRecieve);
        this.setState({
          user_id: valueRecieve.user_id,
          token: valueRecieve.token,
        });
        this.getUserInbox();
      }
    } catch (error) {
      alert(error);
    }
  };

  getUserInbox = () => {
    const { page } = this.state;
    this.setState({ loading: true, isRefreshing: false });
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    console.log(headers);
    var type;
    if (this.state.customStyleIndex == 1) {
      type = 1;
    } else {
      type = 0;
    }
    fetch(
      Endpoint.endPoint.url +
      Endpoint.endPoint.userInbox +
      '?page=' +
      page +
      '&notification_viewed=' +
      type,
      {
        method: 'GET',
        headers: headers,
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ loading: false });
        if (responseJson.data) {
          this.setState({
            dataSource:
              page === 1
                ? responseJson.data
                : [...this.state.dataSource, ...responseJson.data],
            lastPage: responseJson.meta.last_page,
          });
          this.getUserDetail();
        } else {
          alert('Something went wrong.');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  getUserDetail = () => {
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.user_details, {
      method: 'GET',
      headers: headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ loading: false });
        if (responseJson.status == true) {
          this.setState({
            userSource: responseJson.data,
          });
        } else {
          alert('Something went wrong.');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleCustomIndexSelect = index => {
    this.setState(prevState => ({ ...prevState, customStyleIndex: index }));
    this._retrieveData();
  };

  deletePost = item => {
    console.log(item);
    Alert.alert(
      'Are you sure?',
      'Once delete cannot be retrieve',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => console.log('Cancel Pressed') },
      ],
      { cancelable: false },
    );
  };

  onSwipeOpen(rowIndex) {
    this.setState({
      rowIndex: rowIndex,
    });
  }

  onSwipeClose(rowIndex) {
    if (rowIndex === this.state.rowIndex) {
      this.setState({ rowIndex: null });
    }
  }

  markAsRead = id => {
    // this.setState({loading: true});

    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);

    var data = new FormData();
    data.append('inbox_id', id);
    console.log(data);
    if (id != undefined) {
      fetch(Endpoint.endPoint.url + Endpoint.endPoint.userInbox, {
        method: 'POST',
        headers: headers,
        body: data,
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          // this.setState({loading: false});
          if (responseJson.status == true) {
            this._retrieveData();
          } else {
            Toast.show(responseJson.message, Toast.LONG);
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      fetch(Endpoint.endPoint.url + Endpoint.endPoint.userInbox, {
        method: 'POST',
        headers: headers,
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          this.setState({ loading: false });
          if (responseJson.status == true) {
            this._retrieveData();
          } else {
            Toast.show(responseJson.message, Toast.LONG);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  // ListEmpty = () => {
  //   return (
  //     <View>
  //       <Text style={{ textAlign: 'center', marginTop: 50 }}>No Message Found!</Text>
  //     </View>
  //   );
  // };

  onLoadMoreData = () => {
    console.log('this.state.page', this.state.page);
    if (this.state.page <= this.state.lastPage) {
      this.setState(
        {
          page: this.state.page + 1,
        },
        () => {
          this.getUserInbox();
        },
      );
    }
  };

  render() {
    const { customStyleIndex } = this.state;
    var left = <Left style={{ flex: 1 }} />;
    var right = (
      <Right style={{ flex: 1 }}>
        <Button onPress={() => this._sideMenuDrawer.open()} transparent>
          <FontAwesomeIcon
            icon={faBars}
            color={'white'}
            size={height > width ? wp('5.5%') : wp('2.5%')}
          />
        </Button>
      </Right>
    );

    return (
      <SideMenuDrawer
        ref={ref => (this._sideMenuDrawer = ref)}
        style={{ zIndex: 1 }}
        navigation={this.props}>
        <View style={styles.container}>
          <Dialog
            dialogStyle={{ borderRadius: 9 }}
            title={this.state.subject}
            titleStyle={{
              color: '#11075e',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
            visible={this.state.viewMsg}
            onTouchOutside={() => this.setState({ viewMsg: false })}
            onRequestClose={() => {
              this.setState({ viewMsg: false });
            }}>
            <View style={{ alignItems: 'center' }}>
              <Image
                source={{ uri: this.state.userSource.avatar }}
                style={{
                  width: height > width ? wp('20%') : wp('12%'),
                  height: height > width ? wp('20%') : wp('12%'),
                }}
              />
              <Text
                style={{
                  fontSize: height > width ? wp('4%') : wp('2%'),
                  marginVertical: 10,
                }}>
                Hi {this.state.userSource.name}
              </Text>
              <Text style={{ fontSize: height > width ? wp('4%') : wp('2%') }}>
                {this.state.message}
              </Text>
            </View>
          </Dialog>
          <NavigationEvents
            onDidFocus={() => {
              this.page_reloaded();
            }}
          />
          <Navbar
            left={left}
            right={right}
            title="title"
            navigation={this.props}
          />
          {this.state.loading == true ? (
            <View style={styles.spinner}>
              <Bars size={25} color="#11075e" />
            </View>
          ) : null}

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <SegmentedControlTab
              values={['Unread', 'Read']}
              selectedIndex={customStyleIndex}
              onTabPress={this.handleCustomIndexSelect}
              borderRadius={0}
              tabsContainerStyle={{
                height: 50,
                backgroundColor: '#F2F2F2',
                width: '60%',
              }}
              tabStyle={{
                backgroundColor: 'white',
                borderWidth: 0,
                borderColor: 'transparent',
              }}
              activeTabStyle={{ backgroundColor: '#11075e' }}
              tabTextStyle={{
                color: '#11075e',
                fontSize: height > width ? wp('4%') : wp('1.8%'),
              }}
              activeTabTextStyle={{
                color: 'white',
                fontSize: height > width ? wp('4%') : wp('1.8%'),
              }}
            />
          </View>
          {customStyleIndex === 0 &&
            (this.state.dataSource != '' ? (
              <FlatList
                data={this.state.dataSource}
                extraData={this.state}
                onEndReached={() => this.onLoadMoreData()}
                // ListEmptyComponent={this.ListEmpty}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={() => {
                      this.onRefresh();
                    }}
                  />
                }
                onEndReachedThreshold={0.01}
                bounces={false}
                renderItem={({ item, index }) => (
                  <Card containerStyle={styles.card_style}>
                    <TouchableOpacity
                      onPress={() => {
                        this.markAsRead(item.id);
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          padding: 10,
                          paddingBottom: 0,
                          alignItems: 'center',
                          flex: 1,
                        }}>
                        <View style={{ flex: height > width ? 0.6 : 0.7 }}>
                          <Text
                            style={{
                              fontSize: height > width ? wp('3.5%') : wp('2%'),
                              fontWeight: 'bold',
                            }}
                            ellipsizeMode="tail"
                            numberOfLines={2}>
                            {item.content == 'Post'
                              ? item.post.title
                              : item.warren.name}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: height > width ? 0.4 : 0.3,
                            alignItems: 'flex-end',
                          }}>
                          <Text
                            style={{
                              fontSize: height > width ? wp('3.5%') : wp('2%'),
                            }}>
                            {item.time_ago}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          padding: 10,
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            flex: height > width ? 0.6 : 0.7,
                            flexDirection: 'row',
                          }}>
                          {item.action == 'Approved' ? (
                            <View
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: 'green',
                                alignSelf: 'center',
                              }}
                            />
                          ) : (
                              <View
                                style={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: 5,
                                  backgroundColor: 'red',
                                  alignSelf: 'center',
                                }}
                              />
                            )}
                          <Text
                            style={{
                              fontSize: height > width ? wp('3.5%') : wp('2%'),
                              marginLeft: 5,
                              fontWeight: 'bold',
                            }}>
                            {item.action}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: height > width ? 0.4 : 0.3,
                            alignItems: 'flex-end',
                          }}>
                          <Text
                            style={{
                              fontSize: height > width ? wp('3.5%') : wp('2%'),
                              fontWeight: 'bold',
                            }}>
                            {item.content}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Card>
                )}
                keyExtractor={({ id }, index) => id}
              />
            ) :
              <View style={{ marginTop: height > width ? width * 0.5 : width * 0.15, alignSelf: 'center' }}>
                <Image
                  style={{ alignSelf: 'center', width: height > width ? width * 0.14 : width * 0.08, height: height > width ? width * 0.14 : width * 0.08 }}
                  source={require('../images/unreadmsg.png')} />
                <Text style={{ color: '#11075e', marginTop: 5, fontWeight: 'bold', fontSize: height > width ? hp("2%") : hp('3.3%') }}>No Unread Messages Yet</Text>
              </View>
            )}
          {customStyleIndex === 1 &&
            (this.state.dataSource != '' ? (
              <FlatList
                data={this.state.dataSource}
                extraData={this.state}
                onEndReached={() => this.onLoadMoreData()}
                // ListEmptyComponent={this.ListEmpty}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={() => {
                      this.onRefresh();
                    }}
                  />
                }
                onEndReachedThreshold={0.01}
                bounces={false}
                renderItem={({ item, index }) => (
                  <Card containerStyle={styles.card_style}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          message: item.message,
                          subject: item.subject,
                          viewMsg: true,
                        });
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          padding: 10,
                          paddingBottom: 0,
                          alignItems: 'center',
                          flex: 1,
                        }}>
                        <View style={{ flex: height > width ? 0.6 : 0.7 }}>
                          <Text
                            style={{
                              fontSize: height > width ? wp('3.5%') : wp('2%'),
                            }}
                            ellipsizeMode="tail"
                            numberOfLines={2}>
                            {item.content == 'Post'
                              ? item.post.title
                              : item.warren.name}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: height > width ? 0.4 : 0.3,
                            alignItems: 'flex-end',
                          }}>
                          <Text
                            style={{
                              fontSize: height > width ? wp('3.5%') : wp('2%'),
                            }}>
                            {item.time_ago}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          padding: 10,
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            flex: height > width ? 0.6 : 0.7,
                            flexDirection: 'row',
                          }}>
                          {item.action == 'Approved' ? (
                            <View
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: 'green',
                                alignSelf: 'center',
                              }}
                            />
                          ) : (
                              <View
                                style={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: 5,
                                  backgroundColor: 'red',
                                  alignSelf: 'center',
                                }}
                              />
                            )}
                          <Text
                            style={{
                              fontSize: height > width ? wp('3.5%') : wp('2%'),
                              marginLeft: 5,
                            }}>
                            {item.action}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: height > width ? 0.4 : 0.3,
                            alignItems: 'flex-end',
                          }}>
                          <Text
                            style={{
                              fontSize: height > width ? wp('3.5%') : wp('2%'),
                            }}>
                            {item.content}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Card>
                )}
                keyExtractor={({ id }, index) => id}
              />
            ) :
              <View style={{ marginTop: height > width ? width * 0.5 : width * 0.15, alignSelf: 'center' }}>
                <Image
                  style={{ alignSelf: 'center', width: height > width ? width * 0.14 : width * 0.08, height: height > width ? width * 0.14 : width * 0.08 }}
                  source={require('../images/readmsg.png')} />
                <Text style={{ color: '#11075e', marginTop: 5, fontWeight: 'bold', fontSize: height > width ? hp("2%") : hp('3.3%') }}>No Read Messages Yet</Text>
              </View>
            )}
          {customStyleIndex === 0 && this.state.dataSource.length > 0 ? (
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: 'white',
                position: 'absolute',
                bottom: 0,
              }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <TouchableOpacity
                  style={{ padding: 10 }}
                  onPress={() => {
                    this.markAsRead();
                  }}>
                  <Text
                    style={{
                      color: '#5848cf',
                      fontWeight: 'bold',
                      fontSize: height > width ? wp('3.8%') : wp('2%'),
                    }}>
                    Mark all as read
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
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
  },
  card_style: {
    overflow: 'hidden',
    padding: 0,
    borderRadius: 10,
    marginBottom: 5,
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
