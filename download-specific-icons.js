import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建图标目录
const iconDir = path.join(__dirname, 'src', 'assets', 'icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// 需要下载的图标
const icons = [
  {
    url: 'https://opensea.io/favicon.ico',
    name: 'opensea',
    title: 'OpenSea'
  },
  {
    url: 'https://coinmarketcap.com/favicon.ico',
    name: 'coinmarketcap',
    title: 'CoinMarketCap'
  },
  {
    url: 'https://uniswap.org/favicon.ico',
    name: 'uniswap',
    title: 'Uniswap'
  }
];

// 添加请求头，模拟浏览器请求
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://www.google.com/'
};

// 下载图标
const downloadPromises = icons.map(icon => {
  return new Promise((resolve, reject) => {
    const iconPath = path.join(iconDir, `${icon.name}.ico`);
    console.log(`Downloading ${icon.url} to ${iconPath}`);
    
    const protocol = icon.url.startsWith('https') ? https : http;
    const options = {
      headers: headers
    };
    
    const request = protocol.get(icon.url, options, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(iconPath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded ${icon.title} icon`);
          
          // 更新书签数据
          const bookmarksPath = path.join(__dirname, 'src', 'assets', 'config', 'bookmarks.json');
          const bookmarks = JSON.parse(fs.readFileSync(bookmarksPath, 'utf8'));
          
          // 查找并更新图标路径
          bookmarks.forEach(category => {
            category.items.forEach(item => {
              if (item.title === icon.title) {
                item.favicon = `./assets/icons/${icon.name}.ico`;
                console.log(`Updated ${icon.title} favicon path in bookmarks.json`);
              }
            });
          });
          
          // 保存更新后的书签数据
          fs.writeFileSync(bookmarksPath, JSON.stringify(bookmarks, null, 2), 'utf8');
          
          resolve();
        });
      } else {
        console.error(`Failed to download ${icon.url}: ${response.statusCode}`);
        reject(new Error(`Failed to download ${icon.url}: ${response.statusCode}`));
      }
    });
    
    request.on('error', (err) => {
      console.error(`Error downloading ${icon.url}: ${err.message}`);
      reject(err);
    });
  });
});

// 等待所有下载完成
Promise.all(downloadPromises.map(p => p.catch(e => e)))
  .then(() => {
    console.log('All downloads completed');
  })
  .catch(err => {
    console.error('Error in download process:', err);
  });
