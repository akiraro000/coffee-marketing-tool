'use client';

import { useState, useEffect } from 'react';

// 模拟评论数据
const mockComments = [
  {
    id: 1,
    platform: 'dianping',
    platformName: '大众点评',
    rating: 5,
    userName: '用户138****1234',
    time: '2小时前',
    content:
      '这家酒吧氛围真的太棒了！音乐品味很好，调酒师技术也很专业。特别推荐烟熏波本，口感很有层次！下周还会带朋友来的~',
    status: 'pending',
    aiSuggestion:
      '感谢您的认可！烟熏波本是我们招牌，很高兴您喜欢。下周来的时候记得说一声，我们送您一份小吃~期待您的光临！🍸',
  },
  {
    id: 2,
    platform: 'meituan',
    platformName: '美团',
    rating: 3,
    userName: '用户159****5678',
    time: '昨天',
    content:
      '咖啡味道还行，但是上菜速度有点慢，等了快20分钟。希望改进一下效率。',
    status: 'pending',
    aiSuggestion:
      '非常抱歉让您久等了！我们会立即优化出餐流程。感谢您的反馈，下次来的时候请联系店长，我们为您准备一份小惊喜。',
  },
  {
    id: 3,
    platform: 'xiaohongshu',
    platformName: '小红书',
    rating: 2,
    userName: '用户186****9012',
    time: '2天前',
    content:
      '装修风格还行，但服务员态度冷淡，问了问题爱理不理的。不会再来第二次了。',
    status: 'pending',
    aiSuggestion:
      '非常抱歉给您带来了不好的体验！这是我们的严重失误。我们已经对服务团队进行了培训，确保不会再发生类似情况。希望能给我们一次挽回的机会，请联系客服，我们为您准备了一份专属补偿。',
  },
  {
    id: 4,
    platform: 'dianping',
    platformName: '大众点评',
    rating: 5,
    userName: '用户139****8888',
    time: '3天前',
    content:
      '约会首选！环境优雅，灯光柔和，特别适合情侣。鸡尾酒很有创意，每次来都有惊喜。强烈推荐莫吉托！',
    status: 'replied',
    aiSuggestion:
      '感谢您的五星好评！很荣幸能成为您的约会首选之地~莫吉托确实是很经典的选择，下次来试试我们的新配方吧！',
  },
  {
    id: 5,
    platform: 'eleme',
    platformName: '饿了么',
    rating: 4,
    userName: '用户135****6666',
    time: '5天前',
    content:
      '外卖包装很用心，送到的时候还是热的。拿铁味道不错，就是甜度有点高。',
    status: 'replied',
    aiSuggestion:
      '感谢您的订单！我们已经在优化甜度选项了，下次可以在订单备注"少糖"，我们按您的要求制作~',
  },
];

