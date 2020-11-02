const nowPlayingMovies = () => {
  Promise.all([
    getNowPlayingMovies(),
    getGenres()
  ]).then((moviesAndGenres) => {
    renderMovies(moviesAndGenres[0].results, moviesAndGenres[1].genres, moviesAndGenres[0].results.length)
  }).catch(err => console.log(`Error in now playing Movies: ${err}`))
}

const infiniteMovies = (pageNum) => {
  Promise.all([
    getNowPlayingMovies(pageNum),
    getGenres()
  ]).then((moviesAndGenres) => {
    renderInfiniteMovies(moviesAndGenres[0].results, moviesAndGenres[1].genres, moviesAndGenres[0].results.length)
  }).catch(err => console.log(`Error in infinite Movies: ${err}`))
}

const generateDOM = (movie, genres, isLastMovie) => {
  const movieEl = document.createElement('li')
  const titleEl = document.createElement('div')
  const containerEl = document.createElement('li')
  const posterEl = document.createElement('img')
  const releaseDateEl = document.createElement('div')
  const genreEl = document.createElement('div')
  const voteAverageEl = document.createElement('div')
  const overviewEl = document.createElement('div')

  if (movie.poster_path) {
    posterEl.setAttribute('src', `https://image.tmdb.org/t/p/w154${movie.poster_path}`)
    containerEl.appendChild(posterEl)
  } else {
    posterEl.setAttribute('src', 'images/noPreview.jpg')
    containerEl.appendChild(posterEl)
  }

  titleEl.textContent = `Title: ${movie.title}`
  containerEl.appendChild(titleEl)

  releaseDateEl.textContent = `Release Date: ${movie.release_date || 'N/A'}`
  containerEl.appendChild(releaseDateEl)

  let movieGenres = movie.genre_ids
  let genresText = genres.filter(genre => movieGenres.includes(genre.id))
                          .map(genre => genre.name)
                          .join(', ')
  genreEl.textContent = `Genre(s): ${genresText}`  
  containerEl.appendChild(genreEl)

  voteAverageEl.textContent = `Users Score: ${movie.vote_average}`
  containerEl.appendChild(voteAverageEl)

  overviewEl.textContent = `Overview: ${movie.overview || 'N/A'}`
  containerEl.appendChild(overviewEl)

  movieEl.appendChild(containerEl)

  // Setup container
  if (isLastMovie){
    movieEl.classList.add('list-item-lastMovie')
  } else {
    movieEl.classList.add('list-item')
  }

  // movieEl.classList.add('list-item')
  containerEl.classList.add('list-item__container')
  movieEl.appendChild(containerEl)

  // Click on each movie for more details
  let clickCounter = 0
  movieEl.addEventListener('click', () => {
    if (clickCounter === 0){
      Promise.all([
        getReviews(movie.id),
        getSimilarMovies(movie.id),
        getVideos(movie.id)
      ]).then(moreDetails => {
        let reviews = (moreDetails[0].results || []).slice(0,3)
        let similar = (moreDetails[1].results || []).slice(0,3)
        let videos = (moreDetails[2].results || []).slice(0,3)

        detailsEl = document.createElement('div')
        // detailsEl.classList.add('list-item__container__moredetails')

        // Making the reviews section
        if (reviews.length === 0){
          reviewEl = document.createElement('p')
          reviewEl.textContent = 'Reviews: No reviews available'
          detailsEl.appendChild(reviewEl)
        } else {
          reviewEl = document.createElement('div')
          reviewEl.textContent = 'Reviews:'
          detailsEl.appendChild(reviewEl)
          reviews.forEach((review, index) => {
            reviewEl = document.createElement('div')
            reviewEl.textContent = `Review (${index+1}): ${review.content}`
            detailsEl.appendChild(reviewEl)
          })
        }

        //Making the similar movies section
        if (similar.length === 0) {
          similarEl = document.createElement('p')
          similarEl.textContent = 'Similar movies: No similar movies available'
          detailsEl.appendChild(similarEl)          
        } else {
          similarEl = document.createElement('p')
          similarEl.textContent = 'Similar movies:'
          detailsEl.appendChild(similarEl)  
            similar.forEach(similarMovie => {
              similarEl = document.createElement('div')
              similarEl.classList.add('div2')
              // title
              moreDetailsTitleEl = document.createElement('p')
              moreDetailsTitleEl.textContent = `Title: ${similarMovie.title}`
              similarEl.appendChild(moreDetailsTitleEl)
              // image
              moreDetailsposterEl = document.createElement('img')
              if (similarMovie.poster_path) {
                moreDetailsposterEl.setAttribute('src', `https://image.tmdb.org/t/p/w154${similarMovie.poster_path}`)
                similarEl.appendChild(moreDetailsposterEl)
              } else {
                moreDetailsposterEl.setAttribute('src', 'images/noPreview.jpg')
                similarEl.appendChild(moreDetailsposterEl)
              }

              detailsEl.appendChild(similarEl)
            })
          }

        // Making videos section
        if (videos.length === 0) {
          videosEl = document.createElement('p')
          videosEl.textContent = 'Videos: No videos available'
          detailsEl.appendChild(videosEl)
        } else {
          videosEl = document.createElement('p')
          videosEl.textContent = 'Videos:'
          detailsEl.appendChild(videosEl)
          videos.forEach(video => {
            videosEl = document.createElement('p')
            videoEl = document.createElement('a')
            if (video.site === 'YouTube') {
              videoEl.textContent = `https://www.youtube.com/watch?v=${video.key}`
              videoEl.setAttribute('href', `https://www.youtube.com/watch?v=${video.key}`)
            } else if (video.site === 'Vimeo') {
              videoEl.textContent = `https://vimeo.com/${video.key}`
              videoEl.setAttribute('href', `https://vimeo.com/${video.key}`)
            }
            videosEl.appendChild(videoEl)
            detailsEl.appendChild(videosEl)
          })
        }

        containerEl.appendChild(detailsEl)

      }).catch(err => console.log(`Error in More Details: ${err}`))
      clickCounter++
    }
  })

  return movieEl
}

