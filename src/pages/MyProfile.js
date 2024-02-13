import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Share,
  Linking,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import Image from 'react-native-remote-svg';
import {
  faTag,
  faBars,
  faPencilAlt,
  faMinus,
  faCommentAlt,
  faBookmark as BookmarkSolid,
  faPlus,
  faShare,
  faCarrot,
  faChartBar,
  faFileAlt,
  faEllipsisV,
  faExternalLinkAlt,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBookmark as BookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import SideMenuDrawer from '../component/SideMenuDrawer';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Navbar from '../component/NavBar';
import { Button, Left, Right } from 'native-base';
import HTML from 'react-native-render-html';
import AsyncStorage from '@react-native-community/async-storage';
import { Card } from 'react-native-elements';
import { Bars } from 'react-native-loader';
import { Dialog } from 'react-native-simple-dialogs';
import Toast from 'react-native-simple-toast';
import RadioGroup from 'react-native-radio-buttons-group';
import { NavigationEvents } from 'react-navigation';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Endpoint from '../res/url_endpoint';
import YoutubePlayer from "react-native-youtube-iframe";

library.add(BookmarkSolid, BookmarkRegular);
export default class MyProfile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userDetail: '',
      token: '',
      user_id: '',
      billing_type: '',
      dataSource: [],
      comment: [],
      postType: '',
      loading: false,
      customStyleIndex: 0,
      profilePhoto: '',
      user_name: '',
      email: '',
      percentageReport: false,
      grammer_score: '',
      readability_score: '',
      domain_score: '',
      vote_score: '',
      plagiarism_score: '',
      reportPost: false,
      showbtn: false,
      reportPostId: '',
      country: '',
      carrots: '',
      no_of_comments: '',
      totalComments: '',
      totalPost: '',
      image: '',
      img_uri: '',
      page: 1,
      slug: '',
      domain_id: '',
      warrens: '',
      id: '',
      title: '',
      link: '',
      lastPage: '',
      commentPage: 1,
      commentLastPage: '',
      reportData: [
        {
          label: 'This is spam',
          value: 'This is spam',
        },
        {
          label: 'This is abusive or harassing',
          value: 'This is abusive or harassing',
        },
        {
          label: 'Inappropriate Content',
          value: 'Inappropriate Content',
        },
        {
          label: 'Incorrect Category',
          value: 'Incorrect Category',
        },
        {
          label: 'Misleading Title',
          value: 'Misleading Title',
        },
      ],
    };
    this._retrieveData();
    this.videolinkarr=[];
  }

  page_reloaded() {
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
        console.log('valueRecieve1', valueRecieve);
        this.setState({ loading: true, page: 1, commentPage: 1 });
        this.setState({
          user_id: valueRecieve.user_id,
          token: valueRecieve.token,
          user_name: valueRecieve.userName,
          billing_type: valueRecieve.billing_type,
        });
        this.getUserDetail();
      }
    } catch (error) {
      alert(error);
    }
  };



  handleCustomIndexSelect = index => {
    this.setState(prevState => ({ ...prevState, customStyleIndex: index }));
    if (index === 0) {
      this.getPosts();
    } else if (index === 1) {
      this.getComments();
    }
  };

  reportPost = id => {
    console.log(id);
    this.setState({ reportPost: true, reportPostId: id, showbtn: false });
  };



  ShowHideComponent = item => {
    this.setState({
      showbtn: true,
      id: item.id,
      slug: item.slug,
      warrens: item.warrens[0].name,
      title: item.title,
      domain_id: item.domain_id,
    });
  };

  blockDomainAlert = id => {
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
  };

  bookmarkDeleted = id => {
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    var data = new FormData();
    data.append('entity', 'Post');
    data.append('entity_id', id);
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

  openPost = item => {
    // Linking.openURL(link);
    this.props.navigation.navigate('singlePost', {
      Slug: item.slug,
      id: item.id
    });
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

  shareMessage = (slug, title) => {
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
  };

  getUserDetail = () => {
    this.setState({ loading: true });
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    fetch(Endpoint.endPoint.url + 'profile/' + this.state.user_name + '/name', {
      method: 'GET',
      headers: headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({ loading: false });
        if (responseJson.status == true) {
          this.setState({
            profilePhoto: responseJson.data.avatar,
            email: responseJson.data.email,
            country: responseJson.data.country,
            totalPost: responseJson.data.verified_posts_count,
            totalComments: responseJson.data.comments_count,
            carrots: responseJson.data.carrots,
          });

          if (this.state.customStyleIndex === 0) {
            this.getPosts();
          }
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

  getPosts = () => {
    const { page } = this.state;
    this.setState({ loading: true });
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    console.log("Well",
      Endpoint.endPoint.url +
      'profile/' +
      this.state.user_id +
      '/posts' +
      '?page=' +
      page,
    );
    fetch(
      Endpoint.endPoint.url +
      'profile/' +
      this.state.user_id +
      '/posts' +
      '?page=' +
      page,
      {
        method: 'GET',
        headers: headers,
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log('postswell', responseJson);
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
          this.getPosts();
        },
      );
    }
  };

  // ListEmpty = () => {
  //   return (
  //     <View>
  //       <Text style={{ textAlign: 'center', marginTop: 50 }}>No Data Found</Text>
  //     </View>
  //   );
  // };

  getComments = () => {
    const { commentPage } = this.state;
    this.setState({ loading: true });
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    console.log(
      Endpoint.endPoint.url +
      'profile/' +
      this.state.user_id +
      '/comments' +
      '?page=' +
      commentPage,
    );
    fetch(
      Endpoint.endPoint.url +
      'profile/' +
      this.state.user_id +
      '/comments' +
      '?page=' +
      commentPage,
      {
        method: 'GET',
        headers: headers,
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log('comments', responseJson);
        this.setState({ loading: false });
        if (responseJson.data) {
          this.setState({
            comment:
              commentPage === 1
                ? responseJson.data
                : [...this.state.comment, ...responseJson.data],
            commentLastPage: responseJson.last_page,
          });
        } else {
          alert('Something went wrong');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  onLoadMoreComments = () => {
    if (this.state.commentPage <= this.state.commentLastPage) {
      this.setState(
        {
          commentPage: this.state.commentPage + 1,
        },
        () => {
          this.getComments();
        },
      );
    }
  };

  submitVote = (likeStatus, postID) => {
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
          this.getPosts();
        } else {
          Toast.show('Something went wrong', Toast.LONG);
        }
      })
      .catch(error => {
        console.log(error);
      });

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

  render() {
    const { customStyleIndex } = this.state;
    const progressCustomStyles = {
      backgroundColor: this.state.overall_score > 50 ? '#27AE60' : '#ef4655',
      borderRadius: 0,
      borderColor: this.state.overall_score > 50 ? '#27AE60' : '#ef4655',
      borderWidth: 2,
      barEasing: 'sin',
    };

    let size = height > width ? hp('12%') : wp('8%');
    var left = <Left style={{ flex: 1 }} />;
    var right = (
      <Right style={{ flex: 1 }}>
        <Button onPress={() => this._sideMenuDrawer.open()} transparent>
          <FontAwesomeIcon
            icon={faBars}
            color={'white'}
            size={height > width ? wp('6.5%') : wp('2.5%')}
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

                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
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
                              this.setState({ percentageReport: false });
                              this.props.navigation.navigate('pricing');
                            }}>
                            Available for VIP users only
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

          {/* Report pop-up  */}
          <Dialog
            dialogStyle={{ borderRadius: 9 }}
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
                    this.submitReport();
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

          <Navbar left={left} right={right} title="" navigation={this.props} />
          <NavigationEvents
            onDidFocus={() => {
              this.page_reloaded();
            }}
          />
          {this.state.loading == true ? (
            <View style={styles.spinner}>
              <Bars size={25} color="#11075e" />
            </View>
          ) : null}
          <View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ position: 'relative', padding: 10 }}>
                {this.state.profilePhoto != '' ? (
                  <Image
                    source={{ uri: this.state.profilePhoto }}
                    style={{
                      width: height > width ? wp('25%') : wp('8%'),
                      height: height > width ? wp('25%') : wp('8%'),
                    }}
                  />
                ) : (
                    <Image
                      source={require('../images/user.jpg')}
                      style={{
                        width: height > width ? wp('28%') : wp('8%'),
                        height: height > width ? wp('28%') : wp('8%'),
                      }}
                    />
                  )}
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: '#11075e',
                    borderRadius: 75,
                    borderColor: 'white',
                    borderWidth: 5,
                    padding: height > width ? 10 : 8,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('editProfile');
                    }}>
                    <FontAwesomeIcon
                      icon={faPencilAlt}
                      color={'white'}
                      size={height > width ? wp('4%') : wp('2%')}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.title}>{this.state.user_name}</Text>
                {this.state.country == 'undefined' ? null : (
                  <Text style={styles.innerTitle}>{this.state.country}</Text>
                )}
              </View>

            </View>
            <View
              style={{
                borderBottomColor: 'grey',
                borderBottomWidth: 1,
                marginHorizontal: 20,
                paddingTop: height > width ? 10 : 5,
              }}
            />
            <View style={{ flexDirection: 'row', paddingTop: height > width ? 10 : 5, }}>
              <View
                style={{
                  flexDirection: 'column',
                  flex: 0.35,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                <Text style={styles.title}>{this.state.totalPost}</Text>
                <Text style={styles.innerTitle}>Submitted Posts</Text>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  flex: 0.3,
                  alignItems: 'center',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={{
                      fontSize: height > width ? wp('4.5%') : wp('2.5%'),
                      fontWeight: 'bold',
                      color: '#11075e',
                      marginRight: 5,
                    }}>
                    {Number(this.state.carrots)}
                  </Text>
                  <FontAwesomeIcon
                    icon={faCarrot}
                    color={'orange'}
                    size={height > width ? wp('4.5%') : wp('2.5%')}
                    style={{ marginLeft: 5 }}
                  />
                </View>
                <Text style={styles.innerTitle}>Carrots earned</Text>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  flex: 0.35,
                  alignItems: 'center',
                }}>
                <Text style={styles.title}>{this.state.totalComments}</Text>
                <Text style={styles.innerTitle}>Total Comments</Text>
              </View>
            </View>
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <SegmentedControlTab
              values={['Post', 'Comment']}
              selectedIndex={customStyleIndex}
              onTabPress={this.handleCustomIndexSelect}
              borderRadius={0}
              tabsContainerStyle={{
                height: 50,
                backgroundColor: '#F2F2F2',
                width: '60%',

              }}
              tabStyle={{
                backgroundColor: 'white',
                borderWidth: 0,
                borderColor: 'transparent',
              }}
              activeTabStyle={{ backgroundColor: '#11075e' }}
              tabTextStyle={{
                color: '#11075e',
                fontSize: height > width ? wp('4%') : wp('1.8%'),
              }}
              activeTabTextStyle={{
                color: 'white',
                fontSize: height > width ? wp('4%') : wp('1.8%'),
              }}
            />
          </View>
          {customStyleIndex === 0 &&
            (this.state.dataSource != '' ? (
              <FlatList
                data={this.state.dataSource}
                showsHorizontalScrollIndicator={true}
                showsVerticleScrollIndicator={true}
                extraData={this.state}
                onEndReached={() => this.onLoadMoreData()}
                onEndReachedThreshold={0.01}
                bounces={false}
                renderItem={({ item,index }) => {
                  if(item.post_type == 'video'){
                  var videolink = item.link.split("=").pop();
                    if (this.videolinkarr.includes(videolink)) {
                    } else {
                      this.videolinkarr.push(videolink)
                    }   
                  } 

                  return(
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
                          resizeMode="cover"
                        />
                      </TouchableOpacity>}  
                    </View>
                    <TouchableOpacity
                       onPress={() => {
                         if(item.post_type == 'video'){
                          this.openPost(item);
                         }
                      }}
                      activeOpacity={item.post_type == 'video' ? 0.7 : 1}
                      style={{
                        paddingHorizontal: 10,
                        paddingTop: 10
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
                      {item.post_type == 'link' || item.post_type == 'video'? (
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
                          onPress={() =>
                            this.props.navigation.navigate('viewProfile', {
                              userName: item.user.name,
                              userId: item.user.id,
                            })
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
                      </View>
                      {item.text == null ? (
                        <View />
                      ) : (
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
                            marginBottom: 5,
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
                              {item.votestatus.length > 0 &&
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

                              {item.votestatus.length > 0 &&
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
                                style={{ marginLeft: 10 }}
                              />
                              <Text
                                style={{
                                  marginLeft: 5,
                                  fontSize:
                                    height > width ? wp('3.5%') : wp('1.5%'),
                                  marginRight: 10
                                }}>
                                {item.warrens[0].name}
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
                                style={{ marginRight: 8 }}
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
                                {item.votestatus.length > 0 &&
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

                                {item.votestatus.length > 0 &&
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
            ) : null)}
          {customStyleIndex === 1 &&
            (this.state.comment != '' ? (
              <FlatList
                data={this.state.comment}
                extraData={this.state}
                // ListEmptyComponent={this.ListEmpty}
                onEndReached={() => this.onLoadMoreComments()}
                onEndReachedThreshold={0.01}
                bounces={false}
                renderItem={({ item }) => (
                  <Card containerStyle={styles.card_style}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flex: 0.15 }}>
                        <View
                          style={{
                            maxHeight: height > width ? hp('8%') : hp('10%'),
                          }}>
                          <Image
                            style={{
                              width: '100%',
                              height: '100%',
                              borderTopRightRadius: 10,
                              borderBottomRightRadius: 10,
                            }}
                            source={{ uri: item.user.avatar }}
                            resizeMode="cover"
                          />
                        </View>
                      </View>
                      <View style={{ flex: 0.85, padding: 10 }}>
                        <View>
                          <Text
                            style={{
                              fontWeight: 'bold',
                              fontSize: height > width ? wp('4%') : wp('2%'),
                            }}
                            ellipsizeMode="tail"
                            numberOfLines={2}>
                            {this.state.user_name}
                          </Text>
                        </View>
                        <View>
                          <HTML
                            html={item.comment}
                            baseFontStyle={{
                              fontSize:
                                height > width ? wp('3.5%') : wp('1.8%'),
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  </Card>
                )}
                keyExtractor={({ id }, index) => id}
              />
            ) : null)}
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
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#11075e',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  title: {
    fontSize: height > width ? wp('4.5%') : wp('1.7%'),
    fontWeight: 'bold',
    color: '#11075e',
  },
  innerTitle: {
    fontSize: height > width ? wp('3.5%') : wp('1.7%'),
    color: '#11075e',
  },
  inputtype_dialog: {
    paddingLeft: 5,
    padding: 5,
    marginTop: 10,
    marginBottom: 15,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'lightgrey',
    color: 'black',
    fontSize: height > width ? wp('3.8%') : wp('2%'),
    alignItems: 'center',
    backgroundColor: 'white',
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
  tabContent: {
    color: '#444444',
    fontSize: 18,
    margin: 24,
    textAlign: 'center',
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
