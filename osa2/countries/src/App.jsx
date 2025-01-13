import { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    axios
    .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&units=metric&APPID=${api_key}`)
    .then(response => {
      setWeather(response.data)
    })  
  }, [])

  if (!weather) {     
    return null
  }

  return(
    <div>
      <h1> {country.name.common} </h1>
      <div> Capital: {country.capital} </div>
      <div> Area: {country.area} </div>
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map(language => 
          <li key={language}>
            {language}
          </li>
        )}
      </ul>
      <img src={country.flags.png} style={{width : "150px"}} />

      <h3>Weather in {country.capital}</h3>
      <div>temperature {weather.main.temp} Celcius</div>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
      <div>wind {weather.wind.speed} m/s</div>
      
  </div>
  )
}

const View = ({ country, index, stateIndex }) => {
  if (index === stateIndex) {
    return(
      <Country country={country}/>
    )
  } else {
    return null
  }
}

const Content = ({ countries, search }) => {
  const [index, setIndex] = useState(null)
  const matches = countries.filter(p => p.name.common.toLowerCase().includes(search))

  if (matches.length > 10) {
    return(
      <div>
        Too many matches, specify another filter
      </div>
    )
  } else if (matches.length > 1 && matches.length <= 10) {
    return(
      matches.map(country => 
        <div key={country.name.common}>

          {country.name.common}
          <button onClick={() => setIndex(countries.indexOf(country))}>show</button>
          <View country={country} index={countries.indexOf(country)} stateIndex={index} />
          
        </div>
      )
    )
  } else if (matches.length === 1) {
    return(
      <Country country={matches[0]} />
    )
  }
}

const App = () => {
  const [search, setNewSearch] = useState('')
  const [contries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearch = (event) => {
    setNewSearch(event.target.value)
  }

  return(
    <div>
      find countries <input value={search} onChange={handleSearch}  />
      <Content countries={contries} search={search} />
    </div>
  )
  
}

export default App