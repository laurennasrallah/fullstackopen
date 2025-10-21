import { useState, useEffect } from 'react'
import axios from 'axios'
import Query from './components/Query'
import { getAll, getById, getByName, getNames } from './services/countries'

import {
  CountryInfo,
  CountryList,
  TooManyCountries,
} from './components/CountryInfo'
import { useCallback } from 'react'

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  const apiKey = import.meta.env.VITE_API_KEY

  // new function to fetch country details by ID
  const fetchCountryDetails = useCallback((id) => {
    // TODO: check useCallback vs useEffect
    // useCallback is used to memoize the function which prevents unnecessary re-creations on each render < check this with Cecily or Syed
    getById(id)
      .then((response) => {
        setSelectedCountry(response.data)
      })
      .catch((error) => {
        console.error('Error fetching country details:', error)
      })
  }, [])

  useEffect(() => {
    console.log('effect')
    getNames().then((response) => {
      //changed getAll to getNames
      console.log('promise fulfilled')
      setCountries(response.data)
      console.log(response.data)
    })
  }, [])

  // weather fetching stays the same
  useEffect(() => {
    if (selectedCountry) {
      const [lat, lon] = selectedCountry.latlng
      axios
        .get(
          `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        )
        .then((response) => {
          console.log('promise fulfilled')
          console.log(response)
          setWeather(response.data)
        })
        .catch((error) => {
          console.error('Error fetching weather data:', error)
        })
    } else {
      setWeather(null)
    }
  }, [selectedCountry, apiKey])

  let countriesToShow = []
  if (searchQuery === '') {
    countriesToShow = countries
  } else {
    countriesToShow = countries.filter((country) => {
      return country.name.toLowerCase().includes(searchQuery.toLowerCase())
    })
  }

  //changed useEffect to call fetchCountryDetails when there's only one country in the list instead of setting selectedCountry directly
  useEffect(() => {
    if (
      countriesToShow.length === 1 &&
      searchQuery !== '' &&
      selectedCountry === null // added to prevent infinite loop - infinite loop happens because when selectedCountry is set, it triggers this useEffect again
    ) {
      fetchCountryDetails(countriesToShow[0]._id)
    }
  }, [countriesToShow, searchQuery, fetchCountryDetails, selectedCountry])

  const handleQuery = (event) => {
    setSearchQuery(event.target.value)
    setSelectedCountry(null)
  }

  // changed from setting selectedCountry directly to calling fetchCountryDetails
  const handleShowCountry = (country) => {
    fetchCountryDetails(country._id)
  }

  let content = null
  if (selectedCountry) {
    content = <CountryInfo country={selectedCountry} weather={weather} />
  } else if (countriesToShow.length > 10) {
    content = <TooManyCountries />
  } else {
    content = (
      <CountryList
        countriesToShow={countriesToShow}
        handleShowCountry={handleShowCountry}
      />
    )
  }

  return (
    <div>
      <Query searchQuery={searchQuery} handleQuery={handleQuery} />
      {content}
    </div>
  )
}

export default App
