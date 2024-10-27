// 注入到iframe中的脚本，用于捕获用户操作
(function() {
  function captureAction(type, selector, value) {
    window.parent.postMessage({
      type: 'USER_ACTION',
      action: { type, selector, value }
    }, '*');
  }

  // 监听点击事件
  document.addEventListener('click', (e) => {
    const selector = generateSelector(e.target);
    captureAction('click', selector);
  });

  // 监听输入事件
  document.addEventListener('input', (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      const selector = generateSelector(e.target);
      captureAction('input', selector, e.target.value);
    }
  });

  // 监听滚动事件
  let scrollTimeout;
  document.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      captureAction('scroll', 'window', `${window.scrollX},${window.scrollY}`);
    }, 150);
  });

  // 监听回放指令
  window.addEventListener('message', (event) => {
    if (event.data.type === 'PLAYBACK_ACTION') {
      const { action } = event.data;
      playbackAction(action);
    }
  });

  // 生成元素选择器
  function generateSelector(element) {
    if (!(element instanceof Element)) return '';
    
    let path = [];
    while (element.nodeType === Node.ELEMENT_NODE) {
      let selector = element.nodeName.toLowerCase();
      if (element.id) {
        selector += '#' + element.id;
        path.unshift(selector);
        break;
      } else {
        let sibling = element;
        let nth = 1;
        while (sibling.previousElementSibling) {
          sibling = sibling.previousElementSibling;
          if (sibling.nodeName.toLowerCase() === selector) nth++;
        }
        if (nth !== 1) selector += `:nth-of-type(${nth})`;
      }
      path.unshift(selector);
      element = element.parentNode;
    }
    return path.join(' > ');
  }

  // 回放动作
  function playbackAction(action) {
    try {
      switch (action.type) {
        case 'click': {
          const element = document.querySelector(action.selector);
          if (element) element.click();
          break;
        }
        case 'input': {
          const element = document.querySelector(action.selector);
          if (element && (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) {
            element.value = action.value;
            element.dispatchEvent(new Event('input', { bubbles: true }));
          }
          break;
        }
        case 'scroll': {
          const [x, y] = action.value.split(',').map(Number);
          window.scrollTo(x, y);
          break;
        }
      }
    } catch (error) {
      console.error('Playback error:', error);
    }
  }
})();