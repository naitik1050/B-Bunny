import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions, Image,
  FlatList,
  RefreshControl,
} from 'react-native';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import SideMenuDrawer from '../component/SideMenuDrawer';
import Navbar from '../component/NavBar';
import { Button, Left, Right } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { Card } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
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
export default class Following extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userDetail: '',
      token: '',
      user_id: '',
      dataSource: [],
      searchText: '',
      sortBy: 'created_at',
      loading: false,
      warrenName: '',
      addWarren: false,
      selectedItem: undefined,
      isRefreshing: false,
      selected1: 'key1',
      page: 1,
      lastPage: '',
      // flag: false,
    };
    this._retrieveData();
    this.changeStatus = this.changeStatus.bind(this);
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
        this.setState({ loading: true, page: 1 });
        this.setState({
          user_id: valueRecieve.user_id,
          token: valueRecieve.token,
        });
        this.getFollowingData();
      }
    } catch (error) {
      alert(error);
    }
  };

  onRefresh() {
    this.setState({ isRefreshing: true, loading: true }); // true isRefreshing flag for enable pull to refresh indicator
    this.getFollowingData();
  }

  getFollowingData = () => {
    const { page } = this.state;
    var headers = new Headers();
    this.setState({ isRefreshing: false, loading: true });
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    fetch(
      Endpoint.endPoint.url +
      Endpoint.endPoint.followingWarren +
      '?page=' +
      page,
      {
        method: 'GET',
        headers: headers,
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log('page', this.state.page);
        console.log('Follow', responseJson);
        this.setState({ loading: false });
        if (responseJson.data) {
          this.setState({
            dataSource:
              page === 1
                ? responseJson.data
                : [...this.state.dataSource, ...responseJson.data],
            lastPage: responseJson.meta.last_page,
          });
          console.log('dataSource', this.state.dataSource);
        } else {
          alert('Something went wrong');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  page_reloaded = () => {
    // console.log('page');
    this.setState({ loading: true });
    this._retrieveData();
  };

  // ListEmpty = () => {
  //   return (
  //     <View>
  //       <Text style={{ textAlign: 'center', marginTop: 50 }}>No Warrens Found!</Text>
  //     </View>
  //   );
  // };

  warrenClicked = id => {
    this.props.navigation.navigate('warrenPost', { warrenId: id });
  };

  onLoadMoreData = () => {
    if (this.state.page <= this.state.lastPage) {
      this.setState(
        {
          page: this.state.page + 1,
        },
        () => {
          this.getFollowingData();
        },
      );
    }
  };

  onValueChange(value) {
    this.setState({
      selected1: value,
    });
  }

  changeStatus = warrenId => {
    console.log(warrenId);
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    var data = new FormData();
    data.append('warren_id', warrenId);
    console.log(data);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.subscribeWarren, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({ loading: false });
        if (responseJson.status == true) {
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

  render() {
    var left = (
      <Left style={{ flex: 1 }}>
        <Button onPress={() => this.props.navigation.goBack()} transparent>
          <FontAwesomeIcon
            icon={faArrowLeft}
            color={'white'}
            size={height > width ? wp('5.5%') : wp('2.5%')}
          />
        </Button>
      </Left>
    );
    var right = (
      <Right style={{ flex: 1 }}>
        {/* <Button onPress={() => this._sideMenuDrawer.open()} transparent>
          <FontAwesomeIcon
            icon={faBars}
            color={'white'}
            size={height > width ? wp('5.5%') : wp('2.5%')}
          />
        </Button> */}
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
            title="My Warrens"
            navigation={this.props}
          />
          {this.state.loading == true ? (
            <View style={styles.spinner}>
              <Bars size={25} color="#11075e" />
            </View>
          ) : null}
          {this.state.dataSource != '' ? (
            <FlatList
              data={this.state.dataSource}
              extraData={this.state}
              // ListEmptyComponent={this.ListEmpty}
              onEndReached={this.onLoadMoreData}
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
              renderItem={({ item }) => (
                <Card containerStyle={styles.card_style}>
                  <View
                    style={{
                      flexDirection: 'row',
                      padding: 10,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flex: 1,
                    }}>
                    <View style={{ flex: 0.5 }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.warrenClicked(item.id);
                        }}>
                        <Text
                          style={{
                            fontSize: height > width ? wp('4%') : wp('1.8%'),
                            color: '#11075e',
                            fontWeight: 'bold',
                          }}
                          ellipsizeMode="tail">
                          {item.name.includes('&amp;')
                            ? item.name.replace('&amp;', '&')
                            : item.name}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 0.05 }} />
                    <View style={{ flex: 0.45 }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.changeStatus(item.id);
                        }}
                        style={styles.unfollowBtnCss}>
                        <Text
                          style={{
                            fontSize: height > width ? wp('4%') : wp('1.8%'),
                            color: '#11075e',
                            fontWeight: 'bold',
                            textAlign: 'center',
                          }}>
                          unfollow
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Card>
              )}
              keyExtractor={({ id }, index) => id}
            />
          ) : <View style={{ marginTop: height > width ? width * 0.5 : width * 0.2, alignSelf: 'center' }}>
              <Image
                style={{ alignSelf: 'center', width: height > width ? width * 0.14 : width * 0.08, height: height > width ? width * 0.14 : width * 0.08 }}
                source={require('../images/warren.png')}
              />
              <Text style={{ color: '#11075e', marginTop: 5, fontWeight: 'bold', fontSize: height > width ? hp("2%") : hp('3.3%') }}>No Warrens Yet</Text>
            </View>}
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
    marginBottom: 5,
    borderRadius: 10,
    shadowColor: '#11075e',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  unfollowBtnCss: {
    backgroundColor: 'white',
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    alignSelf: 'stretch',
    borderColor: '#11075e',
    borderWidth: 1,
    borderRadius: 5,
    // alignItems: 'stretch',
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