export default function CommentsPage() {
  const [comments, setComments] = useState(mockComments);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedComment, setSelectedComment] = useState<any>(null);
  const [selectedReply, setSelectedReply] = useState('');
  const [aiReplies, setAiReplies] = useState<any[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // 调用AI生成回复
  const generateAIReply = async (comment: any) => {
    setIsGeneratingAI(true);
    setAiReplies([]);

    try {
      const starRating = comment.rating;
      const sentiment =
        starRating >= 4 ? '好评' : starRating >= 3 ? '中评' : '差评';

      const prompt = `请为以下${sentiment}评论生成3种不同风格的回复建议：

【评论内容】
${comment.content}

【评分】
${starRating}星

【要求】
请生成3种风格的回复：
1. 热情详细型：热情友好，内容详细，适当使用emoji
2. 简洁专业型：简洁明了，专业礼貌
3. 幽默亲切型：轻松幽默，拉近距离

每种回复控制在50-100字，要真诚得体。对于差评要诚恳道歉，对于好评要热情感谢。

请直接以JSON数组格式返回，格式如下：
[
  {
    "type": "热情详细型",
    "content": "具体的回复内容"
  },
  {
    "type": "简洁专业型", 
    "content": "具体的回复内容"
  },
  {
    "type": "幽默亲切型",
    "content": "具体的回复内容"
  }
]`;

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          type: 'reply',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('AI生成失败:', errorData);
        // 使用备用回复
        setAiReplies(getFallbackReplies(comment));
        setIsGeneratingAI(false);
        return;
      }

      const data = await response.json();

      // 解析返回的内容
      try {
        const jsonMatch = data.content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setAiReplies(parsed);
          // 默认选择第一个
          if (parsed && parsed.length > 0) {
            setSelectedReply(parsed[0].content);
          }
        } else {
          throw new Error('无法解析');
        }
      } catch (e) {
        console.error('解析AI回复失败:', e);
        // 使用备用回复
        setAiReplies(getFallbackReplies(comment));
        if (getFallbackReplies(comment).length > 0) {
          setSelectedReply(getFallbackReplies(comment)[0].content);
        }
      }

      setIsGeneratingAI(false);
    } catch (error) {
      console.error('生成AI回复错误:', error);
      // 使用备用回复
      setAiReplies(getFallbackReplies(comment));
      if (getFallbackReplies(comment).length > 0) {
        setSelectedReply(getFallbackReplies(comment)[0].content);
      }
      setIsGeneratingAI(false);
    }
  };

  // 备用回复（当AI调用失败时使用）
  const getFallbackReplies = (comment: any) => {
    return [
      {
        id: 1,
        type: '热情详细型',
        content:
          comment.rating >= 4
            ? `感谢您的${comment.rating}星好评！我们很高兴您喜欢我们的产品和服务。您的认可就是我们前进的动力，期待您的再次光临！🎉`
            : `非常抱歉给您带来了不好的体验。感谢您的反馈，我们会立即改进。希望能给我们一次挽回的机会，下次来请联系店长。`,
      },
      {
        id: 2,
        type: '简洁专业型',
        content:
          comment.rating >= 4
            ? `感谢您的${comment.rating}星好评！我们会继续提供优质服务。期待再次为您服务！`
            : `感谢您的反馈。我们会认真对待并改进。希望能再次为您服务。`,
      },
      {
        id: 3,
        type: '幽默亲切型',
        content:
          comment.rating >= 4
            ? `哇！您也太会夸了吧！😍 看来我们的团队要加班练习新技术了哈哈~下次带朋友来，记得找店长领小惊喜哦！`
            : `收到！我们马上去"整改"！如果还没满意，您就罚我们送您一份特色饮品~期待您的再次光临！`,
      },
    ];
  };

  // 当选择评论时，自动生成AI回复
  useEffect(() => {
    if (selectedComment && selectedComment.status === 'pending') {
      generateAIReply(selectedComment);
    } else if (selectedComment && selectedComment.status === 'replied') {
      // 已回复的评论使用备用回复
      const fallback = getFallbackReplies(selectedComment);
      setAiReplies(fallback);
      if (fallback.length > 0) {
        setSelectedReply(fallback[0].content);
      }
    }
  }, [selectedComment]);

  // 获取平台图标颜色
  const getPlatformColor = (platform: string) => {
    const colors: { [key: string]: string } = {
      dianping: '#FF6900',
      meituan: '#FFB100',
      eleme: '#0095FF',
      xiaohongshu: '#FF2442',
      amap: '#2563EB',
    };
    return colors[platform] || '#666';
  };

  // 获取星级显示
  const getStars = (rating: number) => {
    return '⭐'.repeat(rating);
  };

  // 筛选评论
  const filteredComments = comments.filter((comment) => {
    const platformMatch =
      selectedPlatform === 'all' || comment.platform === selectedPlatform;
    const statusMatch =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && comment.status === 'pending') ||
      (statusFilter === 'replied' && comment.status === 'replied');
    return platformMatch && statusMatch;
  });

  // 待回复数量
  const pendingCount = comments.filter((c) => c.status === 'pending').length;

  // 标记为已回复
  const markAsReplied = (commentId: number) => {
    setComments(
      comments.map((c) =>
        c.id === commentId ? { ...c, status: 'replied' } : c
      )
    );
    setSelectedComment(null);
    alert('已标记为已回复！');
  };

  // 复制并标记
  const copyAndMark = (reply: string) => {
    navigator.clipboard.writeText(reply);
    markAsReplied(selectedComment.id);
  };

  // 列表视图
  if (!selectedComment) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
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
          <span
            onClick={() => (window.location.href = '/')}
            style={{ cursor: 'pointer' }}
          >
            ←
          </span>
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
            智能评论回复
          </span>
        </header>

        {/* 主要内容区 */}
        <main style={{ padding: '20px', paddingBottom: '100px' }}>
          {/* 状态筛选 */}
          <div
            style={{
              backgroundColor: 'white',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              gap: '12px',
            }}
          >
            <button
              onClick={() => setStatusFilter('all')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border:
                  statusFilter === 'all'
                    ? '2px solid #8B4513'
                    : '1px solid #e0e0e0',
                backgroundColor: statusFilter === 'all' ? '#fff9f5' : 'white',
                fontSize: '14px',
                fontWeight: statusFilter === 'all' ? 'bold' : 'normal',
                cursor: 'pointer',
              }}
            >
              全部 ({comments.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border:
                  statusFilter === 'pending'
                    ? '2px solid #8B4513'
                    : '1px solid #e0e0e0',
                backgroundColor:
                  statusFilter === 'pending' ? '#fff9f5' : 'white',
                fontSize: '14px',
                fontWeight: statusFilter === 'pending' ? 'bold' : 'normal',
                cursor: 'pointer',
              }}
            >
              🔴 待回复 ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('replied')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border:
                  statusFilter === 'replied'
                    ? '2px solid #8B4513'
                    : '1px solid #e0e0e0',
                backgroundColor:
                  statusFilter === 'replied' ? '#fff9f5' : 'white',
                fontSize: '14px',
                fontWeight: statusFilter === 'replied' ? 'bold' : 'normal',
                cursor: 'pointer',
              }}
            >
              ✅ 已回复 ({comments.length - pendingCount})
            </button>
          </div>

          {/* 平台筛选 */}
          <div
            style={{
              backgroundColor: 'white',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <div
              style={{
                marginBottom: '12px',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#666',
              }}
            >
              平台筛选：
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', name: '全部' },
                { id: 'dianping', name: '大众点评' },
                { id: 'meituan', name: '美团' },
                { id: 'eleme', name: '饿了么' },
                { id: 'xiaohongshu', name: '小红书' },
              ].map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border:
                      selectedPlatform === platform.id
                        ? '2px solid #8B4513'
                        : '1px solid #e0e0e0',
                    backgroundColor:
                      selectedPlatform === platform.id ? '#8B4513' : 'white',
                    color: selectedPlatform === platform.id ? 'white' : '#666',
                    fontSize: '13px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {platform.name}
                </button>
              ))}
            </div>
          </div>

          {/* 评论列表 */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {filteredComments.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  color: '#999',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                <div>暂无评论</div>
              </div>
            ) : (
              filteredComments.map((comment) => (
                <div
                  key={comment.id}
                  onClick={() => setSelectedComment(comment)}
                  style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderLeft:
                      comment.status === 'pending'
                        ? '4px solid #ff4444'
                        : '4px solid #4CAF50',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = 'translateY(-2px)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = 'translateY(0)')
                  }
                >
                  {/* 平台和评分 */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor:
                          getPlatformColor(comment.platform) + '20',
                        color: getPlatformColor(comment.platform),
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      {comment.platformName} {getStars(comment.rating)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      {comment.time}
                    </div>
                  </div>

                  {/* 用户信息 */}
                  <div
                    style={{
                      marginBottom: '8px',
                      fontSize: '14px',
                      color: '#666',
                    }}
                  >
                    {comment.userName}
                  </div>

                  {/* 评论内容 */}
                  <div
                    style={{
                      marginBottom: '12px',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: '#333',
                    }}
                  >
                    {comment.content.length > 100
                      ? comment.content.substring(0, 100) + '...'
                      : comment.content}
                  </div>

                  {/* AI建议预览 */}
                  <div
                    style={{
                      backgroundColor: '#f9f9f9',
                      padding: '12px',
                      borderRadius: '8px',
                      borderLeft: '3px solid #8B4513',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#999',
                        marginBottom: '4px',
                      }}
                    >
                      💬 AI建议：
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      {comment.aiSuggestion.substring(0, 50)}...
                    </div>
                  </div>

                  {/* 查看详情按钮 */}
                  <div
                    style={{
                      marginTop: '12px',
                      color: '#8B4513',
                      fontSize: '14px',
                      fontWeight: 'bold',
                    }}
                  >
                    查看详情 →
                  </div>
                </div>
              ))
            )}
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
          }}
        >
          <div
            onClick={() => (window.location.href = '/')}
            style={{
              textAlign: 'center',
              fontSize: '12px',
              color: '#999',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '20px' }}>🏠</div>
            <div>主页</div>
          </div>
          <div
            onClick={() => (window.location.href = '/marketing')}
            style={{
              textAlign: 'center',
              fontSize: '12px',
              color: '#999',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '20px' }}>📝</div>
            <div>营销</div>
          </div>
          <div
            style={{ textAlign: 'center', fontSize: '12px', color: '#8B4513' }}
          >
            <div style={{ fontSize: '20px' }}>💬</div>
            <div>评论</div>
          </div>
          <div style={{ textAlign: 'center', fontSize: '12px', color: '#999' }}>
            <div style={{ fontSize: '20px' }}>⚙️</div>
            <div>设置</div>
          </div>
        </nav>
      </div>
    );
  }

  // 详情视图
  const commentType =
    selectedComment.rating >= 4
      ? '好评'
      : selectedComment.rating >= 3
      ? '中评'
      : '差评';
  const typeColor =
    selectedComment.rating >= 4
      ? '#4CAF50'
      : selectedComment.rating >= 3
      ? '#FF9800'
      : '#ff4444';

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
          justifyContent: 'space-between',
        }}
      >
        <span
          onClick={() => setSelectedComment(null)}
          style={{ cursor: 'pointer' }}
        >
          ← 返回
        </span>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>评论详情</span>
        <span
          style={{ fontSize: '24px', cursor: 'pointer' }}
          onClick={() => setSelectedComment(null)}
        >
          ❌
        </span>
      </header>

      {/* 主要内容区 */}
      <main style={{ padding: '20px', paddingBottom: '100px' }}>
        {/* 原始评论 */}
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor:
                  getPlatformColor(selectedComment.platform) + '20',
                color: getPlatformColor(selectedComment.platform),
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {selectedComment.platformName} {getStars(selectedComment.rating)}
            </div>
            <div style={{ fontSize: '12px', color: '#999' }}>
              {selectedComment.time}
            </div>
          </div>

          <div style={{ marginBottom: '8px', fontSize: '14px', color: '#666' }}>
            {selectedComment.userName}
          </div>

          <div
            style={{
              marginBottom: '16px',
              fontSize: '15px',
              lineHeight: '1.8',
              color: '#333',
            }}
          >
            {selectedComment.content}
          </div>

          {/* 评论分析 */}
          <div
            style={{
              backgroundColor: '#f9f9f9',
              padding: '12px',
              borderRadius: '8px',
              borderLeft: '3px solid ' + typeColor,
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              📊 评论分析：
            </div>
            <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
              类型：
              <span style={{ color: typeColor, fontWeight: 'bold' }}>
                {commentType}
              </span>
              {' | '}
              关键词：
              {selectedComment.rating >= 4
                ? '氛围、服务、品质'
                : selectedComment.rating >= 3
                ? '效率、改进'
                : '态度、体验'}
            </div>
          </div>
        </div>

        {/* AI回复建议 */}
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              marginBottom: '16px',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            💬 AI回复建议（选择一个）
          </div>

          {isGeneratingAI ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#999',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>⏳</div>
              <div>AI正在生成回复建议...</div>
              <div style={{ fontSize: '12px', marginTop: '8px' }}>
                大约需要5-10秒
              </div>
            </div>
          ) : (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {aiReplies.map((option, index) => (
                <label
                  key={index}
                  style={{
                    display: 'block',
                    padding: '16px',
                    borderRadius: '8px',
                    border:
                      selectedReply === option.content
                        ? '2px solid #8B4513'
                        : '1px solid #e0e0e0',
                    backgroundColor:
                      selectedReply === option.content ? '#fff9f5' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    <input
                      type="radio"
                      name="reply"
                      checked={selectedReply === option.content}
                      onChange={() => setSelectedReply(option.content)}
                      style={{ marginTop: '4px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: 'bold',
                          marginBottom: '8px',
                          color: '#8B4513',
                        }}
                      >
                        选项{index + 1}：{option.type}
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          lineHeight: '1.6',
                          color: '#333',
                        }}
                      >
                        {option.content}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 编辑区 */}
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              marginBottom: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            ✏️ 编辑回复
          </div>

          <textarea
            value={selectedReply}
            onChange={(e) => setSelectedReply(e.target.value)}
            placeholder="选择上面的建议，或直接输入您的回复..."
            disabled={isGeneratingAI}
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '12px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box',
              lineHeight: '1.6',
              backgroundColor: isGeneratingAI ? '#f5f5f5' : 'white',
            }}
          />
        </div>

        {/* 操作按钮 */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => copyAndMark(selectedReply)}
            disabled={!selectedReply || isGeneratingAI}
            style={{
              flex: 2,
              backgroundColor:
                !selectedReply || isGeneratingAI ? '#ccc' : '#8B4513',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor:
                !selectedReply || isGeneratingAI ? 'not-allowed' : 'pointer',
            }}
          >
            📋 采纳并复制
          </button>
          <button
            onClick={() => markAsReplied(selectedComment.id)}
            disabled={isGeneratingAI}
            style={{
              flex: 1,
              backgroundColor: 'white',
              color: isGeneratingAI ? '#999' : '#8B4513',
              border: isGeneratingAI
                ? '1px solid #e0e0e0'
                : '1px solid #8B4513',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '14px',
              cursor: isGeneratingAI ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
            }}
          >
            ✅ 标记
            <br />
            已回复
          </button>
          <button
            onClick={() => setSelectedComment(null)}
            style={{
              flex: 1,
              backgroundColor: 'white',
              color: '#999',
              border: '1px solid #e0e0e0',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            ⏭️ 跳过
          </button>
        </div>
      </main>
    </div>
  );
}
