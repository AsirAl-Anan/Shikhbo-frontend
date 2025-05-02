import { Helmet } from 'react-helmet';
import { useContext, useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './index.css';
import AuthPage from './pages/Auth/Auth';
import HomePage from './pages/Home';
import HomeContent from './components/HomeContent';
import { AuthContext } from './context/UserContext';
import StudyMaterialsPage from './pages/QuestionBank';
import NewChatPage from './pages/NewChatPage';
// Admin imports
import AdminLogin from './pages/Admin/AdminLogin';
import AdminLayout from './pages/Admin/AdminLayout';
import Dashboard from './pages/Admin/AdminDashboard';
import AddQuestion from './pages/Admin/AddQuestion';
import AddSubject from './pages/Admin/AddSubject';
import AcademicSection from './components/QBank/Subjects';
//exam
import ExamSelectionPage from './pages/Exam/ExamSelection';
import ExamScreen from './pages/Exam/Exam';
import ExamCompletion from './components/Exam/ExamCompletion';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);

  // Use useEffect to handle initial app loading
  useEffect(() => {
    // Perform initialization logic that's not related to authentication
    const initializeApp = async () => {
      try {
        // You can add any other initialization logic here
        // Note: We'll handle authentication-specific loading separately
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    };
    
    initializeApp();
  }, []);

  useEffect(() => {
    // Check authentication status when currentUser changes
    if (currentUser === null && window.location.pathname !== '/auth' && 
        !window.location.pathname.startsWith('/admin')) {
      window.location.href = '/auth';
    }

    // Update loading state when authentication is resolved
    if (currentUser !== undefined) {
      setLoading(false);
    }
  }, [currentUser]);

  // Create router configuration with protected routes
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
      children: [
        { path: "/", element: <HomeContent /> },
        { path: "/new", element: <NewChatPage /> },
        { path: "/subjects", element: <AcademicSection /> },
        { path: "/:id", element: <NewChatPage /> },
        { path: "/subjects/:id", element: <StudyMaterialsPage /> },
        { path: "/exam", element: <ExamSelectionPage /> },
        { path: "/exam/:examId", element: <ExamScreen /> },
      
      ]
    },
    { path: "/auth", element: <AuthPage /> },
    { path: "/admin/login", element: <AdminLogin /> },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        { path: "dashboard", element: <Dashboard /> },
        { path: "add-question", element: <AddQuestion /> },
        { path: "add-subject", element: <AddSubject /> }
      ]
    }
  ]);

  // Show loading screen when app is initializing
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Helmet>
        <title>Shikhbo - learn anything</title>
      </Helmet>
      <div className="bg-gray-950 text-gray-100">
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;
