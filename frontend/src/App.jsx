import React, { use, useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Button, ListGroup, Badge, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; 

function App() {
  
  const [modeles, setModeles] = useState([]);
  const [selectedModele, setSelectedModele] = useState('');
  const [formats, setFormats] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [finitions, setFinitions] = useState([]);
  const [selectedFinition, setSelectedFinition] = useState('');
  const [couleursFinitions, setCouleursFinitions] = useState('');
  const [selectedCouleurFinition, setSelectedCouleurFinition] = useState('');
  const [motifsCuirs, setMotifsCuirs] = useState([]);
  const [selectedMotifCuir, setSelectedMotifCuir] = useState('');
  const [equipements, setEquipements] = useState([]);
  const [selectedEquipement, setSelectedEquipement] = useState('');
 

  const [previewImage, setPreviewImage] = useState('');


  const [error, setError] = useState('');


  const [showEquipements, setShowEquipements] = useState(false);
  const [showFormats, setShowFormats] = useState(false);
  const [showFinitions, setShowFinitions] = useState(false);
  const [showMotifsCuirs, setShowMotifsCuirs] = useState(false);
  const [showModeles, setShowModeles] = useState(false);
  const [showCouleurs, setShowCouleurs] = useState(false);
 

  //  charger les modeles une seule fois et si un modele est selectionné, la liste des finitions est mise à jour
  useEffect(() => {
    axios.get("http://localhost:5000/api/modeles")
    .then(response => {
      const uniqueModeles = [];
      response.data.forEach(modele => {
        if (!uniqueModeles.some(m => m['NomModele'] === modele['NomModele'])) {
          uniqueModeles.push(modele);
        }
      });
      setModeles(uniqueModeles);
    })
    .catch(() => setError("Erreur lors de la récupération des modeles."));
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

 // Filtrer les finitions en fonction du modèle sélectionné
  useEffect(() => {
    if (selectedModele) {
      axios.get("http://localhost:5000/api/finitions")
        .then(response => {
          const filteredFinitions = response.data.filter(f => f.modele === selectedModele);
          // si il y a plusieurs fois le même nom de finition, on ne garde que la première occurence
          const uniqueFinitions = [];
          filteredFinitions.forEach(finition => {
            if (!uniqueFinitions.some(m => m['NomFinition'] === finition['NomFinition'])) {
              uniqueFinitions.push(finition);
            }
          });
          // stocker les couleurs de la finition et du modele sélectionné
          const couleur = filteredFinitions
            .filter(finition => finition.modele === selectedModele)
            .map(finition => finition.couleur);
          setFinitions(uniqueFinitions);
          setCouleursFinitions(couleur);
        })
        .catch(() => setError("Erreur lors de la récupération des finitions."));
    }
  }, [selectedModele]);

   


  useEffect(() => {
    axios.get("http://localhost:5000/api/formats")
      .then(response => setFormats(response.data))
      .catch(() => setError("Erreur lors de la récupération des formats."));
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
                  setShowModeles(!showModeles);
                  setShowFormats(false);
                  setShowFinitions(false);
                  setShowMotifsCuirs(false);
                  setShowEquipements(false);
                }}
              >
                {showModeles ? "Masquer les modèles" : "Voir les modèles"}
              </Button>
              <Button
                variant="outline-primary"
                className="w-100 mb-2"
                onClick={() => {
                  setShowModeles(false);
                  setShowFormats(!showFormats);                  
                  setShowFinitions(false);
                  setShowMotifsCuirs(false);
                  setShowEquipements(false);
                }}
              >
                {showFormats ? "Masquer les formats" : "Voir les formats"}
              </Button>
              <Button
                variant="outline-primary"
                className="w-100 mb-2"
                onClick={() => {
                  setShowModeles(false);
                  setShowFormats(false);
                  setShowFinitions(!showFinitions);
                  setShowEquipements(false);
                }}
              >
                {showFinitions ? "Masquer les finitions" : "Voir les finitions"}
              </Button>
              <Button
                variant="outline-primary"
                className="w-100 mb-2"
                onClick={() => {
                  setShowModeles(false);
                  setShowFormats(false);
                  setShowFinitions(false);
                  setShowCouleurs(!showCouleurs);
                  setShowMotifsCuirs(false);
                  setShowEquipements(false);
                }}
              >
                {showCouleurs ? "Masquer les couleurs" : "Voir les couleurs"}
              </Button>
              <Button
                variant="outline-primary"
                className="w-100 mb-2"
                onClick={() => {
                  setShowModeles(false);
                  setShowFormats(false);
                  setShowFinitions(false);
                  setShowMotifsCuirs(false);
                  setShowEquipements(!showEquipements);
                }}
              >
                {showEquipements ? "Masquer les équipements" : "Voir les équipements"}
              </Button>
            </Card.Body>
          </Card>

          {/* Affichage conditionnel des listes */}
          {(showModeles || showFormats || showFinitions || showCouleurs || showEquipements) && (
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="text-center">
                  {showModeles
                    ? "Modèles disponibles"
                    : showEquipements
                    ? "Equipements disponibles"
                    : showFormats
                    ? "Formats disponibles"
                    : showMotifsCuirs
                    ? "Motifs Cuir disponibles"
                    : showCouleurs
                    ? "Couleurs disponibles"
                    : "Finitions disponibles"}
                </Card.Title> 
                <ListGroup style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {showModeles &&
                    modeles.map((modele, index) => (
                      <ListGroup.Item
                        key={index}
                        action
                        active={selectedModele === modele['NomModele']}
                        onClick={() => setSelectedModele(modele['NomModele'])}
                      >
                        {modele['NomModele']}
                      </ListGroup.Item>
                    ))}
                  {showFormats &&
                    formats.map((format, index) => (
                      <ListGroup.Item
                        key={index}
                        action
                        active={selectedFormat === format['Item']} 
                        onClick={() => setSelectedFormat(format['Item'])} 
                      >
                        {/* {index === 0 ? svg: null}  */}
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
                  {showCouleurs &&
                    couleursFinitions.map((couleur, index) => (
                      <ListGroup.Item
                        key={index}
                        action
                        active={selectedCouleurFinition === couleur['CouleurFinition']}
                        onClick={() => setSelectedCouleurFinition(couleur['CouleurFinition'])}
                      >
                        {couleur['CouleurFinition']}
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
                  <p className="mt-2">Sélectionnez un modele, un format, une finition, des couleurs, des équipements</p>
                </div>
              )}

              {/* Badges affichant la sélection */}
              <div className="mt-3">
                {selectedModele && <Badge bg="primary" className="me-2">{selectedModele}</Badge>}
                {selectedFormat && <Badge bg="secondary" className="me-2">{selectedFormat}</Badge>}
                {selectedFinition && <Badge bg="success" className="me-2">{selectedFinition}</Badge>}
                {selectedCouleurFinition && <Badge bg="warning" className="me-2">{selectedCouleurFinition}</Badge>}
                {selectedEquipement && <Badge bg="info" className="me-2">{selectedEquipement}</Badge>}
              </div>
            </Card.Body>
            <Card.Footer className="text-center">
              <Button
                variant="success"
                disabled={!selectedModele || !selectedFormat || !selectedFinition ||!selectedMotifCuir ||!selectedEquipement}
              >
                Ajouter au panier
              </Button>
              <Button 
                variant="secondary"
                className="ms-2"
                onClick={() => {
                  setSelectedModele('');
                  setSelectedFormat('');
                  setSelectedFinition('');
                  setSelectedMotifCuir('');
                  setSelectedEquipement('');
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