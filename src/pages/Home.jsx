import React, { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

function Home() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleShorten = async () => {
    if (!url) return alert('Enter a URL!');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longurl: url }),
      });
      const data = await res.json();
      setShortUrl(data.shortUrl);
      setHistory(prev => [{ original: url, short: data.shortUrl }, ...prev]);
      setCopied(false);
      setUrl('');
    } catch {
      alert('Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link);
    setCopied(link);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div
        className={`fixed z-20 top-0 left-0 h-full bg-gray-800 p-6 w-72 transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h2 className="text-2xl font-bold">History</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <HiX size={28} />
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-4 hidden md:block">History</h2>
        <div className="flex-1 overflow-y-auto">
          {history.length ? (
            history.map((h, i) => (
              <div
                key={i}
                className="bg-gray-700 rounded p-3 mb-2 flex justify-between items-center hover:bg-gray-600 transition"
              >
                <div className="text-sm break-words">
                  <p className="text-gray-300">{h.original}</p>
                  <p className="text-green-400 font-semibold">{h.short}</p>
                </div>
                <button
                  onClick={() => handleCopy(h.short)}
                  className="ml-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                >
                  {copied === h.short ? 'Copied ✅' : 'Copy'}
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No history yet...</p>
          )}
        </div>
      </div>

      {/* Hamburger / X menu */}
      <button
        className="fixed top-4 left-4 z-30 md:hidden bg-gray-800 p-2 rounded"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <HiX size={28} /> : <HiMenu size={28} />}
      </button>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 ml-0 md:ml-72 transition-all duration-300">
        <h1 className="text-4xl font-bold mb-2">ClipLink</h1>
        <p className="text-gray-400 mb-6 text-center max-w-md">
          Instantly shorten your URLs and share them with style. Fast, secure, and modern.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mb-6">
          <input
            type="text"
            placeholder="Enter your URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 p-3 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleShorten}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-semibold transition"
          >
            {loading ? 'Shortening...' : 'Shorten'}
          </button>
        </div>

        {shortUrl && (
          <div className="mt-4 w-full max-w-md">
            <div className="bg-gray-800 p-4 rounded shadow-lg flex justify-between items-center hover:scale-105 transform transition">
              <p className="text-green-400 break-all">{shortUrl}</p>
              <button
                onClick={() => handleCopy(shortUrl)}
                className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium transition"
              >
                {copied === shortUrl ? 'Copied ✅' : 'Copy'}
              </button>
            </div>
            <p className="text-gray-500 mt-2 text-sm text-center">
              Share your new short link anywhere!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
