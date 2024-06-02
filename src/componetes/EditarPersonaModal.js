
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditarPersonaModal = ({ show, handleClose, persona ,handleSave }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        cedula: '',
        telefono: '',
        direccion: '',
        sector:'',
        zona: ''
    });

    useEffect(() => {
        if (persona) {
            setFormData({
                nombre: persona.nombre,
                cedula: persona.cedula,
                telefono: persona.telefono,
                direccion: persona.direccion,
                sector: persona.sector,
                zona: persona.zona
            });
        }
    }, [persona]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSave(persona._id, formData);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Persona</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formNombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            readOnly
                            disabled
                        />
                    </Form.Group>
                    <Form.Group controlId="formCedula">
                        <Form.Label>Cédula</Form.Label>
                        <Form.Control
                          type="text"
                          name="cedula"
                          value={formData.cedula}
                          readOnly
                          disabled
                        />
                    </Form.Group>
                    <Form.Group controlId="formTelefono">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control
                            type="text"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formDireccion">
                        <Form.Label>Direccion</Form.Label>
                        <Form.Control
                            type="text"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formSector">
                        <Form.Label>Sector</Form.Label>
                        <Form.Control
                            type="text"
                            name="sector"
                            value={formData.sector}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formZona">
                        <Form.Label>Zona</Form.Label>
                        <Form.Control
                            type="text"
                            name="zona"
                            value={formData.zona}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Guardar Cambios
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditarPersonaModal;