const renderMovies = (movies, genres, counterForMovies) => {
  const moviesEl = document.querySelector('#movies')
  while (moviesEl.firstChild) moviesEl.removeChild(moviesEl.firstChild)
  let isLastMovie = false
  movies.forEach((movie, index) => {
    if (++index === counterForMovies){
      isLastMovie = true
    }
    const movieEl = generateDOM(movie, genres, isLastMovie)
    moviesEl.appendChild(movieEl)
  })


  let target = document.querySelector('.list-item-lastMovie')

  let options = {
    root: null,
    rootMargin: '10px',
    threshold: 0
  }

  let callback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          target.classList.remove('list-item-lastMovie')
          target.classList.add('list-item')
          infiniteMovies(2)
        }
      })
  }

  let observer = new IntersectionObserver(callback, options)

  observer.observe(target)

}

const renderInfiniteMovies = (movies, genres, counterForMovies) => {
  // Add an indication that all movies have been loaded
  const moviesEl = document.querySelector('#movies')
  let isLastMovie = false
  movies.forEach((movie, index) => {
    if (++index === counterForMovies){
      isLastMovie = true
    }
    const movieEl = generateDOM(movie, genres, isLastMovie)
    moviesEl.appendChild(movieEl)
  })


  let target = document.querySelector('.list-item-lastMovie')

  let options = {
    root: null,
    rootMargin: '10px',
    threshold: 0
  }

  let callback = (entries, observer) => {
      entries.forEach(entry => {
        let currentPage = 2
        if (entry.isIntersecting){
          target.classList.remove('list-item-lastMovie')
          target.classList.add('list-item')
          infiniteMovies(++currentPage)
        }
      })
  }

  let observer = new IntersectionObserver(callback, options)

  observer.observe(target)

}

const searching = textForSearch => {
  Promise.all([
    getSearch(textForSearch),
    getGenres()
  ]).then(searchMoviesAndGenres => {
    renderMovies(searchMoviesAndGenres[0].results, searchMoviesAndGenres[1].genres, searchMoviesAndGenres[0].results.length)
  }).catch(err => console.log(`Error in Searching: ${err}`))
}

