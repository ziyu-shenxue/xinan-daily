/**
 * 道德经五维选项联想逻辑（v1.0）
 * 功能：81章关键词模糊联想、章节选择联动提示、重点字段标记、核心修习方向同步
 * 依赖：DAODEJING_81_CHAPTERS（来自jsguidanceEngine.js）、shenxueDB.json核心数据
 * 遵循规范：主色#2E7D32，兼容Chrome/Edge浏览器，支持响应式布局
 */
class DaodejingFiveDimension {
  constructor() {
    // 绑定DOM元素（与index.html中ID严格对应）
    this.chapterSearch = document.getElementById('chapter_search');
    this.chapterResults = document.getElementById('chapter_results');
    this.coreDirection = document.getElementById('core_direction');
    this.module4Content = document.getElementById('module4-content');
    this.daodejingChapter = document.getElementById('daodejing_chapter');
    
    // 初始化校验：确保核心组件和数据存在
    this.validateDependencies();
    
    // 初始化功能
    this.bindCoreDirectionChange(); // 核心修习方向联动模块4显示
    this.bindSearchInputEvents(); // 搜索框交互事件
    this.initChapterList(); // 初始化章节列表
  }

  /**
   * 校验依赖（DOM元素+核心数据）
   */
  validateDependencies() {
    const requiredElements = [this.chapterSearch, this.chapterResults, this.coreDirection, this.module4Content];
    const missingElements = requiredElements.filter(el => !el);
    
    if (missingElements.length > 0) {
      console.error('五维联想组件初始化失败：缺少核心DOM元素');
      return;
    }
    
    if (!window.DAODEJING_81_CHAPTERS || window.DAODEJING_81_CHAPTERS.length === 0) {
      console.warn('五维联想组件警告：未加载道德经81章数据，将使用默认章节列表');
      this.initDefaultChapters();
    }
  }

  /**
   * 初始化默认81章数据（兼容数据加载失败场景）
   */
  initDefaultChapters() {
    window.DAODEJING_81_CHAPTERS = [
      // 治神篇（1-20章）
      { id: "ddj001", title: "第1章：【道体分离之惑+命名依赖之困】·体道章", volume: "治神篇", coreGoal: "破除命名依赖，体悟道体本真", emotionFocus: "化解对事物标签化的执念", keyField: "治神时长", keywords: ["道体", "命名", "依赖"] },
      { id: "ddj002", title: "第2章：【二元对立之碍+完美主义之偏】·养身章", volume: "治神篇", coreGoal: "化解二元对立思维，接纳不完美", emotionFocus: "缓解完美主义带来的焦虑", keyField: "治神时长", keywords: ["二元", "对立", "完美"] },
      { id: "ddj003", title: "第3章：【欲望过亢之扰+攀比焦虑之困】·安民章", volume: "治神篇", coreGoal: "节制过度欲望，摆脱攀比焦虑", emotionFocus: "平复因攀比产生的失衡心态", keyField: "治神时长", keywords: ["欲望", "攀比", "焦虑"] },
      // 治心篇（21-40章，节选核心章节）
      { id: "ddj021", title: "第21章：【情志失察之感+情感表达之碍】·虚心章", volume: "治心篇", coreGoal: "提升情志觉察能力，顺畅表达情感", emotionFocus: "化解因情感压抑带来的内心冲突", keyField: "情绪稳定度", keywords: ["情志", "情感", "表达"] },
      { id: "ddj022", title: "第22章：【挫折创伤之扰+失败恐惧之困】·益谦章", volume: "治心篇", coreGoal: "接纳挫折失败，培养谦卑之心", emotionFocus: "缓解因失败恐惧带来的逃避心态", keyField: "情绪稳定度", keywords: ["挫折", "失败", "恐惧"] },
      // 治身篇（41-60章，节选核心章节）
      { id: "ddj041", title: "第41章：【成长焦虑之惑+大器晚成之困】·同异章", volume: "治身篇", coreGoal: "接纳成长节奏，相信大器晚成", emotionFocus: "缓解因成长焦虑带来的浮躁感", keyField: "睡眠时长", keywords: ["成长", "焦虑", "大器晚成"] },
      { id: "ddj044", title: "第44章：【名利执念+价值物化之困】·立戒章", volume: "治身篇", coreGoal: "放下名利执念，摆脱价值物化的困境", emotionFocus: "缓解因名利追逐带来的焦虑感", keyField: "睡眠时长", keywords: ["名利", "价值", "物化"] },
      // 治性篇（61-80章，节选核心章节）
      { id: "ddj061", title: "第61章：【谦卑障碍之惑+傲慢自负之困】·谦德章", volume: "治性篇", coreGoal: "培养谦卑品质，克服傲慢自负", emotionFocus: "缓解因傲慢带来的人际关系紧张", keyField: "神聚度", keywords: ["谦卑", "傲慢", "自负"] },
      { id: "ddj068", title: "第68章：【不争之德之惑+好胜心过强之困】·配天章", volume: "治性篇", coreGoal: "培养不争之德，克服好胜之心", emotionFocus: "缓解因好胜带来的焦虑感", keyField: "神聚度", keywords: ["不争", "好胜", "焦虑"] },
      // 治世篇（81章）
      { id: "ddj081", title: "第81章：【生命圆满之惑+价值混乱之困】·显质章", volume: "治世篇", coreGoal: "明晰生命价值，追求生命圆满", emotionFocus: "缓解因价值混乱带来的迷茫感", keyField: "互动满意度", keywords: ["圆满", "价值", "混乱"] }
      // 完整81章数据已在jsguidanceEngine.js中定义，此处仅保留核心章节用于兼容
    ];
  }

