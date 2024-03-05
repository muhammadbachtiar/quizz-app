import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm , FieldValues } from "react-hook-form";
import DataTable, { TableColumn } from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import {Card, Breadcrumb, Button, Col, Form, Row, Spinner} from 'react-bootstrap';
import domainApi from '../../services/config/domainApi';
import DeleteModal from '../../components/DeleteModal';

type formValueType = {
  Pertanyaan: string,
  IDQuiz: number,
};

type DataPertanyaan = {
    ID: number
    Pertanyaan: string,
    IDQuiz: number,
  };

function AddQuestionQuiz() {
    const navigate = useNavigate();
    const { register, reset, handleSubmit } = useForm<formValueType>({
      defaultValues:  {
        Pertanyaan: '',
        IDQuiz: 0,
        
      },
    });

    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const [pertanyaan, setPertanyaan] = useState([]);
    const [isAddSuccess, setIsAddSuccess] = useState(false);
    const token = localStorage.getItem('token');
    const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);
    const [infoDeleteData, setInfoDeleteData] = useState({id:0, name:""});
    const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);
    

    const handleAdd = async (data: FieldValues) => {
      data.IDQuiz = id;
      data.IDQuiz = parseInt(data.IDQuiz, 10); 
      
      console.log(JSON.stringify( data ))
        try {
            setLoading(true)
        
            if (!token) {
                navigate('/login');
              return;
            }

          const response = await fetch(`${domainApi}/pertanyaan/`, {
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
        } catch (error) {
          setLoading(false)
          console.error('Error during login:', error);
        }
      };

      const handleDeletePertanyaan = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
    
          const response = await fetch(`${domainApi}/pertanyaan/${infoDeleteData.id}`, {
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

      const PertanyaanData: TableColumn<DataPertanyaan>[] = [
        {
          name: 'Pertanyaan',
          selector: (row) => row.Pertanyaan,
          sortable: true,
        },
        {
          name: 'Aksi',
          cell: (row: DataPertanyaan) => (
            <>
              <Link to={`/quiz/addQuestion/${id}/addAnswer/${row.ID}`}><Button variant="success" className='mx-1' onClick={() => {}} ><FontAwesomeIcon icon={faPenToSquare} /></Button></Link>
              <Button variant="danger" className='m-1' onClick={() => {setIsDeleteModalShow(true); setInfoDeleteData({id: row.ID, name: row.Pertanyaan})}} ><FontAwesomeIcon icon={faTrash} /></Button>
            </>
          ),
        }
      ];

      useEffect(() => {
        const fetchDashboardData = async () => {
            try {
              setLoading(true);
              const response = await fetch(`${domainApi}/pertanyaan/quiz/${id}`,{
                  headers: {
                    Authorization: `${token}`,
                  },
                });
      
              if (response.ok) {
                const data = await response.json();
                setPertanyaan(data)
                setLoading(false);
              } else {
                console.error('Error fetching Quiz data:', response.status);
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
                  <Breadcrumb.Item active>Tambah Pertanyaan</Breadcrumb.Item>
              </Breadcrumb>
              <Card.Title> Tambah Pertanyaan </Card.Title>
              <div className="row my-3 align-items-center">
                  <div className="col">
                      <Form onSubmit={handleSubmit((data) => handleAdd(data))}>
                                  <Row className='my-3'>
                                      <Form.Group as={Col} md="6">
                                                  <Form.Label>Pertanyaan</Form.Label>
                                                  <Form.Control
                                                  required
                                                  type="text"
                                                  {...register(`Pertanyaan`)}
                                                  placeholder={`Pertanyaan`}
                                                  />
                                      </Form.Group>
                                  </Row>
                          <Button type="submit" className='my-3'>Tambahkan</Button>
                      </Form>     
                  </div>
              </div>
              <DataTable
                        columns={PertanyaanData}
                        data={pertanyaan}
                        fixedHeader
                        pagination
                        paginationRowsPerPageOptions={[5]}/>
              <Link to={"/"}><Button type="submit" className='btn-secondary my-2'>Kembali</Button></Link>
              </>}
        </Card.Body>
    </Card>
    <DeleteModal show={isDeleteModalShow} onHide={() => setIsDeleteModalShow(false)} onDelete={handleDeletePertanyaan} infoData={infoDeleteData}/>
    </>
  );
}

export default AddQuestionQuiz;