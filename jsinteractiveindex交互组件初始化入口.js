/**
 * 交互组件初始化入口（v1.0）
 * 功能：统一初始化所有核心交互组件（日期选择、滑块联动、五维联想），避免重复初始化
 * 遵循规范：模块化集成，预留组件开关接口，兼容后续扩展，适配GitHub部署
 */
window.addEventListener('DOMContentLoaded', () => {
  // 初始化状态标记（避免重复初始化）
  const initStatus = {
    datePicker: false,
    sliderNumberLink: false,
    daodejingFiveDimension: false
  };

  /**
   * 初始化日期选择组件
   * 依赖：datePicker.js已加载，DOM元素#date和#weekday存在
   */
  function initDatePicker() {
    if (window.DatePicker && document.getElementById('date') && document.getElementById('weekday')) {
      new window.DatePicker();
      initStatus.datePicker = true;
      console.log('✅ 日期选择组件初始化成功');
    } else {
      console.warn('⚠️ 日期选择组件初始化失败：依赖缺失或DOM元素不存在');
    }
  }

  /**
   * 初始化滑块与数字联动组件
   * 依赖：sliderNumberLink.js已加载，存在.range-field.core-component组件
   */
  function initSliderNumberLink() {
    if (window.SliderNumberLink && document.querySelectorAll('.range-field.core-component').length > 0) {
      new window.SliderNumberLink();
      initStatus.sliderNumberLink = true;
      console.log('✅ 滑块与数字联动组件初始化成功');
    } else {
      console.warn('⚠️ 滑块联动组件初始化失败：依赖缺失或无相关DOM组件');
    }
  }

  /**
   * 初始化道德经五维联想组件
   * 依赖：daodejingFiveDimension.js已加载，DOM元素#chapter_search和#chapter_results存在
   */
  function initDaodejingFiveDimension() {
    if (window.DaodejingFiveDimension && document.getElementById('chapter_search') && document.getElementById('chapter_results')) {
      // 延迟初始化，确保jsguidanceEngine.js中的DAODEJING_81_CHAPTERS已定义
      setTimeout(() => {
        new window.DaodejingFiveDimension();
        initStatus.daodejingFiveDimension = true;
        console.log('✅ 道德经五维联想组件初始化成功');
        logInitSummary(); // 初始化完成后输出汇总日志
      }, 300);
    } else {
      console.warn('⚠️ 五维联想组件初始化失败：依赖缺失或DOM元素不存在');
      logInitSummary(); // 即使部分失败也输出汇总日志
    }
  }

  /**
   * 输出初始化汇总日志
   */
  function logInitSummary() {
    const successCount = Object.values(initStatus).filter(status => status).length;
    const totalCount = Object.keys(initStatus).length;
    console.log(`\n📊 交互组件初始化汇总：成功${successCount}/${totalCount}个`);
    
    // 列出未成功初始化的组件
    Object.entries(initStatus).forEach(([component, status]) => {
      if (!status) {
        console.log(`❌ 未初始化：${component}`);
      }
    });

    // 提示核心功能状态
    if (successCount === totalCount) {
      console.log('🎉 所有核心交互组件初始化完成，可正常使用（日期选择、滑块联动、五维联想）');
    } else {
      console.log('⚠️ 部分组件初始化失败，可能影响部分功能使用，请检查依赖文件加载顺序和DOM结构');
    }
  }

  // 按依赖顺序初始化组件（先基础组件，后关联组件）
  initDatePicker();
  initSliderNumberLink();
  initDaodejingFiveDimension();

  /**
   * 预留扩展接口：手动触发组件初始化（如需动态加载DOM后使用）
   * 使用方式：window.reinitInteractiveComponents()
   */
  window.reinitInteractiveComponents = function() {
    console.log('\n🔄 手动触发组件重新初始化');
    initDatePicker();
    initSliderNumberLink();
    initDaodejingFiveDimension();
  };

  /**
   * 预留扩展接口：获取组件初始化状态
   * 使用方式：window.getInteractiveInitStatus()
   */
  window.getInteractiveInitStatus = function() {
    return { ...initStatus };
  };
});