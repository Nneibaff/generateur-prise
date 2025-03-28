import React, {useEffect, useState } from 'react';
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
  const [typesFinitions, setTypesFinitions] = useState([]);
  const [selectedTypeFinition, setSelectedTypeFinition] = useState('');
  const [couleursFinitions, setCouleursFinitions] = useState([]);
  const [selectedCouleurFinition, setSelectedCouleurFinition] = useState('');
  const [couleursCuirs, setCouleursCuirs] = useState([]);
  const [selectedCouleurCuir, setSelectedCouleurCuir] = useState('');
  const [equipements, setEquipements] = useState([]);
  const [selectedEquipement, setSelectedEquipement] = useState('');
 

  const [previewImage, setPreviewImage] = useState('');


  const [error, setError] = useState('');

  const [showModeles, setShowModeles] = useState(false);
  const [showFormats, setShowFormats] = useState(false);
  const [showFinitions, setShowFinitions] = useState(false);
  const [showTypesFinitions, setShowTypesFinitions] = useState(false);
  const [showCouleursCuirs, setShowCouleursCuirs] = useState(false);
  const [showCouleurs, setShowCouleurs] = useState(false);
  const [showEquipements, setShowEquipements] = useState(false);
 
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

  useEffect(() => {    
    if (selectedFinition) { 
      axios.get("http://localhost:5000/api/finitions")  
        .then(response => {
          const filteredTypeFinition = response.data.filter(f => f.NomFinition === selectedFinition);
          const uniqueTypeFinition = [];
          filteredTypeFinition.forEach(typeFinition => {
            if (!uniqueTypeFinition.some(m => m['TypeFinition'] === typeFinition['TypeFinition'])) {
              uniqueTypeFinition.push(typeFinition);
            }
          });
          setTypesFinitions(uniqueTypeFinition);
          console.log(uniqueTypeFinition);
        })
        .catch(() => setError("Erreur lors de la récupération des types de finitions."));
    }
  }, [selectedFinition]);


  useEffect(() => {
    if (selectedModele) {
      axios.get("http://localhost:5000/api/finitions")
        .then(response => {
          const filteredFinitions = response.data.filter(f => f.NomModele === selectedModele);
          // si il y a plusieurs fois le même nom de finition, on ne garde que la première occurence
          const uniqueFinitions = [];
          filteredFinitions.forEach(finition => {
            if (!uniqueFinitions.some(m => m['NomFinition'] === finition['NomFinition'])) {
              uniqueFinitions.push(finition);
            }
          });
          setFinitions(uniqueFinitions);
        })
        .catch(() => setError("Erreur lors de la récupération des finitions."));
    }
  }, [selectedModele]);

  // Filtrer les couleurs en fonction de la finition sélectionnée et du modele sélectionné
  // si la finition = "cuir Vague" ou "cuir Dunes" alors on affiche les motifs cuirs
  useEffect(() => {
    if (selectedFinition !== "Cuir" && selectedModele !== "Cuir") {
      axios.get("http://localhost:5000/api/finitions")
        .then(response => {
          const filteredCouleurs = response.data.filter(c => c.NomFinition === selectedFinition);
          // si il y a plusieurs fois le même nom de couleur, on ne garde que la première occurence
          const uniqueCouleurs = [];
          filteredCouleurs.forEach(couleur => {
            if (!uniqueCouleurs.some(m => m['CouleurFinition'] === couleur['CouleurFinition'])) {
              uniqueCouleurs.push(couleur);
            }
          });
          setCouleursFinitions(uniqueCouleurs);
        })
        .catch(() => setError("Erreur lors de la récupération des couleurs."));
    } else if (
      selectedModele === "Cuir" &&
      (selectedFinition === "Cuir Vagues" || selectedFinition === "Cuir Dunes")
    ) {
      axios.get("http://localhost:5000/api/motifs")
        .then(response => {
          const filteredMotifs = response.data.filter(motif => motif.Motif === selectedFinition.split(" ")[1]);
          setCouleursCuirs(filteredMotifs);
        })
        .catch(() => setError("Erreur lors de la récupération des motifs cuirs."));
    }
  }, [selectedFinition, selectedModele]);

