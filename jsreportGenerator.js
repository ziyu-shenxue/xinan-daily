// 日报生成与导出核心模块
let reportData = {};
// 配置常量（十目列表）
const CONFIG = {
    ten_items: ["格念", "正心", "修身", "处事", "接物", "齐家", "济世", "一贯", "成性", "化民"]
};

// 页面加载完成后初始化
window.onload = function() {
    initBasicInfo();
    loadDraft();
    startAutoSave();
    // 绑定输入事件，实时更新预览
    bindInputEvents();
};

/**
 * 初始化基础信息（日期、星期、日报编号）
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
    
    // 生成日报编号（001、002...）
    try {
        const reports = JSON.parse(localStorage.getItem('xinan_reports') || '[]');
        const nextId = String(reports.length + 1).padStart(3, '0');
        document.getElementById('report_id').value = nextId;
    } catch (e) {
        document.getElementById('report_id').value = '001';
        console.warn('生成日报编号失败:', e);
    }
}

/**
 * 收集表单数据
 * @returns {object} 完整的日报数据
 */
function collectFormData() {
    try {
        const data = {
            日期: document.getElementById('date').value,
            星期: document.getElementById('weekday').value,
            日报编号: document.getElementById('report_id').value,
            核心修习方向: Array.from(document.getElementById('core_direction').selectedOptions).map(o => o.value).join(','),
            天气: document.getElementById('weather').value || '未填写',
            心传箴言: document.getElementById('xinchuan_proverb').value || '未填写',
            心传场景: document.getElementById('xinchuan_scene').value || '未填写',
            心传八维: document.getElementById('xinchuan_eight').value || '未填写',
            心传六序: Array.from(document.getElementById('xinchuan_six').selectedOptions).map(o => o.value).join(',') || '未选择',
            心传能量: document.getElementById('xinchuan_energy').value || '0',
            心传妄念: document.getElementById('xinchuan_wangnian').value || '无',
            心传格除次数: document.getElementById('xinchuan_count').value || '0',
            十目践行: {},
            五维数据: {},
            今日感悟: document.getElementById('summary_feeling').value || '未填写',
            数据亮点: document.getElementById('summary_highlight').value || '未填写',
            明日重点心传: document.getElementById('plan_xinchuan').value || '未填写',
            明日重点心践: document.getElementById('plan_xinjian').value || '未填写',
            生成时间: new Date().toISOString()
        };
        
        // 收集十目践行数据
        CONFIG.ten_items.forEach((item, i) => {
            const selectEl = document.getElementById(`xinjian_${i+1}`);
            data.十目践行[item] = selectEl ? selectEl.value : '未践行';
        });
        
        // 收集五维量化数据
        data.五维数据 = {
            治神时长: document.getElementById('wudao_1').value || '0',
            HRV: document.getElementById('wudao_hrv').value || '0',
            神聚度: document.getElementById('wudao_2').value || '0',
            情绪稳定度: document.getElementById('wudao_3').value || '0',
            睡眠时长: document.getElementById('wudao_4').value || '0',
            互动满意度: document.getElementById('wudao_5').value || '0'
        };
        
        return data;
    } catch (e) {
        console.error('收集表单数据失败:', e);
        alert('数据收集失败，请刷新页面重试');
        return {};
    }
}

/**
 * 生成实时预览
 */
