import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../estilos/donacion.css'

const Factura = ({ show, onClose, persona, donaciones, usuarioEntrega }) => {

    let usuarioEntregaJSON;
    try {
        usuarioEntregaJSON = JSON.parse(usuarioEntrega);
    } catch (error) {
        console.error('Error al parsear usuarioEntrega:', error);
        // Manejar el error, por ejemplo, mostrando un mensaje al usuario o estableciendo un valor predeterminado para usuarioEntregaJSON
    }


    const handlePrint = () => {
        window.print(); // Esto abre el diálogo de impresión del navegador
    };
    const getImagePath = (cedula) => {
        try {
            return require(`../imagenes/${cedula}.png`);
        } catch (err) {
            return require(`../imagenes/camaras.png`); // Imagen por defecto
        }
    };
    const getCurrentDate = () => {
        const date = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        console.log(date);
        return date.toLocaleDateString(undefined, options);
    };
    
    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton >
                <Modal.Title className="mx-auto">Despacho de la diputada Indhira de Jesus</Modal.Title>
               
                
            </Modal.Header>
            <Modal.Title className="text-center">{'Conduce'}</Modal.Title> {/* Agregar subtítulo */}
            <Modal.Title className="text-end">{getCurrentDate() }</Modal.Title>
            <Modal.Body>
                <div className="row">
                    <div className="col">
                        <h5>Datos de la Persona:</h5>
                        <p><strong>Cédula:</strong> {persona.cedula}</p>
                        <p><strong>Nombre:</strong> {persona.nombre}</p>
                        <p><strong>Teléfono:</strong> {persona.telefono}</p>
                        <p><strong>Dirección:</strong> {persona.direccion}</p>
                        <p><strong>Sector:</strong> {persona.sector}</p>
                        <p><strong>Zona:</strong> {persona.zona}</p>
                    </div>
                    <div className="col">

                        {persona && (
                            <img className="bordered-image" src={getImagePath(persona.cedula)}
                                alt={persona.nombre} />
                        )}
                    </div>
                </div>
                <hr />
                <h5>Donaciones Entregadas</h5>
                <table className='table table-bordered'>
                    <thead>
                        <tr>
                            <th>Donación</th>
                            <th>Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donaciones.map((donacion, index) => (
                            <tr key={index}>
                                <td>{donacion.donacion}</td>
                                <td>{donacion.cantidad}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <hr />
                {/* Otro contenido */}


                <h5>Información del Usuario que Entrega:</h5>
                <p><strong>Nombre:</strong> {usuarioEntregaJSON.name}</p>
                {/* Puedes agregar más detalles según la estructura del objeto de usuario */}


                <p><strong>Recibido por:</strong> ______________________</p>
                {/* Aquí puedes agregar más información del usuario que recibe */}
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button variant="secondary" onClick={handlePrint}>Imprimir</Button>
                <Button variant="secondary" onClick={onClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Factura;
