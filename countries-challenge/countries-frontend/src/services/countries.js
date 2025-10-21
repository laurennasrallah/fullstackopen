import axios from 'axios'

const baseUrl = '/api/countries'
const namesUrl = '/api/countries/names' // new endpoint for names only - apprently this is better for performance

/*
"Your original error occurred because calling getByName() without an argument caused the request GET /api/countries/name/ 
 to fail because the backend didn't know what to search for and attempted to misuse a MongoDB ID search."
*/

// check above comment with Cecily or Syed

export const getAll = () => {
  return axios.get(baseUrl)
}

export const getNames = () => {
  return axios.get(namesUrl)
}

export const getById = (id) => {
  return axios.get(`${baseUrl}/${id}`)
}

export const getByName = (name) => {
  return axios.get(`${baseUrl}/name/${name}`)
}
