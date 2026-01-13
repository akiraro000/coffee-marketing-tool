import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json();

    // 验证手机号和验证码格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: '手机号格式不正确' },
        { status: 400 }
      );
    }

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { error: '验证码格式不正确' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // 查询验证码
    const { data: codeData, error: codeError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('phone', phone)
      .eq('code', code)
      .order('created_at', { ascending: false })
      .limit(1);

    if (codeError) {
      console.error('查询验证码失败:', codeError);
      return NextResponse.json(
        { error: '验证码验证失败' },
        { status: 500 }
      );
    }

    // 检查验证码是否存在
    if (!codeData || codeData.length === 0) {
      return NextResponse.json(
        { error: '验证码错误' },
        { status: 400 }
      );
    }

    const verificationCode = codeData[0];

    // 检查验证码是否过期
    const expiresAt = new Date(verificationCode.expires_at);
    if (expiresAt < new Date()) {
      return NextResponse.json(
        { error: '验证码已过期，请重新获取' },
        { status: 400 }
      );
    }

    // 验证码正确，删除已使用的验证码
    await supabase
      .from('verification_codes')
      .delete()
      .eq('id', verificationCode.id);

    // 检查用户是否已存在
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    let userId;

    if (existingUser) {
      // 用户已存在，更新最后登录时间
      userId = existingUser.id;
      await supabase
        .from('users')
        .update({
          last_login: new Date().toISOString(),
        })
        .eq('id', userId);
    } else {
      // 新用户，创建用户记录
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          phone,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return NextResponse.json(
          { error: '创建用户失败' },
          { status: 500 }
        );
      }

      userId = newUser.id;
    }

    // 使用Supabase Auth创建session
    // 由于Supabase Auth的OTP功能需要发送邮件，我们使用自定义的session管理
    // 这里简化处理，使用Supabase的magic link或直接创建auth user

    // 创建一个简单的session token
    const token = Buffer.from(`${userId}:${Date.now()}`).toString('base64');

    // 返回成功响应
    return NextResponse.json({
      success: true,
      message: '登录成功',
      userId,
      token,
      isNewUser: !existingUser,
    });
  } catch (error) {
    console.error('登录错误:', error);
    return NextResponse.json(
      { error: '登录失败，请重试' },
      { status: 500 }
    );
  }
}
