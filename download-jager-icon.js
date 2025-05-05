import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建图标目录
const iconDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Jager图标URL
const iconUrl = 'https://jager.meme/favicon.png';
const iconPath = path.join(iconDir, 'jager批量空投.ico');

console.log(`Downloading ${iconUrl} to ${iconPath}`);

https.get(iconUrl, (response) => {
  if (response.statusCode === 200) {
    const file = fs.createWriteStream(iconPath);
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Downloaded Jager icon successfully');
    });
  } else {
    console.error(`Failed to download ${iconUrl}: ${response.statusCode}`);
  }
}).on('error', (err) => {
  console.error(`Error downloading ${iconUrl}: ${err.message}`);
});
