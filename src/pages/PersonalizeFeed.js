import React, { PureComponent } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  Share,
  TextInput,
  Platform,
  AppState,
  RefreshControl,
  KeyboardAvoidingView,
  BackHandler,
  Alert,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {
  faBars,
  faSearch,
  faPlus,
  faFileAlt,
  faBookmark as BookmarkSolid,
  faEllipsisV,
  faCommentAlt,
  faMinus,
  faShare,
  faTag,
  faChartBar,
  faFilter,
  faList,
  faTimes,
  faAngleRight,
  faCalendarAlt,
  faAngleDown,
  faAngleUp,
  faExternalLinkAlt,
  faBookReader,
} from '@fortawesome/free-solid-svg-icons';
import { faBookmark as BookmarkRegular, faShareSquare } from '@fortawesome/free-regular-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import TreeView from 'react-native-final-tree-view';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import Toast from 'react-native-simple-toast';
import Modal from 'react-native-modal';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import RadioGroup from 'react-native-radio-buttons-group';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Dialog } from 'react-native-simple-dialogs';
import SideMenuDrawer from '../component/SideMenuDrawer';
import Autocomplete from 'react-native-autocomplete-input';
// import { Autocomplete, withKeyboardAwareScrollView } from "react-native-dropdown-autocomplete";
import DeviceInfo from 'react-native-device-info';
import { Button, Left, Right, Header, Body } from 'native-base';
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';
import AsyncStorage from '@react-native-community/async-storage';
import { Bars } from 'react-native-loader';
import { Card } from 'react-native-elements';
import RNImagePicker from 'react-native-image-picker';
import { NavigationEvents } from 'react-navigation';
import Endpoint from '../res/url_endpoint';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import { FlatList } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import NetInfo from '@react-native-community/netinfo';
import firebase from 'react-native-firebase';
import YoutubePlayer from "react-native-youtube-iframe";
// import * as Progress from 'react-native-progress';
library.add(BookmarkSolid, BookmarkRegular);
var { height, width } = Dimensions.get('window');

