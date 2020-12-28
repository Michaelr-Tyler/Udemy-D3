import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChartWrapper from './ChartWrapper';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GenderDropDown from './GenderDropDown';



class App extends Component {
  state = {
    gender: "men"
  }

  genderSelected = (gender) => this.setState({gender})

  render() {
    return (
      <div className="App">
        <Navbar bg="light">
          <Navbar.Brand>BarChartly</Navbar.Brand>
        </Navbar>
        <Container>
          <Row>
            <Col xs={12}><GenderDropDown genderSelected={this.genderSelected} /></Col>
          </Row>
          <Row>
          <Col xs={12}><ChartWrapper gender={this.state.gender} /></Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
