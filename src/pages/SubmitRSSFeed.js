import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import {
  faArrowLeft,
  faAngleDown,
  faAngleUp,
  faCheckCircle,
  faAngleRight,
  faPlus,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import InputField from '../component/InputField';
import EventTextField from '../component/EventTextField';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { Dialog } from 'react-native-simple-dialogs';
import { Form, Field } from 'react-native-validate-form';
import { Header, Body, Title, Left, Button, Right } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { Bars } from 'react-native-loader';
import Endpoint from '../res/url_endpoint';
import Toast from 'react-native-simple-toast';
// import Autocomplete from 'react-native-autocomplete-input';
import { Autocomplete } from "react-native-dropdown-autocomplete";
import RemovableChips from 'react-native-chip/RemovableChips';
import TreeView from 'react-native-final-tree-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

const required = value => (value ? undefined : 'This is a required field.');

const Device = require('react-native-device-detection');

const windowWidth = Dimensions.get('window').width;

export class SubmitRSSFeed extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userDetail: '',
      token: '',
      user_id: '',
      webName: "",
      feedLink: "",
      category: [],
      dataSource: [],
      listWarrens: [],
      selectedWarren: [],
      selectedWarren1: [],
      loading: false,
      customStyleIndex: 0,
      query: '',
      btnDialog: false,
      addName: [],
      addId: [],
      selectedItems: [],
      valueArray: [{ webName: '', feedLink: '', category: [] }],
      disabled: false,
      singleErrors: [],
      multipleErrors: [],
      singlecategory: [],
      singlecategoryerror: false,
      singlecategoryid: "",
      warrenId: []
    };
    this.addName = [];
    this.selectedCategories = [];
    this.index = 0;
    this._retrieveData();
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
        this.getWarrenList();
      }
    } catch (error) {
      alert(error);
    }
  };

  getWarrenList = () => {
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
    this.selectedCategories = [];
    this._retrieveData();
    this.setState({
      selectedWarren1: [],
      selectedWarren: [],
      addId: [],
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
      this.setState({ selectedWarren1: this.selectedCategories.toString(), singlecategory: [] });
    }
    this.setState({ btnDialog: false });
  };

  handleChange = index => event => {

    console.log('event', event);
    const newValueArray = this.state.valueArray.map((valueArray, vindex) => {

      if (index !== vindex) return valueArray;
      if (event.name == 'webName') return { ...valueArray, webName: event.text };
      if (event.name == 'feedLink')
        return { ...valueArray, feedLink: event.text };
      else {

        this.setState(
          () => {
            if (this.state.selectedWarren.length > index) {
              var indexString = this.state.selectedWarren[index];
              if (this.state.selectedWarren[index].includes(event.name)) {
                Toast.show("Category already exists", Toast.LONG);
              } else {
                if (indexString != null && indexString != '') {
                  indexString = indexString + "," + event.name;
                } else {
                  indexString = event.name;
                }
                this.state.selectedWarren[index] = indexString;
              }

            } else {
              this.state.selectedWarren[index] = event.name;
            }

          },
        )
        console.log("ddd", this.state.selectedWarren)
        return { ...valueArray, category: this.state.selectedWarren[index].split(",") };
      }
    });

    this.setState({ valueArray: newValueArray });
    console.log('valueArray', newValueArray);
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
      console.log("RETURN :" + JSON.stringify(json.data));
      return this.state.listWarrens;
    }
  };
  // findWarrens = query => {
  //   // console.log("QQQ", query)
  //   // if (query === '') {
  //   //   return [];
  //   // } else {
  //   //   const regex = new RegExp(query.trim(), 'i');
  //   //   const { listWarrens } = this.state;
  //   //   var headers = new Headers();
  //   //   let auth = 'Bearer ' + this.state.token;
  //   //   headers.append('Authorization', auth);
  //   //   fetch(
  //   //     Endpoint.endPoint.url +
  //   //     Endpoint.endPoint.warrenWithChildren +
  //   //     '?q=' +
  //   //     query,
  //   //     {
  //   //       method: 'GET',
  //   //       headers: headers,
  //   //     },
  //   //   )
  //   //     .then(response => response.json())
  //   //     .then(responseJson => {
  //   //       console.log(responseJson.data)
  //   //       this.setState({ loading: false });
  //   //       if (responseJson) {
  //   //         this.setState({ listWarrens: responseJson.data });
  //   //       } else {
  //   //         alert('Something went wrong');
  //   //       }
  //   //     })
  //   //     .catch(error => {
  //   //       console.log(error);
  //   //     });
  //   //   return listWarrens.filter(warren => warren.name.search(regex) >= 0);
  //   // }
  // };

  handleCustomIndexSelect = index => {
    this.setState(prevState => ({ ...prevState, customStyleIndex: index }));
    this._retrieveData();
  };

  handleAddClick = index => {
    this.setState({
      valueArray: this.state.valueArray.concat([{ webName: '', feedLink: '', category: [] }]),
    });
  };

  handleRemoveClick = (index) => {
    let newSelected = this.state.selectedWarren
    newSelected[index] = [];
    this.setState({
      valueArray: this.state.valueArray.filter(
        (data, vindex) => index !== vindex,
      ),
      selectedWarren: newSelected
    });
  };

  singleSubmitForm = () => {
    console.log("this.myForm==>", this.myForm)
    let submitResults = this.myForm.validate();
    let singleErrors = [];

    submitResults.forEach(item => {
      singleErrors.push({ field: item.fieldName, error: item.error });
    });
    this.setState({ singleErrors: singleErrors });
  };

  singleSubmitFailed() {
    console.log('Login Faield!');
  }


  submitSingleRSSFeed() {

    console.log("Website Name==>", this.state.webName.toString());
    console.log("Title Name==>", this.state.feedLink.toString());
    console.log("warren_id==>", this.state.warrenId.toString());

    if (this.state.selectedWarren1 == "") {
      this.setState({ singlecategoryerror: true })
    }
    else {
      this.setState({ singlecategoryerror: false })
      console.log("Category==>", this.state.selectedWarren1);

      this.setState({ loading: true });
      var headers = new Headers();
      let auth = 'Bearer ' + this.state.token;
      headers.append('Authorization', auth);
      console.log(headers);
      var data = new FormData();
      data.append('name', this.state.webName.toString());
      data.append('link', this.state.feedLink.toString());
      data.append('warren_id', this.state.warrenId.toString());
      data.append('type', 'Public');
      data.append('active', 1);
      console.log(data);
      fetch(Endpoint.endPoint.url + 'feedlink', {
        method: 'POST',
        headers: headers,
        body: data,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("responseJsonRSS", responseJson);
          this.setState({ loading: false });
          if (responseJson.status == true) {
            Toast.show(responseJson.msg, Toast.LONG);
            this._retrieveData();
          } else {
            Toast.show('Something went wrong', Toast.LONG);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }


  submitMultipleRSSFeed() {
    const { valueArray } = this.state;
    console.log("valueArray==>", valueArray);
  }

  autocomplete = index => event => {
    let name = event.name;
    console.log("event", event)
    console.log("index", index)
    console.log("aaa1", this.selectedCategories)
    if (this.selectedCategories.includes(name)) {
      Toast.show("Category already exists", Toast.LONG);
    } else {
      this.selectedCategories.push(event.name);
      this.state.addId.push(event.id)
      this.componentWillMount();
    }
  }

  componentWillMount(multipleindex, index, selectedWarren1) {
    if (multipleindex == 0) {
      let newValueArray = this.state.valueArray
      newValueArray[index].category = this.state.selectedWarren[index]
      this.setState({ selectedWarren: this.state.selectedWarren, valueArray: newValueArray });
      console.log("valueArray", this.state.selectedWarren)
    } else {
      this.setState({ selectedWarren1: this.selectedCategories.toString() });
      this.setState({ warrenId: this.state.addId })
      console.log("componentWillMount ===> ", this.state.selectedWarren1)
    }
  }

  removechips = (chips, index, array) => {
    this.selectedCategories.splice(index, 1);
    this.state.addId.splice(index, 1);
    this.componentWillMount();
  }

  removechipsmultiple = (chips, index1, array, index) => {
    var indexString = this.state.selectedWarren[index];
    console.log("delee", indexString + " and index : " + index1)
    let newList = []
    if (indexString != null && indexString.includes(',')) {
      newList = indexString.split(',');
      newList.splice(index1, 1)
    }
    console.log("delee1", newList)
    this.state.selectedWarren[index] = newList

    console.log("selected", this.state.selectedWarren)
    this.componentWillMount(0, index, this.state.selectedWarren);

  }



  render() {
    const { customStyleIndex } = this.state;
    const { query } = this.state;
    let listWarrens = this.findWarrens(query);
    console.log('listWarrens', listWarrens);

    // const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    let newArray = this.state.valueArray.map((data, index) => {

      return (
        <View style={{ marginTop: 20 }}>
          <EventTextField
            name="webName"
            value={data.webName}
            onChange={this.handleChange(index)}
            customStyle={styles.inputtype_css}
            placeholder="Website Name"
            placeholderTextColor="grey"
            numberOfLines={1}
            multiline={true}
          />
          <EventTextField
            name="feedLink"
            value={data.feedLink}
            onChange={this.handleChange(index)}
            customStyle={styles.inputtype_css}
            placeholder="RSS Feed URL"
            placeholderTextColor="grey"
            numberOfLines={1}
            multiline={true}
          />
          <View
            style={{
              zIndex: 1,
              width: wp('90%'),
              borderColor: 'grey',
              borderWidth: 1,
              marginTop: 30,
              backgroundColor: 'white'
            }}>

            <Autocomplete
              ref={"category"}
              style={styles.input}
              handleSelectItem={this.handleChange(index)}
              onDropdownShow={() => onDropdownShow()}
              placeholder="Type a category"
              placeholderTextColor="grey"
              noDataTextStyle={{ fontSize: 20 }}
              inputContainerStyle={styles.inputContainer}
              highLightColor="#11075e"
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
          </View>
          {
            this.state.selectedWarren != "" ?
              <View style={{ width: wp('90%') }}>
                <RemovableChips
                  style={{ marginTop: 10, fontSize: Device.isPhone ? wp('4.5%') : Device.isTablet ? wp('5.5%') : null, }}
                  initialChips={this.state.selectedWarren[index] != null && this.state.selectedWarren[index] != '' ?
                    this.state.selectedWarren[index].includes(',')
                      ? this.state.selectedWarren[index].split(",")
                      : [this.state.selectedWarren[index]] :
                    []
                  }
                  // alertRequired={true}
                  onChangeChips={(chips, index1, array) => this.removechipsmultiple(chips, index1, array, index)}
                />
              </View> : null
          }
          {/* <TextInput
            style={styles.inputtype_dialog_fix}
            placeholder=""
            placeholderTextColor="grey"
            numberOfLines={5}
            multiline={true}
            editable={false}
            value={this.state.selectedWarren[index]}
          /> */}
          {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 20,
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
              listContainerStyle={{alignItems: 'center'}}
              listStyle={{
                maxHeight: 145,
                minWidth: wp('90%'),
                position: 'absolute',
                zIndex: 1,
                backgroundColor: 'white',
              }}
              data={
                listWarrens.length === 1 && comp(query, listWarrens[0].name)
                  ? []
                  : listWarrens
              }
              defaultValue={query1}
              onChangeText={text => this.updatecategory(this.index, text)}
              placeholder="Type a category"
              placeholderTextColor="grey"
              renderItem={({item}) => (
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
                        query1: item.name,
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
            />
          </View> */}
          {
            this.state.valueArray.length - 1 === index && (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                }}
                onPress={() => {
                  this.handleAddClick(index);
                }}>
                <FontAwesomeIcon
                  icon={faPlus}
                  color={'#2f889a'}
                  size={height > width ? wp('3.5%') : wp('2%')}
                  style={{ marginRight: 5 }}
                />
                <Text
                  style={{
                    color: '#2f889a',
                    fontSize: Device.isPhone
                      ? wp('4%')
                      : Device.isTablet
                        ? wp('2%')
                        : null,
                    textAlign: 'center',
                    marginLeft: 5,
                  }}>
                  add more
              </Text>
              </TouchableOpacity>
            )
          }
          {
            this.state.valueArray.length != 1 && (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                }}
                onPress={() => {
                  this.handleRemoveClick(index);
                }}>
                <FontAwesomeIcon
                  icon={faMinus}
                  color={'#2f889a'}
                  size={height > width ? wp('3.5%') : wp('2%')}
                  style={{ marginRight: 5 }}
                />
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
                  remove less
              </Text>
              </TouchableOpacity>
            )
          }
        </View >
      );
      // }
    });

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
      <View style={styles.container}>
        <Header style={{ backgroundColor: '#11075e' }}>
          {left}
          <Body style={{ justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>
            <Title style={{ fontSize: height > width ? wp('5.5%') : wp('1.8%') }}>SubmitRSSFeed</Title>
          </Body>
          {right}
        </Header>
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
            this.setState({ btnDiialog: false });
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
                              {this.getIndicator(isExpanded, hasChildrenNodes)}
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
                            <View>
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
                                <Text style={{ color: '#11075e' }}>
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
                                    if (!this.state.addId.includes(node.id) && !this.selectedCategories.includes(node.label)) {
                                      this.addName.push(node.label);
                                      this.state.addId.push(node.id);
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
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <SegmentedControlTab
                values={['Single', 'Multiple']}
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
            {customStyleIndex === 0 && (
              <View style={{ alignSelf: 'center', marginTop: 10 }}>
                <Form
                  ref={ref => (this.myForm = ref)}
                  validate={true}
                  submit={() => this.submitSingleRSSFeed()}
                  failed={() => this.singleSubmitFailed()}
                  errors={this.state.singleErrors}>
                  <Field
                    required
                    component={InputField}
                    validations={[required]}
                    name="Website Name"
                    defaultValue={this.state.webName}
                    value={this.state.webName}
                    onChangeText={webName => this.setState({ webName: webName })}
                    customStyle={styles.inputtype_css}
                    placeholder="Website Name"
                    placeholderTextColor="grey"
                    numberOfLines={1}
                  />
                  <Field
                    required
                    component={InputField}
                    validations={[required]}
                    name="RSS Feed URL"
                    value={this.state.feedLink}
                    onChangeText={link => this.setState({ feedLink: link })}
                    customStyle={styles.inputtype_css}
                    placeholder="RSS Feed URL"
                    placeholderTextColor="grey"
                    numberOfLines={1}
                    multiline={true}
                  />
                </Form>
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
                    placeholderTextColor="grey"
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
                </View>
                {this.state.singlecategoryerror == true ? (
                  <Text style={{ color: 'red', fontStyle: 'italic', marginLeft: 5, fontSize: height > width ? hp('2%') : hp('2.8%') }}>This is a required field.</Text>
                ) : null}
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
                    Select a category from tree
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


                {this.state.selectedWarren1 != "" ?
                  <View style={{ width: wp('90%') }}>
                    <RemovableChips
                      initialChips={this.state.selectedWarren1 != null && this.state.selectedWarren1 != '' ?
                        this.state.selectedWarren1.includes(',')
                          ? this.state.selectedWarren1.split(",")
                          : [this.state.selectedWarren1.toString()] :
                        []
                      }
                      alertRequired={true}
                      onChangeChips={(chips, index, array) => this.removechips(chips, index, array)} />
                  </View>
                  : null}

                <TouchableOpacity
                  style={{
                    backgroundColor: '#1e7e34',
                    marginTop: 20,
                    marginBottom: 10,
                    width: wp('90%'),
                    alignSelf: 'center',
                  }}
                  onPress={() => {
                    this.singleSubmitForm();
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
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {customStyleIndex === 1 && (
              <View style={{ alignSelf: 'center' }}>
                <View>{newArray}</View>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#1e7e34',
                    marginVertical: 10,
                    width: wp('90%'),
                    alignSelf: 'center',
                  }}
                  onPress={() => {
                    this.submitMultipleRSSFeed();
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
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}
export default SubmitRSSFeed;
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
    marginTop: 30,
    // textAlignVertical: 'top',
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
    // borderRadius: 5
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
    // backgroundColor: 'white',
  },
});

