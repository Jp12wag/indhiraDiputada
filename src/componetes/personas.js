import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { verAlerta } from './funciones';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import '../estilos/persona.css';
import EditarPersonaModal from './EditarPersonaModal'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';


const PersonaCrud = () => {
    const token = localStorage.getItem('token');
    const [personas, setPersonas] = useState([]);
    const [newPersona, setNewPersona] = useState({
        nombre: '',
        cedula: '',
        telefono: '',
        zona: '',
        direccion:'',
        sector:'',
        owner: '' 
    });
    const [showModal, setShowModal] = useState(false);
    const [selectedPersona, setSelectedPersona] = useState(null);

    const handleClose = () => setShowModal(false);
    const handleShow = (persona) => {
        setSelectedPersona(persona);
        setShowModal(true);
    };
    const loadPersonas = async () => {
        try {
            const token = localStorage.getItem('token');


            if (!token) {
                console.error('No se encontró el token de autenticación.');
                return;
            }

            const response = await fetch('http://localhost:3001/personas', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setPersonas(data);
        } catch (error) {
            console.error('Error al cargar personas:', error);
        }
    };

    useEffect(() => {
        loadPersonas();
    }, []);

    const handleNewPersonaChange = (e) => {
        const { name, value } = e.target;
    
        if (name === 'cedula') {
            // Formatear la cédula
            let formattedValue = value.replace(/\D/g, ''); // Eliminar todo lo que no sean dígitos
    
            if (formattedValue.length > 3) {
                formattedValue = formattedValue.slice(0, 3) + '-' + formattedValue.slice(3);
            }
            if (formattedValue.length > 11) {
                formattedValue = formattedValue.slice(0, 11) + '-' + formattedValue.slice(11);
            }
    
            formattedValue = formattedValue.slice(0, 13); // Asegurarse de que la longitud no exceda los 13 caracteres
    
            setNewPersona({
                ...newPersona,
                [name]: formattedValue
            });
        }else if(name==='telefono'){
            let formattedValue = value.replace(/\D/g, ''); // Eliminar todo lo que no sean dígitos
             if (formattedValue.length > 3) {
                formattedValue = formattedValue.slice(0, 3) + '-' + formattedValue.slice(3);
            }
            if (formattedValue.length > 7) {
                formattedValue = formattedValue.slice(0, 7) + '-' + formattedValue.slice(7);
            }

              formattedValue = formattedValue.slice(0, 12); // Asegurarse de que la longitud no exceda los 10 caracteres

              setNewPersona({
                ...newPersona,
                [name]: formattedValue
            });

        } else {
            setNewPersona({
                ...newPersona,
                [name]: value
            });
        }
        console.log(newPersona.owner);
    };
    

   
    const handleSave = async (id, updatedData) => {
        try {
            const response = await axios.patch(`http://localhost:3001/personas/${id}`, updatedData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Persona actualizada:', response.data);
            loadPersonas();
            handleClose();
        } catch (error) {
            console.error('Error actualizando persona:', error);
        }
    };

    let eliminarPersona = (id, name) => {
        const Myswal = withReactContent(Swal);
        Myswal.fire({
            title: '¿Estás seguro que quieres eliminar ' + name + ' Persona?',
            icon: 'question',
            text: 'No podrás revertir este paso',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                deletePersona(id);

            } else {
                verAlerta('El categoria no fue eliminado', 'info');
            }
        });
    }

   // console.log((personas.map((pe, i) => (pe.cedulaFoto.data))));

    const createPersona = async () => {
        try {
            const formData = new FormData();
            formData.append('nombre', newPersona.nombre);
            formData.append('cedula', newPersona.cedula);
            formData.append('telefono', newPersona.telefono);
            formData.append('direccion', newPersona.direccion);
            formData.append('sector', newPersona.sector);
            formData.append('zona', newPersona.zona);

            console.log(newPersona);
            // Agregar el token de autenticación al encabezado de la solicitud
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            // Realizar la solicitud POST para crear una persona
            await axios.post('http://localhost:3001/personas/register', newPersona, config);
            loadPersonas();
            setNewPersona({
                nombre: '',
                cedula: '',
                telefono: '',
                direccion:'',
                sector:'',
                zona:''
            });
        } catch (error) {
            console.error('Error al crear persona:', error);
        }
    };



    const getImagePath = (cedula) => {
        try {
            return require(`../imagenes/${cedula}.png`);
        } catch (err) {
            return require(`../imagenes/camaras.png`); // Imagen por defecto
        }
    };



    const deletePersona = async (id) => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            await axios.delete(`http://localhost:3001/personas/${id}`, config);
            loadPersonas();
        } catch (error) {
            console.error('Error al eliminar persona:', error);
        }
    };
    if (token) {
        return (
            <div className='contenedor-info'>
                <h2>Personas</h2>
                <h3>Agregar Persona</h3>
                <div className='formulario-registro-persona'>
                    <input type="text" name="nombre" placeholder="Nombre" value={newPersona.nombre} onChange={handleNewPersonaChange} />
                    <input type="text" name="cedula"maxlength="13" placeholder="000-0000000-0" value={newPersona.cedula} onChange={handleNewPersonaChange} />
                    <input type="text" name="telefono" placeholder="Teléfono" value={newPersona.telefono} onChange={handleNewPersonaChange} />
                    <input type="text" name='zona' placeholder="Zona" value={newPersona.zona} onChange={handleNewPersonaChange} />
                    <input type="text" name='direccion' placeholder="Direccion" value={newPersona.direccion} onChange={handleNewPersonaChange} />
                    <input type="text" name='sector' placeholder="Sector" value={newPersona.sector} onChange={handleNewPersonaChange} />
                    <button onClick={createPersona}><FontAwesomeIcon icon={faPlusCircle} />Añadir</button>
                </div>
                <h3>Lista de Personas</h3>
                <div className='contenedor-tabla'>
                <table className='table table-bordered' id='tamano'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>FOTO</th>
                            <th>NOMBRE</th>
                            <th>CEDULA</th>
                            <th>TELEFONO</th>
                            <th>ZONA</th>
                            <th>DIRECCION</th>
                            <th>SECTOR</th>
                            <th>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {personas.map((persona, i) => (
                            <tr key={persona._id}>
                                <td>{i + 1}</td>
                                {persona && (
                                   
                                    <td>
                                        <img className='tamanoImagen' src={getImagePath(persona.cedula)}  alt="cedula" />
                                    </td>
                                )}
                            
                                <td>{persona.nombre}</td>
                                <td>{persona.cedula}</td>
                                <td>{persona.telefono}</td>
                                <td>{persona.zona}</td>
                                <td>{persona.direccion}</td>
                                <td>{persona.sector}</td>
                                <td>
                                    <button onClick={() => eliminarPersona(persona._id, persona.nombre)}><FontAwesomeIcon icon={faTrash} /></button>
                                    <button onClick={() => handleShow(persona)}> <FontAwesomeIcon icon={faEdit} /></button>
                                </td>
                                
                            </tr>
                            
                        ))}
                    </tbody>
                </table>
                </div>
                {selectedPersona && (
                    <EditarPersonaModal
                        show={showModal}
                        handleClose={handleClose}
                        persona={selectedPersona}
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

export default PersonaCrud;
