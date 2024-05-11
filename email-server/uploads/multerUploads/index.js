function conCurequest(urls, maxnumber) {
  new Promise((resolve, reject) => {
    let index = 0;
    const result = [];
    async function _request() {
      const url = urls[index];
      const i = index;
      index++;
      try {
        const res = await fetch(url);
        // const data = await res.json();
        result[i] = res;
      } catch (error) {
        result[i] = 1;
      }
      console.log(result);
    }
    _request();
    _request();
    _request();
    _request();
    _request();
    _request();
    _request();

    return result;
  });
}

let urls = [];

for (let i = 0; i < 100; i++) {
  urls.push(`http://jsonplaceholder.typicode.com/to1
  dos/${i + 1}`);
}
const d = conCurequest(urls);
