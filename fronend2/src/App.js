import './App.css';
import {BrowserRoute as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from 'pages/auth/Login'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </Router>
  );
}

export default App;
