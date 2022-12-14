import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import React, { useEffect } from 'react'


const DatePickerForControl = ({onChange,date}) => {

    const [value, setValue] = React.useState(null);
    useEffect(() => {
        onChange(value)
    },[value])
    return (
        <>
            <DatePicker
                mask="__/__/____"
                views={["day"]}
                value={value}
                onChange={(newValue) => {
                    setValue(newValue);
                }}
                className="enrollment-section-input experience-input"
                renderInput={(params) => <TextField {...params} />}
            />
        </>
    )
}

export default DatePickerForControl