export default class PersonalizeFeed extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userDetail: '',
      token: '',
      user_id: '',
      billing_type: '',
      following_count: '',
      email_verified: '',
      dataSource: [],
      dataSourceWarren: [],
      warrendata: "",
      sortBy: 'overall_score',
      postType: 'link,video',
      post_Date: 'day',
      post_Dates: false,
      isHottest: false,
      btnDialog: false,
      searchText: '',
      page: 1,
      warrenPage: 1,
      postLink: '',
      postTitle: '',
      addNewPost: false,
      addDialogLink: true,
      addDialogText: false,
      addDialogImage: false,
      lastPage: '',
      lastWarrenPage: '',
      loading: false,
      newloading: false,
      percentageReport: false,
      overall_score: '',
      grammer_score: '',
      readability_score: '',
      domain_score: '',
      vote_score: '',
      plagiarism_score: '',
      reportPost: false,
      reportPostId: '',
      open: false,
      showbtn: false,
      warrens: '',
      listWarrens: [],
      listSource: [],
      imageName: '',
      query: '',
      id: '',
      domain_id: '',
      slug: '',
      link: '',
      title: '',
      isVisible: false,
      modalVisible: false,
      isSearch: false,
      flag: 1,
      link_checked: true,
      text_checked: false,
      image_checked: true,
      postValue: ['link','video'],
      sortValue: '',
      isRefreshing: false,
      progressStatus: 0,
      postDate: [],
      loginmodal: false,
      logintext: "",
      push_id_token: '',

      welcomedialogue: false,
      readerdialogue: false,
      publisherdialogue: false,
      reportData: [
        {
          label: 'This is spam',
          value: 'This is spam',
          color: '#11075e',
          size: height > width ? 20 : 25,
        },
        {
          label: 'This is abusive or harassing',
          value: 'This is abusive or harassing',
          color: '#11075e',
          size: height > width ? 20 : 25,
        },
        {
          label: 'Inappropriate Content',
          value: 'Inappropriate Content',
          color: '#11075e',
          size: height > width ? 20 : 25,
        },
        {
          label: 'Incorrect Category',
          value: 'Incorrect Category',
          color: '#11075e',
          size: height > width ? 20 : 25,
        },
        {
          label: 'Misleading Title',
          value: 'Misleading Title',
          color: '#11075e',
          size: height > width ? 20 : 25,
        },
      ],
      sortData: [
        {
          label: 'Most Recent',
          value: 'created_at',
          color: '#11075e',
          size: height > width ? 20 : 25,
        },
        {
          label: 'Hottest',
          value: 'vote_score',
          color: '#11075e',
          size: height > width ? 20 : 25,
        },
        {
          label: 'Most Commented',
          value: 'comments_count',
          color: '#11075e',
          size: height > width ? 20 : 25,
        },
        {
          label: 'Highest Ranked',
          value: 'overall_score',
          color: '#11075e',
          selected: true,
          size: height > width ? 20 : 25,
        },
      ],

      warren_id: '',
    };
    this._retrieveData();
    this._retrieveWelcomeDialogue();
    this._retrivecountrycode();
    this.checkPermission();
    this.messageListener();
    this.videolinkarr=[];
    this.changeStatus = this.changeStatus.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  _retrieveWelcomeDialogue = async () => {
    try {
      let welcomedialogue = await AsyncStorage.getItem('welcomedialogue');
      let parsed = JSON.parse(welcomedialogue);
      console.log("Final Welcome Dilouge==>", parsed);
      if (parsed != null) {
        this.setState({ welcomedialogue: false })
      } else {
        this.setState({ welcomedialogue: true })
      }
    }
    catch (error) {
      console.log("Error", error);
    }
  }

  warrensclicked = item => {
    if (this.props.parent == undefined) {
      this.props.navigation.navigate('warrenPost', { warrenId: item.id, warrenName: item.name });
    } else {
      this.propsparent(id);
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

  getRecentWarrens = () => {

    if (this.state.token == "") {
      fetch(Endpoint.endPoint.url + Endpoint.endPoint.most_visited_warrens, {
        method: 'GET',
        // headers: headers,
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({ loading: false });
          console.log("all new responseJson====>", responseJson)
          if (responseJson.status == true) {
            this.setState({ warrendata: responseJson.data });
          } else if (responseJson.status == false) {
            // Toast.show(responseJson.msg, Toast.LONG);
          } else {
            alert('Something went wrong');
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      this.mobilePushNotification(this.state.token);
      var headers = new Headers();
      console.log("token", this.state.token)
      let auth = 'Bearer ' + this.state.token;
      headers.append('Authorization', auth);
      console.log(headers);
      fetch(Endpoint.endPoint.url + Endpoint.endPoint.recentWarrens, {
        method: 'GET',
        headers: headers,
      })
        .then(response => response.json())
        .then(responseJson => {
          // this.setState({ loading: false });
          console.log("responseJson", responseJson)
          if (responseJson.status == true) {
            this.setState({ warrendata: responseJson.data });
          } else if (responseJson.status == false) {
            // Toast.show(responseJson.msg, Toast.LONG);
          } else {
            alert('Something went wrong');
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  checkPermission = async () => {
    console.log("Check Permission");
    const enabled = await firebase.messaging().hasPermission();
    console.log('enabled==>', enabled);
    if (enabled) {
      this.getFcmToken();
    } else {
      this.requestPermission();
    }
  };

  getFcmToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    // alert(fcmToken)
    if (fcmToken) {
      console.log("FCM Token personalized", fcmToken);
      //this.showAlert('Your Firebase Token is:', fcmToken);
      this.storeDeviceToken(fcmToken);
    } else {
      this.showAlert('Failed', 'No token received');
    }
  };

  messageListener = async () => {
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();

    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      // this.showAlert(title, body);
      console.log(title, body);
    }

    this.messageListener = firebase.messaging().onMessage(message => {
      console.log(JSON.stringify(message));
    });
  };

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
    } catch (error) {
      // User has rejected permissions
    }
  };

  showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: false },
    );
  };

  storeDeviceToken = token => {
    this.setState({ push_id_token: token });
    // this.mobilePushNotification(token);
  };

  mobilePushNotification = (token) => {
    console.log("Notification Personalized", token);
    var headers = new Headers();
    let auth = 'Bearer ' + token;
    headers.append('Authorization', auth);
    var data = new FormData();
    data.append('uuid', DeviceInfo.getUniqueId());
    data.append('push_id', this.state.push_id_token);
    data.append('platform', Platform.OS);
    data.append('type', 'android');

    console.log("DATA Personalized==>", data)
    console.log("API==>", Endpoint.endPoint.url + Endpoint.endPoint.mobile_push_update_notification);

    fetch(Endpoint.endPoint.url + Endpoint.endPoint.mobile_push_update_notification, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseNotification => {
        console.log("Notification Login =>", responseNotification);
      })
      .catch(error => {
        console.log(error);
      });
  };


  componentDidMount() {
    console.log("Guest Notification Response 0==>");
    if (this.state.token == "") {
      this.storewelcomedialogue();
      // console.log("Without login==>", Endpoint.endPoint.url + Endpoint.endPoint.guest_notification);
      // var data = new FormData();
      // data.append('uuid', DeviceInfo.getUniqueId());
      // fetch(Endpoint.endPoint.url + Endpoint.endPoint.guest_notification, {
      //   method: 'POST',
      //   body: data,
      // })
      //   .then(response => response.json())
      //   .then(responseJson => {
      //     console.log("Guest Notification Response==>", responseJson);
      //   })
      //   .catch(error => {
      //     console.log("Error", error);
      //   });
    }


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


    if (this.state.token == "") {
      this.setState({ billing_type: 'Free' })
    }
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    console.log('LISTENING TO DEEPLINKING');
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        // alert(url)
        console.log("url first", url);
        // var linka = 'blogs://bunnyapp#id=810788;slug=40-years-after-reagan-bidens-bet-that-big-government-can-get-something-done;scheme=https;package=com.blogsbunny;end';
        // console.log("linka", linka.indexOf('id'))
        var newID = url.substring(url.indexOf('=') + 1, url.indexOf(';'))
        var newslug = url.substring(url.indexOf('slug') + 5, url.indexOf('scheme') - 1)

        console.log("newID", newID)
        console.log("newslug", newslug)

        // alert(url)
        if (newslug != 's://bunnyapp#Intent') {
          this.navigate(newID, newslug);
        }
      });
      if (AppState.currentState == 'active') {
        Linking.addEventListener('url', event => {
          this.handleOpenURL(event);
        });
      }
      ReceiveSharingIntent.getReceivedFiles(
        files => {
          console.log('files', files[0].weblink);
          if (files[0].weblink != null) {
            this.props.navigation.navigate('newPost', {
              weblink: files[0].weblink,
              value: 0,
            });
          } else if (files[0].fileName != null) {
            this.props.navigation.navigate('newPost', {
              fileName: files[0].fileName,
              value: 1,
            });
          }
          // files returns as JSON Array example
          //[{ filePath: null, text: null, weblink: null, mimeType: null, contentUri: null, fileName: null, extension: null }]
        },
        error => {
          console.log(error);
        },
      );
    } else {
      Linking.addEventListener('url', event => {
        this.handleOpenURL(event);
      });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    Linking.removeEventListener('url', event => {
      this.handleOpenURL(event);
    });
    ReceiveSharingIntent.clearReceivedFiles();
  }

  handleBackButtonClick() {
    if (this.props.navigation.isFocused()) {
      BackHandler.exitApp();
      return true;
    } else {
      return false;
    }
  }

  handleOpenURL(event) {
    this.navigate(event.url);
  }

  navigate = (newID, newslug) => {
    this.props.navigation.navigate('singlePost', {
      Slug: newslug,
      id: newID,
      // getPostData: this.getPostData
    });
    // if (url != null) {
    //   const { navigate } = this.props.navigation;
    //   const route = url.replace(/.*?:\/\//g, '');
    //   const slugName = route.split('/')[2];
    //   navigate('singlePost', { Slug: slugName });
    // }
  };

  onRefresh() {
    this.setState({ isRefreshing: true, loading: true, dataSource: "", page: 1 }); // true isRefreshing flag for enable pull to refresh indicator
    this.timeoutHandle = setTimeout(() => {
      this.getFeedsData();
    }, 2000);

  }

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
      this.setState({ loading: true })
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
            this.getFeedsData();
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
    }
    else {
      this.setState({ loading: true })
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
            this.getFeedsData();
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
        });
    } else {
      Toast.show('Please enter valid URL link.', Toast.LONG);
    }
  };

  seeMore = () => {
    if (this.state.warrenPage <= this.state.lastWarrenPage) {
      this.setState(
        {
          warrenPage: this.state.warrenPage + 1,
        },
        () => {
          this.getInterestWarren();
        },
      );
    }
  };

  onPress = reportData => this.setState({ reportData });

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
      });
  };

  onCancelPopup = () => {
    this.setState({ btnDialog: false });
  };

  warrenClicked = id => {
    this.setState({ btnDialog: false });
    this.props.navigation.navigate('warrenPost', { warrenId: id });
  };

  onSortPress = () => {
    let sort_value = this.state.sortData.find(e => e.selected == true);
    sort_value = sort_value ? sort_value.value : this.state.sortData[0].label;
    console.log("sort_value", sort_value);
    this.state.sortValue = sort_value;
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

  onpostDatePress = postDate => {
    this.setState({ postDate });

    console.log("postDate==>", postDate);
  };

  findWarrens(query) {
    //method called everytime when we change the value of the input
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
      fetch(Endpoint.endPoint.url + Endpoint.endPoint.warren + '?q=' + query, {
        method: 'GET',
        headers: headers,
      })
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

  openPost1 = item => {
    // if (this.state.token == "") {
    //   this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
    // }
    // else {
    this.props.navigation.navigate('singlePost', {
      Slug: item.slug,
      id: item.id,
      // getPostData: this.getPostData
    });
    // }
  };

  openPost = item => {
    if (this.state.token == "") {
      this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
    }
    else {
      this.props.navigation.navigate('singlePost', {
        Slug: item.slug,
        id: item.id,
        // getPostData: this.getPostData
      });
    }
  };

  // getPostData = data => {
  //   console.log("Getting data back :==> ", data);
  //   if (data.back == true) {
  //     this.setState({ loading: true, dataSource: "", page: 1 }); // true isRefreshing flag for enable pull to refresh indicator
  //     this.timeoutHandle = setTimeout(() => {
  //       this.getFeedsData();
  //     }, 200);
  //   }
  // }

  componentWillUnMount() {
    rol();
  }

  ShowHideComponent = item => {
    if (this.state.token == "") {
      this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
    }
    else {
      this.setState({
        showbtn: true,
        warrens: item.warrens && item.warrens[0].name,
        id: item.id,
        slug: item.slug,
        link: item.link,
        title: item.title,
        domain_id: item.domain_id,
      });
    }
  };

  reportPost = id => {
    // if (this.state.token == "") {
    //   this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
    // } else {
    console.log(id);
    this.setState({ reportPost: true, reportPostId: id, showbtn: false });
    // }
  };

  submitFilter = () => {
    if (
      this.state.postValue == 'text' &&
      this.state.sortValue == 'overall_score'
    ) {
      alert('You can not use this combination.');
    } else if (this.state.postValue == '') {
      alert('You can choose atleast one Post Type.');
    } else {
      this.setState({ isVisible: false });

      this.state.postType = this.state.postValue;

      let post_date = this.state.postDate.find(e => e.selected == true);
      post_date = post_date ? post_date.value : this.state.postDate[0].label;
      this.state.post_Date = post_date;
      console.log("POST DATA==>", this.state.post_Date);

      let sort_value = this.state.sortData.find(e => e.selected == true);
      sort_value = sort_value ? sort_value.value : this.state.sortData[0].label;
      this.state.sortBy = sort_value;
      console.log(this.state.sortBy);
      this.state.dataSource = "";
      this.state.page = 1;
      this.setState({ post_Dates: true })
      this._retrieveData();
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

  clearSearch = () => {
    this.setState({ flag: 1, searchText: '' });
    this._retrieveData();
  };

  page_reloaded = () => {
    this._sideMenuDrawer.close();
    this.setState({ loading: true });
    this._retrieveData();
  };

  // ListEmpty = () => {
  //   return (
  //     <View>
  //       <Text style={{textAlign: 'center', marginTop: 50}}>No Feed Found!</Text>
  //     </View>
  //   );
  // };

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
        if (responseJson.status == true) {
          Toast.show(responseJson.msg, Toast.LONG);
          this.getInterestWarren();
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

  submitNewPost = warrenId => {
    console.log("warrenId", warrenId);
    this.setState({ newloading: true });
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
          if (responseJson.status == true) {
            Toast.show(responseJson.msg, Toast.LONG);
            this.setState({
              newloading: false,
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
        });
    } else if (this.state.addDialogText == true) {
      data.append('type', 'text');
      data.append('title', this.state.postTitle);
      data.append('text', this.state.postText);
      if (this.state.image != undefined) {
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

          if (responseJson.status == true) {
            Toast.show(responseJson.msg, Toast.LONG);
            this.setState({
              newloading: false,
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
        });
    } else if (this.state.addDialogImage == true) {
      data.append('type', 'image');
      data.append('title', this.state.postText);
      if (this.state.image != undefined) {
        data.append('image[]', {
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

          if (responseJson.status == true) {
            Toast.show(responseJson.msg, Toast.LONG);
            this.setState({
              newloading: false,
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
        });
    }
  };

  _retrivecountrycode = async () => {
    this.setState({ loading: true })
    try {
      let countrycode = await AsyncStorage.getItem('visited_country');
      console.log("Country code==>", countrycode);
    }
    catch (error) {
      alert(error)
    }
  }

  _retrieveData = async () => {

    this.setState({ loading: true, token: "" })
    try {
      const value = await AsyncStorage.getItem('visited_onces');
      const ok = await AsyncStorage.getItem('onces');
      console.log('value Personal1' + (value != null ? value.token : " VALUEEE"));

      if (value !== null) {
        const valueRecieve = JSON.parse(value);
        const valueok = JSON.parse(ok);
        console.log('Personal==>', valueRecieve);
        this.setState({ loading: true, warrenPage: 1 });
        this.setState({
          user_id: valueRecieve.user_id,
          token: valueRecieve.token,
          billing_type: valueRecieve.billing_type,
        });
        if (ok !== null) {
          if (
            valueok.from == 'login' &&
            (valueok.following_count !== undefined &&
              valueok.following_count == 0) &&
            (valueok.email_verified !== undefined &&
              valueok.email_verified == 1)
          ) {

            this.getInterestWarren();
            this.setModalVisible(true);

            await AsyncStorage.mergeItem(
              'onces',
              JSON.stringify({
                from: null,
                following_count: undefined,
                email_verified: undefined,
              }),
            );
          }
        }
        this.getFeedsData();
        this.getRecentWarrens();
        if (this.state.dataSource != "") {
          this.setState({ loading: false });
        }
        this.timeoutHandle = setTimeout(() => {
          if (this.state.dataSource == "") {
            this.getFeedsData();
          }
        }, 2000);
      } else if (this.state.token == "") {
        console.log("Login==>");
        // setTimeout(() => {
        this.getFeedsData();
        this.getRecentWarrens();
        // }, 500);
      } else {
        this.getFeedsData();
        this.getRecentWarrens();
      }
    } catch (error) {
      alert(error);
    }
  };


  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  getFeedsData = () => {

    console.log("postDate==>", this.state.post_Date);
    this.setState({ loading: false })
    var headers = new Headers();
    if (this.state.post_Dates == true) {
      if (this.state.post_Date == 'day') {
        this.setState({ loading: true })
        this.setState({ isRefreshing: false, });
        const { page } = this.state;
        // var headers = new Headers();
        let auth = 'Bearer ' + this.state.token;
        headers.append('Authorization', auth);
        console.log("API user first postdate", Endpoint.endPoint.url + 'v2/' +
          'user/feed?page=' +
          this.state.page +
          '&post_type=' +
          this.state.postType +
          '&sort_by=' +
          this.state.sortBy +
          '&q=' +
          this.state.searchText +
          '&post_range=' +
          this.state.post_Date)
        fetch(
          Endpoint.endPoint.url + 'v2/' +
          'user/feed?page=' +
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
            console.log('response feed', responseJsonday);
            if (responseJsonday.status == true) {
              this.setState({
                dataSource:
                  page === 1
                    ? responseJsonday.data
                    : [...this.state.dataSource, ...responseJsonday.data],
                lastPage: responseJsonday.meta.last_page,
                loading: false,
                isSearch: false,
              });
            }
            else {
              this.setState({ loading: false })
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
      else if (this.state.post_Date == "week") {
        this.setState({ loading: true, post_Date: 'week' })
        console.log("Week==>");
        this.setState({ isRefreshing: false, });
        const { page } = this.state;
        // var headers = new Headers();
        let auth = 'Bearer ' + this.state.token;
        headers.append('Authorization', auth);
        console.log("API user", Endpoint.endPoint.url + 'v2/' +
          'user/feed?page=' +
          this.state.page +
          '&post_type=' +
          this.state.postType +
          '&sort_by=' +
          this.state.sortBy +
          '&q=' +
          this.state.searchText +
          '&post_range=' +
          this.state.post_Date)
        fetch(
          Endpoint.endPoint.url + 'v2/' +
          'user/feed?page=' +
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
            console.log('response feed week', responseJsonweek);
            if (responseJsonweek.data.length > 0) {
              this.setState({
                dataSource:
                  page === 1
                    ? responseJsonweek.data
                    : [...this.state.dataSource, ...responseJsonweek.data],
                lastPage: responseJsonweek.meta.last_page,
                loading: false,
                isSearch: false,
              });
            }
            else {
              this.setState({ loading: false })
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
      else if (this.state.post_Date == "month") {
        this.setState({ loading: true, post_Date: 'month' })
        console.log("Month==>");
        this.setState({ isRefreshing: false, });
        const { page } = this.state;
        // var headers = new Headers();
        let auth = 'Bearer ' + this.state.token;
        headers.append('Authorization', auth);
        console.log("API user", Endpoint.endPoint.url + 'v2/' +
          'user/feed?page=' +
          this.state.page +
          '&post_type=' +
          this.state.postType +
          '&sort_by=' +
          this.state.sortBy +
          '&q=' +
          this.state.searchText +
          '&post_range=' +
          this.state.post_Date)
        fetch(
          Endpoint.endPoint.url + 'v2/' +
          'user/feed?page=' +
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
            console.log('response feed month', responseJsonmonth);
            if (responseJsonmonth.status == true) {
              this.setState({
                dataSource:
                  page === 1
                    ? responseJsonmonth.data
                    : [...this.state.dataSource, ...responseJsonmonth.data],
                lastPage: responseJsonmonth.meta.last_page,
                loading: false,
                isSearch: false,
              });
            }
            else {
              this.setState({ loading: false })
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
      else if (this.state.post_Date == "All") {
        this.setState({ loading: true, post_Date: 'All' })
        console.log("All time");
        this.setState({ isRefreshing: false, });
        const { page } = this.state;
        // var headers = new Headers();
        let auth = 'Bearer ' + this.state.token;
        headers.append('Authorization', auth);
        console.log("API user", Endpoint.endPoint.url + 'v2/' +
          'user/feed?page=' +
          this.state.page +
          '&post_type=' +
          this.state.postType +
          '&sort_by=' +
          this.state.sortBy +
          '&q=' +
          this.state.searchText +
          '&post_range=' +
          this.state.post_Date)
        fetch(
          Endpoint.endPoint.url + 'v2/' +
          'user/feed?page=' +
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
          .then(responseJsonAll => {
            console.log('response feed All', responseJsonAll);
            if (responseJsonAll.status == true) {
              this.setState({
                dataSource:
                  page === 1
                    ? responseJsonAll.data
                    : [...this.state.dataSource, ...responseJsonAll.data],
                lastPage: responseJsonAll.meta.last_page,
                loading: false,
                isSearch: false,
              });
            }
            else {
              this.setState({ loading: false })
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }

    else {
      if (this.state.token == "") {
        console.log("Sample Global Feed Data", Endpoint.endPoint.url + Endpoint.endPoint.global_feed + '/linear?per_page=10&page=' +
          this.state.page);
        this.setState({ loading: true })
        this.setState({ isRefreshing: false, });
        const { page } = this.state;
        console.log("Retrive data");
        var headers = new Headers();
        headers.append('Content-Type', "application / json");
        headers.append('Accept', "application / json");
        fetch(Endpoint.endPoint.url + Endpoint.endPoint.global_feed + '/linear?per_page=10&page=' +
          this.state.page, {
          method: 'GET',
          headers: headers,
        })
          .then(response => response.json())
          .then(responseJson => {
            console.log("2nd Global Feed responseJson==>", responseJson);
            this.setState({
              dataSource:
                page === 1
                  ? responseJson.data.data
                  : [...this.state.dataSource, ...responseJson.data.data],
              lastPage: responseJson.data.last_page,
              loading: false,
              isSearch: false,
            });
            // var list = [];
            // responseJson.data.map((singledata) => {
            //   singledata.posts.map((allposts) => {
            //     list.push(allposts);
            //   })
            // })
            // console.log("List Data==>", list);
            // this.setState({
            //   dataSource: list,
            //   loading: false,
            //   isSearch: false,
            // });
          })
          .catch(error => {
            console.log(error);
            this.setState({ loading: false })
          });
      }
      else {
        this.setState({ loading: true })
        this.setState({ isRefreshing: false, });
        const { page } = this.state;
        var headers = new Headers();
        let auth = 'Bearer ' + this.state.token;
        headers.append('Authorization', auth);
        console.log("API user", Endpoint.endPoint.url + 'v2/' +
          'user/feed?page=' +
          this.state.page +
          '&post_type=' +
          this.state.postType +
          '&sort_by=' +
          this.state.sortBy +
          '&q=' +
          this.state.searchText +
          '&post_range=' +
          this.state.post_Date)
        fetch(
          Endpoint.endPoint.url + 'v2/' +
          'user/feed?page=' +
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
            console.log('response feed', responseJsonday);
            if (responseJsonday.status == true) {
              if (responseJsonday.data.length > 0) {

                this.setState({
                  dataSource:
                    page === 1
                      ? responseJsonday.data
                      : [...this.state.dataSource, ...responseJsonday.data],
                  lastPage: responseJsonday.meta.last_page,
                  loading: false,
                  isSearch: false,
                });
              }
              else {
                this.setState({ loading: true, post_Date: 'week' })
                console.log("Week==>");
                this.setState({ isRefreshing: false, });
                const { page } = this.state;
                var headers = new Headers();
                let auth = 'Bearer ' + this.state.token;
                headers.append('Authorization', auth);
                console.log("API user", Endpoint.endPoint.url + 'v2/' +
                  'user/feed?page=' +
                  this.state.page +
                  '&post_type=' +
                  this.state.postType +
                  '&sort_by=' +
                  this.state.sortBy +
                  '&q=' +
                  this.state.searchText +
                  '&post_range=' +
                  this.state.post_Date)
                fetch(
                  Endpoint.endPoint.url + 'v2/' +
                  'user/feed?page=' +
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
                    console.log('response feed week', responseJsonweek);
                    if (responseJsonweek.status == true) {
                      if (responseJsonweek.data.length > 0) {
                        this.setState({
                          dataSource:
                            page === 1
                              ? responseJsonweek.data
                              : [...this.state.dataSource, ...responseJsonweek.data],
                          lastPage: responseJsonweek.meta.last_page,
                          loading: false,
                          isSearch: false,
                        });
                      }
                      else {
                        this.setState({ loading: true, post_Date: 'month' })
                        console.log("Month==>");
                        this.setState({ isRefreshing: false, });
                        const { page } = this.state;
                        var headers = new Headers();
                        let auth = 'Bearer ' + this.state.token;
                        headers.append('Authorization', auth);
                        console.log("API user", Endpoint.endPoint.url + 'v2/' +
                          'user/feed?page=' +
                          this.state.page +
                          '&post_type=' +
                          this.state.postType +
                          '&sort_by=' +
                          this.state.sortBy +
                          '&q=' +
                          this.state.searchText +
                          '&post_range=' +
                          this.state.post_Date)
                        fetch(
                          Endpoint.endPoint.url + 'v2/' +
                          'user/feed?page=' +
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
                            console.log('response feed month', responseJsonmonth);
                            if (responseJsonmonth.status == true) {
                              if (responseJsonmonth.data.length > 0) {
                                this.setState({
                                  dataSource:
                                    page === 1
                                      ? responseJsonmonth.data
                                      : [...this.state.dataSource, ...responseJsonmonth.data],
                                  lastPage: responseJsonmonth.meta.last_page,
                                  loading: false,
                                  isSearch: false,
                                });
                              }
                              else {
                                this.setState({ loading: true, post_Date: 'All' })
                                console.log("All time");
                                this.setState({ isRefreshing: false, });
                                const { page } = this.state;
                                var headers = new Headers();
                                let auth = 'Bearer ' + this.state.token;
                                headers.append('Authorization', auth);
                                console.log("API user", Endpoint.endPoint.url + 'v2/' +
                                  'user/feed?page=' +
                                  this.state.page +
                                  '&post_type=' +
                                  this.state.postType +
                                  '&sort_by=' +
                                  this.state.sortBy +
                                  '&q=' +
                                  this.state.searchText +
                                  '&post_range=' +
                                  this.state.post_Date)
                                fetch(
                                  Endpoint.endPoint.url + 'v2/' +
                                  'user/feed?page=' +
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
                                  .then(responseJsonAll => {
                                    console.log('response feed All', responseJsonAll);
                                    if (responseJsonAll.status == true) {
                                      this.setState({
                                        dataSource:
                                          page === 1
                                            ? responseJsonAll.data
                                            : [...this.state.dataSource, ...responseJsonAll.data],
                                        lastPage: responseJsonAll.meta.last_page,
                                        loading: false,
                                        isSearch: false,
                                      });
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

              this.getChildren();
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
        console.log("Tree", responseJson)

        if (responseJson.data.length > 0) {
          this.setState({
            listSource: JSON.parse(
              JSON.stringify(responseJson.data).replace(
                /\"nodes\":/g,
                '"children":',
              ),
            ),
          });
          this.setState({ loading: false });
          console.log("Tree1", JSON.parse(
            JSON.stringify(responseJson.data).replace(
              /\"nodes\":/g,
              '"children":',
            ),
          ))
        } else {
          alert('Something went wrong');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };


  getInterestWarren = () => {
    const { warrenPage } = this.state;
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    fetch(
      Endpoint.endPoint.url +
      'warren?per_page=20&sort_by=subscribers_count&ordey_by=DESC&page=' +
      warrenPage,
      {
        method: 'GET',
        headers: headers,
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log('responseJson', responseJson);
        // this.setState({ loading: false });
        if (responseJson.data) {
          this.setState({
            dataSourceWarren:
              warrenPage === 1
                ? responseJson.data
                : [...this.state.dataSourceWarren, ...responseJson.data],
            lastWarrenPage: responseJson.meta.last_page,
          });
          console.log('dataSourceWarren', this.state.dataSourceWarren);
        } else {
          alert('Something went wrong');
        }
      })
      .catch(error => {
        console.log(error);
      });
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

  generateArc = (percentage, radius) => {
    if (percentage === 100) percentage = 99.999;
    const a = (percentage * 2 * Math.PI) / 100; // angle (in radian) depends on percentage
    const r = radius; // radius of the circle
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
            this._retrieveData();
          } else {
            Toast.show('Something went wrong', Toast.LONG);
          }
        })
        .catch(error => {
          console.log(error);
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

  onLoadMoreData = () => {
    if (this.state.page <= this.state.lastPage) {
      this.setState(
        {
          page: this.state.page + 1,
          loading: true
        },
        () => {
          this.getFeedsData();
        },
      );
    }
  };


  Scrolloffset = () => {
    this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
    this.timeoutHandle = setTimeout(() => {
      this.state.dataSource = "";
      this.state.page = 1;
      this.getFeedsData();
    }, 500);

  }

  opendrawer = () => {
    if (this.state.token == "") {
      this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
    }
    else {
      this._sideMenuDrawer.open()
    }
  }

  storewelcomedialogue = async () => {
    let welcomedialogue = {
      welcomedialogue: false,
    };
    try {
      await AsyncStorage.setItem('welcomedialogue', JSON.stringify(welcomedialogue));
    }
    catch (error) {
      console.log("Error", error);
    }
  }

  joinow = () => {
    this.setState({ readerdialogue: false, publisherdialogue: false })
    this.props.navigation.navigate('registration');
  }

  moreinfo = () => {
    this.setState({ readerdialogue: false, publisherdialogue: false })
    this.props.navigation.navigate('Aboutus');
  }

  render() {

    this.state.postDate = [
      {
        label: 'Today',
        value: 'day',
        color: '#11075e',
        selected: this.state.post_Date == "day" ? true : false,
        size: height > width ? 20 : 25,
      },
      {
        label: 'This Week',
        value: 'week',
        color: '#11075e',
        selected: this.state.post_Date == "week" ? true : false,
        size: height > width ? 20 : 25,
      },
      {
        label: 'This Month',
        value: 'month',
        color: '#11075e',
        selected: this.state.post_Date == "month" ? true : false,
        size: height > width ? 20 : 25,
      },
      {
        label: 'All Time',
        value: 'All',
        color: '#11075e',
        selected: this.state.post_Date == "All" ? true : false,
        size: height > width ? 20 : 25,
      },
    ]
    const { query } = this.state;
    const listWarrens = this.findWarrens(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    const progressCustomStyles = {
      backgroundColor: this.state.overall_score > 50 ? '#27AE60' : '#ef4655',
      borderRadius: 0,
      borderColor: this.state.overall_score > 50 ? '#27AE60' : '#ef4655',
      borderWidth: 2,
      barEasing: 'sin',
    };
    let size = height > width ? hp('12%') : wp('8%');
    var left = <Left style={{ flex: 0.2 }} />;
    var right = (
      <Right style={{ flex: 0.2 }}>
        <Button onPress={() => { this.opendrawer() }} transparent>
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
          {/* <Navbar left={left} right={right} navigation={this.props} /> */}

          <Header style={{ backgroundColor: '#11075e' }}>
            {left}
            <Body style={{ flex: 1, alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  this.Scrolloffset();
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
            </Body>
            {right}
          </Header>

          {/* Welcome Alert */}
          <Dialog
            dialogStyle={{
              justifyContent: width > height ? 'center' : null,
              alignSelf: width > height ? 'center' : null,
              width: width > height ? wp('60%') : null,
              padding: width > height ? 15 : 0
            }}
            titleStyle={{
              color: '#212121',

              fontSize: height > width ? wp('5.6%') : wp('3.5%'),
            }}
            visible={this.state.welcomedialogue}
            title=""
            onTouchOutside={() => {
              this.setState({ welcomedialogue: false });
            }}
            onRequestClose={() => {
              this.setState({ welcomedialogue: false });
            }}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
              <View>
                <View style={{ marginTop: -5, height: 200, width: width - 47 }}>
                  <Image source={require('../images/Shape.jpg')} style={{ width: '100%', height: "100%", resizeMode: 'stretch' }} />
                </View>
                <View style={{ position: 'absolute', justifyContent: 'center', alignSelf: 'center', marginTop: -10 }}>
                  <Image source={require('../images/logo.png')} style={{ width: 135, height: 135 }} />
                </View>
                <TouchableOpacity onPress={() => { this.setState({ welcomedialogue: false }); }} style={{ position: 'absolute', justifyContent: 'flex-end', alignSelf: 'flex-end', right: 15, top: 10 }}>
                  <FontAwesomeIcon
                    icon={faTimes}
                    color={'white'}
                    size={22}
                  />
                </TouchableOpacity>
              </View>

              <View style={{ marginTop: -20 }}>
                <View style={{ opacity: 0.05 }}>
                  <Image source={require('../images/backlogo.png')} style={{ width: 250, height: 240 }} />
                </View>
                <View style={{ position: 'absolute', zIndex: 1, marginTop: 20, alignSelf: 'center', borderBottomColor: 'black', borderBottomWidth: 2, paddingBottom: 30 }}>
                  <Text style={{ textAlign: 'center', color: '#12075e', fontSize: 20, fontWeight: 'bold' }}>Welcome To BlogsBunny</Text>

                  <View style={{ marginTop: 15 }}>
                    <Text style={{ textAlign: 'center', fontSize: 17, color: 'black' }}>Find out how you can benefit from using our platform.</Text>
                  </View>

                  <View style={{ marginTop: 15 }}>
                    <Text style={{ textAlign: 'center', fontSize: 17, color: 'black' }}>Please select from one of the options below:</Text>
                  </View>
                </View>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { this.setState({ welcomedialogue: false, readerdialogue: true }) }} style={{ flexDirection: 'row', marginRight: 2.5, backgroundColor: '#12075e', borderRadius: 5 }}>
                  <View style={{ marginLeft: 8, alignItems: 'center', justifyContent: 'center' }}>
                    <FontAwesomeIcon
                      icon={faBookReader}
                      color={'white'}
                      size={20}
                    />
                  </View>
                  <View>
                    <Text style={{ padding: 12, color: 'white', fontWeight: 'bold' }}>I am A Reader</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { this.setState({ welcomedialogue: false, publisherdialogue: true }) }} style={{ flexDirection: 'row', marginLeft: 3, borderRadius: 5, borderColor: '#12075e', borderWidth: 2 }}>
                  <View style={{ marginLeft: 8, alignItems: 'center', justifyContent: 'center' }}>
                    <FontAwesomeIcon
                      icon={faShareSquare}
                      color={'#12075e'}
                      size={20}
                    />
                  </View>
                  <View>
                    <Text style={{ padding: 12, color: '#12075e', fontWeight: 'bold' }}>I am A Publisher</Text>
                  </View>
                </TouchableOpacity>

              </View>
            </View>
          </Dialog>

          {/* Reader Dialogue */}

          <Dialog
            dialogStyle={{
              justifyContent: width > height ? 'center' : null,
              alignSelf: width > height ? 'center' : null,
              width: width > height ? wp('60%') : null,
              padding: width > height ? 15 : 0
            }}
            titleStyle={{
              color: '#212121',

              fontSize: height > width ? wp('5.6%') : wp('3.5%'),
            }}
            visible={this.state.readerdialogue}
            title=""
            onTouchOutside={() => {
              this.setState({ readerdialogue: false });
            }}
            onRequestClose={() => {
              this.setState({ readerdialogue: false });
            }}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
              <View>
                <View style={{ marginTop: -5, height: 200, width: width - 47 }}>
                  <Image source={require('../images/Shape.jpg')} style={{ width: '100%', height: "100%", resizeMode: 'stretch' }} />
                </View>
                <View style={{ position: 'absolute', justifyContent: 'center', alignSelf: 'center', marginTop: -10 }}>
                  <Image source={require('../images/logo.png')} style={{ width: 135, height: 135 }} />
                </View>

                <TouchableOpacity onPress={() => { this.setState({ readerdialogue: false }); }} style={{ position: 'absolute', justifyContent: 'flex-end', alignSelf: 'flex-end', right: 15, top: 10 }}>
                  <FontAwesomeIcon
                    icon={faTimes}
                    color={'white'}
                    size={22}
                  />
                </TouchableOpacity>
              </View>

              <View style={{ marginTop: -20 }}>
                <View style={{ opacity: 0.05 }}>
                  <Image source={require('../images/backlogo.png')} style={{ width: 250, height: 300 }} />
                </View>
                <View style={{ position: 'absolute', zIndex: 1, marginTop: 20, alignSelf: 'center', paddingBottom: 30 }}>
                  <Text style={{ textAlign: 'center', color: '#12075e', fontSize: 20, fontWeight: 'bold' }}>Welcome To BlogsBunny</Text>
                </View>
                <View style={{ position: 'absolute', zIndex: 1, marginTop: 60, alignSelf: 'center', borderBottomColor: 'black', borderBottomWidth: 2, paddingBottom: 10 }}>
                  <Text style={{ textAlign: 'justify', fontSize: 17, color: 'black' }}>Our main objective is to allow you as a reader to be able to find and collate great quality blogs, articles and media from around the world in one place. We rank each article via our unique algorithms to ensure you receive the best quality content from almost any niche that you are interested in.</Text>
                </View>


              </View>

              <View style={{ flexDirection: 'row', marginTop: 10, width: width - 96, justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => { this.moreinfo() }} style={{ marginRight: 2.5, backgroundColor: '#007bff', borderRadius: 5, width: width * 0.35 }}>
                  <View>
                    <Text style={{ padding: 12, color: 'white', fontWeight: 'bold', textAlign: 'center' }}>More Info</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { this.joinow() }} style={{ marginLeft: 3, borderRadius: 5, backgroundColor: '#1e7e34', width: width * 0.35 }}>
                  <View>
                    <Text style={{ padding: 12, color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Join Now</Text>
                  </View>
                </TouchableOpacity>

              </View>
            </View>
          </Dialog>

          {/* Publisher Dialogue */}

          <Dialog
            dialogStyle={{
              justifyContent: width > height ? 'center' : null,
              alignSelf: width > height ? 'center' : null,
              width: width > height ? wp('60%') : null,
              padding: width > height ? 15 : 0
            }}
            titleStyle={{
              color: '#212121',

              fontSize: height > width ? wp('5.6%') : wp('3.5%'),
            }}
            visible={this.state.publisherdialogue}
            title=""
            onTouchOutside={() => {
              this.setState({ publisherdialogue: false });
            }}
            onRequestClose={() => {
              this.setState({ publisherdialogue: false });
            }}>
            <View style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
              <View>
                <View style={{ marginTop: -5, height: 200, width: width - 47 }}>
                  <Image source={require('../images/Shape.jpg')} style={{ width: '100%', height: "100%", resizeMode: 'stretch' }} />
                </View>
                <View style={{ position: 'absolute', justifyContent: 'center', alignSelf: 'center', marginTop: -10 }}>
                  <Image source={require('../images/logo.png')} style={{ width: 135, height: 135 }} />
                </View>

                <TouchableOpacity onPress={() => { this.setState({ publisherdialogue: false }); }} style={{ position: 'absolute', justifyContent: 'flex-end', alignSelf: 'flex-end', right: 15, top: 10 }}>
                  <FontAwesomeIcon
                    icon={faTimes}
                    color={'white'}
                    size={22}
                  />
                </TouchableOpacity>
              </View>

              <View style={{ marginTop: -20 }}>
                <View style={{ opacity: 0.05 }}>
                  <Image source={require('../images/backlogo.png')} style={{ width: 250, height: 240 }} />
                </View>
                <View style={{ position: 'absolute', zIndex: 1, marginTop: 20, alignSelf: 'center', paddingBottom: 30 }}>
                  <Text style={{ textAlign: 'center', color: '#12075e', fontSize: 20, fontWeight: 'bold' }}>Welcome To BlogsBunny</Text>
                </View>
                <View style={{ position: 'absolute', zIndex: 1, marginTop: 60, alignSelf: 'center', borderBottomColor: 'black', borderBottomWidth: 2, paddingBottom: 30 }}>
                  <Text style={{ textAlign: 'justify', fontSize: 17, color: 'black' }}>Our main objective is to allow you as a publisher to be able to showcase your high-quality blog/media content via our unique algorithms. The higher the score your content receives, the higher up the page your article will feature.</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 40, width: width - 96, justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => { this.moreinfo() }} style={{ marginRight: 2.5, backgroundColor: '#007bff', borderRadius: 5, width: width * 0.35 }}>
                  <View>
                    <Text style={{ padding: 12, color: 'white', fontWeight: 'bold', textAlign: 'center' }}>More Info</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { this.joinow() }} style={{ marginLeft: 3, borderRadius: 5, backgroundColor: '#1e7e34', width: width * 0.35 }}>
                  <View>
                    <Text style={{ padding: 12, color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Join Now</Text>
                  </View>
                </TouchableOpacity>

              </View>
            </View>
          </Dialog>

          {/*Login Alert  */}

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
          {/* <Modal isVisible={this.state.voteloginmodal}>
            <View style={{ backgroundColor: 'white', height: hp('28%') }}>
              <View style={{ margin: 20 }}>
                <Text style={{ fontSize: hp('2.8%'), color: '#212121' }}>Sign In</Text>
                <Text style={{ fontSize: hp('2.3%'), marginTop: 10, lineHeight: hp('4%'), color: '#757575' }}>Do you want to Submit the Vote? {'\n'}Then you have to login first!</Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity onPress={() => { this.setState({ voteloginmodal: false }) }} style={{ justifyContent: 'center', marginRight: wp('5%') }}>
                  <Text style={{ color: '#11075e', fontSize: hp('2.3%') }}>Not Now</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { this.login() }} style={{ backgroundColor: '#11075e', marginRight: wp('8%'), borderRadius: 5, paddingHorizontal: 8 }}>
                  <Text style={{ color: 'white', padding: 10, fontSize: hp('2.3%') }}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal> */}

          <View style={{ backgroundColor: '#5848cf' }}>
            <FlatList
              horizontal={true}
              data={this.state.warrendata}
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
                      // if (this.state.token == "") {
                      //   this.setState({ addNewPost: false, loginmodal: true, logintext: 'Please login or register to use this feature.' })
                      // } else {
                      this.warrensclicked(item);
                      // }
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

          {this.state.loading == true ? (
            <View style={styles.spinner}>
              <Bars size={25} color="#11075e" />
            </View>
          ) : null}
          <KeyboardAvoidingView behavior={'padding'}>
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
                    renderNode={({
                      node,
                      level,
                      isExpanded,
                      hasChildrenNodes,
                    }) => {
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
                                {this.getIndicator(
                                  isExpanded,
                                  hasChildrenNodes,
                                )}
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
                                {this.getIndicator(
                                  isExpanded,
                                  hasChildrenNodes,
                                )}
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

            {/* add */}
            <Dialog
              dialogStyle={{
                width: '80%',
                alignSelf: 'center',
              }}
              onTouchOutside={() => {
                this.setState({ showbtn: false });
              }}
              onRequestClose={() => {
                this.setState({ showbtn: false });
              }}
              visible={this.state.showbtn}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    borderBottomColor: 'lightgrey',
                    borderBottomWidth: 1,
                    paddingBottom: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: height > width ? wp('5%') : wp('2.5%'),
                      fontWeight: 'bold',
                    }}>
                    {this.state.warrens} Category
                  </Text>
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
              onTouchOutside={() =>
                this.setState({ addNewPost: false, warren_id: '', query: '' })
              }
              onRequestClose={() => {
                this.setState({ addNewPost: false, warren_id: '', query: '' });
              }}>
              <View>
                {this.state.newloading == true ? (
                  <View style={styles.spinner}>
                    <Bars size={25} color="#11075e" />
                  </View>
                ) : null}
                <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
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
                            postTitle: '',
                            query: '',
                            warren_id: '',
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
                            query: '',
                            warren_id: '',
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
                            query: '',
                            warren_id: '',
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
                      <Autocomplete
                        style={styles.inputtype_dialogauto}
                        autoCapitalize="none"
                        autoCorrect={false}
                        containerStyle={styles.autocompleteContainer}
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
                        renderItem={({ item }) => {
                          return (
                            <TouchableOpacity
                              onPress={() =>
                                this.setState({
                                  query: item.name,
                                  warren_id: item.id,
                                })
                              }>
                              <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.itemText}>
                                  {item.name.split("").map((x, ind) => {
                                    console.log("Logged 2 : " + x);
                                    return (
                                      <Text style={{ color: query.length > 1 ? query.toLowerCase().includes(x.toLowerCase()) ? '#1E8449' : 'grey' : x == query ? '#1E8449' : 'grey' }}>{x + ""}</Text>
                                    )
                                  })}
                                </Text>
                                <View
                                  style={{
                                    borderBottomColor: 'grey',
                                    borderBottomWidth: 1,
                                  }}
                                />
                              </View>

                            </TouchableOpacity>
                          );
                        }}
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

                      <Autocomplete
                        style={styles.inputtype_dialogauto}
                        autoCapitalize="none"
                        autoCorrect={false}
                        containerStyle={styles.autocompleteContainer}
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
                        renderItem={({ item }) => {
                          return (
                            <TouchableOpacity
                              onPress={() =>
                                this.setState({
                                  query: item.name,
                                  warren_id: item.id,
                                })
                              }>
                              <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.itemText}>
                                  {item.name.split("").map((x, ind) => {
                                    console.log("Logged 2 : " + x);
                                    return (
                                      <Text style={{ color: query.length > 1 ? query.toLowerCase().includes(x.toLowerCase()) ? '#1E8449' : 'grey' : x == query ? '#1E8449' : 'grey' }}>{x + ""}</Text>
                                    )
                                  })}
                                </Text>
                                <View
                                  style={{
                                    borderBottomColor: 'grey',
                                    borderBottomWidth: 1,
                                  }}
                                />
                              </View>

                            </TouchableOpacity>
                          );
                        }}
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
                            Upload Image(Required)
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
                      <Autocomplete
                        style={styles.inputtype_dialogauto}
                        autoCapitalize="none"
                        autoCorrect={false}
                        containerStyle={styles.autocompleteContainer}
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
                        renderItem={({ item }) => {
                          return (
                            <TouchableOpacity
                              onPress={() =>
                                this.setState({
                                  query: item.name,
                                  warren_id: item.id,
                                })
                              }>
                              <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.itemText}>
                                  {item.name.split("").map((x, ind) => {
                                    console.log("Logged 2 : " + x);
                                    return (
                                      <Text style={{ color: query.length > 1 ? query.toLowerCase().includes(x.toLowerCase()) ? '#1E8449' : 'grey' : x == query ? '#1E8449' : 'grey' }}>{x + ""}</Text>
                                    )
                                  })}
                                </Text>
                                <View
                                  style={{
                                    borderBottomColor: 'grey',
                                    borderBottomWidth: 1,
                                  }}
                                />
                              </View>
                            </TouchableOpacity>
                          );
                        }}
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
                          warren_id: '',
                          query: '',
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
                        } else {
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
                              fontSize:
                                height > width ? wp('2.9%') : wp('2%'),
                            }}>
                            Grammar
                            </Text>
                          <Text
                            style={{
                              textAlign: 'center',
                              fontSize:
                                height > width ? wp('2.9%') : wp('2%'),
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
                              fontSize:
                                height > width ? wp('2.9%') : wp('2%'),
                            }}>
                            Readability
                            </Text>
                          <Text
                            style={{
                              textAlign: 'center',
                              fontSize:
                                height > width ? wp('2.9%') : wp('2%'),
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
                              fontSize:
                                height > width ? wp('2.9%') : wp('2%'),
                            }}>
                            Heat
                            </Text>
                          <Text
                            style={{
                              textAlign: 'center',
                              fontSize:
                                height > width ? wp('2.9%') : wp('2%'),
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
                            justifyContent: 'center'
                          }}>
                          <Text
                            style={{
                              fontSize:
                                height > width ? wp('3%') : wp('1.8%'),
                              fontWeight: 'bold',
                              textAlign: 'center',
                              marginTop: 20,
                            }}>
                            Uniqueness
                            </Text>
                          <Text
                            style={{
                              fontSize:
                                height > width ? wp('3.0%') : wp('2%'),
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
                          dashedBackground={{ width: height > width ? wp('2.8%') : wp('1.8%'), gap: 5 }}>
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

                {/* <View style={{ flexDirection: 'row' }}> */}
                {/* <View
                      style={{
                        // justifyContent: 'center',
                        // alignContent: 'center',
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
                              parseInt(this.state.grammer_score),
                              height > width ? half : size,
                            )} Z`}
                          fill={
                            parseInt(this.state.grammer_score) > 50
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
                          {this.state.grammer_score + '%'}
                        </TextSvg>
                      </Svg>

                      <Text
                        style={{
                          fontSize: height > width ? wp('3%') : wp('1.8%'),
                          fontWeight: 'bold',
                        }}>
                        Grammar
                      </Text>
                    </View> */}

                {/* <View
                      style={{
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        flex: height > width ? 0.36 : 0.4,
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
                              parseInt(this.state.readability_score),
                              height > width ? half : size,
                            )} Z`}
                          fill={
                            parseInt(this.state.readability_score) > 50
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
                          {this.state.readability_score + '%'}
                        </TextSvg>
                      </Svg>
                      <Text
                        style={{
                          fontSize: height > width ? wp('3%') : wp('1.8%'),
                          fontWeight: 'bold',
                        }}>
                        Readability
                      </Text>
                    </View> */}

                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: height > width ? 15 : 0,
                  }}>
                  <ProgressBarAnimated
                    {...progressCustomStyles}
                    width={height > width ? wp('70%') : wp('85%')}
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
              onTouchOutside={() => this.setState({ reportPost: false })}
              onRequestClose={() => {
                this.setState({ reportPost: false });
              }}>
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
          </KeyboardAvoidingView>
          <Modal
            animationType={'slide'}
            transparent={true}
            visible={this.state.modalVisible}>
            <View style={styles.ftreContainer}>
              <View
                style={{
                  marginVertical: 5,
                  alignItems: 'center',
                  borderBottomColor: 'lightgrey',
                  borderBottomWidth: 1,
                }}>
                <Text
                  style={{ fontSize: 20, color: '#11075e', paddingVertical: 5 }}>
                  Follow interesting warrens!
                </Text>
              </View>
              <FlatList
                data={this.state.dataSourceWarren}
                showsHorizontalScrollIndicator={false}
                showsVerticleScrollIndicator={false}
                extraData={this.state}
                bounces={false}
                renderItem={({ item, index }) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      padding: 10,
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <View style={{ flex: 0.6 }}>
                      <Text
                        style={{
                          fontSize: height > width ? wp('3.5%') : wp('2%'),
                        }}
                        ellipsizeMode="tail">
                        {item.name.includes('&amp;')
                          ? item.name.replace('&amp;', '&')
                          : item.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 0.4,
                      }}>
                      {item.is_subscribed == true ? (
                        <TouchableOpacity
                          style={styles.followBtnCss}
                          onPress={() => {
                            this.changeStatus(item.id);
                          }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              color: 'white',
                              fontSize: height > width ? wp('4%') : wp('1.8%'),
                            }}>
                            Following
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.unfollowBtnCss}
                          onPress={() => {
                            this.changeStatus(item.id);
                          }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              color: 'white',
                              fontSize: height > width ? wp('4%') : wp('1.8%'),
                            }}>
                            Follow
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
                keyExtractor={({ id }, index) => id}
              />
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginVertical: 20,
                }}
                onPress={() => {
                  this.seeMore();
                }}>
                <Text
                  style={{
                    color: '#2f889a',
                    fontSize: Device.isPhone
                      ? wp('4%')
                      : Device.isTablet
                        ? wp('2%')
                        : null,
                    textAlign: 'center',
                    textDecorationLine: 'underline',
                    marginLeft: 5,
                  }}>
                  see more
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setModalVisible(false);
                  this._retrieveData();
                }}>
                <View
                  style={{
                    backgroundColor: '#11075e',
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{ color: 'white', fontSize: 18 }}>Close</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
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
          <View
            style={{
              flexDirection: 'row',
              margin: 5,
              justifyContent: 'center',
            }}>
            {this.state.token == "" ?
              null :
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
                  this.setState({ isVisible: true });
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
            }
            <TouchableOpacity
              style={{
                flex: this.state.token == "" ? 1 : 0.6,
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
                if (this.state.token == "") {
                  // this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
                  this.props.navigation.navigate("warren")
                }
                else {
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
            {this.state.token == "" ?
              null :
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
                      color={'white'}
                      size={height > width ? wp('5.5%') : wp('3%')}
                    />
                  </View>
                )}
              </TouchableOpacity>
            }
          </View>
          {this.state.dataSource != '' ? (
            <FlatList
              ref={(ref) => { this.flatListRef = ref; }}
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
              // ListEmptyComponent={this.ListEmpty}
              extraData={this.state}
              onEndReached={() => this.onLoadMoreData()}
              onEndReachedThreshold={0.01}
              bounces={false}
              renderItem={({ item,index }) => {
                console.log("ITEM PRO==>", item);
                if(item.post_type == 'video'){
                  var videolink = item.link.split("=").pop();
                  if (this.videolinkarr.includes(videolink)) {
                  } else {
                    this.videolinkarr.push(videolink)
                  }    
                  console.log("videolinkarr==>", this.videolinkarr);
                }
              
                return (
                  <Card containerStyle={styles.card_style}>
                    <View>
                    {item.post_type == 'video' ?
            <YoutubePlayer
            style={{
              maxHeight: height > width ? hp('21%') : hp('30%'),
            }}
            
                              height={hp('28%')}
                              play={false}
                              videoId={this.videolinkarr[index]}
                            // onChangeState={onStateChange}
                            /> :
                      <TouchableOpacity
                        style={{
                          maxHeight: height > width ? hp('21%') : hp('30%'),
                        }}
                        onPress={() => {
                          this.openPost1(item);
                        }}>
                        <Image
                          style={{
                            width: '100%',
                            height: '100%',
                            borderTopRightRadius: 5,
                            borderTopLeftRadius: 5,
                          }}
                          // source={{ uri: item.image }}
                          source={
                            item.image == null ?
                              require('../images/emptyImg.png')
                              :
                              { uri: item.image }
                          }
                          resizeMode="cover"
                        />
                      </TouchableOpacity>}
                    </View>
                    <TouchableOpacity
                       onPress={() => {
                         if(item.post_type == 'video'){
                          this.openPost1(item);
                         }
                      }}
                      activeOpacity={item.post_type == 'video' ? 0.7 : 1}
                      style={{
                        paddingHorizontal: 10,
                        paddingTop: 10
                      }}
                      
                      >
                      <View style={{}}>
                        <TouchableOpacity
                          onPress={() => {
                            this.openPost1(item);
                          }}>
                          <Text
                            style={{
                              color: '#11075e',
                              fontWeight: 'bold',
                              fontSize: height > width ? wp('3.5%') : wp('1.8%'),
                            }}
                            ellipsizeMode="tail"
                            numberOfLines={2}>
                            {item.title}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {this.state.postType == 'link' || item.post_type == 'video' ? (
                        <View>
                          {item.link != undefined ?
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
                              {item.link != null ?
                                <Text
                                  style={{
                                    color: 'grey',
                                    fontSize: height > width ? wp('3%') : wp('1.2%'),
                                    fontWeight: 'bold',
                                  }}
                                  ellipsizeMode="tail"
                                  numberOfLines={1}>

                                  {item.link.split('/')[2]}

                                </Text> : null}
                            </TouchableOpacity>
                            : null}
                        </View>
                      ) : null}
                      <View
                        style={{
                          marginBottom: 0,
                          marginVertical: 2,
                          flexWrap: 'wrap',
                          flexDirection: 'row',
                        }}>
                        {item.user != undefined ?
                          <View
                            style={{
                              alignItems: 'center',
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
                                  fontWeight: 'bold',
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

                            <Text
                              style={{
                                color: 'grey',
                                marginHorizontal: 10,
                              }}>
                              |
                        </Text>
                            <Text
                              style={{
                                fontSize: height > width ? wp('3%') : wp('1.2%'),
                                fontWeight: 'bold',
                                color: '#11075e',
                              }}>
                              {item.warrens && item.warrens[0].name.includes('&amp;')
                                ? item.warrens[0].name.replace('&amp;', '&')
                                : item.warrens && item.warrens[0].name}
                            </Text>
                          </View> : null}
                      </View>
                      {item.text && item.text != '' && item.text != null ?
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
                        </View> : null}
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
                              {item.votestatus && item.votestatus != undefined && item.votestatus.length > 0 &&
                                item.votestatus[0].value == -1 ? (
                                <TouchableOpacity
                                  onPress={() => {
                                    this.submitVote(0, item.id);
                                  }}>
                                  <FontAwesomeIcon
                                    icon={faMinus}
                                    color={'#f6110e'}
                                    size={height > width ? wp('5%') : wp('2.5%')}
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
                                    size={height > width ? wp('5%') : wp('2.5%')}
                                  />
                                </TouchableOpacity>
                              )}
                              <View style={{ marginHorizontal: 5 }}>
                                <View style={{ flexDirection: 'row' }}>
                                  <Text
                                    style={{
                                      marginLeft: 5,
                                      fontSize:
                                        height > width ? wp('3.5%') : wp('1.5%'),
                                    }}>
                                    {item.upvotes_count - item.downvotes_count}
                                  </Text>
                                  <Image
                                    source={require('../images/oval.png')}
                                    style={{ height: 10, width: 10 }}
                                  />
                                </View>
                              </View>

                              {item.votestatus && item.votestatus != undefined && item.votestatus.length > 0 &&
                                item.votestatus[0].value == 1 ? (
                                <TouchableOpacity
                                  onPress={() => {
                                    this.submitVote(1, item.id);
                                  }}>
                                  <FontAwesomeIcon
                                    icon={faPlus}
                                    color={'#04c60e'}
                                    size={height > width ? wp('5%') : wp('2.5%')}
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
                                    size={height > width ? wp('5%') : wp('2.5%')}
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
                                this.openPost1(item);
                              }}>
                              <FontAwesomeIcon
                                icon={faCommentAlt}
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
                              <Text
                                style={{
                                  marginRight: 5,
                                  fontSize:
                                    height > width ? wp('3.5%') : wp('1.5%'),
                                }}>
                                Overall score
                            </Text>
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
                              paddingHorizontal: 10,
                              paddingVertical: 5,
                              borderRadius: 5,
                              elevation: 2,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                              }}>
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
                                {/* {item.warrens[0].name} */}
                                {item.warrens && item.warrens != undefined && item.warrens[0].name.length < 12
                                  ? `${" " + item.warrens && item.warrens[0].name}`
                                  : `${" " + item.warrens && item.warrens[0].name.substring(0, 10)}...`}
                              </Text>
                            </View>
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
                            justifyContent:
                              height > width ? 'space-between' : 'space-around',
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
                              {item.votestatus && item.votestatus != undefined && item.votestatus.length > 0 &&
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
                                        height > width ? wp('3.5%') : wp('1.5%'),
                                    }}>

                                    {item.upvotes_count != undefined ? item.upvotes_count - item.downvotes_count : 0}
                                  </Text>
                                  <Image
                                    source={require('../images/oval.png')}
                                    style={{ height: 10, width: 10 }}
                                  />
                                </View>
                              </View>

                              {item.votestatus && item.votestatus != undefined && item.votestatus.length > 0 &&
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
                                this.openPost1(item);
                              }}>
                              <FontAwesomeIcon
                                icon={faCommentAlt}
                                color={'#afaaaa'}
                                size={height > width ? wp('5%') : wp('2.5%')}
                                style={{ marginRight: 5 }}
                              />
                              {item.post_type == 'link' || item.post_type == 'video' ? (
                                <Text
                                  style={{
                                    marginLeft: 5,
                                    fontSize:
                                      height > width ? wp('3.5%') : wp('1.5%'),
                                  }}>
                                  {item.actual_comments_count}
                                </Text>
                              ) : item.post_type == 'text' ||
                                item.post_type == 'image' ? (
                                <Text
                                  style={{
                                    marginLeft: 5,
                                    fontSize:
                                      height > width ? wp('3.5%') : wp('1.5%'),
                                  }}>
                                  {item.actual_comments_count} comments
                                </Text>
                              ) : null}
                            </TouchableOpacity>
                          </View>
                          {item.post_type == 'link' || item.post_type == 'video' ? (
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
                                  size={height > width ? wp('5%') : wp('2.5%')}
                                  style={{ marginRight: 5 }}
                                />

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
                          ) : null}
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
                                // this.reportPost(item.id);
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
                )
              }
              }
              keyExtractor={({ id }, index) => id}
            />
          ) :
            <View style={{ marginTop: height > width ? width * 0.5 : width * 0.15, alignSelf: 'center' }}>
              <Image
                style={{ alignSelf: 'center', width: height > width ? width * 0.14 : width * 0.08, height: height > width ? width * 0.14 : width * 0.08 }}
                source={require('../images/post.png')} />
              <Text style={{ color: '#11075e', marginTop: 5, fontWeight: 'bold', fontSize: height > width ? hp("2%") : hp('3.3%') }}>No Posts Yet</Text>
            </View>
          }
          <TouchableOpacity
            style={styles.float_btn}
            onPress={() => {
              // if (this.state.token == "") {
              //   this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
              // } else {
              this.setState({ addNewPost: true });
              // }
            }}>
            <FontAwesomeIcon
              icon={faPlus}
              color={'white'}
              size={height > width ? wp('6.5%') : wp('2.5%')}
            />
          </TouchableOpacity>
        </View>
      </SideMenuDrawer >
    );
  }
}
const Device = require('react-native-device-detection');
// var { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  autocompleteContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 0,
  },
  itemText: {
    fontSize: height > width ? wp('4.5%') : wp('1.8%'),
    paddingTop: 5,
    paddingBottom: 5,
    margin: 2,
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
  followBtnCss: {
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: 'green',
    borderRadius: 5,
  },
  unfollowBtnCss: {
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  CancelReportPost: {
    borderRadius: 5,
    backgroundColor: 'white',
    padding: 10,
    paddingLeft: 25,
    paddingRight: 25,
    margin: 5,
  },
  float_btn: {
    backgroundColor: '#11075e',
    padding: 20,
    borderRadius: 75,
    position: 'absolute',
    bottom: 15,
    right: 25,
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
    marginTop: 20,
    // textAlignVertical: 'top',
    color: 'black',
    flexWrap: 'wrap',
    fontSize: Device.isPhone ? wp('4.5%') : Device.isTablet ? wp('2.5%') : null,
  },
  inputtype_dialogauto: {
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 1,
    // paddingLeft: 10,
    // paddingVertical: 10,
    // marginTop: 20,
    // textAlignVertical: 'top',
    color: 'black',
    flexWrap: 'wrap',
    fontSize: Device.isPhone ? wp('4.5%') : Device.isTablet ? wp('2.5%') : null,
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
  ftreContainer: {
    backgroundColor: '#e5e5f9',
    flex: 1,
    borderRadius: 5,
    padding: 10,
  },
  ftreTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  ftreDescription: {
    color: 'white',
    fontSize: 15,
    marginRight: 20,
    marginLeft: 20,
  },
  ftreCloseIcon: {
    alignSelf: 'flex-end',
    flex: 0.5,
    marginRight: 10,
  },
  ftreTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ftreDescriptionContainer: {
    flex: 6.5,
  },
  ftreExitContainer: {
    flex: 2,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  ftreExitButtonContainer: {
    width: 200,
    height: 40,
    backgroundColor: 'red',
    borderRadius: 10,
    justifyContent: 'center',
  },
  ftreExitButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inner: {
    width: '100%',
    height: 30,
    // borderRadius: 15,
    backgroundColor: 'green',
  },
  inputContainer: {
    display: "flex",
    flexShrink: 0,
    flexGrow: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingLeft: 5,
    // paddingRight: "5%"

    width: wp('65%'),
    textAlignVertical: 'top',
    color: 'black',
    fontSize: height > width ? wp('3.8%') : wp('2%'),
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
