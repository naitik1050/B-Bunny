import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Linking,
  Share,
  Alert, Clipboard
} from 'react-native';
import Image from 'react-native-remote-svg';
import { SelectMultipleButton } from 'react-native-selectmultiple-button';
import Modal from 'react-native-modal';
import {
  faPlus,
  faFileAlt,
  faExternalLinkAlt,
  faMinus,
  faBookmark as BookmarkSolid,
  faShare,
  faEllipsisV,
  faTag,
  faChartBar,
  faArrowLeft,
  faAngleDown,
  faAngleUp,
  faCarrot,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import { faBookmark as BookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import RadioGroup from 'react-native-radio-buttons-group';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import SideMenuDrawer from '../component/SideMenuDrawer';
import Navbar from '../component/NavBar';
import { Button, Left, Right } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { Card } from 'react-native-elements';
import { Dialog } from 'react-native-simple-dialogs';
import { Bars } from 'react-native-loader';
import Toast from 'react-native-simple-toast';
import { NavigationEvents } from 'react-navigation';
import HTML from 'react-native-render-html';
import Endpoint from '../res/url_endpoint';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import YoutubePlayer from "react-native-youtube-iframe";


const awardData = [1, 2, 3, 5, 7];
library.add(BookmarkSolid, BookmarkRegular);
export default class SinglePost extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      userID: '',
      votestatus_length: '',
      votestatus_value: '',
      userDetail: '',
      token: '',
      user_id: '',
      loading: false,
      postID: '',
      Slug: "",
      id: "",
      dataSource: [],
      postLink: '',
      postText: '',
      time_ago: '',
      warrenName: '',
      allComments: [],
      commentValue: '',
      childComment: [],
      replyComment: false,
      replyPostId: '',
      editComment: false,
      showbtn: false,
      reportPost: false,
      edit_value: '',
      editPostId: '',
      reply_comment: '',
      edit_comment: '',
      comment: '',
      post: '',
      bookmark: false,
      domain_id: '',
      commentAwardVisible: false,
      postAwardVisible: false,
      commentAwardSelectedData: '',
      postAwardSelectedData: '',
      percentageReport: false,
      billing_type: '',
      loginmodal: false,
      logintext: "",
      Opennotification: false,
      Videolink:'',

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
    };
    this._retrieveData();
    this.commentLike = this.commentLike.bind(this);
    // this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  page_reloaded = () => {
    // console.log('page');
    this.setState({ loading: true });
    this._retrieveData();
    this.componentDidMount();
  };

  login = () => {
    this.setState({ dataSource: '', loginmodal: false });
    this.props.navigation.navigate('login');
  }

  register = () => {
    this.setState({ dataSource: '', loginmodal: false });
    this.props.navigation.navigate('registration');
  }

  componentDidMount() {
    const { navigation } = this.props;
    const Slug = navigation.getParam('Slug');
    const id = navigation.getParam('id');
    const Opennotification = navigation.getParam('Opennotification');

    this.setState({ Slug: Slug, id: id, Opennotification: Opennotification })
    if (this.state.token == "") {
      this.setState({ billing_type: 'Free' })
    }
  }

  onPress = reportData => this.setState({ reportData });

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('visited_onces');
      if (value !== null) {
        const valueRecieve = JSON.parse(value);
        this.setState({ loading: true });
        this.setState({
          user_id: valueRecieve.user_id,
          token: valueRecieve.token,
          billing_type: valueRecieve.billing_type,
        });
        console.log('valueRecieve =', valueRecieve);
        this.getPostDetail();
      } else if (this.state.token == "") {
        this.getPostDetail();
      } else {
        Toast.show('No Data Found!', Toast.LONG);
      }
    } catch (error) {
      alert(error);
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

  blockDomainAlert = id => {
    if (this.state.token == "") {
      this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
    } else {
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
          this.props.navigation.goBack();
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
    }
  };

  shareMessage = (slug, title) => {
    if (this.state.token == "") {
      this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
    } else {
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

  commentLike = (commentID, likeStatus) => {
    if (this.state.token == "") {
      this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
    } else {
      console.log(commentID);
      console.log(likeStatus);
      this.setState({ loading: true });
      var headers = new Headers();
      let auth = 'Bearer ' + this.state.token;
      headers.append('Authorization', auth);
      // console.log(headers);
      var data = new FormData();
      data.append('comment_id', commentID);
      data.append('vote_type', likeStatus);
      console.log(data);
      fetch(Endpoint.endPoint.url + Endpoint.endPoint.voteComment, {
        method: 'POST',
        headers: headers,
        body: data,
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log('getPostDetail', responseJson);
          this.setState({ loading: false });
          this.getPostDetail();
          if (likeStatus == 1) {
            Toast.show('Vote added successfully', Toast.SHORT);
          } else {
            Toast.show('Vote deleted successfully', Toast.SHORT);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  getPostDetail = () => {
    console.log("SLUG", this.state.Slug);
    console.log("Opennotification Single==>", Endpoint.endPoint.url +
      Endpoint.endPoint.post_slug +
      '/' +
      this.state.Slug + '?source=Notification');

    if (this.state.Opennotification == true) {
      var headers = new Headers();
      let auth = 'Bearer ' + this.state.token;
      headers.append('Authorization', auth);
      fetch(
        Endpoint.endPoint.url +
        Endpoint.endPoint.post_slug +
        '/' +
        this.state.Slug + '?source=Notification',
        {
          method: 'GET',
          headers: headers,
        },
      )
        .then(response => response.json())
        .then(responseJson => {
          console.log("notify dataok", responseJson)
          this.setState({ loading: false });
          if (responseJson.status == true) {
            console.log("Final Link==>",responseJson.data.link.split("=").pop());
            this.setState({
              Videolink:responseJson.data.link.split("=").pop(),
              dataSource: responseJson.data,
              postID: responseJson.data.id,
              bookmark: responseJson.data.bookmarked,
              domain_id: responseJson.data.domain_id,
              userName: responseJson.data.user.name,
              userID: responseJson.data.user.id,
              warrenName: responseJson.data.warrens[0].name,
              votestatus_length: responseJson.data.votestatus.length,
              votestatus_value:
                responseJson.data.votestatus.length > 0
                  ? responseJson.data.votestatus[0].value
                  : 0,
            });

          
            

            

            this.getAllParentsComments();
          } else if (responseJson.status == false) {
            Toast.show(responseJson.msg, Toast.LONG);
          } else {
            alert('Something went wrong');
          }
        })
        .catch(error => {
          console.log("Error", error);
        });
    } else {
      var headers = new Headers();
      let auth = 'Bearer ' + this.state.token;
      headers.append('Authorization', auth);
      fetch(
        Endpoint.endPoint.url +
        Endpoint.endPoint.post_slug +
        '/' +
        this.state.Slug,
        {
          method: 'GET',
          headers: headers,
        },
      )
        .then(response => response.json())
        .then(responseJson => {
          console.log("dataok", responseJson)
          this.setState({ loading: false });
          if (responseJson.status == true) {
            console.log("Final Link==>",responseJson.data.link.split("=").pop());
            this.setState({
              Videolink:responseJson.data.link.split("=").pop(),
              dataSource: responseJson.data,
              postID: responseJson.data.id,
              bookmark: responseJson.data.bookmarked,
              domain_id: responseJson.data.domain_id,
              userName: responseJson.data.user.name,
              userID: responseJson.data.user.id,
              warrenName: responseJson.data.warrens[0].name,
              votestatus_length: responseJson.data.votestatus.length,
              votestatus_value:
                responseJson.data.votestatus.length > 0
                  ? responseJson.data.votestatus[0].value
                  : 0,
            });
            this.getAllParentsComments();
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

  getAllParentsComments = () => {
    console.log('data', this.state.dataSource);
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    console.log(headers);
    // var data = new FormData();
    // data.append('post_id', this.state.postID);
    console.log(
      Endpoint.endPoint.url + 'comment/' + this.state.postID + '/post',
    );
    fetch(Endpoint.endPoint.url + 'comment/' + this.state.postID + '/post', {
      method: 'GET',
      headers: headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('item', responseJson);
        this.setState({ loading: false });
        if (responseJson) {
          this.setState({
            allComments: responseJson.data,
          });
        } else {
          Toast.show('Something went wrong', Toast.LONG);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  reportPost = id => {
    console.log(id);
    this.setState({ reportPost: true, reportPostId: id, showbtn: false });
  };

  commentAward = () => {
    this.setState({ loading: true, commentAwardVisible: false });
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    var data = new FormData();
    data.append('comment_id', this.state.comment);
    data.append('carrots', this.state.commentAwardSelectedData);
    console.log(data);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.commentAward, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({ loading: false });
        if (responseJson) {
          Toast.show(responseJson.msg, Toast.SHORT);
        } else {
          Toast.show('Something went wrong.', Toast.SHORT);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  postAward = () => {
    this.setState({ loading: true, postAwardVisible: false });
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    var data = new FormData();
    data.append('post_id', this.state.postID);
    data.append('carrots', this.state.postAwardSelectedData);
    console.log(data);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.postAward, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({ loading: false });
        if (responseJson) {
          Toast.show(responseJson.msg, Toast.SHORT);
        } else {
          Toast.show('Something went wrong.', Toast.SHORT);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  commentAwardSelectedButtons(valueTap, award) {
    this.setState({
      commentAwardSelectedData: award,
    });
  }

  postAwardSelectedButtons(valueTap, award) {
    this.setState({
      postAwardSelectedData: award,
    });
  }

  getChildComment = (item, is_parent) => {
    console.log('allComments', this.state.allComments);
    if (is_parent == true) {
      var obj = this.state.allComments.filter(o => o.isReplyShow == true);
      if (obj.length > 0) {
        obj[0].isReplyShow = false;
      }
    }
    item.isReplyShow = true;
    item.childComment = item.children;
    console.log('new comments', this.state.allComments);
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
      this.setState({ allComments: this.state.allComments })
    }, 500);
  };

  replyPost = id => {
    console.log(id);
    this.setState({ replyComment: true, replyPostId: id });
  };

  editPost = (id, comment) => {
    console.log(comment);
    this.setState({ editComment: true, editPostId: id, edit_value: comment });
  };

  permalinkComment = (slug) => {
    Clipboard.setString('https://blogsbunny.com/post/' + slug);
    Toast.show("Success!" + " " + 'https://blogsbunny.com/post/' + slug + " " + "Copied Successfully!", Toast.LONG);
  }

  openLink = async item => {
    console.log("Openlink ==>")
    try {
      const isAvailable = await InAppBrowser.isAvailable();
      if (isAvailable) {
        if (item.link != null) {
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
      }

    } catch (error) {
      // alert(error.message);
    }
  };

  getIndicator = (isExpanded, hasChildrenNodes) => {
    if (!hasChildrenNodes) {
      return '-';
    } else if (isExpanded) {
      return '\\/';
    } else {
      return '>';
    }
  };

  ShowHideComponent = () => {
    this.setState({
      showbtn: true,
    });
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

  deleteComment = commentId => {

    this.setState({ loading: true });
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.comment + '/' + commentId, {
      method: 'DELETE',
      headers: headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log("res", responseJson);
        if (responseJson.status == true) {
          this.getPostDetail();
        } else {
          alert('Something went wrong');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  newloadChildComment = item_child => {
    item_child.items_child_array = [];
    item_child.childComment.map(item => {
      item_child.items_child_array.push(
        <View style={{ marginBottom: 2 }}>
          {item.is_deleted == 1 ? null : (
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  position: 'relative',
                  marginBottom: 5,
                }}>
                <View style={{ flex: 0.15 }}>
                  <View
                    style={{ maxHeight: height > width ? hp('7%') : hp('18%') }}>
                    {item.user.avatar == 'user.jpg' ? (
                      <Image
                        style={{ width: '100%', height: '100%' }}
                        source={require('../images/user.jpg')}
                        resizeMode="cover"
                      />
                    ) : (
                      <Image
                        style={{ width: '100%', height: '100%' }}
                        source={{ uri: item.user.avatar }}
                        resizeMode="cover"
                      />
                    )}
                  </View>
                </View>
                <View style={{ flex: 0.85, marginLeft: 5 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ padding: 0, margin: 0, flex: 0.95 }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          marginLeft: 5,
                          fontSize: height > width ? wp('3.5%') : wp('1.8%'),
                        }}
                        ellipsizeMode="tail"
                        numberOfLines={2}>
                        {item.user.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        padding: 0,
                        margin: 0,
                        justifyContent: 'flex-end',
                        alignContent: 'flex-end',
                        alignSelf: 'flex-end',
                        alignItems: 'flex-end',
                      }}>
                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: height > width ? wp('3.5%') : wp('1.8%'),
                        }}
                        ellipsizeMode="tail"
                        numberOfLines={2}>
                        {item.time_ago}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <View
                      style={{
                        padding: 0,
                        margin: 0,
                        marginLeft: 5,
                        fontSize: height > width ? wp('3.5%') : wp('1.8%'),
                      }}>
                      <HTML
                        html={item.comment}
                        baseFontStyle={{
                          fontSize: height > width ? wp('3.5%') : wp('1.8%'),
                        }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 5,
                      marginBottom: 5,
                      alignContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View style={{ padding: 0 }}>
                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: height > width ? wp('3.5%') : wp('1.8%'),
                        }}
                        ellipsizeMode="tail"
                        numberOfLines={2}>
                        {item.vote_status.length > 0
                          ? item.vote_status[0].value
                          : 0}
                      </Text>
                    </View>
                    <View
                      style={{
                        marginLeft: 10,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                      }}>
                      {item.vote_status.length > 0 &&
                        item.vote_status[0].value == 1 ? (
                        <TouchableOpacity
                          onPress={() => {
                            this.commentLike(item.id, 1);
                          }}>
                          <View>
                            <FontAwesomeIcon
                              icon={faAngleUp}
                              color={'#04c60e'}
                              size={height > width ? wp('5%') : wp('2.3%')}
                              style={{ marginRight: 5 }}
                            />
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            this.commentLike(item.id, 1);
                          }}>
                          <View>
                            <FontAwesomeIcon
                              icon={faAngleUp}
                              color={'black'}
                              size={height > width ? wp('5%') : wp('2.3%')}
                              style={{ marginRight: 5 }}
                            />
                          </View>
                        </TouchableOpacity>
                      )}
                      <Text
                        style={{
                          fontSize: height > width ? wp('3.5%') : wp('2.3%'),
                        }}>
                        |
                      </Text>
                      {item.vote_status.length > 0 &&
                        item.vote_status[0].value == -1 ? (
                        <TouchableOpacity
                          onPress={() => {
                            this.commentLike(item.id, 0);
                          }}>
                          <View>
                            <FontAwesomeIcon
                              icon={faAngleDown}
                              color={'#f6110e'}
                              size={height > width ? wp('5%') : wp('2.3%')}
                              style={{ marginRight: 5 }}
                            />
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            this.commentLike(item.id, 0);
                          }}>
                          <View>
                            <FontAwesomeIcon
                              icon={faAngleDown}
                              color={'black'}
                              size={height > width ? wp('5%') : wp('2.3%')}
                              style={{ marginRight: 5 }}
                            />
                          </View>
                        </TouchableOpacity>
                      )}
                    </View>
                    <View>
                      {this.state.user_id == item.user.id ? (
                        <View style={{ flexDirection: 'row' }}>
                          <TouchableOpacity
                            onPress={() => {
                              this.replyPost(item.id);
                            }}>
                            <Text
                              style={{
                                marginLeft: 2,
                                fontSize:
                                  height > width ? wp('3.5%') : wp('1.8%'),
                              }}>
                              Reply
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              this.editPost(item.id, item.comment);
                            }}>
                            <Text
                              style={{
                                marginLeft: 5,
                                fontSize:
                                  height > width ? wp('3.5%') : wp('1.8%'),
                              }}>
                              - Edit -
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              this.deleteComment(item.id);
                            }}>
                            <Text
                              style={{
                                marginLeft: 5,
                                fontSize:
                                  height > width ? wp('3.5%') : wp('1.8%'),
                              }}>
                              Delete
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              this.permalinkComment(this.state.Slug,);
                            }}>
                            {height > width ?
                              <Text
                                style={{
                                  marginLeft: 5,
                                  fontSize:
                                    height > width ? wp('3.5%') : wp('1.8%'),
                                }}>
                                -Perma..
                            </Text> :
                              <Text
                                style={{
                                  marginLeft: 5,
                                  fontSize:
                                    height > width ? wp('3.5%') : wp('1.8%'),
                                }}>
                                - Permalink
                            </Text>}
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={{ flexDirection: 'row' }}>
                          <TouchableOpacity
                            onPress={() => {
                              if (this.state.token == "") {
                                this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
                              } else {
                                this.replyPost(item.id);
                              }
                            }}>
                            <Text
                              style={{
                                marginLeft: 5,
                                fontSize:
                                  height > width ? wp('3.5%') : wp('1.8%'),
                              }}
                              ellipsizeMode="tail"
                              numberOfLines={2}>
                              Reply
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              if (this.state.token == "") {
                                this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
                              } else {
                                this.setState({
                                  commentAwardVisible: true,
                                  comment: item.id,
                                });
                              }
                            }}>
                            <Text
                              style={{
                                marginLeft: 5,
                                fontSize:
                                  height > width ? wp('3.5%') : wp('1.8%'),
                              }}
                              ellipsizeMode="tail"
                              numberOfLines={2}>
                              - award carrots
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
              <View>
                {item.childComment != undefined &&
                  item.childComment.length > 0 &&
                  item.isReplyShow == true ? (
                  <View>
                    {(item.replyShow = this.newloadChildComment(item))}
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      this.getChildComment(item, false);
                    }}>
                    {item.children.length > 0 ? (
                      <Text
                        style={{
                          marginLeft: 55,
                          fontSize: height > width ? wp('3.5%') : wp('1.8%'),
                        }}
                        ellipsizeMode="tail"
                        numberOfLines={2}>
                        ------- View replies ({item.children.length}){' '}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>,
      );
    });
    return item_child.items_child_array;
  };

  loadChildComment = item_child => {
    item_child.items_child_array = [];
    item_child.childComment.map(item => {
      item_child.items_child_array.push(
        <View style={{ marginBottom: 2 }}>
          {item.is_deleted == 1 ? null : (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  position: 'relative',
                  marginBottom: 5,
                }}>
                <View style={{ flex: 0.15 }}>
                  <View
                    style={{ maxHeight: height > width ? hp('7%') : hp('18%') }}>
                    {item.user.avatar == 'user.jpg' ? (
                      <Image
                        style={{ width: '100%', height: '100%' }}
                        source={require('../images/user.jpg')}
                        resizeMode="cover"
                      />
                    ) : (
                      <Image
                        style={{ width: '100%', height: '100%' }}
                        source={{ uri: item.user.avatar }}
                        resizeMode="cover"
                      />
                    )}
                  </View>
                </View>
                <View style={{ flex: 0.85, marginLeft: 5 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ padding: 0, margin: 0, flex: 0.95 }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          marginLeft: 5,
                          fontSize: height > width ? wp('3.5%') : wp('1.8%'),
                        }}
                        ellipsizeMode="tail"
                        numberOfLines={2}>
                        {item.user.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        padding: 0,
                        margin: 0,
                        justifyContent: 'flex-end',
                        alignContent: 'flex-end',
                        alignSelf: 'flex-end',
                        alignItems: 'flex-end',
                      }}>
                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: height > width ? wp('3.5%') : wp('1.8%'),
                        }}
                        ellipsizeMode="tail"
                        numberOfLines={2}>
                        {item.time_ago}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <View
                      style={{
                        padding: 0,
                        margin: 0,
                        marginLeft: 5,
                        fontSize: height > width ? wp('3.5%') : wp('1.8%'),
                      }}>
                      <HTML
                        html={item.comment}
                        baseFontStyle={{
                          fontSize: height > width ? wp('3.5%') : wp('1.8%'),
                        }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 5,
                      marginBottom: 5,
                      alignContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View style={{ padding: 0 }}>
                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: height > width ? wp('3.5%') : wp('1.8%'),
                        }}
                        ellipsizeMode="tail"
                        numberOfLines={2}>
                        {item.vote_status.length > 0
                          ? item.vote_status[0].value
                          : 0}
                      </Text>
                    </View>
                    <View
                      style={{
                        marginLeft: 10,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                      }}>
                      {item.vote_status.length > 0 &&
                        item.vote_status[0].value == 1 ? (
                        <TouchableOpacity
                          onPress={() => {
                            this.commentLike(item.id, 1);
                          }}>
                          <View>
                            <FontAwesomeIcon
                              icon={faAngleUp}
                              color={'#04c60e'}
                              size={height > width ? wp('5%') : wp('2.3%')}
                              style={{ marginRight: 5 }}
                            />
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            this.commentLike(item.id, 1);
                          }}>
                          <View>
                            <FontAwesomeIcon
                              icon={faAngleUp}
                              color={'black'}
                              size={height > width ? wp('5%') : wp('2.3%')}
                              style={{ marginRight: 5 }}
                            />
                          </View>
                        </TouchableOpacity>
                      )}
                      <Text
                        style={{
                          fontSize: height > width ? wp('3.5%') : wp('2.3%'),
                        }}>
                        |
                      </Text>
                      {item.vote_status.length > 0 &&
                        item.vote_status[0].value == -1 ? (
                        <TouchableOpacity
                          onPress={() => {
                            this.commentLike(item.id, 0);
                          }}>
                          <View>
                            <FontAwesomeIcon
                              icon={faAngleDown}
                              color={'#f6110e'}
                              size={height > width ? wp('5%') : wp('2.3%')}
                              style={{ marginRight: 5 }}
                            />
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            this.commentLike(item.id, 0);
                          }}>
                          <View>
                            <FontAwesomeIcon
                              icon={faAngleDown}
                              color={'black'}
                              size={height > width ? wp('5%') : wp('2.3%')}
                              style={{ marginRight: 5 }}
                            />
                          </View>
                        </TouchableOpacity>
                      )}
                    </View>
                    <View>
                      {this.state.user_id == item.user.id ? (
                        <View style={{ flexDirection: 'row' }}>
                          <TouchableOpacity
                            onPress={() => {
                              this.replyPost(item.id);
                            }}>
                            <Text
                              style={{
                                marginLeft: 2,
                                fontSize:
                                  height > width ? wp('3.5%') : wp('1.8%'),
                              }}>
                              Reply
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              this.editPost(item.id, item.comment);
                            }}>
                            <Text
                              style={{
                                marginLeft: 5,
                                fontSize:
                                  height > width ? wp('3.5%') : wp('1.8%'),
                              }}>
                              - Edit -
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              this.deleteComment(item.id);
                            }}>
                            <Text
                              style={{
                                marginLeft: 5,
                                fontSize:
                                  height > width ? wp('3.5%') : wp('1.8%'),
                              }}>
                              Delete
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              this.permalinkComment(this.state.Slug,);
                            }}>
                            {height > width ?
                              <Text
                                style={{
                                  marginLeft: 5,
                                  fontSize:
                                    height > width ? wp('3.5%') : wp('1.8%'),
                                }}>
                                -Perma..
                            </Text> :
                              <Text
                                style={{
                                  marginLeft: 5,
                                  fontSize:
                                    height > width ? wp('3.5%') : wp('1.8%'),
                                }}>
                                - Permalink
                            </Text>}
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={{ flexDirection: 'row' }}>
                          <TouchableOpacity
                            onPress={() => {
                              if (this.state.token == "") {
                                this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
                              } else {
                                this.replyPost(item.id);
                              }
                            }}>
                            <Text
                              style={{
                                marginLeft: 5,
                                fontSize:
                                  height > width ? wp('3.5%') : wp('1.8%'),
                              }}
                              ellipsizeMode="tail"
                              numberOfLines={2}>
                              Reply
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              if (this.state.token == "") {
                                this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
                              } else {
                                this.setState({
                                  commentAwardVisible: true,
                                  comment: item.id,
                                });
                              }
                            }}>
                            <Text
                              style={{
                                marginLeft: 5,
                                fontSize:
                                  height > width ? wp('3.5%') : wp('1.8%'),
                              }}
                              ellipsizeMode="tail"
                              numberOfLines={2}>
                              - award carrots
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
              <View>
                {item.childComment != undefined &&
                  item.childComment.length > 0 &&
                  item.isReplyShow == true ? (
                  <View>
                    {(item.replyShow = this.newloadChildComment(item))}
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      this.getChildComment(item, false);
                    }}>
                    {item.children.length > 0 ? (
                      <Text
                        style={{
                          marginLeft: 55,
                          fontSize: height > width ? wp('3.5%') : wp('1.8%'),
                        }}
                        ellipsizeMode="tail"
                        numberOfLines={2}>
                        ------- View replies ({item.children.length}){' '}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>,
      );
    });
    return item_child.items_child_array;
  };

  onReplySubmit = () => {
    this.setState({ loading: true, replyComment: false });
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    console.log(headers);
    var data = new FormData();
    data.append('post_id', this.state.postID);
    data.append('comment_text', this.state.reply_comment);
    data.append('reply_to_comment', this.state.replyPostId);
    console.log(data);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.comment, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status == true) {
          this.getPostDetail();
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  onEditSubmit = () => {
    this.setState({ loading: true, editComment: false });
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    console.log(headers);
    var data = new FormData();
    data.append('comment_id', this.state.editPostId);
    data.append('comment_text', this.state.edit_comment);
    console.log(data);
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.updateComment, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.status == true) {
          this.getPostDetail();
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  onPostSubmit = () => {
    this.setState({ loading: true });
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    console.log(headers);
    var data = new FormData();
    data.append('post_id', this.state.postID);
    data.append('comment_text', this.state.commentValue);
    console.log(data);
    this.setState({ loading: false });
    fetch(Endpoint.endPoint.url + Endpoint.endPoint.comment, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status == true) {
          this.setState({
            loading: false,
            replyComment: false,
            commentValue: '',
          });
          this._retrieveData();
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const total_votes =
      parseInt(this.state.dataSource.upvotes_count) -
      parseInt(this.state.dataSource.downvotes_count);
    const { dataSource } = this.state;
    const progressCustomStyles = {
      backgroundColor: this.state.overall_score > 50 ? '#27AE60' : '#ef4655',
      borderRadius: 0,
      borderColor: this.state.overall_score > 50 ? '#27AE60' : '#ef4655',
      borderWidth: 2,
      barEasing: 'sin',
    };
    let size = height > width ? hp('12%') : wp('8%');
    let commentview;
    var items = [];
    if (this.state.allComments.length > 0) {
      console.log('items', this.state.allComments);
      this.state.allComments.map((item, key) => {
        items.push(
          <View>
            {item.is_deleted == 1 ? null : (
              <View
                style={{
                  flexDirection: 'row',
                  position: 'relative',
                  marginBottom: 5,
                }}>
                <View style={{ flex: 0.15 }}>
                  <View
                    style={{ maxHeight: height > width ? hp('8%') : hp('18%'), marginTop: 15, marginLeft: 5 }}>
                    {item.user.avatar == 'user.jpg' ? (
                      <Image
                        style={{ width: '100%', height: '100%' }}
                        source={require('../images/user.jpg')}
                        resizeMode="cover"
                      />
                    ) : (
                      <Image
                        style={{ width: '100%', height: '100%' }}
                        source={{ uri: item.user.avatar }}
                        resizeMode="cover"
                      />
                    )}
                  </View>
                </View>
                <View style={{ flex: 0.75, marginLeft: 5 }}>
                  <View style={{ flexDirection: 'row', flex: 1, marginTop: 15 }}>
                    <View style={{ padding: 0, margin: 0, flex: 0.95 }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          marginLeft: 5,
                          fontSize: height > width ? wp('3.5%') : wp('1.8%'),
                        }}
                        ellipsizeMode="tail"
                        numberOfLines={2}>
                        {item.user.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        padding: 0,
                        margin: 0,
                        justifyContent: 'flex-end',
                        alignContent: 'flex-end',
                        alignSelf: 'flex-end',
                        alignItems: 'flex-end',
                      }}>
                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: height > width ? wp('3.5%') : wp('1.8%'),
                        }}
                        ellipsizeMode="tail"
                        numberOfLines={2}>
                        {item.time_ago}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ padding: 0, margin: 0 }}>
                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: height > width ? wp('3.5%') : wp('1.8%'),
                        }}
                        ellipsizeMode="tail"
                        numberOfLines={2}>
                        {item.comment}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 10
                    }}>
                    <View style={{ padding: 0 }}>
                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: height > width ? wp('3.5%') : wp('1.8%'),
                        }}
                        ellipsizeMode="tail"
                        numberOfLines={2}>
                        {item.vote_status.length > 0
                          ? item.vote_status[0].value
                          : 0}
                      </Text>
                    </View>
                    <View
                      style={{
                        marginLeft: 10,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                      }}>
                      {item.vote_status.length > 0 &&
                        item.vote_status[0].value == 1 ? (
                        <TouchableOpacity
                          onPress={() => {
                            this.commentLike(item.id, 1);
                          }}>
                          <View>
                            <FontAwesomeIcon
                              icon={faAngleUp}
                              color={'#04c60e'}
                              size={height > width ? wp('5%') : wp('2.3%')}
                              style={{ marginRight: 5 }}
                            />
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            this.commentLike(item.id, 1);
                          }}>
                          <View>
                            <FontAwesomeIcon
                              icon={faAngleUp}
                              color={'black'}
                              size={height > width ? wp('5%') : wp('2.3%')}
                              style={{ marginRight: 5 }}
                            />
                          </View>
                        </TouchableOpacity>
                      )}
                      <Text
                        style={{
                          fontSize: height > width ? wp('3.5%') : wp('2.3%'),
                        }}>
                        |
                      </Text>
                      {item.vote_status.length > 0 &&
                        item.vote_status[0].value == -1 ? (
                        <TouchableOpacity
                          onPress={() => {
                            this.commentLike(item.id, 0);
                          }}>
                          <View>
                            <FontAwesomeIcon
                              icon={faAngleDown}
                              color={'#f6110e'}
                              size={height > width ? wp('5%') : wp('2.3%')}
                              style={{ marginRight: 5 }}
                            />
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            this.commentLike(item.id, 0);
                          }}>
                          <View>
                            <FontAwesomeIcon
                              icon={faAngleDown}
                              color={'black'}
                              size={height > width ? wp('5%') : wp('2.3%')}
                              style={{ marginRight: 5 }}
                            />
                          </View>
                        </TouchableOpacity>
                      )}
                    </View>
                    <View>
                      {this.state.user_id == item.user.id ? (
                        <View style={{ flexDirection: 'row' }}>
                          <TouchableOpacity
                            onPress={() => {
                              this.replyPost(item.id);
                            }}>
                            <Text
                              style={{
                                marginLeft: 5,
                                fontSize:
                                  height > width ? wp('3.5%') : wp('1.8%'),
                              }}>
                              Reply
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              this.editPost(item.id, item.comment);
                            }}>
                            <Text
                              style={{
                                marginLeft: 5,
                                fontSize:
                                  height > width ? wp('3.5%') : wp('1.8%'),
                              }}>
                              - Edit -
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              this.deleteComment(item.id);
                            }}>
                            <Text
                              style={{
                                marginLeft: 5,
                                fontSize:
                                  height > width ? wp('3.5%') : wp('1.8%'),
                              }}>
                              Delete
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              this.permalinkComment(this.state.Slug,);
                            }}>
                            <Text
                              style={{
                                marginLeft: 5,
                                fontSize:
                                  height > width ? wp('3.5%') : wp('1.8%'),
                              }}>
                              - Permalink
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={{ flexDirection: 'row' }}>
                          <TouchableOpacity
                            onPress={() => {
                              if (this.state.token == "") {
                                this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
                              } else {
                                this.replyPost(item.id);
                              }
                            }}>
                            <Text
                              style={{
                                marginLeft: 5,
                                fontSize:
                                  height > width ? wp('3.5%') : wp('1.8%'),
                              }}
                              ellipsizeMode="tail"
                              numberOfLines={2}>
                              Reply
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              if (this.state.token == "") {
                                this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
                              } else {
                                this.setState({
                                  commentAwardVisible: true,
                                  comment: item.id,
                                });
                              }
                            }}>
                            <Text
                              style={{
                                marginLeft: 5,
                                fontSize:
                                  height > width ? wp('3.5%') : wp('1.8%'),
                              }}
                              ellipsizeMode="tail"
                              numberOfLines={2}>
                              - award carrots
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={{ marginBottom: 5, marginTop: 10 }}>
                    {item.childComment != undefined &&
                      item.childComment.length > 0 &&
                      item.isReplyShow == true ? (
                      <View>
                        {(item.replyShow = this.loadChildComment(item))}
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          this.getChildComment(item, true);
                        }}>
                        {item.children.length > 0 ? (
                          <Text
                            style={{
                              marginLeft: 5,
                              fontSize:
                                height > width ? wp('3.5%') : wp('1.8%'),
                            }}
                            ellipsizeMode="tail"
                            numberOfLines={2}>
                            ------- View replies ({item.children.length}){' '}
                          </Text>
                        ) : null}
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            )}
          </View>,
        );
      });

      // console.log('items-123', items);
      commentview = items;
    }

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
          {this.state.type == 'myPost' ? (
            <Navbar
              left={left}
              right={right}
              title="My Post"
              navigation={this.props}
            />
          ) : (
            <Navbar
              left={left}
              right={right}
              title="Comments"
              navigation={this.props}
            />
          )}
          {this.state.loading == true ? (
            <View style={styles.spinner}>
              <Bars size={25} color="#11075e" />
            </View>
          ) : null}
          <KeyboardAvoidingView behavior="padding" enabled>
            {/* comment award carrots */}
            <Modal
              isVisible={this.state.commentAwardVisible}
              swipeDirection="down"
              // onBackdropPress={() => this.setState({commentAwardVisible: false})}
              style={{ justifyContent: 'flex-end', margin: 0 }}>
              <View style={{ backgroundColor: '#fff', padding: 5 }}>
                <Text
                  style={{
                    fontSize: 25,
                    color: '#11075e',
                    textAlign: 'center',
                    marginBottom: 10,
                  }}>
                  COMMENT AWARD CARROTS
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                  }}>
                  {awardData.map(award => (
                    <SelectMultipleButton
                      key={award}
                      value={award}
                      displayValue={'+' + award}
                      highLightStyle={{
                        borderColor: 'gray',
                        backgroundColor: 'transparent',
                        textColor: 'gray',
                        borderTintColor: '#11075e',
                        backgroundTintColor: '#11075e',
                        textTintColor: 'white',
                      }}
                      buttonViewStyle={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                      }}
                      selected={this.state.commentAwardSelectedData === award}
                      singleTap={valueTap =>
                        this.commentAwardSelectedButtons(valueTap, award)
                      }
                    />
                  ))}
                  {/* <Text
                    style={{
                      padding: 10,
                      backgroundColor: '#11075e',
                      textAlign: 'center',
                      color: 'white',
                    }}>
                    +1
                  </Text> */}
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
                          commentAwardVisible: false,
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
                        this.commentAward();
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

            {/* post award carrots */}
            <Modal
              isVisible={this.state.postAwardVisible}
              swipeDirection="down"
              // onBackdropPress={() => this.setState({postAwardVisible: false})}
              style={{ justifyContent: 'flex-end', margin: 0 }}>
              <View style={{ backgroundColor: '#fff', padding: 5 }}>
                <Text
                  style={{
                    fontSize: 25,
                    color: '#11075e',
                    textAlign: 'center',
                    marginBottom: 10,
                  }}>
                  POST AWARD CARROTS
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                  }}>
                  {awardData.map(award => (
                    <SelectMultipleButton
                      key={award}
                      value={award}
                      displayValue={'+' + award}
                      highLightStyle={{
                        borderColor: 'gray',
                        backgroundColor: 'transparent',
                        textColor: 'gray',
                        borderTintColor: '#11075e',
                        backgroundTintColor: '#11075e',
                        textTintColor: 'white',
                      }}
                      buttonViewStyle={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                      }}
                      selected={this.state.postAwardSelectedData === award}
                      singleTap={valueTap =>
                        this.postAwardSelectedButtons(valueTap, award)
                      }
                    />
                  ))}
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
                          postAwardVisible: false,
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
                        if (this.state.token == "") {
                          this.setState({ postAwardVisible: false, loginmodal: true, logintext: 'Please login or register to use this feature.' })
                        } else {
                          this.postAward();
                        }
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
                      this.reportPost(this.state.postID);
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
                      this.shareMessage(
                        this.state.Slug,
                        this.state.dataSource.title,
                      );
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
                              justifyContent: 'center',
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

                  {/* <View style={{ flexDirection: 'row' }}> */}


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
            {/* Report

            {/* Edit pop-up  */}
            <Dialog
              dialogStyle={{
                borderRadius: 9,
                width: width > height ? '50%' : '100%',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}
              onRequestClose={() => {
                this.setState({ editComment: false });
              }}
              titleStyle={{ fontWeight: 'bold', color: '#11075e' }}
              visible={this.state.editComment}>
              <ScrollView>
                <View>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: 'lightgrey',
                      paddingBottom: 20,
                    }}>
                    <TextInput
                      style={styles.inputtype_dialog}
                      placeholder="Edit Comment"
                      placeholderTextColor="grey"
                      numberOfLines={5}
                      defaultValue={this.state.edit_value}
                      onChangeText={edit_comment => {
                        this.setState({ edit_comment });
                      }}
                      multiline={true}
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
                        this.setState({ editComment: false });
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
                        this.onEditSubmit();
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: height > width ? wp('3.8%') : wp('1.8%'),
                        }}>
                        Submit
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </Dialog>

            {/* Reply pop-up  */}
            <Dialog
              dialogStyle={{
                borderRadius: 9,
                width: width > height ? '50%' : '100%',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}
              onRequestClose={() => {
                this.setState({ replyComment: false });
              }}
              titleStyle={{ fontWeight: 'bold', color: '#11075e' }}
              visible={this.state.replyComment}>
              <ScrollView>
                <View>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: 'lightgrey',
                      paddingBottom: 20,
                    }}>
                    <TextInput
                      style={styles.inputtype_dialog}
                      placeholder="Enter Comment"
                      placeholderTextColor="grey"
                      numberOfLines={5}
                      onChangeText={reply_comment => {
                        this.setState({ reply_comment });
                      }}
                      multiline={true}
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
                        this.setState({ replyComment: false });
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
                        this.onReplySubmit();
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: height > width ? wp('3.8%') : wp('1.8%'),
                        }}>
                        Submit
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </Dialog>
          </KeyboardAvoidingView>

          <View style={{ flex: 0.92 }}>
            <ScrollView style={{ marginBottom: 20 }}>
              <Card containerStyle={styles.card_style}>
                <View>
                  {dataSource.post_type == 'video' ?
                  <YoutubePlayer
                  style={{
                    maxHeight: height > width ? hp('21%') : hp('30%'),
                  }}
                    height={hp('28%')}
                    play={false}
                    videoId={this.state.Videolink}
                    // onChangeState={onStateChange}
                    /> :
                  <TouchableOpacity
                    style={{
                      maxHeight: height > width ? hp('21%') : hp('30%'),
                    }}
                    onPress={() => {
                      this.openLink(dataSource);
                    }}>
                    <Image
                      style={{
                        width: '100%',
                        height: '100%',
                        borderTopRightRadius: 5,
                        borderTopLeftRadius: 5,
                      }}
                      // source={{ uri: dataSource.image }}
                      source={
                        dataSource.image == null ?
                          require('../images/emptyImg.png')
                          :
                          { uri: dataSource.image }
                      }
                      resizeMode="cover"
                    />
                  </TouchableOpacity>}
                </View>
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingTop: 10,
                  }}>
                  {(dataSource.link != null && dataSource.link != "") ?
                    <TouchableOpacity onPress={() => {
                      this.openLink(dataSource);
                    }}>
                      <Text
                        style={{
                          color: '#11075e',
                          fontWeight: 'bold',
                          fontSize: height > width ? wp('3.5%') : wp('1.8%'),
                        }}
                        ellipsizeMode="tail"
                        numberOfLines={2}>
                        {dataSource.title}
                      </Text>
                    </TouchableOpacity> : null}

                  {(dataSource.link != null && dataSource.link != "") ?
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        marginVertical: 5,
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        this.openLink(dataSource);
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
                        {dataSource.link}
                      </Text>
                    </TouchableOpacity> : null}

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
                        } else {
                          this.props.navigation.navigate('viewProfile', {
                            userName: this.state.userName,
                            userId: this.state.userID,
                          })
                        }
                      }}>
                      <Text
                        style={{
                          color: 'grey',
                          fontSize: height > width ? wp('3%') : wp('1.2%'),
                          fontWeight: 'bold',
                        }}
                        ellipsizeMode="tail"
                        numberOfLines={1}>
                        {this.state.userName}
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
                      {' '}
                      {dataSource.time_ago != undefined && dataSource.time_ago}
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
                      {dataSource.text}
                    </Text>
                  </View>
                  {height < width ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 15,
                        marginBottom: 10,
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
                          {this.state.votestatus_length > 0 &&
                            this.state.votestatus_value == -1 ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.submitVote(0, this.state.postID);
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
                                this.submitVote(0, this.state.postID);
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
                                {total_votes ? total_votes : 0}
                              </Text>
                              <Image
                                source={require('../images/oval.png')}
                                style={{ height: 10, width: 10 }}
                              />
                            </View>
                          </View>

                          {this.state.votestatus_length > 0 &&
                            this.state.votestatus_value == 1 ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.submitVote(1, this.state.postID);
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
                                this.submitVote(1, this.state.postID);
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
                            this.setState({ postAwardVisible: true });
                          }}>
                          <TouchableOpacity
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-around',
                            }}
                            onPress={() => {
                              this.setState({ postAwardVisible: true });
                            }}>
                            <FontAwesomeIcon
                              icon={faCarrot}
                              color={'#afaaaa'}
                              size={height > width ? wp('5%') : wp('2.5%')}

                            />
                            <Text
                              style={{
                                marginRight: 5,
                                marginLeft: 10,
                                fontSize: height > width ? wp('3.5%') : wp('1.5%'),
                              }}>
                              Carrots
                        </Text>
                          </TouchableOpacity>
                        </TouchableOpacity>
                      </View>

                      <View
                        style={{
                          alignSelf: 'center',
                          backgroundColor: '#FDFCFC',
                          width: wp('21%'),
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
                            this.showReport(dataSource);
                          }}>
                          <FontAwesomeIcon
                            icon={faChartBar}
                            color={'#afaaaa'}
                            size={height > width ? wp('5%') : wp('2.5%')}
                            style={{ marginRight: 5 }}
                          />
                          <Text
                            style={{
                              marginRight: 5,
                              fontSize: height > width ? wp('3.5%') : wp('1.5%'),
                            }}>
                            Overall score
                        </Text>
                          <Text
                            style={{
                              marginLeft: 5,
                              marginRight: 5,
                              fontSize: height > width ? wp('3.5%') : wp('1.5%'),
                            }}>
                            {dataSource.overall_score}%
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
                          {this.state.bookmark ? (
                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                              }} onPress={() => {
                                this.state.bookmark
                                  ? this.bookmarkDeleted(this.state.id)
                                  : this.bookmarkCreated(this.state.id);
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
                                this.state.bookmark
                                  ? this.bookmarkDeleted(this.state.id)
                                  : this.bookmarkCreated(this.state.id);
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
                              fontSize: height > width ? wp('3.5%') : wp('1.5%'),
                            }}>
                            {this.state.warrenName.length < 12
                              ? `${" " + this.state.warrenName}`
                              : `${" " + this.state.warrenName.substring(0, 10)}...`}
                          </Text>
                        </View>
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
                            this.reportPost(this.state.postID);
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
                              fontSize: height > width ? wp('3.5%') : wp('1.5%'),
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
                            this.shareMessage(this.state.Slug, dataSource.title);
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
                              fontSize: height > width ? wp('3.5%') : wp('1.5%'),
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
                          {this.state.votestatus_length > 0 &&
                            this.state.votestatus_value == -1 ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.submitVote(0, this.state.postID);
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
                                this.submitVote(0, this.state.postID);
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
                                {total_votes ? total_votes : 0}
                              </Text>
                              <Image
                                source={require('../images/oval.png')}
                                style={{ height: 10, width: 10 }}
                              />
                            </View>
                          </View>

                          {this.state.votestatus_length > 0 &&
                            this.state.votestatus_value == 1 ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.submitVote(1, this.state.postID);
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
                                this.submitVote(1, this.state.postID);
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
                            this.setState({ postAwardVisible: true });
                          }}>
                          <FontAwesomeIcon
                            icon={faCarrot}
                            color={'#afaaaa'}
                            size={height > width ? wp('5%') : wp('2.5%')}
                            style={{ marginHorizontal: 5 }}
                          />
                        </TouchableOpacity>
                      </View>
                      {dataSource.post_type == 'link' || dataSource.post_type=='video' ? (
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
                              this.showReport(dataSource);
                            }}>
                            <FontAwesomeIcon
                              icon={faChartBar}
                              color={'#afaaaa'}
                              size={height > width ? wp('5%') : wp('2.5%')}
                              style={{ marginHorizontal: 5 }}
                            />
                            <Text
                              style={{
                                marginHorizontal: 5,
                                fontSize:
                                  height > width ? wp('3.5%') : wp('1.5%'),
                              }}>
                              {dataSource.overall_score
                                ? dataSource.overall_score
                                : 0}
                            %
                          </Text>
                          </TouchableOpacity>
                        </View>
                      ) : null}
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
                          this.shareMessage(this.state.Slug, dataSource.title);
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
                          this.reportPost(this.state.postID);
                        }}>
                        <FontAwesomeIcon
                          icon={faFileAlt}
                          color={'#afaaaa'}
                          size={height > width ? wp('5%') : wp('2.5%')}
                          style={{marginHorizontal: 5}}
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
                            this.state.bookmark
                              ? this.bookmarkDeleted(this.state.id)
                              : this.bookmarkCreated(this.state.id);
                          }}
                        >
                          {this.state.bookmark ? (
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
                            this.ShowHideComponent();
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

              {this.state.allComments.length == 0 ? null : (
                <View style={styles.card_style_comment}>
                  {commentview}
                </View>
              )}
            </ScrollView>
          </View>

          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              bottom: -10,
              flex: 0.08,
              backgroundColor: '#F5FCFF',
              padding: 10,
            }}>
            <View style={{ flex: 1, padding: height > width ? 4 : 10, justifyContent: 'center' }}>
              <TextInput
                style={styles.inputtype_dialog}
                placeholder="Add comment..."
                placeholderTextColor="grey"
                numberOfLines={1}
                defaultValue={this.state.commentValue}
                onChangeText={commentValue =>
                  this.setState({ commentValue: commentValue })
                }
                multiline={true}
              />
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: height * 0.03,
                right: height * 0.03,
              }}>
              <TouchableOpacity
                style={styles.reportPost}
                onPress={() => {
                  if (this.state.token == "") {
                    this.setState({ loginmodal: true, logintext: 'Please login or register to use this feature.' })
                  } else {
                    this.onPostSubmit();
                  }
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: height > width ? wp('3.8%') : wp('1.8%'),
                  }}>
                  Post
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
  card_style_comment: {
    margin: 10,
    marginTop: 5,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 25,
    borderRadius: 15,
    backgroundColor: "#fff",
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
  inputtype_dialog: {
    backgroundColor: 'white',
    paddingLeft: 5,
    padding: height > width ? 5 : 6,
    marginTop: 5,
    marginBottom: height * 0.015,
    maxWidth: height > width ? '70%' : '90%',
    // maxHeight: height > width ? 100 : 50,
    borderRadius: 5,
    // textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'lightgrey',
    color: 'black',
    fontSize: height > width ? wp('3.8%') : wp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
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
