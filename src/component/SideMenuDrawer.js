/**
* This is the Side Menu Drawer PureComponent
**/

// React native and others libraries imports
import React, { PureComponent } from 'react';
import { Keyboard, Dimensions } from 'react-native';
import Drawer from 'react-native-drawer';


// Our custom files and classes import
import SideMenu from './SideMenu';


export default class SideMenuDrawer extends PureComponent {
  constructor(props) {
    super(props);
    // alert(JSON.stringify(this.props.navigation))
  }


  render() {
    var { height, width } = Dimensions.get('window');
    var wid = height > width ? 0.4 : 0.65
    return (
      <Drawer
        side="right"
        ref={(ref) => this._drawer = ref}
        content={<SideMenu navigation={this.props.navigation} />}
        tapToClose={true}
        type="overlay"
        openDrawerOffset={wid}
        panCloseMask={wid}
        closedDrawerOffset={-3}
        onCloseStart={() => Keyboard.dismiss()}
        style={{ backgroundColor: '#11075e' }}
        captureGestures={true}
      >
        {this.props.children}
      </Drawer>
    );
  }

  close() {
    this._drawer.close();
  }

  open() {
    this._drawer.open();
  }

}

