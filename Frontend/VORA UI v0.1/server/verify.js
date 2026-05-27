git add .
git commit -m "Restore and organize VORA frontend resources"async function testAPI() {
  const code = `
    function binarySearch(arr, target) {
      let low = 0;
      let high = arr.length - 1;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
      }
      return -1;
    }
  `;

  try {
    console.log('Testing /api/analyze...');
    const analyzeResponse = await fetch('http://localhost:5000/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language: 'javascript' })
    });
    const analyzeData = await analyzeResponse.json();
    console.log('Analyze Result:', analyzeData.algorithm);

    console.log('\nTesting /api/simulate...');
    const simulateResponse = await fetch('http://localhost:5000/api/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputSize: 5000, complexity: 'O(log n)' })
    });
    const simulateData = await simulateResponse.json();
    console.log('Simulate Result:', simulateData.time + 'ms');

    if (analyzeData.algorithm === 'Binary Search') {
      console.log('\n✅ Backend Integration Verified Successfully!');
    } else {
      console.log('\n❌ Backend Verification Failed. Detected:', analyzeData.algorithm);
    }
  } catch (error) {
    console.error('Verification Error:', error.message);
  }
}

testAPI();
