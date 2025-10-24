import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import { useNotification } from '../hooks/useNotification';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shareableLink, setShareableLink] = useState('');
    const { addNotification } = useNotification();
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchFavorites = useCallback(async () => {
        try {
            const response = await api.get('/favorites');
            setFavorites(response.data);
            if (user) {
                setShareableLink(`${window.location.origin}/shared/user/${user.id}`);
            }
        } catch (error) {
            console.error("Erro ao buscar favoritos:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    const removeFromFavorites = async (movieId) => {
        try {
            await api.delete(`/favorites/remove/${movieId}`);
            setFavorites(prevFavorites => prevFavorites.filter(movie => movie.movie_id !== movieId));
            addNotification('Filme removido dos favoritos.', 'success');
        } catch (error) {
            addNotification("Erro ao remover o filme dos favoritos.", 'error');
        }
    };

    if (loading) return <p>Carregando seus favoritos...</p>;

    return (
        <div>
            <header className="App-header">
                <h2>Meus Filmes Favoritos</h2>
            </header>
            <main>
                {shareableLink && (
                    <div className="share-section">
                        <h3>Compartilhe sua lista!</h3>
                        <input type="text" value={shareableLink} readOnly />
                    </div>
                )}
                {favorites.length === 0 ? (
                    <p>Você ainda não adicionou nenhum filme aos favoritos.</p>
                ) : (
                    <div className="movie-list">
                        {favorites.map((fav) => (
                             <MovieCard
                                key={fav.movie_id}
                                movie={{
                                    id: fav.movie_id,
                                    title: fav.title,
                                    poster_path: fav.poster_path,
                                    vote_average: fav.vote_average
                                }}
                                onRemoveFromFavorites={() => removeFromFavorites(fav.movie_id)}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default FavoritesPage;