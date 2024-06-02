// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './componetes/Login';
import Dashboard from './componetes/dashboard';
import User from './componetes/users';
import Persona from './componetes/personas';
import Donaciones from './componetes/donaciones';
import Inventario from './componetes/Inventario';
import Factura from './componetes/Factura';


function App() {
  return (
    <div className="App">
      <Router>
      <div className='nuevoContenedor'>
            <Routes>
              <Route path='/' element={<Login/>}></Route>
              <Route path='/dashboard' element={<Dashboard/>}></Route>
              <Route path='/users' element={<User/>}></Route>
              <Route path='/personas' element={<Persona/>}></Route>
              <Route path='/donaciones' element={<Donaciones/>}></Route>
              <Route path='/inventario' element={<Inventario/>}></Route>
              <Route path="/factura" element={<Factura/>} />
            
            </Routes>
          </div>
      </Router>
    </div>
  );
}

export default App;
