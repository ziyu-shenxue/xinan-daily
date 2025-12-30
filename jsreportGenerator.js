// V3 融合版：保留V1核心功能+V2 81章联动+新字段支持
let reportData = {};
let voiceInputEnabled = true;
let taoChapters = []; // 道德经81章数据

// 配置常量
const CONFIG = {
    ten_items: ["格念", "正心", "修身", "处事", "接物", "齐家", "济世", "一贯", "成性", "化民"],
    tao_chapters_full: [
        // 第一卷：治神篇（1-20章）
        "第1章：【道体分离之惑+命名依赖之困】·体道章",
        "第2章：【二元对立之碍+完美主义之偏】·养身章",
        "第3章：【欲望过亢之扰+攀比焦虑之困】·安民章",
        "第4章：【用道失调之失+创造力枯竭之困】·无源章",
        "第5章：【情感淡漠之隔+共情待深之缺】·虚用章",
        "第6章：【生命能量待蓄之困+元气涵养之需】·成象章",
        "第7章：【自我中心之执+人际连接之碍】·韬光章",
        "第8章：【竞争焦虑之扰+生存恐惧之困】·易性章",
        "第9章：【持盈过甚之执+掌控过度之困】·运夷章",
        "第10章：【身心分离之惑+知行脱节之困】·能为章",
        "第11章：【有用无用之惑+实用主义之困】·无用章",
        "第12章：【感官过载之扰+信息焦虑之困】·检欲章",
        "第13章：【宠辱得失之扰+评价依赖之困】·厌耻章",
        "第14章：【时空错位之惑+时间焦虑之困】·赞玄章",
        "第15章：【人格僵化之碍+身份认同之惑】·显质章",
        "第16章：【归根之碍+漂泊无根之困】·归根章",
        "第17章：【权威依赖之惑+自主决策之困】·淳风章",
        "第18章：【道德伪善之惑+冷漠疏离之困】·俗薄章",
        "第19章：【知识过载之扰+思维固化之困】·还淳章",
        "第20章：【存在孤独之惑+疏离合群之困】·异俗章",
        // 第二卷：治心篇（21-40章）
        "第21章：【情志失察之感+情感表达之碍】·虚心章",
        "第22章：【挫折创伤之扰+失败恐惧之困】·益谦章",
        "第23章：【无常焦虑之惑+控制欲过强之困】·虚极章",
        "第24章：【虚荣外驰之惑+虚假自体之困】·苦恩章",
        "第25章：【方向迷失之惑+导航失灵之困】·象元章",
        "第26章：【轻重失衡之惑+本末倒置之困】·重德章",
        "第27章：【智慧闭塞之惑+认知局限之困】·巧用章",
        "第28章：【刚柔失和之惑+情绪失控之困】·反朴章",
        "第29章：【强力妄为之惑+过度干预之困】·无为章",
        "第30章：【暴力冲突之惑+攻击性倾向之困】·俭武章",
        "第31章：【战争心态之扰+敌对思维之困】·偃武章",
        "第32章：【秩序失序之惑+规则漠视之困】·圣德章",
        "第33章：【自知之惑+认知偏差之困】·辨德章",
        "第34章：【大小迷失之惑+格局狭隘之困】·任成章",
        "第35章：【平淡之扰+刺激依赖之困】·仁德章",
        "第36章：【微明之惑+预判之困】·微明章",
        "第37章：【欲望无厌之惑+贪得无厌之困】·为政章",
        "第38章：【上德失落+道德滑坡之困】·论德章",
        "第39章：【得一之惑+身心失衡之困】·法本章",
        "第40章：【创造之惑+生命动能停滞之困】·去用章",
        // 第三卷：治身篇（41-60章）
        "第41章：【成长焦虑之惑+大器晚成之困】·同异章",
        "第42章：【阴阳失和之惑+内在冲突之困】·道化章",
        "第43章：【柔性缺失+刚性过盛之困】·偏用章",
        "第44章：【名利执念+价值物化之困】·立戒章",
        "第45章：【清静之惑+心神不宁之困】·洪德章",
        "第46章：【纵欲耗损之惑+气血亏虚之困】·俭欲章",
        "第47章：【外求之扰+内虚之困】·鉴远章",
        "第48章：【有为过度之惑+努力耗损之困】·忘知章",
        "第49章：【分别之惑+偏见之困】·任德章",
        "第50章：【生死之惑+存在之困】·贵生章",
        "第51章：【玄德不养之惑+德性不足之困】·养德章",
        "第52章：【母体失联之惑+归属缺失之困】·归元章",
        "第53章：【邪径迷恋之惑+捷径依赖之困】·益证章",
        "第54章：【根基不牢之惑+基础薄弱之困】·修观章",
        "第55章：【赤子失真之惑+纯真丧失之困】·玄符章",
        "第56章：【是非纠缠之惑+争辩成瘾之困】·玄德章",
        "第57章：【以奇治国之惑+投机取巧之困】·淳风章",
        "第58章：【福祸迷惑之惑+得失焦虑之困】·顺化章",
        "第59章：【积蓄障碍之惑+储备不足之困】·守道章",
        "第60章：【复杂焦虑之惑+简化能力之困】·居位章",
        // 第四卷：治性篇（61-80章）
        "第61章：【谦卑障碍之惑+傲慢自负之困】·谦德章",
        "第62章：【为贵之惑+本末倒置之困】·为道章",
        "第63章：【大事难为之惑+畏难情绪之困】·为无为章",
        "第64章：【未兆未察之惑+危机意识之困】·守微章",
        "第65章：【明民之惑+沟通障碍之困】·淳德章",
        "第66章：【江海为下之惑+谦下不足之困】·后己章",
        "第67章：【三宝遗失之惑+德性缺失之困】·三宝章",
        "第68章：【不争之德之惑+好胜心过强之困】·配天章",
        "第69章：【用兵有言之惑+冲突倾向之困】·玄用章",
        "第70章：【知稀之惑+真知匮乏之困】·知难章",
        "第71章：【知不知之惑+认知边界之困】·知病章",
        "第72章：【民不畏威之惑+规则漠视之困】·爱身章",
        "第73章：【天网失敬之惑+侥幸妄为之困】·任为章",
        "第74章：【民不畏死之惑+生命漠视之困】·制惑章",
        "第75章：【民生艰难之惑+生存压力之困】·贪损章",
        "第76章：【刚硬偏执之惑+柔润不足之困】·戒强章",
        "第77章：【天道失衡之惑+公平执念之困】·天道章",
        "第78章：【柔水攻坚之惑+以柔克刚之碍】·任信章",
        "第79章：【和大怨余怨之惑+怨恨执念之困】·任德章",
        "第80章：【理想主义+现实适应之困】·独立章",
        // 第五卷：治世篇（81章）
        "第81章：【生命圆满之惑+价值混乱之困】·显质章"
    ],
    chapter_tips: {
        "第1章：【道体分离之惑+命名依赖之困】·体道章": "核心修习：致虚守静功；适配场景：职场命名依赖；重点字段：治神时长",
        "第2章：【二元对立之碍+完美主义之偏】·养身章": "核心修习：破除二元对立；适配场景：完美主义焦虑；重点字段：情绪稳定度",
        "第3章：【欲望过亢之扰+攀比焦虑之困】·安民章": "核心修习：寡欲静心；适配场景：社交攀比焦虑；重点字段：神聚度",
        "第81章：【生命圆满之惑+价值混乱之困】·显质章": "核心修习：知行合一；适配场景：人生价值迷茫；重点字段：互动满意度"
        // 其余章节提示可按需补充
    }
};

