import React from 'react';
import {TextInput, View} from 'react-native';

const EventTextField = ({
  name, // field name - required
  customStyle,
  onChange, // event
  value, // field value
  placeholder,
  defaultValue,
  placeholderTextColor,
  numberOfLines,
  multiline,
  errors,
}) => {
  return (
    <View>
      <TextInput
        value={value}
        onChangeText={text => onChange({name, text})}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        style={customStyle}
        defaultValue={defaultValue}
        numberOfLines={numberOfLines}
        multiline={multiline}
      />
    </View>
  );
};

export default EventTextField;
