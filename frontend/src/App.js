import './App.css';
import MyEditor from './components/editor/MyEditor';
import Home from './components/homepage/Home';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const App = () => (
  <Router>
    <div className="App">
      <nav>
        <Link to="/">Home</Link>
      </nav>
      <Routes>
        <Route path="/document/:id" element={<MyEditor />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  </Router>
);

export default App;
