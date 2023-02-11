import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import TodoPage from './features/todos/TodoPage';
import RegistrationPage from './features/registration/RegistrationPage';

function App() {
  const [enb, setEnb] = useState(false)
  return (
    <div className="App">
      
      <Routes>
        <Route path="/todos" element={<TodoPage />}>  
        </Route>
        <Route path="/registration" element={<RegistrationPage />}>  
        </Route>


      </Routes>
    </div>
  );
}

export default App;
