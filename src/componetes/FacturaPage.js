import React from 'react';
import { useLocation } from 'react-router-dom';
import Factura from './Factura';

const FacturaPage = () => {
  const location = useLocation();
  const { persona, donaciones, usuarioEntrega } = location.state;

  return (
    <div>
      <Factura
        show={true}
        onClose={() => {}}
        persona={persona}
        donaciones={donaciones}
        usuarioEntrega={usuarioEntrega}
      />
    </div>
  );
};

export default FacturaPage;
