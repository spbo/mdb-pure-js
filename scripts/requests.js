// Get 1 movie
// https://api.themoviedb.org/3/movie/577922?api_key=bc50218d91157b1ba4f142ef7baaa6a0&language=en-US

// Get now playing
// https://api.themoviedb.org/3/movie/now_playing?api_key=bc50218d91157b1ba4f142ef7baaa6a0&language=en-US&page=1

// Get Image
// https://image.tmdb.org/t/p/w500/wzJRB4MKi3yK138bJyuL9nx47y6.jpg

// Get Genres
// https://api.themoviedb.org/3/genre/movie/list?api_key=bc50218d91157b1ba4f142ef7baaa6a0&language=en-US

// Get Search
// https://api.themoviedb.org/3/search/movie?api_key=bc50218d91157b1ba4f142ef7baaa6a0&query=Jack+Reacher

// Get Similar Movies
// https://api.themoviedb.org/3/movie/581392/similar?api_key=bc50218d91157b1ba4f142ef7baaa6a0&language=en-US&page=1

// Get Videos
// https://api.themoviedb.org/3/movie/581392/videos?api_key=bc50218d91157b1ba4f142ef7baaa6a0&language=en-US

// Get Reviews
// https://api.themoviedb.org/3/movie/581392/reviews?api_key=bc50218d91157b1ba4f142ef7baaa6a0&language=en-US&page=1


// Fetch Now Playing Movies
const getNowPlayingMovies = async (pageNum = 1) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=bc50218d91157b1ba4f142ef7baaa6a0&language=en-US&page=${pageNum}`)
    if (response.status === 200) {
        const data = await response.json()
        return data
    } else {
        throw 'Unable to fetch data bro'
    }
}

// Fetch Genres
const getGenres = async () => {
    const response = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=bc50218d91157b1ba4f142ef7baaa6a0&language=en-US')
    if (response.status === 200) {
        const data = await response.json()
        return data
    } else {
        throw new Error ('Unable to fetch genres')
    }
}

// Fetch Searched Movies
const getSearch = async (query) => {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=bc50218d91157b1ba4f142ef7baaa6a0&language=en-US&query=${query}&page=1&include_adult=false`)
    if (response.status === 200) {
        const data = await response.json()
        return data
    } else {
        throw new Error ('Unable to fetch searhing data')
    }
}

// Fetch Similar Movies
const getSimilarMovies = async (movie_id) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/similar?api_key=bc50218d91157b1ba4f142ef7baaa6a0&language=en-US&page=1`)
    if (response.status === 200) {
        const data = await response.json()
        return data
    } else {
        throw new Error ('Unable to fetch Similar Movies')
    }
}

// Fetch Reviews
const getReviews = async (movie_id) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/reviews?api_key=bc50218d91157b1ba4f142ef7baaa6a0&language=en-US&page=1`)
    if (response.status === 200) {
        const data = await response.json()
        return data
    } else {
        throw new Error ('Unable to fetch reviews')
    }
}

// Fetch Videos
const getVideos = async (movie_id) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/videos?api_key=bc50218d91157b1ba4f142ef7baaa6a0&language=en-US`)
    if (response.status === 200) {
        const data = await response.json()
        return data
    } else {
        throw new Error ('Unable to fetch Videos')
    }
}