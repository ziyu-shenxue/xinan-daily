/**
 * 心安工程日报系统 - 核心交互逻辑（解决问题4、5、6、9、11：多选正常、联动流畅、亮点提取生效）
 * 核心功能：全局表单数据同步、联动输入框切换、滑块数字双向同步、亮点提取、预览实时更新
 */
const formData = {};

// 同步表单数据到全局对象（解决数据联动缺失问题）
function syncFormData() {
  try {
    // 1. 基础信息（日期+星期+日报编号）联动同步
    formData.date = document.getElementById('date')?.value || '';
    formData.weekday = calculateWeekday(formData.date);
    formData.reportId = generateReportId(formData.date);
    if (document.getElementById('weekday')) document.getElementById('weekday').value = formData.weekday;
    if (document.getElementById('report-id')) document.getElementById('report-id').value = formData.reportId;
    
    // 2. 十目践行记录（多选数据）同步（解决问题4：多选变单选）
    formData.tenItems = [];
    document.querySelectorAll('input[name^="ten_item_"]:checked, input[name^="xinjian_"]:checked').forEach(checkbox => {
      const value = checkbox.value;
      const num = checkbox.name.split('_')[1] || '10';
      formData.tenItems.push(`${num}.${value}`);
      // 补充「其他」选项输入值（解决问题6：选其他不展开输入）
      if (value === '其他' && document.getElementById(`other_${num}`)) {
        const otherVal = document.getElementById(`other_${num}`)?.value || '';
        if (otherVal) formData.tenItems.push(`${num}.其他：${otherVal}`);
      }
      // 补充「部分践行」备注值（解决问题6：部分践行无联动输入框）
      if (value === '部分践行' && document.getElementById(`remark_${num}`)) {
        const remarkVal = document.getElementById(`remark_${num}`)?.value || '';
        if (remarkVal) formData.tenItems.push(`${num}.备注：${remarkVal}`);
      }
    });
    
    // 3. 其他核心数据（妄念格除+焊缝能量密度+道德经章节）同步
    formData.wangnianType = [];
    document.querySelectorAll('input[name="xinchuan_wangnian"]:checked').forEach(checkbox => {
      formData.wangnianType.push(checkbox.value);
      if (checkbox.value === '其他' && document.getElementById('xinchuan_wangnian_other')) {
        const otherVal = document.getElementById('xinchuan_wangnian_other').value;
        if (otherVal) formData.wangnianType.push(`其他：${otherVal}`);
      }
    });
    formData.wangnianCount = document.getElementById('xinchuan_count')?.value || '0';
    formData.weldDensity = document.getElementById('weld_density')?.value || '50';
    const chapterId = document.getElementById('chapterSearch')?.value || '';
    const chapter = window.DAODEJING_81_CHAPTERS?.find(item => item.id === chapterId) || {};
    formData.chapterTitle = chapter.title || '';
    formData.chapterEmotion = chapter.emotionFocus || '';
  } catch (error) {
    console.error('[核心交互] 同步表单数据失败：', error.message);
  }
}

// 切换「部分践行」备注输入框（显示/隐藏）
function toggleRemark(num) {
  try {
    const remarkInput = document.getElementById(`remark_${num}`);
    const isChecked = document.getElementById(`xinjian_${num}_3`)?.checked || document.getElementById(`ten_item_${num}_3`)?.checked;
    if (remarkInput) {
      remarkInput.style.display = isChecked ? 'block' : 'none';
      syncFormData(); // 同步最新数据
    }
  } catch (error) {
    console.error(`[核心交互] 切换部分践行备注框失败（编号${num}）：`, error.message);
  }
}

// 切换「其他」选项输入框（显示/隐藏）
function toggleOtherInput(num) {
  try {
    const otherInput = document.getElementById(`other_${num}`);
    const isChecked = document.getElementById(`xinjian_${num}_4`)?.checked || document.getElementById(`ten_item_${num}_4`)?.checked;
    if (otherInput) {
      otherInput.style.display = isChecked ? 'block' : 'none';
      syncFormData(); // 同步最新数据
    }
  } catch (error) {
    console.error(`[核心交互] 切换其他选项输入框失败（编号${num}）：`, error.message);
  }
}

// 滑块→数字 单向同步（解决问题5、9：能量条/横条不联动）
function syncSliderAndNumber(field) {
  try {
    const slider = document.getElementById(`${field}_slider`);
    const number = document.getElementById(field);
    if (slider && number) {
      number.value = slider.value;
      syncFormData();
      updatePreview();
    }
  } catch (error) {
    console.error(`[核心交互] 滑块同步数字失败（字段${field}）：`, error.message);
  }
}

// 数字→滑块 单向同步（带边界值限制，解决问题9：数字输入后滑块不联动）
function syncNumberAndSlider(field) {
  try {
    const slider = document.getElementById(`${field}_slider`);
    const number = document.getElementById(field);
    if (slider && number) {
      const min = parseInt(number.min) || 0;
      const max = parseInt(number.max) || 100;
      let value = parseInt(number.value) || min;
      // 边界值限制：不超过最小值，不超过最大值
      value = Math.max(min, Math.min(max, value));
      slider.value = value;
      number.value = value;
      syncFormData();
      updatePreview();
    }
  } catch (error) {
    console.error(`[核心交互] 数字同步滑块失败（字段${field}）：`, error.message);
  }
}

