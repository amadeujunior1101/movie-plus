import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AudioPlayer } from '../components/AudioPlay';
import { CastList } from '../components/CastMovie';
import { BackIcon } from '../components/IconBackArrow';
import { MovieDetails } from '../components/MovieDetails';
import { TitleBar } from '../components/TitleBar';
import { useLoading } from '../loading.context';
import { apiClient } from '../service';
import { IMovie } from '../utils/movies.interface';

const tmdbToken = import.meta.env.VITE_API_TMDB_TOKEN;

const DetailsScreen = () => {

  const audioUrl = 'https://www.kozco.com/tech/piano2-CoolEdit.mp3';

  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get('film_id');
  const navigate = useNavigate();
  const { setLoading } = useLoading();

const [castMovie, setCastMovie] = useState<IMovie>();

useEffect(() => {
  const getCastMovie = async () => {
   
    try {
      const response = await apiClient.get(`/movie/${searchTerm}?append_to_response=credits&language=pt-BR`, {
      headers: {
        'Authorization': `Bearer ${tmdbToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if(response.data) setLoading(false);
    
    setCastMovie({id: response.data.id, title: response.data.title, release_date: response.data.release_date, 
    poster_path: response.data.poster_path, overview: response.data.overview, runtime: response.data.runtime,
    castInfo: response.data['credits']["cast"], genres: response.data['genres']});

    } catch (error) {
      navigate('/');
      console.error("Erro ao buscar dados:", error);
    }
  };

  getCastMovie();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="mx-auto flex items-center pt-3 pb-3 sm:px-2 md:px-2 lg:px-2 xl:px-0 max-w-1280 padding_mobile">
        <TitleBar icon={<BackIcon/>} title='Voltar para pesquisa' goBack={goBack}/>
      </div>
      <div className="w-full" style={{ background: '#053264'}}> 
        <div className="mx-auto flex items-center pt-3 pb-3 sm:px-2 md:px-2 lg:px-2 xl:px-0 max-w-1280">
          {
            castMovie &&
              <MovieDetails 
                film={{id: castMovie?.id, title: castMovie?.title, overview: castMovie?.overview, 
                  poster_path: castMovie?.poster_path, release_date: castMovie?.release_date, 
                  runtime: castMovie?.runtime, genres: castMovie?.genres}}
              />
          }
        </div>
      </div>

      <div className="w-full">
  <div className="mx-auto pt-3 pb-3 sm:px-2 md:px-2 lg:px-2 xl:px-0 max-w-1280 flex flex-col lg:flex-row">
    <div className="w-full lg:w-1/2">
      <span className="text-lg font-bold text-black padding_mobile">Atores</span>
      <div className="padding_mobile">
        <div
          className={"mx-auto flex items-center pt-3 pb-3 sm:px-2 md:px-2 lg:px-2 xl:px-0 max-w-1280 overflow-x-auto scrollbar-custom hovered"}
          style={{ overflowX: 'auto' }}
        >
          {castMovie && <CastList castInfo={castMovie.castInfo} />}
        </div>
      </div>
    </div>
    <div className="w-full lg:w-1/2 pl-5">
      <span className="text-lg font-bold text-black padding_mobile">Trilha Sonora</span>
      <div className="padding_mobile pt-5">
        <span className="text-sm font-bold text-black">Títulos</span>
        <div className="pt-3">
          <AudioPlayer audioUrl={audioUrl} songName="musica teste filme" />
        </div>
      </div>
    </div>
  </div>
</div>

      
  
    </>
  );
};

export { DetailsScreen };
