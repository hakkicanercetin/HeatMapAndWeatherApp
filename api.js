import { createMap } from "./map.js";
const key = "5496aa1ea33f6ef4b4caac9ff01465ad";
let cities = statesData.features.map((province)=>(province.properties.name))

async function getWeather()
{
    try {
        const currentWeatherData = []
        const futureWeatherData = []
        for(let city of cities)
        {
            let currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`
            const currentResponse = await fetch(currentWeatherUrl)
            const currentData = await currentResponse.json();
            currentWeatherData.push({cityName:city,...currentData})
            let futureWeatherUrl = `https://pro.openweathermap.org/data/2.5/forecast/hourly?q=${city}&appid=${key}&units=metric&cnt=96`
            const futureResponse = await fetch(futureWeatherUrl)
            let futureData = await futureResponse.json();
            futureWeatherData.push({name:city,temp:Math.floor(futureData.list[0].main.temp),description:futureData.list[0].weather[0].description,list:futureData.list,icon:futureData.list[0].weather[0].icon})
        }
        return [currentWeatherData,futureWeatherData]
    } catch (error) { 
        console.log(error)
    }
}
async function main()
{
    const temp = await getWeather()
    localStorage.setItem("currentWeather",JSON.stringify(temp[0]))
    localStorage.setItem("futureWeather",JSON.stringify(temp[1]))
    createMap()
    document.getElementById("loader-wrapper").classList.add("hide-loader")
}
main()
