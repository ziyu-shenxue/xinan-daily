// 日报生成与导出核心模块
let reportData = {};

window.onload = function() {
    initBasicInfo();
    loadDraft();
    startAutoSave();
};

function initBasicInfo() {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    const weekdayStr = ['日','一','二','三','四','五','六'][today.getDay()];
    
    document.getElementById('date').value = dateStr;
    document.getElementById('weekday').value = `星期${weekdayStr}`;
    
    const reports = JSON.parse(localStorage.getItem('xinan_reports') || '[]');
    const nextId = String(reports.length + 1).padStart(3, '0');
    document.getElementById('report_id').value = `00${nextId}`;
}

function collectFormData() {
    const data = {
        日期: document.getElementById('date').value,
        星期: document.getElementById('weekday').value,
        日报编号: document.getElementById('report_id').value,
        核心修习方向: Array.from(document.getElementById('core_direction').selectedOptions).map(o => o.value).join(','),
        天气: document.getElementById('weather').value,
        心传箴言: document.getElementById('xinchuan_proverb').value,
        心传场景: document.getElementById('xinchuan_scene').value,
        心传八维: document.getElementById('xinchuan_eight').value,
        心传六序: Array.from(document.getElementById('xinchuan_six').selectedOptions).map(o => o.value).join(','),
        心传能量: document.getElementById('xinchuan_energy').value,
        心传妄念: document.getElementById('xinchuan_wangnian').value,
        心传格除次数: document.getElementById('xinchuan_count').value,
        十目践行: {},
        五维数据: {},
        今日感悟: document.getElementById('summary_feeling').value,
        数据亮点: document.getElementById('summary_highlight').value,
        明日重点心传: document.getElementById('plan_xinchuan').value,
        明日重点心践: document.getElementById('plan_xinjian').value,
        生成时间: new Date().toISOString()
    };

    CONFIG.ten_items.forEach((item, i) => {
        data.十目践行[item] = document.getElementById(`xinjian_${i+1}`).value;
    });
    data.五维数据 = {
        治神时长: document.getElementById('wudao_1').value,
        HRV: document.getElementById('wudao_hrv').value,
        神聚度: document.getElementById('wudao_2').value,
        情绪稳定度: document.getElementById('wudao_3').value,
        睡眠时长: document.getElementById('wudao_4').value,
        互动满意度: document.getElementById('wudao_5').value
    };

    return data;
}

function generateLivePreview() {
    const data = collectFormData();
    const html = `
        <div class="report-template">
            <h1>中华圣学修身《心安工程》日报</h1>
            <h2>${data.日期}（${data.星期}） 编号：${data.日报编号}</h2>
            
            <div class="section">
                <h3>一、《心传》体悟</h3>
                <p><strong>箴言：</strong>${data.心传箴言 || '未填写'}</p>
                <p><strong>能量感知：</strong>${data.心传能量 || '无'}分</p>
            </div>
            
            <div class="section">
                <h3>二、《心践》十目</h3>
                <ul>
                    ${CONFIG.ten_items.map(item => 
                        `<li>${item}：${data.十目践行[item] || '未践行'}</li>`
                    ).join('')}
                </ul>
            </div>
            
            <div class="section">
                <h3>三、《五维》量化</h3>
                <p>治神时长：${data.五维数据.治神时长}分钟 | HRV：${data.五维数据.HRV}</p>
                <p>神聚度：${data.五维数据.神聚度}分 | 情绪稳定度：${data.五维数据.情绪稳定度}分</p>
                <p>睡眠：${data.五维数据.睡眠时长}小时 | 互动满意度：${data.五维数据.互动满意度}分</p>
            </div>
            
            <div class="section">
                <h3>四、核心感悟</h3>
                <p>${data.今日感悟 || '未填写'}</p>
            </div>
        </div>
    `;
    document.getElementById('live_preview').innerHTML = html;
}

document.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('input', generateLivePreview);
});

function saveReport() {
    const data = collectFormData();
    
    try {
        const reports = JSON.parse(localStorage.getItem('xinan_reports') || '[]');
        reports.push(data);
        localStorage.setItem('xinan_reports', JSON.stringify(reports));
    } catch (e) {
        console.warn('localStorage失败:', e);
    }
    
    try {
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `日报_${data.日期}.json`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        if (/MicroMessenger/i.test(navigator.userAgent)) {
            alert('✅ 日报已生成！\n文件已下载到手机\n请在"文件管理"中查找');
        } else {
            alert('✅ 日报已保存！');
        }
        
        URL.revokeObjectURL(url);
    } catch (e) {
        alert('保存失败: ' + e.message);
    }
}

function saveDraft() {
    const data = collectFormData();
    
    try {
        localStorage.setItem('xinan_draft', JSON.stringify(data));
        alert('💾 草稿已保存（刷新后自动恢复）');
    } catch (e) {
        try {
            sessionStorage.setItem('xinan_draft', JSON.stringify(data));
            alert('💾 草稿已保存（仅当前会话有效）');
        } catch (e2) {
            alert('⚠️ 草稿保存失败，请手动复制内容');
        }
    }
}

function loadDraft() {
    const draft = localStorage.getItem('xinan_draft');
    if (draft) {
        const data = JSON.parse(draft);
        Object.keys(data).forEach(key => {
            const el = document.getElementById(key);
            if (el && data[key]) {
                el.value = data[key];
            }
        });
        generateLivePreview();
    }
}

function startAutoSave() {
    setInterval(saveDraft, 30000);
}

async function exportPDF() {
    const element = document.getElementById('live_preview');
    if (!element.innerHTML.trim()) {
        alert('请先填写并生成预览');
        return;
    }
    
    if (typeof html2canvas === 'undefined') {
        alert('报告生成库加载失败，请刷新页面重试');
        return;
    }
    
    try {
        const canvas = await html2canvas(element, {scale: 2});
        const imgData = canvas.toDataURL('image/png');
        
        if (typeof window.jspdf !== 'undefined') {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            pdf.save(`心安日报_${collectFormData().日期}.pdf`);
        } else {
            downloadImage(imgData, `心安日报_${collectFormData().日期}.png`);
        }
    } catch (e) {
        alert('PDF生成失败: ' + e.message);
    }
}

async function exportPNG() {
    const element = document.getElementById('live_preview');
    if (!element.innerHTML.trim()) {
        alert('请先填写并生成预览');
        return;
    }
    
    if (typeof html2canvas === 'undefined') {
        alert('图片生成库加载失败，请刷新页面重试');
        return;
    }
    
    try {
        const canvas = await html2canvas(element, {scale: 2});
        const imgData = canvas.toDataURL('image/png');
        downloadImage(imgData, `心安日报_${collectFormData().日期}.png`);
    } catch (e) {
        alert('图片生成失败: ' + e.message);
    }
}

function downloadImage(dataUrl, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
}

const CONFIG = {
    ten_items: ["格念", "正心", "修身", "处事", "接物", "齐家", "济世", "一贯", "成性", "化民"]
};