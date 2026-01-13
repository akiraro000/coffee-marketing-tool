import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// 阿里云短信配置（需要从环境变量读取）
const ALIYUN_ACCESS_KEY_ID = process.env.ALIYUN_ACCESS_KEY_ID || '';
const ALIYUN_ACCESS_KEY_SECRET = process.env.ALIYUN_ACCESS_KEY_SECRET || '';
const ALIYUN_SIGN_NAME = process.env.ALIYUN_SIGN_NAME || '咖啡营销助手';
const ALIYUN_TEMPLATE_CODE = process.env.ALIYUN_TEMPLATE_CODE || 'SMS_123456789';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phoneNumber)) {
      return NextResponse.json(
        { error: '手机号格式不正确' },
        { status: 400 }
      );
    }

    // 生成6位随机验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // TODO: 调用阿里云短信API发送验证码
    // 目前先使用console.log模拟，方便测试
    console.log('========== 短信验证码 ==========');
    console.log(`手机号: ${phoneNumber}`);
    console.log(`验证码: ${code}`);
    console.log(`有效期: 10分钟`);
    console.log('==============================');

    // 实际调用阿里云短信API的代码（需要安装阿里云SDK）
    // const Core = require('@alicloud/pop-core');
    // const client = new Core({
    //   accessKeyId: ALIYUN_ACCESS_KEY_ID,
    //   accessKeySecret: ALIYUN_ACCESS_KEY_SECRET,
    //   endpoint: 'https://dysmsapi.aliyuncs.com',
    //   apiVersion: '2017-05-25'
    // });

    // const result = await client.request('SendSms', {
    //   PhoneNumbers: phoneNumber,
    //   SignName: ALIYUN_SIGN_NAME,
    //   TemplateCode: ALIYUN_TEMPLATE_CODE,
    //   TemplateParam: JSON.stringify({ code })
    // });

    // 将验证码存储到数据库（实际应该设置过期时间）
    const supabase = createClient();

    // 先删除该手机号的旧验证码
    await supabase
      .from('verification_codes')
      .delete()
      .eq('phone', phoneNumber);

    // 插入新验证码
    const { error: insertError } = await supabase
      .from('verification_codes')
      .insert({
        phone: phoneNumber,
        code,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10分钟后过期
      });

    if (insertError) {
      console.error('保存验证码失败:', insertError);
      return NextResponse.json(
        { error: '保存验证码失败' },
        { status: 500 }
      );
    }

    // 开发环境返回验证码（生产环境应该删除）
    const isDev = process.env.NODE_ENV === 'development';
    return NextResponse.json({
      success: true,
      message: '验证码已发送',
      ...(isDev && { code }), // 开发环境返回验证码方便测试
    });
  } catch (error) {
    console.error('发送验证码错误:', error);
    return NextResponse.json(
      { error: '发送失败，请重试' },
      { status: 500 }
    );
  }
}
