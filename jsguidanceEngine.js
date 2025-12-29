// 智能辅导核心模块
let shenxueDB = null;

// 初始化时加载数据库
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/shenxueDB.json');
        shenxueDB = await response.json();
    } catch (e) {
        console.warn('圣学数据库加载失败:', e);
    }
});

function getGuidance(question, userData = {}) {
    if (!shenxueDB || !question) {
        return [{原文: '数据库加载中...', 建议: '请稍后再试'}];
    }
    
    // 提取关键词
    const keywords = question.match(/[\u4e00-\u9fa5]+/g) || [];
    
    let results = [];
    
    // 遍历三本书
    Object.keys(shenxueDB).forEach(bookName => {
        shenxueDB[bookName].forEach(item => {
            // 计算匹配度
            const matchScore = item.keywords.filter(k => 
                keywords.some(q => q.includes(k) || k.includes(q))
            ).length;
            
            if (matchScore > 0) {
                // 个性化建议模板填充
                let advice = item.指导模板;
                if (userData.心传能量) advice = advice.replace('%s', userData.心传能量);
                if (userData.心传格除次数) advice = advice.replace('%d', userData.心传格除次数);
                
                results.push({
                    书名: bookName,
                    章节: item.章节 || item.十目 || item.章,
                    原文: item.原文,
                    建议: advice,
                    匹配度: matchScore
                });
            }
        });
    });
    
    // 按匹配度排序并返回前3条
    return results.sort((a, b) => b.匹配度 - a.匹配度).slice(0, 3);
}