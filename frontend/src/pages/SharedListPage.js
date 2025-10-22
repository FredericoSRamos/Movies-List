import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../components/MovieCard';

const SharedListPage = () => {
    const { listId } = useParams();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchList = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/favorites/${listId}`);
                setMovies(response.data);
            } catch (err) {
                setError('Lista de favoritos não encontrada ou inválida.');
            } finally {
                setLoading(false);
            }
        };
        fetchList();
    }, [listId]);

    if (loading) return <p>Carregando lista de favoritos...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div>
            <header className="App-header">
                <h1>Lista de Favoritos Compartilhada</h1>
                 <p>
                    <a href="/">Criar minha própria lista</a>
                </p>
            </header>
            <main>
                <div className="movie-list">
                    {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                </div>
            </main>
        </div>
    );
};

export default SharedListPage;