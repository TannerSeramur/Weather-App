import React from 'react';
import axios from 'axios';
import '../weather-icons-master/css/weather-icons.css';
import config from '../config.js';
import moment from 'moment'
import '../styles/weather-results.css'


class WeatherResults extends React.Component {
  constructor(){
    super();
    this.state = {
      weather: {},
      error: false,
      loading: false,
      userZip: '',
      userCity: '',
      allCities:[],
      index: 0
    }

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }


  handleFormSubmit(event) {
    console.log('getin her')
    const that = this

    var allCities = [...this.state.allCities];

    event.preventDefault()
    //setState loading to true when form is submitted - change to false after data gets back
    this.setState({
      loading: true
    })
    if (event.target.name === 'userZip'){
      // setTimeout for 2 second to show loading icon - not neccessary but looks cool
      setTimeout(function() {
        axios.get('http://api.openweathermap.org/data/2.5/weather?zip=' + that.state.userZip + ',us&APPID=' + config.apiKey + '&units=imperial')
          .then(function(response) {
            allCities.push(response.data)
            that.setState({
              weather: response.data,
              loading: false,
              allCities: allCities
            });
            // const d = response.data
            console.log(response.data, 'here is the response');
          })
          .catch(function(error) {
            that.setState({
              error: true
            })
            console.log(error, 'here is the error');
          });
      }, 1000);
    }

    else if(event.target.name === 'userCity') {
      setTimeout(function() {

        axios.get('http://api.openweathermap.org/data/2.5/weather?q=' + that.state.userCity + '&APPID=' + config.apiKey + '&units=imperial')

          .then(function(response) {
            allCities.push(response.data)
            that.setState({
              weather: response.data,
              loading: false,
              allCities: allCities,
              index: allCities.length-1
            });
            // const d = response.data
            console.log(response.data, 'here is the response');
          })
          .catch(function(error) {
            that.setState({
              error: true
            })
            console.log(error, 'here is the error');
          });
      }, 1000);

    }
    // this.setState({allCities})
    console.log(allCities, 'all cities');

  }

handleInputChange(event) {
  this.setState({
    [event.target.name]: event.target.value
  });
  console.log(event.target.name, event.target.value);

}




