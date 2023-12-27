var submit = document.getElementById("btn-submit")
var search = document.getElementById("search")

/* Seacrch bar code */ 
submit.addEventListener("click", async (e) => {
    e.preventDefault();
    var searchVal = search.value;
    let { results } = await fetchInfo(searchVal);
    console.log(results)
    if (results.length === 0) {
        document.getElementById("content").innerHTML = `<h3>NOT FOUND 🙂</h3>`
        document.getElementById("root").innerHTML = "";
    } else {
        let newResuls = callforsortVoteWise(results);
        diplayContentOnRoot(newResuls);
        document.getElementById("content").innerHTML = `<h3 style = "text-transform: uppercase">${searchVal}</h3>`;
    }
})
// fetching search value
async function fetchInfo(searchVal) {
    try {
        var response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=2c4cb1294e2af8a0e3d35e7c181e5c6f&language=en-US&query=${searchVal}`)
        let data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.error(error)
    }
}

/* MOVIES AND SEARCH*/
// sorting on the basis of vote Ascending order
function callforsortVoteWise(results) {
    for(let i  = 0; i<results.length; i++){
        if (results[i].known_for){
            return results[i].known_for;
        }
    }
    let new_results = results.sort(function (a, b) {
        return b.release_date - a.release_date;
    });
    return new_results;
}
// sorting on the basis of date Ascending order
function callforsort(results){
    let new_results = results.sort(function (a, b) {
        return new Date(b.release_date) - new Date(a.release_date);
    });
    return new_results;
}
/*Below two function are used for rendering Movies to ROOT*/
//Fetching data to ROOT
function diplayContentOnRoot(results) {
    var htmlElements = ""
    results.forEach(element => {
        htmlElements += emarge(element);
    });
    document.getElementById("root").innerHTML = htmlElements;
}
// Converting them to HTML elements
function emarge(element) {
    return (
        `
            <div id="items" onclick="showDetails(${element.id}, ${element.original_title ? 1 : 2})">
                <img
                src="https://image.tmdb.org/t/p/w500${element.poster_path}">
                <h5>${element.original_title ? element.original_title : element.original_name}</h5>
                <p>${element.release_date ? element.release_date : element.first_air_date}</p>
                <p>vote avg : (${element.vote_average}/10)<p>
            </div>
        `
    )
}

/* Below two function are used for rendering Movie details  to MODAL*/
// Fetching data for modal
async function showDetails(element, title) {
    if(title !== 1){
        showTVDetails(element);
    }
    else{

        let response = await fetch(`https://api.themoviedb.org/3/movie/${element}?api_key=2c4cb1294e2af8a0e3d35e7c181e5c6f&language=en-US`)
        let data = await response.json();
        let detail_HTML_Txt = `
        <div id="detail_info">
        <h3>${data.original_title ? data.original_title : data.original_name}</h3>
        <p>vote avg : (${data.vote_average}/10)<p>
        <img src="https://image.tmdb.org/t/p/w500${data.poster_path}">
        <h4>${data.release_date ? data.release_date : data.first_air_date}</h4>
        <h4>${data.overview}</h4>
        <button onclick = "closeModal()">Close</button>
        </div>
        `
        document.getElementById("modal").innerHTML = detail_HTML_Txt;
    }
}
// Closing BUtton for modal
function closeModal(){
    document.getElementById("modal").innerHTML = "";
}

/*Fetching movie categories*/
// fetching data for popular Movies
async function showpopularMovies(){
    let response = await fetch("https://api.themoviedb.org/3/movie/popular?api_key=2c4cb1294e2af8a0e3d35e7c181e5c6f&language=en-US")
    let {results} = await response.json();
    diplayContentOnRoot(results)
    document.getElementById("content").innerHTML = `<h3>POPULAR MOVIES</h3>`
}
//fetching data for Top Movies
async function showtopratedMovies(){
    let response = await fetch("https://api.themoviedb.org/3/movie/top_rated?api_key=2c4cb1294e2af8a0e3d35e7c181e5c6f&language=en-US&page=1")
    let { results } = await response.json();
    diplayContentOnRoot(results)
    document.getElementById("content").innerHTML = `<h3>TOP RATED MOVIES</h3>`
}
//fetching data for lastest Movies
async function showlatestMovies(flag){
    let response = await fetch("https://api.themoviedb.org/3/movie/upcoming?api_key=2c4cb1294e2af8a0e3d35e7c181e5c6f&language=en-US&page=1")
    let { results } = await response.json();
    let new_results = callforsort(results)
    diplayContentOnRoot(new_results)
    document.getElementById("content").innerHTML = `<h3>Upcoming and latest</h3>`
}
// fetching data for On theater Movies
async function showNowPlaying(){
    let response = await fetch("https://api.themoviedb.org/3/movie/now_playing?api_key=2c4cb1294e2af8a0e3d35e7c181e5c6f&language=en-US&page=1")
    let { results } = await response.json();
    diplayContentOnRoot(results)
    document.getElementById("content").innerHTML = `<h3>ON THEATER</h3>`
}


