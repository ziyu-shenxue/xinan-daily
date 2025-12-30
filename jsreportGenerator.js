/**
 * 报告生成与导出核心功能（v1.0）
 * 核心功能：1. 实时预览同步；2. 多格式导出（PDF/PNG/JSON）；3. 草稿保存/读取；4. 日报数据校验
 * 依赖规范：依赖外部CDN（html2canvas/jspdf），与index.html中预览区、操作按钮完全联动，遵循主色#2E7D32视觉规范
 * 部署适配：兼容GitHub Pages环境，文件命名规范，数据字段与CSV/Excel无缝对接
 */
// 报告配置常量（草稿存储键名）
const REPORT_CONFIG = { STORAGE_KEY: 'report_draft_v1' };

// 全局配置常量
const REPORT_CONFIG = {
  // 导出文件命名前缀
  FILE_PREFIX: "心安工程日报",
  // PDF配置（A4尺寸，单位mm）
  PDF_CONFIG: {
    format: "a4",
    unit: "mm",
    orientation: "portrait",
    margin: [15, 15, 15, 15]
  },
  // 图片导出配置
  IMAGE_CONFIG: {
    scale: 2, // 高清缩放比例
    quality: 0.95 // 图片质量
  },
  // 必选字段配置（提交/导出前校验）
  REQUIRED_FIELDS: [
    "date", "core_direction", "summary_feeling"
  ],
  // 本地存储键名
  STORAGE_KEY: "xinan_daily_report_draft",
  // 日报编号生成规则：年份后两位+月份+日期+3位序号（如251229001）
  REPORT_ID_PREFIX: () => {
    const today = new Date();
    const year = today.getFullYear().toString().slice(2);
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }
};

/**
 * 实时生成预览内容（与index.html右侧预览区同步）
 */
