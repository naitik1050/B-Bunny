import React, { PureComponent } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Linking,
  RefreshControl,
} from 'react-native';
import {
  faBars,
  faCalendarAlt,
  faTrash,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
import SideMenuDrawer from '../component/SideMenuDrawer';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import Toast from 'react-native-simple-toast';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Button, Left, Right, Container } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { Bars } from 'react-native-loader';
import { Card } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import Navbar from '../component/NavBar';
import Endpoint from '../res/url_endpoint';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import { FlatList } from 'react-native';

var { height, width } = Dimensions.get('window');
export default class Bookmark extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      user_id: '',
      billing_type: '',
      following_count: '',
      email_verified: '',
      dataSource: [],
      dataSourceWarren: [],
      postType: 'link',
      per_page: 10,
      page: 1,
      warrenPage: 1,
      lastPage: '',
      lastWarrenPage: '',
      loading: false,
      open: false,
      id: '',
      slug: '',
      title: '',
      isRefreshing: false,
      warren_id: '',
      entity: 'Post',
    };
    this._retrieveData();
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
          billing_type: valueRecieve.billing_type,
        });

        this.getBookmark();
      }
    } catch (error) {
      alert(error);
    }
  };

  getBookmark = () => {
    this.setState({ isRefreshing: false, loading: true });
    const { page } = this.state;
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    fetch(
      Endpoint.endPoint.url +
      'bookmark?per_page=' +
      this.state.per_page +
      '&entity=' +
      this.state.entity +
      '&page=' +
      this.state.page,
      {
        method: 'GET',
        headers: headers,
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log("API==>", Endpoint.endPoint.url +
          'bookmark?per_page=' +
          this.state.per_page +
          '&entity=' +
          this.state.entity +
          '&page=' +
          this.state.page)
        console.log("Responce ==>", responseJson)
        if (responseJson.status == true) {
          this.setState({
            dataSource:
              page === 1
                ? responseJson.data
                : [...this.state.dataSource, ...responseJson.data],
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

  onRefresh() {
    this.setState({ isRefreshing: true, loading: true }); // true isRefreshing flag for enable pull to refresh indicator
    this.getBookmark();
  }

  openLink = async item => {
    try {
      const isAvailable = await InAppBrowser.isAvailable();
      if (isAvailable) {
        InAppBrowser.open(item.post.link, {
          showTitle: true,
          toolbarColor: '#11075e',
          secondaryToolbarColor: 'black',
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: true,
        }).then(result => {
          console.log('Success' + result);
        });
      } else Linking.openURL(item.post.link);
    } catch (error) {
      alert(error.message);
    }
  };

  openPost = item => {
    this.props.navigation.navigate('singlePost', {
      Slug: item.post.slug,
    });
  };

  componentWillUnMount() {
    rol();
  }

  page_reloaded = () => {
    this._sideMenuDrawer.close();
    this.setState({ loading: true });
    this._retrieveData();
  };

  bookmarkDeleted = id => {
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    var data = new FormData();
    data.append('entity', 'Post');
    data.append('entity_id', id);
    console.log();
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.bookmark + '/delete', {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status == true) {
          Toast.show(responseJson.msg + ' Successfully', Toast.LONG);
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

  onLoadMoreData = () => {
    if (this.state.page <= this.state.lastPage) {
      this.setState(
        {
          page: this.state.page + 1,
        },
        () => {
          this.getBookmark();
        },
      );
    }
  };

  render() {
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
      <Container>
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

            {this.state.dataSource != '' ? (
              <FlatList
                data={this.state.dataSource}
                showsHorizontalScrollIndicator={false}
                showsVerticleScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={() => {
                      this.onRefresh();
                    }}
                  />
                }
                extraData={this.state}
                onEndReached={() => this.onLoadMoreData()}
                onEndReachedThreshold={0.01}
                bounces={true}
                renderItem={({ item }) => (
                  <Card containerStyle={styles.card_style}>
                    <View>
                      <TouchableOpacity
                        style={{
                          maxHeight: height > width ? hp('21%') : hp('30%'),
                        }}
                        onPress={() => {
                          this.openPost(item);
                          // alert(JSON.stringify(item.images[7].link))
                        }}>
                        <Image
                          style={{
                            width: '100%',
                            height: '100%',
                            borderTopRightRadius: 5,
                            borderTopLeftRadius: 5,
                          }}
                          source={
                            item.post.image == null
                              ? require('../images/emptyImg.png')
                              : { uri: item.post.image }
                          }
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        paddingHorizontal: 10,
                        paddingTop: 10,
                      }}>
                      <View style={{}}>
                        <TouchableOpacity
                          onPress={() => {
                            this.openPost(item);
                            // alert(item.post.slug)
                          }}>
                          <Text
                            style={{
                              color: '#11075e',
                              fontWeight: 'bold',
                              fontSize:
                                height > width ? wp('3.5%') : wp('1.8%'),
                            }}
                            ellipsizeMode="tail"
                            numberOfLines={2}>
                            {item.post.title}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          marginTop: 10,
                          marginVertical: 2,
                          flexWrap: 'wrap',
                          flexDirection: 'row',
                        }}>
                        <View
                          style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <FontAwesomeIcon
                            icon={faCalendarAlt}
                            color={'grey'}
                            size={height > width ? wp('3%') : wp('2.5%')}
                          />
                          <Text
                            style={{
                              color: 'grey',
                              fontSize: height > width ? wp('3%') : wp('1.2%'),
                            }}>
                            {' ' + item.time_ago}
                          </Text>
                        </View>
                        <Text
                          style={{
                            color: 'grey',
                            marginHorizontal: 8,
                          }}>
                          |
                        </Text>
                        {this.state.postType == 'link' ? (
                          <TouchableOpacity
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                            onPress={() => {
                              this.openLink(item);
                            }}>
                            <FontAwesomeIcon
                              icon={faExternalLinkAlt}
                              color={'grey'}
                              size={height > width ? wp('3%') : wp('1.2%')}
                              style={{ marginRight: 5, fontWeight: 'bold' }}
                            />
                            <Text
                              style={{
                                color: 'grey',
                                fontSize:
                                  height > width ? wp('3%') : wp('1.2%'),
                                fontWeight: 'bold',
                              }}
                              ellipsizeMode="tail"
                              numberOfLines={1}>
                              {item.post.link.split('/')[2]}
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                        <Text
                          style={{
                            color: 'grey',
                            marginHorizontal: 8,
                          }}>
                          |
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            this.bookmarkDeleted(item.entity_id);
                          }}>
                          <FontAwesomeIcon
                            icon={faTrash}
                            color={'black'}
                            size={height > width ? wp('4.5%') : wp('2.5%')}
                          />
                        </TouchableOpacity>
                      </View>

                      <View style={{ marginTop: 5, marginBottom: 10 }}>
                        <Text
                          style={{
                            color: '#000000',
                            fontSize: height > width ? wp('3.2%') : wp('1.8%'),
                            lineHeight: height > width ? wp('4%') : wp('2.5%'),
                          }}
                          ellipsizeMode="tail"
                          numberOfLines={2}>
                          {item.post.text}
                        </Text>
                      </View>
                    </View>
                  </Card>
                )}
                keyExtractor={({ id }, index) => id}
              />
            ) : (
                <View style={{ marginTop: width * 0.6, alignSelf: 'center' }}>
                  <Image
                    style={{
                      alignSelf: 'center',
                      width: width * 0.14,
                      height: width * 0.14,
                    }}
                    source={require('../images/bookmark.png')}
                  />
                  <Text
                    style={{ color: '#11075e', marginTop: 5, fontWeight: 'bold' }}>
                    No Bookmarks Yet
                </Text>
                </View>
              )}
          </View>
        </SideMenuDrawer>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  card_style: {
    marginBottom: 5,
    padding: 0,
    borderRadius: 5,
    shadowColor: '#11075e',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    overflow: 'hidden',
    elevation: 3,
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
