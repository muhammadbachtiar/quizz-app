import { Button, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate('/');
  };

  return (
    <Row className="justify-content-center" style={{ minHeight: "100vh", overflow: "hidden", backgroundColor: "#E4F1FE", backgroundSize: 'cover' }}>
      <div className='col-6 p-6 align-items-center text-center align-self-center bg-light rounded' style={{ overflow: "hidden" }}>
        <h1>Halaman tidak ditemukan</h1>
        <Button onClick={handleNavigateHome}>Kembali</Button>
      </div>
    </Row>
  );
}

export default NotFound;
