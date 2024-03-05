import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Spinner, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import DataTable, { TableColumn } from 'react-data-table-component';
import domainApi from '../../services/config/domainApi';
import DeleteModal from '../../components/DeleteModal';
import { isBefore, isAfter } from 'date-fns';

type DataQuiz = {
  Judul: string;
  Deskripsi: number,
  ID: number,
  WaktuMulai: string,
  WaktuSelesai: string,
};

type DataAttempt = {
  IDQuiz: number,
  IDUser: number,
  Skor: number,
  ID: number,
  User: {Nama: string},
  Quiz: {Judul: string}
};



const DashboardContent: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState([]);
  const [attempt, setAttempt] = useState([]);
  const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);
  const [infoDeleteData, setInfoDeleteData] = useState({id:0, name:""});
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);
  const token = localStorage.getItem('token');

  const handleDeleteQuiz = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {

      const response = await fetch(`${domainApi}/quiz/${infoDeleteData.id}`, {
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

  const quizData: TableColumn<DataQuiz>[] = [
    {
      name: 'Judul',
      selector: (row) => row.Judul,
      sortable: true,
      conditionalCellStyles: [
        {
          when: row => {
            return isBefore(new Date(), new Date(row.WaktuMulai));
          },
          style: {
            backgroundColor: 'rgba(248, 148, 6, 0.9)',
            color: 'white',
            '&:hover': {
              cursor: 'pointer',
            },
          },
        },
        {
          when: row => {
            return isAfter(new Date(), new Date(row.WaktuMulai)) && isBefore(new Date(), new Date(row.WaktuSelesai));
          },
          style: {
            backgroundColor: 'rgba(63, 195, 128, 0.9)',
            color: 'white',
            '&:hover': {
              cursor: 'pointer',
            },
          },
        },
        {
          when: row => {
            return isAfter(new Date(), new Date(row.WaktuSelesai));
          },
          style: {
            backgroundColor: 'rgba(242, 38, 19, 0.9)',
            color: 'white',
            '&:hover': {
              cursor: 'not-allowed',
            },
          },
        },
      ]
    },
    {
      name: 'Deskripsi',
      selector: (row) => row.Deskripsi,
      sortable: true,
    },
    {
      name: 'Mulai',
      selector: row => new Date(row.WaktuMulai).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }),
      sortable: true,
    },
    {
      name: 'Selesai',
      selector: row => new Date(row.WaktuSelesai).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }),
      sortable: true,
    },
    {
      name: 'Aksi',
      cell: (row: DataQuiz) => (
        <>
          <Link to={`/quiz/addQuestion/${row.ID}`}><Button variant="success" className='mx-1' onClick={() => {}} ><FontAwesomeIcon icon={faPenToSquare} /></Button></Link>
          <Button variant="danger" className='m-1' onClick={() => {setIsDeleteModalShow(true); setInfoDeleteData({id: row.ID, name: row.Judul})}} ><FontAwesomeIcon icon={faTrash} /></Button>
        </>
      ),
    }
  ];
  

  const attemptData: TableColumn<DataAttempt>[] = [
    {
      name: 'Judul Quiz',
      selector: (row) => row.Quiz.Judul,
      sortable: true,
    },
    {
      name: 'Nama Peserta',
      selector: (row) => row.User.Nama,
      sortable: true,
    },
    {
      name: 'Skor',
      selector: (row) => row.Skor,
      sortable: true,
    },
    {
      name: 'Aksi',
      cell: (row: DataAttempt) => (
        <>
          <Link to={`/userAttempt/${row.ID}`}><Button variant="success" className='mx-1' onClick={() => {}} ><FontAwesomeIcon icon={faPenToSquare} /></Button></Link>
        </>
      ),
    }
  ];


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${domainApi}/quiz/`,{
            headers: {
              Authorization: `${token}`,
            },
          });

        if (response.ok) {
          const data = await response.json();
          setQuiz(data)
        } else {
          console.error('Error fetching Quiz data:', response.status);
        }

        const responseAttempt = await fetch(`${domainApi}/userattempts/`,{
          headers: {
            Authorization: `${token}`,
          },
        });

      if (responseAttempt.ok) {
        const data = await responseAttempt.json();
        console.log(data)
        setAttempt(data)
        setLoading(false);
      } else {
        console.error('Error fetching Attempt data:', responseAttempt.status);
      }
      } catch (error) {
        console.error('Error during fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isDeleteSuccess]);

  return (
    <>
      <Row className='px-3 py-3'>
        <Card className='col-12 bg-light my-2 px-4 py-2'><h1>Dashboard</h1></Card>
          {loading ?
            <div className="col-12 pb-5 mb-5 align-self-center text-center">
                <Spinner animation="border" variant="success" />
            </div> :
            <>
            <div className='quizData col-12'>
                <div className='m-1'>
                  <Card className='my-2'>
                  <Card.Header style={{ display: 'flex', justifyContent: 'space-between', borderTop: "2px #232931 solid" }}>
                      <div className='text-center justify-center align-self-center'>Daftar Quizz</div>
                    </Card.Header>
                    <Card.Body>
                    <div className="col text-end">
                        <Link to={"/quiz/add"}><Button variant="primary">Tambah Quiz</Button></Link>
                      </div>
                      <h1 className='fs-3'>Daftar Quiz</h1>
                      <DataTable
                        columns={quizData}
                        data={quiz}
                        fixedHeader
                        pagination
                        paginationRowsPerPageOptions={[5]}/>
                      <h1 className='fs-3 my-3'>Daftar Percobaan Pengguna</h1>
                      <DataTable
                        columns={attemptData}
                        data={attempt}
                        fixedHeader
                        pagination
                        paginationRowsPerPageOptions={[5]}/>
                    </Card.Body>
                  </Card>
                </div>
            </div>
          </>}
      </Row>
    <DeleteModal show={isDeleteModalShow} onHide={() => setIsDeleteModalShow(false)} onDelete={handleDeleteQuiz} infoData={infoDeleteData}/>
    </>
  )
};

export default DashboardContent;
