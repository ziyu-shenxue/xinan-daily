/**
 * 心安工程日报系统 - 急救补丁（解决按钮失活、预览初始化失败、事件冲突问题）
 */
document.addEventListener('DOMContentLoaded', () => {
  // 清除内联onclick，避免冲突（问题10）
  document.querySelectorAll('[onclick]').forEach(elem => {
    const onclickValue = elem.getAttribute('onclick');
    if (onclickValue && onclickValue.includes('()')) {
      const actionName = onclickValue.replace('()', '').trim();
      elem.setAttribute('data-action', actionName);
    }
    elem.removeAttribute('onclick');
  });
  // 全局事件委托（问题1）
  document.body.addEventListener('click', (e) => {
    const target = e.target;
    const action = target.dataset.action || target.parentElement.dataset.action;
    if (action && typeof window[action] === 'function') {
      try { window[action](e); } 
      catch (error) {
        console.error(`[急救补丁] 执行${action}失败：`, error.message);
        alert(`功能失败，请刷新重试（错误：${action}）`);
      }
    }
  });
  // 强制初始化预览函数（问题12）
  if (!window.generateLivePreview) {
    window.generateLivePreview = () => {
      const preview = document.getElementById('live_preview');
      if (preview) preview.innerHTML = `
        <div class="preview-title">日报预览</div>
        <div class="preview-content"><div class="preview-content-item">系统初始化完成，等待表单输入...</div></div>
      `;
    };
  }
  setTimeout(() => window.generateLivePreview(), 300);
  console.log('[急救补丁] 加载完成，按钮和预览已恢复');
});