import CropForm from './components/CropForm';

function App() {
  console.log("App component loaded");
  return (
    <div style={{ padding: '2rem' }}>
      <h2>🌾 FarmCast Yield Predictor</h2>
      <CropForm />
    </div>
  );
}

export default App;