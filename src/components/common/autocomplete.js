import React from 'react'
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

function autocomplete() {

    const top100Films = [
        { title: 'The Shawshank Redemption', year: 1994 },
        { title: 'The Godfather', year: 1972 },
        { title: 'The Godfather: Part II', year: 1974 },
        { title: 'The Dark Knight', year: 2008 },
        { title: '12 Angry Men', year: 1957 },
        { title: "Schindler's List", year: 1993 },
        { title: 'Pulp Fiction', year: 1994 },
        {
            title: 'The Lord of the Rings: The Return of the King',
            year: 2003,
        },]

    return (
        <>
            <Autocomplete
                multiple
                id="tags-outlined"
                options={top100Films}
                getOptionLabel={(option) => option.title}
                defaultValue={[top100Films[1]]}
                filterSelectedOptions
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="filterSelectedOptions"
                        placeholder="Favorites"
                    />
                )}
            />
        </>

    )
}

export default autocomplete