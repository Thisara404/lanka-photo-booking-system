import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/api';

const ApiTester = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const testBlogApi = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/blog');
      setResult(response.data);
      console.log('API response:', response.data);
    } catch (err) {
      setError(err.message);
      console.error('API error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>API Tester</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={testBlogApi} disabled={loading}>
            {loading ? 'Testing...' : 'Test Blog API'}
          </Button>
          
          {error && (
            <div className="p-4 bg-red-100 text-red-800 rounded">
              Error: {error}
            </div>
          )}
          
          {result && (
            <div className="p-4 bg-green-100 text-green-800 rounded">
              Success! Found {result.length} blog posts.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiTester;