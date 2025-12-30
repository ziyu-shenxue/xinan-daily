/**
 * 日期选择组件逻辑（v1.0）
 * 功能：自动填充当前日期、日历选择联动星期、日期格式校验、适配响应式布局
 * 遵循规范：主色#2E7D32、错误提示色#D32F2F，兼容Chrome/Edge浏览器
 */
class DatePicker {
  constructor() {
    // 绑定DOM元素（与index.html中ID严格一致）
    this.dateInput = document.getElementById('date');
    this.weekdayInput = document.getElementById('weekday');
    
    // 初始化校验：确保核心组件存在
    if (!this.dateInput || !this.weekdayInput) {
      console.warn('日期组件初始化失败：未找到核心DOM元素 #date 或 #weekday');
      alert('日期选择功能异常！请检查页面DOM结构');
      return;
    }
    
    // 初始化当前日期
    this.initCurrentDate();
    // 绑定交互事件
    this.bindDateEvents();
  }

    /**
   * 初始化当前日期（格式：YYYY-MM-DD）
   */
  initCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    // 填充日期并同步星期
    this.dateInput.value = dateStr;
    this.updateWeekday(dateStr);
    
    // 强制触发联动更新（解决问题2：日期与编号/预览联动）
    if (window.initReportId) window.initReportId(); // 生成日报编号
    if (window.generateLivePreview) window.generateLivePreview(); // 更新预览区
  }

  /**
   * 绑定日期输入框交互事件
   */
  bindDateEvents() {
    // 1. 日历选择变更事件（同步星期）
    this.dateInput.addEventListener('change', (e) => {
      const selectedDate = e.target.value;
      this.updateWeekday(selectedDate);
      this.triggerPreviewUpdate();
    });

    // 2. 手动输入格式校验（仅允许YYYY-MM-DD格式）
    this.dateInput.addEventListener('input', (e) => {
      const inputValue = e.target.value.trim();
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      // 格式校验与样式反馈
      if (inputValue && !dateRegex.test(inputValue)) {
        this.dateInput.style.borderColor = '#D32F2F';
      } else {
        this.dateInput.style.borderColor = '#CCCCCC';
        // 格式合法时同步星期
        if (dateRegex.test(inputValue)) {
          this.updateWeekday(inputValue);
          this.triggerPreviewUpdate();
        }
      }
    });

    // 3. 聚焦时清除错误样式
    this.dateInput.addEventListener('focus', () => {
      if (this.dateInput.style.borderColor === '#D32F2F') {
        this.dateInput.style.borderColor = '#CCCCCC';
      }
    });
  }

  /**
   * 根据日期字符串更新星期显示
   * @param {string} dateStr - 日期字符串（YYYY-MM-DD）
   */
  updateWeekday(dateStr) {
    const weekdayMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const date = new Date(dateStr);
    
    // 异常日期处理（避免控制台报错）
    if (isNaN(date.getTime())) {
      this.weekdayInput.value = '日期无效';
      return;
    }
    
    // 填充星期并触发输入事件（同步到预览区）
    const weekday = weekdayMap[date.getDay()];
    this.weekdayInput.value = weekday;
    this.weekdayInput.dispatchEvent(new Event('input'));
  }

  /**
   * 触发实时预览更新（关联jsreportGenerator.js中的预览函数）
   * 适配根目录部署，强化错误处理与用户提示
   * @returns {Promise<boolean>} 预览是否成功
   */
async triggerPreviewUpdate() {
  // 1. 加载状态提示（兼容根目录CSS，无额外依赖）
  const previewLoading = document.getElementById('preview-loading');
  if (previewLoading) {
    previewLoading.style.display = 'block';
    previewLoading.style.textAlign = 'center';
    previewLoading.style.padding = '20px 0';
    previewLoading.style.color = '#666';
    previewLoading.innerText = '预览生成中...';
  }
  
  try {
    // 根目录下优先检测全局函数，兼容异步/同步两种写法
    if (window.generateLivePreview) {
      if (typeof window.generateLivePreview === 'function') {
        await Promise.resolve(window.generateLivePreview()); // 统一包装为Promise，兼容同步函数
        console.log('[预览更新] 实时预览已触发（根目录适配版）');
        return true;
      } else {
        console.warn('[预览更新] 预览函数不是可执行类型');
        alert('预览功能异常：核心函数类型错误，请检查jsreportGenerator.js是否在根目录');
        return false;
      }
    } else {
      console.warn('[预览更新] 预览函数未定义：window.generateLivePreview');
      // 根目录专属提示：明确文件位置
      alert('预览功能未加载完成！请确认jsreportGenerator.js文件已放在根目录，再刷新页面重试');
      return false;
    }
  } catch (error) {
    console.error('[预览更新] 预览函数执行失败：', error);
    // 更友好的错误提示，适配非技术用户
    alert(`预览更新失败：${error.message}\n建议检查：1. jsreportGenerator.js是否在根目录 2. 浏览器控制台是否有其他报错`);
    return false;
  } finally {
    // 2. 隐藏加载状态
    if (previewLoading) previewLoading.style.display = 'none';
  }
}
}

// 页面DOM加载完成后初始化（确保DOM元素已渲染）
window.addEventListener('DOMContentLoaded', () => {
  new DatePicker();
  console.log('日期选择组件初始化完成：支持日历选择+手动输入+格式校验');
});