import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
  FlatList,
  RefreshControl, Image
} from 'react-native';
import { faArrowLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import SideMenuDrawer from '../component/SideMenuDrawer';
import Navbar from '../component/NavBar';
import { Button, Left, Right } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { Card } from 'react-native-elements';
import { Bars } from 'react-native-loader';
import Toast from 'react-native-simple-toast';
import { NavigationEvents } from 'react-navigation';
import Swipeout from 'react-native-swipeout';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Endpoint from '../res/url_endpoint';

export default class MyPost extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userDetail: '',
      token: '',
      user_id: '',
      dataSource: [],
      cartItems: [],
      product: {},
      loading: false,
      warrenName: '',
      postLink: '',
      postTitle: '',
      linkPost: false,
      textPost: false,
      editId: '',
      postText: '',
      postImage: '',
      img_uri: '',
      postType: '',
      image: '',
      rowIndex: null,
      warren_name: '',
      page: 1,
      lastPage: '',
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
        console.log(valueRecieve);
        this.setState({
          user_id: valueRecieve.user_id,
          token: valueRecieve.token,
        });
        this.getUser();
      }
    } catch (error) {
      alert(error);
    }
  };

  // ListEmpty = () => {
  //   return (
  //     <View>
  //       <Text style={{ textAlign: 'center', marginTop: 50 }}>No Post Found!</Text>
  //     </View>
  //   );
  // };

  page_reloaded = () => {
    // console.log('page');
    this.setState({ loading: true });
    this._retrieveData();
  };

  onRefresh() {
    this.setState({ isRefreshing: true, loading: true }); // true isRefreshing flag for enable pull to refresh indicator
    this.getUser();
  }

  getUser = () => {
    const { page } = this.state;
    this.setState({ loading: true, isRefreshing: false });
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    console.log(headers);
    fetch(
      Endpoint.endPoint.url + Endpoint.endPoint.userPosts + '?page=' + page,
      {
        method: 'GET',
        headers: headers,
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({ loading: false });
        if (responseJson.data) {
          this.setState({
            dataSource:
              page === 1
                ? responseJson.data
                : [...this.state.dataSource, ...responseJson.data],
            lastPage: responseJson.last_page,
          });
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
          this.getUser();
        },
      );
    }
  };

  convertDate = date => {
    var t = date.split(/[- :]/);
    // Apply each element to the Date function
    var d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
    var createdDate = new Date(d);
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'June',
      'July',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ];
    var day = createdDate.getDate();
    var month = monthNames[createdDate.getMonth()];

    return day + ' ' + month;
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

    this.setState({ loading: true });
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    fetch(Endpoint.endPoint.url + 'post/' + item.id, {
      method: 'DELETE',
      headers: headers,
    })
      .then(response => response.json())
      .then(responseJson => {

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
  };

  closeRow(rowMap, rowKey) {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  }

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

  render() {
    var left = (
      <Left style={{ flex: 1 }}>
        <Button
          onPress={() => {
            this.props.navigation.goBack();
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
      <Right style={{ flex: 1 }}>

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
          <Navbar left={left} title="My Post" navigation={this.props} right={right} />
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
              onEndReached={() => this.onLoadMoreData()}
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
                              backgroundColor: '#ef4655',
                            }}
                            onPress={() => {
                              this.deletePost(item);
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
                      <View>
                        <Text
                          style={{
                            fontSize: height > width ? wp('3.5%') : wp('2%'),
                            color: 'black',
                            fontWeight: 'bold',
                            textAlign: 'justify',
                          }}
                          ellipsizeMode="tail"
                          numberOfLines={2}>
                          {item.title}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={{
                            fontSize: height > width ? wp('3.5%') : wp('2%'),
                            color: 'grey',
                            marginTop: 5,
                          }}>
                          Created at: {this.convertDate(item.created_at)}
                        </Text>
                      </View>
                    </View>
                    {/* <TouchableOpacity
                      style={{ flex: 0.15, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderColor: 'lightgrey', backgroundColor: 'red' }}
                      onPress={() => {
                        this.deletePost(item);
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
                source={require('../images/post.png')}
              />
              <Text style={{ color: '#11075e', marginTop: 5, fontWeight: 'bold', fontSize: height > width ? hp("2%") : hp('3.3%') }}>No Posts Yet</Text>
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
    paddingBottom: 10,
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
  inputtype_dialog: {
    paddingLeft: 5,
    padding: 5,
    marginTop: 5,
    marginBottom: 15,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'lightgrey',
    color: 'black',
    fontSize: height > width ? wp('3.8%') : wp('2%'),
    alignItems: 'center',
  },
  inputtype_dialog_fix: {
    paddingLeft: 5,
    padding: 5,
    marginTop: 5,
    marginBottom: 15,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'lightgrey',
    color: 'black',
    flexWrap: 'wrap',
    fontSize: height > width ? wp('3.8%') : wp('2%'),
    alignItems: 'center',
    backgroundColor: 'lightgrey',
  },
  backRightBtn: {
    alignItems: 'center',
    // bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: '38%',
    width: 75,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtnLeft: {
    // backgroundColor: 'transparent',
    right: 75,
  },
  backRightBtnRight: {
    // backgroundColor: 'red',
    right: 0,
  },
  UpdatePost: {
    borderRadius: 5,
    backgroundColor: '#11075e',
    padding: 10,
    paddingLeft: 25,
    paddingRight: 25,
    margin: 5,
  },
  CancelUpdatePost: {
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
