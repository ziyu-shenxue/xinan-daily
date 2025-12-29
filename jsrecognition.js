// 语音识别核心模块
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!window.SpeechRecognition) {
    alert('⚠️ 您的浏览器不支持语音识别，请使用Chrome/Edge/Safari');
}

const recognition = new SpeechRecognition();
recognition.lang = 'zh-CN';
recognition.continuous = false;
recognition.interimResults = false;

let currentVoiceField = null;

function startVoice(fieldId) {
    currentVoiceField = document.getElementById(fieldId);
    if (!currentVoiceField) return;
    
    const btn = event.target;
    btn.classList.add('recording');
    btn.textContent = '🔴';
    
    // 移动端权限处理
    if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(() => {
                recognition.start();
            })
            .catch(err => {
                alert('麦克风权限被拒绝：' + err.message);
                stopRecording();
            });
    } else {
        recognition.start();
    }
}

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    
    // 智能处理：数字字段自动提取数字
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
    
    // 触发实时预览
    if (currentVoiceField.oninput) {
        currentVoiceField.oninput();
    }
    
    stopRecording();
};

recognition.onerror = (event) => {
    alert('语音识别错误：' + event.error);
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

// 语音测试功能（用于调试）
function testVoice() {
    recognition.start();
    recognition.onresult = (e) => {
        alert('测试成功！识别内容：' + e.results[0][0].transcript);
    };
}