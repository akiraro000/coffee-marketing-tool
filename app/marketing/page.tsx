'use client';

import { useState, useRef } from 'react';

export default function MarketingPage() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('xiaohongshu');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const platforms = [
    { id: 'xiaohongshu', name: '小红书图文', recommended: true },
    { id: 'wechat', name: '微信公众号长文', recommended: false },
    { id: 'douyin', name: '抖音短视频脚本', recommended: false },
    { id: 'dianping', name: '大众点评商家动态', recommended: false },
  ];

  // 真正的图片上传处理
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // 转换为数组并处理每个文件
    const fileArray = Array.from(files);

    fileArray.forEach((file) => {
      // 检查是否是图片
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件！');
        return;
      }

      // 检查文件大小（5MB限制）
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过5MB！');
        return;
      }

      // 使用FileReader读取图片
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (selectedImages.length < 9) {
          setSelectedImages([...selectedImages, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // 触发文件选择
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // 删除图片
  const removeImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      // 构建AI提示词
      const platformName =
        platforms.find((p) => p.id === selectedPlatform)?.name || '小红书图文';

      const prompt = `请为以下内容生成适合${platformName}平台的营销文案：

  【产品/活动描述】
  ${description}

  【上传图片数量】
  ${selectedImages.length}张图片

  【要求】
  1. 生成一个吸引人的标题（15-25字，带emoji）
  2. 写一段正文（100-300字，口语化，符合平台调性）
  3. 提供3-8个相关话题标签
  4. 给出发布建议（最佳时间、目标人群）

  请直接以JSON格式返回，格式如下：
  {
    "title": "标题",
    "content": "正文内容",
    "tags": ["标签1", "标签2", "标签3"],
    "bestTime": "最佳发布时间",
    "targetAudience": "目标人群",
    "tips": "配图建议"
  }`;

      // 调用豆包API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          type: 'marketing',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API错误:', errorData);
        alert('AI生成失败：' + (errorData.error || '未知错误'));
        setIsGenerating(false);
        return;
      }

      const data = await response.json();

      // 解析返回的内容
      let generatedData;
      try {
        // 尝试解析JSON
        const jsonMatch = data.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          generatedData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('无法解析AI返回的内容');
        }
      } catch (e) {
        // 如果解析失败，使用原始内容
        console.error('解析失败，使用原始内容:', e);
        generatedData = {
          title: '✨ AI生成的营销内容',
          content: data.content,
          tags: ['#咖啡厅', '#推荐'],
          bestTime: '工作日上午10点或周末下午',
          targetAudience: '20-35岁年轻人群',
          tips: '建议使用高质量图片，搭配自然光线拍摄',
        };
      }

      setGeneratedContent(generatedData);
      setIsGenerating(false);
    } catch (error) {
      console.error('生成错误:', error);
      alert('生成失败，请重试');
      setIsGenerating(false);
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
          智能营销内容生成
        </span>
      </header>

      {/* 主要内容区 */}
      <main style={{ padding: '20px', paddingBottom: '100px' }}>
        {/* 步骤1：上传图片 */}
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h3
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            1️⃣ 上传图片
          </h3>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              minHeight: '100px',
              border: '2px dashed #e0e0e0',
              borderRadius: '8px',
              padding: '16px',
              alignItems: 'center',
            }}
          >
            {selectedImages.map((img, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img
                  src={img}
                  alt={`上传的图片${index + 1}`}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                  }}
                />
                <button
                  onClick={() => removeImage(index)}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ×
                </button>
              </div>
            ))}

            <button
              onClick={triggerFileInput}
              disabled={selectedImages.length >= 9}
              style={{
                width: '80px',
                height: '80px',
                backgroundColor:
                  selectedImages.length >= 9 ? '#f0f0f0' : '#8B4513',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: selectedImages.length >= 9 ? 'not-allowed' : 'pointer',
                fontSize: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ➕
            </button>

            {/* 隐藏的文件输入 */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
          </div>

          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#999' }}>
            提示：最多上传9张图片，第一张将作为封面图（当前
            {selectedImages.length}/9）
          </p>
        </div>

        {/* 步骤2：输入描述 */}
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h3
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            2️⃣ 描述你的内容
          </h3>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="描述一下你的新品灵感、活动想法，或者任何想要推广的内容...&#10;&#10;示例：这是一款以桂花为灵感的秋季特调，结合了咖啡和桂花的香气，非常适合秋日下午茶..."
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '12px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />

          <div
            style={{
              marginTop: '8px',
              textAlign: 'right',
              fontSize: '12px',
              color: '#999',
            }}
          >
            {description.length}/500
          </div>
        </div>

        {/* 步骤3：选择平台 */}
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h3
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            3️⃣ 选择发布平台
          </h3>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {platforms.map((platform) => (
              <label
                key={platform.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  border: `2px solid ${
                    selectedPlatform === platform.id ? '#8B4513' : '#e0e0e0'
                  }`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor:
                    selectedPlatform === platform.id ? '#fff9f5' : 'white',
                }}
              >
                <input
                  type="radio"
                  name="platform"
                  checked={selectedPlatform === platform.id}
                  onChange={() => setSelectedPlatform(platform.id)}
                  style={{ marginRight: '12px' }}
                />
                <span style={{ flex: 1 }}>
                  {platform.name}
                  {platform.recommended && (
                    <span
                      style={{
                        marginLeft: '8px',
                        backgroundColor: '#8B4513',
                        color: 'white',
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      推荐
                    </span>
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 生成按钮 */}
        <button
          onClick={handleGenerate}
          disabled={!description || selectedImages.length === 0 || isGenerating}
          style={{
            width: '100%',
            backgroundColor:
              !description || selectedImages.length === 0 || isGenerating
                ? '#ccc'
                : '#8B4513',
            color: 'white',
            border: 'none',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor:
              !description || selectedImages.length === 0 || isGenerating
                ? 'not-allowed'
                : 'pointer',
            marginBottom: '20px',
          }}
        >
          {isGenerating ? '⏳ 生成中...' : '✨ 生成营销内容'}
        </button>

        {/* 生成结果 */}
        {generatedContent && (
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <div
              style={{
                marginBottom: '16px',
                color: '#4CAF50',
                fontSize: '14px',
              }}
            >
              ✅ 内容已生成！
            </div>

            {/* 平台标签 */}
            <div
              style={{
                display: 'inline-block',
                backgroundColor: '#8B4513',
                color: 'white',
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '4px',
                marginBottom: '12px',
              }}
            >
              📱 {platforms.find((p) => p.id === selectedPlatform)?.name}
            </div>

            {/* 标题 */}
            <div
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '12px',
                lineHeight: '1.4',
              }}
            >
              {generatedContent.title}
            </div>

            {/* 正文 */}
            <div
              style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#333',
                whiteSpace: 'pre-line',
                marginBottom: '16px',
              }}
            >
              {generatedContent.content}
            </div>

            {/* 标签 */}
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}
              >
                标签：
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {generatedContent.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: '#f0f0f0',
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      color: '#666',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 发布建议 */}
            <div
              style={{
                backgroundColor: '#f9f9f9',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                }}
              >
                💡 发布建议：
              </div>
              <div
                style={{ fontSize: '12px', color: '#666', lineHeight: '1.6' }}
              >
                ⏰ 最佳发布时间：{generatedContent.bestTime}
                <br />
                👥 目标人群：{generatedContent.targetAudience}
              </div>
            </div>

            {/* 配图建议 */}
            <div
              style={{
                backgroundColor: '#fff9f5',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                }}
              >
                📸 配图建议：
              </div>
              <div
                style={{ fontSize: '12px', color: '#666', lineHeight: '1.6' }}
              >
                {generatedContent.tips}
              </div>
            </div>

            {/* 操作按钮 */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${generatedContent.title}\n\n${
                      generatedContent.content
                    }\n\n${generatedContent.tags.join(' ')}`
                  );
                  alert('内容已复制到剪贴板！');
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#8B4513',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                📋 复制内容
              </button>
              <button
                onClick={() => {
                  setGeneratedContent(null);
                  setDescription('');
                  setSelectedImages([]);
                }}
                style={{
                  flex: 1,
                  backgroundColor: 'white',
                  color: '#8B4513',
                  border: '1px solid #8B4513',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                🔄 重新生成
              </button>
            </div>
          </div>
        )}
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
          style={{ textAlign: 'center', fontSize: '12px', color: '#8B4513' }}
        >
          <div style={{ fontSize: '20px' }}>📝</div>
          <div>营销</div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '12px', color: '#999' }}>
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
