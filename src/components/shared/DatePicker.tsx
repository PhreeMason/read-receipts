import React, { useState } from 'react'
import { Button } from 'react-native'
import DatePicker from 'react-native-date-picker'

type DatePickerProps = {
    date: Date | null;
    onChange: (date: Date) => void;
    text: string;
}

export default ({ date, onChange, text }: DatePickerProps) => {
    const [open, setOpen] = useState(false)
    return (
        <>
            <Button title={text} onPress={() => setOpen(true)} />
            {date ? <DatePicker
                modal
                open={open}
                date={date}
                onConfirm={(date) => {
                    setOpen(false)
                    onChange(date)
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            /> : null}
        </>
    )
}