function generateLivePreview() {
  const previewContainer = document.getElementById('live_preview');
  if (!previewContainer) {
    console.warn('⚠️ 预览区DOM节点缺失：#live_preview');
    return;
  }
  // 采集所有表单数据
  const formData = collectFormData();

  // 生成预览HTML结构
  const previewHtml = `
    <div class="preview-report" style="font-family: 微软雅黑, 思源黑体; line-height: 1.6; color: #333333;">
      <!-- 标题区 -->
      <div style="text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #2E7D32;">
        <h1 style="margin: 0; font-size: 18px; color: #2E7D32;">${REPORT_CONFIG.FILE_PREFIX}</h1>
        <div style="margin-top: 8px; font-size: 14px; color: #666666;">
          日期：${formData.date || '未填写'} | 星期：${formData.weekday || '未填写'} | 编号：${formData.report_id || '自动生成'}
        </div>
        <div style="margin-top: 4px; font-size: 14px; color: #666666;">
          核心修习方向：${formData.core_direction || '未选择'} | 天气：${formData.weather || '未填写'}
        </div>
      </div>

      <!-- 圣学心传模块 -->
      <div style="margin-bottom: 15px;">
        <h2 style="font-size: 16px; color: #2E7D32; margin: 0 0 8px 0; border-left: 3px solid #2E7D32; padding-left: 8px;">
          一、《中华圣学心传》先天智慧体悟
        </h2>
        <div style="padding-left: 11px; font-size: 14px;">
          <p style="margin: 4px 0;"><strong>今日箴言：</strong>${formData.xinchuan_proverb || '未填写'}</p>
          <p style="margin: 4px 0;"><strong>日常应用场景：</strong>${formData.xinchuan_scene || '未填写'}</p>
          <p style="margin: 4px 0;"><strong>八维定位：</strong>${formData.xinchuan_eight || '未选择'}</p>
          <p style="margin: 4px 0;"><strong>六序进度：</strong>${formData.xinchuan_six || '未选择'}</p>
          <p style="margin: 4px 0;"><strong>能量感知：</strong>${formData.xinchuan_energy || '5'}分 | <strong>妄念类型：</strong>${formData.xinchuan_wangnian || '未选择'}</p>
          <p style="margin: 4px 0;"><strong>格除次数：</strong>${formData.xinchuan_count || '0'}次</p>
        </div>
      </div>

      <!-- 圣学心践模块 -->
      <div style="margin-bottom: 15px;">
        <h2 style="font-size: 16px; color: #2E7D32; margin: 0 0 8px 0; border-left: 3px solid #2E7D32; padding-left: 8px;">
          二、《中华圣学心践论》十目践行记录
        </h2>
        <div style="padding-left: 11px; font-size: 14px;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
            <thead>
              <tr style="background-color: #F5F5F5;">
                <<th style="border: 1px solid #CCCCCC; padding: 6px; text-align: center; font-size: 12px;">践行项目</</th>
                <<th style="border: 1px solid #CCCCCC; padding: 6px; text-align: center; font-size: 12px;">状态</</th>
                <<th style="border: 1px solid #CCCCCC; padding: 6px; text-align: center; font-size: 12px;">备注</</th>
              </tr>
            </thead>
            <tbody>
              ${formData.xinjian_ten_items.map((item, index) => `
                <tr>
                  <td style="border: 1px solid #CCCCCC; padding: 6px; font-size: 12px;">${['格念', '正心', '修身', '处事', '接物', '齐家', '济世', '一贯', '成性', '化民'][index]}</td>
                  <td style="border: 1px solid #CCCCCC; padding: 6px; text-align: center; font-size: 12px;">${item.status || '未选择'}</td>
                  <td style="border: 1px solid #CCCCCC; padding: 6px; font-size: 12px;">${item.remark || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <p style="margin: 4px 0;"><strong>焊缝能量密度：</strong>${formData.weld_density || '5'}分（十目践行完成率：${formData.xinjian_completion_rate || '0'}%）</p>
        </div>
      </div>

      <!-- 道德经五维模块 -->
      <div style="margin-bottom: 15px;">
        <h2 style="font-size: 16px; color: #2E7D32; margin: 0 0 8px 0; border-left: 3px solid #2E7D32; padding-left: 8px;">
          三、《道德经・五维生命智慧体系探索》
        </h2>
        <div style="padding-left: 11px; font-size: 14px;">
          <p style="margin: 4px 0;"><strong>对应书籍章节：</strong>${formData.daodejing_chapter || '未选择'}</p>
          <p style="margin: 4px 0;"><strong>治神时长：</strong>${formData.wuwei_zhishen_time || '0'}分钟 | <strong>HRV数值：</strong>${formData.wuwei_hrv || '未填写'}</p>
          <p style="margin: 4px 0;"><strong>神聚度：</strong>${formData.wuwei_shenju || '5'}分 | <strong>情绪稳定度：</strong>${formData.wuwei_emotion || '5'}分</p>
          <p style="margin: 4px 0;"><strong>睡眠时长：</strong>${formData.wuwei_sleep || '0'}小时 | <strong>互动满意度：</strong>${formData.wuwei_interaction || '5'}分</p>
        </div>
      </div>

      <!-- 总结与规划模块 -->
      <div style="margin-bottom: 15px;">
        <h2 style="font-size: 16px; color: #2E7D32; margin: 0 0 8px 0; border-left: 3px solid #2E7D32; padding-left: 8px;">
          四、总结与明日规划
        </h2>
        <div style="padding-left: 11px; font-size: 14px;">
          <p style="margin: 4px 0;"><strong>今日核心感悟：</strong>${formData.summary_feeling || '未填写'}</p>
          <p style="margin: 4px 0;"><strong>数据亮点：</strong>${formData.summary_highlight || '未填写'}</p>
          <p style="margin: 4px 0;"><strong>明日重点-圣学心传：</strong>${formData.tomorrow_xinchuan || '未选择'}</p>
          <p style="margin: 4px 0;"><strong>明日重点-圣学心践：</strong>${formData.tomorrow_xinjian || '未选择'}</p>
          <p style="margin: 4px 0;"><strong>明日重点-五维：</strong>${formData.tomorrow_wuwei || '未选择'}</p>
        </div>
      </div>

      <!-- 底部标注 -->
      <div style="text-align: right; font-size: 12px; color: #666666; margin-top: 20px; padding-top: 10px; border-top: 1px solid #E0E0E0;">
        生成时间：${new Date().toLocaleString()} | 系统版本：v1.0
      </div>
    </div>
  `;

  // 渲染到预览区
  previewContainer.innerHTML = previewHtml;
}

/**
 * 采集所有表单数据（标准化字段，适配导出/保存）
 * @returns {Object} 标准化表单数据
 */
function collectFormData() {
  // 基础信息
  const date = document.getElementById('date')?.value || '';
  const weekday = document.getElementById('weekday')?.value || '';
  const reportId = generateReportId();
  const coreDirection = Array.from(document.getElementById('core_direction')?.selectedOptions || []).map(o => o.value).join('、') || '';
  const weather = document.getElementById('weather')?.value || '';

  // 圣学心传数据
  const xinchuanProverb = document.getElementById('xinchuan_proverb')?.value || '';
  const xinchuanScene = document.getElementById('xinchuan_scene')?.value || '';
  const xinchuanEight = document.getElementById('xinchuan_eight')?.value || '';
  const xinchuanSix = Array.from(document.getElementById('xinchuan_six')?.selectedOptions || []).map(o => o.value).join('、') || '';
  const xinchuanEnergy = document.getElementById('xinchuan_energy_value')?.value || '5';
  const xinchuanWangnian = document.getElementById('xinchuan_wangnian')?.value || '';
  const xinchuanWangnianOther = document.getElementById('xinchuan_wangnian_other')?.value || '';
  const xinchuanCount = document.getElementById('xinchuan_count')?.value || '0';

  // 圣学心践十目数据
  const tenItems = ["xinjian_1", "xinjian_2", "xinjian_3", "xinjian_4", "xinjian_5", "xinjian_6", "xinjian_7", "xinjian_8", "xinjian_9", "xinjian_10"];
  const xinchuanTenItems = tenItems.map((itemId, index) => {
    const status = document.querySelector(`input[name="${itemId}"]:checked`)?.value || '';
    const remark = document.getElementById(`remark_${index + 1}`)?.value || '';
    return { status, remark };
  });
  const practiceCount = xinchuanTenItems.filter(item => item.status === '践行').length;
  const xinjianCompletionRate = Math.round((practiceCount / 10) * 100);
  const weldDensity = document.getElementById('weld_density_value')?.value || '5';

  // 道德经五维数据
  const daodejingChapter = document.getElementById('daodejing_chapter')?.value || '';
  const wuweiZhishenTime = document.getElementById('wuwei_zhishen_time')?.value || '';
  const wuweiHrv = document.getElementById('wuwei_hrv')?.value || '';
  const wuweiShenju = document.getElementById('shenju_value')?.value || '5';
  const wuweiEmotion = document.getElementById('emotion_value')?.value || '5';
  const wuweiSleep = document.getElementById('wuwei_sleep')?.value || '';
  const wuweiInteraction = document.getElementById('interaction_value')?.value || '5';

  // 总结与规划数据
  const summaryFeeling = document.getElementById('summary_feeling')?.value || '';
  const summaryHighlight = document.getElementById('summary_highlight')?.value || '';
  const tomorrowXinchuan = document.getElementById('tomorrow_xinchuan')?.value || '';
  const tomorrowXinjian = document.getElementById('tomorrow_xinjian')?.value || '';
  const tomorrowWuwei = document.getElementById('tomorrow_wuwei')?.value || '';

  return {
    date,
    weekday,
    report_id: reportId,
    core_direction: coreDirection,
    weather,
    xinchuan_proverb: xinchuanProverb,
    xinchuan_scene: xinchuanScene,
    xinchuan_eight: xinchuanEight,
    xinchuan_six: xinchuanSix,
    xinchuan_energy: xinchuanEnergy,
    xinchuan_wangnian: xinchuanWangnian === '其他' ? xinchuanWangnianOther : xinchuanWangnian,
    xinchuan_count: xinchuanCount,
    xinjian_ten_items: xinchuanTenItems,
    xinjian_completion_rate: xinjianCompletionRate,
    weld_density: weldDensity,
    daodejing_chapter: daodejingChapter,
    wuwei_zhishen_time: wuweiZhishenTime,
    wuwei_hrv: wuweiHrv,
    wuwei_shenju: wuweiShenju,
    wuwei_emotion: wuweiEmotion,
    wuwei_sleep: wuweiSleep,
    wuwei_interaction: wuweiInteraction,
    summary_feeling: summaryFeeling,
    summary_highlight: summaryHighlight,
    tomorrow_xinchuan: tomorrowXinchuan,
    tomorrow_xinjian: tomorrowXinjian,
    tomorrow_wuwei: tomorrowWuwei
  };
}

/**
 * 生成唯一日报编号（年份后两位+月份+日期+3位序号）
 * @returns {string} 日报编号（如251229001）
 */
function generateReportId() {
  const prefix = REPORT_CONFIG.REPORT_ID_PREFIX();
  const reports = JSON.parse(localStorage.getItem(REPORT_CONFIG.STORAGE_KEY) || '[]');
  const todayReports = reports.filter(report => report.report_id.startsWith(prefix));
  const serialNumber = String(todayReports.length + 1).padStart(3, '0');
  return `${prefix}${serialNumber}`;
}

/**
 * 导出PDF文件（基于预览区内容）
 */
async function exportPDF() {
  // 校验依赖
  if (typeof html2canvas === 'undefined' || typeof jspdf === 'undefined') {
    showExportHint('❌ PDF导出依赖加载失败，请刷新页面重试', true);
    return;
  }

  // 校验必填字段
  if (!validateRequiredFields()) {
    return;
  }

  showExportHint('📤 正在生成PDF文件...');

  try {
    const previewContainer = document.getElementById('live_preview');
    const formData = collectFormData();
    const fileName = `${REPORT_CONFIG.FILE_PREFIX}_${formData.report_id}.pdf`;

    // 生成预览区截图（高清）
    const canvas = await html2canvas(previewContainer, {
      scale: REPORT_CONFIG.IMAGE_CONFIG.scale,
      useCORS: true,
      logging: false
    });

    // 初始化PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF(REPORT_CONFIG.PDF_CONFIG);
    const imgData = canvas.toDataURL('image/jpeg', REPORT_CONFIG.IMAGE_CONFIG.quality);
    const imgWidth = 210 - 30; // A4宽度 - 左右边距
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // 添加图片到PDF
    pdf.addImage(imgData, 'JPEG', 15, 15, imgWidth, imgHeight);

    // 下载PDF
    pdf.save(fileName);
    showExportHint(`✅ PDF文件导出成功：${fileName}`);
  } catch (error) {
    console.error('PDF导出失败：', error);
    showExportHint('❌ PDF导出失败，请检查网络连接或重试', true);
  }
}

/**
 * 导出PNG图片（基于预览区内容）
 */
async function exportPNG() {
  // 校验依赖
  if (typeof html2canvas === 'undefined') {
    showExportHint('❌ 图片导出依赖加载失败，请刷新页面重试', true);
    return;
  }

  // 校验必填字段
  if (!validateRequiredFields()) {
    return;
  }

  showExportHint('📤 正在生成图片文件...');

  try {
    const previewContainer = document.getElementById('live_preview');
    const formData = collectFormData();
    const fileName = `${REPORT_CONFIG.FILE_PREFIX}_${formData.report_id}.png`;

    // 生成高清截图
    const canvas = await html2canvas(previewContainer, {
      scale: REPORT_CONFIG.IMAGE_CONFIG.scale,
      useCORS: true,
      logging: false
    });

    // 创建下载链接
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png', REPORT_CONFIG.IMAGE_CONFIG.quality);
    link.download = fileName;
    link.click();

    showExportHint(`✅ PNG图片导出成功：${fileName}`);
  } catch (error) {
    console.error('PNG导出失败：', error);
    showExportHint('❌ 图片导出失败，请检查网络连接或重试', true);
  }
}

/**
 * 导出JSON数据（完整表单数据，便于备份/导入）
 */
function exportJSON() {
  // 校验必填字段
  if (!validateRequiredFields()) {
    return;
  }

  showExportHint('📤 正在生成JSON数据...');

  try {
    const formData = collectFormData();
    const fileName = `${REPORT_CONFIG.FILE_PREFIX}_${formData.report_id}.json`;
    const jsonStr = JSON.stringify(formData, null, 2);

    // 创建下载链接
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    // 释放URL对象
    URL.revokeObjectURL(link.href);
    showExportHint(`✅ JSON数据导出成功：${fileName}`);
  } catch (error) {
    console.error('JSON导出失败：', error);
    showExportHint('❌ JSON导出失败，请重试', true);
  }
}

/**
 * 保存草稿（本地存储，支持自动恢复）
 */
function saveDraft() {
  try {
    const formData = collectFormData();
    const existingDrafts = JSON.parse(localStorage.getItem(REPORT_CONFIG.STORAGE_KEY) || '[]');

    // 去重：替换同编号草稿
    const updatedDrafts = existingDrafts.filter(draft => draft.report_id !== formData.report_id);
    updatedDrafts.push(formData);

    // 保存到本地存储
    localStorage.setItem(REPORT_CONFIG.STORAGE_KEY, JSON.stringify(updatedDrafts));
    showExportHint('✅ 草稿已成功保存，下次打开自动恢复');

    // 标记模块完成状态
    updateModuleCompleteStatus();
  } catch (error) {
    console.error('保存草稿失败：', error);
    showExportHint('❌ 草稿保存失败，请检查浏览器存储权限', true);
  }
}

/**
 * 读取草稿（页面加载时自动调用）
 */
function loadDraft() {
  try {
    const existingDrafts = JSON.parse(localStorage.getItem(REPORT_CONFIG.STORAGE_KEY) || '[]');
    if (existingDrafts.length === 0) return;

    // 获取最新草稿（按日期排序）
    const latestDraft = existingDrafts.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    if (!latestDraft) return;

    // 填充基础信息
    document.getElementById('date')?.setValue(latestDraft.date);
    document.getElementById('weekday')?.setValue(latestDraft.weekday);
    document.getElementById('report_id')?.setValue(latestDraft.report_id);
    document.getElementById('weather')?.setValue(latestDraft.weather);

    // 填充核心修习方向（多选）
    const coreDirection = document.getElementById('core_direction');
    if (coreDirection) {
      Array.from(coreDirection.options).forEach(option => {
        option.selected = latestDraft.core_direction.split('、').includes(option.value);
      });
      updateDirectionTags(); // 同步标签显示
    }

    // 填充圣学心传数据
    document.getElementById('xinchuan_proverb')?.setValue(latestDraft.xinchuan_proverb);
    document.getElementById('xinchuan_scene')?.setValue(latestDraft.xinchuan_scene);
    document.getElementById('xinchuan_eight')?.setValue(latestDraft.xinchuan_eight);
    
    // 填充六序进度（多选）
    const xinchuanSix = document.getElementById('xinchuan_six');
    if (xinchuanSix) {
      Array.from(xinchuanSix.options).forEach(option => {
        option.selected = latestDraft.xinchuan_six.split('、').includes(option.value);
      });
      updateSixTags(); // 同步标签显示
    }

    document.getElementById('xinchuan_energy_range')?.setValue(latestDraft.xinchuan_energy);
    document.getElementById('xinchuan_energy_value')?.setValue(latestDraft.xinchuan_energy);
    document.getElementById('xinchuan_wangnian')?.setValue(latestDraft.xinchuan_wangnian);
    document.getElementById('xinchuan_count')?.setValue(latestDraft.xinchuan_count);

    // 填充圣学心践十目数据
    const tenItems = ["xinjian_1", "xinjian_2", "xinjian_3", "xinjian_4", "xinjian_5", "xinjian_6", "xinjian_7", "xinjian_8", "xinjian_9", "xinjian_10"];
    tenItems.forEach((itemId, index) => {
      const status = latestDraft.xinjian_ten_items[index]?.status || '';
      const remark = latestDraft.xinjian_ten_items[index]?.remark || '';
      const radio = document.querySelector(`input[name="${itemId}"][value="${status}"]`);
      if (radio) radio.checked = true;
      if (status === '部分践行') {
        document.getElementById(`remark_${index + 1}`)?.setValue(remark);
        document.getElementById(`remark_${index + 1}`)?.classList.add('visible');
      }
    });

    document.getElementById('weld_density_range')?.setValue(latestDraft.weld_density);
    document.getElementById('weld_density_value')?.setValue(latestDraft.weld_density);

    // 填充道德经五维数据
    document.getElementById('chapter_search')?.setValue(latestDraft.daodejing_chapter);
    document.getElementById('daodejing_chapter')?.setValue(latestDraft.daodejing_chapter);
    document.getElementById('wuwei_zhishen_time')?.setValue(latestDraft.wuwei_zhishen_time);
    document.getElementById('wuwei_hrv')?.setValue(latestDraft.wuwei_hrv);
    document.getElementById('shenju_range')?.setValue(latestDraft.wuwei_shenju);
    document.getElementById('shenju_value')?.setValue(latestDraft.wuwei_shenju);
    document.getElementById('emotion_range')?.setValue(latestDraft.wuwei_emotion);
    document.getElementById('emotion_value')?.setValue(latestDraft.wuwei_emotion);
    document.getElementById('wuwei_sleep')?.setValue(latestDraft.wuwei_sleep);
    document.getElementById('interaction_range')?.setValue(latestDraft.wuwei_interaction);
    document.getElementById('interaction_value')?.setValue(latestDraft.wuwei_interaction);

    // 填充总结与规划数据
    document.getElementById('summary_feeling')?.setValue(latestDraft.summary_feeling);
    document.getElementById('summary_highlight')?.setValue(latestDraft.summary_highlight);
    document.getElementById('tomorrow_xinchuan')?.setValue(latestDraft.tomorrow_xinchuan);
    document.getElementById('tomorrow_xinjian')?.setValue(latestDraft.tomorrow_xinjian);
    document.getElementById('tomorrow_wuwei')?.setValue(latestDraft.tomorrow_wuwei);

    // 同步预览区
    generateLivePreview();
    showExportHint(`✅ 已恢复最新草稿（${latestDraft.date}）`);
  } catch (error) {
    console.error('读取草稿失败：', error);
    showExportHint('❌ 草稿读取失败，已加载新表单', true);
  }
}

/**
 * 校验必填字段（提交/导出前调用）
 * @returns {boolean} 校验通过返回true，否则false
 */
function validateRequiredFields() {
  const formData = collectFormData();
  const missingFields = [];

  // 校验必填字段
  REPORT_CONFIG.REQUIRED_FIELDS.forEach(field => {
    if (!formData[field] || formData[field].trim() === '') {
      const fieldMap = {
        'date': '日期',
        'core_direction': '核心修习方向',
        'summary_feeling': '今日核心感悟'
      };
      missingFields.push(fieldMap[field] || field);
    }
  });

  // 校验感悟长度
  if (formData.summary_feeling && formData.summary_feeling.length < 15) {
    missingFields.push('今日核心感悟（需至少15字）');
  }

  // 校验结果处理
  if (missingFields.length > 0) {
    showExportHint(`❌ 导出失败，请补充必填项：${missingFields.join('、')}`, true);
    return false;
  }

  return true;
}

/**
 * 显示导出/保存提示信息
 * @param {string} message - 提示信息
 * @param {boolean} isError - 是否为错误提示（红色）
 */
function showExportHint(message, isError = false) {
  // 检查是否存在提示容器，不存在则创建
  let hintContainer = document.getElementById('export-hint-container');
  if (!hintContainer) {
    hintContainer = document.createElement('div');
    hintContainer.id = 'export-hint-container';
    hintContainer.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      padding: 8px 16px;
      border-radius: 4px;
      background-color: #2E7D32;
      color: white;
      font-size: 14px;
      z-index: 9999;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(hintContainer);
  }

  // 设置提示样式和内容
  hintContainer.textContent = message;
  hintContainer.style.backgroundColor = isError ? '#D32F2F' : '#2E7D32';
  hintContainer.style.opacity = '1';

  // 3秒后自动隐藏
  setTimeout(() => {
    hintContainer.style.opacity = '0';
  }, 3000);
}

/**
 * 更新模块完成状态（基于表单数据）
 */
function updateModuleCompleteStatus() {
  const formData = collectFormData();
  
  // 模块1：基础信息（日期+核心方向）
  updateModuleCompleteStatus(1, !!formData.date && !!formData.core_direction);
  
  // 模块2：圣学心传（箴言+场景）
  updateModuleCompleteStatus(2, !!formData.xinchuan_proverb && !!formData.xinchuan_scene);
  
  // 模块3：圣学心践（至少1项践行）
  const hasPractice = formData.xinjian_ten_items.some(item => item.status === '践行');
  updateModuleCompleteStatus(3, hasPractice);
  
  // 模块4：道德经五维（章节+治神时长）
  updateModuleCompleteStatus(4, !!formData.daodejing_chapter && !!formData.wuwei_zhishen_time);
  
  // 模块5：总结规划（核心感悟）
  updateModuleCompleteStatus(5, !!formData.summary_feeling && formData.summary_feeling.length >= 15);
}

/**
 * 提交同步（保存数据+生成日报）
 */
function submitSync() {
  // 校验必填字段
  if (!validateRequiredFields()) {
    return;
  }

  try {
    // 保存完整报告到本地存储
    const formData = collectFormData();
    const existingReports = JSON.parse(localStorage.getItem('xinan_daily_reports') || '[]');
    existingReports.push(formData);
    localStorage.setItem('xinan_daily_reports', JSON.stringify(existingReports));

    // 保存草稿
    saveDraft();

    // 生成预览
    generateLivePreview();

    showExportHint('✅ 提交成功！日报已生成并同步保存');
  } catch (error) {
    console.error('提交失败：', error);
    showExportHint('❌ 提交失败，请检查浏览器存储权限', true);
  }
}

/**
 * 页面加载时初始化
 */
window.addEventListener('DOMContentLoaded', () => {
  // 自动读取草稿
  loadDraft();

  // 初始化实时预览
  setTimeout(() => {
    generateLivePreview();
  }, 500);

  // 绑定表单输入事件，实时同步预览
  document.querySelectorAll('.core-component').forEach(component => {
    component.addEventListener('input', generateLivePreview);
    component.addEventListener('change', generateLivePreview);
  });

  // 暴露全局函数（供index.html调用）
  window.generateLivePreview = generateLivePreview;
  window.exportPDF = exportPDF;
  window.exportPNG = exportPNG;
  window.exportJSON = exportJSON;
  window.saveDraft = saveDraft;
  window.submitSync = submitSync;

  console.log('✅ 报告生成与导出组件初始化完成：支持PDF/PNG/JSON导出、草稿保存/读取');
});