import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  Image,
  Linking,
  Share,
  FlatList,
  RefreshControl,
  Alert,
  Animated
} from 'react-native';
import Modal from 'react-native-modal';
import CheckBox from '@react-native-community/checkbox';
import { Header, Body, Title, Left, Button, Right } from 'native-base';
import {
  faArrowLeft,
  faSearch,
  faPlus,
  faFileAlt,
  faBookmark as BookmarkSolid,
  faShare,
  faCommentAlt,
  faMinus,
  faTag,
  faChartBar,
  faTimes,
  faFilter,
  faList,
  faAngleDown,
  faAngleUp,
  faExternalLinkAlt,
  faAngleRight,
  faCalendarAlt,
  faEllipsisV,
} from '@fortawesome/free-solid-svg-icons';
import { faBookmark as BookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import TreeView from 'react-native-final-tree-view';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import SideMenuDrawer from '../component/SideMenuDrawer';
// import Navbar from '../component/NavBar';
import AsyncStorage from '@react-native-community/async-storage';
import { Card } from 'react-native-elements';
import { Bars } from 'react-native-loader';
import { Dialog } from 'react-native-simple-dialogs';
import RadioGroup from 'react-native-radio-buttons-group';
import { NavigationEvents } from 'react-navigation';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import RNImagePicker from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Endpoint from '../res/url_endpoint';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
// import YouTube from 'react-native-youtube';
import YoutubePlayer from "react-native-youtube-iframe";


const Device = require('react-native-device-detection');
library.add(BookmarkSolid, BookmarkRegular);
export default class WarrenPost extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      user_id: '',
      billing_type: '',
      dataSource: [],
      listSource: [],
      searchText: '',
      sortBy: 'overall_score',
      post_Date: 'day',
      post_Dates: false,
      postType: 'link,video',
      page: 1,
      lastPage: '',
      loading: false,
      warrenName: '',
      warrenNametkn: this.props.navigation.getParam('warrenName'),
      reportPost: false,
      isFollowing: false,
      addNewPost: false,
      addDialogLink: true,
      addDialogText: false,
      addDialogImage: false,
      showbtn: false,
      postLink: '',
      postTitle: '',
      reportPostId: '',
      image: '',
      img_uri: '',
      imageName: '',
      postText: '',
      isHottest: false,
      value3Index: 'This is spam',
      percentageReport: false,
      overall_score: '',
      grammer_score: '',
      readability_score: '',
      domain_score: '',
      vote_score: '',
      plagiarism_score: '',
      userName: '',
      id: '',
      slug: '',
      title: '',
      warrens: '',
      domain_id: '',
      isVisible: false,
      isSearch: false,
      btnDialog: false,
      flag: 1,
      link_checked: true,
      text_checked: false,
      image_checked: true,
      isRefreshing: false,
      searchValue: '',
      postValue: ['link','video'],
      pin: false,
      mainpost: [],
      pindataSource: [],
      enableScrollViewScroll: true,
      scrollY: new Animated.Value(0),
      loginmodal: false,
      logintext: "",

      isReady: false,
      status: null,
      quality: null,
      error: null,
      isPlaying: false,
      isLooping: true,
      duration: 0,
      currentTime: 0,
      fullscreen: false,
      // sortValue: '',
      reportData: [
        {
          label: 'This is spam',
          value: 'This is spam',
          color: '#11075e',
          size: height > width ? 16 : 25,
        },
        {
          label: 'This is abusive or harassing',
          value: 'This is abusive or harassing',
          color: '#11075e',
          size: height > width ? 16 : 25,
        },
        {
          label: 'Inappropriate Content',
          value: 'Inappropriate Content',
          color: '#11075e',
          size: height > width ? 16 : 25,
        },
        {
          label: 'Incorrect Category',
          value: 'Incorrect Category',
          color: '#11075e',
          size: height > width ? 16 : 25,
        },
        {
          label: 'Misleading Title',
          value: 'Misleading Title',
          color: '#11075e',
          size: height > width ? 16 : 25,
        },
      ],
      sortData: [
        {
          label: 'Most Recent',
          value: 'created_at',
          color: '#11075e',
          size: height > width ? 16 : 25,
        },
        {
          label: 'Hottest',
          value: 'vote_score',
          color: '#11075e',
          size: height > width ? 16 : 25,
        },
        {
          label: 'Most Commented',
          value: 'comments_count',
          color: '#11075e',
          size: height > width ? 16 : 25,
        },
        {
          label: 'Highest Ranked',
          value: 'overall_score',
          color: '#11075e',
          selected: true,
          size: height > width ? 16 : 25,
        },
      ],

      warren_id: this.props.navigation.getParam('warrenId'),
    };
    this._retrieveData();
    this.changeStatus = this.changeStatus.bind(this);
    this.onEndReachedCalledDuringMomentum = true;
    this.linkarr = [];
    this.pinlinkarr=[];

  }
  // _youTubeRef = React.createRef();

  componentDidMount() {

    loc(this);
    if (this.state.token == "") {
      this.setState({ billing_type: 'Free' })
    }
  }

  componentWillUnMount() {
    rol();
  }

  ShowHideComponent = item => {
    this.setState({
      showbtn: true,
      warrens: item.warrens[0].name,
      id: item.id,
      slug: item.slug,
      title: item.title,
      domain_id: item.domain_id,

    });
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
    this.setState({ isRefreshing: true, loading: true });
    this.getWarrenPostData();
    // this.setState({ isRefreshing: true, loading: true, dataSource: "", page: 1 }); // true isRefreshing flag for enable pull to refresh indicator
    // this.timeoutHandle = setTimeout(() => {
    //   this.getWarrenPostData();
    // }, 2000);
  }

  page_reloaded = () => {
    this.setState({ loading: true });
    this._retrieveData();
  };

  clearSearch = () => {
    console.log(this.state.searchText);
    this.setState({ flag: 1, searchText: '' });
    this._retrieveData();
  };

  priceupdate = async id => {
    this.setState({ warren_id: id });
    this._retrieveData();
  };

  pin = (id) => {

    // alert(id)
    this.setState({ loading: true });
    // alert(this.state.warren_id)
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    var data = new FormData();
    data.append('warren_id', this.state.warren_id);
    data.append('post_id', id);

    console.log("passdata", data);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.pin, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log("responceepin", responseJson)

        this.setState({ pin: true })
        if (responseJson.status == true) {
          Toast.show(responseJson.msg, Toast.LONG);
          this.setState({ loading: false });


          this.getPinPostData();
        }
        else {
          Toast.show(responseJson.msg, Toast.LONG);
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  unpin = (id) => {
    // alert(this.state.warren_id)
    this.setState({ loading: true });
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    var data = new FormData();
    data.append('warren_id', this.state.warren_id);
    data.append('post_id', id);

    console.log(data);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.unpin, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log("responceeunpin", responseJson)


        if (responseJson.status == true) {
          Toast.show(responseJson.msg, Toast.LONG);
          this.setState({ loading: false });

          this.getPinPostData();
        }
        else {
          Toast.show(responseJson.msg, Toast.LONG);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('visited_onces');
      if (value !== null) {
        const valueRecieve = JSON.parse(value);
        console.log(valueRecieve);
        this.setState({ loading: true });
        this.setState({
          user_id: valueRecieve.user_id,
          token: valueRecieve.token,
          userName: valueRecieve.userName,
          billing_type: valueRecieve.billing_type,
        });

        // this.setState({ dataSource: "" })
        this.getPinPostData();
        this.getWarrenPostData();
      } else if (this.state.token == "") {
        this.getWarrenPostData();
      } else {
        Toast.show('No Data Found!', Toast.LONG);
      }
    } catch (error) {
      alert(error);
    }
  };

  opencamera = () => {
    const options = {
      noData: true,
    };
    RNImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        alert('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        console.log(response);
        this.setState({
          img_uri: response.uri,
          image: response,
          imageName: response.fileName,
        });
      }
    });
  };

  blockDomainAlert = id => {
    if (this.state.token == "") {
      this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
    }
    else {
      Alert.alert(
        'Are you sure',
        'Are you sure you want to block the feeds from this domain?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'Remove', onPress: () => this.blockDomain(id) },
        ],
        { cancelable: false },
      );
    }
  };

  blockDomain = id => {
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    var data = new FormData();
    data.append('domain_id', id);
    console.log(data);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.exclude_domain, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status == true) {
          Toast.show(responseJson.msg + 'Successfully', Toast.LONG);
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

  bookmarkCreated = id => {
    if (this.state.token == "") {
      this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
    } else {
      var headers = new Headers();
      let auth = 'Bearer ' + this.state.token;
      headers.append('Authorization', auth);
      var data = new FormData();
      data.append('entity', 'Post');
      data.append('entity_id', id);
      console.log(data);
      fetch(Endpoint.endPoint.url + Endpoint.endPoint.bookmark, {
        method: 'POST',
        headers: headers,
        body: data,
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.status == true) {
            Toast.show(responseJson.msg + ' Successfully', Toast.LONG);
            this.getWarrenPostData();
          } else if (responseJson.status == false) {
            Toast.show(responseJson.msg, Toast.LONG);
          } else {
            alert('Something went wrong');
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  bookmarkDeleted = id => {
    if (this.state.token == "") {
      this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
    } else {
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
            this.getWarrenPostData();
          } else if (responseJson.status == false) {
            Toast.show(responseJson.msg, Toast.LONG);
          } else {
            alert('Something went wrong');
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  openPost = item => {
    // if (this.state.token == "") {
    //   this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
    // } else {
    // Linking.openURL(link);
    console.log("OpEN == >", item.slug);
    console.log("OpEN == >", item.id);
    this.props.navigation.navigate('singlePost', {
      Slug: item.slug,
      id: item.id
    });
    // }
  };

  getPinPostData = () => {

    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    var data = new FormData();
    data.append('warren_id', this.state.warren_id);

    console.log(data);

    fetch(Endpoint.endPoint.url + Endpoint.endPoint.pin_get, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {

        console.log("responceget", responseJson)

        if (responseJson.status == true) {
          this.setState({ pindataSource: responseJson.data })
        }

        console.log("PINDATA", this.state.pindataSource)
      })
      .catch(error => {
        console.log(error);
      });
  };

  pindata = () => {
    var items = [];
    this.pinlinkarr=[];
    this.state.pindataSource.map((item,index) => {

      var videolink = item.link.split("=").pop();
                    if (this.pinlinkarr.includes(videolink)) {
                    } else {
                      this.pinlinkarr.push(videolink)
                    }    
                    
                    console.log("this.pinlinkarr",this.pinlinkarr[index]);
      items.push(
        <Card containerStyle={styles.card_style}>
          <View >
            <TouchableOpacity
              onPress={() => {
                if (this.state.token == "") {
                  this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
                }
                else {
                  this.unpin(item.id);
                }
              }}
              style={{ position: 'absolute', right: 0, padding: 10, zIndex: 9999 }}>
              <View style={{ elevation: 2, backgroundColor: 'white', borderRadius: 5, width: width > height ? wp('6%') : wp('12%'), height: width > height ? wp('5.5%') : wp('12%'), justifyContent: 'center' }}>
                <Image source={require('../images/pin.png')} style={{ justifyContent: 'center', alignSelf: 'center', alignItems: 'center', marginTop: 5, width: width > height ? wp('4%') : wp('8%'), height: width > height ? wp('4%') : wp('8%') }} />
              </View>
            </TouchableOpacity>
            {item.post_type == 'video' ?
            <YoutubePlayer
            style={{
              maxHeight: height > width ? hp('21%') : hp('30%'),
            }}
            
                              height={hp('28%')}
                              play={false}
                              videoId={this.pinlinkarr[index]}
                            // onChangeState={onStateChange}
                            />:
            
            <TouchableOpacity
              style={{
                maxHeight: height > width ? hp('21%') : hp('30%'),
              }}
              onPress={() => {
                this.openPost(item);
              }}>
              <Image
                style={{
                  width: '100%',
                  height: '100%',
                  borderTopRightRadius: 5,
                  borderTopLeftRadius: 5,
                }}
                source={
                  item.image == null ?
                    require('../images/emptyImg.png')
                    :
                    { uri: item.image }
                }
                // source={{ uri: item.image }}
                resizeMode="cover"
              />
            </TouchableOpacity>}
          </View>
          <View
            style={{
              paddingHorizontal: 10,
              paddingTop: 10,
            }}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  this.openPost(item);
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
                  {item.title}
                </Text>
              </TouchableOpacity>
            </View>
            {this.state.postType == 'link' ? (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  marginTop: 5,
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
                    fontSize: height > width ? wp('3%') : wp('1.2%'),
                    fontWeight: 'bold',
                  }}
                  ellipsizeMode="tail"
                  numberOfLines={1}>
                  {item.link.split('/')[2]}
                </Text>
              </TouchableOpacity>
            ) : null}
            <View
              style={{
                alignItems: 'center',
                marginTop: 5,
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  color: 'grey',
                  fontSize: height > width ? wp('3%') : wp('1.2%'),
                }}
                ellipsizeMode="tail"
                numberOfLines={1}>
                Submitted by{' '}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (this.state.token == "") {
                    this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
                  }
                  else {
                    this.props.navigation.navigate('viewProfile', {
                      userName: item.user.name,
                      userId: item.user.id,
                    })
                  }
                }
                }>
                <Text
                  style={{
                    color: 'grey',
                    fontSize: height > width ? wp('3%') : wp('1.2%'),
                  }}
                  ellipsizeMode="tail"
                  numberOfLines={1}>
                  {item.user.name}
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  color: 'grey',
                  marginHorizontal: 10,
                }}>
                |
            </Text>
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
            {item.text == null ? null : (
              <View style={{ marginTop: 5 }}>
                <Text
                  style={{
                    color: '#000000',
                    fontSize:
                      height > width ? wp('3.2%') : wp('1.8%'),
                    lineHeight:
                      height > width ? wp('4%') : wp('2.5%'),
                  }}
                  ellipsizeMode="tail"
                  numberOfLines={2}>
                  {item.text}
                </Text>
              </View>
            )}

            {height < width ? (
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  marginBottom: 10,
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    alignSelf: 'center',
                    backgroundColor: '#FDFCFC',
                    width: wp('11%'),
                    paddingVertical: 5,
                    borderRadius: 5,
                    elevation: 2,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    {item.votestatus && item.votestatus.length > 0 &&
                      item.votestatus[0].value == -1 ? (
                      <TouchableOpacity
                        onPress={() => {
                          this.submitVote(0, item.id);
                        }}>
                        <FontAwesomeIcon
                          icon={faMinus}
                          color={'#f6110e'}
                          size={
                            height > width ? wp('5%') : wp('2.5%')
                          }
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          this.submitVote(0, item.id);
                        }}>
                        <FontAwesomeIcon
                          icon={faMinus}
                          color={'#afaaaa'}
                          size={
                            height > width ? wp('5%') : wp('2.5%')
                          }
                        />
                      </TouchableOpacity>
                    )}
                    <View style={{ marginHorizontal: 5 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text
                          style={{
                            marginLeft: 5,
                            fontSize:
                              height > width
                                ? wp('3.5%')
                                : wp('1.5%'),
                          }}>
                          {item.upvotes_count - item.downvotes_count}
                        </Text>
                        <Image
                          source={require('../images/oval.png')}
                          style={{ height: 10, width: 10 }}
                        />
                      </View>
                    </View>

                    {item.votestatus && item.votestatus.length > 0 &&
                      item.votestatus[0].value == 1 ? (
                      <TouchableOpacity
                        onPress={() => {
                          this.submitVote(1, item.id);
                        }}>
                        <FontAwesomeIcon
                          icon={faPlus}
                          color={'#04c60e'}
                          size={
                            height > width ? wp('5%') : wp('2.5%')
                          }
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          this.submitVote(1, item.id);
                        }}>
                        <FontAwesomeIcon
                          icon={faPlus}
                          color={'#afaaaa'}
                          size={
                            height > width ? wp('5%') : wp('2.5%')
                          }
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <View
                  style={{
                    alignSelf: 'center',
                    backgroundColor: '#FDFCFC',
                    width: wp('14.5%'),
                    paddingVertical: 5,
                    borderRadius: 5,
                    elevation: 2,
                  }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}
                    onPress={() => {
                      this.openPost(item);
                    }}>
                    <FontAwesomeIcon
                      icon={faCommentAlt}
                      color={'#afaaaa'}
                      size={height > width ? wp('5%') : wp('2.5%')}
                      style={{ marginRight: 5 }}
                    />
                    <Text
                      style={{
                        marginLeft: 5,
                        fontSize:
                          height > width ? wp('3.5%') : wp('1.5%'),
                      }}>
                      {item.actual_comments_count} comments
                  </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    alignSelf: 'center',
                    backgroundColor: '#FDFCFC',
                    width: wp('19%'),
                    paddingVertical: 5,
                    borderRadius: 5,
                    elevation: 2,
                  }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}
                    onPress={() => {
                      this.showReport(item);
                    }}>
                    <FontAwesomeIcon
                      icon={faChartBar}
                      color={'#afaaaa'}
                      size={height > width ? wp('5%') : wp('2.5%')}
                      style={{ marginRight: 5 }}
                    />
                    {height > width ? null : (
                      <Text
                        style={{
                          marginRight: 5,
                          fontSize:
                            height > width ? wp('3.5%') : wp('1.5%'),
                        }}>
                        Overall score
                      </Text>
                    )}
                    <Text
                      style={{
                        marginLeft: 5,
                        marginRight: 5,
                        fontSize:
                          height > width ? wp('3.5%') : wp('1.5%'),
                      }}>
                      {item.overall_score}%
                  </Text>
                  </TouchableOpacity>
                </View>

                <View style={{ alignItems: 'center' }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      backgroundColor: '#FDFCFC',
                      padding: 5,
                      borderRadius: 5,
                      elevation: 1,
                    }} >
                    {item.bookmarked ? (
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                        }} onPress={() => {
                          item.bookmarked
                            ? this.bookmarkDeleted(item.id)
                            : this.bookmarkCreated(item.id);
                        }}>
                        <FontAwesomeIcon
                          icon={BookmarkSolid}
                          color={'#afaaaa'}
                          size={height > width ? wp('5%') : wp('2.5%')}
                        />
                        <Text
                          style={{
                            marginLeft: 5,
                            fontSize:
                              height > width ? wp('3.5%') : wp('1.5%'),
                            marginRight: 10
                          }}>
                          Bookmarked
                            </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                        }}
                        onPress={() => {
                          item.bookmarked
                            ? this.bookmarkDeleted(item.id)
                            : this.bookmarkCreated(item.id);
                        }}>
                        <FontAwesomeIcon
                          icon={BookmarkRegular}
                          color={'#afaaaa'}
                          size={height > width ? wp('5%') : wp('2.5%')}
                        />
                        <Text
                          style={{
                            marginLeft: 5,
                            fontSize:
                              height > width ? wp('3.5%') : wp('1.5%'),
                            marginRight: 10
                          }}>
                          Bookmark
                            </Text>
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    alignSelf: 'center',
                    backgroundColor: '#FDFCFC',
                    paddingVertical: 5,
                    borderRadius: 5,
                    elevation: 2,
                  }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}
                    onPress={() => { }}>
                    <FontAwesomeIcon
                      icon={faTag}
                      color={'#afaaaa'}
                      size={height > width ? wp('5%') : wp('2.5%')}
                      style={{ marginLeft: 10 }}
                    />
                    <Text
                      numberOfLines={1}
                      style={{
                        marginLeft: 5,
                        fontSize:
                          height > width ? wp('3.5%') : wp('1.5%'),
                        marginRight: 10

                      }}>
                      {this.state.warrenName.length < 12
                        ? `${" " + this.state.warrenName}`
                        : `${" " + this.state.warrenName.substring(0, 10)}...`}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    alignSelf: 'center',
                    backgroundColor: '#FDFCFC',
                    width: wp('10%'),
                    paddingVertical: 5,
                    borderRadius: 5,
                    elevation: 2,
                  }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}
                    onPress={() => {
                      this.reportPost(item.id);
                    }}>
                    <FontAwesomeIcon
                      icon={faFileAlt}
                      color={'#afaaaa'}
                      size={height > width ? wp('5%') : wp('2.5%')}
                      style={{ marginRight: 5 }}
                    />
                    <Text
                      style={{
                        marginLeft: 2,
                        fontSize:
                          height > width ? wp('3.5%') : wp('1.5%'),
                      }}>
                      Report
                  </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    alignSelf: 'center',
                    backgroundColor: '#FDFCFC',
                    width: wp('10%'),
                    paddingVertical: 5,
                    borderRadius: 5,
                    elevation: 2,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.shareMessage(item.slug, item.title);
                    }}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <FontAwesomeIcon
                      icon={faShare}
                      color={'#afaaaa'}
                      size={height > width ? wp('5%') : wp('2.5%')}
                      style={{ marginRight: 5 }}
                    />
                    <Text
                      style={{
                        marginLeft: 3,
                        fontSize:
                          height > width ? wp('3.5%') : wp('1.5%'),
                      }}>
                      Share
                  </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  marginBottom: 5,
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: '#FDFCFC',
                      padding: 5,
                      borderRadius: 5,
                      elevation: 1,
                    }}>
                    {item.votestatus && item.votestatus.length > 0 &&
                      item.votestatus[0].value == -1 ? (
                      <TouchableOpacity
                        onPress={() => {
                          this.submitVote(0, item.id);
                        }}>
                        <FontAwesomeIcon
                          icon={faMinus}
                          color={'#f6110e'}
                          size={height > width ? wp('5%') : wp('2%')}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          this.submitVote(0, item.id);
                        }}>
                        <FontAwesomeIcon
                          icon={faMinus}
                          color={'#afaaaa'}
                          size={height > width ? wp('5%') : wp('2%')}
                        />
                      </TouchableOpacity>
                    )}
                    <View style={{ marginHorizontal: 5 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text
                          style={{
                            marginLeft: 5,
                            fontSize:
                              height > width
                                ? wp('3.5%')
                                : wp('1.5%'),
                          }}>
                          {item.upvotes_count - item.downvotes_count}
                        </Text>
                        <Image
                          source={require('../images/oval.png')}
                          style={{ height: 10, width: 10 }}
                        />
                      </View>
                    </View>

                    {item.votestatus && item.votestatus.length > 0 &&
                      item.votestatus[0].value == 1 ? (
                      <TouchableOpacity
                        onPress={() => {
                          this.submitVote(1, item.id);
                        }}>
                        <FontAwesomeIcon
                          icon={faPlus}
                          color={'#04c60e'}
                          size={height > width ? wp('5%') : wp('2%')}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          this.submitVote(1, item.id);
                        }}>
                        <FontAwesomeIcon
                          icon={faPlus}
                          color={'#afaaaa'}
                          size={height > width ? wp('5%') : wp('2%')}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      backgroundColor: '#FDFCFC',
                      padding: 5,
                      borderRadius: 5,
                      elevation: 1,
                    }}
                    onPress={() => {
                      this.openPost(item);
                    }}>
                    <FontAwesomeIcon
                      icon={faCommentAlt}
                      color={'#afaaaa'}
                      size={height > width ? wp('5%') : wp('2%')}
                      style={{ marginRight: 5 }}
                    />
                    <Text
                      style={{
                        marginLeft: 5,
                        fontSize:
                          height > width ? wp('3.5%') : wp('1.5%'),
                      }}>
                      {item.actual_comments_count}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{ alignItems: 'center' }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      backgroundColor: '#FDFCFC',
                      padding: 5,
                      borderRadius: 5,
                      elevation: 1,
                    }}
                    onPress={() => {
                      this.showReport(item);
                    }}>
                    <FontAwesomeIcon
                      icon={faChartBar}
                      color={'#afaaaa'}
                      size={height > width ? wp('5%') : wp('2%')}
                      style={{ marginRight: 5 }}
                    />
                    {/* <Text
                    style={{
                      marginRight: 5,
                      fontSize:
                        height > width ? wp('3.5%') : wp('1.5%'),
                    }}>
                    Score
                </Text> */}
                    <Text
                      style={{
                        marginLeft: 5,
                        marginRight: 5,
                        fontSize:
                          height > width ? wp('3.5%') : wp('1.5%'),
                      }}>
                      {item.overall_score}%
                  </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      backgroundColor: '#FDFCFC',
                      padding: 5,
                      borderRadius: 5,
                      elevation: 1,
                    }}
                    onPress={() => {
                      item.bookmarked
                        ? this.bookmarkDeleted(item.id)
                        : this.bookmarkCreated(item.id);
                    }}>
                    {item.bookmarked ? (
                      <FontAwesomeIcon
                        icon={BookmarkSolid}
                        color={'#afaaaa'}
                        size={height > width ? wp('5%') : wp('2.5%')}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={BookmarkRegular}
                        color={'#afaaaa'}
                        size={height > width ? wp('5%') : wp('2.5%')}
                      />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      backgroundColor: '#FDFCFC',
                      padding: 5,
                      borderRadius: 5,
                      elevation: 1,
                    }}
                    onPress={() => {
                      this.ShowHideComponent(item);
                    }}>
                    <FontAwesomeIcon
                      icon={faEllipsisV}
                      color={'#afaaaa'}
                      size={height > width ? wp('5%') : wp('2.5%')}
                    />
                  </TouchableOpacity>
                </View>

              </View>
            )}
          </View>
        </Card>

      );
    });
    return items;
  }

  getWarrenPostData = () => {
    if (this.state.token == "") {
      if (this.state.post_Dates == true) {
        if (this.state.post_Date == 'day') {
          console.log("Single Day Calling");
          this.setState({ loading: true, isRefreshing: false, })
          const { page } = this.state;
          fetch(
            Endpoint.endPoint.url + 'v2/' +
            Endpoint.endPoint.warren +
            '/' +
            this.state.warren_id +
            '/posts/public?page=' +
            this.state.page +
            '&post_type=' +
            this.state.postType +
            '&sort_by=' +
            this.state.sortBy +
            '&q=' +
            this.state.searchText +
            '&post_range=' +
            this.state.post_Date,
            {
              method: 'GET',
            },
          )
            .then(response => response.json())
            .then(responseJsonday => {
              if (responseJsonday.data.length > 0) {
                this.setState({
                  dataSource:
                    page === 1
                      ? responseJsonday.data
                      : [...this.state.dataSource, ...responseJsonday.data],
                  lastPage: responseJsonday.meta.last_page,
                  loading: false,
                });
                console.log("NEWconsole====>", this.state.dataSource)
                this.getChildren();
                this.followWarren();
              }
              else {
                this.setState({ loading: false })
              }
            })
            .catch(error => {
              console.log(error);
              this.setState({ loading: false })
            });

        } else if (this.state.post_Date == 'week') {
          console.log("Single Week Calling");
          this.setState({ loading: true, isRefreshing: false, post_Date: 'week' })
          const { page } = this.state;
          fetch(
            Endpoint.endPoint.url + 'v2/' +
            Endpoint.endPoint.warren +
            '/' +
            this.state.warren_id +
            '/posts/public?page=' +
            this.state.page +
            '&post_type=' +
            this.state.postType +
            '&sort_by=' +
            this.state.sortBy +
            '&q=' +
            this.state.searchText +
            '&post_range=' +
            this.state.post_Date,
            {
              method: 'GET',
            },
          )
            .then(response => response.json())
            .then(responseJsonweek => {
              if (responseJsonweek.data.length > 0) {
                this.setState({
                  dataSource:
                    page === 1
                      ? responseJsonweek.data
                      : [...this.state.dataSource, ...responseJsonweek.data],
                  lastPage: responseJsonweek.meta.last_page,
                  loading: false,
                });
                console.log("NEWconsole====>", this.state.dataSource)
                this.getChildren();
                this.followWarren();
              }
              else {
                this.setState({ loading: false })
              }
            })
            .catch(error => {
              console.log(error);
              this.setState({ loading: false })
            });
        }
        else if (this.state.post_Date == 'month') {
          console.log("Single Month Calling");
          this.setState({ loading: true, isRefreshing: false, post_Date: 'month' })
          const { page } = this.state;
          fetch(
            Endpoint.endPoint.url + 'v2/' +
            Endpoint.endPoint.warren +
            '/' +
            this.state.warren_id +
            '/posts/public?page=' +
            this.state.page +
            '&post_type=' +
            this.state.postType +
            '&sort_by=' +
            this.state.sortBy +
            '&q=' +
            this.state.searchText +
            '&post_range=' +
            this.state.post_Date,
            {
              method: 'GET',
            },
          )
            .then(response => response.json())
            .then(responseJsonmonth => {
              if (responseJsonmonth.data.length > 0) {
                this.setState({
                  dataSource:
                    page === 1
                      ? responseJsonmonth.data
                      : [...this.state.dataSource, ...responseJsonmonth.data],
                  lastPage: responseJsonmonth.meta.last_page,
                  loading: false,
                });
                console.log("NEWconsole====>", this.state.dataSource)
                this.getChildren();
                this.followWarren();
              }
              else {
                this.setState({ loading: false })
              }
            })
            .catch(error => {
              console.log(error);
              this.setState({ loading: false })
            });
        }
        else {
          console.log("Single All Calling", Endpoint.endPoint.url + 'v2/' +
            Endpoint.endPoint.warren +
            '/' +
            this.state.warren_id +
            '/posts/public?page=' +
            this.state.page +
            '&post_type=' +
            this.state.postType +
            '&sort_by=' +
            this.state.sortBy +
            '&q=' +
            this.state.searchText);
          this.setState({ loading: true, isRefreshing: false, post_Date: 'All' })
          const { page } = this.state;
          fetch(
            Endpoint.endPoint.url + 'v2/' +
            Endpoint.endPoint.warren +
            '/' +
            this.state.warren_id +
            '/posts/public?page=' +
            this.state.page +
            '&post_type=' +
            this.state.postType +
            '&sort_by=' +
            this.state.sortBy +
            '&q=' +
            this.state.searchText,
            {
              method: 'GET',
            },
          )
            .then(response => response.json())
            .then(responseJsonall => {
              if (responseJsonall.data.length > 0) {
                this.setState({
                  dataSource:
                    page === 1
                      ? responseJsonall.data
                      : [...this.state.dataSource, ...responseJsonall.data],
                  lastPage: responseJsonall.meta.last_page,
                  loading: false,
                });
                console.log("NEWconsole====>", this.state.dataSource)
                this.getChildren();
                this.followWarren();
              }
              else {
                this.setState({ loading: false })
              }
            })
            .catch(error => {
              console.log(error);
              this.setState({ loading: false })
            });
        }
      }
      else {
        this.setState({ isSearch: false, isRefreshing: false, loading: true });
        const { page } = this.state;
        console.log("Final Warren Post==>", Endpoint.endPoint.url + 'v2/' +
          Endpoint.endPoint.warren +
          '/' +
          this.state.warren_id +
          '/posts/public?page=' +
          this.state.page +
          '&post_type=' +
          this.state.postType +
          '&sort_by=' +
          this.state.sortBy +
          '&q=' +
          this.state.searchText +
          '&post_range=' +
          this.state.post_Date);
        fetch(
          Endpoint.endPoint.url + 'v2/' +
          Endpoint.endPoint.warren +
          '/' +
          this.state.warren_id +
          '/posts/public?page=' +
          this.state.page +
          '&post_type=' +
          this.state.postType +
          '&sort_by=' +
          this.state.sortBy +
          '&q=' +
          this.state.searchText +
          '&post_range=' +
          this.state.post_Date,
          {
            method: 'GET',
          },
        )
          .then(response => response.json())
          .then(responseJsonday => {
            console.log('New responseJsonday..======>', responseJsonday);
            if (responseJsonday.status == true) {
              if (responseJsonday.data.length > 0) {
                this.setState({
                  dataSource:
                    page === 1
                      ? responseJsonday.data
                      : [...this.state.dataSource, ...responseJsonday.data],
                  lastPage: responseJsonday.meta.last_page,
                  loading: false,
                });
                console.log("NEWconsole====>", this.state.dataSource)
                this.getChildren();
                this.followWarren();
              }
              else {
                this.setState({ loading: true, post_Date: 'week' })
                console.log("week==>");
                this.setState({ isRefreshing: false, });

                const { page } = this.state;
                fetch(
                  Endpoint.endPoint.url + 'v2/' +
                  Endpoint.endPoint.warren +
                  '/' +
                  this.state.warren_id +
                  '/posts/public?page=' +
                  this.state.page +
                  '&post_type=' +
                  this.state.postType +
                  '&sort_by=' +
                  this.state.sortBy +
                  '&q=' +
                  this.state.searchText +
                  '&post_range=' +
                  this.state.post_Date,
                  {
                    method: 'GET',
                  },
                )
                  .then(response => response.json())
                  .then(responseJsonweek => {
                    console.log('New responseJsonweek..======>', responseJsonweek);
                    if (responseJsonweek.status == true) {
                      if (responseJsonweek.data.length > 0) {
                        this.setState({
                          dataSource:
                            page === 1
                              ? responseJsonweek.data
                              : [...this.state.dataSource, ...responseJsonweek.data],
                          lastPage: responseJsonweek.meta.last_page,
                          loading: false,
                        });
                        console.log("NEWconsole====>", this.state.dataSource)
                        this.getChildren();
                        this.followWarren();
                      }
                      else {
                        this.setState({ loading: true, post_Date: 'month' })
                        console.log("Month==>");
                        this.setState({ isRefreshing: false, });

                        const { page } = this.state;
                        fetch(
                          Endpoint.endPoint.url + 'v2/' +
                          Endpoint.endPoint.warren +
                          '/' +
                          this.state.warren_id +
                          '/posts/public?page=' +
                          this.state.page +
                          '&post_type=' +
                          this.state.postType +
                          '&sort_by=' +
                          this.state.sortBy +
                          '&q=' +
                          this.state.searchText +
                          '&post_range=' +
                          this.state.post_Date,
                          {
                            method: 'GET',
                          },
                        )
                          .then(response => response.json())
                          .then(responseJsonmonth => {
                            console.log('New responseJsonmonth..======>', responseJsonmonth);
                            if (responseJsonmonth.status == true) {
                              if (responseJsonmonth.data.length > 0) {
                                this.setState({
                                  dataSource:
                                    page === 1
                                      ? responseJsonmonth.data
                                      : [...this.state.dataSource, ...responseJsonmonth.data],
                                  lastPage: responseJsonmonth.meta.last_page,
                                  loading: false,
                                });
                                console.log("NEWconsole====>", this.state.dataSource)
                                this.getChildren();
                                this.followWarren();
                              }
                              else {
                                this.setState({ loading: true, post_Date: 'All' })
                                console.log("All All==>");
                                this.setState({ isRefreshing: false, });
                                const { page } = this.state;
                                fetch(
                                  Endpoint.endPoint.url + 'v2/' +
                                  Endpoint.endPoint.warren +
                                  '/' +
                                  this.state.warren_id +
                                  '/posts/public?page=' +
                                  this.state.page +
                                  '&post_type=' +
                                  this.state.postType +
                                  '&sort_by=' +
                                  this.state.sortBy +
                                  '&q=' +
                                  this.state.searchText,
                                  {
                                    method: 'GET',
                                  },
                                )
                                  .then(response => response.json())
                                  .then(responseJsonall => {

                                    if (responseJsonall.data.length > 0) {
                                      this.setState({
                                        dataSource:
                                          page === 1
                                            ? responseJsonall.data
                                            : [...this.state.dataSource, ...responseJsonall.data],
                                        lastPage: responseJsonall.meta.last_page,
                                        loading: false,
                                      });
                                      console.log("NEWconsole====>", this.state.dataSource)
                                      this.getChildren();
                                      this.followWarren();
                                    }
                                    else {
                                      this.setState({ loading: false });
                                    }
                                  })
                                  .catch(error => {
                                    console.log(error);
                                    this.setState({ loading: false })
                                  });
                              }
                            }
                          })
                          .catch(error => {
                            console.log(error);
                            this.setState({ loading: false })
                          });
                      }
                    }
                  }
                  )
                  .catch(error => {
                    console.log(error);
                    this.setState({ loading: false })
                  });

              }
            } else {
              alert('Something went wrong');
            }
          })
          .catch(error => {
            console.log(error);
            this.setState({ loading: false })
          });
      }

    } else {

      if (this.state.post_Dates == true) {
        if (this.state.post_Date == 'day') {
          console.log("Single Day==>", Endpoint.endPoint.url + 'v2/' +
            Endpoint.endPoint.warren +
            '/' +
            this.state.warren_id +
            '/posts?page=' +
            this.state.page +
            '&post_type=' +
            this.state.postType +
            '&sort_by=' +
            this.state.sortBy +
            '&q=' +
            this.state.searchText +
            '&post_range=' +
            this.state.post_Date);
          this.setState({ isSearch: false, isRefreshing: false, loading: true, post_Date: 'day' });
          const { page } = this.state;
          var headers = new Headers();
          let auth = 'Bearer ' + this.state.token;
          headers.append('Authorization', auth)
          fetch(
            Endpoint.endPoint.url + 'v2/' +
            Endpoint.endPoint.warren +
            '/' +
            this.state.warren_id +
            '/posts?page=' +
            this.state.page +
            '&post_type=' +
            this.state.postType +
            '&sort_by=' +
            this.state.sortBy +
            '&q=' +
            this.state.searchText +
            '&post_range=' +
            this.state.post_Date,
            {
              method: 'GET',
              headers: headers,
            },
          )
            .then(response => response.json())
            .then(responseJsonday => {
              console.log("rrrr", responseJsonday);
              if (responseJsonday.data.length > 0) {
                this.setState({
                  dataSource:
                    page === 1
                      ? responseJsonday.data
                      : [...this.state.dataSource, ...responseJsonday.data],
                  lastPage: responseJsonday.meta.last_page,
                  loading: false,
                });
                console.log("NEWconsole====>", this.state.dataSource)
                this.getChildren();
                this.followWarren();
              }
              else {
                this.setState({ loading: false })
              }
            })
            .catch(error => {
              console.log(error);
              this.setState({ loading: false })
            });
        }
        else if (this.state.post_Date == 'week') {
          console.log("Single Week");
          this.setState({ isSearch: false, isRefreshing: false, loading: true, post_Date: 'week' });
          const { page } = this.state;
          var headers = new Headers();
          let auth = 'Bearer ' + this.state.token;
          headers.append('Authorization', auth)
          fetch(
            Endpoint.endPoint.url + 'v2/' +
            Endpoint.endPoint.warren +
            '/' +
            this.state.warren_id +
            '/posts?page=' +
            this.state.page +
            '&post_type=' +
            this.state.postType +
            '&sort_by=' +
            this.state.sortBy +
            '&q=' +
            this.state.searchText +
            '&post_range=' +
            this.state.post_Date,
            {
              method: 'GET',
              headers: headers,
            },
          )
            .then(response => response.json())
            .then(responseJsonweek => {
              console.log("rrrr", responseJsonweek);
              if (responseJsonweek.data.length > 0) {
                this.setState({
                  dataSource:
                    page === 1
                      ? responseJsonweek.data
                      : [...this.state.dataSource, ...responseJsonweek.data],
                  lastPage: responseJsonweek.meta.last_page,
                  loading: false,
                });
                console.log("NEWconsole====>", this.state.dataSource)
                this.getChildren();
                this.followWarren();
              }
              else {
                this.setState({ loading: false })
              }
            })
            .catch(error => {
              console.log(error);
              this.setState({ loading: false })
            });
        }
        else if (this.state.post_Date == 'month') {
          console.log("Single month");
          this.setState({ isSearch: false, isRefreshing: false, loading: true, post_Date: 'month' });
          const { page } = this.state;
          var headers = new Headers();
          let auth = 'Bearer ' + this.state.token;
          headers.append('Authorization', auth)
          fetch(
            Endpoint.endPoint.url + 'v2/' +
            Endpoint.endPoint.warren +
            '/' +
            this.state.warren_id +
            '/posts?page=' +
            this.state.page +
            '&post_type=' +
            this.state.postType +
            '&sort_by=' +
            this.state.sortBy +
            '&q=' +
            this.state.searchText +
            '&post_range=' +
            this.state.post_Date,
            {
              method: 'GET',
              headers: headers,
            },
          )
            .then(response => response.json())
            .then(responseJsonmonth => {
              console.log("rrrr", responseJsonmonth);
              if (responseJsonmonth.data.length > 0) {
                this.setState({
                  dataSource:
                    page === 1
                      ? responseJsonmonth.data
                      : [...this.state.dataSource, ...responseJsonmonth.data],
                  lastPage: responseJsonmonth.meta.last_page,
                  loading: false,
                });
                console.log("NEWconsole====>", this.state.dataSource)
                this.getChildren();
                this.followWarren();
              }
              else {
                this.setState({ loading: false })
              }
            })
            .catch(error => {
              console.log(error);
              this.setState({ loading: false })
            });
        }
        else {
          console.log("Single All Calling");
          this.setState({ isSearch: false, isRefreshing: false, loading: true, post_Date: 'All' });
          const { page } = this.state;
          var headers = new Headers();
          let auth = 'Bearer ' + this.state.token;
          headers.append('Authorization', auth)
          fetch(
            Endpoint.endPoint.url + 'v2/' +
            Endpoint.endPoint.warren +
            '/' +
            this.state.warren_id +
            '/posts?page=' +
            this.state.page +
            '&post_type=' +
            this.state.postType +
            '&sort_by=' +
            this.state.sortBy +
            '&q=' +
            this.state.searchText,
            {
              method: 'GET',
              headers: headers,
            },
          )
            .then(response => response.json())
            .then(responseJsonall => {
              console.log("rrrr", responseJsonall);
              if (responseJsonall.data.length > 0) {
                this.setState({
                  dataSource:
                    page === 1
                      ? responseJsonall.data
                      : [...this.state.dataSource, ...responseJsonall.data],
                  lastPage: responseJsonall.meta.last_page,
                  loading: false,
                });
                console.log("NEWconsole====>", this.state.dataSource)
                this.getChildren();
                this.followWarren();
              }
              else {
                this.setState({ loading: false })
              }
            })
            .catch(error => {
              console.log(error);
              this.setState({ loading: false })
            });
        }
      }

      else {
        console.log("All Day");
        this.setState({ isSearch: false, isRefreshing: false, loading: true });
        const { page } = this.state;
        var headers = new Headers();
        let auth = 'Bearer ' + this.state.token;
        headers.append('Authorization', auth);
        console.log("All Single Day==>", Endpoint.endPoint.url + 'v2/' +
          Endpoint.endPoint.warren +
          '/' +
          this.state.warren_id +
          '/posts?page=' +
          this.state.page +
          '&post_type=' +
          this.state.postType +
          '&sort_by=' +
          this.state.sortBy +
          '&q=' +
          this.state.searchText +
          '&post_range=' +
          this.state.post_Date);
        fetch(
          Endpoint.endPoint.url + 'v2/' +
          Endpoint.endPoint.warren +
          '/' +
          this.state.warren_id +
          '/posts?page=' +
          this.state.page +
          '&post_type=' +
          this.state.postType +
          '&sort_by=' +
          this.state.sortBy +
          '&q=' +
          this.state.searchText +
          '&post_range=' +
          this.state.post_Date,
          {
            method: 'GET',
            headers: headers,
          },
        )
          .then(response => response.json())
          .then(responseJsonday => {
            console.log("rrrr", responseJsonday);
            if (responseJsonday.status == true) {
              if (responseJsonday.data.length > 0) {
                this.setState({
                  dataSource:
                    page === 1
                      ? responseJsonday.data
                      : [...this.state.dataSource, ...responseJsonday.data],
                  lastPage: responseJsonday.meta.last_page,
                  loading: false,
                });
                console.log('data', this.state.dataSource);
                this.getChildren();
                this.followWarren();
              }
              else {
                console.log("All Week");
                this.setState({ isSearch: false, isRefreshing: false, loading: true, post_Date: 'week' });
                const { page } = this.state;
                var headers = new Headers();
                let auth = 'Bearer ' + this.state.token;
                headers.append('Authorization', auth);
                fetch(
                  Endpoint.endPoint.url + 'v2/' +
                  Endpoint.endPoint.warren +
                  '/' +
                  this.state.warren_id +
                  '/posts?page=' +
                  this.state.page +
                  '&post_type=' +
                  this.state.postType +
                  '&sort_by=' +
                  this.state.sortBy +
                  '&q=' +
                  this.state.searchText +
                  '&post_range=' +
                  this.state.post_Date,
                  {
                    method: 'GET',
                    headers: headers,
                  },
                )
                  .then(response => response.json())
                  .then(responseJsonweek => {
                    if (responseJsonweek.status == true) {
                      if (responseJsonweek.data.length > 0) {
                        this.setState({
                          dataSource:
                            page === 1
                              ? responseJsonweek.data
                              : [...this.state.dataSource, ...responseJsonweek.data],
                          lastPage: responseJsonweek.meta.last_page,
                          loading: false,
                        });
                        console.log('data', this.state.dataSource);
                        this.getChildren();
                        this.followWarren();
                      }
                      else {
                        console.log("All Month");
                        this.setState({ isSearch: false, isRefreshing: false, loading: true, post_Date: 'month' });
                        const { page } = this.state;
                        var headers = new Headers();
                        let auth = 'Bearer ' + this.state.token;
                        headers.append('Authorization', auth);
                        fetch(
                          Endpoint.endPoint.url + 'v2/' +
                          Endpoint.endPoint.warren +
                          '/' +
                          this.state.warren_id +
                          '/posts?page=' +
                          this.state.page +
                          '&post_type=' +
                          this.state.postType +
                          '&sort_by=' +
                          this.state.sortBy +
                          '&q=' +
                          this.state.searchText +
                          '&post_range=' +
                          this.state.post_Date,
                          {
                            method: 'GET',
                            headers: headers,
                          },
                        )
                          .then(response => response.json())
                          .then(responseJsonmonth => {
                            if (responseJsonmonth.status == true) {
                              if (responseJsonmonth.data.length > 0) {
                                this.setState({
                                  dataSource:
                                    page === 1
                                      ? responseJsonmonth.data
                                      : [...this.state.dataSource, ...responseJsonmonth.data],
                                  lastPage: responseJsonmonth.meta.last_page,
                                  loading: false,
                                });
                                console.log('data', this.state.dataSource);
                                this.getChildren();
                                this.followWarren();
                              }
                              else {
                                console.log("All All with Login");
                                this.setState({ isSearch: false, isRefreshing: false, loading: true, post_Date: 'All' });
                                const { page } = this.state;
                                var headers = new Headers();
                                let auth = 'Bearer ' + this.state.token;
                                headers.append('Authorization', auth);
                                fetch(
                                  Endpoint.endPoint.url + 'v2/' +
                                  Endpoint.endPoint.warren +
                                  '/' +
                                  this.state.warren_id +
                                  '/posts?page=' +
                                  this.state.page +
                                  '&post_type=' +
                                  this.state.postType +
                                  '&sort_by=' +
                                  this.state.sortBy +
                                  '&q=' +
                                  this.state.searchText,
                                  {
                                    method: 'GET',
                                    headers: headers,
                                  },
                                )
                                  .then(response => response.json())
                                  .then(responseJsonall => {
                                    if (responseJsonall.data.length > 0) {
                                      this.setState({
                                        dataSource:
                                          page === 1
                                            ? responseJsonall.data
                                            : [...this.state.dataSource, ...responseJsonall.data],
                                        lastPage: responseJsonall.meta.last_page,
                                        loading: false,
                                      });
                                      console.log('data', this.state.dataSource);
                                      this.getChildren();
                                      this.followWarren();
                                    }
                                    else {
                                      this.setState({ loading: false });
                                    }
                                  })
                                  .catch(error => {
                                    console.log(error);
                                    this.setState({ loading: false })
                                  });
                              }
                            }
                          })
                          .catch(error => {
                            console.log(error);
                            this.setState({ loading: false })
                          });
                      }
                    }

                  })
                  .catch(error => {
                    console.log(error);
                    this.setState({ loading: false })
                  });
              }
            } else {
              alert('Something went wrong');
            }
          })
          .catch(error => {
            console.log(error);
            this.setState({ loading: false })
          });
      }
    }
  };

  followWarren = () => {
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    fetch(
      Endpoint.endPoint.url +
      Endpoint.endPoint.warren +
      '/' +
      this.state.warren_id,
      {
        method: 'GET',
        headers: headers,
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log("RESS", responseJson);
        this.setState({ loading: false });
        this.setState({
          isFollowing: responseJson.data.following,
          warrenName: responseJson.data.name,
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({ loading: false })
      });
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
        // console.log(
        //   'Hello',
        //   JSON.stringify(responseJson.data).replace(
        //     /\"nodes\":/g,
        //     '"children":',
        //   ),
        // );
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
        this.setState({ loading: false })
      });
  };

  onLoadMoreData = () => {
    if (this.state.page <= this.state.lastPage) {
      this.setState(
        {
          page: this.state.page + 1,
        },
        () => {
          this.getWarrenPostData();
        },
      );
    }
  };



  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
  }

  changeStatus = warrenId => {
    console.log(warrenId);
    this.setState({ loading: true });
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
        console.log("UNFOLLOW", responseJson);
        this.setState({ loading: false });
        if (responseJson.status == true) {
          this.getWarrenPostData();
        } else if (responseJson.status == false) {
          Toast.show(responseJson.msg, Toast.LONG);
        } else {
          alert('Something went wrong');
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({ loading: false })
      });
  };

  onPress = reportData => this.setState({ reportData });

  onSortPress = () => {
    let sort_value = this.state.sortData.find(e => e.selected == true);
    sort_value = sort_value ? sort_value.value : this.state.sortData[0].label;
    console.log(sort_value);
    // this.state.sortValue = sort_value;
  };

  onUpdate = name => {
    const { postValue } = this.state;
    let index = postValue.indexOf(name); // check to see if the name is already stored in the array
    if (index === -1) {
      postValue.push(name); // if it isn't stored add it to the array
    } else {
      postValue.splice(index, 1); // if it is stored then remove it from the array
    }
  };

  onpostDatePress = postDate => {
    this.setState({ postDate });
  };

  // ListEmpty = () => {
  //   return (
  //     <View>
  //       <Text style={{textAlign: 'center', marginTop: 50}}>No Post Found!</Text>
  //     </View>
  //   );
  // };

  openLink = async item => {
    try {
      const isAvailable = await InAppBrowser.isAvailable();
      if (isAvailable) {
        InAppBrowser.open(item.link, {
          // // iOS Properties
          // dismissButtonStyle: 'cancel',
          // preferredBarTintColor: 'gray',
          // preferredControlTintColor: 'white',
          // Android Properties
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

  submitReport = () => {
    let report_value = this.state.reportData.find(e => e.selected == true);
    report_value = report_value
      ? report_value.value
      : this.state.reportData[0].label;
    console.log(report_value);

    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    var data = new FormData();
    data.append('post_id', this.state.reportPostId);
    data.append('reason', report_value);
    console.log(data);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.reportPost, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({ loading: false, reportPost: false });
        if (responseJson.status == true) {
          Toast.show(responseJson.msg, Toast.LONG);
        } else if (responseJson.status == false) {
          Toast.show(responseJson.msg, Toast.LONG);
        } else {
          alert('Something went wrong');
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({ loading: false })
      });
  };

  onCancelPopup = () => {
    this.setState({ btnDialog: false });
  };

  warrenClicked = id => {
    this.setState({ btnDialog: false, warren_id: id });
    this._retrieveData();
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

  submitFilter = () => {
    // if (
    //   // this.state.postValue == 'text' &&
    //   // this.state.sortBy == 'overall_score'
    // ) {
    //   alert('You can not use this combination.');
    // } else {
    this.setState({ isVisible: false });
    this.state.postType = this.state.postValue;

    let post_date = this.state.postDate.find(e => e.selected == true);
    post_date = post_date ? post_date.value : this.state.postDate[0].label;
    this.state.post_Date = post_date;
    console.log(this.state.post_Date);

    let sort_value = this.state.sortData.find(e => e.selected == true);
    sort_value = sort_value ? sort_value.value : this.state.sortData[0].label;
    console.log(sort_value);
    if (sort_value == 'vote_score') {
      this.setState({ isHottest: true });
    } else {
      this.setState({ isHottest: false });
    }
    this.state.sortBy = sort_value;
    this.setState({ sortBy: sort_value });
    console.log(this.state.sortBy);
    this.state.dataSource = "";
    this.state.page = 1;
    this.setState({ post_Dates: true })
    this._retrieveData();
    // }
  };

  reportPost = id => {

    this.setState({ reportPost: true, reportPostId: id, showbtn: false });
  };

  submitNewPost = warrenId => {
    this.setState({ loading: false });
    console.log(warrenId);
    console.log(this.state.postTitle);
    console.log(this.state.postLink);
    console.log(this.state.addDialogLink);
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    console.log(headers);
    var data = new FormData();
    if (this.state.addDialogLink == true) {
      data.append('type', 'link');
      data.append('link', this.state.postLink);
      data.append('title', this.state.postTitle);
      data.append('warren_id', warrenId);
      console.log(data);
      fetch(Endpoint.endPoint.url + Endpoint.endPoint.post, {
        method: 'POST',
        headers: headers,
        body: data,
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          this.setState({
            loading: false,
          });
          if (responseJson.status == true) {
            Toast.show(responseJson.msg, Toast.LONG);
            this.setState({
              loading: false,
              addNewPost: false,
              postTitle: '',
              postLink: '',
              postText: '',
              query: '',
              warren_id: '',
            });
          } else {
            Toast.show(responseJson.msg, Toast.LONG);
          }
        })
        .catch(error => {
          console.log(error);
          this.setState({ loading: false })
        });
    } else if (this.state.addDialogText == true) {
      data.append('type', 'text');
      data.append('title', this.state.postTitle);
      data.append('text', this.state.postText);
      console.log(data);
      if (this.state.image != '') {
        data.append('image', {
          name: this.state.image.fileName,
          type: this.state.image.type,
          uri:
            Platform.OS === 'android'
              ? this.state.image.uri
              : this.state.image.uri.replace('file://', ''),
        });
      }
      data.append('warren_id', warrenId);
      console.log(data);

      fetch(Endpoint.endPoint.url + Endpoint.endPoint.post, {
        method: 'POST',
        headers: headers,
        body: data,
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          this.setState({
            loading: false,
          });
          if (responseJson.status == true) {
            Toast.show(responseJson.msg, Toast.LONG);
            this.setState({
              loading: false,
              addNewPost: false,
              postTitle: '',
              postLink: '',
              postText: '',
              query: '',
              warren_id: '',
            });
          } else {
            Toast.show(responseJson.msg, Toast.LONG);
          }
        })
        .catch(error => {
          console.log(error);
          this.setState({ loading: false })
        });
    } else if (this.state.addDialogImage == true) {
      data.append('type', 'image');
      data.append('text', this.state.postText);
      data.append('image', {
        name: this.state.image.fileName,
        type: this.state.image.type,
        uri:
          Platform.OS === 'android'
            ? this.state.image.uri
            : this.state.image.uri.replace('file://', ''),
      });
      data.append('warren_id', this.state.addId.toString());
      console.log(data);

      fetch(Endpoint.endPoint.url + Endpoint.endPoint.post, {
        method: 'POST',
        headers: headers,
        body: data,
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          this.setState({
            loading: false,
          });
          if (responseJson.status == true) {
            Toast.show(responseJson.msg, Toast.LONG);
            this.setState({
              loading: false,
              addNewPost: false,
              postTitle: '',
              postLink: '',
              postText: '',
              query: '',
              warren_id: '',
            });
          } else {
            Toast.show(responseJson.msg, Toast.LONG);
          }
        })
        .catch(error => {
          console.log(error);
          this.setState({ loading: false })
        });
    }
  };

  shareMessage = (slug, title) => {
    if (this.state.token == "") {
      this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
    }
    else {
      this.setState({ showbtn: false });
      if (slug == '' || slug == null) {
        alert('link can not be shared for this post.');
      } else {
        Share.share({
          title: title,
          message: 'https://blogsbunny.com/post/' + slug,
        })
          .then(result => console.log(result))
          .catch(errorMsg => console.log(errorMsg));
      }
    }
  };

  getTitle = postLink => {
    if (postLink.includes('https')) {
      this.setState({ postLink: postLink });
      var headers = new Headers();
      let auth = 'Bearer ' + this.state.token;
      headers.append('Authorization', auth);
      var data = new FormData();
      data.append('link', postLink);
      fetch(Endpoint.endPoint.url + Endpoint.endPoint.fetchPostTitle, {
        method: 'POST',
        headers: headers,
        body: data,
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          this.setState({ loading: false });
          if (responseJson.status == true) {
            this.setState({ postTitle: responseJson.data.title });
          } else {
            Toast.show('Something went wrong', Toast.LONG);
          }
        })
        .catch(error => {
          console.log(error);
          this.setState({ loading: false })
        });
    } else {
      Toast.show('Please enter valid URL link.', Toast.LONG);
    }
  };

  submitVote = (likeStatus, postID) => {
    if (this.state.token == "") {
      this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
    }
    else {
      console.log(likeStatus);
      console.log(postID);

      this.setState({ loading: true });
      var headers = new Headers();
      let auth = 'Bearer ' + this.state.token;
      headers.append('Authorization', auth);
      // console.log(headers);
      var data = new FormData();
      data.append('post_id', postID);
      data.append('vote_type', likeStatus);
      console.log(data);
      fetch(Endpoint.endPoint.url + Endpoint.endPoint.votePost, {
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
            this.getWarrenPostData();
          } else {
            Toast.show('Something went wrong', Toast.LONG);
          }
        })
        .catch(error => {
          console.log(error);
          this.setState({ loading: false })
        });
    }
  };

  showReport = item => {
    console.log(item);
    this.setState({
      overall_score: item.overall_score,
      grammer_score: item.grammer_score,
      plagiarism_score: item.plagiarism_score,
      vote_score: item.heat_score,
      readability_score: item.readability_score,
      domain_score: item.domain_score,
      percentageReport: true,
    });
  };

  generateArc = (percentage, radius) => {
    if (percentage === 100) percentage = 99.999;
    const a = (percentage * 2 * Math.PI) / 100;
    const r = radius;
    var rx = r,
      ry = r,
      xAxisRotation = 0,
      largeArcFlag = 1,
      sweepFlag = 1,
      x = r + r * Math.sin(a),
      y = r - r * Math.cos(a);
    if (percentage <= 50) {
      largeArcFlag = 0;
    } else {
      largeArcFlag = 1;
    }

    return `A${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${x} ${y}`;
  };

  render() {

    this.state.postDate = [
      {
        label: 'Today',
        value: 'day',
        color: '#11075e',
        selected: this.state.post_Date == "day" ? true : false,
        size: height > width ? 16 : 25,
      },
      {
        label: 'This Week',
        value: 'week',
        color: '#11075e',
        selected: this.state.post_Date == "week" ? true : false,
        size: height > width ? 16 : 25,
      },
      {
        label: 'This Month',
        value: 'month',
        color: '#11075e',
        selected: this.state.post_Date == "month" ? true : false,
        size: height > width ? 16 : 25,
      },
      {
        label: 'All Time',
        value: 'All',
        color: '#11075e',
        selected: this.state.post_Date == "All" ? true : false,
        size: height > width ? 16 : 25,
      },
    ]

    const progressCustomStyles = {
      backgroundColor: this.state.overall_score > 50 ? '#27AE60' : '#ef4655',
      borderRadius: 0,
      borderColor: this.state.overall_score > 50 ? '#27AE60' : '#ef4655',
      borderWidth: 2,
      barEasing: 'sin',
    };
    let size = height > width ? hp('12%') : wp('8%');
    var left = (
      <Left style={{ flex: 0.3 }}>
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
      <Right style={{ flex: width > height ? 0.3 : 0.75 }}>

        {/* <View
          style={{
            flex: 0.5,
            borderRightWidth: 1,
            borderRightColor: 'lightgrey',
          }}> */}
        {this.state.isFollowing == true ? (
          <TouchableOpacity
            style={styles.followBtnCss}
            onPress={() => {
              if (this.state.token == "") {
                this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
              }
              else {
                this.changeStatus(this.state.warren_id);
              }
            }} transparent>
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: height > width ? wp('4%') : wp('1.8%'),
              }}>
              Following
                  </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.unfollowBtnCss}
            onPress={() => {
              if (this.state.token == "") {
                this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
              }
              else {
                this.changeStatus(this.state.warren_id);
              }
            }} transparent>
            <Text
              style={{
                textAlign: 'center',
                color: '#11075e',
                fontSize: height > width ? wp('4%') : wp('1.8%'),
              }}>
              Follow
                  </Text>
          </TouchableOpacity>
        )}
        {/* </View> */}
      </Right>
    );
    return (
      // <SideMenuDrawer
      // ref={ref => (this._sideMenuDrawer = ref)}
      // style={{ zIndex: 1 }}
      // navigation={this.props}>
      <View style={styles.container}>
        <NavigationEvents
          onDidFocus={() => {
            this.page_reloaded();
          }}
        />

        {/* <YouTube
          ref={this._youTubeRef}
          apiKey='AIzaSyAhc231NwV6HroLofIb5xvHJpmpBp0f4nk'
          videoId="naF5bXqPD4k" // The YouTube video ID
          play={this.state.isPlaying}
          loop={false}
          fullscreen={this.state.fullscreen}
          controls={1}
          style={[
            { height: 300, margin: 10 },
          ]}
          onError={e => {
            this.setState({ error: e.error });
          }}
          onReady={e => {
            this.setState({ isReady: true });
          }}
          onChangeState={e => {
            this.setState({ status: e.state });
          }}
          onChangeQuality={e => {
            this.setState({ quality: e.quality });
          }}
          onChangeFullscreen={e => {
            this.setState({ fullscreen: e.isFullscreen });
          }}
          onProgress={e => {
            this.setState({ currentTime: e.currentTime });
          }}
        /> */}
        {/* TreeView */}
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

        {/* Progress pop-up  */}
        <Dialog
          dialogStyle={{ borderRadius: 9 }}
          title="Post Scoring Breakdown"
          titleStyle={{
            fontWeight: 'bold',
            color: '#11075e',
            textAlign: 'center',
            fontSize: height > width ? wp('5.5%') : wp('3%')
          }}
          visible={this.state.percentageReport}
          onTouchOutside={() => this.setState({ percentageReport: false })}
          onRequestClose={() => {
            this.setState({ percentageReport: false });
          }}>
          <ScrollView>
            <View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 0.3333 }}>
                  <AnimatedCircularProgress
                    style={{
                      alignSelf: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    size={height > width ? wp('23.4%') : wp('20%')}
                    width={height > width ? wp('2.8%') : wp('1.8%')}
                    fill={parseInt(this.state.grammer_score)}
                    tintColor="#1E8449"
                    backgroundColor="#d6d6d6"
                    arcSweepAngle={240}
                    rotation={-120}
                    dashedBackground={{ width: height > width ? wp('2.9%') : wp('1.8%'), gap: 5 }}>
                    {fill => (
                      <View>
                        <Text
                          style={{
                            fontSize: height > width ? wp('2.9%') : wp('2%'),
                          }}>
                          Grammar
                          </Text>
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: height > width ? wp('2.9%') : wp('2%'),
                          }}>
                          {parseInt(this.state.grammer_score)}%
                          </Text>
                      </View>
                    )}
                  </AnimatedCircularProgress>
                </View>

                <View
                  style={{
                    flex: 0.333,
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <AnimatedCircularProgress
                    style={{
                      alignSelf: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    size={height > width ? wp('23.4%') : wp('20%')}
                    width={height > width ? wp('2.8%') : wp('1.8%')}
                    fill={parseInt(this.state.readability_score)}
                    tintColor="#1E8449"
                    arcSweepAngle={240}
                    rotation={-120}
                    backgroundColor="#d6d6d6"
                    dashedBackground={{ width: height > width ? wp('2.9%') : wp('1.8%'), gap: 5 }}>
                    {fill => (
                      <View>
                        <Text
                          style={{
                            fontSize: height > width ? wp('2.9%') : wp('2%'),
                          }}>
                          Readability
                          </Text>
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: height > width ? wp('2.9%') : wp('2%'),
                          }}>
                          {parseInt(this.state.readability_score)}%
                          </Text>
                      </View>
                    )}
                  </AnimatedCircularProgress>
                </View>

                <View style={{ flex: 0.333 }}>
                  <AnimatedCircularProgress
                    style={{
                      alignSelf: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    size={height > width ? wp('23.4%') : wp('20%')}
                    width={height > width ? wp('2.8%') : wp('1.8%')}
                    fill={parseInt(this.state.vote_score)}
                    tintColor="#1E8449"
                    arcSweepAngle={240}
                    rotation={-120}
                    backgroundColor="#d6d6d6"
                    dashedBackground={{ width: height > width ? wp('2.9%') : wp('1.8%'), gap: 5 }}>
                    {fill => (
                      <View>
                        <Text
                          style={{
                            fontSize: height > width ? wp('2.9%') : wp('2%'),
                          }}>
                          Heat
                          </Text>
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: height > width ? wp('2.9%') : wp('2%'),
                          }}>
                          {parseInt(this.state.vote_score)}%
                          </Text>
                      </View>
                    )}
                  </AnimatedCircularProgress>
                </View>
              </View>

              <View
                style={{ flexDirection: 'row', justifyContent: 'center', }}>
                <View style={{ flex: 0.45, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                  <AnimatedCircularProgress
                    style={{ marginTop: 20 }}
                    size={height > width ? wp('23.4%') : wp('20%')}
                    width={height > width ? wp('2.8%') : wp('1.8%')}
                    fill={parseInt(this.state.domain_score)}
                    tintColor="#1E8449"
                    arcSweepAngle={240}
                    rotation={-120}
                    backgroundColor="#d6d6d6"
                    dashedBackground={{ width: height > width ? wp('2.9%') : wp('1.8%'), gap: 5 }}>
                    {fill => (
                      <View>
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: height > width ? wp('2.9%') : wp('2%'),
                          }}>
                          Domain
                        </Text>
                        <Text
                          style={{
                            fontSize: height > width ? wp('3.0%') : wp('2%'),
                          }}>
                          Reputation
                        </Text>
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: height > width ? wp('2.9%') : wp('2%'),
                          }}>
                          {parseInt(this.state.domain_score)}%
                        </Text>
                      </View>
                    )}
                  </AnimatedCircularProgress>
                </View>

                <View style={{ flex: 0.10, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                </View>
                <View style={{ flex: 0.45, justifyContent: 'center' }}>
                  <View
                    style={{
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                    }}>
                    {this.state.billing_type == 'Free' ? (
                      <View
                        style={{
                          height: height > width ? size : size * 2,
                          width: height > width ? size : size * 2,
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: height > width ? wp('3%') : wp('1.8%'),
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginTop: 20,
                          }}>
                          Uniqueness
                          </Text>
                        <Text
                          style={{
                            fontSize: height > width ? wp('3.0%') : wp('2%'),
                            textAlign: 'center',
                            marginTop: 20,
                          }}
                          onPress={() => {
                            if (this.state.token == "") {
                              this.setState({ percentageReport: false, loginmodal: true, logintext: 'Please login or register to use this feature.' })
                            } else {
                              this.setState({ percentageReport: false });
                              this.props.navigation.navigate('pricing');
                            }
                          }}>
                          {this.state.token == "" ?
                            "coming soon"
                            : "Available for VIP users only"}
                        </Text>
                      </View>
                    ) : this.state.billing_type == 'VIP' ? (
                      <AnimatedCircularProgress
                        style={{ marginLeft: 7 }}
                        size={height > width ? wp('23.4%') : wp('20%')}
                        width={height > width ? wp('2.8%') : wp('1.8%')}
                        fill={parseInt(this.state.domain_score)}
                        tintColor="#1E8449"
                        arcSweepAngle={240}
                        rotation={-120}
                        backgroundColor="#d6d6d6"
                        dashedBackground={{ width: height > width ? wp('2.9%') : wp('1.8%'), gap: 5 }}>
                        {fill => (
                          <View>
                            <Text
                              style={{
                                textAlign: 'center',
                                fontSize:
                                  height > width ? wp('2.9%') : wp('2%'),
                              }}>
                              Uniqueness
                              </Text>
                            <Text
                              style={{
                                textAlign: 'center',
                                fontSize:
                                  height > width ? wp('2.9%') : wp('2%'),
                              }}>
                              {parseInt(this.state.domain_score)}%
                              </Text>
                          </View>
                        )}
                      </AnimatedCircularProgress>
                    ) : null}
                  </View>
                </View>
              </View>

              {/* <View
                      style={{
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        flex: height > width ? 0.32 : 0.3,
                      }}>
                      <Svg
                        height={height > width ? size : size * 2}
                        width={height > width ? size : size * 2}>
                        <Path
                          d={`M${height > width ? half : size} ${
                            height > width ? half : size
                            } L${
                            height > width ? half : size
                            } 0 ${this.generateArc(
                              parseInt(this.state.vote_score),
                              height > width ? half : size,
                            )} Z`}
                          fill={
                            parseInt(this.state.vote_score) > 50
                              ? '#5ee432'
                              : '#ef4655'
                          }
                        />
                        <Circle
                          cx={height > width ? half : size}
                          cy={height > width ? half : size}
                          r={height > width ? half - 8 : size - 15}
                          fill="none"
                          stroke="#E7E7E7"
                          strokeWidth={height > width ? '15' : '30'}
                          strokeDasharray={height > width ? '5,5' : '8,8'}
                          percentageReport
                        />
                        {
                          <Circle
                            cx={height > width ? half : size}
                            cy={height > width ? half : size}
                            r={height > width ? hp('4%') : wp('6%')}
                            fill="white"
                          />
                        }
                        <TextSvg
                          fill="black"
                          fontSize={`${height > width ? wp('3%') : wp('1.8%')}`}
                          fontWeight="bold"
                          x={height > width ? half : size}
                          y={height > width ? half + 5 : size + 10}
                          textAnchor="middle">
                          {this.state.vote_score + '%'}
                        </TextSvg>
                      </Svg>
                      <Text
                        style={{
                          fontSize: height > width ? wp('3%') : wp('1.8%'),
                          fontWeight: 'bold',
                        }}>
                        Heat
                      </Text>
                    </View> */}

              {/* </View> */}

              {/* <View style={{ flexDirection: 'row', marginTop: 10 }}> */}
              {/* <View
                      style={{
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        flex: 0.5,
                      }}>
                      <Svg
                        height={height > width ? size : size * 2}
                        width={height > width ? size : size * 2}>
                        <Path
                          d={`M${height > width ? half : size} ${
                            height > width ? half : size
                            } L${
                            height > width ? half : size
                            } 0 ${this.generateArc(
                              parseInt(this.state.domain_score),
                              height > width ? half : size,
                            )} Z`}
                          fill={
                            parseInt(this.state.domain_score) > 50
                              ? '#5ee432'
                              : '#ef4655'
                          }
                        />
                        <Circle
                          cx={height > width ? half : size}
                          cy={height > width ? half : size}
                          r={height > width ? half - 8 : size - 15}
                          fill="none"
                          stroke="#E7E7E7"
                          strokeWidth={height > width ? '15' : '30'}
                          strokeDasharray={height > width ? '5,5' : '8,8'}
                          percentageReport
                        />
                        {
                          <Circle
                            cx={height > width ? half : size}
                            cy={height > width ? half : size}
                            r={height > width ? hp('4%') : wp('6%')}
                            fill="white"
                          />
                        }
                        <TextSvg
                          fill="black"
                          fontSize={`${height > width ? wp('3%') : wp('1.8%')}`}
                          fontWeight="bold"
                          x={height > width ? half : size}
                          y={height > width ? half + 5 : size + 10}
                          textAnchor="middle">
                          {this.state.domain_score + '%'}
                        </TextSvg>
                      </Svg>
                      <Text
                        style={{
                          fontSize: height > width ? wp('3%') : wp('1.8%'),
                          fontWeight: 'bold',
                        }}>
                        Domain Reputation
                      </Text>
                    </View> */}

              {/* <View
                      style={{
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        flex: 0.5,
                      }}>
                      {this.state.billing_type == 'Free' ? (
                        <View
                          style={{
                            height: height > width ? size : size * 2,
                            width: height > width ? size : size * 2,
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              fontSize: height > width ? wp('3.2%') : wp('2%'),
                              textAlign: 'center',
                            }}
                            onPress={() => {
                              this.setState({ percentageReport: false });
                              this.props.navigation.navigate('pricing');
                            }}>
                            Available for VIP{'\n'} users only
                          </Text>
                        </View>
                      ) : this.state.billing_type == 'VIP' ? (
                        <Svg
                          height={height > width ? size : size * 2}
                          width={height > width ? size : size * 2}>
                          <Path
                            d={`M${height > width ? half : size} ${
                              height > width ? half : size
                              } L${
                              height > width ? half : size
                              } 0 ${this.generateArc(
                                parseInt(this.state.plagiarism_score),
                                height > width ? half : size,
                              )} Z`}
                            fill={
                              parseInt(this.state.plagiarism_score) > 50
                                ? '#5ee432'
                                : '#ef4655'
                            }
                          />
                          <Circle
                            cx={height > width ? half : size}
                            cy={height > width ? half : size}
                            r={height > width ? half - 8 : size - 15}
                            fill="none"
                            stroke="#E7E7E7"
                            strokeWidth={height > width ? '15' : '30'}
                            strokeDasharray={height > width ? '5,5' : '8,8'}
                            percentageReport
                          />
                          {
                            <Circle
                              cx={height > width ? half : size}
                              cy={height > width ? half : size}
                              r={height > width ? hp('4%') : wp('6%')}
                              fill="white"
                            />
                          }
                          <TextSvg
                            fill="black"
                            fontSize={`${
                              height > width ? wp('3%') : wp('1.8%')
                              }`}
                            fontWeight="bold"
                            x={height > width ? half : size}
                            y={height > width ? half + 5 : size + 10}
                            textAnchor="middle">
                            {this.state.plagiarism_score + '%'}
                          </TextSvg>
                        </Svg>
                      ) : null}
                      <Text
                        style={{
                          fontSize: height > width ? wp('3%') : wp('1.8%'),
                          fontWeight: 'bold',
                        }}>
                        Uniqueness
                      </Text>
                    </View>
                  </View> */}

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: height > width ? 15 : 0,
                }}>
                <ProgressBarAnimated
                  {...progressCustomStyles}
                  width={wp('70%')}
                  barAnimationDuration={
                    this.state.overall_score < 50 ? 1000 : 2000
                  }
                  height={height > width ? hp('2%') : wp('2.5%')}
                  value={parseInt(this.state.overall_score)}
                />
                <Text
                  style={{
                    position: 'absolute',
                    fontWeight: 'bold',
                    fontSize: height > width ? wp('3%') : wp('1.8%'),
                  }}>
                  {this.state.overall_score}%
                  </Text>
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: height > width ? wp('3.2%') : wp('2%'),
                  }}>
                  Total Score/Rating
                  </Text>
              </View>
            </View>
          </ScrollView>
        </Dialog>

        {/* Report pop-up  */}
        <Dialog
          dialogStyle={{
            borderRadius: 9,
            width: width > height ? '50%' : '100%',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}
          titleStyle={{ fontWeight: 'bold', color: '#11075e' }}
          visible={this.state.reportPost}
          onRequestClose={() => {
            this.setState({ reportPost: false });
          }}
          onTouchOutside={() => this.setState({ reportPost: false })}>
          <View>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'lightgrey',
                paddingBottom: 20,
              }}>
              <RadioGroup
                radioButtons={this.state.reportData}
                onPress={this.onPress}
                style={{ fontSize: height > width ? wp('3.8%') : wp('1.8%') }}
              />
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
                  this.setState({ reportPost: false });
                }}>
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
                  if (this.state.token == "") {
                    this.setState({ reportPost: false, loginmodal: true, logintext: 'Please login or register to use this feature.' })
                  } else {
                    this.submitReport();
                  }
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: height > width ? wp('3.8%') : wp('1.8%'),
                  }}>
                  Report
                  </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Dialog>

        {/* View more buttons */}
        <Dialog
          dialogStyle={{
            width: '80%',
            alignSelf: 'center',
          }}
          onRequestClose={() => {
            this.setState({ showbtn: false });
          }}
          onTouchOutside={() => {
            this.setState({ showbtn: false });
          }}
          visible={this.state.showbtn}>
          <View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  borderBottomColor: 'lightgrey',
                  borderBottomWidth: 1,
                  paddingBottom: 10,
                }}
                onPress={() => { }}>
                {/* <FontAwesomeIcon
                    icon={faTag}
                    color={'#afaaaa'}
                    size={height > width ? wp('5%') : wp('2.5%')}
                  /> */}
                <Text
                  style={{
                    fontSize: height > width ? wp('4.5%') : wp('2.5%'),
                  }}>
                  {this.state.warrenName} Category
                  </Text>
              </View>
            </View>
            <View style={{ marginVertical: 10 }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                }}
                onPress={() => {
                  this.reportPost(this.state.id);
                }}>
                <Text
                  style={{
                    fontSize: height > width ? wp('4.5%') : wp('2.5%'),
                  }}>
                  Report post
                  </Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginVertical: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  this.shareMessage(this.state.slug, this.state.title);
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                }}>
                <Text
                  style={{
                    fontSize: height > width ? wp('4.5%') : wp('2.5%'),
                  }}>
                  Share URL
                  </Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginVertical: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  this.blockDomainAlert(this.state.domain_id)
                  this.setState({ showbtn: false });
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                }}>
                <Text
                  style={{
                    fontSize: height > width ? wp('4.5%') : wp('2.5%'),
                  }}>
                  Block domain
                  </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Dialog>

        {/* Add new post pop-up  */}
        <Dialog
          dialogStyle={{ borderRadius: 9 }}
          titleStyle={{ fontWeight: 'bold', color: '#11075e' }}
          visible={this.state.addNewPost}
          onRequestClose={() => {
            this.setState({ addNewPost: false });
          }}
          onRequestClose={() => {
            this.setState({ addNewPost: false });
          }}>
          <View>
            <ScrollView keyboardShouldPersistTaps="handled">
              <View
                style={{
                  flexDirection: 'row',
                  paddingBottom: 10,
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                {this.state.addDialogLink == true ? (
                  <TouchableOpacity style={styles.selectedType}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: height > width ? wp('4.5%') : wp('1.8%'),
                        textAlign: 'center',
                      }}>
                      Link
                      </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.unSelectedType}
                    onPress={() => {
                      this.setState({
                        addDialogText: false,
                        addDialogImage: false,
                        addDialogLink: true,
                      });
                    }}>
                    <Text
                      style={{
                        color: '#11075e',
                        fontSize: height > width ? wp('4.5%') : wp('1.8%'),
                        textAlign: 'center',
                      }}>
                      Link
                      </Text>
                  </TouchableOpacity>
                )}
                {this.state.addDialogText == true ? (
                  <TouchableOpacity style={styles.selectedType}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: height > width ? wp('4.5%') : wp('1.8%'),
                        textAlign: 'center',
                      }}>
                      Text
                      </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.unSelectedType}
                    onPress={() => {
                      this.setState({
                        addDialogText: true,
                        addDialogLink: false,
                        addDialogImage: false,
                        postTitle: '',
                      });
                    }}>
                    <Text
                      style={{
                        color: '#11075e',
                        fontSize: height > width ? wp('4.5%') : wp('1.8%'),
                        textAlign: 'center',
                      }}>
                      Text
                      </Text>
                  </TouchableOpacity>
                )}
                {this.state.addDialogImage == true ? (
                  <TouchableOpacity style={styles.selectedType}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: height > width ? wp('4.5%') : wp('1.8%'),
                        textAlign: 'center',
                      }}>
                      Image
                      </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.unSelectedType}
                    onPress={() => {
                      this.setState({
                        addDialogImage: true,
                        addDialogLink: false,
                        addDialogText: false,
                        postText: '',
                      });
                    }}>
                    <Text
                      style={{
                        color: '#11075e',
                        fontSize: height > width ? wp('4.5%') : wp('1.8%'),
                        textAlign: 'center',
                      }}>
                      Image
                      </Text>
                  </TouchableOpacity>
                )}
              </View>
              {this.state.addDialogLink == true ? (
                <View>
                  <TextInput
                    style={styles.inputtype_dialog}
                    placeholder="Link"
                    placeholderTextColor="grey"
                    numberOfLines={1}
                    onChangeText={postLink => {
                      this.getTitle(postLink);
                    }}
                    multiline={true}
                  />
                  <TextInput
                    style={styles.inputtype_dialog}
                    placeholder="Title"
                    placeholderTextColor="grey"
                    numberOfLines={1}
                    onChangeText={postTitle =>
                      this.setState({ postTitle: postTitle })
                    }
                    defaultValue={this.state.postTitle}
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
                  <TextInput
                    style={styles.inputtype_dialog_fix}
                    placeholderTextColor="grey"
                    numberOfLines={1}
                    defaultValue={this.state.token == "" ? this.state.warrenNametkn : this.state.warrenName}
                    editable={false}
                  />
                </View>
              ) : this.state.addDialogText == true ? (
                <View>
                  <TextInput
                    style={styles.inputtype_dialog}
                    placeholder="Title"
                    placeholderTextColor="grey"
                    numberOfLines={1}
                    onChangeText={postTitle =>
                      this.setState({ postTitle: postTitle })
                    }
                    multiline={true}
                  />
                  <TextInput
                    style={styles.inputtype_dialog}
                    placeholder="Text"
                    placeholderTextColor="grey"
                    numberOfLines={5}
                    multiline={true}
                    onChangeText={postText =>
                      this.setState({ postText: postText })
                    }
                  />
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'lightgrey',
                      marginTop: 20,
                      borderRadius: 10,
                    }}
                    onPress={() => {
                      this.opencamera();
                    }}>
                    {this.state.imageName == '' ? (
                      <Text
                        style={{
                          color: 'grey',
                          fontSize: Device.isPhone
                            ? wp('4.5%')
                            : Device.isTablet
                              ? wp('2.5%')
                              : null,
                          textAlign: 'center',
                          paddingVertical: 15,
                          paddingHorizontal: 5,
                        }}>
                        Upload Image(Optional)
                      </Text>
                    ) : (
                      <Text
                        style={{
                          color: 'black',
                          fontSize: Device.isPhone
                            ? wp('4%')
                            : Device.isTablet
                              ? wp('2%')
                              : null,
                          textAlign: 'center',
                          fontWeight: '600',
                          paddingVertical: 15,
                          paddingHorizontal: 5,
                        }}>
                        {this.state.imageName}
                      </Text>
                    )}
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: '#11075e',
                      fontWeight: 'bold',
                      fontSize: height > width ? wp('3.8%') : wp('2%'),
                      marginVertical: 10,
                    }}>
                    Select Category:
                    </Text>
                  <TextInput
                    style={styles.inputtype_dialog_fix}
                    placeholderTextColor="grey"
                    numberOfLines={1}
                    defaultValue={this.state.warrenName}
                    editable={false}
                  />
                </View>
              ) : this.state.addDialogImage == true ? (
                <View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'lightgrey',
                      marginTop: 20,
                      borderRadius: 10,
                    }}
                    onPress={() => {
                      this.opencamera();
                    }}>
                    {this.state.imageName == '' ? (
                      <Text
                        style={{
                          color: 'grey',
                          fontSize: Device.isPhone
                            ? wp('4.5%')
                            : Device.isTablet
                              ? wp('2.5%')
                              : null,
                          textAlign: 'center',
                          paddingVertical: 15,
                          paddingHorizontal: 5,
                        }}>
                        Upload Image(Optional)
                      </Text>
                    ) : (
                      <Text
                        style={{
                          color: 'black',
                          fontSize: Device.isPhone
                            ? wp('4%')
                            : Device.isTablet
                              ? wp('2%')
                              : null,
                          textAlign: 'center',
                          fontWeight: '600',
                          paddingVertical: 15,
                          paddingHorizontal: 5,
                        }}>
                        {this.state.imageName}
                      </Text>
                    )}
                  </TouchableOpacity>
                  <TextInput
                    style={styles.inputtype_dialog}
                    placeholder="Text"
                    placeholderTextColor="grey"
                    numberOfLines={5}
                    multiline={true}
                    onChangeText={postText =>
                      this.setState({ postText: postText })
                    }
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
                  <TextInput
                    style={styles.inputtype_dialog_fix}
                    placeholderTextColor="grey"
                    numberOfLines={1}
                    defaultValue={this.state.warrenName}
                    editable={false}
                  />
                </View>
              ) : null}
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
                      addNewPost: false,
                      postTitle: '',
                      postText: '',
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
                    if (this.state.token == "") {
                      this.setState({ addNewPost: false, loginmodal: true, logintext: 'Please login or register to use this feature.' })
                    }
                    else {
                      this.submitNewPost(this.state.warren_id);
                    }
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: height > width ? wp('4.5%') : wp('1.8%'),
                    }}>
                    Submit
                    </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Dialog>
        <Modal
          isVisible={this.state.isVisible}
          swipeDirection="down"
          // onBackdropPress={() => this.setState({isVisible: false})}
          style={{ justifyContent: 'flex-end', margin: 0 }}>
          <View style={{ backgroundColor: '#fff' }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 0.45 }}>
                <Text
                  style={{
                    padding: 10,
                    borderColor: 'grey',
                    borderBottomWidth: 1,
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}>
                  Post Type
                  </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <CheckBox
                    title="test"
                    checked={this.state.link_checked}
                    value={this.state.link_checked}
                    tintColors={{ true: '#11075e' }}
                    onValueChange={() => {
                      this.setState({
                        link_checked: !this.state.link_checked,
                      });
                      this.onUpdate('link');
                    }}
                  />
                  <Text
                    style={{
                      fontSize: height > width ? 15 : 20,
                    }}>
                    Link
                    </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <CheckBox
                    title="test"
                    checked={this.state.text_checked}
                    value={this.state.text_checked}
                    tintColors={{ true: '#11075e' }}
                    onValueChange={() => {
                      this.setState({
                        text_checked: !this.state.text_checked,
                      });
                      this.onUpdate('text');
                    }}
                  />
                  <Text
                    style={{
                      fontSize: height > width ? 15 : 20,
                    }}>
                    Text
                    </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <CheckBox
                    title="test"
                    checked={this.state.image_checked}
                    value={this.state.image_checked}
                    tintColors={{ true: '#11075e' }}
                    onValueChange={() => {
                      this.setState({
                        image_checked: !this.state.image_checked,
                      });
                      this.onUpdate('video');
                    }}
                  />
                  <Text
                    style={{
                      fontSize: height > width ? 15 : 20,
                    }}>
                    Video
                    </Text>
                </View>
              </View>
              <View style={{ flex: 0.1 }} />
              <View style={{ flex: 0.45 }}>
                <Text
                  style={{
                    padding: 10,
                    borderColor: 'grey',
                    borderBottomWidth: 1,
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}>
                  Post Date
                  </Text>
                <View
                  style={{
                    alignItems: 'flex-start',
                  }}>
                  <RadioGroup
                    radioButtons={this.state.postDate}
                    onPress={this.onpostDatePress}
                  />
                </View>
              </View>
            </View>

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
                  onPress={() =>
                    this.setState({
                      isVisible: false,
                    })
                  }>
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
          animationOut="slideOutUp"
          isVisible={this.state.isSearch}
          onBackdropPress={() =>
            this.setState({ flag: 1, isSearch: false, searchText: '' })
          }
          style={{ position: 'absolute', margin: 0 }}>
          <View style={styles.searchView}>
            <View style={{ width: '90%', backgroundColor: 'white' }}>
              <TextInput
                style={styles.inputtype_css}
                placeholder="Search"
                placeholderTextColor="grey"
                numberOfLines={1}
                onChangeText={searchText =>
                  this.setState({ searchText: searchText, })
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
        <Header style={{ backgroundColor: '#11075e' }}>
          {left}
          <Body style={{ justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>
            <Title style={{ justifyContent: 'center', fontSize: height > width ? wp('5.5%') : wp('1.8%') }}>
              {this.state.token == ""
                ?
                this.state.warrenNametkn
                :
                this.state.warrenName.includes('&amp;')
                  ? this.state.warrenName.replace('&amp;', '&')
                  : this.state.warrenName
              }
            </Title>
          </Body>
          {right}
        </Header>
        {this.state.loading == true ? (
          <View style={styles.spinner}>
            <Bars size={25} color="#11075e" />
          </View>
        ) : null}
        <View
          style={{
            flexDirection: 'row',
            margin: 5,
            paddingRight: 5,
            paddingLeft: 2
          }}>
          <TouchableOpacity
            style={{
              flex: 0.2,
              borderRightWidth: 1,
              padding: 10,
              borderRightColor: 'white',
              borderBottomLeftRadius: 5,
              backgroundColor: '#11075e',
              borderTopLeftRadius: 5,
              // backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              this.setState({
                isVisible: true,
              });
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <FontAwesomeIcon
                icon={faFilter}
                color={'#fff'}
                size={height > width ? wp('5%') : wp('2.5%')}
              />

            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 0.6,
              backgroundColor: '#11075e',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              // borderBottomLeftRadius: 5,
              // borderTopLeftRadius: 5,
              borderRightWidth: 1,
              borderRightColor: 'lightgrey',
            }}
            onPress={() => {
              {
                this.state.token == ""
                  ?
                  this.props.navigation.navigate("warren")
                  :
                  this.setState({ btnDialog: true });
              }
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <FontAwesomeIcon
                icon={faList}
                color={'white'}
                size={height > width ? wp('5.5%') : wp('3%')}
                style={{ marginRight: 5 }}
              />
              <Text
                style={{
                  marginLeft: 5,
                  color: '#fff',
                  textAlign: 'center',
                  fontSize: height > width ? wp('4%') : wp('1.8%'),
                }}>
                Warrens
                </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 0.2,
              backgroundColor: '#11075e',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
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
                  color={'white'}
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
        </View>

        <ScrollView
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            {
              listener: event => {
                if (this.isCloseToBottom(event.nativeEvent)) {
                  this.onLoadMoreData()
                }
              }
            }
          )}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={() => {
                this.onRefresh();
              }}
            />
          }
        >
          {/* <View> */}
          {this.pindata()}
          {/* </View> */}
          {this.state.dataSource != '' ? (
            <View>
              <FlatList
                data={this.state.dataSource}
                showsHorizontalScrollIndicator={false}
                showsVerticleScrollIndicator={false}
                extraData={this.state}
                onEndReachedThreshold={0.01}
                onMomentumScrollBegin={() => {
                  this.onEndReachedCalledDuringMomentum = false;
                }}
                bounces={false}
                renderItem={({ item, index }) => {
                  if (item.post_type == 'video') {
                    var link = item.link.split("=").pop();
                    if (this.linkarr.includes(link)) {
                    } else {
                      this.linkarr.push(link)
                    }
                    console.log("Link==>", this.linkarr);
                  }

                  return (
                    item.post_type == 'video' ? (
                      <Card containerStyle={styles.card_style}>
                          <YoutubePlayer
                          style={{
                            maxHeight: height > width ? hp('21%') : hp('30%'),
                          }}
            
                              height={hp('28%')}
                              play={false}
                              videoId={this.linkarr[index]}
                            // onChangeState={onStateChange}
                            />

                           <TouchableOpacity 
                           onPress={() => {
                          if (this.state.token == "") {
                              this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
                            }
                            else {
                             this.pin(item.id);
                            }
                          }}
                          style={{ position: 'absolute', right: 0, padding: 10, zIndex: 9999 }}>
                            <View style={{ elevation: 2, backgroundColor: 'white', borderRadius: 5, width: width > height ? wp('6%') : wp('12%'), height: width > height ? wp('5.5%') : wp('12%'), justifyContent: 'center' }}>
                              <Image source={require('../images/unpin.png')} style={{ justifyContent: 'center', alignSelf: 'center', alignItems: 'center', marginTop: 5, width: width > height ? wp('4%') : wp('8%'), height: width > height ? wp('4%') : wp('8%') }} />
                            </View>
                          </TouchableOpacity>                         
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => {
                            this.openPost(item);
                          }}
                          style={{
                            flex: height > width ? 0.55 : 0.7,
                            paddingHorizontal: 10,
                            paddingTop: 10,
                          }}>
                          <View style={{}}>
                              <Text
                                style={{
                                  color: '#11075e',
                                  fontWeight: 'bold',
                                  fontSize:
                                    height > width ? wp('3.5%') : wp('1.8%'),
                                }}
                                ellipsizeMode="tail"
                                numberOfLines={2}>
                                {item.title}
                              </Text>
                          </View>
                          {this.state.postType == 'link' ? (
                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                marginTop: 5,
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
                                  fontSize: height > width ? wp('3%') : wp('1.2%'),
                                  fontWeight: 'bold',
                                }}
                                ellipsizeMode="tail"
                                numberOfLines={1}>
                                {item.link.split('/')[2]}
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                          <View
                            style={{
                              alignItems: 'center',
                              marginTop: 5,
                              flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                color: 'grey',
                                fontSize: height > width ? wp('3%') : wp('1.2%'),
                              }}
                              ellipsizeMode="tail"
                              numberOfLines={1}>
                              Submitted by{' '}
                            </Text>
                            <TouchableOpacity
                              onPress={() => {
                                if (this.state.token == "") {
                                  this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
                                }
                                else {
                                  this.props.navigation.navigate('viewProfile', {
                                    userName: item.user.name,
                                    userId: item.user.id,
                                  })
                                }
                              }
                              }>
                              <Text
                                style={{
                                  color: 'grey',
                                  fontSize: height > width ? wp('3%') : wp('1.2%'),
                                }}
                                ellipsizeMode="tail"
                                numberOfLines={1}>
                                {item.user.name}
                              </Text>
                            </TouchableOpacity>
                            <Text
                              style={{
                                color: 'grey',
                                marginHorizontal: 10,
                              }}>
                              |
                        </Text>
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
                          <View style={{ marginTop: 5 }}>
                            <Text
                              style={{
                                color: '#000000',
                                fontSize: height > width ? wp('3.2%') : wp('1.8%'),
                                lineHeight: height > width ? wp('4%') : wp('2.5%'),
                              }}
                              ellipsizeMode="tail"
                              numberOfLines={2}>
                              {item.text}
                            </Text>
                          </View>
                          {height < width ? (
                            <View
                              style={{
                                flexDirection: 'row',
                                marginTop: 10,
                                marginBottom: 5,
                                justifyContent: 'space-between',
                              }}>
                              <View
                                style={{
                                  alignSelf: 'center',
                                  backgroundColor: '#FDFCFC',
                                  width: wp('12%'),
                                  paddingVertical: 5,
                                  borderRadius: 5,
                                  elevation: 2,
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                  }}>
                                  {item.votestatus && item.votestatus.length > 0 &&
                                    item.votestatus[0].value == -1 ? (
                                    <TouchableOpacity
                                      onPress={() => {
                                        this.submitVote(0, item.id);
                                      }}>
                                      <FontAwesomeIcon
                                        icon={faMinus}
                                        color={'#f6110e'}
                                        size={
                                          height > width ? wp('5%') : wp('2.5%')
                                        }
                                      />
                                    </TouchableOpacity>
                                  ) : (
                                    <TouchableOpacity
                                      onPress={() => {
                                        this.submitVote(0, item.id);
                                      }}>
                                      <FontAwesomeIcon
                                        icon={faMinus}
                                        color={'#afaaaa'}
                                        size={
                                          height > width ? wp('5%') : wp('2.5%')
                                        }
                                      />
                                    </TouchableOpacity>
                                  )}
                                  <View style={{ marginHorizontal: 5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                      <Text
                                        style={{
                                          marginLeft: 5,
                                          fontSize:
                                            height > width
                                              ? wp('3.5%')
                                              : wp('1.5%'),
                                        }}>
                                        {item.upvotes_count - item.downvotes_count}
                                      </Text>
                                      <Image
                                        source={require('../images/oval.png')}
                                        style={{ height: 10, width: 10 }}
                                      />
                                    </View>
                                  </View>

                                  {item.votestatus && item.votestatus.length > 0 &&
                                    item.votestatus[0].value == 1 ? (
                                    <TouchableOpacity
                                      onPress={() => {
                                        this.submitVote(1, item.id);
                                      }}>
                                      <FontAwesomeIcon
                                        icon={faPlus}
                                        color={'#04c60e'}
                                        size={
                                          height > width ? wp('5%') : wp('2.5%')
                                        }
                                      />
                                    </TouchableOpacity>
                                  ) : (
                                    <TouchableOpacity
                                      onPress={() => {
                                        this.submitVote(1, item.id);
                                      }}>
                                      <FontAwesomeIcon
                                        icon={faPlus}
                                        color={'#afaaaa'}
                                        size={
                                          height > width ? wp('5%') : wp('2.5%')
                                        }
                                      />
                                    </TouchableOpacity>
                                  )}
                                </View>
                              </View>
                              <View
                                style={{
                                  alignSelf: 'center',
                                  backgroundColor: '#FDFCFC',
                                  width: wp('16%'),
                                  paddingVertical: 5,
                                  borderRadius: 5,
                                  elevation: 2,
                                }}>
                                <TouchableOpacity
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                  }}
                                  onPress={() => {
                                    this.openPost(item);
                                  }}>
                                  <FontAwesomeIcon
                                    icon={faCommentAlt}
                                    color={'#afaaaa'}
                                    size={height > width ? wp('5%') : wp('2.5%')}
                                    style={{ marginRight: 5 }}
                                  />
                                  <Text
                                    style={{
                                      marginLeft: 5,
                                      fontSize:
                                        height > width ? wp('3.5%') : wp('1.5%'),
                                    }}>
                                    {item.actual_comments_count} comments
                              </Text>
                                </TouchableOpacity>
                              </View>
                              <View
                                style={{
                                  alignSelf: 'center',
                                  backgroundColor: '#FDFCFC',
                                  width: wp('12%'),
                                  paddingVertical: 5,
                                  borderRadius: 5,
                                  elevation: 2,
                                }}>
                                <TouchableOpacity
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                  }}
                                  onPress={() => { }}>
                                  <FontAwesomeIcon
                                    icon={faTag}
                                    color={'#afaaaa'}
                                    size={height > width ? wp('5%') : wp('2.5%')}
                                    style={{ marginRight: 5 }}
                                  />
                                  <Text
                                    style={{
                                      marginLeft: 5,
                                      fontSize:
                                        height > width ? wp('3.5%') : wp('1.5%'),
                                    }}>
                                    {this.state.warrenName}
                                  </Text>
                                </TouchableOpacity>
                              </View>
                              <View
                                style={{
                                  alignSelf: 'center',
                                  backgroundColor: '#FDFCFC',
                                  width: wp('12%'),
                                  paddingVertical: 5,
                                  borderRadius: 5,
                                  elevation: 2,
                                }}>
                                <TouchableOpacity
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                  }}
                                  onPress={() => {
                                    this.reportPost(item.id);
                                  }}>
                                  <FontAwesomeIcon
                                    icon={faFileAlt}
                                    color={'#afaaaa'}
                                    size={height > width ? wp('5%') : wp('2.5%')}
                                    style={{ marginRight: 5 }}
                                  />
                                  <Text
                                    style={{
                                      marginLeft: 5,
                                      fontSize:
                                        height > width ? wp('3.5%') : wp('1.5%'),
                                    }}>
                                    Report
                              </Text>
                                </TouchableOpacity>
                              </View>
                              <View
                                style={{
                                  alignSelf: 'center',
                                  backgroundColor: '#FDFCFC',
                                  width: wp('12%'),
                                  paddingVertical: 5,
                                  borderRadius: 5,
                                  elevation: 2,
                                }}>
                                <TouchableOpacity
                                  onPress={() => {
                                    this.shareMessage(item.slug, item.title);
                                  }}
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                  }}>
                                  <FontAwesomeIcon
                                    icon={faShare}
                                    color={'#afaaaa'}
                                    size={height > width ? wp('5%') : wp('2.5%')}
                                    style={{ marginRight: 8 }}
                                  />
                                  <Text
                                    style={{
                                      marginLeft: 8,
                                      fontSize:
                                        height > width ? wp('3.5%') : wp('1.5%'),
                                    }}>
                                    Share
                              </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          ) : (
                            <View
                              style={{
                                flexDirection: 'row',
                                marginTop: 10,
                                marginBottom: 5,
                                justifyContent: 'space-between',
                              }}>
                              <View
                                style={{
                                  alignItems: 'center',
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    backgroundColor: '#FDFCFC',
                                    padding: 5,
                                    borderRadius: 5,
                                    elevation: 1,
                                  }}>
                                  {item.votestatus && item.votestatus.length > 0 &&
                                    item.votestatus[0].value == -1 ? (
                                    <TouchableOpacity
                                      onPress={() => {
                                        this.submitVote(0, item.id);
                                      }}>
                                      <FontAwesomeIcon
                                        icon={faMinus}
                                        color={'#f6110e'}
                                        size={height > width ? wp('5%') : wp('2%')}
                                      />
                                    </TouchableOpacity>
                                  ) : (
                                    <TouchableOpacity
                                      onPress={() => {
                                        this.submitVote(0, item.id);
                                      }}>
                                      <FontAwesomeIcon
                                        icon={faMinus}
                                        color={'#afaaaa'}
                                        size={height > width ? wp('5%') : wp('2%')}
                                      />
                                    </TouchableOpacity>
                                  )}
                                  <View style={{ marginHorizontal: 10 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                      <Text
                                        style={{
                                          fontSize:
                                            height > width
                                              ? wp('3.5%')
                                              : wp('1.5%'),
                                        }}>
                                        {item.upvotes_count - item.downvotes_count}
                                      </Text>
                                      <Image
                                        source={require('../images/oval.png')}
                                        style={{ height: 10, width: 10 }}
                                      />
                                    </View>
                                  </View>

                                  {item.votestatus && item.votestatus.length > 0 &&
                                    item.votestatus[0].value == 1 ? (
                                    <TouchableOpacity
                                      onPress={() => {
                                        this.submitVote(1, item.id);
                                      }}>
                                      <FontAwesomeIcon
                                        icon={faPlus}
                                        color={'#04c60e'}
                                        size={height > width ? wp('5%') : wp('2%')}
                                      />
                                    </TouchableOpacity>
                                  ) : (
                                    <TouchableOpacity
                                      onPress={() => {
                                        this.submitVote(1, item.id);
                                      }}>
                                      <FontAwesomeIcon
                                        icon={faPlus}
                                        color={'#afaaaa'}
                                        size={height > width ? wp('5%') : wp('2%')}
                                      />
                                    </TouchableOpacity>
                                  )}
                                </View>
                              </View>

                              <View style={{ alignItems: 'center' }}>
                                <TouchableOpacity
                                  style={{
                                    flexDirection: 'row',
                                    backgroundColor: '#FDFCFC',
                                    padding: 5,
                                    borderRadius: 5,
                                    elevation: 1,
                                  }}
                                  onPress={() => {
                                    this.openPost(item);
                                  }}>
                                  <FontAwesomeIcon
                                    icon={faCommentAlt}
                                    color={'#afaaaa'}
                                    size={height > width ? wp('5%') : wp('2%')}
                                    style={{ marginRight: 5 }}
                                  />
                                  <Text
                                    style={{
                                      marginLeft: 5,
                                      fontSize:
                                        height > width ? wp('3.5%') : wp('1.5%'),
                                    }}>
                                    {item.actual_comments_count}
                                  </Text>
                                </TouchableOpacity>
                              </View>

                              <View style={{ alignItems: 'center' }}>
                                <TouchableOpacity
                                  style={{
                                    flexDirection: 'row',
                                    backgroundColor: '#FDFCFC',
                                    padding: 5,
                                    borderRadius: 5,
                                    elevation: 1,
                                  }}
                                  onPress={() => {
                                    this.showReport(item);
                                  }}>
                                  <FontAwesomeIcon
                                    icon={faChartBar}
                                    color={'#afaaaa'}
                                    size={height > width ? wp('5%') : wp('2%')}
                                    style={{ marginRight: 5 }}
                                  />
                                  {/* <Text
                                style={{
                                  marginRight: 5,
                                  fontSize:
                                    height > width ? wp('3.5%') : wp('1.5%'),
                                }}>
                                Score
                            </Text> */}
                                  <Text
                                    style={{
                                      marginLeft: 5,
                                      marginRight: 5,
                                      fontSize:
                                        height > width ? wp('3.5%') : wp('1.5%'),
                                    }}>
                                    {item.overall_score}%
                              </Text>
                                </TouchableOpacity>
                              </View>
                              <View style={{ alignItems: 'center' }}>
                                <TouchableOpacity
                                  style={{
                                    flexDirection: 'row',
                                    backgroundColor: '#FDFCFC',
                                    padding: 5,
                                    borderRadius: 5,
                                    elevation: 1,
                                  }}
                                  onPress={() => {
                                    item.bookmarked
                                      ? this.bookmarkDeleted(item.id)
                                      : this.bookmarkCreated(item.id);
                                  }}>
                                  {item.bookmarked ? (
                                    <FontAwesomeIcon
                                      icon={BookmarkSolid}
                                      color={'#afaaaa'}
                                      size={height > width ? wp('5%') : wp('2.5%')}
                                    />
                                  ) : (
                                    <FontAwesomeIcon
                                      icon={BookmarkRegular}
                                      color={'#afaaaa'}
                                      size={height > width ? wp('5%') : wp('2.5%')}
                                    />
                                  )}
                                </TouchableOpacity>
                              </View>
                              <View style={{ alignItems: 'center' }}>
                                <TouchableOpacity
                                  style={{
                                    flexDirection: 'row',
                                    backgroundColor: '#FDFCFC',
                                    padding: 5,
                                    borderRadius: 5,
                                    elevation: 1,
                                  }}
                                  onPress={() => {
                                    this.ShowHideComponent(item);
                                  }}>
                                  <FontAwesomeIcon
                                    icon={faEllipsisV}
                                    color={'#afaaaa'}
                                    size={height > width ? wp('5%') : wp('2.5%')}
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                          )}
                        </TouchableOpacity>
                      </Card>
                      // <YoutubePlayer
                      //   height={300}
                      //   play={true}
                      //   videoId={this.linkarr[index]}
                      // // onChangeState={onStateChange}
                      // />
                    ) :
                      item.post_type == 'link' ? (
                        <Card containerStyle={styles.card_style}>
                          <View style={{ flex: 1 }}>

                            <TouchableOpacity
                              onPress={() => {
                                if (this.state.token == "") {
                                  this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
                                }
                                else {
                                  this.pin(item.id);
                                }
                              }}
                              style={{ position: 'absolute', right: 0, padding: 10, zIndex: 9999 }}>
                              <View style={{ elevation: 2, backgroundColor: 'white', borderRadius: 5, width: width > height ? wp('6%') : wp('12%'), height: width > height ? wp('5.5%') : wp('12%'), justifyContent: 'center' }}>
                                <Image source={require('../images/unpin.png')} style={{ justifyContent: 'center', alignSelf: 'center', alignItems: 'center', marginTop: 5, width: width > height ? wp('4%') : wp('8%'), height: width > height ? wp('4%') : wp('8%') }} />
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                maxHeight: height > width ? hp('21%') : hp('30%'),
                              }}
                              onPress={() => {
                                this.openPost(item);
                              }}>
                              <Image
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  borderTopRightRadius: 5,
                                  borderTopLeftRadius: 5,
                                }}
                                source={
                                  item.image == null ?
                                    require('../images/emptyImg.png')
                                    :
                                    { uri: item.image }
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
                                  {item.title}
                                </Text>
                              </TouchableOpacity>
                            </View>

                            {this.state.postType == 'link' ? (
                              <TouchableOpacity
                                style={{
                                  flexDirection: 'row',
                                  marginTop: 5,
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
                                    fontSize: height > width ? wp('3%') : wp('1.2%'),
                                    fontWeight: 'bold',
                                  }}
                                  ellipsizeMode="tail"
                                  numberOfLines={1}>
                                  {item.link.split('/')[2]}
                                </Text>
                              </TouchableOpacity>
                            ) : null}


                            <View
                              style={{
                                alignItems: 'center',
                                marginTop: 5,
                                flexDirection: 'row',
                              }}>
                              <Text
                                style={{
                                  color: 'grey',
                                  fontSize: height > width ? wp('3%') : wp('1.2%'),
                                }}
                                ellipsizeMode="tail"
                                numberOfLines={1}>
                                Submitted by{' '}
                              </Text>
                              <TouchableOpacity
                                onPress={() => {
                                  if (this.state.token == "") {
                                    this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
                                  }
                                  else {
                                    this.props.navigation.navigate('viewProfile', {
                                      userName: item.user.name,
                                      userId: item.user.id,
                                    })
                                  }
                                }
                                }>
                                <Text
                                  style={{
                                    color: 'grey',
                                    fontSize: height > width ? wp('3%') : wp('1.2%'),
                                  }}
                                  ellipsizeMode="tail"
                                  numberOfLines={1}>
                                  {item.user.name}
                                </Text>
                              </TouchableOpacity>
                              <Text
                                style={{
                                  color: 'grey',
                                  marginHorizontal: 10,
                                }}>
                                |
                        </Text>
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
                            {item.text == null ? null : (
                              <View style={{ marginTop: 5 }}>
                                <Text
                                  style={{
                                    color: '#000000',
                                    fontSize:
                                      height > width ? wp('3.2%') : wp('1.8%'),
                                    lineHeight:
                                      height > width ? wp('4%') : wp('2.5%'),
                                  }}
                                  ellipsizeMode="tail"
                                  numberOfLines={2}>
                                  {item.text}
                                </Text>
                              </View>
                            )}
                            {height < width ? (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  marginTop: 10,
                                  marginBottom: 8,
                                  justifyContent: 'space-between',
                                }}>
                                <View
                                  style={{
                                    alignSelf: 'center',
                                    backgroundColor: '#FDFCFC',
                                    width: wp('11%'),
                                    paddingVertical: 5,
                                    borderRadius: 5,
                                    elevation: 2,
                                  }}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'space-around',
                                    }}>
                                    {item.votestatus && item.votestatus.length > 0 &&
                                      item.votestatus[0].value == -1 ? (
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.submitVote(0, item.id);
                                        }}>
                                        <FontAwesomeIcon
                                          icon={faMinus}
                                          color={'#f6110e'}
                                          size={
                                            height > width ? wp('5%') : wp('2.5%')
                                          }
                                        />
                                      </TouchableOpacity>
                                    ) : (
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.submitVote(0, item.id);
                                        }}>
                                        <FontAwesomeIcon
                                          icon={faMinus}
                                          color={'#afaaaa'}
                                          size={
                                            height > width ? wp('5%') : wp('2.5%')
                                          }
                                        />
                                      </TouchableOpacity>
                                    )}
                                    <View style={{ marginHorizontal: 5 }}>
                                      <View style={{ flexDirection: 'row' }}>
                                        <Text
                                          style={{
                                            marginLeft: 5,
                                            fontSize:
                                              height > width
                                                ? wp('3.5%')
                                                : wp('1.5%'),
                                          }}>
                                          {item.upvotes_count - item.downvotes_count}
                                        </Text>
                                        <Image
                                          source={require('../images/oval.png')}
                                          style={{ height: 10, width: 10 }}
                                        />
                                      </View>
                                    </View>

                                    {item.votestatus && item.votestatus.length > 0 &&
                                      item.votestatus[0].value == 1 ? (
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.submitVote(1, item.id);
                                        }}>
                                        <FontAwesomeIcon
                                          icon={faPlus}
                                          color={'#04c60e'}
                                          size={
                                            height > width ? wp('5%') : wp('2.5%')
                                          }
                                        />
                                      </TouchableOpacity>
                                    ) : (
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.submitVote(1, item.id);
                                        }}>
                                        <FontAwesomeIcon
                                          icon={faPlus}
                                          color={'#afaaaa'}
                                          size={
                                            height > width ? wp('5%') : wp('2.5%')
                                          }
                                        />
                                      </TouchableOpacity>
                                    )}
                                  </View>
                                </View>
                                <View
                                  style={{
                                    alignSelf: 'center',
                                    backgroundColor: '#FDFCFC',
                                    width: wp('14.5%'),
                                    paddingVertical: 5,
                                    borderRadius: 5,
                                    elevation: 2,
                                  }}>
                                  <TouchableOpacity
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'space-around',
                                    }}
                                    onPress={() => {
                                      this.openPost(item);
                                    }}>
                                    <FontAwesomeIcon
                                      icon={faCommentAlt}
                                      color={'#afaaaa'}
                                      size={height > width ? wp('5%') : wp('2.5%')}
                                      style={{ marginRight: 5 }}
                                    />
                                    <Text
                                      style={{
                                        marginLeft: 5,
                                        fontSize:
                                          height > width ? wp('3.5%') : wp('1.5%'),
                                      }}>
                                      {item.actual_comments_count} comments
                              </Text>
                                  </TouchableOpacity>
                                </View>
                                <View
                                  style={{
                                    alignSelf: 'center',
                                    backgroundColor: '#FDFCFC',
                                    width: wp('19%'),
                                    paddingVertical: 5,
                                    borderRadius: 5,
                                    elevation: 2,
                                  }}>
                                  <TouchableOpacity
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'space-around',
                                    }}
                                    onPress={() => {
                                      this.showReport(item);
                                    }}>
                                    <FontAwesomeIcon
                                      icon={faChartBar}
                                      color={'#afaaaa'}
                                      size={height > width ? wp('5%') : wp('2.5%')}
                                      style={{ marginLeft: 5 }}
                                    />
                                    {height > width ? null : (
                                      <Text
                                        style={{
                                          marginRight: 5,
                                          fontSize:
                                            height > width ? wp('3.5%') : wp('1.5%'),
                                        }}>
                                        Overall score
                                      </Text>
                                    )}
                                    <Text
                                      style={{
                                        marginLeft: 5,
                                        marginRight: 5,
                                        fontSize:
                                          height > width ? wp('3.5%') : wp('1.5%'),
                                      }}>
                                      {item.overall_score}%
                              </Text>
                                  </TouchableOpacity>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                  <TouchableOpacity
                                    style={{
                                      flexDirection: 'row',
                                      backgroundColor: '#FDFCFC',
                                      padding: 5,
                                      borderRadius: 5,
                                      elevation: 1,
                                    }} >
                                    {item.bookmarked ? (
                                      <TouchableOpacity
                                        style={{
                                          flexDirection: 'row',
                                          justifyContent: 'space-around',
                                        }} onPress={() => {
                                          item.bookmarked
                                            ? this.bookmarkDeleted(item.id)
                                            : this.bookmarkCreated(item.id);
                                        }}>
                                        <FontAwesomeIcon
                                          icon={BookmarkSolid}
                                          color={'#afaaaa'}
                                          size={height > width ? wp('5%') : wp('2.5%')}
                                        />
                                        <Text
                                          style={{
                                            marginLeft: 5,
                                            fontSize:
                                              height > width ? wp('3.5%') : wp('1.5%'),
                                            marginRight: 10
                                          }}>
                                          Bookmarked
                            </Text>
                                      </TouchableOpacity>
                                    ) : (
                                      <TouchableOpacity
                                        style={{
                                          flexDirection: 'row',
                                          justifyContent: 'space-around',
                                        }}
                                        onPress={() => {
                                          item.bookmarked
                                            ? this.bookmarkDeleted(item.id)
                                            : this.bookmarkCreated(item.id);
                                        }}>
                                        <FontAwesomeIcon
                                          icon={BookmarkRegular}
                                          color={'#afaaaa'}
                                          size={height > width ? wp('5%') : wp('2.5%')}
                                        />
                                        <Text
                                          style={{
                                            marginLeft: 5,
                                            fontSize:
                                              height > width ? wp('3.5%') : wp('1.5%'),
                                            marginRight: 10
                                          }}>
                                          Bookmark
                            </Text>
                                      </TouchableOpacity>
                                    )}
                                  </TouchableOpacity>
                                </View>
                                <View
                                  style={{
                                    alignSelf: 'center',
                                    backgroundColor: '#FDFCFC',
                                    paddingVertical: 5,

                                    borderRadius: 5,
                                    elevation: 2,
                                  }}>
                                  <TouchableOpacity
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'space-around',
                                    }}
                                    onPress={() => { }}>
                                    <FontAwesomeIcon
                                      icon={faTag}
                                      color={'#afaaaa'}
                                      size={height > width ? wp('5%') : wp('2.5%')}
                                      style={{ marginLeft: 10 }}
                                    />
                                    <Text
                                      style={{
                                        marginLeft: 2,
                                        fontSize:
                                          height > width ? wp('3.5%') : wp('1.5%'),
                                        marginRight: 10
                                      }}>
                                      {this.state.warrenName.length < 12
                                        ? `${" " + this.state.warrenName}`
                                        : `${" " + this.state.warrenName.substring(0, 10)}...`}
                                      {/* {this.state.warrenName} */}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                                <View
                                  style={{
                                    alignSelf: 'center',
                                    backgroundColor: '#FDFCFC',
                                    width: wp('10%'),
                                    paddingVertical: 5,
                                    borderRadius: 5,
                                    elevation: 2,
                                  }}>
                                  <TouchableOpacity
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'space-around',
                                    }}
                                    onPress={() => {
                                      this.reportPost(item.id);
                                    }}>
                                    <FontAwesomeIcon
                                      icon={faFileAlt}
                                      color={'#afaaaa'}
                                      size={height > width ? wp('5%') : wp('2.5%')}
                                      style={{ marginRight: 5 }}
                                    />
                                    <Text
                                      style={{
                                        marginLeft: 5,
                                        fontSize:
                                          height > width ? wp('3.5%') : wp('1.5%'),
                                      }}>
                                      Report
                              </Text>
                                  </TouchableOpacity>
                                </View>
                                <View
                                  style={{
                                    alignSelf: 'center',
                                    backgroundColor: '#FDFCFC',
                                    width: wp('10%'),
                                    paddingVertical: 5,
                                    borderRadius: 5,
                                    elevation: 2,
                                  }}>
                                  <TouchableOpacity
                                    onPress={() => {
                                      this.shareMessage(item.slug, item.title);
                                    }}
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'space-around',
                                    }}>
                                    <FontAwesomeIcon
                                      icon={faShare}
                                      color={'#afaaaa'}
                                      size={height > width ? wp('5%') : wp('2.5%')}
                                      style={{ marginRight: 5 }}
                                    />
                                    <Text
                                      style={{
                                        marginLeft: 3,
                                        fontSize:
                                          height > width ? wp('3.5%') : wp('1.5%'),
                                      }}>
                                      Share
                              </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            ) : (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  marginTop: 10,
                                  marginBottom: 5,
                                  justifyContent: 'space-between',
                                }}>
                                <View
                                  style={{
                                    alignItems: 'center',
                                  }}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      backgroundColor: '#FDFCFC',
                                      padding: 5,
                                      borderRadius: 5,
                                      elevation: 1,
                                    }}>
                                    {item.votestatus && item.votestatus.length > 0 &&
                                      item.votestatus[0].value == -1 ? (
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.submitVote(0, item.id);
                                        }}>
                                        <FontAwesomeIcon
                                          icon={faMinus}
                                          color={'#f6110e'}
                                          size={height > width ? wp('5%') : wp('2%')}
                                        />
                                      </TouchableOpacity>
                                    ) : (
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.submitVote(0, item.id);
                                        }}>
                                        <FontAwesomeIcon
                                          icon={faMinus}
                                          color={'#afaaaa'}
                                          size={height > width ? wp('5%') : wp('2%')}
                                        />
                                      </TouchableOpacity>
                                    )}
                                    <View style={{ marginHorizontal: 5 }}>
                                      <View style={{ flexDirection: 'row' }}>
                                        <Text
                                          style={{
                                            marginLeft: 5,
                                            fontSize:
                                              height > width
                                                ? wp('3.5%')
                                                : wp('1.5%'),
                                          }}>
                                          {item.upvotes_count - item.downvotes_count}
                                        </Text>
                                        <Image
                                          source={require('../images/oval.png')}
                                          style={{ height: 10, width: 10 }}
                                        />
                                      </View>
                                    </View>

                                    {item.votestatus && item.votestatus.length > 0 &&
                                      item.votestatus[0].value == 1 ? (
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.submitVote(1, item.id);
                                        }}>
                                        <FontAwesomeIcon
                                          icon={faPlus}
                                          color={'#04c60e'}
                                          size={height > width ? wp('5%') : wp('2%')}
                                        />
                                      </TouchableOpacity>
                                    ) : (
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.submitVote(1, item.id);
                                        }}>
                                        <FontAwesomeIcon
                                          icon={faPlus}
                                          color={'#afaaaa'}
                                          size={height > width ? wp('5%') : wp('2%')}
                                        />
                                      </TouchableOpacity>
                                    )}
                                  </View>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                  <TouchableOpacity
                                    style={{
                                      flexDirection: 'row',
                                      backgroundColor: '#FDFCFC',
                                      padding: 5,
                                      borderRadius: 5,
                                      elevation: 1,
                                    }}
                                    onPress={() => {
                                      this.openPost(item);
                                    }}>
                                    <FontAwesomeIcon
                                      icon={faCommentAlt}
                                      color={'#afaaaa'}
                                      size={height > width ? wp('5%') : wp('2%')}
                                      style={{ marginRight: 5 }}
                                    />
                                    <Text
                                      style={{
                                        marginLeft: 5,
                                        fontSize:
                                          height > width ? wp('3.5%') : wp('1.5%'),
                                      }}>
                                      {item.actual_comments_count}
                                    </Text>
                                  </TouchableOpacity>
                                </View>

                                <View style={{ alignItems: 'center' }}>
                                  <TouchableOpacity
                                    style={{
                                      flexDirection: 'row',
                                      backgroundColor: '#FDFCFC',
                                      padding: 5,
                                      borderRadius: 5,
                                      elevation: 1,
                                    }}
                                    onPress={() => {
                                      this.showReport(item);
                                    }}>
                                    <FontAwesomeIcon
                                      icon={faChartBar}
                                      color={'#afaaaa'}
                                      size={height > width ? wp('5%') : wp('2%')}
                                      style={{ marginRight: 5 }}
                                    />
                                    {/* <Text
                                style={{
                                  marginRight: 5,
                                  fontSize:
                                    height > width ? wp('3.5%') : wp('1.5%'),
                                }}>
                                Score
                            </Text> */}
                                    <Text
                                      style={{
                                        marginLeft: 5,
                                        marginRight: 5,
                                        fontSize:
                                          height > width ? wp('3.5%') : wp('1.5%'),
                                      }}>
                                      {item.overall_score}%
                              </Text>
                                  </TouchableOpacity>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                  <TouchableOpacity
                                    style={{
                                      flexDirection: 'row',
                                      backgroundColor: '#FDFCFC',
                                      padding: 5,
                                      borderRadius: 5,
                                      elevation: 1,
                                    }}
                                    onPress={() => {
                                      item.bookmarked
                                        ? this.bookmarkDeleted(item.id)
                                        : this.bookmarkCreated(item.id);
                                    }}>
                                    {item.bookmarked ? (
                                      <FontAwesomeIcon
                                        icon={BookmarkSolid}
                                        color={'#afaaaa'}
                                        size={height > width ? wp('5%') : wp('2.5%')}
                                      />
                                    ) : (
                                      <FontAwesomeIcon
                                        icon={BookmarkRegular}
                                        color={'#afaaaa'}
                                        size={height > width ? wp('5%') : wp('2.5%')}
                                      />
                                    )}
                                  </TouchableOpacity>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                  <TouchableOpacity
                                    style={{
                                      flexDirection: 'row',
                                      backgroundColor: '#FDFCFC',
                                      padding: 5,
                                      borderRadius: 5,
                                      elevation: 1,
                                    }}
                                    onPress={() => {
                                      this.ShowHideComponent(item);
                                    }}>
                                    <FontAwesomeIcon
                                      icon={faEllipsisV}
                                      color={'#afaaaa'}
                                      size={height > width ? wp('5%') : wp('2.5%')}
                                    />
                                  </TouchableOpacity>
                                </View>
                                {/* <View style={{alignItems: 'center'}}>
                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                backgroundColor: '#FDFCFC',
                                padding: 5,
                                borderRadius: 5,
                                elevation: 1,
                              }}
                              onPress={() => {
                                this.shareMessage(item.slug, item.title);
                              }}>
                              <FontAwesomeIcon
                                icon={faShare}
                                color={'#afaaaa'}
                                size={height > width ? wp('5%') : wp('2.5%')}
                                style={{marginHorizontal: 5}}
                              />
                            </TouchableOpacity>
                          </View>
                          <View style={{alignItems: 'center'}}>
                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                backgroundColor: '#FDFCFC',
                                padding: 5,
                                borderRadius: 5,
                                elevation: 1,
                              }}
                              onPress={() => {
                                this.reportPost(item.id);
                              }}>
                              <FontAwesomeIcon
                                icon={faFileAlt}
                                color={'#afaaaa'}
                                size={height > width ? wp('5%') : wp('2.5%')}
                                style={{marginHorizontal: 5}}
                              />
                            </TouchableOpacity>
                          </View> */}
                              </View>
                            )}
                          </View>
                        </Card>
                      ) : item.post_type == 'text' ? (
                        <Card containerStyle={styles.card_style}>
                          <View style={{ flex: height > width ? 0.4 : 0.3 }}>

                            <TouchableOpacity 
                             onPress={() => {
                              if (this.state.token == "") {
                                this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
                              }
                              else {
                                this.pin(item.id);
                              }
                            }}
                            style={{ position: 'absolute', right: 0, padding: 10, zIndex: 9999 }}>
                              <View style={{ elevation: 2, backgroundColor: 'white', borderRadius: 5, width: width > height ? wp('6%') : wp('12%'), height: width > height ? wp('5.5%') : wp('12%'), justifyContent: 'center' }}>
                                <Image source={require('../images/unpin.png')} style={{ justifyContent: 'center', alignSelf: 'center', alignItems: 'center', marginTop: 5, width: width > height ? wp('4%') : wp('8%'), height: width > height ? wp('4%') : wp('8%') }} />
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                maxHeight: height > width ? hp('21%') : hp('30%'),
                              }}
                              onPress={() => {
                                this.openPost(item);
                              }}>
                              <Image
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  borderTopRightRadius: 5,
                                  borderTopLeftRadius: 5,
                                }}
                                source={{ uri: item.image }}
                                resizeMode="cover"
                              />
                            </TouchableOpacity>
                          </View>
                          <View
                            style={{
                              flex: height > width ? 0.6 : 0.7,
                              paddingHorizontal: 10,
                              paddingTop: 10,
                            }}>
                            <View style={{}}>
                              <TouchableOpacity
                                onPress={() => {
                                  this.openPost(item);
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
                                  {item.title}
                                </Text>
                              </TouchableOpacity>
                            </View>
                            {this.state.postType == 'link' ? (
                              <TouchableOpacity
                                style={{
                                  flexDirection: 'row',
                                  marginTop: 5,
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
                                    fontSize: height > width ? wp('3%') : wp('1.2%'),
                                    fontWeight: 'bold',
                                  }}
                                  ellipsizeMode="tail"
                                  numberOfLines={1}>
                                  {item.link.split('/')[2]}
                                </Text>
                              </TouchableOpacity>
                            ) : null}
                            <View
                              style={{
                                alignItems: 'center',
                                marginTop: 5,
                                flexDirection: 'row',
                              }}>
                              <Text
                                style={{
                                  color: 'grey',
                                  fontSize: height > width ? wp('3%') : wp('1.2%'),
                                }}
                                ellipsizeMode="tail"
                                numberOfLines={1}>
                                Submitted by{' '}
                              </Text>
                              <TouchableOpacity
                                onPress={() => {
                                  if (this.state.token == "") {
                                    this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
                                  }
                                  else {
                                    this.props.navigation.navigate('viewProfile', {
                                      userName: item.user.name,
                                      userId: item.user.id,
                                    })
                                  }
                                }
                                }>
                                <Text
                                  style={{
                                    color: 'grey',
                                    fontSize: height > width ? wp('3%') : wp('1.2%'),
                                  }}
                                  ellipsizeMode="tail"
                                  numberOfLines={1}>
                                  {item.user.name}
                                </Text>
                              </TouchableOpacity>
                              <Text
                                style={{
                                  color: 'grey',
                                  marginHorizontal: 10,
                                }}>
                                |
                        </Text>
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
                            <View style={{ marginTop: 5 }}>
                              <Text
                                style={{
                                  color: '#000000',
                                  fontSize: height > width ? wp('3.2%') : wp('1.8%'),
                                  lineHeight: height > width ? wp('4%') : wp('2.5%'),
                                }}
                                ellipsizeMode="tail"
                                numberOfLines={2}>
                                {item.text}
                              </Text>
                            </View>
                            {height < width ? (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  marginTop: 10,
                                  marginBottom: 5,
                                  justifyContent: 'space-between',
                                }}>
                                <View
                                  style={{
                                    alignSelf: 'center',
                                    backgroundColor: '#FDFCFC',
                                    width: wp('12%'),
                                    paddingVertical: 5,
                                    borderRadius: 5,
                                    elevation: 2,
                                  }}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'space-around',
                                    }}>
                                    {item.votestatus && item.votestatus.length > 0 &&
                                      item.votestatus[0].value == -1 ? (
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.submitVote(0, item.id);
                                        }}>
                                        <FontAwesomeIcon
                                          icon={faMinus}
                                          color={'#f6110e'}
                                          size={
                                            height > width ? wp('5%') : wp('2.5%')
                                          }
                                        />
                                      </TouchableOpacity>
                                    ) : (
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.submitVote(0, item.id);
                                        }}>
                                        <FontAwesomeIcon
                                          icon={faMinus}
                                          color={'#afaaaa'}
                                          size={
                                            height > width ? wp('5%') : wp('2.5%')
                                          }
                                        />
                                      </TouchableOpacity>
                                    )}
                                    <View style={{ marginHorizontal: 5 }}>
                                      <View style={{ flexDirection: 'row' }}>
                                        <Text
                                          style={{
                                            marginLeft: 5,
                                            fontSize:
                                              height > width
                                                ? wp('3.5%')
                                                : wp('1.5%'),
                                          }}>
                                          {item.upvotes_count - item.downvotes_count}
                                        </Text>
                                        <Image
                                          source={require('../images/oval.png')}
                                          style={{ height: 10, width: 10 }}
                                        />
                                      </View>
                                    </View>

                                    {item.votestatus && item.votestatus.length > 0 &&
                                      item.votestatus[0].value == 1 ? (
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.submitVote(1, item.id);
                                        }}>
                                        <FontAwesomeIcon
                                          icon={faPlus}
                                          color={'#04c60e'}
                                          size={
                                            height > width ? wp('5%') : wp('2.5%')
                                          }
                                        />
                                      </TouchableOpacity>
                                    ) : (
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.submitVote(1, item.id);
                                        }}>
                                        <FontAwesomeIcon
                                          icon={faPlus}
                                          color={'#afaaaa'}
                                          size={
                                            height > width ? wp('5%') : wp('2.5%')
                                          }
                                        />
                                      </TouchableOpacity>
                                    )}
                                  </View>
                                </View>
                                <View
                                  style={{
                                    alignSelf: 'center',
                                    backgroundColor: '#FDFCFC',
                                    width: wp('16%'),
                                    paddingVertical: 5,
                                    borderRadius: 5,
                                    elevation: 2,
                                  }}>
                                  <TouchableOpacity
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'space-around',
                                    }}
                                    onPress={() => {
                                      this.openPost(item);
                                    }}>
                                    <FontAwesomeIcon
                                      icon={faCommentAlt}
                                      color={'#afaaaa'}
                                      size={height > width ? wp('5%') : wp('2.5%')}
                                      style={{ marginRight: 5 }}
                                    />
                                    <Text
                                      style={{
                                        marginLeft: 5,
                                        fontSize:
                                          height > width ? wp('3.5%') : wp('1.5%'),
                                      }}>
                                      {item.actual_comments_count} comments
                              </Text>
                                  </TouchableOpacity>
                                </View>
                                <View
                                  style={{
                                    alignSelf: 'center',
                                    backgroundColor: '#FDFCFC',
                                    width: wp('12%'),
                                    paddingVertical: 5,
                                    borderRadius: 5,
                                    elevation: 2,
                                  }}>
                                  <TouchableOpacity
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'space-around',
                                    }}
                                    onPress={() => { }}>
                                    <FontAwesomeIcon
                                      icon={faTag}
                                      color={'#afaaaa'}
                                      size={height > width ? wp('5%') : wp('2.5%')}
                                      style={{ marginRight: 5 }}
                                    />
                                    <Text
                                      style={{
                                        marginLeft: 5,
                                        fontSize:
                                          height > width ? wp('3.5%') : wp('1.5%'),
                                      }}>
                                      {this.state.warrenName}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                                <View
                                  style={{
                                    alignSelf: 'center',
                                    backgroundColor: '#FDFCFC',
                                    width: wp('12%'),
                                    paddingVertical: 5,
                                    borderRadius: 5,
                                    elevation: 2,
                                  }}>
                                  <TouchableOpacity
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'space-around',
                                    }}
                                    onPress={() => {
                                      this.reportPost(item.id);
                                    }}>
                                    <FontAwesomeIcon
                                      icon={faFileAlt}
                                      color={'#afaaaa'}
                                      size={height > width ? wp('5%') : wp('2.5%')}
                                      style={{ marginRight: 5 }}
                                    />
                                    <Text
                                      style={{
                                        marginLeft: 5,
                                        fontSize:
                                          height > width ? wp('3.5%') : wp('1.5%'),
                                      }}>
                                      Report
                              </Text>
                                  </TouchableOpacity>
                                </View>
                                <View
                                  style={{
                                    alignSelf: 'center',
                                    backgroundColor: '#FDFCFC',
                                    width: wp('12%'),
                                    paddingVertical: 5,
                                    borderRadius: 5,
                                    elevation: 2,
                                  }}>
                                  <TouchableOpacity
                                    onPress={() => {
                                      this.shareMessage(item.slug, item.title);
                                    }}
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'space-around',
                                    }}>
                                    <FontAwesomeIcon
                                      icon={faShare}
                                      color={'#afaaaa'}
                                      size={height > width ? wp('5%') : wp('2.5%')}
                                      style={{ marginRight: 8 }}
                                    />
                                    <Text
                                      style={{
                                        marginLeft: 8,
                                        fontSize:
                                          height > width ? wp('3.5%') : wp('1.5%'),
                                      }}>
                                      Share
                              </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            ) : (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  marginTop: 10,
                                  marginBottom: 5,
                                  justifyContent: 'space-between',
                                }}>
                                <View
                                  style={{
                                    alignItems: 'center',
                                  }}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      backgroundColor: '#FDFCFC',
                                      padding: 5,
                                      borderRadius: 5,
                                      elevation: 1,
                                    }}>
                                    {item.votestatus && item.votestatus.length > 0 &&
                                      item.votestatus[0].value == -1 ? (
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.submitVote(0, item.id);
                                        }}>
                                        <FontAwesomeIcon
                                          icon={faMinus}
                                          color={'#f6110e'}
                                          size={height > width ? wp('5%') : wp('2%')}
                                        />
                                      </TouchableOpacity>
                                    ) : (
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.submitVote(0, item.id);
                                        }}>
                                        <FontAwesomeIcon
                                          icon={faMinus}
                                          color={'#afaaaa'}
                                          size={height > width ? wp('5%') : wp('2%')}
                                        />
                                      </TouchableOpacity>
                                    )}
                                    <View style={{ marginHorizontal: 10 }}>
                                      <View style={{ flexDirection: 'row' }}>
                                        <Text
                                          style={{
                                            fontSize:
                                              height > width
                                                ? wp('3.5%')
                                                : wp('1.5%'),
                                          }}>
                                          {item.upvotes_count - item.downvotes_count}
                                        </Text>
                                        <Image
                                          source={require('../images/oval.png')}
                                          style={{ height: 10, width: 10 }}
                                        />
                                      </View>
                                    </View>

                                    {item.votestatus && item.votestatus.length > 0 &&
                                      item.votestatus[0].value == 1 ? (
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.submitVote(1, item.id);
                                        }}>
                                        <FontAwesomeIcon
                                          icon={faPlus}
                                          color={'#04c60e'}
                                          size={height > width ? wp('5%') : wp('2%')}
                                        />
                                      </TouchableOpacity>
                                    ) : (
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.submitVote(1, item.id);
                                        }}>
                                        <FontAwesomeIcon
                                          icon={faPlus}
                                          color={'#afaaaa'}
                                          size={height > width ? wp('5%') : wp('2%')}
                                        />
                                      </TouchableOpacity>
                                    )}
                                  </View>
                                </View>

                                <View style={{ alignItems: 'center' }}>
                                  <TouchableOpacity
                                    style={{
                                      flexDirection: 'row',
                                      backgroundColor: '#FDFCFC',
                                      padding: 5,
                                      borderRadius: 5,
                                      elevation: 1,
                                    }}
                                    onPress={() => {
                                      this.openPost(item);
                                    }}>
                                    <FontAwesomeIcon
                                      icon={faCommentAlt}
                                      color={'#afaaaa'}
                                      size={height > width ? wp('5%') : wp('2%')}
                                      style={{ marginRight: 5 }}
                                    />
                                    <Text
                                      style={{
                                        marginLeft: 5,
                                        fontSize:
                                          height > width ? wp('3.5%') : wp('1.5%'),
                                      }}>
                                      {item.actual_comments_count} comments
                              </Text>
                                  </TouchableOpacity>
                                </View>
                                {/* <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                backgroundColor: '#FDFCFC',
                                padding: 5,
                                borderRadius: 5,
                                elevation: 1,
                              }}
                              onPress={() => {
                                this.ShowHideComponent(item);
                              }}>
                              <FontAwesomeIcon
                                icon={faEllipsisV}
                                color={'#afaaaa'}
                                size={height > width ? wp('5%') : wp('2.5%')}
                              />
                            </TouchableOpacity>
                          </View> */}
                                <View style={{ alignItems: 'center' }}>
                                  <TouchableOpacity
                                    style={{
                                      flexDirection: 'row',
                                      backgroundColor: '#FDFCFC',
                                      padding: 5,
                                      borderRadius: 5,
                                      elevation: 1,
                                    }}
                                    onPress={() => {
                                      item.bookmarked
                                        ? this.bookmarkDeleted(item.id)
                                        : this.bookmarkCreated(item.id);
                                    }}>
                                    {item.bookmarked ? (
                                      <FontAwesomeIcon
                                        icon={BookmarkSolid}
                                        color={'#afaaaa'}
                                        size={height > width ? wp('5%') : wp('2.5%')}
                                      />
                                    ) : (
                                      <FontAwesomeIcon
                                        icon={BookmarkRegular}
                                        color={'#afaaaa'}
                                        size={height > width ? wp('5%') : wp('2.5%')}
                                      />
                                    )}
                                  </TouchableOpacity>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                  <TouchableOpacity
                                    style={{
                                      flexDirection: 'row',
                                      backgroundColor: '#FDFCFC',
                                      padding: 5,
                                      borderRadius: 5,
                                      elevation: 1,
                                    }}
                                    onPress={() => {
                                      this.ShowHideComponent(item);
                                    }}>
                                    <FontAwesomeIcon
                                      icon={faEllipsisV}
                                      color={'#afaaaa'}
                                      size={height > width ? wp('5%') : wp('2.5%')}
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            )}
                          </View>
                        </Card>
                      ) :
                        null
                  )
                }
                }
                keyExtractor={({ id }, index) => id}
              />
            </View>
          ) :

            <View>
              {this.state.pindataSource.length > 0 ? null :
                <View style={{ marginTop: height > width ? width * 0.5 : width * 0.2, alignSelf: 'center' }}>
                  <Image
                    style={{ alignSelf: 'center', width: height > width ? width * 0.14 : width * 0.08, height: height > width ? width * 0.14 : width * 0.08 }}
                    source={require('../images/warren.png')} />
                  <Text style={{ color: '#11075e', marginTop: 5, fontWeight: 'bold', fontSize: height > width ? hp("2%") : hp('3.3%') }}>No Warren Posts Yet</Text>
                </View>}
            </View>


          }
        </ScrollView>
      </View>
      //  <TouchableOpacity
      //   style={styles.float_btn}
      //   onPress={() => {
      //     this.setState({ addNewPost: true });
      //   }}>
      //   <FontAwesomeIcon
      //     icon={faPlus}
      //     color={'white'}
      //     size={height > width ? wp('6.5%') : wp('2.5%')}
      //   />
      // </TouchableOpacity> 
      //  </SideMenuDrawer> 
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
  followBtnCss: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#5848CF',
    borderColor: '#11075e',
    borderWidth: 1,
    alignSelf: 'stretch',
    borderRadius: 5
    // alignItems: 'stretch',
    // alignItems: 'flex-end',
  },
  unfollowBtnCss: {
    backgroundColor: 'white',
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    alignSelf: 'stretch',
    borderRadius: 5
    // alignItems: 'stretch',
  },
  inputtype_dialog: {
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 1,
    paddingLeft: 10,
    paddingVertical: 10,
    marginTop: 20,
    textAlignVertical: 'top',
    color: 'black',
    flexWrap: 'wrap',
    fontSize: Device.isPhone ? wp('4.5%') : Device.isTablet ? wp('2.5%') : null,
  },
  inputtype_dialog_fix: {
    borderColor: 'grey',
    backgroundColor: 'lightgrey',
    borderWidth: 1,
    paddingLeft: 10,
    paddingVertical: 10,
    textAlignVertical: 'top',
    color: 'black',
    flexWrap: 'wrap',
    fontSize: Device.isPhone ? wp('4.5%') : Device.isTablet ? wp('2.5%') : null,
  },
  float_btn: {
    backgroundColor: '#11075e',
    padding: 20,
    borderRadius: 75,
    position: 'absolute',
    bottom: 15,
    right: 25,
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
  searchView: {
    flexDirection: 'row',
    margin: 15,
    marginBottom: 5,
    paddingBottom: 0,
  },
  inputtype_css: {
    paddingLeft: height > width ? 10 : 20,
    textAlignVertical: 'center',
    width: '80%',
    color: 'black',
    flexWrap: 'wrap',
    fontSize: height > width ? wp('4.5%') : wp('1.8%'),
    alignItems: 'center',
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