function generateLivePreview() {
    const data = collectFormData();
    if (Object.keys(data).length === 0) return;
    
    const html = `
        <div class="report-template">
            <h1>中华圣学修身《心安工程》日报</h1>
            <h2>${data.日期}（${data.星期}） 编号：${data.日报编号}</h2>
            
            <div class="section">
                <h3>一、基础信息</h3>
                <p><strong>核心修习方向：</strong>${data.核心修习方向}</p>
                <p><strong>天气：</strong>${data.天气}</p>
            </div>
            
            <div class="section">
                <h3>二、《心传》体悟</h3>
                <p><strong>箴言：</strong>${data.心传箴言}</p>
                <p><strong>应用场景：</strong>${data.心传场景}</p>
                <p><strong>心传八维：</strong>${data.心传八维}</p>
                <p><strong>心传六序：</strong>${data.心传六序}</p>
                <p><strong>能量感知：</strong>${data.心传能量}分</p>
                <p><strong>今日妄念：</strong>${data.心传妄念}</p>
                <p><strong>格除次数：</strong>${data.心传格除次数}次</p>
            </div>
            
            <div class="section">
                <h3>三、《心践》十目</h3>
                <ul style="list-style-type: disc; padding-left: 20px;">
                    ${CONFIG.ten_items.map(item => 
                        `<li>${item}：${data.十目践行[item] || '未践行'}</li>`
                    ).join('')}
                </ul>
            </div>
            
            <div class="section">
                <h3>四、《五维》量化</h3>
                <p>治神时长：${data.五维数据.治神时长}分钟 | HRV：${data.五维数据.HRV}</p>
                <p>神聚度：${data.五维数据.神聚度}分 | 情绪稳定度：${data.五维数据.情绪稳定度}分</p>
                <p>睡眠时长：${data.五维数据.睡眠时长}小时 | 互动满意度：${data.五维数据.互动满意度}分</p>
            </div>
            
            <div class="section">
                <h3>五、核心感悟</h3>
                <p>${data.今日感悟}</p>
                <p><strong>数据亮点：</strong>${data.数据亮点}</p>
            </div>
            
            <div class="section">
                <h3>六、明日计划</h3>
                <p><strong>重点心传：</strong>${data.明日重点心传}</p>
                <p><strong>重点心践：</strong>${data.明日重点心践}</p>
            </div>
            
            <div class="section" style="margin-top: 20px; font-size: 11px; color: #666; text-align: right;">
                <p>生成时间：${new Date(data.生成时间).toLocaleString()}</p>
            </div>
        </div>
    `;
    
    const previewContainer = document.getElementById('live_preview');
    if (previewContainer) {
        previewContainer.innerHTML = html;
    }
}

/**
 * 绑定所有输入框的input事件，实时更新预览
 */
function bindInputEvents() {
    const inputElements = document.querySelectorAll('input, textarea, select');
    inputElements.forEach(el => {
        el.addEventListener('input', generateLivePreview);
    });
}

/**
 * 保存日报（JSON格式）
 */
