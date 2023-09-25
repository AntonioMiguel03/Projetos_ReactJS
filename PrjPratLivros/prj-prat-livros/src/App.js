import { Routes, Route } from "react-router-dom";
//import './App.css';

//Rotas
import PratLivros from './components/pratLivros.js';
import CadEdtLivro from './components/cadLivro.js';
import EdtLivro from './components/edtLivro.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route index element={<PratLivros />} />
          <Route path = "/CadLivro" element = {<CadEdtLivro />} />
          <Route path = "/EdtLivro/:id" element = {<EdtLivro />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
