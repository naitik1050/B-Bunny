import React from 'react';
import { View } from 'react-native';
import DatePicker from 'react-native-datepicker';

const DateField = ({
    name,           // field name - required
    customStyles,
    style,
    onDateChange,   // event
    date,
    androidMode,
    mode,
    format,
    minDate,
    maxDate,
    confirmBtnText,
    cancelBtnText,
    placeholder,
    errors,
}) => {
    return (
        <View>
            <DatePicker
                style={style ? style : {}}
                date={date ? date : ""}
                mode={mode ? mode : ""}
                placeholder={placeholder ? placeholder : ""}
                androidMode={androidMode ? androidMode : ""}
                format={format ? format : ""}
                minDate={minDate ? minDate : ""}
                maxDate={maxDate ? maxDate : ""}
                confirmBtnText={confirmBtnText ? confirmBtnText : ""}
                cancelBtnText={cancelBtnText ? cancelBtnText : ""}
                customStyles={customStyles ? customStyles : {}}
                onDateChange={onDateChange ? (val) => onDateChange(val) : null}
            />


        </View>
    );
}

export default DateField;