// 工具函数：日期字符串→星期几
function calculateWeekday(dateStr) {
  if (!dateStr) return '未知';
  try {
    const weekdays = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
    return weekdays[new Date(dateStr).getDay()];
  } catch (e) {
    return '未知';
  }
}

// 工具函数：日期字符串→日报编号
function generateReportId(dateStr) {
  if (!dateStr) return '未生成';
  try {
    const date = new Date(dateStr);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    return `${y}${m}${d}${random}`;
  } catch (e) {
    return '未生成';
  }
}

// 提取亮点（核心功能：解决问题11：提取亮点不能工作）
function extractHighlights() {
  try {
    const formData = collectFormData();
    const highlights = [];
    // 1. 践行亮点（取前3项，避免过长）
    if (formData.tenItems?.length > 0) {
      highlights.push(`践行亮点：${formData.tenItems.slice(0, 3).join('、')}`);
    }
    // 2. 格除亮点（妄念数量）
    const wangnianCount = parseInt(formData.wangnianCount);
    if (wangnianCount > 0) {
      highlights.push(`格除亮点：今日格除妄念${wangnianCount}次`);
    }
    // 3. 能量亮点（焊缝能量密度评分）
    const density = parseInt(formData.weldDensity);
    if (density >= 80) {
      highlights.push(`能量亮点：密度${density}分，状态优秀！`);
    } else if (density >= 60) {
      highlights.push(`能量亮点：密度${density}分，状态良好`);
    }
    // 4. 修行亮点（道德经章节）
    if (formData.chapterTitle) {
      highlights.push(`修行亮点：践行《道德经》${formData.chapterTitle}，聚焦${formData.chapterEmotion}`);
    }
    // 填充到亮点输入框
    const highlightInput = document.getElementById('highlights');
    if (highlightInput) {
      highlightInput.value = highlights.join('\n');
    }
    // 更新预览区
    updatePreview();
    return highlights;
  } catch (error) {
    console.error('[核心交互] 提取亮点失败：', error.message);
    alert('提取亮点失败，请检查表单数据是否完整！');
    return [];
  }
}

// 更新预览区（联动预览，解决问题13：填写不预览）
function updatePreview() {
  try {
    const formData = collectFormData();
    const preview = document.getElementById('live_preview');
    if (!preview) return;
    const previewHTML = `
      <div class="preview-title">日报预览</div>
      <div class="preview-content">
        <div class="preview-content-item"><label>日报编号：</label>${formData.reportId || '未生成'}</div>
        <div class="preview-content-item"><label>填写日期：</label>${formData.date || '未选择'}（${formData.weekday || '未知'}）</div>
        <div class="preview-content-item"><label>十目践行：</label>${formData.tenItems?.length > 0 ? formData.tenItems.join('、') : '未填写'}</div>
        <div class="preview-content-item"><label>妄念格除：</label>${formData.wangnianType?.length > 0 ? formData.wangnianType.join('、') : '未选择'}（${formData.wangnianCount}次）</div>
        <div class="preview-content-item"><label>能量密度：</label>${formData.weldDensity || '50'}分</div>
        <div class="preview-content-item"><label>道德经修行：</label>${formData.chapterTitle || '未选择'}</div>
      </div>
    `;
    preview.innerHTML = previewHTML;
  } catch (error) {
    console.error('[核心交互] 更新预览失败：', error.message);
    alert('预览更新失败，请刷新页面重试！');
  }
}

// 采集表单数据（返回全局数据的浅拷贝，避免直接修改全局对象）
function collectFormData() {
  syncFormData();
  return { ...formData };
}

// 暴露所有核心函数到全局（解决作用域黑洞问题：函数跨文件调用报错）
window.syncFormData = syncFormData;
window.toggleRemark = toggleRemark;
window.toggleOtherInput = toggleOtherInput;
window.syncSliderAndNumber = syncSliderAndNumber;
window.syncNumberAndSlider = syncNumberAndSlider;
window.collectFormData = collectFormData;
window.extractHighlights = extractHighlights;
window.updatePreview = updatePreview;

// 页面加载完成后初始化（确保DOM渲染完成后执行，避免死亡加载链）
window.onload = function() {
  try {
    // 1. 日期输入框变更联动（修改日期自动更新星期/编号/预览）
    const dateInput = document.getElementById('date');
    if (dateInput) {
      dateInput.addEventListener('change', () => {
        syncFormData();
        updatePreview();
      });
    }
    // 2. 妄念「其他」选项联动初始化（勾选后显示输入框）
    const wangnianOther = document.querySelector('input[name="xinchuan_wangnian"][value="其他"]');
    if (wangnianOther) {
      wangnianOther.addEventListener('change', () => {
        const otherInput = document.getElementById('xinchuan_wangnian_other');
        if (otherInput) {
          otherInput.style.display = wangnianOther.checked ? 'block' : 'none';
          syncFormData();
          updatePreview();
        }
      });
    }
    // 3. 初始同步数据+渲染预览（页面加载完成即显示最新数据）
    syncFormData();
    updatePreview();
    console.log('[核心交互] 初始化完成，表单联动功能已启用');
  } catch (error) {
    console.error('[核心交互] 页面初始化失败：', error.message);
  }
};