import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建图标目录
const iconDir = path.join(__dirname, 'src', 'assets', 'icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// OpenSea图标URL
const iconUrl = 'https://opensea.io/favicon.ico';
const iconPath = path.join(iconDir, 'opensea.ico');

// 使用提供的请求头
const options = {
  headers: {
    'accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'accept-encoding': 'gzip, deflate, br, zstd',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    'cookie': '__cf_bm=LRmfN706vDfAZff_CfkJpQihNQ_gOKr2HyQXwGPEGzY-1746235564-1.0.1.1-RmSVtWIumSJSJjsTY1Omv93nvgAB06AD1R7GvDR4KERLbKIwGc25qGvDBd1Pj_elKn2a15y7Lw0vvz1gVmsXQJCoCsq0tNAUZuNm8SQ2FQ4; _cfuvid=9I5ngOPnykwGARvdJb4N0g7YPemZJi0JY7KRdyNhgxk-1746235564395-0.0.1.1-604800000',
    'if-none-match': 'W/"01035ff2fe6713c8e5f41e4579077389"',
    'referer': 'http://localhost:5173/',
    'sec-fetch-dest': 'image',
    'sec-fetch-mode': 'no-cors',
    'sec-fetch-site': 'cross-site',
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 Edg/135.0.0.0'
  }
};

console.log(`Downloading ${iconUrl} to ${iconPath}`);

// 发送请求
const request = https.get(iconUrl, options, (response) => {
  console.log(`Response status code: ${response.statusCode}`);
  
  if (response.statusCode === 200) {
    const file = fs.createWriteStream(iconPath);
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Downloaded OpenSea icon successfully');
      
      // 更新书签数据
      const bookmarksPath = path.join(__dirname, 'src', 'assets', 'config', 'bookmarks.json');
      const bookmarks = JSON.parse(fs.readFileSync(bookmarksPath, 'utf8'));
      
      // 查找并更新OpenSea的图标路径
      bookmarks.forEach(category => {
        category.items.forEach(item => {
          if (item.title === 'OpenSea') {
            item.favicon = './assets/icons/opensea.ico';
            console.log('Updated OpenSea favicon path in bookmarks.json');
          }
        });
      });
      
      // 保存更新后的书签数据
      fs.writeFileSync(bookmarksPath, JSON.stringify(bookmarks, null, 2), 'utf8');
    });
  } else {
    console.error(`Failed to download OpenSea icon: ${response.statusCode}`);
    console.log('Response headers:', response.headers);
  }
});

request.on('error', (err) => {
  console.error(`Error downloading OpenSea icon: ${err.message}`);
});
