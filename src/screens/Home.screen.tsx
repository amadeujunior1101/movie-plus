import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Gender } from "../components/Gender";
import { MovieList } from '../components/MovieList';
import { SearchBar } from "../components/SearchBar";
import { TitleBar } from '../components/TitleBar';
import { useLoading } from '../loading.context';
import { apiClient } from '../service';
import { setGenreFilmData } from '../store/actions/genresMovies.action';
import { setPopularFilmData } from '../store/actions/popularMovies.actions';
import { setTrendingFilmData } from '../store/actions/trendingMovies.actions';
import { IFilmCard, IGenreVideos, IListVideos, IPopularVideos, ITrendingVideos } from '../utils/movies.interface';

const tmdbToken = import.meta.env.VITE_API_TMDB_TOKEN;

const HomeScreen = () => {
  const [moviePerGenre, setMoviePerGenre] = useState<IListVideos[]>();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { setLoading } = useLoading();

  const navigate = useNavigate();

  const listGenreData = useSelector((state: IGenreVideos) => state.genreMovies.filmData);
  
  const listTrendVideosData = useSelector((state: ITrendingVideos) => state.trendingMovies.filmData);

  const listPopularVideosData = useSelector((state: IPopularVideos) => state.popularMovies.filmData);


  const handleClick = (id: string, name: string) => {
    const filteredMovies = listPopularVideosData?.filter(movie => movie.genre_ids.includes(id));

    setMoviePerGenre(filteredMovies);

    if (selectedGenre !== name) {
      setSelectedGenre(name);
    } else {
      setSelectedGenre(null);
      setMoviePerGenre([]);
    }
  }

const handleSearch = (searchTerm: string) => {
  if(searchTerm){
    navigate(`/results?search=${encodeURIComponent(searchTerm)}`);
  }
};

useEffect(() => {
  if (listTrendVideosData === null || listPopularVideosData === null || listGenreData === null) {
    genreMovieList();
    findTrendingMovies();
    findPopularMovies()
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

const genreMovieList = async () => {
 
  try {
    const response = await apiClient.get('/genre/movie/list?language=pt', {
    headers: {
      'Authorization': `Bearer ${tmdbToken}`,
      'Content-Type': 'application/json',
    },
  });
    if(response.data) setLoading(false);
    dispatch(setGenreFilmData(response.data["genres"]));
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  }
};

const findTrendingMovies = async () => {
   
  try {

    const response = await apiClient.get(`/trending/movie/day?language=pt-BR`, {
    headers: {
      'Authorization': `Bearer ${tmdbToken}`,
      'Content-Type': 'application/json',
    },
  });
  dispatch(setTrendingFilmData(response.data["results"]));
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  }
};

const findPopularMovies = async () => {
   
  try {

    const response = await apiClient.get(`/movie/popular?language=pt-BR&page=1`, {
    headers: {
      'Authorization': `Bearer ${tmdbToken}`,
      'Content-Type': 'application/json',
    },
  });
  dispatch(setPopularFilmData(response.data["results"]));
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  }
};

const handleCardClick = (film: IFilmCard) => {
  navigate(`/details?film_id=${encodeURIComponent(film.id)}`);
};

  return (
    <div className="w-full">
      <div className="mx-auto flex items-center pt-3 pb-3 sm:px-2 md:px-2 lg:px-2 xl:px-0 max-w-1280 padding_mobile">
        <SearchBar onSearch={handleSearch} />
      </div>
      <div 
          className={`mx-auto flex items-center pt-3 pb-3 sm:px-2 md:px-2 lg:px-2 xl:px-0 max-w-1280 overflow-x-auto 
          scrollbar-custom hovered`}
          style={{ overflowX: 'auto' }}
      >
          {
            listGenreData?.map(item=> {
              return (
                <Gender 
                  key={item.id}
                  title={item.name} 
                  handleClick={()=>handleClick(item.id, item.name,)}
                  selected={selectedGenre === item.name}
                />)
            })
          }
      </div>
      {
        moviePerGenre?.length?
          <>
          <div className="mx-auto flex items-center pt-3 pb-3 sm:px-2 md:px-2 lg:px-2 xl:px-0 max-w-1280 padding_mobile">
            <TitleBar title={`Filmes de ${selectedGenre}`} />
          </div>
          <div className="mx-auto flex items-center pt-3 pb-3 sm:px-2 md:px-2 lg:px-2 xl:px-0 max-w-1280 padding_mobile">
            {moviePerGenre &&
             <MovieList 
              movieInfo={moviePerGenre} 
              handleItemClick={handleCardClick} />
            }
          </div></>
        :
          <>
          <div className="mx-auto flex items-center pt-3 pb-3 sm:px-2 md:px-2 lg:px-2 xl:px-0 max-w-1280 padding_mobile">
            <TitleBar title='Úlltimos filmes acessados:'/>
          </div>
            <div className={`mx-auto flex items-center pt-3 pb-3 sm:px-2 md:px-2 lg:px-2 xl:px-0 max-w-1280 overflow-x-auto 
                scrollbar-custom hovered`}
                style={{ overflowX: 'auto' }}
            >
              {listTrendVideosData &&
                <MovieList 
                  movieInfo={listTrendVideosData}
                  scrollHorizontal={true}
                  handleItemClick={handleCardClick}
                />
              }
            </div>
            <div className="mx-auto flex items-center pt-3 pb-3 sm:px-2 md:px-2 lg:px-2 xl:px-0 max-w-1280 padding_mobile">
              <TitleBar title='Destaques:'/>
            </div>
            <div className="mx-auto flex items-center pt-3 pb-3 sm:px-2 md:px-2 lg:px-2 xl:px-0 max-w-1280 padding_mobile">
              {listPopularVideosData &&
                <MovieList 
                  movieInfo={listPopularVideosData}
                  handleItemClick={handleCardClick}
                />
              }
            </div>
          </>
      }
     
    </div>
  );
};

export { HomeScreen };
