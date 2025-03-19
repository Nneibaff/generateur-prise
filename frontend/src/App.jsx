import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Button, Form } from 'react-bootstrap';
import './App.css';  // Pour les styles personnalisés (si nécessaire)

function App() {
  const [config, setConfig] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [formats, setFormats] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/config") // Vérifie que c'est bien /api/config
      .then(response => {
        setConfig(response.data);
        setSelectedType(response.data.type[0]);  // Définir un type par défaut
        setSelectedColor(response.data.color[0]); // Définir une couleur par défaut
      })
      .catch(error => console.error("Erreur lors de la requête:", error));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/api/formats")
      .then(response => {
        setFormats(response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des formats:", error);
      });
  }, []);

  // Gérer les changements de sélection
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  // Mettre à jour l'image de prévisualisation (ajuster selon les besoins)
  useEffect(() => {
    if (selectedType && selectedColor) {
      setPreviewImage(`/images/${selectedType}_${selectedColor}.png`); // Ex: image "type_couleur.png"
    }
  }, [selectedType, selectedColor]);

  return (
    <Container fluid className="mt-5">
      <Container className="header-container">
        <h1 className="text-center mb-4">Configurateur de Prises</h1>
      </Container>

      <Row>
        {/* Colonne de gauche pour les options */}
        <Col md={4} className="config-sidebar">
          {config ? (
            <>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Types disponibles :</Card.Title>
                  <Form>
                    {config.type.map((type, index) => (
                      <Form.Check
                        type="radio"
                        id={`type-${index}`}
                        label={type}
                        name="type"
                        value={type}
                        checked={selectedType === type}
                        onChange={handleTypeChange}
                        key={index}
                      />
                    ))}
                  </Form>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body>
                  <Card.Title>Couleurs disponibles :</Card.Title>
                  <Form>
                    {config.color.map((color, index) => (
                      <Form.Check
                        type="radio"
                        id={`color-${index}`}
                        label={color}
                        name="color"
                        value={color}
                        checked={selectedColor === color}
                        onChange={handleColorChange}
                        key={index}
                      />
                    ))}
                  </Form>
                </Card.Body>
              </Card>

              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Formats disponibles :</Card.Title>
                  <Form.Select>
                    <option value="">Sélectionnez un format</option>
                    {formats.map((format, index) => (
                      <option 
                        key={index} 
                        value={`${format['types formats']} - ${format.Item}`}>
                        {format['types formats']} - {format.Item}
                      </option>
                    ))}
                  </Form.Select>
                </Card.Body>
              </Card>
            </>
          ) : (
            <div className="text-center mt-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Chargement...</span>
              </Spinner>
            </div>
          )}
        </Col>

        {/* Colonne de droite pour la prévisualisation */}
        <Col md={8} className="config-preview">
          {previewImage ? (
            <Card>
              <Card.Body className="text-center">
                <Card.Title>Prévisualisation</Card.Title>
                <img src={previewImage} alt="Prise Configurée" className="img-fluid" />
              </Card.Body>
            </Card>
          ) : (
            <div className="text-center mt-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Chargement...</span>
              </Spinner>
            </div>
          )}
        </Col>
      </Row>

      <div className="text-center mt-4">
        <Button variant="primary">Ajouter au panier</Button>
      </div>
    </Container>
  );
}

export default App;