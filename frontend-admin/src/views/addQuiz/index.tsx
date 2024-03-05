import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm , FieldValues } from "react-hook-form";
import {Card, Breadcrumb, Button, Col, Form, Row, Spinner} from 'react-bootstrap';
import domainApi from '../../services/config/domainApi';

type formValueType = {
  Judul: string,
  Deskripsi: string,
  WaktuMulai: string,
  WaktuSelesai: string,
};

function AddQuiz() {
    const navigate = useNavigate();
    const { register, reset, handleSubmit } = useForm<formValueType>({
      defaultValues:  {
        Judul: '',
        Deskripsi: '',
        WaktuMulai: '',
        WaktuSelesai: '',
        
      },
    });

    const [loading, setLoading] = useState(false);
    

    const handleAdd = async (data: FieldValues) => {

      data.WaktuSelesai = new Date(data.WaktuSelesai).toISOString();
      data.WaktuMulai = new Date(data.WaktuMulai).toISOString();
      console.log(JSON.stringify( data ))
        try {
            setLoading(true)
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
              return;
            }

          const response = await fetch(`${domainApi}/quiz/`, {
            method: 'POST',
            headers: {
              Authorization: `${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify( data ),
          });
    
          if (response.ok) {
            setLoading(false)
            navigate('/');
          } else {
            setLoading(false)
          }
        } catch (error) {
          setLoading(false)
          console.error('Error during login:', error);
        }
      };

      useEffect(() => {
      }, [reset]);

  return (
    <>
    <Card
        bg={"light"}
        key={"secondary"}
        text={'dark'}
        style={{ width: '100%', minHeight: "80vh" }}
        className="my-4"
    >
        <Card.Header style={{ borderTop: "2px #34495E solid" }}>Manajemen Lokasi</Card.Header>
        <Card.Body className='px-4'>
        {loading ?
              <div className="col-12 pb-5 mb-5 align-self-center text-center">
                  <Spinner animation="border" variant="success" />
              </div> : 
              <>
              <Breadcrumb>
                  <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Dashboard</Breadcrumb.Item>
                  <Breadcrumb.Item active>Tambah</Breadcrumb.Item>
              </Breadcrumb>
              <Card.Title> Tambah Quiz </Card.Title>
              <div className="row my-3 align-items-center">
                  <div className="col">
                      <Form onSubmit={handleSubmit((data) => handleAdd(data))}>
                                  <Row className='my-3'>
                                      <Form.Group as={Col} md="3">
                                                  <Form.Label>Judul</Form.Label>
                                                  <Form.Control
                                                  required
                                                  type="text"
                                                  {...register(`Judul`)}
                                                  placeholder={`Judul Quiz`}
                                                  />
                                      </Form.Group>
                                      <Form.Group as={Col} md="3">
                                                  <Form.Label>Deskripsi</Form.Label>
                                                  <Form.Control
                                                  required
                                                  type="text"
                                                  {...register(`Deskripsi`)}
                                                  placeholder={`Deskripsi Quiz`}
                                                  />
                                      </Form.Group>
                                      <Form.Group as={Col} md="3">
                                                  <Form.Label>Waktu Mulai</Form.Label>
                                                  <Form.Control
                                                  required
                                                  type="datetime-local"
                                                  {...register(`WaktuMulai`)}
                                                  />
                                      </Form.Group>
                                      <Form.Group as={Col} md="3">
                                                  <Form.Label>Waktu Selesai</Form.Label>
                                                  <Form.Control
                                                  required
                                                  type="datetime-local"
                                                  {...register(`WaktuSelesai`)}
                                                  />
                                      </Form.Group>
                                  </Row>
                          <Link to={"/"}><Button type="submit" className='btn-secondary mx-2'>Kembali</Button></Link>
                          <Button type="submit">Tambahkan</Button>
                      </Form>     
                  </div>
              </div>
              </>}
        </Card.Body>
    </Card>
    </>
  );
}

export default AddQuiz;