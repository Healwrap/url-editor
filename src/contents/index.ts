import { message } from 'antd';
import browser from 'webextension-polyfill';

import { onMessage, sendMessage } from '~/messaging';

onMessage('getURL', (message) => {
  const url = window.location.href;
  console.log('获取URL', url);
  return url;
});

onMessage('setURL', (message) => {
  try {
    // 如果当前url==message.data，则不会刷新页面
    if (window.location.href === message.data) return;
    window.location.href = message.data;
  } catch (err) {
    console.error(err);
    return false;
  }
  return true;
});

onMessage('getIrameLinks', (message) => {
  console.log('获取iframe链接');
  const iframes = document.querySelectorAll('iframe');
  const links = Array.from(iframes).map((iframe) => iframe.src);
  return links.map((item, index) => ({ url: item, key: index }));
});

onMessage('reloadPage', (message) => {
  // 如果传入url，则在当前页面打开
  if (message.data) {
    // 如果当前url==message.data，则不会刷新页面
    if (window.location.href === message.data) return;
    window.location.href = message.data;
  } else {
    window.location.reload();
  }
  return true;
});

onMessage('openURL', (message) => {
  window.open(message.data);
  return true;
});

onMessage('forwardAndBack', (message) => {
  if (message.data.action === 'forward') {
    window.history.forward();
  }
  if (message.data.action === 'back') {
    window.history.back();
  }
});
