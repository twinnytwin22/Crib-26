/**
 * Test script to verify two-way chat communication
 * 
 * Run with: node scripts/test-chat.mjs
 */

const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';
const TEST_EMAIL = 'test@example.com';
const TEST_MESSAGE = 'Hello from test script!';

async function testOutbound() {
  console.log('\n🧪 Testing Outbound (Website → Google Chat)...\n');
  
  try {
    const response = await fetch(`${SITE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: TEST_MESSAGE,
        email: TEST_EMAIL,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Outbound test failed:', data.error);
      return null;
    }

    console.log('✅ Message sent successfully!');
    console.log('📋 Session info:', data.session);
    console.log('💬 Reply:', data.reply);
    
    return {
      session: data.session,
      cookie: response.headers.get('set-cookie'),
    };
  } catch (error) {
    console.error('❌ Outbound test error:', error.message);
    return null;
  }
}

async function testInbound(outboundResult) {
  if (!outboundResult?.cookie) {
    console.log('\n⏭️  Skipping inbound test (no session cookie)\n');
    return;
  }

  console.log('\n🧪 Testing Inbound (Fetch Messages)...\n');
  console.log(`📌 Session ID: ${outboundResult.session?.id || 'unknown'}`);
  console.log('⏸️  Now reply to this message in Google Chat...');
  console.log('⏸️  Waiting 15 seconds for reply...\n');
  
  await new Promise(resolve => setTimeout(resolve, 15000));
  
  try {
    const response = await fetch(`${SITE_URL}/api/chat/messages`, {
      headers: {
        Cookie: outboundResult.cookie.split(';')[0],
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Message fetch failed:', data.error);
      return;
    }

    console.log(`✅ Fetched ${data.messages.length} messages:`);
    data.messages.forEach((msg, i) => {
      const timestamp = new Date(msg.timestamp).toLocaleTimeString();
      const sender = msg.sender === 'user' ? '👤' : '🤖';
      console.log(`  ${i + 1}. ${sender} [${timestamp}] ${msg.content.substring(0, 60)}...`);
    });

    const agentReplies = data.messages.filter(m => m.sender === 'bot' && m.source === 'google_chat');
    if (agentReplies.length > 0) {
      console.log('\n✅ Two-way communication is working! Agent replies found:', agentReplies.length);
    } else {
      console.log('\n⚠️  No agent replies yet. Make sure you replied in Google Chat.');
    }
  } catch (error) {
    console.error('❌ Inbound test error:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting Chat Bot Two-Way Communication Test\n');
  console.log(`🌐 Site URL: ${SITE_URL}`);
  console.log(`📧 Test Email: ${TEST_EMAIL}`);
  
  const outboundResult = await testOutbound();
  
  if (outboundResult?.session?.id) {
    await testInbound(outboundResult);
  }
  
  console.log('\n✨ Test complete!\n');
}

main().catch(console.error);
