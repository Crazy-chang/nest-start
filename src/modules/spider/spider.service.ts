import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class SpiderService {
  private urlEnum = {
    baidu: 'https://top.baidu.com/board?tab=realtime',
    // weibo: 'https://s.weibo.com/top/summary?cate=realtimehot',
    weibo: 'https://s.weibo.com/top/summary',
    zhihu: 'https://www.zhihu.com/hot',
    douyin: 'https://www.iesdouyin.com/share/billboard/',
  };
  async getBaiduHotSearch(type: string): Promise<any[]> {

    const url = this.urlEnum[type];
    // 模拟headers
    const headers = {
      'cookie': 'SUB=_2AkMR8Bzkf8NxqwFRmf0XzGvjb4x3zwHEieKnrO0_JRMxHRl-yT9kqmMHtRB6OnAyC3ZtjaT5q1jwM0_aHrCMEvlnAj-o; SUBP=0033WrSXqPxfM72-Ws9jqgMF55529P9D9WFTP2MxWPjMdfqH2lQ8Jx9_; _s_tentry=passport.weibo.com; Apache=9034410052178.598.1722586067660; SINAGLOBAL=9034410052178.598.1722586067660; ULV=1722586067671:1:1:1:9034410052178.598.1722586067660:',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
    };

    try {
      const { data } = await axios.get(url, { headers });
      const $ = cheerio.load(data);
      const hotSearchList: any[] = [];

      console.log('内容=', data);
      switch (type) {
        case 'baidu':
          $('.category-wrap_iQLoo').each((index, container) => {
            const title = $(container).find('.c-single-text-ellipsis').text().trim();
            const content = $(container).find('.hot-desc_1m_jR').text().trim();
            const link = $(container).find('.img-wrapper_29V76').attr('href');
            // console.log(`第 ${index + 1} 个热搜:`, { rank, title });
            hotSearchList.push({ order: index + 1, title, content, link });
          });
          break;
        case 'weibo':
          $('.td-02').each((index, container) => {
            const linkElement = $(container).find('a');
            const link = linkElement.attr('href');
            const title = linkElement.text().trim();
            const urlLink = 'https://s.weibo.com' + link;
            // console.log(`第 ${index + 1} 个热搜:`, { link, title });
            hotSearchList.push({ order: index + 1, title, link: urlLink });
          });
          break;
        case 'douyin':
          $('.word-item').each((index, container) => {
            const title = $(container).find('.sentence').text().trim();
            const num = $(container).find('.value').text().trim();
            const link = '';

            console.log(`第 ${index + 1} 个热搜:`, { num, title });
            hotSearchList.push({ order: index + 1, title, num, link });
          });
          break;
        case 'zhihu':
          $('.HotItem-content').each((index, container) => {
            const title = $(container).find('.HotItem-title').text().trim();
            const content = $(container).find('.HotItem-excerpt').text().trim();
            const link = $(container).find('.HotItem-content a').attr('href');

            console.log(`第 ${index + 1} 个热搜:`, { content, title });
            hotSearchList.push({ order: index + 1, title, content, link });
          });
          break;
      }

      return hotSearchList;
    } catch (error) {
      console.error(type, '获取热搜时出错:', error);
      return [JSON.stringify(error)];
    }
  }
}