function saveReport() {
    const data = collectFormData();
    if (Object.keys(data).length === 0) return;
    
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
        
        // 微信浏览器提示
        if (/MicroMessenger/i.test(navigator.userAgent)) {
            alert('✅ 日报已生成！\n文件已下载到手机\n请在"文件管理→下载"中查找');
        } else {
            alert('✅ 日报已保存并下载！');
        }
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
        console.log('草稿已保存');
    } catch (e) {
        try {
            sessionStorage.setItem('xinan_draft', JSON.stringify(data));
            console.log('草稿已保存（当前会话有效）');
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
        // 优先加载localStorage草稿
        let draft = localStorage.getItem('xinan_draft');
        if (!draft) {
            draft = sessionStorage.getItem('xinan_draft');
            if (!draft) return;
        }
        
        const data = JSON.parse(draft);
        if (!data) return;
        
        // 填充基础信息
        if (data.日期) document.getElementById('date').value = data.日期;
        if (data.星期) document.getElementById('weekday').value = data.星期;
        if (data.日报编号) document.getElementById('report_id').value = data.日报编号;
        if (data.天气) document.getElementById('weather').value = data.天气;
        
        // 填充心传相关
        if (data.心传箴言) document.getElementById('xinchuan_proverb').value = data.心传箴言;
        if (data.心传场景) document.getElementById('xinchuan_scene').value = data.心传场景;
        if (data.心传八维) document.getElementById('xinchuan_eight').value = data.心传八维;
        if (data.心传能量) document.getElementById('xinchuan_energy').value = data.心传能量;
        if (data.心传妄念) document.getElementById('xinchuan_wangnian').value = data.心传妄念;
        if (data.心传格除次数) document.getElementById('xinchuan_count').value = data.心传格除次数;
        
        // 填充核心修习方向（多选）
        if (data.核心修习方向) {
            const directions = data.核心修习方向.split(',');
            Array.from(document.getElementById('core_direction').options).forEach(option => {
                option.selected = directions.includes(option.value);
            });
        }
        
        // 填充心传六序（多选）
        if (data.心传六序) {
            const sixOrders = data.心传六序.split(',');
            Array.from(document.getElementById('xinchuan_six').options).forEach(option => {
                option.selected = sixOrders.includes(option.value);
            });
        }
        
        // 填充十目践行
        if (data.十目践行) {
            CONFIG.ten_items.forEach((item, i) => {
                const selectEl = document.getElementById(`xinjian_${i+1}`);
                if (selectEl && data.十目践行[item]) {
                    selectEl.value = data.十目践行[item];
                }
            });
        }
        
        // 填充五维数据
        if (data.五维数据) {
            document.getElementById('wudao_1').value = data.五维数据.治神时长 || '';
            document.getElementById('wudao_hrv').value = data.五维数据.HRV || '';
            document.getElementById('wudao_2').value = data.五维数据.神聚度 || '';
            document.getElementById('wudao_3').value = data.五维数据.情绪稳定度 || '';
            document.getElementById('wudao_4').value = data.五维数据.睡眠时长 || '';
            document.getElementById('wudao_5').value = data.五维数据.互动满意度 || '';
        }
        
        // 填充总结与计划
        if (data.今日感悟) document.getElementById('summary_feeling').value = data.今日感悟;
        if (data.数据亮点) document.getElementById('summary_highlight').value = data.数据亮点;
        if (data.明日重点心传) document.getElementById('plan_xinchuan').value = data.明日重点心传;
        if (data.明日重点心践) document.getElementById('plan_xinjian').value = data.明日重点心践;
        
        // 生成预览
        generateLivePreview();
        alert('💾 已加载上次保存的草稿');
    } catch (e) {
        console.warn('加载草稿失败:', e);
    }
}

/**
 * 启动自动保存（每30秒一次）
 */
function startAutoSave() {
    setInterval(() => {
        saveDraft();
    }, 30000); // 30秒自动保存一次
}

/**
 * 导出PDF
 */
async function exportPDF() {
    const element = document.getElementById('live_preview');
    if (!element || !element.innerHTML.trim()) {
        alert('请先填写表单并生成预览');
        return;
    }
    
    if (typeof html2canvas === 'undefined') {
        alert('图片生成库加载失败，请刷新页面重试');
        return;
    }
    
    try {
        // 生成canvas图片
        const canvas = await html2canvas(element, { 
            scale: 2, 
            useCORS: true,
            logging: false
        });
        const imgData = canvas.toDataURL('image/png');
        
        // 生成PDF
        if (typeof window.jspdf !== 'undefined') {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 190; // PDF内容宽度
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // 等比例缩放高度
            
            // 添加图片到PDF
            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            const data = collectFormData();
            pdf.save(`心安日报_${data.日期}_${data.日报编号}.pdf`);
        } else {
            // 无jspdf时导出PNG
            alert('PDF生成库未加载，将导出图片格式');
            exportPNG();
        }
    } catch (e) {
        alert('PDF生成失败: ' + e.message);
        console.error('PDF导出失败:', e);
    }
}

/**
 * 导出PNG图片
 */
async function exportPNG() {
    const element = document.getElementById('live_preview');
    if (!element || !element.innerHTML.trim()) {
        alert('请先填写表单并生成预览');
        return;
    }
    
    if (typeof html2canvas === 'undefined') {
        alert('图片生成库加载失败，请刷新页面重试');
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

/**
 * 下载图片
 * @param {string} dataUrl - 图片DataURL
 * @param {string} filename - 文件名
 */
function downloadImage(dataUrl, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
}