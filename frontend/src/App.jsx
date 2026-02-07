import "./App.css";

function App() {
  return (
    <div className="page">
      <div className="container">
        <h1 className="title">WORKBRIDGE</h1>
        <h2 className="subtitle">The Smart Enterprise Platform</h2>
        <p className="tagline">Select your role to continue</p>

        <div className="roles">
          <button>HR</button>
          <button>Employee</button>
          <button>Manager</button>
          <button>Administrator</button>
          <button>Client</button>
        </div>
      </div>
    </div>
  );
}

export default App;