  /**
   * 绑定核心修习方向变更事件（同步模块4显示/隐藏）
   */
  bindCoreDirectionChange() {
    this.coreDirection.addEventListener('change', () => {
      const selectedOptions = Array.from(this.coreDirection.selectedOptions).map(o => o.value);
      const isFiveDimensionSelected = selectedOptions.includes('道德经五维');
      
      // 显示/隐藏模块4
      if (isFiveDimensionSelected) {
        this.module4Content.classList.remove('collapsed');
        this.chapterSearch.focus(); // 自动聚焦搜索框
      } else {
        this.module4Content.classList.add('collapsed');
      }
    });
  }

  /**
   * 绑定搜索框交互事件（输入联想、聚焦/失焦显示结果）
   */
  bindSearchInputEvents() {
    // 输入关键词触发联想
    this.chapterSearch.addEventListener('input', () => {
      const keyword = this.chapterSearch.value.trim();
      this.enhanceSearchChapter(keyword);
    });

    // 聚焦显示所有章节
    this.chapterSearch.addEventListener('focus', () => {
      const keyword = this.chapterSearch.value.trim();
      this.enhanceSearchChapter(keyword);
      this.chapterResults.classList.add('visible');
    });

    // 失焦延迟隐藏结果（确保点击联想项有效）
    this.chapterSearch.addEventListener('blur', () => {
      setTimeout(() => {
        this.chapterResults.classList.remove('visible');
      }, 200);
    });
  }

  /**
   * 初始化章节列表（页面加载时显示前10章）
   */
  initChapterList() {
    const recentChapters = window.DAODEJING_81_CHAPTERS.slice(0, 10);
    this.renderChapterResults(recentChapters);
  }

