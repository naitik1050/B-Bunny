import React, { PureComponent } from 'react';
import { Header, Body, Title, Left, Right } from 'native-base';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationEvents } from 'react-navigation';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
// Our custom files and classes import
import Colors from '../Colors';
import Endpoint from '../res/url_endpoint';

export default class Navbar extends PureComponent {
  constructor(props) {
    console.log("Pro", props)
    super(props);
    this.propsnavi = this.props.navigation;
    this.propsparent = this.props.parent;
    this.state = {
      dataSource: '',
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
        this.getRecentWarrens();
      }
    } catch (error) {
      alert(error);
    }
  };

  page_reloaded = () => {
    this._retrieveData();
  };

  getRecentWarrens = () => {
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    console.log(headers);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.recentWarrens, {
      method: 'GET',
      headers: headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ loading: false });
        console.log("res", responseJson)
        if (responseJson.status == true) {
          this.setState({ dataSource: responseJson.data });
        } else if (responseJson.status == false) {
          // Toast.show(responseJson.msg, Toast.LONG);
        } else {
          alert('Something went wrong');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  warrenClicked = id => {
    if (this.props.parent == undefined) {
      this.propsnavi.navigation.navigate('warrenPost', { warrenId: id });
    } else {
      this.propsparent(id);
    }
  };

  render() {
    return (
      <View>
        <NavigationEvents
          onDidFocus={() => {
            this.page_reloaded();
          }}
        />
        <Header
          style={{
            backgroundColor: Colors.navbarBackgroundColor,
            height: height > width ? hp('8%') : wp('5%'),
            zIndex: -1,
          }}
          backgroundColor={Colors.navbarBackgroundColor}
          androidStatusBarColor={Colors.statusBarColor}
          noShadow={true}>
          {/* <View> */}
          {this.props.left ? this.props.left : <Left style={{ flex: 0.5 }} />}
          <Body style={styles.body}>
            {this.props.title == 'Inbox Notification' ||
              this.props.title == 'Comments' ||
              this.props.title == 'Change Password' ||
              this.props.title == 'Change Email' ||
              this.props.title == 'Customize Profile' ||
              this.props.title == 'Deactivate Account' ||
              this.props.title == 'Suggestion and comment' ||
              this.props.title == 'Contact Us' ||
              this.props.title == 'My Post' ||
              this.props.title == 'My Warrens' ||
              this.props.title == 'My Feeds' ||
              this.props.title == 'Email Notification' ||
              this.props.title == 'Privacy' ||
              this.props.title == 'Security' ||
              this.props.title == 'Subscribe VIP' ? (
              <Title style={styles.title}>{this.props.title}</Title>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  this.propsnavi.navigation.popToTop();
                }}>
                <Image
                  source={require('../images/logo.png')}
                  style={{
                    height: height > width ? hp('8%') : wp('5%'),
                    width: height > width ? hp('12%') : wp('10%'),
                  }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
          </Body>
          {this.props.right ? this.props.right : <Right style={{ flex: 0.5 }} />}
          {/* </View> */}
        </Header>
        <View style={{ backgroundColor: '#5848cf' }}>
          <FlatList
            horizontal={true}
            data={this.state.dataSource}
            showsHorizontalScrollIndicator={false}
            showsVerticleScrollIndicator={false}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 5,
                  paddingHorizontal: 15,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.warrenClicked(item.id);
                  }}>
                  <Text
                    style={{
                      fontSize: height > width ? wp('4%') : wp('2%'),
                      color: 'white',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                    }}>
                    {item.name.includes('&amp;')
                      ? item.name.replace('&amp;', '&')
                      : item.name}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={({ id }, index) => id}
          />
        </View>
      </View>
    );
  }
}
var { height, width } = Dimensions.get('window');
const styles = {
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    // fontFamily: 'Roboto',
    // fontWeight: '100',
    fontSize: height > width ? wp('5.5%') : wp('1.8%'),
    color: 'white',
  },
};
