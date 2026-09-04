import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./public/login"
import ThemeToggle from "./components/theme-toggle"
import Footer from "./components/footer"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./auth-pages/layout/protected-route";
import Dashboard from "./auth-pages/dashboard/Dashboard";
import { TooltipProvider } from './components/ui/tooltip';
import { Toaster as Sonner, Toaster } from "./components/ui/sonner"; 
import DefaultLayout from "./auth-pages/layout/DefaultLayout";
//import Requests from "./auth-pages/forms/manage-forms";
import Reports from "./auth-pages/reports/reports";
import Settings from "./auth-pages/settings/settings";
import AppContextProvider from "./context/AppContext";
import { setupAxiosInterceptors } from "./utils/axiosConfig";
import { useEffect } from "react";
import Log from "./auth-pages/activity-log/log";
import Accounts from "./auth-pages/accounts/accounts";
import SignUp from "./public/sign-up";
import ManageForms from "./auth-pages/forms/manage-forms";
import UserForms from "./auth-pages/forms/user-forms";
import FormDetail from "./auth-pages/forms/form-detail";
import UserRecords from "./auth-pages/user-records/user-records";
import MedgemmaAi from "./public/medgemma-ai";
import Registration from "./auth-pages/registration/registration";
import Vendors from "./auth-pages/vendors/vendors";
import RequestPage from "./public/manage-requests/request-page";
import Requests from "./auth-pages/procurement-requests/requests";
import Folders from "./auth-pages/folders/folders";
import Activities from "./auth-pages/activities/activities";

function App() {

  
  const queryClient = new QueryClient();
  
  useEffect(() => {
      setupAxiosInterceptors(() => {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          window.location.href = '/';
          alert('Your session has expired. Please log in again.');
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <ThemeToggle />
        <div className='w-full'>
          <TooltipProvider>
            <Router>
              <Routes>
                <Route exact path="/" element={<Login />} />
                <Route exact path="/signup" element={<SignUp />} />
                <Route element={<ProtectedRoute><DefaultLayout /></ProtectedRoute>}>
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/repository" element={<ProtectedRoute><Folders /></ProtectedRoute>} />
                    <Route path="/activities" element={<ProtectedRoute><Activities /></ProtectedRoute>} />
                  </Route>
              </Routes>
            </Router>
            <Sonner position="top-right" />
          </TooltipProvider>
          <Footer />
        </div>
      </AppContextProvider>
    </QueryClientProvider>
  )
}

export default App
