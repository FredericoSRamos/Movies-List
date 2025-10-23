import React from 'react';

const MovieCard = ({ movie, onAddToFavorites, onRemoveFromFavorites }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://placehold.co/500x750';

  const movieIdToRemove = movie.id || movie.movie_id;

  return (
    <div className="movie-card">
      <img src={posterUrl} alt={movie.title} className="movie-poster" />

      <div className="card-body">
        <h3>{movie.title}</h3>
        <p>Lançamento: {movie.release_date || 'Não informado'}</p>
      </div>

      <div className="card-footer">
        <div className="rating">
          <span>⭐ {(movie.vote_average || 0).toFixed(1)}</span>
        </div>
        <div className="card-actions">
          {onAddToFavorites && (
            <button onClick={() => onAddToFavorites(movie)}>
              Adicionar aos Favoritos
            </button>
          )}

          {onRemoveFromFavorites && (
            <button className="remove-btn" onClick={() => onRemoveFromFavorites(movieIdToRemove)}>
              Remover
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;