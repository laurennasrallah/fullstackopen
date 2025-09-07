import { useState, useEffect } from 'react'
import axios from 'axios'
import Query from '../components/Query'
import {
  CountryInfo,
  CountryList,
  TooManyCountries,
} from '../components/CountryInfo'

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  const apiKey = import.meta.env.VITE_API_KEY

  useEffect(() => {
    console.log('effect')
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
    if (selectedCountry) {
      const [lat, lon] = selectedCountry.capitalInfo.latlng
      axios
        .get(
          `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        )
        .then((response) => {
          console.log('promise fulfilled')
          console.log(response)
          setWeather(response.data)
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
      return country.name.common
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    })
  }

  useEffect(() => {
    if (countriesToShow.length === 1 && searchQuery !== '') {
      setSelectedCountry(countriesToShow[0])
    }
  }, [countriesToShow, searchQuery])

  const handleQuery = (event) => {
    setSearchQuery(event.target.value)
    setSelectedCountry(null)
  }
  const handleShowCountry = (country) => {
    setSelectedCountry(country)
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
