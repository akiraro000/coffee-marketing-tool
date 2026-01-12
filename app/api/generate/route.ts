import { NextRequest, NextResponse } from 'next/server';

// 豆包API配置（使用通用配置）
const DOUBAO_API_URL =
  'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const { prompt, type } = await request.json();

    const apiKey = process.env.DOUBAO_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API密钥未配置' }, { status: 500 });
    }

    // 根据类型生成不同的prompt
    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'marketing') {
      systemPrompt =
        '你是一位专业的社交媒体营销专家，擅长为咖啡厅和酒吧创作吸引人的营销内容。你的文案风格活泼、真实，善于使用emoji，能够吸引年轻用户。';
      userPrompt = prompt;
    } else if (type === 'reply') {
      systemPrompt =
        '你是一位专业的商家客服代表，擅长回复顾客评论。你的回复风格友好、专业，能够妥善处理各种类型的评论（好评、中评、差评）。';
      userPrompt = prompt;
    }

    console.log('调用豆包API...', { type, promptLength: userPrompt.length });

    // 调用豆包API
    const response = await fetch(DOUBAO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'ep-20260112133715-ldlwp', // 使用豆包常用模型
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('豆包API错误:', response.status, errorText);

      let errorMessage = '豆包API调用失败';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorMessage;
      } catch (e) {
        // 如果解析失败，使用原始错误信息
      }

      return NextResponse.json(
        { error: errorMessage, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('豆包API返回数据格式错误:', data);
      return NextResponse.json(
        { error: '豆包API返回数据格式错误', data },
        { status: 500 }
      );
    }

    const generatedContent = data.choices[0].message.content;

    return NextResponse.json({ content: generatedContent });
  } catch (error) {
    console.error('API调用错误:', error);
    return NextResponse.json(
      {
        error: '服务器错误',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}
