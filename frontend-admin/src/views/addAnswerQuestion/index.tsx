import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm , FieldValues } from "react-hook-form";
import DataTable, { TableColumn } from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import {Card, Breadcrumb, Button, Col, Form, Row, Spinner} from 'react-bootstrap';
import domainApi from '../../services/config/domainApi';
import DeleteModal from '../../components/DeleteModal';

type formValueType = {
  Jawaban: string,
  PertanyaanID: number,
  Benar: boolean
};

type DataJawaban = {
    ID: number
    Jawaban: string,
    Benar: boolean,
  };

function AddQuestionQuiz() {
    const navigate = useNavigate();
    const { register, reset, handleSubmit } = useForm<formValueType>({
      defaultValues:  {
        Jawaban: '',
        PertanyaanID: 0,
        Benar: false,
        
      },
    });

    const [loading, setLoading] = useState(false);
    const { idQuiz } = useParams();
    const { id } = useParams();
    const [jawaban, setJawaban] = useState([]);
    const [pertanyaan, setPertanyaan] = useState('');
    const [isAddSuccess, setIsAddSuccess] = useState(false);
    const token = localStorage.getItem('token');
    const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);
    const [infoDeleteData, setInfoDeleteData] = useState({id:0, name:""});
    const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);
    

    const handleAdd = async (data: FieldValues) => {
      data.PertanyaanID = id;
      data.PertanyaanID = parseInt(data.PertanyaanID, 10); 
        try {
            setLoading(true)
        
            if (!token) {
                navigate('/login');
              return;
            }

          const response = await fetch(`${domainApi}/answerOption/`, {
            method: 'POST',
            headers: {
              Authorization: `${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify( data ),
          });
    
          if (response.ok) {
            setLoading(false)
            setIsAddSuccess(true)
          } else {
            setLoading(false)
            setIsAddSuccess(false)
          }
          reset();
        } catch (error) {
          setLoading(false)
          console.error('Error during login:', error);
        }
      };

      const handleDeletePertanyaan = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
    
          const response = await fetch(`${domainApi}/answerOption/${infoDeleteData.id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `${token}`,
              'Content-Type': 'application/json',
            },
          });
    
          if (response.ok) {
            setIsDeleteModalShow(false)
            setIsDeleteSuccess(true);
          } else {
            setIsDeleteModalShow(false)
            setIsDeleteSuccess(false);
          }
        } catch (error) {
          console.error('Error during Delete:', error);
        }
      };

      const JawabanData: TableColumn<DataJawaban>[] = [
        {
          name: 'Jawaban',
          selector: (row) => row.Jawaban,
          sortable: true,
        },
        {
          name: '',
          selector: (row) => row.Benar,
          sortable: true,
        },
        {
          name: 'Status Jawaban',
          cell: row =>(
              row.Benar ? 
                <FontAwesomeIcon className='text-success' icon={faCheck} /> :
                <FontAwesomeIcon className='text-danger' icon={faXmark} />
            ),
          sortable: true,
      },
        {
          name: 'Aksi',
          cell: (row: DataJawaban) => (
            <>
              <Button variant="danger" className='m-1' onClick={() => {setIsDeleteModalShow(true); setInfoDeleteData({id: row.ID, name: row.Jawaban})}} ><FontAwesomeIcon icon={faTrash} /></Button>
            </>
          ),
        }
      ];

      useEffect(() => {
        const fetchDashboardData = async () => {
            try {
              setLoading(true);
              const response = await fetch(`${domainApi}/answerOption/pertanyaan/${id}`,{
                  headers: {
                    Authorization: `${token}`,
                  },
                });
      
              if (response.ok) {
                const data = await response.json();
                setJawaban(data)
              } else {
                console.error('Error fetching Quiz data:', response.status);
              }

              const responseQuestion = await fetch(`${domainApi}/pertanyaan/${id}`,{
                  headers: {
                    Authorization: `${token}`,
                  },
                });
      
              if (responseQuestion.ok) {
                const data = await responseQuestion.json();
                setPertanyaan(data.Pertanyaan)
                setLoading(false);
              } else {
                console.error('Error fetching Quiz data:', responseQuestion.status);
              }

            } catch (error) {
              console.error('Error during fetch:', error);
            } finally {
              setLoading(false);
            }
          };
      
          fetchDashboardData();
          setIsAddSuccess(false)
          setIsDeleteSuccess(false)
      }, [reset, isAddSuccess, isDeleteSuccess]);

  return (
    <>
    <Card
        bg={"light"}
        key={"secondary"}
        text={'dark'}
        style={{ width: '100%', minHeight: "80vh" }}
        className="my-4"
    >
        <Card.Header style={{ borderTop: "2px #34495E solid" }}>Tambah Pertanyaan</Card.Header>
        <Card.Body className='px-4'>
        {loading ?
              <div className="col-12 pb-5 mb-5 align-self-center text-center">
                  <Spinner animation="border" variant="success" />
              </div> : 
              <>
              <Breadcrumb>
                  <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Dashboard</Breadcrumb.Item>
                  <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/quiz/addQuestion/${idQuiz}` }}>Tambah Pertanyaan</Breadcrumb.Item>
                  <Breadcrumb.Item active>Tambah Opsi Jawaban</Breadcrumb.Item>
              </Breadcrumb>
              <Card.Title> Tambah Opsi Jawaban </Card.Title>
              <div className="row my-3 align-items-center">
                  <h1 className='fs-3'>Pertanyaan: {pertanyaan}</h1>
                  <div className="col">
                      <Form onSubmit={handleSubmit((data) => handleAdd(data))}>
                                  <Row className='my-3'>
                                      <Form.Group as={Col} md="6">
                                                  <Form.Label>Opsi Jawaban</Form.Label>
                                                  <Form.Control
                                                  required
                                                  type="text"
                                                  {...register(`Jawaban`)}
                                                  placeholder={`Jawaban`}
                                                  />
                                      </Form.Group>
                                      <Form.Group as={Col} md="6">
                                      <Form.Label>Status Jawaban</Form.Label>
                                        <Form.Check
                                              label="Benar"
                                              type="checkbox"
                                              {...register(`Benar`)}
                                            />
                                      </Form.Group>
                                  </Row>
                          <Button type="submit" className='my-3'>Tambahkan</Button>
                      </Form>     
                  </div>
              </div>
              <DataTable
                        columns={JawabanData}
                        data={jawaban}
                        fixedHeader
                        pagination
                        paginationRowsPerPageOptions={[5]}/>
              <Link to={`/quiz/addQuestion/${idQuiz}`}><Button type="submit" className='btn-secondary my-2'>Kembali</Button></Link>
              </>}
        </Card.Body>
    </Card>
    <DeleteModal show={isDeleteModalShow} onHide={() => setIsDeleteModalShow(false)} onDelete={handleDeletePertanyaan} infoData={infoDeleteData}/>
    </>
  );
}

export default AddQuestionQuiz;