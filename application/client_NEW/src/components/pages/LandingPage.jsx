import { useEffect } from "react";
import { Button, Form, InputGroup, Container, Row, Col } from "react-bootstrap";
import searchIcon from "../../assets/searchIcon";
import "bootstrap/dist/css/bootstrap.min.css";
import UsersGroup from "../../assets/usersGroup";
import Personal from "../../assets/personal";
import Resources from "../../assets/resources";

function LandingPage() {
  return (
    <div className="LandingPage">
      <Container>
        <Row>
          <Col className="col-12 col-md-12 col-lg-10 titleContainer">
            <div className="title">
              The #1 collaborative platform for
              <span> students</span>
              {"!"}
            </div>
          </Col>
          <Col className="col-12 col-md-12 col-lg-10 mt-5 mb-5 signUpContainer">
            <InputGroup className="mb-3">
              <InputGroup.Prepend className="leftAddon">
                <InputGroup.Text id="basic-addon1">
                  <img src={searchIcon} alt="searchIcon" />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control type="text" placeholder="Enter your University.." />
              <InputGroup.Append className="rightAddon">
                <Button variant="light">Sign up, free of charge!</Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>
        <Row className="CardContainer">
          <div className="Card">
            <div className="logoContainer">
              <UsersGroup />
            </div>
            <p className="title">Collaborate</p>
            <div className="descriptionContainer">
              <p>
                Meet verified students from around the globe and take your
                skills to the next plateau.
                <br />
                Grow as an individual whilst learning how to work within a team.
                <br />
                Become a ceritified Unifluencer and show off your contributions
                to employers!
              </p>
            </div>
          </div>
          <div className="Card">
            <div className="logoContainer">
              <Resources />
            </div>
            <p className="title">Resources</p>
            <div className="descriptionContainer">
              <p>
                Gain access to curated resources from some of the most talented
                students in the world
                <br />
                Create content of your own and create a network of followers
                willing to provide you with feedback and reviews
              </p>
            </div>
          </div>
          <div className="Card">
            <div className="logoContainer">
              <Personal />
            </div>
            <p className="title">Personal</p>
            <div className="descriptionContainer">
              <p>
                Create a profile which will allow you to track your progress,
                access curated content and much more
                <br />
                Grow as an individual whilst learning how to work within a team.
              </p>
            </div>
          </div>
        </Row>
      </Container>
    </div>
  );
}

export default LandingPage;
