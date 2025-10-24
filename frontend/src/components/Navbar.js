import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated, setAuth }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuth(false);
        navigate('/');
    };

    return (
        <nav className="navbar">
            <Link to="/"><h1>Lista de Filmes</h1></Link>
            <div>
                {isAuthenticated ? (
                    <>
                        <Link to="/favorites">Meus Favoritos</Link>
                        <button onClick={handleLogout} className="logout-btn">Sair</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Registrar</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;