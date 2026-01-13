'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const [shops, setShops] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newShop, setNewShop] = useState({
    platform: '',
    shopName: '',
    shopId: '',
    shopUrl: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // 加载已绑定的店铺
  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = async () => {
    try {
      // TODO: 从API加载用户的店铺列表
      // const response = await fetch('/api/shops');
      // const data = await response.json();
      // setShops(data.shops);

      // 暂时使用模拟数据
      setShops([]);
    } catch (error) {
      console.error('加载店铺失败:', error);
    }
  };

  // 添加店铺
  const handleAddShop = async () => {
    if (!newShop.platform || !newShop.shopName || !newShop.shopId) {
      alert('请填写完整的店铺信息');
      return;
    }

    setIsSaving(true);

    try {
      // TODO: 调用API保存店铺信息
      // const response = await fetch('/api/shops', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newShop),
      // });

      // if (response.ok) {
      //   alert('店铺绑定成功！');
      //   setShowAddForm(false);
      //   setNewShop({ platform: '', shopName: '', shopId: '', shopUrl: '' });
      //   loadShops();
      // }

      // 暂时模拟成功
      alert('店铺绑定成功！（开发模式，未真正保存）');
      setShowAddForm(false);
      setNewShop({ platform: '', shopName: '', shopId: '', shopUrl: '' });
    } catch (error) {
      console.error('绑定店铺失败:', error);
      alert('绑定失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  // 解绑店铺
  const handleUnbindShop = async (shopId: string) => {
    if (!confirm('确定要解绑这个店铺吗？')) return;

    try {
      // TODO: 调用API解绑店铺
      // await fetch(`/api/shops/${shopId}`, { method: 'DELETE' });

      alert('店铺已解绑');
      loadShops();
    } catch (error) {
      console.error('解绑失败:', error);
      alert('解绑失败，请重试');
    }
  };

  // 获取平台信息
  const platforms = [
    { id: 'dianping', name: '大众点评', color: '#FF6900', icon: '🔴' },
    { id: 'meituan', name: '美团', color: '#FFB100', icon: '🟡' },
    { id: 'xiaohongshu', name: '小红书', color: '#FF2442', icon: '📕' },
    { id: 'eleme', name: '饿了么', color: '#0095FF', icon: '🔵' },
  ];

  const getPlatformInfo = (platformId: string) => {
    return platforms.find((p) => p.id === platformId) || platforms[0];
  };

  // 从URL提取店铺ID
  const extractShopId = (url: string) => {
    if (!url) return '';

    // 大众点评: https://www.dianping.com/shop/12345678
    const dianpingMatch = url.match(/dianping\.com\/shop\/(\d+)/);
    if (dianpingMatch) return dianpingMatch[1];

    // 美团: https://www.meituan.com/shop/12345678
    const meituanMatch = url.match(/meituan\.com\/.*?(\d{6,})/);
    if (meituanMatch) return meituanMatch[1];

    return '';
  };

  // 当店铺URL变化时，自动提取ID
  useEffect(() => {
    if (newShop.shopUrl) {
      const extractedId = extractShopId(newShop.shopUrl);
      if (extractedId && !newShop.shopId) {
        setNewShop({ ...newShop, shopId: extractedId });
      }
    }
  }, [newShop.shopUrl]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* 顶部导航栏 */}
      <header
        style={{
          backgroundColor: '#8B4513',
          color: 'white',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <Link href="/" style={{ cursor: 'pointer' }}>
          ←
        </Link>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>设置</span>
      </header>

      {/* 主要内容区 */}
      <main style={{ padding: '20px', paddingBottom: '100px' }}>
        {/* 用户信息卡片 */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#8B4513',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                color: 'white',
              }}
            >
              👤
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                店铺老板
              </div>
              <div style={{ fontSize: '14px', color: '#999' }}>
                管理你的店铺和营销内容
              </div>
            </div>
          </div>
        </div>

        {/* 店铺绑定区域 */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <div>
              <h3
                style={{
                  margin: '0 0 8px 0',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#333',
                }}
              >
                🏪 店铺管理
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#999' }}>
                绑定店铺后可以获取评论数据
              </p>
            </div>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                style={{
                  backgroundColor: '#8B4513',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                ➕ 添加店铺
              </button>
            )}
          </div>

          {/* 添加店铺表单 */}
          {showAddForm && (
            <div
              style={{
                backgroundColor: '#f9f9f9',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '2px solid #8B4513',
              }}
            >
              <h4
                style={{
                  margin: '0 0 16px 0',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#8B4513',
                }}
              >
                绑定新店铺
              </h4>

              {/* 平台选择 */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                  选择平台 *
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {platforms.map((platform) => (
                    <label
                      key={platform.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: `2px solid ${
                          newShop.platform === platform.id ? platform.color : '#e0e0e0'
                        }`,
                        backgroundColor:
                          newShop.platform === platform.id ? platform.color + '20' : 'white',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="radio"
                        name="platform"
                        checked={newShop.platform === platform.id}
                        onChange={(e) =>
                          setNewShop({ ...newShop, platform: e.target.value })
                        }
                        value={platform.id}
                        style={{ display: 'none' }}
                      />
                      <span>{platform.icon}</span>
                      <span style={{ fontSize: '14px' }}>{platform.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 店铺名称 */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                  店铺名称 *
                </div>
                <input
                  type="text"
                  value={newShop.shopName}
                  onChange={(e) => setNewShop({ ...newShop, shopName: e.target.value })}
                  placeholder="例如：XX咖啡馆"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* 店铺链接 */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                  店铺链接（可选，会自动提取店铺ID）
                </div>
                <input
                  type="url"
                  value={newShop.shopUrl}
                  onChange={(e) => setNewShop({ ...newShop, shopUrl: e.target.value })}
                  placeholder="粘贴店铺主页链接"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
                {newShop.shopUrl && (
                  <div style={{ fontSize: '12px', color: '#8B4513', marginTop: '4px' }}>
                    ✨ 已自动识别店铺ID
                  </div>
                )}
              </div>

              {/* 店铺ID */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                  店铺ID *
                </div>
                <input
                  type="text"
                  value={newShop.shopId}
                  onChange={(e) => setNewShop({ ...newShop, shopId: e.target.value })}
                  placeholder="输入店铺ID"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* 按钮 */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleAddShop}
                  disabled={isSaving}
                  style={{
                    flex: 1,
                    backgroundColor: isSaving ? '#ccc' : '#8B4513',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  {isSaving ? '保存中...' : '确认绑定'}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewShop({ platform: '', shopName: '', shopId: '', shopUrl: '' });
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: 'white',
                    color: '#999',
                    border: '1px solid #e0e0e0',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  取消
                </button>
              </div>
            </div>
          )}

          {/* 已绑定店铺列表 */}
          <div>
            {shops.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#999',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏪</div>
                <div>还没有绑定店铺</div>
                <div style={{ fontSize: '14px', marginTop: '8px' }}>
                  点击上方"添加店铺"按钮开始绑定
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {shops.map((shop) => {
                  const platform = getPlatformInfo(shop.platform);
                  return (
                    <div
                      key={shop.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        backgroundColor: 'white',
                      }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          backgroundColor: platform.color + '20',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                        }}
                      >
                        {platform.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                          {shop.shopName}
                        </div>
                        <div style={{ fontSize: '12px', color: '#999' }}>
                          {platform.name} · ID: {shop.shopId}
                        </div>
                      </div>
                      <button
                        onClick={() => handleUnbindShop(shop.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: 'white',
                          color: '#ff4444',
                          border: '1px solid #ff4444',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        解绑
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 使用说明 */}
        <div
          style={{
            backgroundColor: '#fff9f5',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '12px',
            color: '#666',
            lineHeight: '1.6',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#8B4513' }}>
            💡 如何获取店铺ID？
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>大众点评：</strong>打开店铺页面，URL中的数字就是店铺ID
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>美团：</strong>同上，URL中的数字ID
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>小红书：</strong>在企业号后台可以找到
          </div>
          <div>
            <strong>提示：</strong>直接粘贴店铺链接，我们会自动提取店铺ID！
          </div>
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
            color: '#8B4513',
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
