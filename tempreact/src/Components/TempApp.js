import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import "./Css/style.css"

const TempApp = () => {
  return (
    <div className="center-container">
      <Card className="text-center" style={{ width: "50%" , backgroundColor: "rgb(242 211 206)" }}>
        <Card.Header>Weather Report</Card.Header>
        <Card.Body>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Enter a city"
              aria-label="city"
              aria-describedby="basic-addon1"
            />
          </InputGroup>
          <Card.Title>Special title treatment</Card.Title>
          <Card.Text>
            With supporting text below as a natural lead-in to additional content.
          </Card.Text>
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
        <Card.Footer className="text-muted">2 days ago</Card.Footer>
      </Card>
    </div>
  );
};

export default TempApp;
