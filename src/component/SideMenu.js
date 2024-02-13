/**
 * This is the SideMenu component used in the navbar
 **/

// React native and others libraries imports
import React, { PureComponent } from 'react';
import { ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Image from 'react-native-remote-svg';
import { View, List, ListItem, Body, Item } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faHome,
  faCog,
  faSignOutAlt,
  faList,
  faEnvelope,
  faPlus,
  faUser,
  faBookmark,
} from '@fortawesome/free-solid-svg-icons';
// Our custom files and classes import
import Text from './Text';
import { NavigationEvents } from 'react-navigation';
import {
  widthPercentageToDP as wp,
  listenOrientationChange as loc,
} from 'react-native-responsive-screen';
import Endpoint from '../res/url_endpoint';

export default class SideMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.propsnavi = this.props.navigation;
    this.state = {
      search: '',
      searchError: false,
      subMenu: false,
      subMenuItems: [],
      clickedItem: '',
      roleName: '',
      userDetail: '',
      profilePhoto: '',
      user_name: '',
      email: '',
      token: '',
      user_id: '',
    };
    this._retrieveData();
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('visited_onces');
      if (value !== null) {
        const valueRecieve = JSON.parse(value);
        console.log('valueRecieve', valueRecieve);
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

  page_reloaded = () => {
    this.componentDidMount();
  };

  getUserDetail = () => {
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    console.log('header', headers);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.user_details, {
      method: 'GET',
      headers: headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        // this.setState({loading: false});
        if (responseJson.status == true) {
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

  componentDidMount() {
    loc(this);
    this._retrieveData();
  }

  render() {
    return (
      <ScrollView style={styles.container}>{this.renderMenu()}</ScrollView>
    );
  }

  renderMenu() {
    var { height, width } = Dimensions.get('window');
    return (
      <View style={{ backgroundColor: '#11075e', width: '100%', zIndex: 1 }}>
        <NavigationEvents
          onDidFocus={() => {
            this.page_reloaded();
          }}
        />

        <View style={{ marginTop: 10 }}>
          <View>
            <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
              {this.state.profilePhoto != '' ? (
                <Image
                  source={{ uri: this.state.profilePhoto }}
                  style={{
                    width: height > width ? wp('20%') : wp('12%'),
                    height: height > width ? wp('20%') : wp('12%'),
                  }}
                />
              ) : (
                  <Image
                    source={require('../images/user.jpg')}
                    style={{
                      width: height > width ? wp('20%') : wp('12%'),
                      height: height > width ? wp('20%') : wp('12%'),
                    }}
                  />
                )}
            </View>
            <View style={{ alignSelf: 'center', marginTop: 10 }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: height > width ? wp('4%') : wp('1.8%'),
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
                ellipsizeMode="tail"
                numberOfLines={1}>
                {this.state.user_name}
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: height > width ? wp('4%') : wp('1.8%'),
                  fontWeight: 'bold',
                  textAlign: 'center',
                  paddingHorizontal: 10,
                }}
                ellipsizeMode="tail"
                numberOfLines={1}>
                {this.state.email}
              </Text>
            </View>
            <Item
              style={{
                marginLeft: 20,
                marginRight: 20,
                marginBottom: 5,
                marginTop: 20,
              }}
            />
          </View>

          <List>{this.renderSidemenuItems()}</List>
        </View>
      </View>
    );
  }

  renderSidemenuItems() {
    var { height, width } = Dimensions.get('window');
    let items = [];
    SidemenuItems.map((item, i) => {
      items.push(
        <View key={`sidemenu${item.id}`}>
          {item.title == 'Logout' ? (
            <Item
              style={{
                marginLeft: 20,
                marginRight: 20,
              }}
            />
          ) : null}
          <ListItem
            last={SidemenuItems.length === i + 1}
            noBorder
            key={item.id}
            button={true}>
            <TouchableOpacity
              onPress={() => {
                this.propsnavi.navigation.navigate(item.navigate);
              }}
              style={{
                padding: width * 0.01,
                marginRight: 10,
              }}>
              <FontAwesomeIcon
                icon={item.icon}
                style={{ color: '#5848cf' }}
                size={height > width ? wp('5%') : wp('2.5%')}
              />
            </TouchableOpacity>
            <Body>
              <TouchableOpacity
                onPress={() => {
                  this.propsnavi.navigation.navigate(item.navigate);
                }}>
                <Text
                  style={{
                    color: 'white',
                    paddingLeft: 10,
                    fontSize: height > width ? wp('4%') : wp('2%'),
                  }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            </Body>
          </ListItem>
        </View>,
      );
    });
    return items;
  }
}

const styles = {
  MainContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#11075e',
    zIndex: 1,
  },
  line: {
    width: '100%',
    height: 1,
    marginTop: 10,
    marginBottom: 10,
  },
};

var SidemenuItems = [
  {
    id: 1,
    title: 'Personalized Feeds',
    icon: faHome,
    navigate: 'personalizeFeed',
  },
  {
    id: 2,
    title: 'Warrens',
    icon: faList,
    navigate: 'warren',
  },
  {
    id: 3,
    title: 'Submit a Post',
    icon: faPlus,
    navigate: 'newPost',
  },
  {
    id: 4,
    title: 'Messages',
    icon: faEnvelope,
    navigate: 'message',
  },
  {
    id: 5,
    title: 'My Profile',
    icon: faUser,
    navigate: 'myProfile',
  },
  {
    id: 6,
    title: 'Bookmark',
    icon: faBookmark,
    navigate: 'bookmark',
  },
  {
    id: 7,
    title: 'Settings',
    icon: faCog,
    navigate: 'setting',
  },
  {
    id: 8,
    title: 'Logout',
    icon: faSignOutAlt,
    navigate: 'logout',
  },
];