  /**
   * 强化关键词联想（支持多关键词、模糊匹配、篇章筛选）
   * 适配根目录部署，增加数据校验与空值处理
   * @param {string} keyword - 输入关键词
   */
enhanceSearchChapter(keyword) {
    // 补充DOM节点校验，避免报错
    const chapterSearch = document.getElementById('chapter_search');
    const chapterResults = document.getElementById('chapter_results');
    if (!chapterSearch || !chapterResults) {
      console.warn('[道德经联想] 缺失核心DOM节点：#chapter_search 或 #chapter_results');
      return;
    }
    // 根目录下数据校验：提示文件位置
    if (!window.DAODEJING_81_CHAPTERS) {
      console.warn('[道德经联想] 全局数据未加载：window.DAODEJING_81_CHAPTERS');
      alert('篇章联想功能异常！请确认道德经数据文件已放在根目录并正常加载');
      return;
    }
    // 空数据兜底
    if (!Array.isArray(window.DAODEJING_81_CHAPTERS) || window.DAODEJING_81_CHAPTERS.length === 0) {
      alert('道德经篇章数据为空，请检查根目录下的数据文件');
      return;
    }

    let filteredChapters = [...window.DAODEJING_81_CHAPTERS]; // 深拷贝避免原数据污染
    
    // 关键词模糊匹配（标题、关键词、篇章、核心目标）
    if (keyword && keyword.trim() !== '') {
      const lowerKeyword = keyword.trim().toLowerCase();
      filteredChapters = window.DAODEJING_81_CHAPTERS.filter(chapter => {
        // 防错处理：兼容字段缺失的情况
        const title = chapter.title ? chapter.title.toLowerCase() : '';
        const keywords = Array.isArray(chapter.keywords) ? chapter.keywords.join(' ').toLowerCase() : '';
        const volume = chapter.volume ? chapter.volume.toLowerCase() : '';
        const coreGoal = chapter.coreGoal ? chapter.coreGoal.toLowerCase() : '';
        const allText = `${title} ${keywords} ${volume} ${coreGoal}`;
        return allText.includes(lowerKeyword);
      });
    }

    // 渲染联想结果（空结果提示）
    if (filteredChapters.length === 0 && keyword) {
      this.renderChapterResults([{ title: '无匹配结果', keywords: ['未找到相关篇章'], volume: '提示', coreGoal: `关键词「${keyword}」无匹配` }]);
    } else {
      this.renderChapterResults(filteredChapters);
    }
  }

  /**
   * 渲染联想结果列表（优化样式和交互体验）
   * @param {Array} chapters - 匹配的章节数组
   */
  renderChapterResults(chapters) {
    this.chapterResults.innerHTML = '';

    // 无匹配结果提示
    if (chapters.length === 0) {
      this.chapterResults.innerHTML = '<div class="search-result-item">未找到匹配章节，请尝试关键词：焦虑、攀比、孤独、名利等</div>';
      return;
    }

    // 渲染章节列表（按篇章分组显示）
    const chaptersByVolume = this.groupChaptersByVolume(chapters);
    Object.keys(chaptersByVolume).forEach(volume => {
      // 篇章标题
      const volumeItem = document.createElement('div');
      volumeItem.style.padding = '8px 12px';
      volumeItem.style.fontWeight = 'bold';
      volumeItem.style.color = '#2E7D32';
      volumeItem.textContent = volume;
      this.chapterResults.appendChild(volumeItem);

      // 该篇章下的章节
      chaptersByVolume[volume].forEach(chapter => {
        const chapterItem = document.createElement('div');
        chapterItem.className = 'search-result-item';
        chapterItem.innerHTML = `
          <strong>${chapter.title}</strong>
          <div style="font-size: 11px; color: #666; margin-top: 4px;">
            核心：${chapter.coreGoal.substring(0, 25)}${chapter.coreGoal.length > 25 ? '...' : ''}
          </div>
        `;
        // 点击章节选中并填充
        chapterItem.onclick = () => this.selectChapter(chapter);
        this.chapterResults.appendChild(chapterItem);
      });
    });
  }

  /**
   * 按篇章分组章节（治神篇/治心篇/治身篇/治性篇/治世篇）
   * @param {Array} chapters - 章节数组
   * @returns {Object} 按篇章分组的章节对象（异常时返回空对象）
   */
groupChaptersByVolume(chapters) {
  // 1. 入参类型校验
  if (!Array.isArray(chapters)) {
    console.warn(`[章节分组] 传入的章节数据非数组：${typeof chapters}`);
    return {};
  }
  // 2. 过滤无效章节 + 去重
  const validChapters = chapters.filter(chapter => {
    const isValid = chapter && chapter.volume && chapter.chapterId; // 假设章节有唯一ID
    if (!isValid) console.warn(`[章节分组] 无效章节数据：${JSON.stringify(chapter)}`);
    return isValid;
  }).reduce((unique, chapter) => {
    if (!unique.some(item => item.chapterId === chapter.chapterId)) {
      unique.push(chapter);
    }
    return unique;
  }, []);
  // 3. 分组逻辑
  return validChapters.reduce((grouped, chapter) => {
    grouped[chapter.volume] = grouped[chapter.volume] || [];
    grouped[chapter.volume].push(chapter);
    return grouped;
  }, {});
}

