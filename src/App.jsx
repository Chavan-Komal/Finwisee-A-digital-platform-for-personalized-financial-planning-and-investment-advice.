import "./App.css"
import Hero from './components/Hero/Hero'
import MainLayout from './layout/MainLayout'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider
} from "react-router-dom";
import FAQAccordion from './pages/faq/FAQAccordion'
import Calculator from './pages/calculator/Calculator'
import Login from './pages/login/Login'
import AboutUs from './pages/about/AboutUs'
import ContactUs from './pages/contact/ContactUs'
import RetirementCalculator from './pages/calculator/RetirementCalculator'
import AfterRetirement from './pages/calculator/AfterRetirement'
import ChildEducationCalculator from './pages/calculator/ChildEducationCalculator'
import VehicleLoanCalculator from './pages/calculator/VehicleLoanCalculator'
import Register from './pages/register/Register'
import ChildMarriageCalculator from './pages/calculator/ChildMarriageCalculator'
import HomeLoanCalculator from './pages/calculator/HomeLoanCalculator'
import HomeGoalCalculator from './pages/calculator/HomeGoalCalculator'
import NetWorthCalculator from './pages/calculator/NetWorthCalculator'
import CagrCalculator from './pages/calculator/CagrCalculator'
import Offers from './pages/offers/Offers'
import PlansAndPricing from './pages/pricing/Pricing'
import GalleryPage from './pages/gallary/Gallary'
import Affiliations from './pages/affiliations/affiliations'
import AdminDashboard from './pages/admin/AdminDashboard';
import UserDashboard from './pages/user/UserDashboard';
import Cart from './pages/cart/Cart';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import SIPCalculator from './pages/calculator/SIPCalculator';
import LumpsumCalculator from './pages/calculator/LumpsumCalculator';
import CompoundInterestCalculator from './pages/calculator/CompoundInterestCalculator';
import ELearning from './pages/e-learning/E-Learning';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import NotFound from './pages/NotFound/NotFound';

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/home" replace={true} />,
    },
    {
      path: "/home",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Hero />,
        },
        {
          path: "hero",
          element: <Hero />,
        },
        {
          path: "faq",
          element: <FAQAccordion />,
        },
        {
          path: "calculator",
          element: <Calculator />,
        },
        {
          path: "aboutus",
          element: <AboutUs />,
        },
        {
          path: "contactus",
          element: <ContactUs />,
        },
        {
          path: "retirement",
          element: <RetirementCalculator />,
        },
        {
          path: "after-retirement",
          element: <AfterRetirement />,
        },
        {
          path: "child-education",
          element: <ChildEducationCalculator />,
        },
        {
          path: "vehicle-loan",
          element: <VehicleLoanCalculator />,
        },
        {
          path: "child-marriage",
          element: <ChildMarriageCalculator />,
        },
        {
          path: "home-loan",
          element: <HomeLoanCalculator />,
        },
        {
          path: "home-goal",
          element: <HomeGoalCalculator />,
        },
        {
          path: "net-worth",
          element: <NetWorthCalculator />,
        },
        {
          path: "cagr-calculator",
          element: <CagrCalculator />,
        },
        {
          path: "Offers",
          element: <Offers/>,
        },
        {
          path: "Pricing",
          element: <PlansAndPricing/>,
        },
        {
          path: "Gallery",
          element: <GalleryPage/>,
        },
        {
          path: "Affiliations",
          element: <Affiliations/>,
        },
        {
          path: "cart",
          element: <Cart/>,
        },
        {
          path: "sip-calculator",
          element: <SIPCalculator />,
        },
        {
          path: "lumpsum-calculator",
          element: <LumpsumCalculator />,
        },
        {
          path: "compound-interest-calculator",
          element: <CompoundInterestCalculator />,
        },
        {
          path: "e-learning",
          element: <ELearning />,
        },
      ],
    },
    {
      path: "/auth",
      element: <MainLayout />,
      children: [
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
      ],
    },
    {
      path: "/admin",
      element: <ProtectedRoute allowedRoles={['ADMIN']}>
        <AdminDashboard />
      </ProtectedRoute>,
    },
    {
      path: "/user",
      element: <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
        <UserDashboard />
      </ProtectedRoute>,
    },
    {
      path: "/not-found",
      element: <NotFound />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  )
}

export default App;