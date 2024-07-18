import React, {useMemo} from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list'

export default function CountrySelector({ value, onChange }) {
    const options = useMemo(() => countryList().getData(), []);
    const selectedValue = options.find(option => option.value === value);

    const changeHandler = selectedOption => {
      onChange(selectedOption); // Propagate the change to the parent component
    };

    return <Select options={options} value={selectedValue} onChange={changeHandler} aria-label="Country" />;
  }
