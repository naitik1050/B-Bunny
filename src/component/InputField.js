import React from 'react';
import { TextInput, Text, View, Dimensions } from 'react-native';
import {
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

var { height, width } = Dimensions.get('window');

const InputField = ({
  name, // field name - required
  customStyle,
  onChangeText,
  onChange, // event
  value, // field value
  placeholder,
  errors,
  keyboardType,
  secureTextEntry,
  defaultValue,
  placeholderTextColor,
  returnKeyType,
  numberOfLines,
  multiline,
  maxLength
}) => {
  return (
    <View>
      <TextInput
        value={value ? value : ''}
        onChangeText={onChangeText ? val => onChangeText(val) : null}
        onChange={onChange ? val => onChange(val) : null}
        placeholder={placeholder ? placeholder : ''}
        placeholderTextColor={placeholderTextColor ? placeholderTextColor : ''}
        style={customStyle ? customStyle : {}}
        keyboardType={keyboardType ? keyboardType : null}
        secureTextEntry={secureTextEntry ? secureTextEntry : null}
        returnKeyType={returnKeyType ? returnKeyType : null}
        multiline={multiline ? multiline : null}
        defaultValue={defaultValue ? defaultValue : null}
        maxLength={maxLength ? maxLength : null}
        numberOfLines={numberOfLines ? numberOfLines : 1}
      />

      {errors &&
        errors.length > 0 &&
        errors.map((item, index) =>
          item.field === name && item.error ? (
            <Text style={{ color: 'red', fontStyle: 'italic', marginLeft: 5, fontSize: height > width ? hp('2%') : hp('2.8%') }}>{item.error}</Text>
          ) : (
              <View />
            ),
        )}
    </View>
  );
};

export default InputField;
