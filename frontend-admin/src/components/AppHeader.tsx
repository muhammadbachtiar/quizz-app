import {Navbar, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faUser, faBars, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from 'react';
import SideBarApp from './AppSidebar';
import LogOutModal from './LogOutModal';
import  useAuth  from '../services/utils/useContext';


const Topbar: React.FC = () => {
  const [showSideBar, setShowSideBar] = useState(false);
  const [logOutModalShow, setLogOutModalShow] = useState(false);
  const { userName } = useAuth();


  return (
    <>
      <Navbar expand="lg" className="topbar px-3 py-2 static-top" style={{ backgroundColor: '#8DC6FF' }}>
        <div className="row header-row align-items-center">
          <div className="col col-md-9">
            <button className="btn btn-primary" type="button" onClick={() => setShowSideBar(true)}>
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
          <div className="col">
            <div className="row justify-content-end">
              <div className="col text-end">
                <NavDropdown title={<span><span className="pe-2 d-none d-lg-inline text-gray-600 small">{userName}</span><FontAwesomeIcon icon={faUser} /></span>} className='text-end header-dropdown' id="userDropdown">
                  <NavDropdown.Item onClick={() => setLogOutModalShow(true)} >
                    <FontAwesomeIcon icon={faArrowRightFromBracket} className='px-2' />
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            </div>
          </div>
        </div>
      </Navbar>
      <SideBarApp show={showSideBar} handleClose={() => setShowSideBar(false)}/>
      <LogOutModal 
        show={logOutModalShow}
        onHide={() => setLogOutModalShow(false)}
      />
    </>
  );
}

export default Topbar;
