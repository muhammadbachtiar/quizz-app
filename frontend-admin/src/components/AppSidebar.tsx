import React from 'react';
import {Offcanvas , ListGroup, Accordion} from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

interface OffcanvasContentProps {
  show: boolean;
  handleClose: () => void;
}

const SideBarApp: React.FC<OffcanvasContentProps> = ({ show, handleClose }) => {
  return (
      <Offcanvas show={show} onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Quizz App</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className='sidebar-list'>
          <ListGroup>
            <Accordion>
              <Accordion.Item eventKey="2">
                <Link to="/dashboard">
                  <ListGroup.Item action as="div" className='px-3'><span className="badge"><FontAwesomeIcon icon={faHome} /></span>Dashboard</ListGroup.Item>
                </Link>
              </Accordion.Item>
            </Accordion>
          </ListGroup>
          </Offcanvas.Body>
      </Offcanvas>
  );
}

export default SideBarApp;
