import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Button, ListGroup, Badge, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';  // Styles personnalisés si nécessaire

function App() {
  
  const [formats, setFormats] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [equipements, setEquipements] = useState([]);
  const [selectedEquipement, setSelectedEquipement] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [error, setError] = useState('');
  const [showEquipements, setShowEquipements] = useState(false);
  const [showFormats, setShowFormats] = useState(false);

 

  useEffect(() => {
    axios.get("http://localhost:5000/api/formats")
      .then(response => setFormats(response.data))
      .catch(() => setError("Erreur lors de la récupération des équipements."));
  }, []);

  useEffect(() => {
    if (selectedEquipement && selectedFormat) {
      setPreviewImage(`/images/${selectedEquipement}_${selectedFormat}.png`);
    }
  }, [selectedEquipement, selectedFormat]);


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
  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4"> Configurateur de Prises</h1>

      {/* Affichage des erreurs */}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        
        {/* Sidebar : Choix des équipements */}
        <Col md={4}>
        {/* Bouton pour afficher/masquer la liste des équipements */}
        <Button 
          variant="primary" 
          className="mb-3" 
          onClick={() => {
            setShowEquipements(!showEquipements);
            setShowFormats(false);
          }}
        >
          {showEquipements ? "Masquer les équipements" : "Voir les équipements"}
        </Button>

        {/* Bouton pour afficher/masquer la liste des formats */}
        <Button 
          variant="primary" 
          className="mb-3" 
          onClick={() => {
            setShowFormats(!showFormats);
            setShowEquipements(false);
          }}
        >
          {showFormats ? "Masquer les formats" : "Voir les formats"}
        </Button>

        {/* Affichage conditionnel de la liste des équipements ou des formats */}
        {(showEquipements || showFormats) && (
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title className="text-center">
                {showEquipements ? "Equipements disponibles" : "Formats disponibles"}
              </Card.Title>
              <ListGroup style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {showEquipements && equipements.map((equipement, index) => (
                  <ListGroup.Item 
                    key={index} 
                    action 
                    active={selectedEquipement === equipement['NomEquipement']}
                    onClick={() => setSelectedEquipement(equipement['NomEquipement'])}
                  >
                    {equipement['NomEquipement']}
                  </ListGroup.Item>
                ))}
                {showFormats && formats.map((format, index) => (
                  <ListGroup.Item 
                    key={index} 
                    action 
                    active={selectedFormat === `${format['TypeFormat']} - ${format.Item}`}
                    onClick={() => setSelectedFormat(`${format['TypeFormat']} - ${format.Item}`)}
                  >
                    {format['TypeFormat']} - {format.Item}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        )}
      </Col>

        {/* Zone de prévisualisation */}
        <Col md={8} className="text-center">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title> Prévisualisation</Card.Title>
              
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
                  <p className="mt-2">Sélectionnez un modèle et un format</p>
                </div>
              )}

              {/* Badges affichant la sélection */}
              <div className="mt-3">
                {selectedEquipement && <Badge bg="info" className="me-2">{selectedEquipement}</Badge>}
                {selectedFormat && <Badge bg="secondary">{selectedFormat}</Badge>}
              </div>
            </Card.Body>
          </Card>

          {/* Bouton Ajouter au panier */}
          <div className="mt-4">
            <Button 
              variant="success" 
              disabled={!selectedEquipement || !selectedFormat}
            >
               Ajouter au panier
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;