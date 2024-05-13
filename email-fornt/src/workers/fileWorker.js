// worker.js
self.onmessage = (e) => {
  console.log('worker received message:', e.data);
  const { data } = e.data;
  // 执行一些耗时的计算或操作
  const result = data * 2; // 示例：将数据翻倍
  self.postMessage(result); // 将结果发送回主线程
};