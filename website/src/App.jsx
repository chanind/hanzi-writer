import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Learn from './pages/Learn';
import Practice from './pages/Practice';
import Progress from './pages/Progress';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/browse/:level" element={<Browse />} />
            <Route path="/learn/:character" element={<Learn />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/practice/:character" element={<Practice />} />
            <Route path="/progress" element={<Progress />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
