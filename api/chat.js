import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    // 验证消息
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: '消息不能为空' });
    }

    if (message.length > 2000) {
      return res.status(400).json({ error: '消息过长' });
    }

    // 调用 OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '你是一个友好的助手，帮助用户解答问题。请用简洁、友好的方式回复。',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = response.choices[0].message.content;

    return res.status(200).json({
      success: true,
      reply: reply,
    });
  } catch (error) {
    console.error('OpenAI API 错误:', error);

    // 处理特定的错误
    if (error.status === 401) {
      return res.status(401).json({ error: 'API 密钥无效' });
    }

    if (error.status === 429) {
      return res.status(429).json({ error: '请求过于频繁，请稍后再试' });
    }

    return res.status(500).json({
      error: '服务器错误，请稍后再试',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
