import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  Linking,
  Alert,
  ScrollView,
  TextInput,
  SafeAreaView, Image
} from 'react-native';
import {
  faArrowLeft,
  faTag,
  faTrash,
  faPencilAlt,
} from '@fortawesome/free-solid-svg-icons';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { Dialog } from 'react-native-simple-dialogs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Header, Body, Title, Left, Button, Right } from 'native-base';
import Autocomplete from 'react-native-autocomplete-input';
import AsyncStorage from '@react-native-community/async-storage';
import { Bars } from 'react-native-loader';
import Swipeout from 'react-native-swipeout';
import { Card } from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import Endpoint from '../res/url_endpoint';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
const Device = require('react-native-device-detection');
export default class MyRSSFeeds extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userDetail: '',
      token: '',
      user_id: '',
      dataSource: [],
      listWarrens: [],
      query: '',
      name: '',
      warren_name: '',
      warren_id: '',
      loading: false,
      page: 1,
      lastPage: '',
      isRefreshing: false,
      rowIndex: null,
      updateFeed: false,
      feedId: '',
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
        this.setState({ loading: true, page: 1 });
        this.setState({
          user_id: valueRecieve.user_id,
          token: valueRecieve.token,
        });
        this.getRSSFeedsList();
      }
    } catch (error) {
      alert(error);
    }
  };

  onLoadMoreData = () => {
    if (this.state.page <= this.state.lastPage) {
      this.setState(
        {
          page: this.state.page + 1,
        },
        () => {
          this.getRSSFeedsList();
        },
      );
    }
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

  openLink = async item => {
    try {
      const isAvailable = await InAppBrowser.isAvailable();
      if (isAvailable) {
        InAppBrowser.open(item.link, {
          showTitle: true,
          toolbarColor: '#11075e',
          secondaryToolbarColor: 'black',
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: true,
        }).then(result => {
          console.log('Success' + result);
        });
      } else Linking.openURL(item.link);
    } catch (error) {
      alert(error.message);
    }
  };

  update = item => {
    console.log(item);
    this.setState({
      feedId: item.id,
      updateFeed: true,
    });
  };

  updateNewFeed = warrenId => {
    console.log(warrenId);
    console.log(this.state.name);
    this.setState({ updateFeed: false, loading: true });
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    var data = new FormData();
    data.append('name', this.state.name);
    data.append('warren_id', warrenId);
    data.append('type', 'Public');
    data.append('active', 1);
    data.append('id', this.state.feedId);
    console.log(data);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.update_feedlink, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({ loading: false });
        if (responseJson.status == true) {
          Toast.show(responseJson.msg, Toast.LONG);
          this._retrieveData();
        } else {
          alert('Something went wrong');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  deleteRSSFeed = item => {
    Alert.alert(
      'Are you sure?',
      'Once delete cannot be retrieve',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            this.delete(item);
          },
        },
      ],
      { cancelable: false },
    );
  };

  delete = item => {
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    fetch(Endpoint.endPoint.url + 'feedlink/' + item.id, {
      method: 'DELETE',
      headers: headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.status == true) {
          this._retrieveData();
        } else if (responseJson.status == false) {
          Toast.show(responseJson.msg, Toast.LONG);
        } else {
          Toast.show('Something went wrong.', Toast.LONG);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  displayWarrens = list => {
    var items = [];
    list.map(item => {
      items.push(
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#FDFCFC',
            padding: 5,
            margin: 2,
            borderRadius: 5,
            elevation: 1,
          }}>
          <FontAwesomeIcon
            icon={faTag}
            color={'#afaaaa'}
            size={height > width ? wp('5%') : wp('2.5%')}
            style={{ marginHorizontal: 5 }}
          />
          <Text
            style={{
              marginRight: 5,
              fontSize: height > width ? wp('3.5%') : wp('1.5%'),
            }}>
            {item.name}
          </Text>
        </View>,
      );
    });
    return items;
  };

  onRefresh() {
    this.setState({ isRefreshing: true, loading: true }); // true isRefreshing flag for enable pull to refresh indicator
    this._retrieveData();
  }

  // ListEmpty = () => {
  //   return (
  //     <View>
  //       <Text style={{textAlign: 'center', marginTop: 50}}>
  //         No Feeds Found!
  //       </Text>
  //     </View>
  //   );
  // };

  findWarrens(query) {
    if (query === '') {
      //if the query is null then return blank
      return [];
    } else {
      //making a case insensitive regular expression to get similar value from the film json
      const regex = new RegExp(query.trim(), 'i');
      const { listWarrens } = this.state;
      var headers = new Headers();
      let auth = 'Bearer ' + this.state.token;
      headers.append('Authorization', auth);
      fetch(
        Endpoint.endPoint.url +
        Endpoint.endPoint.warrenWithChildren +
        '?q=' +
        query,
        {
          method: 'GET',
          headers: headers,
        },
      )
        .then(response => response.json())
        .then(responseJson => {
          this.setState({ loading: false });
          if (responseJson) {
            this.setState({ listWarrens: responseJson.data });
          } else {
            alert('Something went wrong');
          }
        })
        .catch(error => {
          console.log(error);
        });
      //return the filtered film array according the query from the input
      return listWarrens.filter(warren => warren.name.search(regex) >= 0);
    }
  }

  getRSSFeedsList = () => {
    const { page } = this.state;
    this.setState({ loading: true, isRefreshing: false });
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    fetch(
      Endpoint.endPoint.url + Endpoint.endPoint.user_feedlink + '?page=' + page,
      {
        method: 'GET',
        headers: headers,
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        console.log(
          Endpoint.endPoint.url +
          Endpoint.endPoint.user_feedlink +
          '?page=' +
          page,
        );
        this.setState({ loading: false });
        if (responseJson.status == true) {
          this.setState({
            dataSource:
              page === 1
                ? responseJson.data
                : [...this.state.dataSource, ...responseJson.data],
            lastPage: responseJson.meta.last_page,
            name: responseJson.data[0].name,
            warren_name: responseJson.data[0].warrens[0].name,
            warren_id: responseJson.data[0].warrens[0].id,
          });
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
    const { query } = this.state;
    const listWarrens = this.findWarrens(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
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
      <SafeAreaView style={styles.container}>
        <Header style={{ backgroundColor: '#11075e' }}>
          {left}
          <Body style={{ justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>
            <Title style={{ fontSize: height > width ? wp('5.5%') : wp('1.8%') }}>MyRSSFeeds</Title>
          </Body>
          {right}
        </Header>
        {this.state.loading == true ? (
          <View style={styles.spinner}>
            <Bars size={25} color="#11075e" />
          </View>
        ) : null}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}>
          {/* Update Dialog */}
          <Dialog
            dialogStyle={{ borderRadius: 9 }}
            titleStyle={{
              fontWeight: 'bold',
              color: '#11075e',
              textAlign: 'center',
            }}
            title="Update RSS Feed"
            visible={this.state.updateFeed}
            onTouchOutside={() =>
              this.setState({ updateFeed: false, warren_id: '', query: '' })
            }
            onRequestClose={() => {
              this.setState({ updateFeed: false, warren_id: '', query: '' });
            }}>
            <ScrollView>
              <View>
                <TextInput
                  style={styles.inputtype_dialog}
                  placeholder="Website Name"
                  placeholderTextColor="grey"
                  defaultValue={this.state.name}
                  numberOfLines={1}
                  onChangeText={name => {
                    this.setState({ name: name });
                  }}
                  multiline={true}
                />
                <Text
                  style={{
                    color: '#11075e',
                    fontWeight: 'bold',
                    fontSize: height > width ? wp('3.8%') : wp('2%'),
                    marginVertical: 10,
                  }}>
                  Select Category:
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Autocomplete
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardShouldPersistTaps="true"
                    style={{
                      fontSize: Device.isPhone
                        ? wp('4.5%')
                        : Device.isTablet
                          ? wp('2.5%')
                          : null,
                    }}
                    inputContainerStyle={styles.autocompleteContainer}
                    listContainerStyle={{ alignItems: 'center' }}
                    listStyle={{
                      maxHeight: 145,
                      width: wp('75%'),
                      position: 'absolute',
                      zIndex: 1,
                      backgroundColor: 'white',
                    }}
                    data={
                      listWarrens.length === 1 &&
                        comp(query, listWarrens[0].name)
                        ? []
                        : listWarrens
                    }
                    defaultValue={query}
                    onChangeText={text => this.setState({ query: text })}
                    placeholder="Type a category"
                    placeholderTextColor="grey"
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={{
                          borderWidth: 1,
                          marginTop: 2,
                          borderColor: 'grey',
                          paddingVertical: 10,
                          paddingLeft: 10,
                        }}
                        onPress={() =>
                          this.setState({
                            query: item.name,
                            warren_id: item.id,
                          })
                        }>
                        <Text style={styles.itemText}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                    flatListProps={{
                      nestedScrollEnabled: true,
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'flex-end',
                  marginTop: 10,
                }}>
                <TouchableOpacity
                  style={styles.CancelReportPost}
                  onPress={() => {
                    this.setState({
                      updateFeed: false,
                      name: '',
                    });
                  }}>
                  <Text
                    style={{
                      color: '#11075e',
                      fontSize: height > width ? wp('4.5%') : wp('1.8%'),
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.reportPost}
                  onPress={() => {
                    this.updateNewFeed(this.state.warren_id);
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: height > width ? wp('4.5%') : wp('1.8%'),
                    }}>
                    Update
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Dialog>
          {this.state.dataSource != '' ? (
            <FlatList
              data={this.state.dataSource}
              extraData={this.state}
              // ListEmptyComponent={this.ListEmpty}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={() => {
                    this.onRefresh();
                  }}
                />

              }
              onEndReachedThreshold={0.1}
              onEndReached={() => this.onLoadMoreData()}
              bounces={false}
              renderItem={({ item, i }) => (
                <Card containerStyle={styles.card_style}>
                  <Swipeout
                    right={[
                      {
                        component: (
                          <TouchableOpacity
                            style={{
                              flex: 1,
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexDirection: 'column',
                              backgroundColor: '#0095ff',
                            }}
                            onPress={() => {
                              this.update(item);
                            }}>
                            <FontAwesomeIcon
                              icon={faPencilAlt}
                              color={'white'}
                              size={height > width ? wp('5.5%') : wp('2.5%')}
                            />
                          </TouchableOpacity>
                        ),
                      },
                      {
                        component: (
                          <TouchableOpacity
                            style={{
                              flex: 1,
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexDirection: 'column',
                              backgroundColor: 'red',
                            }}
                            onPress={() => {
                              this.deleteRSSFeed(item);
                            }}>
                            <FontAwesomeIcon
                              icon={faTrash}
                              color={'white'}
                              size={height > width ? wp('5.5%') : wp('2.5%')}
                            />
                          </TouchableOpacity>
                        ),
                      },
                    ]}
                    autoClose={true}
                    style={{ backgroundColor: 'white' }}
                    onOpen={() => this.onSwipeOpen(i)}
                    close={this.state.rowIndex !== i}
                    onClose={() => this.onSwipeClose(i)}
                    rowIndex={i}>
                    {/* <View style={{ flexDirection: 'row' }}> */}
                    <View
                      style={{
                        flexDirection: 'column',
                        padding: 10,
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.openLink(item);
                        }}>
                        <Text
                          style={{
                            color: '#11075e',
                            fontWeight: 'bold',
                            fontSize: height > width ? wp('3.5%') : wp('1.8%'),
                          }}
                          ellipsizeMode="tail"
                          numberOfLines={2}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 5,
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: 'grey',
                            fontSize: height > width ? wp('3%') : wp('1.2%'),
                            fontWeight: 'bold',
                          }}
                          ellipsizeMode="tail"
                          numberOfLines={1}>
                          {item.link}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 5,
                          flexWrap: 'wrap',
                        }}>
                        {this.displayWarrens(item.warrens)}
                      </View>
                    </View>
                    {/* <TouchableOpacity
                                        style={{
                                            flex: 0.15,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderLeftWidth: 1,
                                            borderColor: 'lightgrey',
                                            backgroundColor: 'red',
                                        }}
                                        onPress={() => {
                                            this.deleteRSSFeed(item);
                                        }}
                                        transparent>
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            color={'white'}
                                            size={height > width ? wp('5.5%') : wp('2.5%')}
                                        />
                                    </TouchableOpacity> */}
                    {/* </View> */}
                  </Swipeout>
                </Card>
              )}
              keyExtractor={({ id }, index) => id}
            />
          ) : <View style={{ marginTop: height > width ? width * 0.5 : width * 0.2, alignSelf: 'center' }}>
              <Image
                style={{ alignSelf: 'center', width: height > width ? width * 0.14 : width * 0.08, height: height > width ? width * 0.14 : width * 0.08 }}
                source={require('../images/newsfeed.png')}
              />
              <Text style={{ color: '#11075e', marginTop: 5, fontWeight: 'bold', fontSize: height > width ? hp("2%") : hp('3.3%') }}>No RSSFeeds Yet</Text>
            </View>}
        </ScrollView>
      </SafeAreaView>
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
  autocompleteContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    paddingLeft: 5,
    borderColor: 'grey',
  },
  itemText: {
    color: 'grey',
    fontSize: Device.isPhone ? wp('4.5%') : Device.isTablet ? wp('2.5%') : null,
  },
  inputtype_dialog: {
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 1,
    paddingLeft: 10,
    paddingVertical: 10,
    textAlignVertical: 'top',
    color: 'black',
    flexWrap: 'wrap',
    fontSize: Device.isPhone ? wp('4.5%') : Device.isTablet ? wp('2.5%') : null,
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
