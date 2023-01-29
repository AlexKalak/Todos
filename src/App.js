import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import TodoPage from './features/todos/TodoPage';

function App() {
  const [enb, setEnb] = useState(false)
  return (
    <div className="App">
      
      <Routes>
        <Route path="/todos" element={<TodoPage />}>
          
        </Route>
      </Routes>
    </div>
  );
}

export default App;
