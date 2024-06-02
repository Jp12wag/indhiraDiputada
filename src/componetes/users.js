import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import '../estilos/usuario.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle'; // Importar Bootstrap
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import imagen from '../imagenes/indhira.jpg';

const UserCrud = () => {
  const token = localStorage.getItem('token');
  const usuarioJSON = localStorage.getItem('user');
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    nameUser: '',
    roles: ''
  });
  let usuario = [];
  if (usuarioJSON) {
      usuario = JSON.parse(usuarioJSON);
      console.log(usuario.name); // Asumiendo que el objeto tiene una propiedad 'nombre'
  } else {
      console.log('No se encontró el usuario en localStorage');
  }
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState({
    name: '',
    email: '',
    password: '',
    nameUser: '',
    roles: ''
  });

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No se encontró el token de autenticación.');
        return;
      }
      const response = await fetch('http://localhost:3001/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUsers(data);
      console.log(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const createUser = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await axios.post('http://localhost:3001/users', newUser);
      loadUsers();
      setNewUser({
        name: '',
        email: '',
        password: '',
        nameUser: '',
        roles: ''
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/users/${id}`);
      loadUsers();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const updateUser = async () => {
    
   

    const updatedUser = { ...editUser };
    if (editUser.password === '') {
      delete updatedUser.password;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:3001/users`, updatedUser, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      loadUsers();
      handleClose();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };
  const handleNewUserChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    });
  };

  const handleEditUserChange = (e) => {
    setEditUser({
      ...editUser,
      [e.target.name]: e.target.value
    });
  };

  const handleClose = () => setShowModal(false);

  const handleShow = (user) => {
   
    setEditUser(user);
    setShowModal(true);
  };

  const validateForm = () => {
    let validationErrors = {};

    if (!newUser.name) {
      validationErrors.name = 'El nombre es requerido';
    }

    if (!newUser.email) {
      validationErrors.email = 'El correo electrónico es requerido';
 
    } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      validationErrors.email = 'El correo electrónico no es válido';
    }

    if (!newUser.password) {
      validationErrors.password = 'La contraseña es requerida';
    } else if (newUser.password.length < 6) {
      validationErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!newUser.nameUser) {
      validationErrors.nameUser = 'El nombre de usuario es requerido';
    }

    if (!newUser.roles) {
      validationErrors.roles = 'El rol es requerido';
    }

    return validationErrors;
  };

  useEffect(() => {
    loadUsers();
  }, []);
  if (token && usuario) {
    return (

      <div>
        <div className='contenedor'>
          <div className='contenedor-formulario-todo'>
            <div className='contenedor-formulario'>
              <h2>Usuarios</h2>
              <h3>Agregar Usuario</h3>
              <div className='form-registro-persona'>
                <div>
                  <input
                    className='controls'
                    type="text"
                    name="name"
                    id='nombre'
                    placeholder="Ingrese su Nombre"
                    value={newUser.name}
                    onChange={handleNewUserChange}
                    required
                  />
                  {errors.name && <span className="error">{errors.name}</span>}
                </div>
                <div>
                  <input
                    className='controls'
                    type="email"
                    name="email"
                    id='email'
                    placeholder="Ingrese su Correo Electrónico"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                  />
                  {errors.email && <span className="error">{errors.email}</span>}
                </div>
                <div>
                  <input
                    className='controls'
                    type="password"
                    name="password"
                    id='password'
                    placeholder="Ingrese su Contraseña"
                    value={newUser.password}
                    onChange={handleNewUserChange}
                    required
                  />
                  {errors.password && <span className="error">{errors.password}</span>}
                </div>
                <div>
                  <input className='controls' type="text" name="nameUser" id='usuario' placeholder="Ingrese su Nombre de Usuario" value={newUser.nameUser}
                    onChange={handleNewUserChange}
                    required
                  />
                  {errors.nameUser && <span className="error">{errors.nameUser}</span>}
                </div>
                <div>
                  <select className='select' name="roles" id='roles' value={newUser.roles} onChange={handleNewUserChange} required >
                    {/* Agregar opciones del select aquí */}
                    <option value="">Selecciona un rol</option>
                    <option value="Administrador">Administrador</option>
                    <option value="usuario">Usuario</option>
                    <option value="editor">Editor</option>
                  </select>
                  {errors.roles && <span className="error">{errors.roles}</span>}
                </div>

                <button className='btn btn-dark botones' id='añadir' onClick={createUser}><FontAwesomeIcon icon={faPlusCircle} /> Añadir</button>
              </div>

            </div>
            <div className='contenedor-foto-diputada'><img src={imagen} alt='soy una imagen' /></div>
          </div>

          <div className='contenedor-lista'>
            <h3>Lista de Usuarios</h3>
            <table className='table table-bordered'>
              <thead>
                <tr>
                  <th>#</th>
                  <th>NOMBRE</th>
                  <th>CORREO</th>
                  <th>USUARIO</th>
                  <th>CONTRASEÑA</th>
                  <th>ROLES</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td><span>{user.name}</span></td>
                      <td><span>{user.email}</span></td>
                      <td><span>{user.nameUser}</span></td>
                      <td><span>{user.password}</span></td>
                      <td><span>{user.roles}</span></td>

                      <td>
                        <button className='botones-tabla' onClick={() => deleteUser(user._id)}><FontAwesomeIcon icon={faTrash} /></button>
                        <button className='botones-tabla' onClick={() => handleShow(user)}><FontAwesomeIcon icon={faEdit} /></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <li>No hay usuarios disponibles</li>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formName">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editUser.name}
                  onChange={handleEditUserChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={editUser.email}
                  onChange={handleEditUserChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="forPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={editUser.password}
                  onChange={handleEditUserChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="forUsuario">
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                  type="text"
                  name="nameUser"
                  value={editUser.nameUser}
                  onChange={handleEditUserChange}
                  required
                  readOnly
                  disabled
                />
              </Form.Group>
              <Form.Group controlId="formRoles">
                <Form.Label>Rol</Form.Label>
                <Form.Control
                  as="select"
                  name="roles"
                  value={editUser.roles}
                  onChange={handleEditUserChange}
                  required
                >
                  <option value="">Selecciona un rol</option>
                  <option value="Administrador">Administrador</option>
                  <option value="usuario">Usuario</option>
                  <option value="editor">Editor</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={updateUser}>
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  } else {
    // Redireccionar al usuario a la página de inicio de sesión u otra página adecuada si no hay token o usuario
    window.location.href = '/'; // Cambia '/login' por la ruta deseada
    return null;
  }
}
export default UserCrud;
