import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { faBars, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import SideMenuDrawer from '../component/SideMenuDrawer';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import Navbar from '../component/NavBar';
import { Button, Left, Right } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { Bars } from 'react-native-loader';
import {
  widthPercentageToDP as wp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import { NavigationEvents, ScrollView } from 'react-navigation';

export default class Setting extends PureComponent {
  constructor(props) {
    super(props);
    console.log('props', this.props);
    this.state = {
      userDetail: '',
      token: '',
      user_id: '',
      dataSource: [],
      searchText: '',
      customStyleIndex: 0,
      sortBy: 'created_at',
      loading: false,
      warrenName: '',
      addWarren: false,
    };
    this._retrieveData();
  }

  componentDidMount() {
    loc(this);
  }

  page_reloaded() {
    this._retrieveData();
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
        this._sideMenuDrawer.close();
      }
    } catch (error) {
      alert(error);
    }
  };

  handleCustomIndexSelect = index => {
    this.setState(prevState => ({ ...prevState, customStyleIndex: index }));
    this._retrieveData();
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
          <NavigationEvents
            onDidFocus={() => {
              this.page_reloaded();
            }}
          />
          <Navbar
            left={left}
            right={right}
            title="Test"
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
              values={['Account', 'Notification', 'Others']}
              selectedIndex={customStyleIndex}
              onTabPress={this.handleCustomIndexSelect}
              borderRadius={0}
              tabsContainerStyle={{
                height: 50,
                backgroundColor: '#F2F2F2',
                width: '90%',
              }}
              tabStyle={{
                backgroundColor: 'white',
                borderWidth: 0,
                borderColor: 'transparent',
              }}
              activeTabStyle={{ backgroundColor: '#11075e' }}
              tabTextStyle={{
                color: '#11075e',
                fontSize: height > width ? wp('4.2%') : wp('2%'),
              }}
              activeTabTextStyle={{
                color: 'white',
                fontSize: height > width ? wp('4.2%') : wp('2%'),
              }}
            />
          </View>
          {customStyleIndex === 0 && (
            <ScrollView>
              <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('myPost');
                  }}
                  style={{ marginTop: 5 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 10,
                    }}>
                    <View style={{ flex: 0.98 }}>
                      <Text style={styles.innerTitle}>My Posts</Text>
                    </View>
                    <View>
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        color={'black'}
                        size={height > width ? wp('4%') : wp('1.8%')}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('myRSSFeeds');
                  }}
                  style={{ marginTop: 5 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 10,
                    }}>
                    <View style={{ flex: 0.98 }}>
                      <Text style={styles.innerTitle}>My RSS Feeds</Text>
                    </View>
                    <View>
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        color={'black'}
                        size={height > width ? wp('4%') : wp('1.8%')}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('personalizeFeed', {
                      value: 'myFeed',
                    });
                  }}
                  style={{ marginTop: 5 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 10,
                    }}>
                    <View style={{ flex: 0.98 }}>
                      <Text style={styles.innerTitle}>My Feeds</Text>
                    </View>
                    <View>
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        color={'black'}
                        size={height > width ? wp('4%') : wp('1.8%')}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('following');
                  }}
                  style={{ marginTop: 5 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 10,
                    }}>
                    <View style={{ flex: 0.98 }}>
                      <Text style={styles.innerTitle}>My Warrens</Text>
                    </View>
                    <View>
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        color={'black'}
                        size={height > width ? wp('4%') : wp('1.8%')}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('changeEmail');
                  }}
                  style={{ marginTop: 5 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 10,
                    }}>
                    <View style={{ flex: 0.98 }}>
                      <Text style={styles.innerTitle}>Change Email</Text>
                    </View>
                    <View>
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        color={'black'}
                        size={height > width ? wp('4%') : wp('1.8%')}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('changePassword');
                  }}
                  style={{ marginTop: 5 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 10,
                    }}>
                    <View style={{ flex: 0.98 }}>
                      <Text style={styles.innerTitle}>Change Password</Text>
                    </View>
                    <View>
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        color={'black'}
                        size={height > width ? wp('4%') : wp('1.8%')}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('editProfile');
                  }}
                  style={{ marginTop: 5 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 10,
                    }}>
                    <View style={{ flex: 0.98 }}>
                      <Text style={styles.innerTitle}>Customize Profile</Text>
                    </View>
                    <View>
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        color={'black'}
                        size={height > width ? wp('4%') : wp('1.8%')}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('blockUser');
                  }}
                  style={{ marginTop: 5 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 10,
                    }}>
                    <View style={{ flex: 0.98 }}>
                      <Text style={styles.innerTitle}>Blocked Users List</Text>
                    </View>
                    <View>
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        color={'black'}
                        size={height > width ? wp('4%') : wp('1.8%')}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('blockedDomains');
                  }}
                  style={{ marginTop: 5 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 10,
                    }}>
                    <View style={{ flex: 0.98 }}>
                      <Text style={styles.innerTitle}>Blocked Domains List</Text>
                    </View>
                    <View>
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        color={'black'}
                        size={height > width ? wp('4%') : wp('1.8%')}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('deactivate');
                  }}
                  style={{ marginTop: 5 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 10,
                    }}>
                    <View style={{ flex: 0.98 }}>
                      <Text style={styles.innerTitle}>Deactivate Account</Text>
                    </View>
                    <View>
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        color={'black'}
                        size={height > width ? wp('4%') : wp('1.8%')}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
          {customStyleIndex === 1 && (
            <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('notification', {
                    value: 'Inbox',
                  });
                }}
                style={{ marginTop: 5 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <View style={{ flex: 0.98 }}>
                    <Text style={styles.innerTitle}>Inbox Notification</Text>
                  </View>
                  <View>
                    <FontAwesomeIcon
                      icon={faAngleRight}
                      color={'black'}
                      size={height > width ? wp('4%') : wp('1.8%')}
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('notification', {
                    value: 'Email',
                  });
                }}
                style={{ marginTop: 5 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <View style={{ flex: 0.98 }}>
                    <Text style={styles.innerTitle}>Email Notification</Text>
                  </View>
                  <View>
                    <FontAwesomeIcon
                      icon={faAngleRight}
                      color={'black'}
                      size={height > width ? wp('4%') : wp('1.8%')}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
          {customStyleIndex === 2 && (
            <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('privacy', {
                    value: 'Privacy',
                  });
                }}
                style={{ marginTop: 5 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <View style={{ flex: 0.98 }}>
                    <Text style={styles.innerTitle}>Privacy</Text>
                  </View>
                  <View>
                    <FontAwesomeIcon
                      icon={faAngleRight}
                      color={'black'}
                      size={height > width ? wp('4%') : wp('1.8%')}
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('privacy', {
                    value: 'Security',
                  });
                }}
                style={{ marginTop: 5 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <View style={{ flex: 0.98 }}>
                    <Text style={styles.innerTitle}>Security</Text>
                  </View>
                  <View>
                    <FontAwesomeIcon
                      icon={faAngleRight}
                      color={'black'}
                      size={height > width ? wp('4%') : wp('1.8%')}
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('submitRSSFeed');
                }}
                style={{ marginTop: 5 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <View style={{ flex: 0.98 }}>
                    <Text style={styles.innerTitle}>Submit RSS Feed</Text>
                  </View>
                  <View>
                    <FontAwesomeIcon
                      icon={faAngleRight}
                      color={'black'}
                      size={height > width ? wp('4%') : wp('1.8%')}
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('feedback');
                }}
                style={{ marginTop: 5 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <View style={{ flex: 0.98 }}>
                    <Text style={styles.innerTitle}>Suggestion & Feedback</Text>
                  </View>
                  <View>
                    <FontAwesomeIcon
                      icon={faAngleRight}
                      color={'black'}
                      size={height > width ? wp('4%') : wp('1.8%')}
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('contact');
                }}
                style={{ marginTop: 5 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <View style={{ flex: 0.98 }}>
                    <Text style={styles.innerTitle}>Contact Us</Text>
                  </View>
                  <View>
                    <FontAwesomeIcon
                      icon={faAngleRight}
                      color={'black'}
                      size={height > width ? wp('4%') : wp('1.8%')}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
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
    fontSize: height > width ? wp('4%') : wp('1.8%'),
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
