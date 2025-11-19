import { http, HttpResponse } from 'msw';
import {
  mockUser,
  mockDevices,
  mockHealthChecks,
  mockThreats,
  mockTransactions,
  generateMockToken,
  mockSDKVersions,
  mockDistributions,
  mockVersionUpdates,
  mockPushTasks,
  deviceSDKVersions,
  deviceKeyStatus,
} from './data';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
console.log('MSW: Base URL is', baseURL);
console.log('MSW: Handlers initialized');

export const handlers = [
  // 登录
  http.post(`${baseURL}/auth/login`, async ({ request }) => {
    console.log('MSW: 收到登录请求');
    const body = (await request.json()) as { username: string; password: string };
    console.log('MSW: 登录数据', body);

    // 支持多种用户名格式：admin 或 admin@sunbay.com
    const validUsernames = ['admin', 'admin@sunbay.com'];
    if (validUsernames.includes(body.username) && body.password === 'admin123') {
      console.log('MSW: 登录成功');
      return HttpResponse.json({
        code: 200,
        data: {
          token: generateMockToken(),
          refreshToken: generateMockToken(),
          user: mockUser,
        },
      });
    }

    console.log('MSW: 登录失败');
    return HttpResponse.json({ code: 401, message: '用户名或密码错误' }, { status: 401 });
  }),

  // 登出
  http.post(`${baseURL}/auth/logout`, () => {
    console.log('MSW: 收到登出请求');
    return HttpResponse.json({ code: 200, message: '登出成功' });
  }),

  // 刷新Token
  http.post(`${baseURL}/auth/refresh`, async ({ request }) => {
    console.log('MSW: 收到刷新Token请求');
    const body = (await request.json()) as { refreshToken: string };
    
    if (body.refreshToken) {
      return HttpResponse.json({
        code: 200,
        data: {
          token: generateMockToken(),
          refreshToken: generateMockToken(),
        },
      });
    }
    
    return HttpResponse.json({ code: 401, message: 'Refresh token无效' }, { status: 401 });
  }),

  // 获取设备列表
  http.get(`${baseURL}/devices`, ({ request }) => {
    console.log('MSW: 收到设备列表请求');
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');

    let filteredDevices = mockDevices;

    if (status) {
      filteredDevices = filteredDevices.filter((d) => d.status === status);
    }

    if (search) {
      filteredDevices = filteredDevices.filter(
        (d) =>
          d.id.includes(search) ||
          d.imei.includes(search) ||
          d.merchantName.includes(search)
      );
    }

    return HttpResponse.json({
      code: 200,
      data: {
        items: filteredDevices,
        total: filteredDevices.length,
        page: 1,
        pageSize: 20,
      },
    });
  }),

  // 获取设备详情
  http.get(`${baseURL}/devices/:id`, ({ params }) => {
    const device = mockDevices.find((d) => d.id === params.id);
    if (device) {
      const healthChecks = mockHealthChecks.filter((hc) => hc.deviceId === device.id);
      return HttpResponse.json({
        code: 200,
        data: {
          device,
          recentHealthChecks: healthChecks,
        },
      });
    }
    return HttpResponse.json({ code: 404, message: '设备不存在' }, { status: 404 });
  }),

  // 审批设备
  http.post(`${baseURL}/devices/:id/approve`, () => {
    return HttpResponse.json({ code: 200, message: '审批成功' });
  }),

  // 暂停设备
  http.post(`${baseURL}/devices/:id/suspend`, () => {
    return HttpResponse.json({ code: 200, message: '暂停成功' });
  }),

  // 恢复设备
  http.post(`${baseURL}/devices/:id/resume`, () => {
    return HttpResponse.json({ code: 200, message: '恢复成功' });
  }),

  // 吊销设备
  http.post(`${baseURL}/devices/:id/revoke`, () => {
    return HttpResponse.json({ code: 200, message: '吊销成功' });
  }),

  // 获取健康检查记录
  http.get(`${baseURL}/devices/:id/health-checks`, ({ params }) => {
    const healthChecks = mockHealthChecks.filter((hc) => hc.deviceId === params.id);
    return HttpResponse.json({
      code: 200,
      data: { healthChecks },
    });
  }),

  // 健康概览
  http.get(`${baseURL}/dashboard/health-overview`, () => {
    console.log('MSW: 收到健康概览请求');
    const activeDevices = mockDevices.filter((d) => d.status === 'ACTIVE');
    const abnormalDevices = mockDevices.filter((d) => d.securityScore < 60);
    const avgScore =
      mockDevices.reduce((sum, d) => sum + d.securityScore, 0) / mockDevices.length;

    return HttpResponse.json({
      code: 200,
      data: {
        totalDevices: mockDevices.length,
        onlineDevices: activeDevices.length,
        abnormalDevices: abnormalDevices.length,
        averageSecurityScore: Math.round(avgScore),
        statusDistribution: [
          { status: 'ACTIVE', count: activeDevices.length },
          {
            status: 'PENDING',
            count: mockDevices.filter((d) => d.status === 'PENDING').length,
          },
          {
            status: 'SUSPENDED',
            count: mockDevices.filter((d) => d.status === 'SUSPENDED').length,
          },
        ],
        scoreDistribution: [
          {
            range: '80-100',
            count: mockDevices.filter((d) => d.securityScore >= 80).length,
          },
          {
            range: '60-80',
            count: mockDevices.filter((d) => d.securityScore >= 60 && d.securityScore < 80)
              .length,
          },
          {
            range: '0-60',
            count: mockDevices.filter((d) => d.securityScore < 60).length,
          },
        ],
        recentAbnormalDevices: abnormalDevices.map((d) => ({
          id: d.id,
          merchantName: d.merchantName,
          securityScore: d.securityScore,
          lastCheckAt: d.lastActiveAt,
        })),
      },
    });
  }),

  // 获取威胁事件列表
  http.get(`${baseURL}/threats`, ({ request }) => {
    console.log('MSW: 收到威胁事件列表请求');
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const severity = url.searchParams.get('severity');
    const status = url.searchParams.get('status');

    let filteredThreats = mockThreats;

    if (type) {
      filteredThreats = filteredThreats.filter((t) => t.type === type);
    }
    if (severity) {
      filteredThreats = filteredThreats.filter((t) => t.severity === severity);
    }
    if (status) {
      filteredThreats = filteredThreats.filter((t) => t.status === status);
    }

    return HttpResponse.json({
      code: 200,
      data: {
        items: filteredThreats,
        total: filteredThreats.length,
        page: 1,
        pageSize: 20,
      },
    });
  }),

  // 处理威胁事件
  http.post(`${baseURL}/threats/:id/resolve`, () => {
    return HttpResponse.json({ code: 200, message: '处理成功' });
  }),

  // 获取交易列表
  http.get(`${baseURL}/transactions`, () => {
    console.log('MSW: 收到交易列表请求');
    return HttpResponse.json({
      code: 200,
      data: {
        items: mockTransactions,
        total: mockTransactions.length,
        page: 1,
        pageSize: 20,
      },
    });
  }),

  // ========== SDK版本管理 ==========

  // 获取SDK版本列表
  http.get(`${baseURL}/sdk-versions`, ({ request }) => {
    console.log('MSW: 收到SDK版本列表请求');
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const sortBy = url.searchParams.get('sortBy') || 'releasedAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';

    let filteredVersions = mockSDKVersions;

    if (status) {
      filteredVersions = filteredVersions.filter((v) => v.status === status);
    }

    // 排序
    filteredVersions.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'version') {
        const [aMajor, aMinor, aPatch] = a.version.split('.').map(Number);
        const [bMajor, bMinor, bPatch] = b.version.split('.').map(Number);
        comparison =
          aMajor - bMajor || aMinor - bMinor || aPatch - bPatch;
      } else if (sortBy === 'releasedAt') {
        comparison =
          new Date(a.releasedAt).getTime() - new Date(b.releasedAt).getTime();
      } else if (sortBy === 'deviceCount') {
        comparison = a.deviceCount - b.deviceCount;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return HttpResponse.json({
      versions: filteredVersions,
      total: filteredVersions.length,
    });
  }),

  // 获取SDK版本详情
  http.get(`${baseURL}/sdk-versions/:id`, ({ params }) => {
    console.log('MSW: 收到SDK版本详情请求', params.id);
    const version = mockSDKVersions.find((v) => v.id === params.id);
    if (version) {
      return HttpResponse.json(version);
    }
    return HttpResponse.json({ message: '版本不存在' }, { status: 404 });
  }),

  // 创建SDK版本
  http.post(`${baseURL}/sdk-versions`, async ({ request }) => {
    console.log('MSW: 收到创建SDK版本请求');
    const body = await request.json();
    const newVersion = {
      id: `version-${Date.now()}`,
      ...(body as any),
      releasedAt: new Date().toISOString(),
      releasedBy: 'admin',
      deviceCount: 0,
      adoptionRate: 0,
    };
    mockSDKVersions.unshift(newVersion);
    return HttpResponse.json({ version: newVersion });
  }),

  // 更新SDK版本
  http.put(`${baseURL}/sdk-versions/:id`, async ({ params, request }) => {
    console.log('MSW: 收到更新SDK版本请求', params.id);
    const body = await request.json();
    const index = mockSDKVersions.findIndex((v) => v.id === params.id);
    if (index !== -1) {
      mockSDKVersions[index] = { ...mockSDKVersions[index], ...(body as any) };
      return HttpResponse.json(mockSDKVersions[index]);
    }
    return HttpResponse.json({ message: '版本不存在' }, { status: 404 });
  }),

  // 删除SDK版本
  http.delete(`${baseURL}/sdk-versions/:id`, ({ params }) => {
    console.log('MSW: 收到删除SDK版本请求', params.id);
    const index = mockSDKVersions.findIndex((v) => v.id === params.id);
    if (index !== -1) {
      mockSDKVersions.splice(index, 1);
      return HttpResponse.json({ message: '删除成功' });
    }
    return HttpResponse.json({ message: '版本不存在' }, { status: 404 });
  }),

  // 获取版本统计信息
  http.get(`${baseURL}/sdk-versions/:id/statistics`, ({ params }) => {
    console.log('MSW: 收到版本统计请求', params.id);
    const version = mockSDKVersions.find((v) => v.id === params.id);
    if (version) {
      return HttpResponse.json({
        version,
        deviceCount: version.deviceCount,
        adoptionRate: version.adoptionRate,
        devicesByStatus: [
          { status: 'ACTIVE', count: version.deviceCount },
          { status: 'SUSPENDED', count: 0 },
        ],
        devicesByMerchant: [
          { merchantId: 'merchant-001', merchantName: '星巴克咖啡', count: 1 },
          { merchantId: 'merchant-002', merchantName: '麦当劳', count: 1 },
        ],
        updateTrend: [
          { date: '2024-11-10', count: 0 },
          { date: '2024-11-11', count: 1 },
          { date: '2024-11-12', count: 1 },
          { date: '2024-11-13', count: 0 },
          { date: '2024-11-14', count: 1 },
        ],
      });
    }
    return HttpResponse.json({ message: '版本不存在' }, { status: 404 });
  }),

  // 获取兼容性矩阵
  http.get(`${baseURL}/sdk-versions/compatibility-matrix`, () => {
    console.log('MSW: 收到兼容性矩阵请求');
    return HttpResponse.json({
      matrix: mockSDKVersions.map((v) => ({
        sdkVersion: v.version,
        minApiVersion: v.minApiVersion,
        maxApiVersion: v.maxApiVersion,
        status: v.status,
      })),
    });
  }),

  // 获取设备SDK版本信息
  http.get(`${baseURL}/devices/:id/sdk-version`, ({ params }) => {
    console.log('MSW: 收到设备SDK版本请求', params.id);
    const currentVersion = deviceSDKVersions[params.id as string] || '2.0.5';
    const latestVersion = mockSDKVersions.find((v) => v.status === 'ACTIVE');
    return HttpResponse.json({
      currentVersion,
      lastUpdatedAt: '2024-11-01T10:00:00Z',
      availableVersion: latestVersion?.version,
      updateRequired: currentVersion !== latestVersion?.version,
    });
  }),

  // ========== 版本分发策略 ==========

  // 创建分发策略
  http.post(`${baseURL}/sdk-versions/:id/distribution`, async ({ params, request }) => {
    console.log('MSW: 收到创建分发策略请求', params.id);
    const body = await request.json();
    const newDistribution = {
      id: `dist-${Date.now()}`,
      versionId: params.id as string,
      ...(body as any),
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
    };
    mockDistributions.push(newDistribution);
    return HttpResponse.json({ distribution: newDistribution });
  }),

  // 获取分发策略
  http.get(`${baseURL}/sdk-versions/:id/distribution`, ({ params }) => {
    console.log('MSW: 收到获取分发策略请求', params.id);
    const distribution = mockDistributions.find((d) => d.versionId === params.id);
    if (distribution) {
      return HttpResponse.json({
        distribution,
        affectedDeviceCount: 4,
      });
    }
    return HttpResponse.json({ message: '分发策略不存在' }, { status: 404 });
  }),

  // 更新分发策略
  http.put(`${baseURL}/distributions/:id`, async ({ params, request }) => {
    console.log('MSW: 收到更新分发策略请求', params.id);
    const body = await request.json();
    const index = mockDistributions.findIndex((d) => d.id === params.id);
    if (index !== -1) {
      mockDistributions[index] = { ...mockDistributions[index], ...(body as any) };
      return HttpResponse.json(mockDistributions[index]);
    }
    return HttpResponse.json({ message: '分发策略不存在' }, { status: 404 });
  }),

  // ========== 版本更新监控 ==========

  // 获取版本更新记录
  http.get(`${baseURL}/version-updates`, ({ request }) => {
    console.log('MSW: 收到版本更新记录请求');
    const url = new URL(request.url);
    const deviceId = url.searchParams.get('deviceId');
    const versionId = url.searchParams.get('versionId');
    const status = url.searchParams.get('status');

    let filteredUpdates = mockVersionUpdates;

    if (deviceId) {
      filteredUpdates = filteredUpdates.filter((u) => u.deviceId === deviceId);
    }
    if (versionId) {
      filteredUpdates = filteredUpdates.filter((u) => u.toVersion === versionId);
    }
    if (status) {
      filteredUpdates = filteredUpdates.filter((u) => u.status === status);
    }

    return HttpResponse.json({
      updates: filteredUpdates,
      total: filteredUpdates.length,
    });
  }),

  // 获取更新监控仪表板
  http.get(`${baseURL}/version-updates/dashboard`, () => {
    console.log('MSW: 收到更新监控仪表板请求');
    return HttpResponse.json({
      pendingCount: mockVersionUpdates.filter((u) => u.status === 'PENDING').length,
      downloadingCount: mockVersionUpdates.filter((u) => u.status === 'DOWNLOADING')
        .length,
      installingCount: mockVersionUpdates.filter((u) => u.status === 'INSTALLING').length,
      successCount: mockVersionUpdates.filter((u) => u.status === 'SUCCESS').length,
      failedCount: mockVersionUpdates.filter((u) => u.status === 'FAILED').length,
      updateTrend: [
        { date: '2024-11-10', success: 0, failed: 0 },
        { date: '2024-11-11', success: 1, failed: 0 },
        { date: '2024-11-12', success: 1, failed: 0 },
        { date: '2024-11-13', success: 0, failed: 1 },
        { date: '2024-11-14', success: 1, failed: 0 },
      ],
      outdatedDevices: mockDevices.filter((d) => {
        const version = deviceSDKVersions[d.id];
        return version && version !== '2.1.0';
      }),
    });
  }),

  // 获取过期版本设备
  http.get(`${baseURL}/devices/outdated`, () => {
    console.log('MSW: 收到过期版本设备请求');
    const outdatedDevices = mockDevices.filter((d) => {
      const version = deviceSDKVersions[d.id];
      return version && version !== '2.1.0';
    });
    return HttpResponse.json({
      devices: outdatedDevices.map((d) => ({
        ...d,
        daysSinceRelease: 180,
      })),
      total: outdatedDevices.length,
    });
  }),

  // ========== 版本推送任务 ==========

  // 创建推送任务
  http.post(`${baseURL}/version-push-tasks`, async ({ request }) => {
    console.log('MSW: 收到创建推送任务请求');
    const body = await request.json();
    const newTask = {
      id: `push-${Date.now()}`,
      ...(body as any),
      totalCount: 8,
      successCount: 0,
      failedCount: 0,
      pendingCount: 8,
      status: 'PENDING',
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
    };
    mockPushTasks.unshift(newTask);
    return HttpResponse.json({ task: newTask });
  }),

  // 获取推送任务列表
  http.get(`${baseURL}/version-push-tasks`, ({ request }) => {
    console.log('MSW: 收到推送任务列表请求');
    const url = new URL(request.url);
    const versionId = url.searchParams.get('versionId');
    const status = url.searchParams.get('status');

    let filteredTasks = mockPushTasks;

    if (versionId) {
      filteredTasks = filteredTasks.filter((t) => t.versionId === versionId);
    }
    if (status) {
      filteredTasks = filteredTasks.filter((t) => t.status === status);
    }

    return HttpResponse.json({
      tasks: filteredTasks,
      total: filteredTasks.length,
    });
  }),

  // 获取推送任务详情
  http.get(`${baseURL}/version-push-tasks/:id`, ({ params }) => {
    console.log('MSW: 收到推送任务详情请求', params.id);
    const task = mockPushTasks.find((t) => t.id === params.id);
    if (task) {
      return HttpResponse.json({
        task,
        details: {
          successDevices: ['device-001', 'device-002', 'device-004'],
          failedDevices: [{ deviceId: 'device-005', reason: '下载失败：网络超时' }],
          pendingDevices: ['device-006', 'device-007', 'device-008'],
        },
      });
    }
    return HttpResponse.json({ message: '推送任务不存在' }, { status: 404 });
  }),

  // 导出推送报告
  http.post(`${baseURL}/version-push-tasks/:id/export`, ({ params }) => {
    console.log('MSW: 收到导出推送报告请求', params.id);
    return HttpResponse.json({
      downloadUrl: `https://cdn.sunbay.com/reports/push-task-${params.id}.csv`,
    });
  }),

  // ========== 密钥管理 ==========

  // 获取设备密钥状态
  http.get(`${baseURL}/devices/:id/keys/status`, ({ params }) => {
    console.log('MSW: 收到设备密钥状态请求', params.id);
    const keyStatus = deviceKeyStatus[params.id as string];
    
    if (keyStatus) {
      return HttpResponse.json(keyStatus);
    }
    
    return HttpResponse.json(
      { message: '设备不存在或未配置密钥' },
      { status: 404 }
    );
  }),

  // 密钥更新
  http.post(`${baseURL}/devices/:id/keys/update`, async ({ params }) => {
    console.log('MSW: 收到密钥更新请求', params.id);
    const deviceId = params.id as string;
    
    // 模拟处理时间
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 生成新的KSN
    const newKSN = `FFFF9876543210E${Math.random().toString(16).substr(2, 5).toUpperCase()}`;
    
    // 更新设备密钥状态
    if (deviceKeyStatus[deviceId]) {
      deviceKeyStatus[deviceId] = {
        ...deviceKeyStatus[deviceId],
        currentKSN: newKSN,
        remainingCount: 1000000,
        status: 'ACTIVE',
        lastUpdated: new Date().toISOString(),
        nextUpdateRequired: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 6个月后
      };
    }
    
    return HttpResponse.json({
      success: true,
      newKSN,
      message: '密钥更新成功',
      remainingCount: 1000000,
    });
  }),

  // 获取密钥预警设备列表
  http.get(`${baseURL}/devices/key-warnings`, () => {
    console.log('MSW: 收到密钥预警设备列表请求');
    const warningDevices = mockDevices.filter((d) => {
      const keyStatus = deviceKeyStatus[d.id];
      return keyStatus && (keyStatus.status === 'NEAR_EXPIRY' || keyStatus.status === 'EXPIRED');
    });
    
    return HttpResponse.json(
      warningDevices.map((d) => ({
        ...d,
        keyStatus: deviceKeyStatus[d.id],
      }))
    );
  }),
];
