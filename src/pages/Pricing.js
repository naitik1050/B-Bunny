import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import { Header, Body, Title, Left, Right, Button } from 'native-base';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import SideMenuDrawer from '../component/SideMenuDrawer';
import { Bars } from 'react-native-loader';
import {
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';

export default class Pricing extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      switchValue: false,
    };
  }
  render() {
    var left = (
      <Left style={{ flex: 1 }}>
        <Button
          onPress={() => {
            this.props.navigation.goBack()
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
          <Header style={{ backgroundColor: '#11075e' }}>
            {left}
            <Body>
              <Title>Subscribe VIP</Title>
            </Body>
            {right}
          </Header>
          {this.state.loading == true ? (
            <View style={styles.spinner}>
              <Bars size={25} color="#11075e" />
            </View>
          ) : null}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#11075e', fontSize: height > width ? wp('4.5%') : wp('2.5%'), }}>Coming Soon...</Text>
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