// faire un print des formats
  useEffect(() => {
    axios.get("http://localhost:5000/api/formats")
      .then(response => {
        setFormats(response.data);
      })
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
                  setShowCouleurs(false);
                  setShowCouleursCuirs(false);
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
                  setSelectedTypeFinition(false);
                  setShowCouleurs(false);
                  setShowCouleursCuirs(false);
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
                  setSelectedTypeFinition(false);
                  setShowCouleurs(false);
                  setShowCouleursCuirs(false);
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
                  setShowTypesFinitions(!showTypesFinitions);
                  setShowCouleurs(false);
                  setShowCouleursCuirs(false);
                  setShowEquipements(false);
                }}
              >
                {showTypesFinitions ? "Masquer les types de finitions" : "Voir les types de finitions"}
              </Button>
              <Button
                variant="outline-primary"
                className="w-100 mb-2"
                onClick={() => {
                  setShowModeles(false);
                  setShowFormats(false);
                  setShowFinitions(false);
                  setSelectedTypeFinition(false);
                  setShowCouleurs(!showCouleurs);
                  setShowCouleursCuirs(false);
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
                  setSelectedTypeFinition(false);
                  setShowCouleurs(false);
                  setShowCouleursCuirs(false);
                  setShowEquipements(!showEquipements);
                }}
              >
                {showEquipements ? "Masquer les équipements" : "Voir les équipements"}
              </Button>
            </Card.Body>
          </Card>

          {/* Affichage conditionnel des listes */}
          {(showModeles || showFormats || showFinitions || showTypesFinitions || showCouleurs || showEquipements) && (
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="text-center">
                  {showModeles
                    ? "Modèles disponibles"
                    : showFormats
                    ? "Formats disponibles"
                     : showTypesFinitions
                    ? "Types definitions disponibles"
                    : showCouleursCuirs
                    ? "Motifs Cuir disponibles"
                    : showCouleurs
                    ? "Couleurs disponibles"
                    : showEquipements
                    ? "Equipements disponibles"
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
                    <div className="d-flex flex-wrap">
                      {formats.map((format, index) => (
                        <ListGroup.Item
                          key={index}
                          action
                          active={selectedFormat === format['Item']} 
                          onClick={() => setSelectedFormat(format['Item'])} 
                        >
                          <img
                            src={`http://localhost:5000${format.image}`}
                            alt={`Format ${index}`}
                          />
                        </ListGroup.Item>
                      ))}
                    </div>
                  }
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
                    {showTypesFinitions &&
                    typesFinitions.map((type, index) => (
                      <ListGroup.Item
                        key={index}
                        action
                        active={selectedTypeFinition === type['TypeFinition']}
                        onClick={() => setSelectedTypeFinition(type['TypeFinition'])}
                      >
                        {type['TypeFinition']}
                      </ListGroup.Item>
                    ))}
                  {showCouleurs &&
                    (selectedModele === "Cuir" && (selectedFinition === "Cuir Vagues" || selectedFinition === "Cuir Dunes")
                      ? couleursCuirs.map((couleur, index) => (
                          <ListGroup.Item
                            key={index}
                            action
                            active={selectedCouleurCuir === couleur['Couleur']}
                            onClick={() => {
                              setSelectedCouleurCuir(couleur['Couleur']);
                            }}
                          >
                            {couleur['Couleur']}
                          </ListGroup.Item>
                        ))
                      : couleursFinitions.map((couleur, index) => (
                          <ListGroup.Item
                            key={index}
                            action
                            active={selectedCouleurFinition === couleur['CouleurFinition']}
                            onClick={() => {
                              setSelectedCouleurFinition(couleur['CouleurFinition']);
                            }}
                          >
                            {couleur['CouleurFinition']}
                          </ListGroup.Item>
                        )))}
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
              ) : selectedFormat ? (
                <img
                  src={`http://localhost:5000${formats.find(f => f.Item === selectedFormat)?.image}`}
                  alt="Format Sélectionné"
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
                {selectedTypeFinition && <Badge bg="primary" className="me-2">{selectedTypeFinition}</Badge>}
                {selectedCouleurFinition && <Badge bg="warning" className="me-2">{selectedCouleurFinition}</Badge>}
                {selectedCouleurCuir && <Badge bg="danger" className="me-2">{selectedCouleurCuir}</Badge>}
                {selectedEquipement && <Badge bg="info" className="me-2">{selectedEquipement}</Badge>}
              </div>
            </Card.Body>
            <Card.Footer className="text-center">
              <Button
                variant="success"
                disabled={!selectedModele || !selectedFormat || !selectedFinition || !selectedTypeFinition || !selectedCouleurFinition ||!selectedCouleurCuir ||!selectedEquipement}
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
                  setSelectedTypeFinition('');
                  setSelectedCouleurFinition('');
                  setSelectedCouleurCuir('');
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