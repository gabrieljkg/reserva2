import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ListingDetail from './pages/ListingDetail';
import Checkout from './pages/Checkout'; 
import ListProperty from './pages/ListProperty';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/list-property" element={<ListProperty />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
