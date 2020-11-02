
// Home Page
window.onload = function () {
nowPlayingMovies()
}

// Searching Input Event Listener
document.querySelector('.search-movie').addEventListener('input', e => {
  if (e.target.textLength === 0){
    nowPlayingMovies()
  } else {
    searching(e.target.value)
  }
})