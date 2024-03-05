import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AppFooter, AppHeader } from '../components/index';
import DashboardContent from '../views/dashboard/dashboardContent';
import QuizContent from  "../views/addQuiz/index.tsx";
import AddQuestionQuiz from  "../views/addQuestionQuiz/index.tsx";
import AddAnsweroFQuestion from  "../views/addAnswerQuestion/index.tsx";
import UserAttemptContent from '../views/userAttempt/index.tsx';



const DefaultLayout: React.FC = () => {
  const { pathname } = useLocation();
  let contentComponent: React.ReactNode;

  
  switch (true) {
    case pathname ===  "/dashboard":
    contentComponent = <DashboardContent />;
    break;
    case pathname === "/quiz/add":
      contentComponent = <QuizContent />;
      break;
    case /^\/quiz\/addQuestion\/\d+\/addAnswer\/\d+$/.test(pathname):
      contentComponent = <AddAnsweroFQuestion />;
      break;
    case pathname.includes("/quiz/addQuestion/"):
      contentComponent = <AddQuestionQuiz />;
      break;
    case pathname.includes("/userAttempt/"):
      contentComponent = <UserAttemptContent />;
      break;
  }

  useEffect(() => {
  }, []);
  return (
    <div id="wrapper">
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <AppHeader />
          <div className="container-fluid" style={{ minHeight: "84vh", backgroundColor: "#E4F1FE" }}>
            {contentComponent}
          </div>
          <AppFooter />
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;