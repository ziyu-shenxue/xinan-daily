// 语音识别核心模块（修复版）
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
let recognition = null;
let currentVoiceField = null;
let audioStream = null; // 保存音频流，避免被回收

// 初始化语音识别实例
function initRecognition() {
    if (!SpeechRecognition) {
        alert('⚠️ 您的浏览器不支持语音识别\n请使用：Chrome 79+/Edge 79+/Safari 14+\n微信用户请点击右上角"..." → "在浏览器打开"');
        return false;
    }
    recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    // 绑定事件处理函数
    recognition.onresult = handleRecognitionResult;
    recognition.onerror = handleRecognitionError;
    recognition.onend = handleRecognitionEnd;
    return true;
}

// 强制请求麦克风权限
async function requestMicrophonePermission() {
    try {
        // 请求音频权限，保存流引用
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        return true;
    } catch (err) {
        console.error('麦克风权限失败:', err);
        alert('麦克风权限被拒绝\n请检查浏览器设置（设置→隐私→网站设置→麦克风）允许本网站使用麦克风');
        return false;
    }
}

// 启动语音识别
async function startVoice(fieldId) {
    // 初始化识别实例
    if (!recognition && !initRecognition()) return;
    
    currentVoiceField = document.getElementById(fieldId);
    if (!currentVoiceField) {
        alert('输入框不存在，请刷新页面重试');
        return;
    }
    
    const btn = event.target;
    btn.classList.add('recording');
    btn.textContent = '🔴';
    
    // 请求权限并启动识别
    const hasPermission = await requestMicrophonePermission();
    if (hasPermission) {
        try {
            recognition.start();
        } catch (err) {
            alert('语音识别启动失败: ' + err.message);
            stopRecording();
        }
    } else {
        stopRecording();
    }
}

// 处理识别结果
function handleRecognitionResult(event) {
    const transcript = event.results[0][0].transcript.trim();
    console.log('识别结果:', transcript);
    
    // 根据输入框类型处理结果
    if (currentVoiceField.type === 'number') {
        // 数字输入框：提取数字
        const numbers = transcript.match(/\d+(\.\d+)?/g);
        if (numbers && numbers.length > 0) {
            currentVoiceField.value = numbers[0];
        } else {
            alert(`未识别到数字（识别内容：${transcript}），请重试`);
        }
    } else {
        // 文本/textarea：直接填充
        currentVoiceField.value = transcript;
    }
    
    // 触发输入事件（更新预览）
    if (currentVoiceField.oninput) {
        currentVoiceField.oninput();
    } else {
        const inputEvent = new Event('input');
        currentVoiceField.dispatchEvent(inputEvent);
    }
}

// 处理识别错误
function handleRecognitionError(event) {
    let errorMsg = '';
    switch(event.error) {
        case 'no-speech':
            errorMsg = '未检测到语音，请靠近麦克风并清晰发言';
            break;
        case 'audio-capture':
            errorMsg = '无法访问麦克风，请检查设备是否有麦克风';
            break;
        case 'not-allowed':
            errorMsg = '麦克风权限被拒绝，请在浏览器设置中允许';
            break;
        case 'aborted':
            errorMsg = '语音识别已中止';
            break;
        case 'audio-hardware':
            errorMsg = '麦克风硬件故障，请检查设备';
            break;
        default:
            errorMsg = `语音识别错误: ${event.error}`;
    }
    alert(errorMsg);
    stopRecording();
}

// 处理识别结束
function handleRecognitionEnd() {
    stopRecording();
}

// 停止录音并恢复按钮状态
function stopRecording() {
    // 停止识别和音频流
    if (recognition) recognition.stop();
    if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
        audioStream = null;
    }
    
    // 恢复按钮状态
    const btn = document.querySelector('.voice-btn.recording');
    if (btn) {
        btn.classList.remove('recording');
        btn.textContent = '🎤';
    }
    currentVoiceField = null;
}

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', initRecognition);