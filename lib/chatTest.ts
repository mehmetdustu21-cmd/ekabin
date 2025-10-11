// lib/chatTest.ts
// Chat API Test

export async function testChatAPI() {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Merhaba!' })
    });
    
    const data = await res.json();
    console.log('Chat API Response:', data.response);
    return data;
  } catch (error) {
    console.error('Chat API Error:', error);
    return { error: error.message };
  }
}
