import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  RefreshControl, Image
} from 'react-native';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import SideMenuDrawer from '../component/SideMenuDrawer';
import { Header, Body, Title, Left, Button, Right } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { Card } from 'react-native-elements';
import { Bars } from 'react-native-loader';
import Toast from 'react-native-simple-toast';
import Endpoint from '../res/url_endpoint';
import {
  widthPercentageToDP as wp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';

// var dataSource = [];
export default class BlockedDomains extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userDetail: '',
      token: '',
      user_id: '',
      page: 1,
      lastPage: '',
      dataSource: [],
      loading: false,
      isRefreshing: false,
    };
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
    this.getDomainList();
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('visited_onces');
      if (value !== null) {
        const valueRecieve = JSON.parse(value);
        this.setState({ loading: true });
        this.setState({
          user_id: valueRecieve.user_id,
          token: valueRecieve.token,
        });
        this.getDomainList();
      }
    } catch (error) {
      alert(error);
    }
  };

  getDomainList = () => {
    this.setState({ isRefreshing: false, loading: true });
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.exclude_domain, {
      method: 'GET',
      headers: headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('listWarrens', responseJson);
        this.setState({ loading: false });
        if (responseJson.status == true) {
          this.setState({
            dataSource: responseJson.data,
            lastPage: responseJson.meta.last_page,
            loading: false,
          });
        } else {
          alert('Something went wrong');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  // onLoadMoreData = () => {
  //   if (this.state.page <= this.state.lastPage) {
  //     this.setState(
  //       {
  //         page: this.state.page + 1,
  //       },
  //       () => {
  //         this.getDomainList();
  //       },
  //     );
  //   }
  // };

  unBlockDomain = blockedId => {
    this.setState({ loading: true });
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    fetch(
      Endpoint.endPoint.url +
      Endpoint.endPoint.exclude_domain +
      '/' +
      blockedId,
      {
        method: 'DELETE',
        headers: headers,
      },
    )
      .then(response => response.json())
      .then(responseJson => {
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

  render() {
    var left = (
      <Left style={{ flex: 0.3 }}>
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
      <Right style={{ flex: 0.3 }}>
      </Right>
    );


    return (
      <SideMenuDrawer
        ref={ref => (this._sideMenuDrawer = ref)}
        style={{ zIndex: 1 }}
        navigation={this.props}>
        <View style={styles.container}>
          <Header style={{ backgroundColor: '#11075e' }}>
            {left}
            <Body style={{ justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>
              <Title style={{ fontSize: height > width ? wp('5.5%') : wp('1.8%') }}>Block Domains</Title>
            </Body>
            {right}
          </Header>
          {this.state.loading == true ? (
            <View style={styles.spinner}>
              <Bars size={25} color="#11075e" />
            </View>
          ) : null}
          {this.state.dataSource != '' ? (
            <FlatList
              data={this.state.dataSource}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={() => {
                    this.onRefresh();
                  }}
                />
              }
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
                    <View style={{ flex: 0.65 }}>
                      <Text
                        style={{
                          fontSize: height > width ? wp('4%') : wp('1.8%'),
                          color: '#11075e',
                          fontWeight: 'bold',
                        }}>
                        {item.name}
                      </Text>
                    </View>
                    <View style={{ flex: 0.4 }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.unBlockDomain(item.id);
                        }}
                        style={styles.unBlockBtnCss}>

                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                          <View style={{ justifyContent: 'center' }}>
                            <Image style={{ width: width > height ? 25 : 18, height: width > height ? 25 : 17 }} resizeMode="cover" source={require('../images/unlock2.png')} />
                          </View>
                          <Text
                            style={{
                              fontSize: height > width ? wp('4%') : wp('1.8%'),
                              color: 'white',
                              fontWeight: 'bold',
                              textAlign: 'center',
                              marginLeft: width > height ? 25 : 10
                            }}>
                            Unblock
                        </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Card>
              )}
              keyExtractor={({ id }, index) => id}
            />
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
    marginBottom: 5,
    borderRadius: 10,
    shadowColor: '#11075e',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  unBlockBtnCss: {
    backgroundColor: '#ef4655',
    paddingVertical: 10,
    alignSelf: 'stretch',
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
