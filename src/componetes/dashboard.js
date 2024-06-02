import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../estilos/dashboard.css';


const Dashboard = () => {
    const token = localStorage.getItem('token');
    const usuarioJSON = localStorage.getItem('user');
    let usuario = [];
    if (usuarioJSON) {
        usuario = JSON.parse(usuarioJSON);
      
    } else {
        console.log('No se encontró el usuario en localStorage');
    }
    // Función para cerrar sesión
    const logout = async () => {
        // Eliminar elementos relacionados con la sesión del almacenamiento local
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        try {
            await axios.post('http://localhost:3001/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
        // Redireccionar al usuario a la página de inicio de sesión u otra página adecuada
        window.location.href = '/'; // Cambia '/login' por la ruta deseada
    };


    if (token && usuario) {
        return (
            <div id="contenedor">
                <div id="contenedor-dashboard">
                    <div id='contenedor-titulo'>
                        <h2 className='titulo'>Panel de Control</h2>
                        <h3 id='nombre-usuario' className='titulo'>Usuario: {usuario.name}</h3>
                    </div>
                    <div id='contenedor-botones'>
                        <nav>
                            <ul className="mi-lista">
                                {usuario.roles === 'Administrador' && (
                                    <>
                                        <li>
                                            <Link to='/users'>Registro Usuario</Link>
                                        </li>
                                       

                                        <li>
                                            <Link to='/reportes'>Reportes</Link>
                                        </li>

                                        <li>
                                    <Link to='/inventario'>Registro Inventario</Link>
                                </li>
                                    </>
                                )}
                                 <li>
                                            <Link to='/personas'>Registro Persona</Link>
                                        </li>
                                <li>
                                    <Link to='/donaciones'>Registro Donación</Link>
                                </li>

                                <li>
                                    <Link onClick={logout}>Salir</Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        );
    } else {
        // Redireccionar al usuario a la página de inicio de sesión u otra página adecuada si no hay token o usuario
        window.location.href = '/login'; // Cambia '/login' por la ruta deseada
        return null;
    }

}

export default Dashboard;