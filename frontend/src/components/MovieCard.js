import React from 'react';

const MovieCard = ({ movie, onAddToFavorites, onRemoveFromFavorites, isFavorite }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750.png?text=No+Image';

  return (
    <div className="movie-card">
      <img src={posterUrl} alt={movie.title} />
      <h3>{movie.title}</h3>
      <p>Lançamento: {movie.release_date}</p>
      <div className="rating">
        <span>⭐ {movie.vote_average.toFixed(1)}</span>
      </div>
      <div className="card-actions">
        {onAddToFavorites && <button onClick={() => onAddToFavorites(movie)}>Adicionar aos Favoritos</button>}
        {onRemoveFromFavorites && <button className="remove-btn" onClick={() => onRemoveFromFavorites(movie.id)}>Remover</button>}
      </div>
    </div>
  );
};

export default MovieCard;