/**
 * 语音识别核心模块
 * 支持全局开关、语音转文字、识别状态回调、异常处理
 */
class VoiceRecognition {
  constructor() {
    // 全局配置项
    this.config = {
      lang: 'zh-CN', // 识别语言（中文简体）
      continuous: false, // 是否连续识别（单次语音输入结束后停止）
      interimResults: true, // 是否返回临时识别结果（实时更新）
    };

    // 全局状态变量
    this.recognitionInstance = null; // 语音识别实例
    this.isListening = false; // 全局开关：是否正在监听语音（核心状态）
    this.currentResult = ''; // 当前识别结果
    this.onResultCallback = null; // 识别结果回调函数
    this.onStatusChangeCallback = null; // 状态变更回调函数
    this.onErrorCallback = null; // 异常回调函数

    // 初始化语音识别实例
    this._initRecognition();
  }

  /**
   * 私有方法：初始化语音识别实例（兼容 Web Speech API 不同浏览器前缀）
   */
  _initRecognition() {
    // 兼容 Chrome/Edge 等浏览器的 Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this._triggerError('当前浏览器不支持语音识别功能，请使用 Chrome、Edge 等现代浏览器');
      return;
    }

    // 创建识别实例并配置参数
    this.recognitionInstance = new SpeechRecognition();
    this.recognitionInstance.lang = this.config.lang;
    this.recognitionInstance.continuous = this.config.continuous;
    this.recognitionInstance.interimResults = this.config.interimResults;

    // 绑定识别事件处理函数
    this._bindRecognitionEvents();
  }

  /**
   * 私有方法：绑定语音识别相关事件
   */
  _bindRecognitionEvents() {
    if (!this.recognitionInstance) return;

    // 1. 识别结果返回事件（临时结果/最终结果）
    this.recognitionInstance.onresult = (event) => {
      let interimTranscript = ''; // 临时结果（未确认）
      let finalTranscript = ''; // 最终结果（已确认）

      // 遍历所有识别结果
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // 更新当前结果（最终结果优先，无最终结果则显示临时结果）
      this.currentResult = finalTranscript || interimTranscript;

      // 触发结果回调，返回当前结果和是否为最终结果
      this.onResultCallback && this.onResultCallback({
        text: this.currentResult,
        isFinal: !!finalTranscript
      });
    };

    // 2. 语音识别结束事件（单次识别完成，非全局关闭）
    this.recognitionInstance.onend = () => {
      if (this.isListening) {
        // 若全局开关仍为开启状态，重新启动识别（实现持续监听）
        this.recognitionInstance.start();
      } else {
        // 全局开关关闭，触发状态变更回调
        this._triggerStatusChange('stopped');
      }
    };

    // 3. 语音识别错误事件
    this.recognitionInstance.onerror = (event) => {
      const errorMsg = this._getErrorMsg(event.error);
      this._triggerError(errorMsg);
      // 错误后停止监听，更新全局状态
      this.isListening = false;
    };
  }

  /**
   * 私有方法：转换错误码为可读信息
   * @param {string} errorCode 错误码
   * @returns {string} 可读错误信息
   */
  _getErrorMsg(errorCode) {
    const errorMap = {
      'no-speech': '未检测到语音输入',
      'audio-capture': '无法获取麦克风权限（请开启麦克风权限）',
      'not-allowed': '浏览器禁止使用语音识别功能',
      'aborted': '语音识别被中止',
      'network': '网络错误，无法完成语音识别',
      'not-supported': '当前环境不支持该语音识别功能'
    };
    return errorMap[errorCode] || `未知错误：${errorCode}`;
  }

  /**
   * 私有方法：触发状态变更回调
   * @param {string} status 状态（starting/started/stopped/error）
   */
  _triggerStatusChange(status) {
    this.onStatusChangeCallback && this.onStatusChangeCallback({
      status,
      isListening: this.isListening
    });
  }

  /**
   * 私有方法：触发异常回调
   * @param {string} errorMsg 异常信息
   */
  _triggerError(errorMsg) {
    this.onErrorCallback && this.onErrorCallback({
      message: errorMsg,
      timestamp: new Date().toISOString()
    });
    this._triggerStatusChange('error');
  }

  /**
   * 公有方法：切换全局语音监听开关（开启/关闭）
   * @returns {boolean} 当前监听状态
   */
  toggleListening() {
    return this.isListening ? this.stopListening() : this.startListening();
  }

  /**
   * 公有方法：开启语音监听
   * @returns {boolean} 开启结果（true 成功，false 失败）
   */
  startListening() {
    if (!this.recognitionInstance) return false;
    if (this.isListening) return true;

    try {
      this.isListening = true;
      this.recognitionInstance.start();
      this._triggerStatusChange('started');
      return true;
    } catch (error) {
      this._triggerError(`开启语音监听失败：${error.message}`);
      this.isListening = false;
      return false;
    }
  }

  /**
   * 公有方法：关闭语音监听
   * @returns {boolean} 关闭结果（true 成功，false 失败）
   */
  stopListening() {
    if (!this.recognitionInstance) return false;
    if (!this.isListening) return true;

    try {
      this.isListening = false;
      this.recognitionInstance.abort(); // 中止识别（触发 onend 事件）
      this._triggerStatusChange('stopped');
      return true;
    } catch (error) {
      this._triggerError(`关闭语音监听失败：${error.message}`);
      return false;
    }
  }

  /**
   * 公有方法：设置识别结果回调函数
   * @param {Function} callback 回调函数（接收 { text, isFinal } 参数）
   */
  onResult(callback) {
    if (typeof callback === 'function') {
      this.onResultCallback = callback;
    }
  }

  /**
   * 公有方法：设置状态变更回调函数
   * @param {Function} callback 回调函数（接收 { status, isListening } 参数）
   */
  onStatusChange(callback) {
    if (typeof callback === 'function') {
      this.onStatusChangeCallback = callback;
    }
  }

  /**
   * 公有方法：设置异常回调函数
   * @param {Function} callback 回调函数（接收 { message, timestamp } 参数）
   */
  onError(callback) {
    if (typeof callback === 'function') {
      this.onErrorCallback = callback;
    }
  }

  /**
   * 公有方法：获取当前识别结果
   * @returns {string} 当前识别文本
   */
  getCurrentResult() {
    return this.currentResult;
  }

  /**
   * 公有方法：获取当前监听状态
   * @returns {boolean} 是否正在监听
   */
  getListeningStatus() {
    return this.isListening;
  }
}

// 暴露全局实例，方便其他文件调用
window.VoiceRecognitionInstance = new VoiceRecognition();