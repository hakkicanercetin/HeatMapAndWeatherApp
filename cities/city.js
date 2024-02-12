
const urlParams = new URLSearchParams(window.location.search);
let cityName = urlParams.get("city")
//
const currentCitiesWeather = JSON.parse(localStorage.getItem("currentWeather"))
const filteredCurrentCity = currentCitiesWeather.find(ccw => ccw.cityName == cityName ? ccw : "")
//
const citiesWeather = JSON.parse(localStorage.getItem("futureWeather"))
const filteredCity = citiesWeather.find(cw => cw.name == cityName ? cw : "")
filteredCity.list.map((l)=>l.dt_txt = new Date(l.dt_txt))
filteredCity.list.map((l)=>l.dt_txt.setHours(l.dt_txt.getHours()+3))
const today = new Date()
const todayData = filteredCity.list.filter(fc=>fc.dt_txt.getDate()==today.getDate())
let dailyData = {};
const daysCount = todayData.length < 24 ? 5 : 4;

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
for(let i=0;i<daysCount;i++)
{
    dailyData[`${weekday[(today.getDay()+i)%7]}`] = filteredCity.list.filter(fc => fc.dt_txt.getDate() === today.getDate() + i);
}
document.getElementById("current-weather").innerHTML+= `<h2>${filteredCurrentCity.cityName}</h2><h2>Now</h2>
<div class="d-flex">
<div>
    <div class="d-flex animate__animated animate__bounce">
        <p class="m-0" style="font-size: 4rem;font-weight:bold">${Math.floor(filteredCurrentCity.main.temp)}°C</p>
        <img src="https://openweathermap.org/img/wn/${filteredCurrentCity.weather[0].icon}@2x.png"></img>
    </div>
    <p style="font-size:1rem">Feels like ${Math.floor(filteredCurrentCity.main.feels_like)}°C</p>
</div>
<div>
    <p style="font-size:1.5rem">${filteredCurrentCity.weather[0].description}</p>
    <p>Humidity: ${filteredCurrentCity.main.humidity}%</p>
    <p class="py-1">Wind: ${filteredCurrentCity.wind.speed}km/h</p>
</div>
</div>`

function createDaysWeather(item)
{
        return `
        <div class="swiper-slide mx-3 px-3 animate__animated animate__headShake">
            <div class="card shadow-soft text-center" style="height: 275px !important;width:10rem;">
                <div class="card-body">
                    <h3 class="h5 card-title mt-3">${item.dt_txt.getHours()}:00</h3>
                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png"></img>
                    <h3 class="h5 card-title mt-3">${Math.floor(JSON.stringify(item.main.temp))} °C</h3>
                </div>
            </div>
        </div>
`
}
function swiperFunc(){
    const swiper = new Swiper('.swiper-container', {
        slidesPerView: 8,
        spaceBetween: 8,
        freeMode: true,
        centeredSlides:true,
        grabCursor: true,
      });
}
for(const [index,days] of Object.keys(dailyData).entries())
{
    const yil = dailyData[days][0].dt_txt.getFullYear()
    const ay = dailyData[days][0].dt_txt.getMonth()+1
    const gün = dailyData[days][0].dt_txt.getDate()
    document.getElementById("buttons-wrapper").innerHTML +=`<div class="d-flex flex-column text-center"><span class="mb-3">${gün}/${ay}/${yil}</span><button ${index==0 ? "autofocus" : ""} class="btn btn-primary border mx-3">${days}</button></div>`
}

for(let tag of document.querySelectorAll("#buttons-wrapper button"))
{
    tag.addEventListener("click",(e)=>{
        console.log(dailyData[e.target.innerHTML])
        document.getElementById("weather-wrapper").innerHTML = "";
        swiperFunc()
        dailyData[e.target.innerHTML].map((item)=>document.getElementById("weather-wrapper").innerHTML += createDaysWeather(item))
       
        
    })
}
document.querySelectorAll("#buttons-wrapper button")[0].click();