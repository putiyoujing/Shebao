// 自动化测试脚本 - 在浏览器控制台中运行
(async function runTests() {
  console.log('🚀 开始测试五险一金计算器...\n');

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  // 测试辅助函数
  async function test(name, testFn) {
    try {
      console.log(`⏳ 测试: ${name}`);
      const result = await testFn();
      if (result.success) {
        console.log(`✅ ${name} - 通过\n`);
        results.passed++;
      } else {
        console.log(`❌ ${name} - 失败: ${result.message}\n`);
        results.failed++;
      }
      results.tests.push({ name, success: result.success, message: result.message });
    } catch (error) {
      console.log(`❌ ${name} - 错误: ${error.message}\n`);
      results.failed++;
      results.tests.push({ name, success: false, message: error.message });
    }
  }

  // 1. 测试 API 连接
  await test('API - 获取城市列表', async () => {
    const response = await fetch('/api/cities');
    const data = await response.json();
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (!data.success) throw new Error(data.message);
    return { success: true, data: data.cities };
  });

  // 2. 测试文件上传 API（模拟）
  await test('API - 文件上传端点可访问', async () => {
    const response = await fetch('/api/upload/cities', {
      method: 'POST',
      body: new FormData()
    });
    const data = await response.json();
    // 期望返回错误，因为没传文件
    if (!data.success && data.message.includes('请选择')) {
      return { success: true };
    }
    throw new Error('未正确处理空文件请求');
  });

  // 3. 测试计算 API
  await test('API - 计算端点响应', async () => {
    const response = await fetch('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cityName: '测试', year: '2024' })
    });
    const data = await response.json();
    // 期望失败，因为没有数据
    if (!data.success) {
      return { success: true, message: '正确返回错误: ' + data.message };
    }
    throw new Error('应该返回错误');
  });

  // 4. 测试结果 API
  await test('API - 获取结果列表', async () => {
    const response = await fetch('/api/results');
    const data = await response.json();
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (!data.success) throw new Error(data.message);
    return { success: true, count: data.data.length };
  });

  // 5. 检查页面元素
  await test('页面 - 主页元素存在', () => {
    if (window.location.pathname !== '/') {
      window.location.href = '/';
      // 等待页面加载
      return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
    }

    const title = document.querySelector('h1');
    if (!title || !title.textContent.includes('五险一金计算器')) {
      throw new Error('标题未找到');
    }

    const cards = document.querySelectorAll('a[href="/upload"], a[href="/results"]');
    if (cards.length !== 2) {
      throw new Error('导航卡片数量不正确');
    }

    return { success: true };
  });

  // 6. 测试页面跳转
  await test('页面 - 跳转到上传页面', () => {
    window.location.href = '/upload';
    return new Promise(resolve => {
      setTimeout(() => {
        if (window.location.pathname === '/upload') {
          resolve({ success: true });
        } else {
          resolve({ success: false, message: '页面未正确跳转' });
        }
      }, 500);
    });
  });

  // 7. 检查上传页面元素
  await test('页面 - 上传页面元素', () => {
    const citySelector = document.querySelector('select') || document.querySelector('[role="combobox"]');
    const uploadAreas = document.querySelectorAll('[class*="border-dashed"]');

    if (!citySelector) {
      throw new Error('城市选择器未找到');
    }

    if (uploadAreas.length < 2) {
      throw new Error('上传区域数量不足');
    }

    return { success: true };
  });

  // 总结
  console.log('📊 测试结果汇总:');
  console.log(`✅ 通过: ${results.passed}`);
  console.log(`❌ 失败: ${results.failed}`);
  console.log(`📈 成功率: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(2)}%`);

  if (results.failed > 0) {
    console.log('\n❌ 失败的测试:');
    results.tests.filter(t => !t.success).forEach(t => {
      console.log(`  - ${t.name}: ${t.message}`);
    });
  }

  console.log('\n💡 手动测试建议:');
  console.log('1. 使用真实的 Excel 文件测试上传功能');
  console.log('2. 执行完整的计算流程');
  console.log('3. 测试数据导出功能');

  return results;
})();