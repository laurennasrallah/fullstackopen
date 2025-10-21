export const CountryInfo = ({ country, weather }) => {
  console.log(country)
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital {country.capital.map((capital) => capital)}</p>
      <p>Area {country.area}</p>
      <h3>Languages</h3>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} />

      {/* logic for weather goes here */}

      {weather && (
        <>
          <h3>Weather in {country.capital[0]}</h3>
          <p>Temperature {weather.main.temp} Celsius</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          />
          <p>Wind {weather.wind.speed} m/s</p>
        </>
      )}
    </div>
  )
}

export const CountryList = ({ countriesToShow, handleShowCountry }) => {
  return (
    <div>
      {countriesToShow.map((country, id) => (
        <div key={country._id}>
          {country.name}
          <button onClick={() => handleShowCountry(country)}>show</button>
        </div>
      ))}
    </div>
  )
}

export const TooManyCountries = () => {
  return <p>Too many matches, specify another filter</p>
}
