const BACKEND_URI = 'http://localhost:5000'

export async function getNextMove(boardState) {
    try {
      const response = await fetch(`${BACKEND_URI}/generate`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `given the board state make a move for black.. give source sqaure and destination square only..nothing else \n${JSON.stringify(boardState)}`, 
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      if (data && data.result) {
        return data.result; // Return the move from the backend
      } else {
        throw new Error('Invalid response from backend');
      }
    } catch (error) {
      console.error('Error getting next move:', error);
      return null; // Or handle the error as needed
    }
  }