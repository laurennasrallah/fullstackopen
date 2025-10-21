const axios = require('axios')
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const dataBaseName = 'CountriesApp'
let countries = []

const url = `mongodb+srv://lauren:${password}@cluster0.4ngmyh3.mongodb.net/${dataBaseName}?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const countrySchema = new mongoose.Schema({
  name: {
    common: String,
  },
  capital: [String],
  area: Number,
  latlng: [Number],
  languages: Object,
  flags: {
    png: String,
    svg: String,
  },
})

const Country = mongoose.model('Country', countrySchema)

axios
  .get('https://studies.cs.helsinki.fi/restcountries/api/all')
  .then((response) => {
    console.log('promise fulfilled')
    countries = response.data
    console.log(countries)

    const savePromises = countries.map((country) => {
      const countryData = new Country({
        name: { common: country.name.common },
        capital: country.capital,
        area: country.area,
        latlng: country.latlng,
        languages: country.languages,
        flags: country.flags,
      })
      return countryData.save().then(() => {
        console.log(`${country.name.common} saved!`)
      })
    })
    Promise.all(savePromises)
      .then(() => {
        console.log('all countires saved!')
        mongoose.connection.close()
      })
      .catch((error) => {
        console.log('Error saving countries:', error)
        mongoose.connection.close()
      })
  })
