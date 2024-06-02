import React, { useState, useEffect } from 'react';
import '../estilos/donacion.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPrint } from '@fortawesome/free-solid-svg-icons';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import axios from 'axios';
import { verAlerta } from './funciones';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import { Modal, Button, Form } from 'react-bootstrap';
import imagen from '../imagenes/indhira.jpg';
import Factura from './Factura';



const DonacionCrud = () => {
    const token = localStorage.getItem('token');
    const [cedula, setCedula] = useState('');
    const [persona, setPersona] = useState(null);
    const [donacion, setDonacion] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [donaciones, setDonaciones] = useState([]);
    const usuarioJSON = localStorage.getItem('user');
    const [inventario, setInventario] = useState([]);
    const [isSearchVisible, setIsSearchVisible] = useState(true);
    const [showInventarioModal, setShowInventarioModal] = useState(false);
    const [filteredInventario, setFilteredInventario] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInventarioItem, setSelectedInventarioItem] = useState(null);
    const personaid = localStorage.getItem('id_persona');
    const [showFactura, setShowFactura] = useState(false);




    let usuario = [];
    if (usuarioJSON) {
        usuario = JSON.parse(usuarioJSON);
    } else {
        console.log('No se encontró el usuario en localStorage');
    }

    useEffect(() => {
        ConsultaInventario();
        if (personaid) {
            fetchPersona(personaid);
            fetchDonaciones(personaid);
        }
    });

    const handleShow = (donacion) => {
        // setSelectedPersona(donacion);
        //setShowModal(true);
        setShowFactura(true); // Muestra la factura al imprimir
       
    };
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    const handleConsulta = async () => {
        try {
            const response = await fetch(`http://localhost:3001/personas/${cedula}`, {
                method: 'GET',
                headers: config.headers
            });
            if (response.status === 404) {
                alert('Persona no registrada');
                setPersona(null);
                setDonaciones([]);
            } else {
                const data = await response.json();
                setPersona(data);
                setIsSearchVisible(false);
                setCedula('');
                localStorage.setItem('id_persona', data._id);
                fetchDonaciones(data._id);
            }
        } catch (error) {
            console.error('Error al consultar la persona:', error);
        }
    };

    const fetchPersona = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/personas/${id}`, {
                method: 'GET',
                headers: config.headers
            });
            if (response.status !== 404) {
                const data = await response.json();
                setPersona(data);
                setIsSearchVisible(false);
            }
        } catch (error) {
            console.error('Error al consultar la persona:', error);
        }
    };

    const ConsultaInventario = async () => {
        try {
            if (!token) {
                return;
            }
            const response = await fetch('http://localhost:3001/inventario', {
                method: 'GET',
                headers: config.headers
            });
            const data = await response.json();
            setInventario(data);
            setFilteredInventario(data);
        } catch (error) {
            console.error('Error al cargar el inventario:', error);
        }
    };

    const fetchDonaciones = async (personaId) => {
        try {
            const response = await fetch(`http://localhost:3001/donaciones/persona/${personaId}`, {
                method: 'GET',
                headers: config.headers
            });

            if (response.status === 404) {
                setDonaciones([]);
            } else {
                const data = await response.json();
                const today = new Date().setHours(0, 0, 0, 0);
                const donacionesHoy = data.filter(donacion =>
                    new Date(donacion.fecha).setHours(0, 0, 0, 0) === today
                );
                setDonaciones(donacionesHoy.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)));
            }
        } catch (error) {
            console.error('Error al obtener las donaciones:', error);
        }
    };

    const eliminarPersona = (id, name) => {
        const Myswal = withReactContent(Swal);
        Myswal.fire({
            title: '¿Estás seguro que quieres eliminar ' + name + ' donacion?',
            icon: 'question',
            text: 'No podrás revertir este paso',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteDonacion(id, name);
                ConsultaInventario();
            } else {
                verAlerta('la donacion no fue eliminado', 'info');
            }
        });
    };

    const deleteDonacion = async (id, name) => {
        try {
            // Obtener la donación que se va a eliminar
            const response = await fetch(`http://localhost:3001/donaciones/${id}`, {
                method: 'GET',
                headers: config.headers
            });
            const donacionData = await response.json();

            // Eliminar la donación
            await axios.delete(`http://localhost:3001/donaciones/${id}`, config);

            // Devolver la cantidad al inventario
            const inventarioItem = inventario.find(item => item.nombre === name);
            if (inventarioItem) {
                const newCantidadDisponible = inventarioItem.cantidad + donacionData.cantidad;
                await fetch(`http://localhost:3001/inventario/${inventarioItem._id}`, {
                    method: 'PATCH',
                    headers: config.headers,
                    body: JSON.stringify({ cantidad: newCantidadDisponible })
                });
                setInventario(inventario.map(item =>
                    item._id === inventarioItem._id
                        ? { ...item, cantidad: newCantidadDisponible }
                        : item
                ));
                ConsultaInventario();
            }

            fetchDonaciones(persona._id);
        } catch (error) {
            console.error('Error al eliminar la donación:', error);
        }
    };

    const handleAgregarDonacion = async () => {
        if (!donacion || !persona || !cantidad) {
            alert('Por favor complete todos los campos requeridos.');
            return;
        }

        if (parseInt(cantidad) > selectedInventarioItem.cantidad || parseInt(cantidad) < 0) {
            alert(`No puedes seleccionar más de ${selectedInventarioItem.cantidad} del inventario.`);
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/donaciones', {
                method: 'POST',
                headers: config.headers,
                body: JSON.stringify({
                    donacion,
                    cantidad,
                    owner: persona._id,
                    historial: usuario._id
                }),
            });

            if (response.ok) {
                alert('Donación agregada exitosamente');

                // Descontar del inventario
                const newCantidadDisponible = selectedInventarioItem.cantidad - parseInt(cantidad);

                // Actualizar inventario en el backend
                await fetch(`http://localhost:3001/inventario/${selectedInventarioItem._id}`, {
                    method: 'PATCH',
                    headers: config.headers,
                    body: JSON.stringify({ cantidad: newCantidadDisponible })
                });
                setInventario(inventario.map(item =>
                    item._id === selectedInventarioItem._id
                        ? { ...item, cantidad: newCantidadDisponible }
                        : item
                ));
                setDonacion('');
                setCantidad('');
                setSelectedInventarioItem(null);
                fetchDonaciones(persona._id);
                ConsultaInventario();
            } else {
                const errorData = await response.json();
                alert(`Error al agregar la donación: ${errorData.message || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error al agregar la donación:', error);
            alert('Error al agregar la donación');
        }
    };

    const handleInventarioSearch = (term) => {
        setSearchTerm(term);
        if (term) {
            const filtered = inventario.filter(item => item.nombre.toLowerCase().includes(term.toLowerCase()));
            setFilteredInventario(filtered);
        } else {
            setFilteredInventario(inventario);
        }
    };

    const handleSelectInventarioItem = (item) => {
        setDonacion(item.nombre);
        setSelectedInventarioItem(item);
        setShowInventarioModal(false);
    };

    const getImagePath = (cedula) => {
        try {
            return require(`../imagenes/${cedula}.png`);
        } catch (err) {
            return require(`../imagenes/camaras.png`); // Imagen por defecto
        }
    };
    const Cordenada = (e) => {
            window.location.href = '/donaciones';
    };

    const handleNewConsultaChange = (e) => {
        if (e.target.name === 'cedula') {
            // Formatear la cédula
            let formattedValue = e.target.value.replace(/\D/g, ''); // Eliminar todo lo que no sean dígitos
    
            if (formattedValue.length > 3) {
                formattedValue = formattedValue.slice(0, 3) + '-' + formattedValue.slice(3);
            }
            if (formattedValue.length > 11) {
                formattedValue = formattedValue.slice(0, 11) + '-' + formattedValue.slice(11);
            }
    
            formattedValue = formattedValue.slice(0, 13); // Asegurarse de que la longitud no exceda los 13 caracteres
    
            setCedula(formattedValue); // Actualizar el estado con el valor formateado
        } else {
            setCedula(e.target.value);
        }
    };

    return (
        <div className='contenedor-informacion'>
            {isSearchVisible && (
                <div className='control-busqueda' id='controlBusqueda'>
                    <img src={imagen} alt='tu diputada' />
                    <h2>Consulta Cédula</h2>
                    <input type="text" name='cedula'  maxlength="13" placeholder="000-0000000-0"  value={cedula} onChange={handleNewConsultaChange} />
                    <button onClick={handleConsulta}>Consultar</button>

                </div>
            )}

            {persona && (
                <div className='contenedor-Persona'>
                    <input className='btn-volver' type='submit' value={'VOLVER'} onClick={(e) => Cordenada(e)}/>
                    <h3>Donación</h3>
                    <img
                       src={getImagePath(persona.cedula)}
                        alt={persona.nombre}
                    />
                    <p>Cedula: {persona.cedula}</p>
                    <p>Nombre: {persona.nombre}</p>
                    <p>Telefono: {persona.telefono}</p>
                    <p>Direccion: {persona.direccion}</p>
                    <p>Sector: {persona.sector}</p>
                    <p>Zona: {persona.zona}</p>
                </div>
            )}
            {persona && (
                <div className='historico'>
                    {persona && (
                        <div id='contenedorDonacion' className='agregarDonacion'>
                            <h2>Agregar Donación</h2>
                            <Form.Group>
                                <Form.Control
                                    type="text"
                                    placeholder="Donación"
                                    value={donacion}
                                    onClick={() => setShowInventarioModal(true)}
                                    readOnly
                                />
                            </Form.Group>
                            {selectedInventarioItem && (
                                <Form.Group>
                                    <Form.Label className='colores'>Cantidad Disponible: {selectedInventarioItem.cantidad}</Form.Label>
                                </Form.Group>
                            )}
                            <Form.Group>
                                <Form.Control
                                    type="number"
                                    placeholder="Cantidad"
                                    value={cantidad}
                                    onChange={(e) => setCantidad(e.target.value)}
                                    min={0}
                                />
                            </Form.Group>
                            <Button onClick={handleAgregarDonacion}>Agregar Donación</Button>
                        </div>
                    )}

                    {persona && (
                        <div>
                            <h2>Historial de Donaciones</h2>
                            <div className='tabla-contenedor'>
                                <table className='table table-bordered'>
                                    <thead>
                                        <tr>
                                            <th>Cantidad</th>
                                            <th>Donación</th>
                                            <th>Fecha</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {donaciones.map((donacion) => (
                                            <tr key={donacion._id}>
                                                <td>{donacion.cantidad}</td>
                                                <td>{donacion.donacion}</td>
                                                <td>{new Date(donacion.fecha).toLocaleDateString()}</td>
                                                <td>
                                                    <button onClick={() => eliminarPersona(donacion._id, donacion.donacion)}><FontAwesomeIcon icon={faTrash} /></button>
                                                    <button onClick={() => handleShow(donacion)}><FontAwesomeIcon icon={faPrint} /></button>

                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    
                </div>
            )}
            <Modal show={showInventarioModal} onHide={() => setShowInventarioModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Seleccionar Donación del Inventario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        type="text"
                        placeholder="Buscar en inventario"
                        value={searchTerm}
                        onChange={(e) => handleInventarioSearch(e.target.value)}
                    />
                    <ul className="list-group mt-3">
                        {filteredInventario.map((item) => (
                            <li
                                key={item._id}
                                className="list-group-item list-group-item-action"
                                onClick={() => handleSelectInventarioItem(item)}
                            >
                                {item.nombre}{'\n'}--{'\n'} {'\n'}
                                {item.descripcion}  {'\n'}{'\n'}--{'\n'} (Disponible: {item.cantidad})
                            </li>
                        ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowInventarioModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>



            {showFactura && (
                <Factura
                    show={true} // Puedes controlar si se muestra o no la factura
                    onClose={() => setShowFactura(false)} // Función para cerrar la factura
                    persona={persona} // Datos de la persona receptora de las donaciones
                    donaciones={donaciones} // Donaciones entregadas hoy
                    usuarioEntrega={usuarioJSON} // Datos del usuario que entrega las donaciones
                    
                />

            )}
          

        </div>


    );
};

export default DonacionCrud;
