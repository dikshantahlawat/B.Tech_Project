import { useMemo, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const initialForm = {
  N: 90,
  P: 42,
  K: 43,
  temperature: 20.8,
  humidity: 82,
  ph: 6.5,
  rainfall: 202,
};

const fields = [
  { key: 'N', label: 'Nitrogen (N)', min: 0, max: 200, step: '0.1' },
  { key: 'P', label: 'Phosphorus (P)', min: 0, max: 200, step: '0.1' },
  { key: 'K', label: 'Potassium (K)', min: 0, max: 250, step: '0.1' },
  { key: 'temperature', label: 'Temperature (degC)', min: -10, max: 60, step: '0.1' },
  { key: 'humidity', label: 'Humidity (%)', min: 0, max: 100, step: '0.1' },
  { key: 'ph', label: 'pH', min: 0, max: 14, step: '0.1' },
  { key: 'rainfall', label: 'Rainfall (mm)', min: 0, max: 500, step: '0.1' },
];

function App() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const strongest = useMemo(() => {
    if (!result?.top_recommendations?.length) return null;
    return result.top_recommendations[0];
  }, [result]);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const details = await res.text();
        throw new Error(details || 'Prediction failed.');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    setForm(initialForm);
    setError('');
    setResult(null);
  };

  return (
    <div className="page">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <main className="layout">
        <section className="panel hero">
          <p className="eyebrow">B.Tech Major Project</p>
          <h1>Smart Crop Recommendation</h1>
          <p className="subtitle">
            Enter soil nutrients and weather values to get the best crop suggestion from your trained ML model.
          </p>
        </section>

        <section className="panel form-panel">
          <h2>Input Parameters</h2>
          <form onSubmit={onSubmit} className="form-grid">
            {fields.map((field) => (
              <label key={field.key} className="field">
                <span>{field.label}</span>
                <input
                  type="number"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={form[field.key]}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  required
                />
              </label>
            ))}

            <div className="actions">
              <button type="submit" disabled={loading}>
                {loading ? 'Predicting...' : 'Get Recommendation'}
              </button>
              <button type="button" className="ghost" onClick={onReset} disabled={loading}>
                Reset
              </button>
            </div>
          </form>
          {error && <p className="error">{error}</p>}
        </section>

        <section className="panel result-panel">
          <h2>Prediction Result</h2>
          {!result && !loading && <p className="muted">No prediction yet. Submit values to see recommendations.</p>}
          {loading && <p className="muted">Model is evaluating best crop...</p>}

          {result && (
            <>
              <div className="best-card">
                <p className="best-label">Best Recommended Crop</p>
                <h3>{result.best_crop}</h3>
                {strongest && <p className="confidence">Confidence: {(strongest.confidence * 100).toFixed(2)}%</p>}
              </div>

              <div className="top-list">
                <p>Top 3 Recommendations</p>
                {result.top_recommendations.map((item) => (
                  <div className="top-item" key={item.crop}>
                    <span>{item.crop}</span>
                    <div className="bar-wrap">
                      <div className="bar" style={{ width: `${(item.confidence * 100).toFixed(2)}%` }} />
                    </div>
                    <strong>{(item.confidence * 100).toFixed(2)}%</strong>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
