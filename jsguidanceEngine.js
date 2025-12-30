// 智能辅导核心模块
let shenxueDB = null;
// 初始化时加载数据库
window.addEventListener('DOMContentLoaded', async () => {
    try {
        // 优先加载本地JSON文件（需放在data目录下），若失败则使用内置默认数据
        const response = await fetch('data/shenxueDB.json').catch(async () => {
            // 本地文件加载失败时使用内置数据
            return {
                json: () => ({
                    "心传": [
                        {
                            "id": "xc001",
                            "章节": "道维-破妄见真",
                            "原文": "万物衍化本清静，有心无依为真心。",
                            "关键词": ["清静", "破妄", "真心", "工作冲突"],
                            "应用场景": "工作冲突时践行'不争'",
                            "指导模板": "当你感到%s时，默念原文三遍，观察情绪而不评判。"
                        },
                        {
                            "id": "xc002",
                            "章节": "德维-积德显真",
                            "原文": "积善之家必有余庆，积不善之家必有余殃。",
                            "关键词": ["积德", "善", "家庭", "因果"],
                            "应用场景": "家庭关系紧张时",
                            "指导模板": "今日与家人互动%d次，建议以'善'为先，减少辩解。"
                        }
                    ],
                    "心践论": [
                        {
                            "id": "sj001",
                            "十目": "格念",
                            "原文": "吾日三省吾身。",
                            "关键词": ["反省", "妄念", "晨起", "三省"],
                            "应用场景": "每日晨起标记妄念",
                            "指导模板": "今日共标记%d条妄念，建议晚间静坐时逐一反观其来源。"
                        },
                        {
                            "id": "sj002",
                            "十目": "正心",
                            "原文": "心正而后身修，身修而后家齐。",
                            "关键词": ["正心", "不公", "嗔怒", "平和"],
                            "应用场景": "遇不公事保持平和",
                            "指导模板": "遇%s时，先做三次深呼吸，再问'此事会伤害我的'真心'吗？"
                        }
                    ],
                    "道德经": [
                        {
                            "id": "ddj016",
                            "章节": "第十六章",
                            "原文": "致虚极，守静笃。万物并作，吾以观复。",
                            "关键词": ["治神", "HRV", "静坐", "虚静"],
                            "应用场景": "HRV低于50时",
                            "指导模板": "你的HRV为%d，建议%s分钟的4-7-8呼吸法（吸气4秒-屏息7秒-呼气8秒）。"
                        },
                        {
                            "id": "ddj021",
                            "章节": "第二十一章",
                            "原文": "孔德之容，惟道是从。",
                            "关键词": ["治心", "情绪", "孔德", "道"],
                            "应用场景": "情绪波动大时",
                            "指导模板": "情绪稳定度%s分，建议将注意力从'情绪'转向'情绪背后的需求'。"
                        }
                    ]
                })
            };
        });
        shenxueDB = await response.json();
        console.log('圣学数据库加载成功');
    } catch (e) {
        console.warn('圣学数据库加载失败:', e);
        shenxueDB = { "心传": [], "心践论": [], "道德经": [] };
    }
});

/**
 * 获取智能辅导建议
 * @param {string} question - 用户问题/场景描述
 * @param {object} userData - 用户数据（心传能量、格除次数等）
 * @returns {array} 匹配的指导建议
 */
function getGuidance(question, userData = {}) {
    if (!shenxueDB || !question || Object.keys(shenxueDB).length === 0) {
        return [{原文: '数据库加载完成或无匹配内容', 建议: '请尝试输入具体场景（如"工作冲突""情绪波动"）获取指导'}];
    }
    
    // 提取关键词（仅保留中文）
    const keywords = question.match(/[\u4e00-\u9fa5]+/g) || [];
    let results = [];
    
    // 遍历三本书，计算匹配度
    Object.keys(shenxueDB).forEach(bookName => {
        shenxueDB[bookName].forEach(item => {
            // 计算关键词匹配度（双向包含匹配）
            const matchScore = item.keywords.filter(k => 
                keywords.some(q => q.includes(k) || k.includes(q))
            ).length;
            
            if (matchScore > 0) {
                // 个性化建议模板填充（处理%s和%d占位符）
                let advice = item.指导模板;
                // 替换字符串占位符（优先用心传能量，无则用场景描述）
                advice = advice.replace(/%s/g, userData.心传能量 || userData.心传场景 || '不适');
                // 替换数字占位符（优先用心传格除次数，无则用0）
                advice = advice.replace(/%d/g, userData.心传格除次数 || 0);
                
                results.push({
                    书名: bookName,
                    章节: item.章节 || item.十目 || item.章 || '未知章节',
                    原文: item.原文,
                    应用场景: item.应用场景,
                    建议: advice,
                    匹配度: matchScore
                });
            }
        });
    });
    
    // 按匹配度排序，返回前3条（无匹配时返回默认建议）
    return results.length > 0 
        ? results.sort((a, b) => b.匹配度 - a.匹配度).slice(0, 3)
        : [{原文: '暂无匹配原文', 建议: '请尝试使用关键词：工作冲突、家庭关系、情绪波动、HRV低、妄念等'}];
}