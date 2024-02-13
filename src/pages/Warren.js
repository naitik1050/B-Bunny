import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native';
import {
  faBars,
  faSearch,
  faTimes,
  faList,
  faAngleDown,
  faAngleUp,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-native-modal';
import TreeView from 'react-native-final-tree-view';
import RadioGroup from 'react-native-radio-buttons-group';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import SideMenuDrawer from '../component/SideMenuDrawer';
import Navbar from '../component/NavBar';
import { Button, Left, Right } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { Card } from 'react-native-elements';
import { Bars } from 'react-native-loader';
import { Dialog } from 'react-native-simple-dialogs';
import Toast from 'react-native-simple-toast';
import { NavigationEvents } from 'react-navigation';
import Endpoint from '../res/url_endpoint';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import NetInfo from '@react-native-community/netinfo';

// import { Image } from 'react-native-svg';

export default class Warren extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userDetail: '',
      token: '',
      user_id: '',
      page: 1,
      lastPage: '',
      dataSource: [],
      listSource: [],
      searchText: '',
      sortBy: 'name',
      loading: false,
      warrenName: '',
      warrenDesc: '',
      btnDialog: false,
      addWarren: false,
      isVisible: false,
      isSearch: false,
      flag: 1,
      orderBy: 'ASC',
      isRefreshing: false,
      loginmodal: false,
      logintext: "",
      sortData: [
        {
          label: 'Most Recent',
          value: 'created_at',
          color: '#11075e',
          size: height > width ? 16 : 25,
        },
        {
          label: 'By Name',
          value: 'name',
          color: '#11075e',
          selected: true,
          size: height > width ? 16 : 25,
        },
        {
          label: 'Most Popular',
          value: 'subscribers_count',
          color: '#11075e',
          size: height > width ? 16 : 25,
        },
      ],
    };
    this._retrieveData();
    this.changeStatus = this.changeStatus.bind(this);
  }

  componentDidMount() {
    const netInfo = NetInfo.addEventListener(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      console.log(netInfo);

      if (state.isConnected == true) {
        this.onRefresh();
      }
      else {

        Alert.alert(
          'No network connection',
          'No internet connection. connect to the internet and try again.',
          [
            {
              text: 'ok',
              onPress: () => { this.onRefresh(); },
            },
          ],
          { cancelable: false },
        );
      }
    });
    loc(this);
  }

  componentWillUnMount() {
    rol();
  }

  page_reloaded = () => {
    this.setState({ loading: true });
    this._retrieveData();
  };

  clearSearch = () => {
    this.setState({ flag: 1, searchText: '' });
    this._retrieveData();
  };

  _retrieveData = async () => {
    console.log("AAA==>")
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
        console.log("BBB==>")

        // if (this.state.dataSource == "") {
        console.log("CCC==>")
        this.getWarrensData();
        // }

      } else if (this.state.token == "") {
        this.getWarrensData();
      } else {
        Toast.show('No Data Found!', Toast.LONG);
      }
    } catch (error) {
      alert('HEllo', error);
    }
  };

  login = () => {
    this.setState({ dataSource: '', loginmodal: false });
    this.props.navigation.navigate('login');
  }

  register = () => {
    this.setState({ dataSource: '', loginmodal: false });
    this.props.navigation.navigate('registration');
  }

  onRefresh() {
    this.setState({ isRefreshing: true, loading: true, dataSource: '' });
    // this.state.dataSource == "";
    this.state.page = 1;
    this._retrieveData();
  }

  getWarrensData = () => {
    if (this.state.token == "") {
      this.setState({ isSearch: false, isRefreshing: false, loading: true });
      const { page } = this.state;
      console.log("Warren Post==>", Endpoint.endPoint.url +
        Endpoint.endPoint.warren +
        "?sort_by=" +
        this.state.sortBy +
        '&page=' +
        this.state.page +
        '&order_by=' +
        this.state.orderBy +
        '&q=' +
        this.state.searchText);
      fetch(
        Endpoint.endPoint.url +
        Endpoint.endPoint.warren +
        "?sort_by=" +
        this.state.sortBy +
        '&page=' +
        this.state.page +
        '&order_by=' +
        this.state.orderBy +
        '&q=' +
        this.state.searchText,
        {
          method: 'GET',
          // headers: headers,
        },
      )
        .then(response => response.json())
        .then(responseJson => {
          console.log('responseJson1token', responseJson);
          this.setState({ loading: false });
          if (responseJson.data) {
            this.setState({
              dataSource:
                page === 1
                  ? responseJson.data
                  : [...this.state.dataSource, ...responseJson.data],
              lastPage: responseJson.meta.last_page,
            });
            // this.getChildren();
          } else {
            alert('Something went wrong');
          }
        })
        .catch(error => {
          console.log(error);
          this.setState({ loading: false });
        });
    } else {
      this.setState({ isSearch: false, isRefreshing: false, loading: true });
      const { page } = this.state;
      var headers = new Headers();
      let auth = 'Bearer ' + this.state.token;
      headers.append('Authorization', auth);
      fetch(
        Endpoint.endPoint.url +
        Endpoint.endPoint.followingWarren +
        '?sort_by=' +
        this.state.sortBy +
        '&order_by=' +
        this.state.orderBy +
        '&page=' +
        this.state.page +
        '&q=' +
        this.state.searchText,
        {
          method: 'GET',
          headers: headers,
        },
      )
        .then(response => response.json())
        .then(responseJson => {
          console.log('responseJson1', responseJson);
          this.setState({ loading: false });
          if (responseJson.data) {
            this.setState({
              dataSource:
                page === 1
                  ? responseJson.data
                  : [...this.state.dataSource, ...responseJson.data],
              lastPage: responseJson.meta.last_page,
            });
            this.getChildren();
          } else {
            alert('Something went wrong');
          }
        })
        .catch(error => {
          console.log(error);
          this.setState({ loading: false });
        });
    }
  };

  getChildren = () => {
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.warren_tree + "?sort_by=name&order_by=ASC", {
      method: 'GET',
      headers: headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(
          'Hello',
          JSON.stringify(responseJson.data).replace(
            /\"nodes\":/g,
            '"children":',
          ),
        );
        this.setState({ loading: false });
        if (responseJson.data.length > 0) {
          this.setState({
            listSource: JSON.parse(
              JSON.stringify(responseJson.data).replace(
                /\"nodes\":/g,
                '"children":',
              ),
            ),
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
          setTimeout(() => {
            this.getWarrensData();
          }, 400);

        },
      );
    }
  };

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
        console.log("response ==>", responseJson);
        if (responseJson.status == true) {
          // this.setState({ dataSource: "" })

          this.state.page = 1;
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

  onPress = reportData => this.setState({ reportData });

  onSortPress = sortData => this.setState({ sortData });

  submitFilter = () => {
    this.setState({ isVisible: false });
    let sort_value = this.state.sortData.find(e => e.selected == true);
    sort_value = sort_value ? sort_value.value : this.state.sortData[0].label;
    this.state.sortBy = sort_value;
    this.setState({ sortBy: sort_value });
    console.log('this.state.sortBy', this.state.sortBy);
    if (sort_value == 'created_at' || sort_value == 'subscribers_count') {
      this.setState({ orderBy: 'DESC' });
    }
    this.setState({ dataSource: "" })
    this.state.page = 1;
    this._retrieveData();
  };

  onCancelPopup = () => {
    this.setState({ btnDialog: false });
  };


  warrenClicked = item => {
    this.setState({ btnDialog: false });
    this.props.navigation.navigate('warrenPost', { warrenId: item.id, warrenName: item.name });
  };

  getIndicator = (isExpanded, hasChildrenNodes) => {
    if (!hasChildrenNodes) {
      return (
        <FontAwesomeIcon
          icon={faAngleDown}
          color={'#e5e5f9'}
          size={height > width ? wp('4.5%') : wp('2%')}
        />
      );
    } else if (isExpanded) {
      return (
        <FontAwesomeIcon
          icon={faAngleUp}
          color={'white'}
          size={height > width ? wp('4.5%') : wp('2%')}
        />
      );
    } else {
      return (
        <FontAwesomeIcon
          icon={faAngleRight}
          color={'#11075e'}
          size={height > width ? wp('4.5%') : wp('2%')}
        />
      );
    }
  };

  add_warren = () => {
    if (this.state.warrenName == '') {
      Toast.show('The name field is required.', Toast.LONG);
    } else if (this.state.warrenDesc.length < 20) {
      Toast.show(
        'The description should be at least 20 character long.',
        Toast.LONG,
      );
    } else {
      this.setState({ loading: true });
      var headers = new Headers();
      let auth = 'Bearer ' + this.state.token;
      headers.append('Authorization', auth);
      var data = new FormData();
      data.append('name', this.state.warrenName);
      data.append('type', 'Public');
      data.append('description', this.state.warrenDesc);
      console.log(data);
      fetch(Endpoint.endPoint.url + Endpoint.endPoint.warren, {
        method: 'POST',
        headers: headers,
        body: data,
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          this.setState({ loading: false });
          if (responseJson.status == true) {
            this.setState({ loading: false, addWarren: false });
            Toast.show(
              'New Warren submitted, you will be notified upon moderator approval',
              Toast.LONG,
            );
          } else {
            alert(responseJson.status);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  opendrawer = () => {
    if (this.state.token == "") {
      this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
    }
    else {
      this._sideMenuDrawer.open()
    }
  }

  render() {
    var left = <Left style={{ flex: 1 }} />;
    var right = (
      <Right style={{ flex: 1 }}>
        <Button onPress={() => this.opendrawer()} transparent>
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

          {/* Login Alert */}

          <Dialog
            dialogStyle={{
              // borderRadius: 5,
              justifyContent: width > height ? 'center' : null,
              alignSelf: width > height ? 'center' : null,
              // alignItems: width > height ? 'center' : null,
              width: width > height ? wp('60%') : null,
              padding: width > height ? 15 : 0
            }}
            titleStyle={{
              color: '#212121',

              fontSize: height > width ? wp('5.6%') : wp('3.5%'),
            }}
            visible={this.state.loginmodal}
            title="Sign In"
            onTouchOutside={() => {
              this.onCancelPopup();
            }}
            onRequestClose={() => {
              this.setState({ btnDialog: false });
            }}>
            <View>
              <Text style={{ fontSize: width > height ? wp('2.7%') : wp('4.5%'), color: '#757575', lineHeight: width > height ? wp('4.2%') : wp('7%') }}>{this.state.logintext}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: width > height ? 20 : 15 }}>
                <TouchableOpacity onPress={() => { this.setState({ loginmodal: false }) }} style={{ justifyContent: 'center', marginRight: wp('4%') }}>
                  <Text style={{ color: '#11075e', fontSize: width > height ? wp('2.7%') : wp('4.5%') }}>Not Now</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { this.login() }} style={{ backgroundColor: '#11075e', borderRadius: 5, paddingHorizontal: 8 }}>
                  <Text style={{ color: 'white', padding: 10, fontSize: width > height ? wp('2.7%') : wp('4.5%') }}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { this.register() }} style={{ backgroundColor: '#11075e', borderRadius: 5, paddingHorizontal: 8, marginLeft: 10 }}>
                  <Text style={{ color: 'white', padding: 10, fontSize: width > height ? wp('2.7%') : wp('4.5%') }}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Dialog>

          <Dialog
            dialogStyle={{
              borderRadius: 9,
              backgroundColor: '#e5e5f9',
              height: '80%',
            }}
            titleStyle={{
              color: '#11075e',
              borderBottomWidth: 1,
              fontSize: height > width ? wp('4.6%') : wp('2%'),
              borderBottomColor: '#11075e',
              paddingBottom: 10,
              textAlign: 'center',
            }}
            visible={this.state.btnDialog}
            title="Warrens Tree"
            onTouchOutside={() => {
              this.onCancelPopup();
            }}
            onRequestClose={() => {
              this.setState({ btnDialog: false });
            }}>
            <ScrollView style={{ height: '80%' }}>
              <View
                style={{
                  flex: 1,
                }}>
                <TreeView
                  data={this.state.listSource}
                  renderNode={({ node, level, isExpanded, hasChildrenNodes }) => {
                    return (
                      <View>
                        {isExpanded == true ? (
                          <View
                            style={{
                              backgroundColor: '#11075e',
                              paddingVertical: 5,
                              paddingHorizontal: 10,
                              justifyContent: 'center',
                            }}>
                            <Text
                              style={{
                                marginLeft: 15 * level,
                                color: 'white',
                                fontSize:
                                  height > width ? wp('4.5%') : wp('2%'),
                              }}
                              ellipsizeMode="tail"
                              numberOfLines={1}>
                              {this.getIndicator(isExpanded, hasChildrenNodes)}
                              {'  '}
                              <Text
                                style={{ color: 'white' }}
                                onPress={() => {
                                  this.warrenClicked(node.id);
                                }}>
                                {node.label.includes('&amp;')
                                  ? node.label.replace('&amp;', '&')
                                  : node.label}
                              </Text>
                            </Text>
                          </View>
                        ) : (
                            <View
                              style={{
                                backgroundColor: '#e5e5f9',
                                paddingVertical: 5,
                                paddingHorizontal: 10,
                                justifyContent: 'center',
                              }}>
                              <Text
                                style={{
                                  marginLeft: 15 * level,
                                  fontSize:
                                    height > width ? wp('4.5%') : wp('2%'),
                                }}
                                ellipsizeMode="tail"
                                numberOfLines={1}>
                                {this.getIndicator(isExpanded, hasChildrenNodes)}
                                {'  '}
                                <Text
                                  style={{ color: '#11075e' }}
                                  onPress={() => {
                                    this.warrenClicked(node.id);
                                  }}>
                                  {node.label.includes('&amp;')
                                    ? node.label.replace('&amp;', '&')
                                    : node.label}
                                </Text>
                              </Text>
                            </View>
                          )}
                      </View>
                    );
                  }}
                />
              </View>
            </ScrollView>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-end',
                marginTop: 5,
              }}>
              <TouchableOpacity
                style={{
                  borderRadius: 5,
                  backgroundColor: '#e5e5f9',
                  padding: 5,
                }}
                onPress={() => {
                  this.onCancelPopup();
                }}>
                <Text
                  style={{
                    color: '#11075e',
                    fontSize: height > width ? wp('4.5%') : wp('2%'),
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </Dialog>
          <Dialog
            dialogStyle={{ borderRadius: 9 }}
            titleStyle={{ fontWeight: 'bold', color: '#11075e' }}
            visible={this.state.addWarren}
            title="Create Warren"
            onTouchOutside={() => this.setState({ addWarren: false })}
            onRequestClose={() => {
              this.setState({ addWarren: false });
            }}>
            <View>
              <TextInput
                style={styles.inputtype_dialog}
                placeholder="Name"
                placeholderTextColor="grey"
                numberOfLines={1}
                onChangeText={warrenName =>
                  this.setState({ warrenName: warrenName })
                }
                multiline={true}
              />
              <TextInput
                style={styles.inputtype_dialog}
                placeholder="Description(optional)"
                placeholderTextColor="grey"
                numberOfLines={3}
                multiline={true}
                onChangeText={warrenDesc =>
                  this.setState({ warrenDesc: warrenDesc })
                }
                multiline={true}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'flex-end',
                  marginTop: 10,
                }}>
                <TouchableOpacity
                  style={styles.cancelWarrenRequest}
                  onPress={() => {
                    this.setState({
                      addWarren: false,
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
                  style={[
                    styles.addWarrenRequest,
                    { borderRadius: 5, margin: 5 },
                  ]}
                  onPress={() => {
                    {
                      this.state.token == ""
                        ?
                        this.setState({ addWarren: false, loginmodal: true, logintext: 'Please login or register to use this feature.' })
                        :
                        this.add_warren();
                    }
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: height > width ? wp('4.5%') : wp('1.8%'),
                    }}>
                    Create Warren
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Dialog>
          <Modal
            isVisible={this.state.isVisible}
            swipeDirection="down"
            style={{ justifyContent: 'flex-end', margin: 0 }}>
            <View style={{ backgroundColor: '#fff' }}>
              <View>
                <Text
                  style={{
                    padding: 10,
                    borderColor: 'grey',
                    borderBottomWidth: 1,
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}>
                  Sort By
                </Text>
                <View
                  style={{
                    alignItems: 'flex-start',
                  }}>
                  <RadioGroup
                    radioButtons={this.state.sortData}
                    onPress={this.onSortPress}
                  />
                </View>
              </View>
              <View
                style={{
                  alignItems: 'flex-start',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'flex-end',
                    marginTop: 10,
                  }}>
                  <TouchableOpacity
                    style={styles.CancelReportPost}
                    onPress={() => this.setState({ isVisible: false })}>
                    <Text
                      style={{
                        color: '#11075e',
                        fontSize: height > width ? wp('3.8%') : wp('1.8%'),
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.reportPost}
                    onPress={() => {
                      this.submitFilter();
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: height > width ? wp('3.8%') : wp('1.8%'),
                      }}>
                      Apply
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            animationIn="slideInDown"
            // animationInTiming={500}
            animationOut="slideOutUp"
            // animationOutTiming={500}
            isVisible={this.state.isSearch}
            onBackdropPress={() => this.setState({ flag: 1, isSearch: false })}
            style={{ position: 'absolute', margin: 0 }}>
            <View style={styles.searchView}>
              <View style={{ width: '90%', backgroundColor: 'white' }}>
                <TextInput
                  style={styles.inputtype_css}
                  placeholder="Search"
                  placeholderTextColor="grey"
                  numberOfLines={1}
                  onChangeText={searchText =>
                    this.setState({ searchText: searchText })
                  }
                />
              </View>
              <TouchableOpacity
                style={{
                  width: '10%',
                  backgroundColor: '#5848cf',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this._retrieveData();
                }}>
                <View>
                  <FontAwesomeIcon
                    icon={faSearch}
                    color={'white'}
                    size={height > width ? wp('5.5%') : wp('3%')}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
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
              flexDirection: 'row',
              margin: 5,
            }}>
            {this.state.token == ""
              ? null :
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  backgroundColor: '#ffffff',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderBottomLeftRadius: 5,
                  borderTopLeftRadius: 5,
                  borderRightWidth: 1,
                  borderRightColor: 'lightgrey',
                }}
                onPress={() => {
                  this.setState({ btnDialog: true });
                }}>
                <View>
                  <FontAwesomeIcon
                    icon={faList}
                    color={'#11075e'}
                    size={height > width ? wp('5.5%') : wp('3%')}
                  />
                </View>
              </TouchableOpacity>
            }
            <TouchableOpacity
              style={{
                flex: this.state.token == "" ? 0.5 : 0.3,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this.setState({ isVisible: true });
              }}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    marginLeft: 5,
                    color: '#11075e',
                    textAlign: 'center',
                    fontSize: height > width ? wp('4%') : wp('1.8%'),
                  }}>
                  Filter
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 0.5,
                borderRightWidth: 1,
                borderRightColor: 'lightgrey',
              }}
              onPress={() => {
                this.setState({ addWarren: true });
              }}>
              <View style={styles.addWarrenRequest}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    fontSize: height > width ? wp('4%') : wp('1.8%'),
                  }}>
                  Add Warren
                </Text>
              </View>
            </TouchableOpacity>
            {/* {this.state.token==""?
            null: */}
            <TouchableOpacity
              style={{
                flex: 0.1,
                backgroundColor: '#ffffff',
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomRightRadius: 5,
                borderTopRightRadius: 5,
              }}
              onPress={() => {
                this.state.flag == 1
                  ? this.setState({ isSearch: true, flag: 0 })
                  : this.clearSearch();
              }}>
              {this.state.flag == 1 ? (
                <View>
                  <FontAwesomeIcon
                    icon={faSearch}
                    color={'#11075e'}
                    size={height > width ? wp('5.5%') : wp('3%')}
                  />
                </View>
              ) : (
                  <View>
                    <FontAwesomeIcon
                      icon={faTimes}
                      color={'#11075e'}
                      size={height > width ? wp('5.5%') : wp('3%')}
                    />
                  </View>
                )}
            </TouchableOpacity>
            {/* } */}
          </View>

          {this.state.dataSource != '' ? (
            <FlatList
              contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
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
              bounces={false}
              renderItem={({ item }) => (

                <View style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  alignContent: 'center',
                  marginBottom: 20
                }}>

                  <Card containerStyle={{
                    width: height > width ? width * 0.415 : width * 0.14,
                    height: height > width ? width * 0.415 : width * 0.14,
                    borderRadius: 15
                  }}>
                    <View
                      style={{
                        backgroundColor: '#5848cf',
                        borderRadius: 75,
                        width: 10,
                        height: 10,
                      }}
                    />
                    <View style={{ alignItems: 'center' }}>
                      <TouchableOpacity
                        onPress={() => {
                          // { this.state.token==""
                          // ?
                          //   this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
                          // :
                          this.warrenClicked(item);
                          // }
                        }}>
                        <Text
                          style={{
                            fontSize: height > width ? wp('4.5%') : wp('1.8%'),
                            color: '#11075e',
                            fontWeight: 'bold',
                          }}
                          numberOfLines={1}
                          ellipsizeMode="tail">
                          {item.name.includes('&amp;')
                            ? item.name.replace('&amp;', '&')
                            : item.name}
                        </Text>
                      </TouchableOpacity>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: height > width ? width * 0.02 : width * 0.005,
                        }}>
                        <View style={{ alignItems: 'center', marginRight: 5 }}>
                          <Image
                            source={require('../images/user-icon.png')}
                            style={{
                              height: 20,
                              width: 15,
                            }}
                            resizeMode="contain"
                          />
                        </View>
                        <View>
                          <Text
                            style={{
                              color: '#5848cf',
                              fontWeight: 'bold',
                              fontSize: height > width ? wp('4%') : wp('1.8%'),
                              textAlign: 'center',
                            }}>
                            {item.subscribers} sub(s)
                        </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.unfollowBtnCss}
                        onPress={() => {
                          {
                            this.state.token == ""
                              ?
                              this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
                              :
                              this.changeStatus(item.id);
                          }
                        }}>
                        <View style={{ alignSelf: 'center' }}>
                          <Image
                            source={this.state.token == "" ? require('../images/plus.png') : require('../images/minus-icon.png')}
                            style={{
                              height: 15,
                              width: 15,
                            }}
                          />
                        </View>
                        <Text
                          style={{
                            color: '#11075e',
                            padding: 5,
                            textAlign: 'center',
                            fontSize: height > width ? wp('4%') : wp('1.8%'),
                          }}>
                          {this.state.token == "" ? "Follow" : "Unfollow"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Card>

                </View>


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
const Device = require('react-native-device-detection');
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
    borderRadius: 10,
    shadowColor: '#11075e',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    elevation: 5,
    width: height > width ? width * 0.415 : width * 0.2,
    height: height > width ? width * 0.415 : width * 0.2,
    marginBottom: 10,
    backgroundColor: 'red'
    // flex: 0.5
  },
  searchView: {
    flexDirection: 'row',
    margin: 15,
    marginBottom: 5,
    paddingBottom: 0,
    shadowColor: '#11075e',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },
  followBtnCss: {
    backgroundColor: '#11075e',
    borderRadius: 5,
    borderColor: '#11075e',
    borderWidth: 1,
  },
  unfollowBtnCss: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: '#11075e',
    shadowColor: '#11075e',
    marginTop: height > width ? width * 0.02 : width * 0.005,
    borderWidth: 2,
    flexDirection: 'row',
    elevation: 5,
    paddingHorizontal: 5,
  },
  inputtype_css: {
    paddingLeft: height > width ? 10 : 20,
    textAlignVertical: 'center',
    color: 'black',
    flexWrap: 'wrap',
    fontSize: height > width ? wp('4.5%') : wp('1.8%'),
    alignItems: 'center',
  },
  inputtype_dialog: {
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 1,
    paddingLeft: 10,
    paddingVertical: 10,
    marginTop: 10,
    textAlignVertical: 'top',
    color: 'black',
    flexWrap: 'wrap',
    fontSize: Device.isPhone ? wp('4.5%') : Device.isTablet ? wp('2.5%') : null,
  },
  addWarrenRequest: {
    backgroundColor: '#11075e',
    padding: 10,
    paddingLeft: 25,
    paddingRight: 25,
  },
  cancelWarrenRequest: {
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
});
