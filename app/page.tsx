  'use client';

  import Link from 'next/link';

  export default function Dashboard() {
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
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
          ☕ 咖啡厅酒吧营销助手
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span>🔔</span>
          <span>👤</span>
        </div>
      </header>

      {/* 主要内容区 */}
      <main style={{ padding: '20px', paddingBottom: '80px' }}>
        {/* 问候语 */}
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>
            👋 早上好，张老板
          </h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            今天也要元气满满地做营销哦！
          </p>
        </div>

        {/* 两个功能卡片 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 智能营销内容生成卡片 */}
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #8B4513',
            }}
          >
            <h3
              style={{
                margin: '0 0 12px 0',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              📝 智能营销内容生成
            </h3>
            <p
              style={{ margin: '0 0 16px 0', color: '#666', fontSize: '14px' }}
            >
              本周已生成 12 篇
            </p>
  <Link href="/marketing" style={{
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    textDecoration: 'none',
    display: 'inline-block'
  }}>
    立即使用 →
  </Link>
          </div>

          {/* 智能评论回复卡片 */}
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #8B4513',
            }}
          >
            <h3
              style={{
                margin: '0 0 12px 0',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              💬 智能评论回复
            </h3>
            <p
              style={{ margin: '0 0 16px 0', color: '#666', fontSize: '14px' }}
            >
              待回复评论 3 条
            </p>
  <Link href="/comments" style={{
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    textDecoration: 'none',
    display: 'inline-block'
  }}>
    立即处理 →
  </Link>
          </div>
        </div>

        {/* 今日数据 */}
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginTop: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>
            📊 今日数据
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: '1 1 45%' }}>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#8B4513',
                }}
              >
                3
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>生成内容</div>
            </div>
            <div style={{ flex: '1 1 45%' }}>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#8B4513',
                }}
              >
                5
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>回复评论</div>
            </div>
          </div>
        </div>
      </main>

  {/* 底部导航栏 */}
  <nav style={{
    position: 'fixed',
    bottom: '0',
    left: '0',
    right: '0',
    backgroundColor: 'white',
    borderTop: '1px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '12px 0',
    boxShadow: '0 -2px 8px rgba(0,0,0,0.1)'
  }}>
    <Link href="/" style={{ textAlign: 'center', fontSize: '12px', color: '#8B4513', textDecoration: 'none' }}>
      <div style={{ fontSize: '20px' }}>🏠</div>
      <div>主页</div>
    </Link>
    <Link href="/marketing" style={{ textAlign: 'center', fontSize: '12px', color: '#999', textDecoration: 'none' }}>
      <div style={{ fontSize: '20px' }}>📝</div>
      <div>营销</div>
    </Link>
    <Link href="/comments" style={{ textAlign: 'center', fontSize: '12px', color: '#999', textDecoration: 'none' }}>
      <div style={{ fontSize: '20px' }}>💬</div>
      <div>评论</div>
    </Link>
    <div style={{ textAlign: 'center', fontSize: '12px', color: '#999' }}>
      <div style={{ fontSize: '20px' }}>⚙️</div>
      <div>设置</div>
    </div>
  </nav>
    </div>
  );
}
