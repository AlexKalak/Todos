import logo from './logo.svg';
import './App.css';
import TodosList from './features/todos/TodosList';
import TodoEditPopup from './features/todos/TodoEditPopup/TodoEditPopup';
import Loading from './components/Loading/Loading';
import Test from './features/todos/Test';
import TodoDeletePopup from './features/todos/TodoDeletePopup/TodoDeletePopup';

function App() {
  return (
    <div className="App">
      <main>
        <TodosList />
      </main>
      <TodoEditPopup />
      <TodoDeletePopup />
    </div>
  );
}

export default App;
