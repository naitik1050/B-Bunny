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
  KeyboardAvoidingView,
} from 'react-native';
import {
  faBars,
  faCloudUploadAlt,
  faPlus,
  faPlusCircle,
  faCheckCircle,
  faAngleDown,
  faAngleUp,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';
import InputField from '../component/InputField';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import RemovableChips from 'react-native-chip/RemovableChips';
import { Autocomplete } from "react-native-dropdown-autocomplete";
import SideMenuDrawer from '../component/SideMenuDrawer';
import Navbar from '../component/NavBar';
import { Button, Left, Right } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { Form, Field } from 'react-native-validate-form';
import { Bars } from 'react-native-loader';
import { Dialog } from 'react-native-simple-dialogs';
import Toast from 'react-native-simple-toast';
import RNImagePicker from 'react-native-image-picker';
import {
  widthPercentageToDP as wp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import TreeView from 'react-native-final-tree-view';
import CheckBox from '@react-native-community/checkbox';
import Endpoint from '../res/url_endpoint';

const required = value => (value ? undefined : 'This is a required field.');
const Device = require('react-native-device-detection');

export class NewPost extends PureComponent {
  constructor(props) {
    super(props);
    console.log('props', this.props);
    this.state = {
      userDetail: '',
      token: '',
      user_id: '',
      dataSource: [],
      loading: false,
      addDialogLink: true,
      addDialogText: false,
      btnDialog: false,
      warrenRequest: false,
      addWarren: false,
      addSubWarren: false,
      postLink:
        this.props.navigation.state.params != undefined &&
          this.props.navigation.state.params.value == 0
          ? this.props.navigation.state.params.weblink
          : '',
      postText: '',
      postTitle: '',
      searchText: '',
      sortBy: 'created_at',
      SubWarren: [],
      showSubwarren: false,
      selected: '',
      hasError: false,
      subwarrenValue: '',
      inputCategory: '',
      warrenName: '',
      listWarrens: [],
      query: '',
      checked: false,
      customStyleIndex:
        this.props.navigation.state.params != undefined
          ? this.props.navigation.state.params.value
          : 0,
      image: '',
      img_uri: '',
      imageName:
        this.props.navigation.state.params != undefined &&
          this.props.navigation.state.params.value == 1
          ? this.props.navigation.state.params.fileName
          : '',
      imageText: '',
      arrayInsert: [],
      selectedWarren: [],
      addName: [],
      addId: [],
      errors: [],
      selectedItems: [],
      singlecategory: [],
      singlecategoryid: "",
      warrenid: []
    };
    this.addName = [];
    this.selectedCategories = [];
    this._retrieveData();
    this.getTitle = this.getTitle.bind(this);
    this.WarrenID = [];
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
        console.log('valueRecieve', valueRecieve);
        this.setState({
          user_id: valueRecieve.user_id,
          token: valueRecieve.token,
        });
        this.getNewPostData();
        if (this.state.postLink != '') {
          this.getTitle(this.state.postLink);
        }
      }
    } catch (error) {
      alert(error);
    }
  };

  getNewPostData = () => {
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
            dataSource: JSON.parse(
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

  resetAll = () => {
    this.addName = [];
    this._retrieveData();
    this.setState({
      selectedWarren: [],
      addId: [],
    });
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

  onCancelPopup = () => {
    this.state.singlecategory = this.addName;
    this.addName = [];
    this.state.addId = [];

    if (this.state.singlecategory.toString() != "") {
      for (var j = 0; j < this.state.singlecategory.length; j++) {
        this.selectedCategories.push(this.state.singlecategory[j]);
      }
      this.setState({ selectedWarren: this.selectedCategories.toString(), singlecategory: [] });
    }
    this.setState({ btnDialog: false });
  };

  submitForm = () => {
    let submitResults = this.myForm.validate();
    let errors = [];

    if (this.state.imageText == '') {
      this.setState({ hasError: true, imageText: 'Image is required' });
    }

    submitResults.forEach(item => {
      errors.push({ field: item.fieldName, error: item.error });
    });
    this.setState({ errors: errors });
  };

  linkSubmitFailed = () => {
    console.log('Link Faield!');
  };
  textSubmitFailed = () => {
    console.log('Text Faield!');
  };
  imageSubmitFailed = () => {
    console.log('Image Faield!');
  };

  link = () => {
    this.setState({ loading: true });
    var data = new FormData();
    data.append('type', 'link');
    data.append('link', this.state.postLink);
    data.append('title', this.state.postTitle);
    data.append('warren_id', (this.state.warrenid).toString());

    console.log(data);
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    console.log(headers);
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
          this.WarrenID = [];
          this.selectedCategories = [];
          this.setState({
            loading: false,
            selectedWarren: [],
            postTitle: '',
            postLink: '',
            postText: '',
            query: '',
            addId: [],
            warrenid: []
          });
        } else {
          this.setState({ loading: false });
          Toast.show(responseJson.msg, Toast.LONG);
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({ loading: false });
      });
  };
  text = () => {
    this.setState({ loading: true });
    var data = new FormData();
    data.append('type', 'text');
    data.append('title', this.state.postTitle);
    data.append('text', this.state.postText);
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
    data.append('warren_id', (this.state.warrenid).toString());
    console.log(data);
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    console.log(headers);
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
          this.WarrenID = [];
          this.setState({
            loading: false,
            selectedWarren: '',
            postTitle: '',
            postText: '',
            query: '',
            image: '',
            imageName: '',
            addId: [],
            warrenid: []
          });
        } else {
          this.setState({ loading: false });
          Toast.show(responseJson.msg, Toast.LONG);
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({ loading: false });
      });
  };

  image = () => {
    this.setState({ loading: true });
    var data = new FormData();

    data.append('type', 'video');
    data.append('video', this.state.postLink);
    data.append('title', this.state.postTitle);
    data.append('warren_id', (this.state.warrenid).toString());

    // data.append('image', {
    //   name: this.state.image.fileName,
    //   type: this.state.image.type,
    //   uri:
    //     Platform.OS === 'android'
    //       ? this.state.image.uri
    //       : this.state.image.uri.replace('file://', ''),
    // });

    console.log("Video Data", data);
    var headers = new Headers();
    let auth = 'Bearer ' + this.state.token;
    headers.append('Authorization', auth);
    console.log(headers);
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
          console.log("Video responseJson", responseJson);
          Toast.show(responseJson.msg, Toast.LONG);
          this.WarrenID = [];
          this.setState({
            loading: false,
            selectedWarren: '',
            imageName: '',
            postText: '',
            query: '',
            image: '',
            addId: [],
            warrenid: []
          });
        } else {
          this.setState({ loading: false });
          Toast.show(responseJson.msg, Toast.LONG);
        }
      })
      .catch(error => {
        this.setState({ loading: false });
        console.log(error);
      });
  };

  handleCustomIndexSelect = index => {
    this.setState(prevState => ({ ...prevState, customStyleIndex: index }));
    this._retrieveData();
  };

  getTitle = postLink => {
    if (postLink.includes('https')) {
      this.setState({ postLink: postLink });
      var headers = new Headers();
      let auth = 'Bearer ' + this.state.token;
      headers.append('Authorization', auth);
      var data = new FormData();
      data.append('link', postLink);
      console.log('link', data);
      fetch(Endpoint.endPoint.url + Endpoint.endPoint.fetchPostTitle, {
        method: 'POST',
        headers: headers,
        body: data,
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log("RESPONSE", responseJson);
          this.setState({ loading: false });
          if (responseJson.status == true) {
            this.setState({ postTitle: responseJson.data.title });
          }
          else if (postLink.length > 5) {
            Toast.show('Please enter the Valid URL', Toast.LONG);
          }
          else {
            Toast.show('Something went wrong', Toast.LONG);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
    else {
      this.setState({ postLink: postLink })
      Toast.show('Please enter valid URL link.', Toast.LONG);
    }
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

  findWarrens = async query => {
    //method called everytime when we change the value of the input

    if (query === '') {
      return [];
    } else {
      // const regex = new RegExp(query.trim(), 'i');
      var headers = new Headers();
      let auth = 'Bearer ' + this.state.token;
      headers.append('Authorization', auth);

      let response = await fetch(
        Endpoint.endPoint.url +
        Endpoint.endPoint.warrenWithChildren +
        '?q=' +
        query,
        {
          method: 'GET',
          headers: headers,
        },
      );

      let json = await response.json();
      this.state.listWarrens = json.data;
      // console.log("RETURN :" + JSON.stringify(json.data));
      return this.state.listWarrens;
    }
    // if (query === '') {
    //   //if the query is null then return blank
    //   return [];
    // } else {
    //   //making a case insensitive regular expression to get similar value from the film json
    //   const regex = new RegExp(query.trim(), 'i');
    //   const { listWarrens } = this.state;
    //   var headers = new Headers();
    //   let auth = 'Bearer ' + this.state.token;
    //   headers.append('Authorization', auth);
    //   fetch(
    //     Endpoint.endPoint.url +
    //     Endpoint.endPoint.warrenWithChildren +
    //     '?q=' +
    //     query,
    //     {
    //       method: 'GET',
    //       headers: headers,
    //     },
    //   )
    //     .then(response => response.json())
    //     .then(responseJson => {
    //       this.setState({ loading: false });
    //       if (responseJson) {
    //         this.setState({ listWarrens: responseJson.data });
    //       } else {
    //         alert('Something went wrong');
    //       }
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    //   //return the filtered film array according the query from the input
    //   return listWarrens.filter(warren => warren.name.search(regex) >= 0);
    // }
  };

  autocomplete = index => event => {
    let name = event.name;
    if (this.selectedCategories.includes(name)) {
      Toast.show("Category already exists", Toast.LONG);
    } else {
      this.selectedCategories.push(event.name);
      this.WarrenID.push(event.id);
      console.log("WarrenID", this.WarrenID);
      this.setState({ warrenid: this.WarrenID })
      this.componentWillMount();
    }
  }

  componentWillMount() {
    this.setState({ selectedWarren: this.selectedCategories.toString(), warrenid: this.WarrenID });
  }

  removechips = (chips, index, array) => {
    this.selectedCategories.splice(index, 1);
    this.WarrenID.splice(index, 1);
    this.componentWillMount();
  }

  render() {
    const { customStyleIndex } = this.state;
    // const { query } = this.state;
    // const listWarrens = this.findWarrens(query);
    // const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
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
          <Navbar
            left={left}
            right={right}
            title="title"
            navigation={this.props}
          />
          {this.state.loading == true ? (
            <View style={styles.spinner}>
              <Bars size={25} color="#11075e" />
            </View>
          ) : null}
          {/* Tree View */}
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
            title="Category Tree"
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
                  data={this.state.dataSource}
                  renderNode={({ node, level, isExpanded, hasChildrenNodes }) => {
                    return (
                      <View>
                        {isExpanded == true ? (
                          <View
                            style={{
                              backgroundColor: '#11075e',
                              flexDirection: 'row',
                              paddingVertical: 5,
                              paddingHorizontal: 10,
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                            <View>
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
                                <Text style={{ color: 'white' }}>
                                  {node.label.includes('&amp;')
                                    ? node.label.replace('&amp;', '&')
                                    : node.label}
                                </Text>
                              </Text>
                            </View>
                            <TouchableOpacity
                              style={{ alignItems: 'center' }}
                              onPress={() => {
                                console.log('node', node.id);

                                if (level >= 0) {
                                  if (
                                    this.addName.includes(node.label) &&
                                    this.state.addId.includes(node.id)
                                  ) {
                                    this.addName.pop(node.label);
                                    this.state.addId.pop(node.id);
                                  } else {
                                    this.addName.push(node.label);
                                    this.state.addId.push(node.id);
                                  }
                                }
                              }}>
                              <FontAwesomeIcon
                                icon={faCheckCircle}
                                color={'white'}
                                size={height > width ? wp('4.5%') : wp('2%')}
                              />
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <View
                            style={{
                              backgroundColor: '#e5e5f9',
                              flexDirection: 'row',
                              paddingVertical: 5,
                              paddingHorizontal: 10,
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                            <TouchableOpacity
                              onPress={() => {
                                console.log('node', node.id);

                                if (level >= 0) {
                                  if (
                                    this.addName.includes(node.label) &&
                                    this.state.addId.includes(node.id)
                                  ) {
                                    this.addName.pop(node.label);
                                    this.state.addId.pop(node.id);
                                  } else {
                                    if (!this.state.addId.includes(node.id) && !this.selectedCategories.includes(node.label)) {
                                      this.addName.push(node.label);
                                      this.state.addId.push(node.id);
                                      this.WarrenID.push(node.id);
                                      console.log("NODE==>", node.id);
                                      console.log("WarrenID", this.WarrenID);
                                      this.setState({ warrenid: this.WarrenID })
                                    }
                                    else {
                                      Toast.show("Category already exists", Toast.LONG);
                                    }
                                  }
                                }
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
                                <Text style={{ color: '#11075e' }}>
                                  {node.label.includes('&amp;')
                                    ? node.label.replace('&amp;', '&')
                                    : node.label}
                                </Text>
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{ alignItems: 'center' }}
                              onPress={() => {
                                console.log('node', node.id);

                                if (level >= 0) {
                                  if (
                                    this.addName.includes(node.label) &&
                                    this.state.addId.includes(node.id)
                                  ) {
                                    this.addName.pop(node.label);
                                    this.state.addId.pop(node.id);
                                  } else {
                                    if (!this.state.addId.includes(node.id) && !this.selectedCategories.includes(node.label)) {
                                      this.addName.push(node.label);
                                      this.state.addId.push(node.id);
                                      this.WarrenID.push(node.id);
                                      console.log("NODE==>", node.id);
                                      console.log("WarrenID", this.WarrenID);
                                      this.setState({ warrenid: this.WarrenID })
                                    }
                                    else {
                                      Toast.show("Category already exists", Toast.LONG);
                                    }
                                  }
                                }
                              }}>
                              <FontAwesomeIcon
                                icon={faCheckCircle}
                                color={'#11075e'}
                                size={height > width ? wp('4.5%') : wp('2%')}
                              />
                            </TouchableOpacity>
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

          {/* Add Warren Request */}
          <Dialog
            dialogStyle={{
              borderRadius: 9,
              backgroundColor: '#e5e5f9',
              height: '80%',
            }}
            titleStyle={{
              color: '#11075e',
              borderBottomWidth: 1,
              fontSize: height > width ? wp('3.8%') : wp('1.8%'),
              borderBottomColor: '#11075e',
              paddingBottom: 10,
            }}
            visible={this.state.warrenRequest}
            title="Add sub category"
            onTouchOutside={() => this.setState({ warrenRequest: false })}
            onRequestClose={() => {
              this.setState({ warrenRequest: false });
            }}>
            <ScrollView style={{ height: '80%' }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 15,
                  alignContent: 'center',
                  alignItems: 'center',
                  marginLeft: height > width ? 12 : 10,
                }}>
                <FontAwesomeIcon
                  icon={faPlus}
                  color={'#11075e'}
                  size={height > width ? wp('4.5%') : wp('1.5%')}
                />
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      addWarren: true,
                      checked: false,
                    });
                  }}>
                  <Text
                    style={{
                      fontSize: height > width ? wp('4.5%') : wp('1.8%'),
                      color: '#11075e',
                      marginLeft: 10,
                    }}>
                    Add new
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                }}>
                <TreeView
                  data={this.state.dataSource}
                  renderNode={({ node, level, isExpanded, hasChildrenNodes }) => {
                    return (
                      <View>
                        {isExpanded == true ? (
                          <View
                            style={{
                              backgroundColor: '#11075e',
                              flexDirection: 'row',
                              paddingVertical: 5,
                              paddingHorizontal: 10,
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                            <View>
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
                                <Text style={{ color: 'white' }}>
                                  {node.label.includes('&amp;')
                                    ? node.label.replace('&amp;', '&')
                                    : node.label}
                                </Text>
                              </Text>
                            </View>
                            <TouchableOpacity
                              style={{ marginLeft: 15 }}
                              onPress={() => {
                                this.setState({
                                  addSubWarren: true,
                                  selected: node.label,
                                });
                              }}>
                              <FontAwesomeIcon
                                icon={faPlusCircle}
                                color={'white'}
                                size={height > width ? wp('4.5%') : wp('2%')}
                              />
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <View
                            style={{
                              backgroundColor: '#e5e5f9',
                              flexDirection: 'row',
                              paddingVertical: 5,
                              paddingHorizontal: 10,
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                            <View>
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
                                <Text style={{ color: '#11075e' }}>
                                  {node.label.includes('&amp;')
                                    ? node.label.replace('&amp;', '&')
                                    : node.label}
                                </Text>
                              </Text>
                            </View>
                            <TouchableOpacity
                              style={{ marginLeft: 15 }}
                              onPress={() => {
                                this.setState({
                                  addSubWarren: true,
                                  selected: node.label,
                                });
                              }}>
                              <FontAwesomeIcon
                                icon={faPlusCircle}
                                color={'#11075e'}
                                size={height > width ? wp('4.5%') : wp('2%')}
                              />
                            </TouchableOpacity>
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
                  this.setState({ warrenRequest: false });
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

          {/* Add Category */}
          <Dialog
            dialogStyle={{ borderRadius: 9 }}
            titleStyle={{
              fontWeight: 'bold',
              color: '#11075e',
              fontSize: height > width ? wp('3.8%') : wp('1.8%'),
            }}
            visible={this.state.addSubWarren}
            title={'Add Category to ' + this.state.selected}
            onTouchOutside={() => this.setState({ addSubWarren: false })}
            onRequestClose={() => {
              this.setState({ addSubWarren: false });
            }}>
            <View>
              <Text
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: height > width ? wp('3.8%') : wp('1.8%'),
                }}>
                Name:
              </Text>
              <TextInput
                style={styles.inputtype_dialog}
                placeholder=""
                placeholderTextColor="grey"
                numberOfLines={1}
                onChangeText={warrenName =>
                  this.setState({ warrenName: warrenName })
                }
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                  alignContent: 'center',
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontWeight: 'bold',
                    fontSize: height > width ? wp('4.2%') : wp('1.8%'),
                  }}>
                  Private Warren{' '}
                </Text>
                <CheckBox
                  title="test"
                  checked={this.state.checked}
                  value={this.state.checked}
                  onValueChange={() => {
                    this.setState({ checked: !this.state.checked });
                  }}
                />
              </View>
              {this.state.checked == true ? (
                <View>
                  <View
                    style={{
                      marginTop: 15,
                      marginBottom: 5,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: height > width ? wp('3.8%') : wp('1.8%'),
                      }}>
                      Evidence: *
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.opencamera();
                      }}>
                      <FontAwesomeIcon
                        icon={faCloudUploadAlt}
                        color={'black'}
                        size={height > width ? wp('6.5%') : wp('2.5%')}
                        style={{ marginLeft: 15 }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{ marginBottom: 15, alignItems: 'center' }}>
                    <Text
                      style={{
                        color: 'black',
                        fontWeight: '600',
                        fontSize: height > width ? wp('3.8%') : wp('1.8%'),
                      }}>
                      {this.state.imageName}
                    </Text>
                  </View>
                </View>
              ) : null}
              <TouchableOpacity
                style={styles.addWarrenRequest}
                onPress={() => {
                  this.add_warren();
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
          </Dialog>

          {/* Create Warren */}
          <Dialog
            dialogStyle={{ borderRadius: 9 }}
            titleStyle={{ fontWeight: 'bold', color: '#11075e' }}
            visible={this.state.addWarren}
            title="Create Warren"
            onTouchOutside={() => this.setState({ addWarren: false })}>
            <View>
              <Text
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: height > width ? wp('3.8%') : wp('2%'),
                }}>
                Name:
              </Text>
              <TextInput
                style={styles.inputtype_dialog}
                placeholder=""
                placeholderTextColor="grey"
                numberOfLines={1}
                onChangeText={warrenName =>
                  this.setState({ warrenName: warrenName })
                }
              />
              <TouchableOpacity
                style={styles.addWarrenRequest}
                onPress={() => {
                  this.add_warren();
                }}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    fontSize: height > width ? wp('4.5%') : wp('1.8%'),
                  }}>
                  Create Warren
                </Text>
              </TouchableOpacity>
            </View>
          </Dialog>

          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="always">
            <KeyboardAvoidingView>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <SegmentedControlTab
                  // values={['Link', 'Text', 'Image']}
                  values={['Link', 'Ask a question', 'Video']}
                  selectedIndex={customStyleIndex}
                  onTabPress={this.handleCustomIndexSelect}
                  borderRadius={0}
                  tabsContainerStyle={{
                    height: 50,
                    backgroundColor: '#F2F2F2',
                    width: '90%',
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
              {customStyleIndex === 0 && (
                <View style={{ alignSelf: 'center', marginTop: 10 }}>
                  <Form
                    ref={ref => (this.myForm = ref)}
                    validate={true}
                    submit={() => this.link()}
                    failed={() => this.linkSubmitFailed()}
                    errors={this.state.errors}>



                    {/* <TouchableOpacity style={{ position: 'absolute', right: 0, }}>
                      <Text style={{ color: 'red', letterSpacing: 0.8, fontSize: height > width ? wp('3.8%') : wp('2%') }}>Clear</Text>
                    </TouchableOpacity> */}


                    <Field
                      required
                      component={InputField}
                      validations={[required]}
                      name="Link"
                      // defaultValue={this.state.postLink}
                      value={this.state.postLink}
                      onChangeText={postLink => {
                        this.getTitle(postLink);
                      }}
                      customStyle={styles.inputtype_css}
                      placeholder="Link"
                      placeholderTextColor="grey"
                      numberOfLines={1}
                      multiline={true}
                    />

                    <Field
                      required
                      component={InputField}
                      validations={[required]}
                      name="Title"
                      value={this.state.postTitle}
                      onChangeText={postTitle =>
                        this.setState({ postTitle: postTitle })
                      }
                      customStyle={styles.inputtype_css}
                      placeholder="Title"
                      placeholderTextColor="grey"
                      numberOfLines={1}
                      multiline={true}
                    />
                  </Form>
                </View>
              )}
              {customStyleIndex === 1 && (
                <View style={{ alignSelf: 'center', marginTop: 10 }}>
                  <Form
                    ref={ref => (this.myForm = ref)}
                    validate={true}
                    submit={() => this.text()}
                    failed={() => this.textSubmitFailed()}
                    errors={this.state.errors}>
                    <Field
                      required
                      component={InputField}
                      validations={[required]}
                      name="Title"
                      value={this.state.postTitle}
                      onChangeText={postTitle =>
                        this.setState({ postTitle: postTitle })
                      }
                      customStyle={styles.inputtype_css}
                      placeholder="Title"
                      placeholderTextColor="grey"
                      numberOfLines={1}
                      multiline={true}
                    />
                    <Field
                      required
                      component={InputField}
                      validations={[required]}
                      name="Text"
                      value={this.state.postText}
                      onChangeText={postText =>
                        this.setState({ postText: postText })
                      }
                      customStyle={styles.inputtype_css}
                      placeholder="Text"
                      placeholderTextColor="grey"
                      numberOfLines={3}
                      multiline={true}
                    />
                    <TouchableOpacity
                      style={{
                        backgroundColor: 'lightgrey',
                        marginTop: 20,
                        borderRadius: 10,
                        width: wp('90%'),
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
                  </Form>
                </View>
              )}
              {customStyleIndex === 2 && (
                <View style={{ alignSelf: 'center', marginTop: 10 }}>
                  <Form
                    ref={ref => (this.myForm = ref)}
                    validate={true}
                    submit={() => this.image()}
                    failed={() => this.imageSubmitFailed()}
                    errors={this.state.errors}>

                    <Field
                      required
                      component={InputField}
                      validations={[required]}
                      name="Link"
                      // defaultValue={this.state.postLink}
                      value={this.state.postLink}
                      onChangeText={postLink => {
                        this.getTitle(postLink);
                      }}
                      customStyle={styles.inputtype_css}
                      placeholder="Video Link"
                      placeholderTextColor="grey"
                      numberOfLines={1}
                      multiline={true}
                    />

                    <Field
                      required
                      component={InputField}
                      validations={[required]}
                      name="Title"
                      value={this.state.postTitle}
                      onChangeText={postTitle =>
                        this.setState({ postTitle: postTitle })
                      }
                      customStyle={styles.inputtype_css}
                      placeholder="Title"
                      placeholderTextColor="grey"
                      numberOfLines={1}
                      multiline={true}
                    />
                    {/* <View>
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
                      <View>
                        {this.state.hasError == true ? (
                          <Text style={{ color: 'red', marginLeft: 5 }}>
                            {this.state.imageText}
                          </Text>
                        ) : null}
                      </View>
                    </View> */}
                    {/* <Field
                      required
                      component={InputField}
                      validations={[required]}
                      name="Text"
                      value={this.state.postText}
                      onChangeText={text => this.setState({ postText: text })}
                      customStyle={styles.inputtype_css}
                      numberOfLines={1}
                      multiline={true}
                      placeholder="Text"
                      placeholderTextColor="grey"
                      errors={this.state.errors}
                    /> */}
                  </Form>
                </View>
              )}
              <View style={{ alignSelf: 'center', marginVertical: 10 }}>
                <Text
                  style={{
                    color: '#11075e',
                    fontWeight: 'bold',
                    marginTop: 20,
                    textAlign: 'left',
                    fontSize: height > width ? wp('4%') : wp('2%'),
                  }}>
                  Select Category:
                </Text>
                <View
                  style={{
                    zIndex: 1,
                    width: wp('90%'),
                    borderColor: 'grey',
                    borderWidth: 1,
                    marginTop: 20,
                    backgroundColor: 'white'
                  }}>
                  <Autocomplete
                    ref={"category"}
                    spinnerColor={'#11075e'}
                    style={styles.input}
                    handleSelectItem={this.autocomplete(this.index)}
                    onDropdownShow={() => onDropdownShow()}
                    placeholder="Type a category"
                    placeholderTextColor="black"
                    noDataTextStyle={{ fontSize: 20 }}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={{ marginLeft: -35, fontSize: Device.isPhone ? wp('5.0%') : Device.isTablet ? wp('2.5%') : null, }}
                    fetchData={async (queryfetch) => {
                      return await this.findWarrens(queryfetch)
                    }}
                    minimumCharactersCount={0}
                    highlightText

                    valueExtractor={item => item.name}
                    rightContent
                    rightTextExtractor={item => item.properties}
                  />
                  {/* <Autocomplete
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
                      minWidth: wp('90%'),
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
                    defaultValue={this.state.query}
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
                          this.setState(
                            {
                              query: item.name,
                              query: ""
                            },
                            () => {
                              this.state.selectedWarren.push(item.name);
                              this.state.addId.push(item.id);
                            },
                          )
                        }>
                        <Text style={styles.itemText}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                    flatListProps={{
                      nestedScrollEnabled: true,
                    }}
                  /> */}
                </View>
                <TouchableOpacity
                  style={styles.btnCss}
                  onPress={() => {
                    this.setState({ btnDialog: true, query: '' });
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: Device.isPhone
                        ? wp('4.5%')
                        : Device.isTablet
                          ? wp('2.5%')
                          : null,
                      textAlign: 'center',
                      padding: 10,
                    }}>
                    Select a category from the tree
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnCss}
                  onPress={() => {
                    this.setState({ warrenRequest: true });
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: Device.isPhone
                        ? wp('4.5%')
                        : Device.isTablet
                          ? wp('2.5%')
                          : null,
                      textAlign: 'center',
                      padding: 10,
                    }}>
                    Request additional category
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnCss}
                  onPress={() => {
                    this.resetAll();
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: Device.isPhone
                        ? wp('4.5%')
                        : Device.isTablet
                          ? wp('2.5%')
                          : null,
                      textAlign: 'center',
                      padding: 10,
                    }}>
                    Reset all
                  </Text>
                </TouchableOpacity>
                {/* <TextInput
                  style={styles.inputtype_dialog_fix}
                  placeholder=""
                  placeholderTextColor="grey"
                  numberOfLines={5}
                  multiline={true}
                  value={this.state.selectedWarren.toString()}
                /> */}

                {this.state.selectedWarren != "" ?
                  <View style={{ width: wp('90%') }}>
                    <RemovableChips
                      style={{ marginTop: 10 }}
                      initialChips={this.state.selectedWarren != null && this.state.selectedWarren != '' ?
                        this.state.selectedWarren.includes(',')
                          ? this.state.selectedWarren.split(",")
                          : [this.state.selectedWarren] :
                        []
                      }
                      // alertRequired={true}
                      onChangeChips={(chips, index, array) => this.removechips(chips, index, array)} />
                  </View> : null}

                <TouchableOpacity
                  style={{
                    backgroundColor: '#1e7e34',
                    marginTop: 20,
                    width: wp('90%'),
                    alignSelf: 'center',
                  }}
                  onPress={() => {
                    this.submitForm();
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: Device.isPhone
                        ? wp('4.5%')
                        : Device.isTablet
                          ? wp('2.5%')
                          : null,
                      textAlign: 'center',
                      padding: 10,
                    }}>
                    Submit Post
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </SideMenuDrawer>
    );
  }
}

export default NewPost;
var { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    position: 'relative',
  },
  inputtype_css: {
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 1,
    paddingLeft: 10,
    paddingVertical: 10,
    marginTop: 20,
    textAlignVertical: 'top',
    width: wp('90%'),
    color: 'black',
    flexWrap: 'wrap',
    fontSize: Device.isPhone ? wp('4.5%') : Device.isTablet ? wp('2.5%') : null,
  },
  autocompleteContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    paddingLeft: 5,
    width: wp('90%'),
    borderColor: 'grey',
  },
  itemText: {
    color: 'grey',
    fontSize: Device.isPhone ? wp('4.5%') : Device.isTablet ? wp('2.5%') : null,
  },
  btnCss: {
    backgroundColor: '#007bff',
    marginTop: 20,
    width: wp('90%'),
    alignSelf: 'center',
    // borderRadius: 5
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
  inputtype_dialog: {
    paddingLeft: 5,
    padding: 5,
    marginTop: 20,
    marginBottom: 15,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'lightgrey',
    color: 'black',
    fontSize: height > width ? wp('3.8%') : wp('2%'),
    alignItems: 'center',
    backgroundColor: 'white',
  },
  inputtype_dialog_fix: {
    paddingLeft: 5,
    padding: 5,
    marginTop: 20,
    width: wp('90%'),
    textAlignVertical: 'top',
    color: 'black',
    fontSize: height > width ? wp('3.8%') : wp('2%'),
    alignItems: 'center',
    backgroundColor: 'lightgrey',
  },
  submitPost: {
    borderRadius: 5,
    backgroundColor: '#11075e',
    padding: 10,
    paddingLeft: 25,
    paddingRight: 25,
    margin: 5,
  },
  CancelPost: {
    borderRadius: 5,
    backgroundColor: 'white',
    padding: 10,
    paddingLeft: 25,
    paddingRight: 25,
    borderColor: '#11075e',
    borderWidth: 1,
    margin: 5,
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
  addWarrenRequest: {
    borderRadius: 5,
    backgroundColor: '#11075e',
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    alignSelf: 'center',
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
  inputContainer: {
    display: "flex",
    flexShrink: 0,
    flexGrow: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingLeft: 5,
    width: wp('90%') - 5,
    textAlignVertical: 'top',
    color: 'black',
    fontSize: Device.isPhone ? wp('4.5%') : Device.isTablet ? wp('2.5%') : null,
  },
});
