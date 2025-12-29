// 语音识别核心模块（修复版）
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!window.SpeechRecognition) {
    alert('⚠️ 您的浏览器不支持语音识别\n请使用：Chrome/Edge/Safari\n微信用户请点击右上角"..." → "在浏览器打开"');
}

const recognition = new SpeechRecognition();
recognition.lang = 'zh-CN';
recognition.continuous = false;
recognition.interimResults = false;

let currentVoiceField = null;

// 强制请求麦克风权限
async function requestMicrophonePermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        return true;
    } catch (err) {
        console.error('麦克风权限失败:', err);
        alert('麦克风权限被拒绝\n请检查浏览器设置: ' + err.message);
        return false;
    }
}

async function startVoice(fieldId) {
    currentVoiceField = document.getElementById(fieldId);
    if (!currentVoiceField) return;
    
    const btn = event.target;
    btn.classList.add('recording');
    btn.textContent = '🔴';
    
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

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    
    if (currentVoiceField.type === 'number') {
        const numbers = transcript.match(/\d+/g);
        if (numbers) {
            currentVoiceField.value = numbers[0];
        } else {
            alert('未识别到数字，请重试');
        }
    } else {
        currentVoiceField.value = transcript;
    }
    
    if (currentVoiceField.oninput) {
        currentVoiceField.oninput();
    }
    
    stopRecording();
};

recognition.onerror = (event) => {
    let errorMsg = '';
    switch(event.error) {
        case 'no-speech':
            errorMsg = '未检测到语音，请重试';
            break;
        case 'audio-capture':
            errorMsg = '无法访问麦克风';
            break;
        case 'not-allowed':
            errorMsg = '麦克风权限被拒绝';
            break;
        default:
            errorMsg = '语音识别错误: ' + event.error;
    }
    alert(errorMsg);
    stopRecording();
};

recognition.onend = () => {
    stopRecording();
};

function stopRecording() {
    const btn = document.querySelector('.recording');
    if (btn) {
        btn.classList.remove('recording');
        btn.textContent = '🎤';
    }
}