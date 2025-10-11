import React, { useState } from 'react';
import { testChatAPI } from '../../lib/chatTest';

const APITest: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const testChat = async () => {
    setLoading(true);
    try {
      const data = await testChatAPI();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">API Test</h2>
      
      <button
        onClick={testChat}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Testing...' : 'Test Chat API'}
      </button>

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Result:</h3>
          <pre className="text-sm overflow-auto">{result}</pre>
        </div>
      )}
    </div>
  );
};

export default APITest;
