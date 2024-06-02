import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { verAlerta } from './funciones';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import '../estilos/inventario.css';
import EditarInventarioModal from './EditarInventarioModal'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const InventarioCrud = () => {
    const token = localStorage.getItem('token');
    const [inventario, setInventario] = useState([]);
    const [newInventario, setNewInventario] = useState({
        nombre: '',
        cantidad: '',
        descripcion: '',
        owner:'', // Cambiar a null para el campo de imagen
    });
    

   
    const usuarioJSON = localStorage.getItem('user');
    let usuario = [];
    if (usuarioJSON) {
        usuario = JSON.parse(usuarioJSON);  
    } else {
        console.log('No se encontró el usuario en localStorage');
    }
    const [showModal, setShowModal] = useState(false);
    const [selectedInventario, setSelectedInventario] = useState(null);

    const handleClose = () => setShowModal(false);
    const handleShow = (persona) => {
        setSelectedInventario(persona);
        setShowModal(true);
    };
    const loadInventario = async () => {
        try {
            if (!token) {
               
                return;
            }

            const response = await fetch('http://localhost:3001/inventario', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setInventario(data);
        } catch (error) {
            console.error('Error al cargar personas:', error);
        }
    };

    useEffect(() => {
        loadInventario();
    }, []);

    const handleNewInventarioChange = (e) => {
           setNewInventario({ ...newInventario,
            [e.target.name]: e.target.value});
        
    };

   
    const handleSave = async (id, updatedData) => {
        try {
            const response = await axios.patch(`http://localhost:3001/inventario/${id}`, updatedData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if(response.status==="ok"){

            }
           
            loadInventario();
            handleClose();
        } catch (error) {
            console.error('Error actualizando inventario:', error);
        }
    };

    let eliminarInventario = (id, name) => {
        const Myswal = withReactContent(Swal);
        Myswal.fire({
            title: '¿Estás seguro que quieres eliminar ' + name + ' Inventario?',
            icon: 'question',
            text: 'No podrás revertir este paso',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteInventario(id);

            } else {
                verAlerta('El inventario no fue eliminado', 'info');
            }
        });
    }


    const createInventario = async () => {
        try {
            // Agregar el token de autenticación al encabezado de la solicitud
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            // Realizar la solicitud POST para crear una persona
            await axios.post('http://localhost:3001/inventario/register', newInventario, config);
            loadInventario();
            setNewInventario({
                nombre: '',
                cantidad: '',
                descripcion: ''
                
            });
        } catch (error) {
            console.error('Error al crear inventario:', error);
        }
    };

    const deleteInventario = async (id) => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            await axios.delete(`http://localhost:3001/inventario/${id}`, config);
            loadInventario();
        } catch (error) {
            console.error('Error al eliminar inventario:', error);
        }
    };
    if (token) {
        return (
            <div className='contenedor-info'>
                <h2>Inventario</h2>
                <h3>Agregar Inventario</h3>
                <div className='formulario-registro-persona'>
                    <input type="text" name="nombre" placeholder="Nombre" value={newInventario.nombre} onChange={handleNewInventarioChange} />
                    <input type="number" name="cantidad" placeholder="Cantidad" value={newInventario.cantidad} onChange={handleNewInventarioChange} />
                    <textarea type="text" name="descripcion" placeholder="Descripcion" value={newInventario.descripcion} onChange={handleNewInventarioChange} />
                    <button onClick={createInventario}><FontAwesomeIcon icon={faPlusCircle} />Añadir</button>
                </div>
                <h3>Lista de Personas</h3>
                <table className='table table-bordered tamano'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>NOMBRE</th>
                            <th>CANTIDAD</th>
                            <th>DESCRIPCION</th>
                            <th>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventario.map((inventario, i) => (
                            <tr key={inventario._id}>
                                <td>{i + 1}</td>
                                <td>{inventario.nombre}</td>
                                <td>{inventario.cantidad}</td>
                                <td>{inventario.descripcion}</td>
                                <td>
                                    <button onClick={() => eliminarInventario(inventario._id, inventario.nombre)}><FontAwesomeIcon icon={faTrash} /></button>
                                    <button onClick={() => handleShow(inventario)}> <FontAwesomeIcon icon={faEdit} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {selectedInventario && (
                    <EditarInventarioModal
                        show={showModal}
                        handleClose={handleClose}
                        persona={selectedInventario}
                        handleSave={handleSave}
                    />
                )}
            </div>
        );
    } else {
        return (
            <div>
                <h2>No estás autenticado</h2>
            </div>
        );
    }

};

export default InventarioCrud;
