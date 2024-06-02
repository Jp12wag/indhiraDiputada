import React, { useState } from 'react';
import EditarPersonaModal from './EditarPersonaModal';
import axios from 'axios';

const PersonaTable = ({ personas, eliminarPersona }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedPersona, setSelectedPersona] = useState(null);

    const handleClose = () => setShowModal(false);
    const handleShow = (persona) => {
        setSelectedPersona(persona);
        setShowModal(true);
    };

    const handleSave = async (id, updatedData) => {
        try {
            const response = await axios.patch(`/personas/${id}`, updatedData);
            // Actualiza la lista de personas con la respuesta del servidor
            console.log('Persona actualizada:', response.data);
            handleClose();
        } catch (error) {
            console.error('Error actualizando persona:', error);
        }
    };

    return (
        <>
            <table className='table table-bordered'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>FOTO</th>
                        <th>NOMBRE</th>
                        <th>CEDULA</th>
                        <th>TELEFONO</th>
                        <th>ZONA</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {personas.map((persona, i) => (
                        <tr key={persona._id}>
                            <td>{i + 1}</td>
                            {persona.cedulaFoto && persona.cedulaFoto.data && (
                                <td>
                                    <img src={`data:image/png;base64,${btoa(String.fromCharCode.apply(null, persona.cedulaFoto.data))}`} alt="cedula" />
                                </td>
                            )}
                            <td>{persona.nombre}</td>
                            <td>{persona.cedula}</td>
                            <td>{persona.telefono}</td>
                            <td>{persona.zona}</td>
                            <td>
                                <button onClick={() => eliminarPersona(persona._id, persona.nombre)}>Eliminar</button>
                                <button onClick={() => handleShow(persona)}>Editar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedPersona && (
                <EditarPersonaModal
                    show={showModal}
                    handleClose={handleClose}
                    persona={selectedPersona}
                    handleSave={handleSave}
                />
            )}
        </>
    );
};

export default PersonaTable;
