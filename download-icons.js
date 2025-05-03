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

// 读取书签数据
const bookmarksPath = path.join(__dirname, 'src', 'assets', 'config', 'bookmarks.json');
const bookmarks = JSON.parse(fs.readFileSync(bookmarksPath, 'utf8'));

// 提取所有图标URL
const icons = [];
bookmarks.forEach(category => {
  category.items.forEach(item => {
    if (item.favicon) {
      const iconName = item.title.toLowerCase().replace(/\s+/g, '-');
      icons.push({
        url: item.favicon,
        name: iconName,
        title: item.title
      });
    }
  });
});

// 下载图标
const downloadPromises = icons.map(icon => {
  return new Promise((resolve, reject) => {
    const iconPath = path.join(iconDir, `${icon.name}.ico`);
    console.log(`Downloading ${icon.url} to ${iconPath}`);
    
    const protocol = icon.url.startsWith('https') ? https : http;
    const request = protocol.get(icon.url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(iconPath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded ${icon.title} icon`);
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
    // 更新书签数据，使用本地图标路径
    bookmarks.forEach(category => {
      category.items.forEach(item => {
        if (item.favicon) {
          const iconName = item.title.toLowerCase().replace(/\s+/g, '-');
          item.favicon = `./assets/icons/${iconName}.ico`;
        }
      });
    });

    // 保存更新后的书签数据
    fs.writeFileSync(bookmarksPath, JSON.stringify(bookmarks, null, 2), 'utf8');
    console.log('Updated bookmarks.json with local icon paths');
  })
  .catch(err => {
    console.error('Error in download process:', err);
  });
