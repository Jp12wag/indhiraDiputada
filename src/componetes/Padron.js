import { Button } from 'bootstrap/dist/js/bootstrap.bundle';
import React from 'react';

// Sample data
const data = {
  "party": "PARTIDO REVOLUCIONARIO MODERNO -PRM-",
  "principles": ["DEMOCRACIA", "DESARROLLO", "IGUALDAD"],
  "commission": "COMISION NACIONAL DE ELECCIONES INTERNAS -CNEI-",
  "secretariat": "SECRETARIA DE TRANSFORMACION DIGITAL E INNOVACION",
  "electionDetails": {
    "event": "Padrón Nacional de Electores Primarias Octubre 2023",
    "province": "SANTO DOMINGO",
    "municipality": "SANTO DOMINGO OESTE",
    "district": "SANTO DOMINGO OESTE",
    "table": "M0024",
    "location": "ESC. PRIM. INT. RAFAELA SANTAELLA",
    "votersCount": 492,
    "page": 1,
    "totalPages": 24
  },
  "voters": [
    {
      "id": "001-0136825-6",
      "name": "ARELIS F. ABAD",
      "contact": {
        "cell": "(829) 455-3241",
        "tel": "1"
      },
      "voted": true,
      "address": "LOS ROJAS 16"
    },
    {
      "id": "012-0069181-2",
      "name": "LEONEL M. ALCANTARA MERAN",
      "contact": {
        "cell": "(829) 943-4550",
        "tel": "8299434550"
      },
      "voted": true,
      "address": ""
    },
    {
      "id": "402-3549601-1",
      "name": "EVA YANERIS F. ABREU",
      "contact": {
        "cell": "(809) 906-2845",
        "tel": "2"
      },
      "voted": true,
      "address": ""
    },
    {
      "id": "001-1938274-5",
      "name": "YANAURY DAHIANA F. ALCANTARA MONTERO",
      "contact": {
        "cell": "(829) 646-4028",
        "tel": "13"
      },
      "voted": true,
      "address": "CAFE 36"
    }
  ]
};

const Padron = () => {
  return (
    <div className="container">
      <h1>{data.party}</h1>
      <h3>{data.principles.join(" * ")}</h3>
      <h4>{data.commission}</h4>
      <h5>{data.secretariat}</h5>
      <hr />
      <h6>{data.electionDetails.event}</h6>
      <p><strong>Provincia:</strong> {data.electionDetails.province}</p>
      <p><strong>Municipio:</strong> {data.electionDetails.municipality}</p>
      <p><strong>Distrito Municipal:</strong> {data.electionDetails.district}</p>
      <p><strong>Mesa:</strong> {data.electionDetails.table}</p>
      <p><strong>Ubicación:</strong> {data.electionDetails.location}</p>
      <p><strong>Cantidad de Electores:</strong> {data.electionDetails.votersCount}</p>
      <p><strong>Página:</strong> {data.electionDetails.page} de {data.electionDetails.totalPages}</p>
      <hr />
      <h5>Votantes:</h5>
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>Cédula</th>
            <th>Nombre</th>
            <th>Celular</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Votó</th>
          </tr>
        </thead>
        <tbody>
          {data.voters.map((voter, index) => (
            <tr key={index}>
              <td>{voter.id}</td>
              <td>{voter.name}</td>
              <td>{voter.contact.cell}</td>
              <td>{voter.contact.tel}</td>
              <td>{voter.address}</td>
              <td>{voter.voted ? "Sí" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button variant="primary" onClick={() => window.print()}>Imprimir</button>
    </div>
  );
};

export default Padron;
