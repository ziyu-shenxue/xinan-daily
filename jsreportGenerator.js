// 日报生成与导出核心模块
let reportData = {};

// 自动初始化
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
    
    // 生成编号
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

    // 收集十目数据
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
            </div>
            
            <div class="section">
                <h3>四、核心感悟</h3>
                <p>${data.今日感悟 || '未填写'}</p>
            </div>
        </div>
    `;
    document.getElementById('live_preview').innerHTML = html;
}

// 实时监听所有输入
document.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('input', generateLivePreview);
});

function saveReport() {
    const data = collectFormData();
    
    // 保存到本地存储
    const reports = JSON.parse(localStorage.getItem('xinan_reports') || '[]');
    reports.push(data);
    localStorage.setItem('xinan_reports', JSON.stringify(reports));
    
    // 生成可下载的JSON
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `日报_${data.日期}.json`;
    a.click();
    
    alert('✅ 日报已保存！');
}

function saveDraft() {
    const data = collectFormData();
    localStorage.setItem('xinan_draft', JSON.stringify(data));
    alert('💾 草稿已保存（刷新后自动恢复）');
}

function loadDraft() {
    const draft = localStorage.getItem('xinan_draft');
    if (draft) {
        const data = JSON.parse(draft);
        // 恢复表单数据
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
    setInterval(saveDraft, 30000); // 每30秒自动保存草稿
}

async function exportPDF() {
    const element = document.getElementById('live_preview');
    if (!element.innerHTML.trim()) {
        alert('请先填写并生成预览');
        return;
    }
    
    const canvas = await html2canvas(element, {scale: 2});
    const imgData = canvas.toDataURL('image/png');
    
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save(`心安日报_${collectFormData().日期}.pdf`);
}

async function exportPNG() {
    const element = document.getElementById('live_preview');
    if (!element.innerHTML.trim()) {
        alert('请先填写并生成预览');
        return;
    }
    
    const canvas = await html2canvas(element, {scale: 2});
    const link = document.createElement('a');
    link.download = `心安日报_${collectFormData().日期}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

// 配置文件
const CONFIG = {
    ten_items: ["格念", "正心", "修身", "处事", "接物", "齐家", "济世", "一贯", "成性", "化民"]
};