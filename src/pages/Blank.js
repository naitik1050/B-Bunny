import React, {PureComponent} from 'react';
import {BackHandler, Text, View, StyleSheet, Dimensions} from 'react-native';
import {Left, Right, Button} from 'native-base';
import SideMenuDrawer from '../component/SideMenuDrawer';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft, faBars} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../component/NavBar';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export class Blank extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      Msg: this.props.navigation.getParam('Msg'),
    };
  }

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    return this.props.navigation.navigate('personalizeFeed');
  };

  render() {
    var {height, width} = Dimensions.get('window');
    var left = (
      <Left style={{flex: 1}}>
        <Button
          onPress={() => this.props.navigation.navigate('personalizeFeed')}
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
      <Right style={{flex: 1}}>
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
      <SideMenuDrawer
        ref={ref => (this._sideMenuDrawer = ref)}
        style={{zIndex: 1}}
        navigation={this.props}>
        <View style={styles.container}>
          <Navbar left={left} right={right} title="" navigation={this.props} />
          {this.state.Msg == 'Private' ? (
            <View
              style={{
                flex: 1,
                paddingHorizontal: 30,
                justifyContent: 'center',
              }}>
              <Text style={{textAlign: 'justify', fontSize: 18}}>
                User's Profile private.
              </Text>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                paddingHorizontal: 30,
                justifyContent: 'center',
              }}>
              <Text style={{textAlign: 'justify', fontSize: 18}}>
                You are not able to see this profile due to one of the following
                reasons:
              </Text>
              <Text style={{textAlign: 'justify', fontSize: 18}}>
                - you have blocked this user{' '}
              </Text>
              <Text style={{textAlign: 'justify', fontSize: 18}}>
                - this user has blocked you{' '}
              </Text>
            </View>
          )}
        </View>
      </SideMenuDrawer>
    );
  }
}

export default Blank;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});
