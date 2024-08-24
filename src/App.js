import { useEffect, useState } from "react";
import Box from "./Box";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import Main from "./Main";
import MovieDetails from "./MovieDetails";
import MovieList from "./MovieList";
import NavBar from "./NavBar";
import NumResults from "./NumResults";
import Search from "./Search";
import WatchedMovieList from "./WatchedMovieList";
import WatchedSummary from "./WatchedSummary";

export const KEY = "e16190fa";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function hanldeAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const resp = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );
          if (!resp.ok) throw new Error("Something went wrong");

          const data = await resp.json();

          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
        } catch (e) {
          console.error(e.message);
          setError(e.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList onSelectMovie={handleSelectMovie} movies={movies} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              watched={watched}
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={hanldeAddWatched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
