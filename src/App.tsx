import logo from './logo.svg'
import chad from './assets/chad.svg'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <img src={logo} className="App-logo" alt="logo" />
          <img src={chad} className="App-logo" alt="chad" />
        </div>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App;