/* Below three functions allows rendering TV series to ROOT and to MODAL*/
// Function ONE 
function diplayTVContentOnRoot(results) {
    var htmlElements = ""
    results.forEach(element => {
        htmlElements += emargeTVContent(element);
    });
    document.getElementById("root").innerHTML = htmlElements;
}
// Function Two 
function emargeTVContent(element) {
    return (
        `
        <div id="items" onclick="showTVDetails(${element.id})">
        <img
        src="https://image.tmdb.org/t/p/w500${element.poster_path}">
        <h5>${element.original_name}</h5>
        <p>${element.first_air_date}</p>
        <span>Voting Avg : (${element.vote_average}/10)</span>
        </div>
        `
    )
}
// Function Three 
async function showTVDetails(element){
    let response = await fetch(`https://api.themoviedb.org/3/tv/${element}?api_key=2c4cb1294e2af8a0e3d35e7c181e5c6f&language=en-US`)
    let data = await response.json();
    let detail_HTML_Txt = `
        <div id="detail_info">
            <h3>original_title : ${data.original_name}</h3>
            <p><span>Voting Avg : (${data.vote_average}/10)</span></p>
            <img src="https://image.tmdb.org/t/p/w500${data.poster_path}">
            <h4>release_date : ${data.first_air_date}</h4>
            <h4>details :</h4>
            <h4>${data.overview}</h4>
            <button onclick = "closeModal()">Close</button>
        </div>
    `
    document.getElementById("modal").innerHTML = detail_HTML_Txt;
}


/* Bellow two functions are used for sorting by dates and voting*/
// this function is used for sorting vote count for TV series 
function sortPoularTV(results){
    let newReults = results.sort((a, b)=>{
        return new Date(b.vote_average) - new Date(a.vote_average)
    })
    return newReults;
}
// this function is used for sorting dates for TV series 
function sortLatestTV(results){
    let newResults = results.sort((a,b)=>{
        return new Date(b.first_air_date) - new Date(a.first_air_date);
    })
    return newResults;
}

/*Below three functions are used for fetching the data for TV series*/
// fetching the data for polular TV shows 
async function showpopularTV(){
    document.getElementById("content").innerHTML = `<h3>POPULAR TV SHOWS</h3>`
    let response = await fetch("https://api.themoviedb.org/3/tv/popular?api_key=2c4cb1294e2af8a0e3d35e7c181e5c6f&language=en-US&page=1")
    let { results } = await response.json();
    let newData = sortPoularTV(results);
    diplayTVContentOnRoot(newData);
}
// fetching the data for top rated TV shows
async function showtopratedTV(){
    document.getElementById("content").innerHTML = `<h3>TOP RATED TV SHOWS</h3>`
    let response = await fetch("https://api.themoviedb.org/3/tv/top_rated?api_key=2c4cb1294e2af8a0e3d35e7c181e5c6f&language=en-US&page=1")
    let { results } = await response.json();
    let newData = sortPoularTV(results);
    diplayTVContentOnRoot(newData)
}
// fetching the data for latest TV shows
async function showlatestTV() {
    document.getElementById("content").innerHTML = `<h3>LATEST TV SHOWS</h3>`
    let response = await fetch("https://api.themoviedb.org/3/tv/on_the_air?api_key=2c4cb1294e2af8a0e3d35e7c181e5c6f&language=en-US")
    let { results } = await response.json();
    let newData = sortLatestTV(results);
    diplayTVContentOnRoot(newData);
}

