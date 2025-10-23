import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import MovieCard from '../components/MovieCard';

const SharedListPage = () => {
    const { userId } = useParams();
    const [data, setData] = useState({ username: '', favorites: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchList = async () => {
            try {
                const response = await api.get(`/favorites/public/${userId}`);
                setData(response.data);
            } catch (err) {
                setError('Lista de favoritos não encontrada ou inválida.');
            } finally {
                setLoading(false);
            }
        };
        fetchList();
    }, [userId]);

    if (loading) return <p>Carregando lista de favoritos...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div>
            <header className="App-header">
                <h2>Lista de Favoritos de {data.username}</h2>
            </header>
            <main>
                <div className="movie-list">
                    {data.favorites.length > 0 ? (
                        data.favorites.map(fav => (
                            <MovieCard
                                key={fav.movie_id}
                                movie={{
                                    id: fav.movie_id,
                                    title: fav.title,
                                    poster_path: fav.poster_path,
                                    vote_average: fav.vote_average
                                }}
                            />
                        ))
                    ) : (
                        <p>Esta lista está vazia.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SharedListPage;