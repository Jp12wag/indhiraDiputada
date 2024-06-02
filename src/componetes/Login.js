// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import '../estilos/login.css';


const Login = () => {
    const [nameUser, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:3001/users/login', {
                nameUser,
                password
            });

            // Verificar si response es undefined o si data está presente en response
            if (response && response.data) {
                // Establecer el token de sesión y otras variables en el almacenamiento local
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('id', response.data.user.id);
                localStorage.setItem('user',  JSON.stringify(response.data.user));


                // Redirigir al usuario al dashboard
                window.location.href = '/dashboard';
            } else {
                setError('Error de respuesta: no se han recibido datos válidos');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error desconocido');
        }
    };

    return (

        <div id="contenedor" className='contenedor'>
            <div id='contenedorcentrado'>
                <div id='login'>

                    <h2>Iniciar Sesión</h2>
                    {error && <p>{error}</p>}
                    <form onSubmit={handleSubmit} id="loginform">
                        <div>
                            <label>Usuario</label>
                            <input type="text" value={nameUser} placeholder='Ingresa tu usuario' onChange={(e) => setUsuario(e.target.value)} />
                        </div>
                        <div>
                            <label>Contraseña</label>
                            <input type="password" value={password} placeholder='Ingresa tu password' required onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button type="submit" title="Ingresar" name="Ingresar">Iniciar Sesión</button>
                    </form>

                </div>


                <div id='derecho'>
                    <div class="titulo">
                        Bienvenido
                    </div>
                    <p id='bienvenida-diputada'>Control de donaciones</p>
                </div>
            </div>


        </div>
    );
};

export default Login;
