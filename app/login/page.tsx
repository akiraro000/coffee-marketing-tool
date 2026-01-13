'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // 验证手机号格式
  const isValidPhone = (phone: string) => {
    return /^1[3-9]\d{9}$/.test(phone);
  };

  // 发送验证码
  const handleSendCode = async () => {
    if (!isValidPhone(phoneNumber)) {
      alert('请输入正确的手机号');
      return;
    }

    setIsSending(true);

    try {
      // TODO: 调用发送验证码API
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
        }),
      });

      if (response.ok) {
        // 开始倒计时
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        alert('验证码已发送');
      } else {
        const errorData = await response.json();
        alert('发送失败：' + (errorData.error || '未知错误'));
      }
    } catch (error) {
      console.error('发送验证码错误:', error);
      alert('发送失败，请重试');
    } finally {
      setIsSending(false);
    }
  };

  // 登录/注册
  const handleLogin = async () => {
    if (!isValidPhone(phoneNumber)) {
      alert('请输入正确的手机号');
      return;
    }

    if (code.length !== 6) {
      alert('请输入6位验证码');
      return;
    }

    if (!agreed) {
      alert('请阅读并同意用户协议和隐私政策');
      return;
    }

    setIsLogging(true);

    try {
      // TODO: 调用登录API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber,
          code,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // 登录成功，跳转到主页
        alert('登录成功！');
        window.location.href = '/';
      } else {
        const errorData = await response.json();
        alert('登录失败：' + (errorData.error || '验证码错误'));
      }
    } catch (error) {
      console.error('登录错误:', error);
      alert('登录失败，请重试');
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* 顶部装饰 */}
      <div
        style={{
          backgroundColor: '#8B4513',
          height: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderBottomLeftRadius: '30px',
          borderBottomRightRadius: '30px',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>☕</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
          咖啡厅酒吧营销助手
        </div>
        <div style={{ fontSize: '14px', marginTop: '8px', opacity: 0.9 }}>
          智能营销，轻松获客
        </div>
      </div>

      {/* 登录表单 */}
      <main
        style={{
          padding: '20px',
          marginTop: '-40px',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '30px 20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <h2
            style={{
              textAlign: 'center',
              margin: '0 0 30px 0',
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333',
            }}
          >
            手机号登录/注册
          </h2>

          {/* 手机号输入 */}
          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                fontSize: '14px',
                color: '#666',
                marginBottom: '8px',
              }}
            >
              手机号
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="请输入手机号"
              maxLength={11}
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#8B4513')}
              onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
            />
          </div>

          {/* 验证码输入 */}
          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                fontSize: '14px',
                color: '#666',
                marginBottom: '8px',
              }}
            >
              验证码
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="请输入验证码"
                maxLength={6}
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#8B4513')}
                onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
              />
              <button
                onClick={handleSendCode}
                disabled={countdown > 0 || isSending || !isValidPhone(phoneNumber)}
                style={{
                  padding: '0 20px',
                  backgroundColor:
                    countdown > 0 || !isValidPhone(phoneNumber)
                      ? '#f0f0f0'
                      : '#8B4513',
                  color: countdown > 0 || !isValidPhone(phoneNumber) ? '#999' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor:
                    countdown > 0 || !isValidPhone(phoneNumber)
                      ? 'not-allowed'
                      : 'pointer',
                  whiteSpace: 'nowrap',
                  fontWeight: 'bold',
                }}
              >
                {countdown > 0 ? `${countdown}秒` : isSending ? '发送中...' : '获取验证码'}
              </button>
            </div>
          </div>

          {/* 登录按钮 */}
          <button
            onClick={handleLogin}
            disabled={isLogging}
            style={{
              width: '100%',
              backgroundColor: isLogging ? '#ccc' : '#8B4513',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isLogging ? 'not-allowed' : 'pointer',
              marginTop: '10px',
            }}
          >
            {isLogging ? '登录中...' : '登录 / 注册'}
          </button>

          {/* 用户协议 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              marginTop: '16px',
              fontSize: '12px',
              color: '#999',
            }}
          >
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{
                marginTop: '2px',
                cursor: 'pointer',
              }}
            />
            <div>
              我已阅读并同意
              <Link
                href="/agreement"
                style={{ color: '#8B4513', textDecoration: 'none' }}
              >
                《用户协议》
              </Link>
              和
              <Link
                href="/privacy"
                style={{ color: '#8B4513', textDecoration: 'none' }}
              >
                《隐私政策》
              </Link>
            </div>
          </div>
        </div>

        {/* 温馨提示 */}
        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#fff9f5',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#666',
            lineHeight: '1.6',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#8B4513' }}>
            💡 温馨提示
          </div>
          <div>• 新用户登录即自动注册</div>
          <div>• 验证码10分钟内有效</div>
          <div>• 首次登录请绑定店铺信息</div>
        </div>
      </main>

      {/* 底部导航栏 */}
      <nav
        style={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          backgroundColor: 'white',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-around',
          padding: '12px 0',
          boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
          zIndex: 1000,
        }}
      >
        <Link
          href="/"
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: '#999',
            textDecoration: 'none',
          }}
        >
          <div style={{ fontSize: '20px' }}>🏠</div>
          <div>主页</div>
        </Link>
        <Link
          href="/marketing"
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: '#999',
            textDecoration: 'none',
          }}
        >
          <div style={{ fontSize: '20px' }}>📝</div>
          <div>营销</div>
        </Link>
        <Link
          href="/comments"
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: '#999',
            textDecoration: 'none',
          }}
        >
          <div style={{ fontSize: '20px' }}>💬</div>
          <div>评论</div>
        </Link>
        <Link
          href="/settings"
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: '#999',
            textDecoration: 'none',
          }}
        >
          <div style={{ fontSize: '20px' }}>⚙️</div>
          <div>设置</div>
        </Link>
      </nav>
    </div>
  );
}
