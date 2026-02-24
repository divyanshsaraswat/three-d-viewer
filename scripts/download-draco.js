const https = require('https');
const fs = require('fs');

function download(url, dest) {
  const req = https.get(url, {
    headers: { 
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      'Accept': '*/*, application/wasm'
    }
  }, (res) => {
    if (res.statusCode !== 200) {
      console.error(`Failed to download ${url}: ${res.statusCode}`);
      return;
    }
    const file = fs.createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => { 
        file.close(); 
        console.log(`✅ Downloaded ${dest}`); 
    });
  });
  req.on('error', (err) => console.error(err));
}

download('https://raw.githubusercontent.com/playcanvas/engine/main/examples/src/lib/draco/draco.wasm.js', 'public/draco/draco.wasm.js');
download('https://raw.githubusercontent.com/playcanvas/engine/main/examples/src/lib/draco/draco.wasm.wasm', 'public/draco/draco.wasm.wasm');
download('https://raw.githubusercontent.com/playcanvas/engine/main/examples/src/lib/draco/draco.js', 'public/draco/draco.js');
