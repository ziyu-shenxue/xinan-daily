/**
 * 语音识别核心功能（v1.0）
 * 核心功能：1. 支持指定输入框语音转文字；2. 全局语音开关控制；3. 异常处理与友好提示；4. 识别结果实时填充
 * 适配规范：兼容Chrome/Edge浏览器，无外部依赖，与index.html中语音按钮完全联动，遵循主色#2E7D32视觉规范
 */

// 全局状态管理
const VoiceRecognitionState = {
  isListening: false, // 是否正在录音
  currentTargetId: '', // 当前语音输入目标输入框ID
  recognitionInstance: null // 语音识别实例
};

/**
 * 初始化语音识别实例
 * @returns {webkitSpeechRecognition|null} 语音识别实例（不支持时返回null）
 */
function initRecognitionInstance() {
  // 浏览器兼容性检测
  if (!('webkitSpeechRecognition' in window)) {
    return null;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'zh-CN'; // 中文识别
  recognition.continuous = false; // 单次识别（识别一次后自动停止）
  recognition.interimResults = false; // 不返回中间结果，只返回最终结果
  recognition.maxAlternatives = 1; // 只返回最优结果

  // 识别开始回调
  recognition.onstart = () => {
    VoiceRecognitionState.isListening = true;
    updateVoiceButtonStyle(true);
    showVoiceHint(`🔴 正在录音...请对着麦克风说话`);
  };

  // 识别结果回调
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.trim();
    const confidence = event.results[0][0].confidence; // 识别置信度

    // 填充到目标输入框
    if (VoiceRecognitionState.currentTargetId) {
      const targetElement = document.getElementById(VoiceRecognitionState.currentTargetId);
      if (targetElement) {
        // 文本域/输入框统一处理
        targetElement.value = transcript;
        // 触发输入事件，同步到预览区
        targetElement.dispatchEvent(new Event('input'));
        showVoiceHint(`✅ 识别成功（置信度：${(confidence * 100).toFixed(1)}%）`);
      }
    }

    // 停止录音
    stopVoiceRecognition();
  };

  // 识别错误回调
  recognition.onerror = (event) => {
    let errorMsg = '';
    switch (event.error) {
      case 'no-speech':
        errorMsg = '未检测到语音，请重试';
        break;
      case 'audio-capture':
        errorMsg = '无法访问麦克风，请检查设备权限';
        break;
      case 'not-allowed':
        errorMsg = '麦克风权限被拒绝，请在浏览器设置中开启';
        break;
      case 'aborted':
        errorMsg = '录音已取消';
        break;
      default:
        errorMsg = `识别错误：${event.error}`;
    }

    showVoiceHint(`❌ ${errorMsg}`, true);
    stopVoiceRecognition();
  };

  // 识别结束回调（无论成功/失败）
  recognition.onend = () => {
    if (VoiceRecognitionState.isListening) {
      stopVoiceRecognition();
    }
  };

  return recognition;
}

/**
 * 启动语音识别（指定目标输入框）
 * @param {string} targetId - 目标输入框ID（如：xinchuan_proverb、summary_feeling）
 */
function startVoice(targetId) {
  // 验证目标输入框存在
  const targetElement = document.getElementById(targetId);
  if (!targetElement) {
    showVoiceHint(`❌ 未找到目标输入框`, true);
    return;
  }

  // 停止正在进行的录音
  if (VoiceRecognitionState.isListening) {
    stopVoiceRecognition();
  }

  // 初始化识别实例
  if (!VoiceRecognitionState.recognitionInstance) {
    VoiceRecognitionState.recognitionInstance = initRecognitionInstance();
    if (!VoiceRecognitionState.recognitionInstance) {
      showVoiceHint(`❌ 浏览器不支持语音识别\n请使用Chrome/Edge浏览器，微信用户请在浏览器中打开`, true);
      return;
    }
  }

  // 设置当前目标并启动识别
  VoiceRecognitionState.currentTargetId = targetId;
  VoiceRecognitionState.recognitionInstance.start();
}

/**
 * 停止语音识别
 */
function stopVoiceRecognition() {
  if (VoiceRecognitionState.isListening && VoiceRecognitionState.recognitionInstance) {
    VoiceRecognitionState.recognitionInstance.stop();
  }

  VoiceRecognitionState.isListening = false;
  VoiceRecognitionState.currentTargetId = '';
  updateVoiceButtonStyle(false);
}

/**
 * 切换全局语音输入开关
 */
function toggleVoiceInput() {
  if (VoiceRecognitionState.isListening) {
    stopVoiceRecognition();
    showVoiceHint(`🔌 语音输入已关闭`);
  } else {
    showVoiceHint(`🔌 语音输入已开启\n点击输入框旁🎤按钮开始录音`, false);
  }
}

/**
 * 更新语音按钮样式（录音中/未录音）
 * @param {boolean} isListening - 是否正在录音
 */
function updateVoiceButtonStyle(isListening) {
  // 更新所有语音按钮样式
  document.querySelectorAll('.voice-btn').forEach(btn => {
    if (isListening) {
      btn.classList.add('recording');
      btn.innerHTML = '🎙️';
    } else {
      btn.classList.remove('recording');
      btn.innerHTML = '🎤';
    }
  });

  // 更新全局语音开关图标
  const voiceToggle = document.getElementById('voiceToggle');
  if (voiceToggle) {
    voiceToggle.innerHTML = isListening ? '🎙️' : '🎤';
  }
}

/**
 * 显示语音提示信息
 * @param {string} message - 提示信息
 * @param {boolean} isError - 是否为错误提示（红色）
 */
function showVoiceHint(message, isError = false) {
  // 检查是否存在提示容器，不存在则创建
  let hintContainer = document.getElementById('voice-hint-container');
  if (!hintContainer) {
    hintContainer = document.createElement('div');
    hintContainer.id = 'voice-hint-container';
    hintContainer.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      padding: 8px 16px;
      border-radius: 4px;
      background-color: #2E7D32;
      color: white;
      font-size: 14px;
      z-index: 9999;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(hintContainer);
  }

  // 设置提示样式和内容
  hintContainer.textContent = message;
  hintContainer.style.backgroundColor = isError ? '#D32F2F' : '#2E7D32';
  hintContainer.style.opacity = '1';

  // 3秒后自动隐藏
  setTimeout(() => {
    hintContainer.style.opacity = '0';
  }, 3000);
}

/**
 * 页面加载完成后初始化
 */
window.addEventListener('DOMContentLoaded', () => {
  // 预初始化语音识别实例（提升首次使用响应速度）
  setTimeout(() => {
    VoiceRecognitionState.recognitionInstance = initRecognitionInstance();
    if (VoiceRecognitionState.recognitionInstance) {
      console.log('✅ 语音识别组件初始化成功：支持指定输入框语音转文字');
    } else {
      console.warn('⚠️ 语音识别组件初始化警告：浏览器不支持语音识别功能');
    }
  }, 1000);

  // 绑定全局语音开关点击事件（index.html中#voiceToggle元素）
  const voiceToggle = document.getElementById('voiceToggle');
  if (voiceToggle && !voiceToggle.onclick) {
    voiceToggle.onclick = toggleVoiceInput;
  }
});

// 暴露全局函数（供index.html调用）
window.startVoice = startVoice;
window.toggleVoiceInput = toggleVoiceInput;
window.stopVoiceRecognition = stopVoiceRecognition;