  renderWeather(){
    //if our app is loading, show the loading icon
    var loadingIcon = this.state.loading === true ? <i className="App-logo wi wi-refresh" alt="logo" style={{fontSize: '120px', alignItems: 'center'}}> </i> :  " "
    var weatherIcon = null;
    var des = Object.keys(this.state.allCities).length > 0 ? this.state.allCities[this.state.index].weather[0].description: null;

    var dotStyle = {
      backgroundColor: 'black',
    }

    if(des ==='haze' ){
      weatherIcon = "wi wi-day-haze"
    } else if (des === 'light rain'){
      weatherIcon = "wi wi-rain-mix"
    } else if (des === 'few clouds'){
    weatherIcon = "wi wi-cloud"
    } else if (des === 'clear sky'){
      weatherIcon = "wi wi-day-sunny"
    } else if (des === 'overcast clouds'){
      weatherIcon = "wi wi-cloudy"
    } else if (des === 'light intensity drizzle'){
      weatherIcon = "wi wi-rain-mix"
    } else if (des === 'mist'){
      weatherIcon = "wi wi-windy"
    } else if (des === 'clear sky'){
      weatherIcon = "wi wi-day-sunny"
    } else if (des === 'fog'){
      weatherIcon = "wi wi-fog"
    } else if (des === 'broken clouds'){
      weatherIcon = "wi wi-cloudy"
    } else if (des === 'scattered clouds'){
      weatherIcon = "wi wi-cloudy"
    } else if (des === 'moderate rain'){
      weatherIcon = "wi wi-rain"
    } else if (des === 'light intensity drizzle rain'){
      weatherIcon = "wi wi-rain-mix"
    }else if (des === 'smoke'){
      weatherIcon = "wi wi-smoke"
    }






    //only show this when loading is false and we have data stored in this.state.weather
    if(this.state.loading === false && Object.keys(this.state.weather).length > 0){
      console.log(this.state.index, 'swaggyP');

      var cityArrayLen = this.state.allCities.length -1;
      var selectedCity = this.state.allCities[this.state.index];
      console.log(selectedCity, "selectedCity")
      console.log(this.state.allCities.length, 'length array aa');


      return (
        <div className='main-content'>

          <h1>Today in {selectedCity.name} </h1>
          <p className = 'temp'>{selectedCity.main.temp.toFixed(0)} <i className="wi wi-fahrenheit" alt="logo"></i></p>
          <p className ='icon'>
          <i className= {weatherIcon} alt="logo" style={{fontSize: '80px', display:'inline-flex', justifyContent: 'center', alignItems: 'center', padding: '10px'  }}> </i> </p>
          <p className = 'description'>{selectedCity.weather[0].description}</p>

          <ul className = "dot">
          {this.state.allCities.map((city,index) => {
            if(this.state.index === index) {
              return <li className="dot" style={dotStyle} key={index}></li>
            } else {
              return <li className="dot" key={index}></li>
            }
          })}

          </ul>
          <div className ='footer'>
            <p className = 'sunrise'>{moment.unix(selectedCity.sys.sunrise).format('h:mm a')}<br/> <i className="wi wi-sunrise" alt="logo"></i></p>
            <p className = 'wind'>{selectedCity.wind.speed.toFixed(0) + ' mph'}<br/> <i className="wi wi-cloudy-gusts" alt="logo"></i></p>
            <p className = 'sunset'>{ moment.unix(selectedCity.sys.sunset).format('h:mm a')}<br/> <i className="wi wi-sunset" alt="logo"></i></p>
          </div>

          {this.state.allCities.length === 1 || this.state.index === 0 ? '': <button className = 'previous' onClick = {()=>{this.setState({index: this.state.index-1})}} disabled = {this.state.index === 0}> previous </button>}
          {this.state.allCities.length === 1 || this.state.index === this.state.allCities.length-1? '': <button className = 'next' onClick = {()=>{this.setState({index: this.state.index+1})}} disabled = {this.state.index === this.state.allCities.length-1}> next </button>}



        </div> 

      )
      //when loading is true, show the loadingIcon until data comes back


      this.state.allCities.map(city => {
        return <li className="dot"></li>
      })

    } else if(this.state.loading === true) {
      return (
        <div>
          {loadingIcon}
        </div>
      )
      //initial page load has no state - tell the user to search for their zip
    } else if(Object.keys(this.state.weather).length === 0){
      return <h1 className = 'homeText'>Weather App <i className="wi wi-lightning" alt="logo"></i> </h1>


    }

    //we will also need to run an if this.state.error === true and display some code saying there was an error and to try again or something
  }


  render() {
    console.log(Object.keys(this.state.weather).length, 'weather');
    return (
      <div className = 'searchzip'>
      {this.renderWeather()}
        {Object.keys(this.state.weather).length === 0?
          <div className = 'forms'>
        <form name = 'userZip' onSubmit={this.handleFormSubmit}>
          <label>
            <input name = 'userZip' type="text" value={this.state.userZip} onChange={this.handleInputChange} placeholder = 'Enter Zip Code'/>
            <br/>
          </label>

        </form>
        <form name = "userCity" onSubmit={this.handleFormSubmit}>
          <label>
            <input name = 'userCity' className = "city" type="text" value={this.state.userCity} onChange={this.handleInputChange} placeholder = 'Enter City Name'/>
          </label>

        </form>
        </div>
        :<button onClick = {()=>this.setState({weather:{}})}> Search New City </button>

      }

      </div>

    )
  }
}


// <p className = 'date'>{moment.unix(this.state.weather.dt).format('MMMM Do YYYY, h:mm a')}</p>

export default WeatherResults;
