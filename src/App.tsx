import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import PostDetail from './pages/PostDetails';
import Auth from './pages/Auth';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <div className="pt-20 px-4 md:px-8 container mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;