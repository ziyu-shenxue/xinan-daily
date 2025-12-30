/**
 * 滑块与数字双向联动逻辑（v1.0）
 * 功能：实现滑块与数字框双向联动、数值范围限制、轨道颜色可视化、实时同步预览
 * 遵循规范：主色#2E7D32、滑块轨道#E0E0E0、选中色#81C784，兼容Chrome/Edge浏览器
 */
class SliderNumberLink {
  constructor() {
    // 绑定所有核心组件（与index.html中class和data-link严格对应）
    this.sliders = document.querySelectorAll('.range-field.core-component');
    this.numberInputs = document.querySelectorAll('.range-value.core-component');
    
    // 初始化校验：确保核心组件存在
    if (this.sliders.length === 0 || this.numberInputs.length === 0) {
      console.warn('滑块联动组件初始化警告：未找到滑块或数字框组件');
      return;
    }

    // 绑定联动事件
    this.bindBidirectionalLink();
    // 初始化滑块轨道颜色
    this.initSliderTrackColor();
  }

  /**
   * 绑定滑块与数字框双向联动事件
   */
  bindBidirectionalLink() {
    // 1. 滑块联动数字框（拖动滑块→数字更新）
    this.sliders.forEach(slider => {
      slider.addEventListener('input', (e) => {
        const currentValue = e.target.value;
        const targetInputId = e.target.dataset.link;
        const targetInput = document.getElementById(targetInputId);
        
        if (targetInput) {
          // 更新数字框值
          targetInput.value = currentValue;
          // 更新滑块轨道颜色
          this.updateSliderTrack(slider, currentValue);
          // 触发预览更新
          this.triggerPreviewUpdate();
        }
      });
    });

    // 2. 数字框联动滑块（修改数字→滑块滑动）
    this.numberInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        let inputValue = e.target.value.trim();
        const targetSliderId = e.target.dataset.link;
        const targetSlider = document.getElementById(targetSliderId);
        
        if (!targetSlider) return;

        // 数值处理：过滤非数字字符，限制范围
        const min = parseInt(targetSlider.min) || 1;
        const max = parseInt(targetSlider.max) || 10;
        inputValue = this.filterAndLimitValue(inputValue, min, max);
        
        // 更新滑块和数字框值（确保两者一致）
        e.target.value = inputValue;
        targetSlider.value = inputValue;
        // 更新滑块轨道颜色
        this.updateSliderTrack(targetSlider, inputValue);
        // 触发预览更新
        this.triggerPreviewUpdate();
      });

      // 数字框失焦时二次校验（防止空值）
      input.addEventListener('blur', (e) => {
        const targetSliderId = e.target.dataset.link;
        const targetSlider = document.getElementById(targetSliderId);
        if (!e.target.value && targetSlider) {
          const defaultValue = targetSlider.value || targetSlider.min;
          e.target.value = defaultValue;
          this.updateSliderTrack(targetSlider, defaultValue);
        }
      });
    });
  }

  /**
   * 过滤非数字字符并限制数值范围
   * @param {string} value - 输入值
   * @param {number} min - 最小值
   * @param {number} max - 最大值
   * @returns {number} 处理后的合法值
   */
  filterAndLimitValue(value, min, max) {
    // 过滤非数字字符（保留整数和小数点）
    const pureNumber = value.replace(/[^0-9.]/g, '');
    // 转换为数字（默认取最小值）
    let validValue = parseFloat(pureNumber) || min;
    // 限制数值范围
    validValue = Math.max(min, Math.min(max, validValue));
    // 保留1位小数（适配治神时长等支持小数点的字段）
    return validValue.toFixed(1);
  }

  /**
   * 初始化所有滑块轨道颜色（页面加载时）
   */
  initSliderTrackColor() {
    this.sliders.forEach(slider => {
      const initialValue = slider.value;
      this.updateSliderTrack(slider, initialValue);
    });
  }

  /**
   * 更新滑块轨道颜色（可视化选中进度）
   * @param {HTMLElement} slider - 滑块元素
   * @param {string|number} value - 当前值
   */
updateSliderTrack(slider, value) {
    // 校验滑块DOM与数值有效性
    if (!slider || isNaN(Number(value))) {
      console.warn('⚠️ 滑块元素或数值异常，无法更新轨道样式');
      return;
    }
    const min = parseInt(slider.min) || 1;
    const max = parseInt(slider.max) || 10;
    // 计算进度百分比并限制0-100，避免样式异常
    const percentage = Math.max(0, Math.min(100, ((Number(value) - min) / (max - min)) * 100));
    // 设置CSS变量控制轨道颜色（与cssprint全局样式文件.css中var(--value)对应）
    slider.style.setProperty('--value', `${percentage}%`);
    // 触发预览更新
    this.triggerPreviewUpdate();
  }

  /**
   * 触发实时预览更新（关联jsreportGenerator.js中的预览函数）
   */
  triggerPreviewUpdate() {
    if (window.generateLivePreview && typeof window.generateLivePreview === 'function') {
      window.generateLivePreview();
    }
  }
}

// 页面DOM加载完成后初始化（确保DOM元素已渲染）
window.addEventListener('DOMContentLoaded', () => {
  new SliderNumberLink();
  console.log('滑块与数字双向联动组件初始化完成：支持拖动联动、数值限制、轨道可视化');
});