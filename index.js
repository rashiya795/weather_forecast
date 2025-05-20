const apiKey = "c990d91e5f27424e2398047426ddf4e2";

let savedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];


async function apiCall(lat,lon){
const reverseApi = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
try {
    const response = await fetch(reverseApi);
    if (!response.ok) {
      throw new Error('Response was not ok');
    }
    const data = await response.json();

  return data[0]?.name || "Unknown Location";


  } catch (error) {
    console.log('error:', error);
  }
}
const locationButton = document.getElementById('button');

locationButton.addEventListener('click',() =>{
console.log('clicked')
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(success,error)
    }else{
        input.value='geolocation is not supportes in this browser'
    }
  });

async function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  try {
    const city = await apiCall(lat, lon); 
    input.value = city; 
    getLocation(city);  
  } catch (err) {
    console.error("Failed to get location name:", err);
  }
}

function error() {
  alert("No position is available");
}





const input = document.getElementById("input");
const searchButton = document.getElementById('search')

searchButton.addEventListener('click', (e) => {
  
    const inputValue = input.value;
    
 const cityNames = inputValue.trim('')

if(cityNames === "")return
if(!savedSearches.includes(cityNames))
  savedSearches.unshift(cityNames)
if(savedSearches.length>10)savedSearches.pop()
  localStorage.setItem('recentSearches',JSON.stringify(savedSearches))

  getLocation(inputValue)
 
  input.value='';
        dropdownList.classList.add ('hidden')


});

async function getLocation(cityName) {
  const weatherCall = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(weatherCall);
    if (!response.ok) {
      throw new Error('Response was not ok');
    }
    const data = await response.json();
    console.log(data);

    displayData(data);
  } catch (error) {
    console.log('error:', error);
  }
}

function displayData(data) {
  const placeName = document.getElementById('place');
  placeName.innerHTML = data.name;

  const date = document.getElementById('Date')
  date.innerHTML=new Date().toLocaleString();

  const temperature = document.getElementById('temp')
  temperature.innerHTML=`${data.main.temp}&deg;C`
  const humidity = document.getElementById('humidity')
  humidity.style.fontSize='50px'
humidity.innerHTML=data.main.humidity+'%'

const windspeed = document.getElementById('windspeed')
windspeed.style.fontSize='30px'
windspeed.innerHTML=`${(data.wind.speed * 3.6).toFixed(1)} km/hr`

const condition = document.getElementById('condition')
condition.innerHTML=data.weather[0].description

const icons=document.getElementById('icons')

const iconCode = data.weather[0].icon;
const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
icons.src = iconUrl;

const pressure = document.getElementById('pressure')
pressure.style.fontSize='30px'
pressure.innerHTML= `${data.main.pressure} hPa`;

const lat = data.coord.lat
const lon = data.coord.lon

displayForecastData(lat,lon)

}

const forecastButton =  document.getElementById('forecastButton')
const forecastContainer =document.getElementById('forecastContainer')


forecastButton.addEventListener('click',() =>{

const forecastDiv = document.getElementById('mainForecastDiv')
const inputValue = input.value.trim();  
  
  if (inputValue) {
    forecastDiv.style.display = 'block';
  } else {
    alert("Please enter a city name first.");
  }
const xButton =document.getElementById('crossButton')

xButton.addEventListener('click',()=>{
forecastDiv.style.display='none'

})
})
async function displayForecastData(lat, lon) {

const weeklyApi = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(weeklyApi);
    const data = await res.json();

    const forecastList = data.list;

    const  dailyForecast = forecastList.filter(item => item.dt_txt.includes('12:00:00'))
  
    const forecastContainer = document.getElementById("forecastContainer");
    forecastContainer.innerHTML = "";

for(i=0;i<5;i++){
        const oneDay = dailyForecast[i];

          const date = new Date(oneDay.dt_txt).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });



  const newForecastDiv = document.createElement('div')
  newForecastDiv.className='bg-blue-300  flex-grow w-[90%] rounded-lg mt-2 text-blue-900 flex flex-col justify-center items-center'



    const temp = `${oneDay.main.temp} °C`;
    const condition = oneDay.weather[0].main;
    const iconCode = oneDay.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;


   newForecastDiv.innerHTML = `
      <p class="font-bold">${date}</p>
      <img src="${iconUrl}" alt="${condition}" class="h-10" />
      <p>${condition}</p>
      <p>${temp}</p>
    `;
forecastContainer.appendChild(newForecastDiv);
    }

  } catch (error) {
    console.error("Error fetching forecast:", error);
  }
}

const dropdownList =document.getElementById('dropdownList')

 
input.addEventListener('click',()=>{

  dropdownList.classList.remove( 'hidden');
  
    dropdownList.innerHTML = '';


    savedSearches.forEach((search)=>{
      if(search.trim()!==""){
       const list = document.createElement('li')
       list.textContent=search
    list.className = 'cursor-pointer hover:bg-gray-200 px-2 py-1 flex flex-col justify-center items-center ';

     
    list.addEventListener('click',()=>{
      input.value=search;

      dropdownList.classList.add ('hidden')
      dropdownList.innerHTML='';
    });
    dropdownList.appendChild(list)
   
  }
});
});