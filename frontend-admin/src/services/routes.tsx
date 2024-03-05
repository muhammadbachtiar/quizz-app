import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../views/login/LoginPage";
import NotFound from "../views/NotFound/NotFound";
import DefaultLayout from "../layout/DefaultLayout";
import PublicRoutes from "./utils/PublicRoutes";
import PrivateRoutes from "./utils/PrivateRoutes";
const Routers: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<PublicRoutes />} >
          <Route path="/" element={<LoginPage />} />
        </Route>
        <Route element={<PrivateRoutes />} >
          <Route path="/dashboard" element={<DefaultLayout />} />
          <Route path="/quiz/add" element={<DefaultLayout />} />
          <Route path="/quiz/addQuestion/:id" element={<DefaultLayout />} />
          <Route path="/quiz/addQuestion/:idQuiz/addAnswer/:id" element={<DefaultLayout />} />
          <Route path="/userAttempt/:id" element={<DefaultLayout />} />
        </Route>
        <Route path="*" element={<NotFound/>} />
        <Route path="/not-found" element={<NotFound/>} />
      </Routes>
    </Router>
  );
};

export default Routers;