  /**
   * 选择章节后联动更新（填充输入框+提示信息+重点字段标记）
   * @param {Object} chapter - 选中的章节对象
   */
  selectChapter(chapter) {
    // 填充章节信息
    this.chapterSearch.value = chapter.title;
    this.daodejingChapter.value = chapter.title;

    // 更新提示信息（与index.html中提示ID对应）
    document.getElementById('chapter-hint').textContent = `已选择：${chapter.volume} - ${chapter.title} | 核心修习：${chapter.coreGoal}`;
    document.getElementById('shenju-hint').textContent = `10分=满分聚度 | 本章核心修习目标：${chapter.coreGoal}`;
    document.getElementById('emotion-hint').textContent = `10分=满分稳定 | 本章情志调和重点：${chapter.emotionFocus}`;
    document.getElementById('zhishen-hint').textContent = `支持小数点（例：15.5） | 本章重点字段：${chapter.keyField}`;

    // 标记重点字段（边框标红，与index.html中输入框ID对应）
    this.markKeyField(chapter.keyField);

    // 触发预览更新
    this.triggerPreviewUpdate();

    // 隐藏结果列表
    this.chapterResults.classList.remove('visible');

    // 标记模块4完成状态
    this.updateModuleCompleteStatus(4, true);
  }

  /**
   * 标记章节重点字段（边框标红提示）
   * @param {string} keyField - 重点字段名称（治神时长/情绪稳定度/睡眠时长/神聚度/互动满意度）
   */
markKeyField(keyField) {
    // 所有重点字段输入框ID映射
    const fieldIdMap = {
      "治神时长": "wuwei_zhishen_time",
      "情绪稳定度": "emotion_value",
      "睡眠时长": "wuwei_sleep",
      "神聚度": "shenju_value",
      "互动满意度": "interaction_value"
    };

    // 重置所有字段样式
    Object.values(fieldIdMap).forEach(id => {
      const field = document.getElementById(id);
      if (field) field.style.borderColor = '#CCCCCC';
    });

    // 标记当前重点字段
    const targetFieldId = fieldIdMap[keyField];
    if (targetFieldId) {
      const targetField = document.getElementById(targetFieldId);
      if (targetField) {
        targetField.style.borderColor = "#1976D2";
        targetField.style.boxShadow = "0 0 0 2px rgba(25, 118, 210, 0.1)";
        // 自动聚焦重点字段
        targetField.focus();
      }
    }
  }

  /**
   * 触发实时预览更新（关联jsreportGenerator.js中的预览函数）
   */
  triggerPreviewUpdate() {
    if (window.generateLivePreview && typeof window.generateLivePreview === 'function') {
      window.generateLivePreview();
    }
  }

  /**
   * 更新模块完成状态（绿色对勾）
   * @param {number} moduleIndex - 模块序号（1-5）
   * @param {boolean} isComplete - 是否完成
   */
updateModuleCompleteStatus(moduleIndex, isComplete) {
  // 1. 入参合法性校验
  const validIndex = Number(moduleIndex);
  if (!Number.isInteger(validIndex) || validIndex < 1 || validIndex > 5) {
    console.warn(`[模块完成状态] 无效的模块序号：${moduleIndex}，仅支持1-5`);
    return;
  }
  // 2. DOM 选择 + 兜底
  const completeMark = document.getElementById(`module${validIndex}-complete`);
  if (!completeMark) {
    console.warn(`[模块完成状态] 未找到模块${validIndex}的完成标记DOM元素`);
    return;
  }
  // 3. 状态更新 + 样式兼容
  completeMark.textContent = isComplete ? '✅' : '';
  if (isComplete) {
    completeMark.classList.add('module-complete-active'); // 新增CSS类控制样式
  } else {
    completeMark.classList.remove('module-complete-active');
  }
}

// 页面DOM加载完成后初始化（确保依赖脚本已加载）
window.addEventListener('DOMContentLoaded', () => {
  // 延迟初始化，确保jsguidanceEngine.js中的DAODEJING_81_CHAPTERS已定义
  setTimeout(() => {
    new DaodejingFiveDimension();
    console.log('道德经五维选项联想组件初始化完成：支持关键词联想、章节联动、重点字段标记');
  }, 300);
});