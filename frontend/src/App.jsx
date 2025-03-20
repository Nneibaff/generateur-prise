import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Button, ListGroup, Badge, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';  // Styles personnalisés si nécessaire

function App() {
  
  const [formats, setFormats] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [finitions, setFinitions] = useState([]);
  const [selectedFinition, setSelectedFinition] = useState('');
  const [equipements, setEquipements] = useState([]);
  const [selectedEquipement, setSelectedEquipement] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [error, setError] = useState('');
  const [showEquipements, setShowEquipements] = useState(false);
  const [showFormats, setShowFormats] = useState(false);
  const [showFinitions, setShowFinitions] = useState(false);
 

  useEffect(() => {
    axios.get("http://localhost:5000/api/formats")
      .then(response => setFormats(response.data))
      .catch(() => setError("Erreur lors de la récupération des formats."));
  }, []);


  useEffect(() => {
    axios.get("http://localhost:5000/api/finitions")
      .then(response => {
        const uniqueFinitions = [];
        response.data.forEach(finition => {
          if (!uniqueFinitions.some(m => m['NomFinition'] === finition['NomFinition'])) {
            uniqueFinitions.push(finition);
          }
        });
        setFinitions(uniqueFinitions);
      })
      .catch(() => setError("Erreur lors de la récupération des finitions."));
  }, []);


  useEffect(() => {
    axios.get("http://localhost:5000/api/equipements")
      .then(response => {
        const uniqueEquipements = [];
        response.data.forEach(equipement => {
          if (!uniqueEquipements.some(m => m['NomEquipement'] === equipement['NomEquipement'])) {
            uniqueEquipements.push(equipement);
          }
        });
        setEquipements(uniqueEquipements);
      })
      .catch(() => setError("Erreur lors de la récupération des équipements."));
  }, []);

  useEffect(() => {
    if (selectedEquipement && selectedFormat) {
      setPreviewImage(`/images/${selectedEquipement}_${selectedFormat}.png`);
    }
  }, [selectedEquipement, selectedFormat]);




  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <h1 className="text-center mb-4">Configurateur de Prises</h1>
        </Col>
      </Row>

      {/* Affichage des erreurs */}
      {error && (
        <Row className="justify-content-center">
          <Col md={10}>
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      <Row>
        {/* Sidebar */}
        <Col md={4}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="text-center bg-primary text-white">
              Options de Configuration
            </Card.Header>
            <Card.Body>
              <Button
                variant="outline-primary"
                className="w-100 mb-2"
                onClick={() => {
                  setShowFormats(!showFormats);
                  setShowEquipements(false);
                  setShowFinitions(false);
                }}
              >
                {showFormats ? "Masquer les formats" : "Voir les formats"}
              </Button>
              <Button
                variant="outline-primary"
                className="w-100"
                onClick={() => {
                  setShowFinitions(!showFinitions);
                  setShowEquipements(false);
                  setShowFormats(false);
                }}
              >
                {showFinitions ? "Masquer les finitions" : "Voir les finitions"}
              </Button>
              <Button
                variant="outline-primary"
                className="w-100 mb-2"
                onClick={() => {
                  setShowEquipements(!showEquipements);
                  setShowFormats(false);
                  setShowFinitions(false);
                }}
              >
                {showEquipements ? "Masquer les équipements" : "Voir les équipements"}
              </Button>
            </Card.Body>
          </Card>

          {/* Affichage conditionnel des listes */}
          {(showFormats || showFinitions || showEquipements) && (
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="text-center">
                  {showEquipements
                    ? "Equipements disponibles"
                    : showFormats
                    ? "Formats disponibles"
                    : "Finitions disponibles"}
                </Card.Title> 
                <ListGroup style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {showFormats &&
                    formats.map((format, index) => (
                      <ListGroup.Item
                        key={index}
                        action
                        active={selectedFormat === format['Item']} 
                        onClick={() => setSelectedFormat(format['Item'])} 
                      >
                        {/* {index === 0 ? svg: null} */}
                        {format['Item']}
                      </ListGroup.Item>
                    ))}
                  {showFinitions &&
                    finitions.map((finition, index) => (
                      <ListGroup.Item
                        key={index}
                        action
                        active={selectedFinition === finition['NomFinition']}
                        onClick={() => setSelectedFinition(finition['NomFinition'])}
                      >
                        {finition['NomFinition']}
                      </ListGroup.Item>
                    ))}
                  {showEquipements &&
                    equipements.map((equipement, index) => (
                      <ListGroup.Item
                        key={index}
                        action
                        active={selectedEquipement === equipement['NomEquipement']}
                        onClick={() => setSelectedEquipement(equipement['NomEquipement'])}
                      >
                        {equipement['NomEquipement']}
                      </ListGroup.Item>
                    ))}
                </ListGroup>
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* Zone de prévisualisation */}
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header className="text-center bg-primary text-white">
              Prévisualisation
            </Card.Header>
            <Card.Body className="text-center">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Prise Configurée"
                  className="img-fluid fade-in"
                  style={{ maxWidth: "70%", borderRadius: "10px" }}
                />
              ) : (
                <div className="mt-3">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Sélectionnez des équipements, un format, une finition</p>
                </div>
              )}

              {/* Badges affichant la sélection */}
              <div className="mt-3">
                {selectedEquipement && <Badge bg="info" className="me-2">{selectedEquipement}</Badge>}
                {selectedFormat && <Badge bg="secondary" className="me-2">{selectedFormat}</Badge>}
                {selectedFinition && <Badge bg="success">{selectedFinition}</Badge>}
              </div>
            </Card.Body>
            <Card.Footer className="text-center">
              <Button
                variant="success"
                disabled={!selectedEquipement || !selectedFormat || !selectedFinition}
              >
                Ajouter au panier
              </Button>
              <Button 
                variant="secondary"
                className="ms-2"
                onClick={() => {
                  setSelectedEquipement('');
                  setSelectedFormat('');
                  setSelectedFinition('');
                  setPreviewImage('');
                }}
              >
                Réinitialiser
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;