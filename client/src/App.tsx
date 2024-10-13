import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserForm from './components/user-form';
import Room from './components/room';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserForm />} />
        <Route path="/:roomId" element={<Room />} />
      </Routes>
    </Router>
  );
}

export default App;