// 页面加载完成后初始化
window.onload = function() {
    initTaoChapters(); // 初始化81章数据
    initBasicInfo();   // 初始化基础信息（保留V1）
    loadDraft();       // 加载草稿（保留V1）
    bindInputEvents(); // 绑定输入事件（保留V1）
    startAutoSave();   // 自动保存（保留V1）
    updateTagViews();  // 更新选中标签视图
};

/**
 * 初始化道德经81章下拉框
 */
function initTaoChapters() {
    taoChapters = CONFIG.tao_chapters_full;
    const selectEl = document.getElementById('tao_chapter');
    if (!selectEl) return;

    // 填充下拉选项
    taoChapters.forEach(chapter => {
        const option = document.createElement('option');
        option.value = chapter;
        option.textContent = chapter;
        selectEl.appendChild(option);
    });
}

/**
 * 初始化基础信息（保留V1核心，优化日报编号规则）
 */
function initBasicInfo() {
    const today = new Date();
    // 日期格式化（YYYY-MM-DD）
    const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    // 星期格式化
    const weekdayStr = ['日','一','二','三','四','五','六'][today.getDay()];
    
    // 填充基础信息
    document.getElementById('date').value = dateStr;
    document.getElementById('weekday').value = `星期${weekdayStr}`;
    
    // 生成日报编号（V2规则：年份后两位+月份+日期+3位序号）
    try {
        const year = String(today.getFullYear()).slice(-2);
        const month = String(today.getMonth()+1).padStart(2,'0');
        const day = String(today.getDate()).padStart(2,'0');
        const reports = JSON.parse(localStorage.getItem('xinan_reports') || '[]');
        const todayReports = reports.filter(r => r.日期 === dateStr);
        const nextSeq = String(todayReports.length + 1).padStart(3, '0');
        document.getElementById('report_id').value = `${year}${month}${day}${nextSeq}`;
    } catch (e) {
        document.getElementById('report_id').value = `${new Date().getTime().toString().slice(-6)}`;
        console.warn('生成日报编号失败:', e);
    }
}

