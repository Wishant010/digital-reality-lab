// Simple test component
function TestApp() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-emerald-400 mb-4">
          🚀 Website Werkt!
        </h1>
        <p className="text-xl text-gray-300">
          De basis optimalisaties zijn succesvol toegepast.
        </p>
        <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <p className="text-emerald-300">✅ Ultra-snelle loading</p>
          <p className="text-emerald-300">✅ GPU-versnelde animaties</p>
          <p className="text-emerald-300">✅ Memory optimalisatie</p>
          <p className="text-emerald-300">✅ Clean design</p>
        </div>
      </div>
    </div>
  );
}

export default TestApp;
