import React, { useState } from 'react';
import {Modal, Button, Spinner} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import domainApi from "../../services/config/domainApi";
import {CButton,CCard,CCardBody,CCardGroup,CCol,CContainer,CForm,CFormInput,CInputGroup,CInputGroupText,CRow} from '@coreui/react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";

const LoginPage: React.FC = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isWrongPasswordShow, setIsWrongPasswordShow] = useState(false);
  const [isWrongemailShow, setIsWrongemailShow] = useState(false);
  const isSubmitDisabled = !email || !password;
  const navigate = useNavigate();

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      setLoading(true)
      const response = await fetch(`${domainApi}/loginAdmin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      console.log(email)
      console.log(password)

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', data.ID);
        navigate('/dashboard');
      } else {
        const ErrorMessage = await response.json();
        if(ErrorMessage.error === 'INVALID_email'){
          setIsWrongemailShow(true)
        }
        if(ErrorMessage.error === 'INVALID_PASSWORD'){
          setIsWrongPasswordShow(true)
        }
      }
      setEmail('')
      setPassword('')
      setLoading(false)
    } catch (error) {
      console.error('Error during login:', error);
      setLoading(false)
    }
  };

  return (
    <div className=" min-vh-100 min-vw-100 d-flex flex-row align-items-center" style={{ backgroundColor: "#E4F1FE" }}>
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5} className="align-items-stretch d-flex flex-column">
            <CCardGroup>
              <CCard className="p-2">
                <CCardBody>
                {loading ?
              <div className="col-12 p-5 m-5 align-self-center text-center">
                  <Spinner animation="border" variant="success" />
              </div> : 
                  <CForm onSubmit={handleLogin}>
                  <CRow>
                    <CCol >
                      <h1 className='fs-3'>Silakan Masuk</h1>
                      <p className="text-body-secondary">Masukkan Kredensial Login Anda</p>
                    </CCol>
                  </CRow>
                  <CInputGroup className="my-3">
                    <CInputGroupText>
                      <FontAwesomeIcon icon={faUser} />
                    </CInputGroupText>
                    <CFormInput placeholder="Email" autoComplete="email" onBlur={(e) => setEmail(e.target.value)}  />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <FontAwesomeIcon icon={faLock} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="current-password"
                      onChange={(e) => setPassword(e.target.value)} 
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol xs={6}>
                      <CButton type="submit" color="primary" className="px-4" disabled={isSubmitDisabled}>
                        Masuk
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>}
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
      <Modal
        show={isWrongPasswordShow} onHide={() => setIsWrongPasswordShow(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <h4>Password Salah</h4>
          <p>
            Password yang anda masukan tidak cocok dengan data kami. Silakan masukan password yang benar
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setIsWrongPasswordShow(false)}>Mengerti</Button>
        </Modal.Footer>
    </Modal>
    <Modal
        show={isWrongemailShow} onHide={() => setIsWrongemailShow(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <h4>email Salah</h4>
          <p>
            Kami tidak dapat menemukan email yang anda masukan. Silakan masukan email yang benar
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setIsWrongemailShow(false)}>Mengerti</Button>
        </Modal.Footer>
    </Modal>
    </div>
  )
};

export default LoginPage;