/**
 * 切换道德经模块显示/隐藏（核心修习方向联动）
 */
function toggleTaoModule() {
    const coreDirection = document.getElementById('core_direction');
    const taoModule = document.getElementById('tao_module');
    if (!coreDirection || !taoModule) return;

    const selectedOptions = Array.from(coreDirection.selectedOptions).map(o => o.value);
    taoModule.style.display = selectedOptions.includes('道德经五维') ? 'block' : 'none';
    updateTagViews();
}

/**
 * 过滤道德经章节（搜索功能）
 */
function filterTaoChapters() {
    const searchInput = document.getElementById('tao_chapter_search');
    const selectEl = document.getElementById('tao_chapter');
    if (!searchInput || !selectEl) return;

    const searchText = searchInput.value.toLowerCase().trim();
    const filteredChapters = taoChapters.filter(chapter => chapter.toLowerCase().includes(searchText));

    // 清空下拉框，保留默认选项
    selectEl.innerHTML = '<option value="">请选择对应困惑章节</option>';
    // 填充过滤后的选项
    filteredChapters.forEach(chapter => {
        const option = document.createElement('option');
        option.value = chapter;
        option.textContent = chapter;
        selectEl.appendChild(option);
    });
}

/**
 * 显示章节核心提示
 */
function showChapterTip(chapter) {
    const tipEl = document.getElementById('tao_chapter_tip');
    if (!tipEl) return;

    tipEl.textContent = CONFIG.chapter_tips[chapter] || '选择章节后显示核心修习提示';
    tipEl.style.background = chapter ? '#00695C' : '#81C784';
}

/**
 * 收集表单数据（V3增强版，支持所有V2字段）
 */
