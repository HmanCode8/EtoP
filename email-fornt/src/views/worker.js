onmessage = function (e) {
  console.log("Worker received message:", e.data);
  postMessage("Worker responded to message");
};
