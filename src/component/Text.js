/**
* This is the Text component used in the app
* We need to use this component which heritate from native-base text component to have more control on its font
**/

import React, { PureComponent } from 'react';
import { Text as TextRN } from 'react-native';

export default class Text extends PureComponent {
  render() {
    return (
      <TextRN style={[styles.font, this.props.style]} {...this.props}>
        {this.props.children}
      </TextRN>
    )
  }
}
const styles = {
  font: {
    fontFamily: 'Roboto'
  }
};