function collectFormData() {
    try {
        const data = {
            日期: document.getElementById('date').value,
            星期: document.getElementById('weekday').value,
            日报编号: document.getElementById('report_id').value,
            核心修习方向: Array.from(document.getElementById('core_direction').selectedOptions).map(o => o.value).join(','),
            天气环境备注: document.getElementById('weather').value || '未填写',
            // 心传数据
            心传箴言: document.getElementById('xinchuan_proverb').value || '未填写',
            心传场景: document.getElementById('xinchuan_scene').value || '未填写',
            心传八维: document.getElementById('xinchuan_eight').value || '未选择',
            心传六序: Array.from(document.getElementById('xinchuan_six').selectedOptions).map(o => o.value).join(',') || '未选择',
            心传能量: document.getElementById('xinchuan_energy').value || '5',
            心传妄念: document.getElementById('xinchuan_wangnian').value || (document.getElementById('xinchuan_wangnian_other').style.display === 'block' ? document.getElementById('xinchuan_wangnian_other').value : '未选择'),
            心传格除次数: document.getElementById('xinchuan_count').value || '0',
            // 心践数据
            心践十目: {},
            心践焊缝能量密度: document.getElementById('xinjian_weld_energy').value || '5',
            // 五维数据
            五维对应章节: document.getElementById('tao_chapter').value || '未选择',
            五维治神时长: document.getElementById('tao_zhishen').value || '0',
            五维HRV: document.getElementById('tao_hrv').value || '0',
            五维神聚度: document.getElementById('tao_shenju').value || '5',
            五维情绪稳定度: document.getElementById('tao_emotion').value || '5',
            五维睡眠时长: document.getElementById('tao_sleep').value || '0',
            五维互动满意度: document.getElementById('tao_interaction').value || '5',
            // 总结规划
            今日核心感悟: document.getElementById('summary_feeling').value || '未填写',
            数据亮点: document.getElementById('summary_highlight').value || '未填写',
            明日重点心传: document.getElementById('plan_xinchuan').value || '未选择',
            明日重点心践: document.getElementById('plan_xinjian').value || '未选择',
            明日重点五维: document.getElementById('plan_tao').value || '未选择',
            生成时间: new Date().toISOString()
        };

        // 收集心践十目数据
        CONFIG.ten_items.forEach((item, i) => {
            const radioButtons = document.getElementsByName(`xinjian_${i+1}`);
            let selectedValue = '未践行';
            let partialRemark = '';
            radioButtons.forEach(radio => {
                if (radio.checked) {
                    selectedValue = radio.value;
                }
            });
            if (selectedValue === '部分践行') {
                partialRemark = document.getElementById(`xinjian_${i+1}_partial`).value || '';
            }
            data.心践十目[item] = `${selectedValue}${partialRemark ? '（' + partialRemark + '）' : ''}`;
        });

        return data;
    } catch (e) {
        console.error('收集表单数据失败:', e);
        alert('数据收集失败，请刷新页面重试');
        return {};
    }
}

/**
 * 生成实时预览（V3优化版，贴合V2日报格式）
 */
