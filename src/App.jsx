import { useEffect, useState } from 'react';
import "./App.css"

export default function App() {

  const [location, setLocation] = useState({
    country: "",
    state: "",
    city: "",
  });
  const [toShow, setToShow] = useState({
    country: true,
    state: false,
    city: false,
  })
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [showText, setShowText] = useState(false);
  const countryURL = 'https://crio-location-selector.onrender.com/countries';


  const fetchStates = async (country) => {
    const stateURL = `https://crio-location-selector.onrender.com/country=${country}/states`;
    try {
      let res = await fetch(stateURL);
      let states = await res.json();
      setStates(states);
    }
    catch {
      alert("Sorry something went wrong, please try again later");
    }
  }

  const fetchCities = async (state) => {
    const cityURL = `https://crio-location-selector.onrender.com/country=${location.country}/state=${state}/cities`;
    try {
      let res = await fetch(cityURL);
      let cities = await res.json();
      setCities(cities);
    }
    catch {
      alert("Sorry something went wrong, please try again later");
    }
  }

  const changeHandler = (event, what) => {

    if ((what === "country") && (event.target.value !== "Select Country")) {
      let country = event.target.value;
      setLocation(location => {
        return { country: country, state: "", city: "" };
      });
      setToShow(prev => {
        return { ...prev, state: true }
      })
      fetchStates(country);
      setShowText(false);
      setToShow(prev => {
        return { ...prev, city: false };
      })
    }

    else if ((what === "state") && (event.target.value !== "Select State")) {
      let state = event.target.value;
      setLocation(location => {
        return { ...location, state: state, city: "" };
      });
      setToShow(prev => {
        return { ...prev, city: true }
      })
      fetchCities(state);
      setShowText(false);
    }

    else {
      if (event.target.value !== "Select City") {
        setLocation(location => {
          return { ...location, city: event.target.value };
        })
        setShowText(true);
      }
    }
  }

  useEffect(() => {
    const call = async () => {
      try {
        let res = await fetch(countryURL);
        let data = await res.json();
        setCountries(data);
      }
      catch {
        alert("Sorry something went wrong, please try again later");
      }
    }
    call();
  }, []);

  return (
    <>
      <div className='page'>
        <h1>Select Location</h1>
        <div className='dropdowns'>
          <select className='countries' value={location.country} onChange={(event) => changeHandler(event, "country")} disabled={toShow.country ? false : true}>
            <option >Select Country</option>
            {countries.length ? countries.map((country, idx) => <option value={country} key={idx}>{country}</option>) : null}
          </select>
          <select className='states' value={location.state} onChange={(event) => changeHandler(event, "state")} disabled={toShow.state ? false : true}>
            <option  >Select State</option>
            {states.length ? (states.map((state, idx) => <option value={state} key={idx}>{state}</option>)) : null}
          </select>
          <select className='cities' value={location.city} onChange={(event) => changeHandler(event, "city")} disabled={toShow.city ? false : true}>
            <option >Select City</option >
            {cities.length ? (cities.map((city, idx) => <option value={city} key={idx}>{city}</option>)) : null}
          </select>
        </div>
        {showText ? <h3>You selected {location.city}, {location.state}, {location.country}</h3> : null}
      </div>
    </>
  )
}

