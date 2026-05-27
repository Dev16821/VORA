const test = async (msg) => {
  const res = await fetch('http://localhost:5000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: msg })
  });
  const data = await res.json();
  console.log("=== Response for:", msg.substring(0, 30), "===");
  console.log(data.reply.substring(0, 200) + "...\n");
};

(async () => {
  await test("Hey, what is the weather like?"); // should be general
  await test(`for(int i=0;i<n;i++) {
    cout << arr[i]
  }`); // should trigger code analysis
})();