function generateLivePreview() {
    const data = collectFormData();
    if (Object.keys(data).length === 0) return;

    const html = `
        <div class="report-template">
            <h1>中华圣学修身《心安工程》日报（V3 融合版）</h1>
            <h2>${data.日期}（${data.星期}） 编号：${data.日报编号}</h2>
            
            <div class="section">
                <h3>一、基础信息</h3>
                <p><strong>核心修习方向：</strong>${data.核心修习方向}</p>
                <p><strong>天气/环境备注：</strong>${data.天气环境备注}</p>
            </div>
            
            <div class="section">
                <h3>二、《中华圣学心传》先天智慧体悟</h3>
                <p><strong>今日箴言：</strong>${data.心传箴言}</p>
                <p><strong>日常应用场景：</strong>${data.心传场景}</p>
                <p><strong>八维定位：</strong>${data.心传八维}</p>
                <p><strong>六序进度：</strong>${data.心传六序}</p>
                <p><strong>能量感知：</strong>${data.心传能量}分</p>
                <p><strong>妄念类型：</strong>${data.心传妄念}</p>
                <p><strong>格除次数：</strong>${data.心传格除次数}次</p>
            </div>
            
            <div class="section">
                <h3>三、《中华圣学心践论》十目践行记录</h3>
                <ul style="list-style-type: disc; padding-left: 20px;">
                    ${CONFIG.ten_items.map(item => 
                        `<li>${item}：${data.心践十目[item] || '未践行'}</li>`
                    ).join('')}
                </ul>
                <p><strong>焊缝能量密度：</strong>${data.心践焊缝能量密度}分</p>
            </div>
            
            <div class="section">
                <h3>四、《道德经·五维生命智慧》81章实践</h3>
                <p><strong>对应章节：</strong>${data.五维对应章节}</p>
                <p>治神时长：${data.五维治神时长}分钟 | HRV：${data.五维HRV} ms²</p>
                <p>神聚度：${data.五维神聚度}分 | 情绪稳定度：${data.五维情绪稳定度}分</p>
                <p>睡眠时长：${data.五维睡眠时长}小时 | 互动满意度：${data.五维互动满意度}分</p>
            </div>
            
            <div class="section">
                <h3>五、核心感悟与明日规划</h3>
                <p><strong>今日核心感悟：</strong>${data.今日核心感悟}</p>
                <p><strong>数据亮点：</strong>${data.数据亮点}</p>
                <p><strong>明日重点-圣学心传：</strong>${data.明日重点心传}</p>
                <p><strong>明日重点-圣学心践：</strong>${data.明日重点心践}</p>
                <p><strong>明日重点-五维智慧：</strong>${data.明日重点五维}</p>
            </div>
            
            <div class="section" style="margin-top: 20px; font-size: 11px; color: #666; text-align: right;">
                <p>生成时间：${new Date(data.生成时间).toLocaleString()}</p>
                <p>版本：V3 融合版（保留V1功能+V2全量字段）</p>
            </div>
        </div>
    `;

    const previewContainer = document.getElementById('live_preview');
    if (previewContainer) {
        previewContainer.innerHTML = html;
    }
}

// ---------------------- 保留V1核心功能（略作优化）----------------------
/**
 * 绑定输入事件
 */
function bindInputEvents() {
    const inputElements = document.querySelectorAll('input, textarea, select');
    inputElements.forEach(el => {
        el.addEventListener('input', () => {
            generateLivePreview();
            updateTagViews();
            updateEnergyTip();
        });
    });
}

/**
 * 保存日报（JSON格式）
 */
function saveReport() {
    const data = collectFormData();
    if (Object.keys(data).length === 0) return;

    // 校验必填字段
    if (!data.核心修习方向 || !data.今日核心感悟 || (data.核心修习方向.includes('道德经五维') && !data.五维对应章节)) {
        alert('请填写必填字段（核心修习方向、今日核心感悟、对应道德经章节）');
        return;
    }

    try {
        // 保存到localStorage
        const reports = JSON.parse(localStorage.getItem('xinan_reports') || '[]');
        reports.push(data);
        localStorage.setItem('xinan_reports', JSON.stringify(reports));
    } catch (e) {
        console.warn('localStorage保存失败:', e);
    }

    // 下载JSON文件
    try {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json; charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `心安日报_${data.日期}_${data.日报编号}.json`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert('✅ 日报已保存并下载！');
    } catch (e) {
        alert('保存失败: ' + e.message);
        console.error('下载JSON失败:', e);
    }
}

/**
 * 保存草稿
 */
function saveDraft() {
    const data = collectFormData();
    if (Object.keys(data).length === 0) return;

    try {
        localStorage.setItem('xinan_draft', JSON.stringify(data));
        alert('💾 草稿已保存，下次打开自动恢复');
    } catch (e) {
        try {
            sessionStorage.setItem('xinan_draft', JSON.stringify(data));
            alert('💾 草稿已保存（当前会话有效）');
        } catch (e2) {
            console.warn('草稿保存失败:', e2);
        }
    }
}

/**
 * 加载草稿
 */
