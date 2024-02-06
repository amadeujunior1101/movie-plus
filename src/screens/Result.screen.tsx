import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BackIcon } from '../components/IconBackArrow';
import { MovieList } from '../components/MovieList';
import { TitleBar } from '../components/TitleBar';
import { useLoading } from '../loading.context';
import { apiClient } from '../service';
import { IFilmCard, IResultSearchVideos } from '../utils/movies.interface';

const tmdbToken = import.meta.env.VITE_API_TMDB_TOKEN;

const ResultScreen = () => {
  const [resultSearchVideos, setResultSearchVideos] = useState<IResultSearchVideos[]>();

  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get('search');

  const navigate = useNavigate();
  const { setLoading } = useLoading();

useEffect(() => {
  if(searchTerm) findMovieList(searchTerm)
// eslint-disable-next-line react-hooks/exhaustive-deps
},[])

const handleCardClick = (film: IFilmCard) => {

  navigate(`/details?film_id=${encodeURIComponent(film.id)}`);
};

const findMovieList = async (movieName: string) => {
   
  try {
    const searchString = movieName;

    const encodedSearchString = encodeURIComponent(searchString);

    const response = await apiClient.get(`/search/movie?query=${encodedSearchString}&include_adult=false&language=pt-BR&page=1`, {
    headers: {
      'Authorization': `Bearer ${tmdbToken}`,
      'Content-Type': 'application/json',
    },
  });
  if(response.data) setLoading(false);

  setResultSearchVideos(response.data["results"])
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  }
};

const goBack = () => {
  navigate(-1);
};

  return (
    <div className="w-full">
      <div className="mx-auto flex items-center pt-3 pb-3 sm:px-2 md:px-2 lg:px-2 xl:px-0 max-w-1280 padding_mobile">
        <TitleBar icon={<BackIcon/>} title='Voltar para pesquisa' goBack={goBack}/>
      </div>
      {/* <TitleBar icon={<BackIcon/>} title='Voltar para pesquisa' goBack={goBack}/> */}
      <div className="mx-auto flex items-center pt-3 pb-3 sm:px-2 md:px-2 lg:px-2 xl:px-0 max-w-1280 padding_mobile">
        {resultSearchVideos &&
          <MovieList 
              movieInfo={resultSearchVideos}
              handleItemClick={handleCardClick}
          />
        }
      </div>
    </div>
  );
};

export { ResultScreen };
