
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditarPersonaModal = ({ show, handleClose, persona ,handleSave }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        cantidad: '',
        descripcion: ''
    });

    useEffect(() => {
        if (persona) {
            setFormData({
                nombre: persona.nombre,
                cantidad: persona.cantidad,
                descripcion: persona.descripcion,
                
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
                <Modal.Title>Editar Inventario</Modal.Title>
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
                    <Form.Group controlId="formCantidad">
                        <Form.Label>Cantidad</Form.Label>
                        <Form.Control
                          type="number"
                          name="cantidad"
                          value={formData.cantidad}
                          onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formDescripcion">
                        <Form.Label>Descripcion</Form.Label>
                        <Form.Control
                            type="text"
                            name="descripcion"
                            value={formData.descripcion}
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