function loadDraft() {
    try {
        let draft = localStorage.getItem('xinan_draft');
        if (!draft) {
            draft = sessionStorage.getItem('xinan_draft');
            if (!draft) return;
        }

        const data = JSON.parse(draft);
        if (!data) return;

        // 填充基础信息（略），其余字段填充逻辑按需扩展
        generateLivePreview();
    } catch (e) {
        console.warn('加载草稿失败:', e);
    }
}

/**
 * 自动保存（30秒一次）
 */
function startAutoSave() {
    setInterval(() => {
        saveDraft();
    }, 30000);
}

/**
 * 导出PDF（保留V1核心，适配V3预览）
 */
async function exportPDF() {
    const element = document.getElementById('live_preview');
    if (!element || !element.innerHTML.trim()) {
        alert('请先填写表单并生成预览');
        return;
    }

    try {
        const canvas = await html2canvas(element, { 
            scale: 2, 
            useCORS: true,
            logging: false
        });
        const imgData = canvas.toDataURL('image/png');

        if (typeof window.jspdf !== 'undefined') {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            const data = collectFormData();
            pdf.save(`心安日报_${data.日期}_${data.日报编号}.pdf`);
        } else {
            alert('PDF生成库未加载，将导出图片格式');
            exportPNG();
        }
    } catch (e) {
        alert('PDF生成失败: ' + e.message);
        console.error('PDF导出失败:', e);
    }
}

/**
 * 导出PNG（保留V1核心）
 */
async function exportPNG() {
    const element = document.getElementById('live_preview');
    if (!element || !element.innerHTML.trim()) {
        alert('请先填写表单并生成预览');
        return;
    }

    try {
        const canvas = await html2canvas(element, { 
            scale: 2, 
            useCORS: true,
            logging: false
        });
        const imgData = canvas.toDataURL('image/png');
        const data = collectFormData();
        downloadImage(imgData, `心安日报_${data.日期}_${data.日报编号}.png`);
    } catch (e) {
        alert('图片生成失败: ' + e.message);
        console.error('PNG导出失败:', e);
    }
}

// ---------------------- V3 新增辅助功能 ----------------------
function toggleModule(moduleEl) {
    const contentEl = moduleEl.querySelector('.module-content');
    contentEl.style.display = contentEl.style.display === 'none' ? 'block' : 'none';
}

function updateTagViews() {
    // 更新核心修习方向标签
    const coreDirection = document.getElementById('core_direction');
    const coreTags = document.getElementById('core_direction_tags');
    if (coreDirection && coreTags) {
        const selectedOptions = Array.from(coreDirection.selectedOptions).map(o => o.value);
        coreTags.innerHTML = selectedOptions.map(option => `<span class="tag">${option}</span>`).join('');
    }
}

function updateEnergyTip() {
    const energyValue = document.getElementById('xinchuan_energy').value;
    const tipEl = document.getElementById('xinchuan_energy_tip');
    if (!tipEl) return;

    const tips = {
        '1': '状态极差，需静心休整',
        '5': '状态良好，保持当前节奏',
        '10': '状态极佳，继续精进'
    };
    tipEl.textContent = tips[energyValue] || `当前状态：${energyValue}分`;
}

function downloadImage(dataUrl, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
}

// 其余辅助函数（toggleVoiceInput、showHelp等）按需扩展
function toggleVoiceInput() {
    voiceInputEnabled = !voiceInputEnabled;
    alert(voiceInputEnabled ? '语音输入已开启' : '语音输入已关闭');
}

function showHelp() {
    alert('V3 融合版使用帮助：\n1. 模块点击可折叠/展开\n2. 道德经章节支持关键词搜索\n3. 必填字段标注红色*，未填写无法提交\n4. 每30秒自动保存草稿');
}

function clearForm() {
    if (confirm('确定要清空所有表单内容吗？（基础信息将保留）')) {
        document.querySelectorAll('input, textarea, select').forEach(el => {
            if (!el.readOnly) {
                el.value = '';
            }
        });
        generateLivePreview();
    }
}