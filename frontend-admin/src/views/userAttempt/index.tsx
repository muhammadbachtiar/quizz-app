import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Spinner, Card, Button } from 'react-bootstrap';
import DataTable, { TableColumn } from 'react-data-table-component';
import domainApi from '../../services/config/domainApi';

type DataAnswer = {
  ID: number,
  Pertanyaan: {Pertanyaan: string},
  Jawaban: {Jawaban: string, Benar:boolean}
};

type DataAttempt = {
    IDQuiz: number,
    IDUser: number,
    Skor: number,
    ID: number,
    User: {Nama: string},
    Quiz: {Judul: string}
  };


const UserAttemptContent: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState([]);
  const [attempt, setAttempt] = useState<DataAttempt>({
    IDQuiz: 0,
    IDUser: 0,
    Skor: 0,
    ID: 0,
    User: { Nama: '' },
    Quiz: { Judul: '' }
  });
  const token = localStorage.getItem('token');
  const { id } = useParams();


  const answerData: TableColumn<DataAnswer>[] = [
    {
      name: 'Pertanyaan',
      selector: (row) => row.Pertanyaan.Pertanyaan,
      sortable: true,
    },
    {
      name: 'Jawaban',
      selector: (row) => row.Jawaban.Jawaban,
      sortable: true,
      conditionalCellStyles: [
        {
          when: row => {
            return row.Jawaban && row.Jawaban.Benar === true;
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
            return row.Jawaban && row.Jawaban.Benar === false;
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
  ];
  

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${domainApi}/userattempts/${id}`,{
            headers: {
              Authorization: `${token}`,
            },
          });

        if (response.ok) {
          const data = await response.json();
          setAttempt(data)
        } else {
          console.error('Error fetching Attemp data:', response.status);
        }

        const responseAttempt = await fetch(`${domainApi}/userAnswer/${id}`,{
          headers: {
            Authorization: `${token}`,
          },
        });

      if (responseAttempt.ok) {
        const data = await responseAttempt.json();
        setAnswer(data)
        setLoading(false);
      } else {
        console.error('Error fetching Answer data:', responseAttempt.status);
      }
      } catch (error) {
        console.error('Error during fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
      <Row className='px-3 py-3'>
          {loading ?
            <div className="col-12 pb-5 mb-5 align-self-center text-center">
                <Spinner animation="border" variant="success" />
            </div> :
            <>
            <div className='answerData col-12'>
                <div className='m-1'>
                  <Card className='my-2'>
                  <Card.Header style={{ display: 'flex', justifyContent: 'space-between', borderTop: "2px #232931 solid" }}>
                      <div className='text-center justify-center align-self-center'>Jawaban Peserta</div>
                    </Card.Header>
                    <Card.Body>
                    <h1 className='fs-4 my-3'>Nama Peserta : {attempt.Quiz.Judul}</h1>
                    <h1 className='fs-4 my-3'>Judul Quiz: {attempt.User.Nama}</h1>
                    <h1 className='fs-4 my-3'>Skor: {attempt.Skor}</h1>
                      <DataTable
                        columns={answerData}
                        data={answer}
                        fixedHeader
                        pagination
                        paginationRowsPerPageOptions={[5]}/>
                    </Card.Body>
                  </Card>
                </div>
            </div>
          </>}
      </Row>
      <Link to={`/`}><Button type="submit" className='btn-secondary my-2'>Kembali</Button></Link>
    </>
  )
};

export default UserAttemptContent;
