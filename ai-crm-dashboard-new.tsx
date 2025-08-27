import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Plus, FileText, Download, RefreshCw, Phone, Mail, MessageSquare, Calendar, Star, FileAudio, FileVideo, FileImage, Upload, X, Trash2, ArrowLeft, Eye, User, ChevronDown, Home, Cpu, List, Menu } from 'lucide-react';

// 类型定义
interface FileData {
  id: number;
  name: string;
  size: number;
  type: string;
  file: File;
}

interface AnalysisRecord {
  id: number;
  company: string;
  contact: string;
  time: string;
  summary: string;
  category: string;
  feasibility: string;
  plan: string;
  notes: string;
  sourceFile: string;
  contactMethod: string;
}

// 页面枚举
enum PageType {
  HOME = 'home',
  AI_GENERATE = 'ai_generate', 
  VIEW_ALL = 'view_all'
}

// 侧边栏组件
interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, collapsed, onToggle }) => {
  const menuItems = [
    {
      id: PageType.HOME,
      label: '开始',
      icon: Home,
      description: '主页和文件上传'
    },
    {
      id: PageType.AI_GENERATE,
      label: 'AI生成',
      icon: Cpu,
      description: 'AI分析结果页面'
    },
    {
      id: PageType.VIEW_ALL,
      label: '查看全部',
      icon: List,
      description: '完整数据表格'
    }
  ];

  return (
    <div className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    } flex flex-col h-screen`}>
      {/* Logo和折叠按钮 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-800">AI CRM</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={collapsed ? item.label : ''}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                {!collapsed && (
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                )}
                {!collapsed && isActive && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 底部信息 */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            任务流程管理系统
          </div>
        </div>
      )}
    </div>
  );
};

// 用户信息组件
const UserInfo = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors bg-white/10 rounded-lg px-3 py-2 hover:bg-white/20"
      >
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center ring-2 ring-white/20">
          <User className="w-5 h-5 text-white" />
        </div>
        <span className="text-sm font-medium">李华</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>
      
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-fadeInUp">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">李华</div>
                <div className="text-xs text-gray-500">CRM 管理员</div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowDropdown(false)}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
          >
            <User className="w-4 h-4" />
            <span>个人设置</span>
          </button>
          <button 
            onClick={() => setShowDropdown(false)}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>系统设置</span>
          </button>
          <div className="border-t border-gray-200 mt-1">
            <button 
              onClick={() => {
                setShowDropdown(false);
                alert('退出登录');
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>退出登录</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AICRMDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [currentPage, setCurrentPage] = useState<PageType>(PageType.HOME);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisRecord[]>([]);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AnalysisRecord | null>(null);
  const [displayedRows, setDisplayedRows] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const recordsPerPage = 10;

  // 模拟100条数据
  const mockData = useMemo(() => {
    const companies = ['阿里巴巴', '华为科技', '招商银行', '工商银行', '腾讯科技', '字节跳动', '美团', '京东集团', '中国平安', '建设银行'];
    const contacts = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑一', '王二'];
    const summaries = [
      '技术架构优化需求，针对目前业务量增长需要扩容',
      '服务器性能问题反馈，需要紧急处理和技术支持',
      '系统集成方案需求，讨论定制化开发可行性',
      '数据迁移方案确认，评估时间成本和技术难度',
      '产品功能升级需求，希望增加新的业务模块',
      'API接口对接问题，需要技术团队配合调试',
      '安全认证相关咨询，了解合规要求和实施方案',
      '用户体验优化建议，收集一线使用反馈意见',
      '性能监控方案讨论，建立完善的运维体系',
      '商务合作模式探讨，评估长期合作的可能性'
    ];
    const categories = ['bug', '产品优化', 'VIP定制'];
    const feasibility = ['可行', '不可行'];
    const plans = ['销售跟进', '技术对接', '商务洽谈', '需求梳理', '方案设计', '合同签署'];
    const contactMethods = ['电话', '邮件', '微信', '会议', '短信'];
    const attachmentTypes = [
      { name: 'tech_review.mp3', type: 'audio', icon: FileAudio },
      { name: 'wechat_log.txt', type: 'text', icon: FileText },
      { name: 'demo_video.mp4', type: 'video', icon: FileVideo },
      { name: 'solution_plan.pdf', type: 'pdf', icon: FileText },
      { name: 'meeting_record.wav', type: 'audio', icon: FileAudio }
    ];

    return Array.from({ length: 100 }, (_, index) => {
      const now = new Date();
      const randomDate = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      const randomAttachments = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
        attachmentTypes[Math.floor(Math.random() * attachmentTypes.length)]
      );
      
      return {
        id: index + 1,
        company: companies[Math.floor(Math.random() * companies.length)],
        contact: contacts[Math.floor(Math.random() * contacts.length)],
        time: `${String(randomDate.getMonth() + 1).padStart(2, '0')}-${String(randomDate.getDate()).padStart(2, '0')} ${String(randomDate.getHours()).padStart(2, '0')}:${String(randomDate.getMinutes()).padStart(2, '0')}`,
        summary: summaries[Math.floor(Math.random() * summaries.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        feasibility: feasibility[Math.floor(Math.random() * feasibility.length)],
        plan: plans[Math.floor(Math.random() * plans.length)],
        notes: index % 3 === 0 ? '重要客户' : index % 5 === 0 ? '技术难点' : '',
        contactMethod: contactMethods[Math.floor(Math.random() * contactMethods.length)],
        priority: Math.floor(Math.random() * 5) + 1,
        attachments: randomAttachments
      };
    });
  }, []);

  const filteredData = mockData.filter(item => 
    item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const currentData = filteredData.slice(
    (currentPageNum - 1) * recordsPerPage,
    currentPageNum * recordsPerPage
  );

  const getContactMethodIcon = (method: string) => {
    switch(method) {
      case '电话': return <Phone className="w-4 h-4" />;
      case '邮件': return <Mail className="w-4 h-4" />;
      case '微信': return <MessageSquare className="w-4 h-4" />;
      case '会议': return <Calendar className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'bug': return 'bg-red-100 text-red-800 border-red-200';
      case '产品优化': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'VIP定制': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFeasibilityColor = (feasibility: string) => {
    return feasibility === '可行' ? 'text-green-600' : 'text-red-600';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star 
        key={index} 
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const handlePageChange = (page: PageType) => {
    setCurrentPage(page);
    if (page === PageType.AI_GENERATE && analysisData.length === 0) {
      // 如果是AI生成页面但还没有数据，先生成数据
      generateAnalysisData();
    }
  };

  const generateAnalysisData = () => {
    // 生成AI分析的模拟数据 - 20条丰富数据
    const mockAnalysisData: AnalysisRecord[] = [
      {
        id: Date.now() + 1,
        company: '阿里巴巴',
        contact: '张三',
        time: '08-26 14:30',
        summary: '技术架构优化需求，客户反映目前系统在高并发场景下存在性能瓶颈，希望我们提供针对性的优化方案。讨论了微服务架构改造的可行性，以及预估的时间成本。',
        category: '产品优化',
        feasibility: '可行',
        plan: '技术对接',
        notes: '重要客户',
        sourceFile: uploadedFiles[0]?.name || 'ali_meeting.mp4',
        contactMethod: '会议'
      },
      {
        id: Date.now() + 2,
        company: '腾讯科技',
        contact: '李四',
        time: '08-25 16:20',
        summary: '用户体验优化建议，针对移动端界面响应速度和交互流程提出改进意见，建议优化加载时间和简化操作步骤。客户反映当前APP在某些功能模块存在卡顿现象。',
        category: 'bug',
        feasibility: '可行',
        plan: '产品优化',
        notes: '移动端优化',
        sourceFile: uploadedFiles[1]?.name || 'tencent_chat.txt',
        contactMethod: '微信'
      }
    ];
    
    // 设置动画效果
    setAnalysisData(mockAnalysisData);
    setDisplayedRows(0);
    setIsGenerating(true);
    
    // 逐行显示数据动画
    const showRowsSequentially = async () => {
      for (let i = 0; i <= mockAnalysisData.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 200)); // 每行间隔200ms
        setDisplayedRows(i);
      }
      setIsGenerating(false);
    };
    
    showRowsSequentially();
  };

  const handleConfirm = () => {
    generateAnalysisData();
    setShowUploadModal(false);
    setCurrentPage(PageType.AI_GENERATE);
  };

  // 主布局组件
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 侧边栏 */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={handlePageChange}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <h1 className="text-2xl font-bold">
                  {currentPage === PageType.HOME && 'AI CRM 系统 - 客户沟通管理'}
                  {currentPage === PageType.AI_GENERATE && 'AI 分析结果 - 客户沟通信息提取'}
                  {currentPage === PageType.VIEW_ALL && '查看全部 - 完整数据列表'}
                </h1>
                {currentPage === PageType.HOME && (
                  <div className="text-sm opacity-90">
                    科技驱动，智能管理
                  </div>
                )}
                {currentPage === PageType.AI_GENERATE && (
                  <button
                    onClick={() => setCurrentPage(PageType.HOME)}
                    className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors bg-white/10 rounded-lg px-3 py-2 hover:bg-white/20"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    返回上传
                  </button>
                )}
              </div>
              <UserInfo />
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {currentPage === PageType.HOME && renderHomePage()}
            {currentPage === PageType.AI_GENERATE && renderAIGeneratePage()}
            {currentPage === PageType.VIEW_ALL && renderViewAllPage()}
          </div>
        </div>
      </div>

      {/* 上传弹窗 */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">上传客户沟通文件</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="border-2 border-dashed rounded-lg p-8 text-center border-gray-300">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-700 mb-2">拖拽文件到此处，或点击选择文件</p>
              <p className="text-sm text-gray-500 mb-4">支持视频、音频、聊天记录等文件格式</p>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                <FileImage className="w-4 h-4 mr-2" />
                选择文件
              </button>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                确定 - 下一步 (AI分析)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // 渲染主页面
  function renderHomePage() {
    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Plus className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-gray-600">今日新增</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">28</p>
                <p className="text-gray-600">待处理</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FileText className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-gray-600">本月处理</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="搜索客户、联系人或反馈内容..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>新增沟通记录</span>
              </button>
              <button className="text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>导出Excel</span>
              </button>
              <button className="text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">客户信息</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">联系人</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">沟通时间</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">反馈内容</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">分类</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">可行性</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">优先级</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">后续计划</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">附件</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.company}</div>
                      <div className="text-sm text-gray-500">{item.notes}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="text-sm text-gray-900">{item.contact}</div>
                        <div className="text-gray-400">
                          {getContactMethodIcon(item.contactMethod)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.time}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={item.summary}>
                        {item.summary}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getFeasibilityColor(item.feasibility)}`}>
                        {item.feasibility}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        {renderStars(item.priority)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.plan}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {item.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center space-x-1" title={attachment.name}>
                            <attachment.icon className="w-4 h-4 text-gray-500" />
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
            <div className="text-sm text-gray-700">
              显示 {(currentPageNum - 1) * recordsPerPage + 1} 到 {Math.min(currentPageNum * recordsPerPage, filteredData.length)} 条，共 {filteredData.length} 条记录
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPageNum(Math.max(1, currentPageNum - 1))}
                disabled={currentPageNum === 1}
                className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
              >
                上一页
              </button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPageNum - 2)) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPageNum(pageNum)}
                      className={`px-3 py-1 text-sm border rounded ${
                        currentPageNum === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPageNum(Math.min(totalPages, currentPageNum + 1))}
                disabled={currentPageNum === totalPages}
                className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
              >
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 渲染AI生成页面
  function renderAIGeneratePage() {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-lg font-medium text-blue-800 mb-2">AI 分析结果</div>
          <p className="text-blue-700">AI 已分析完成，生成了 {analysisData.length} 条客户沟通信息</p>
        </div>

        {/* 简化的数据表格 */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">客户公司</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">联系人</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">反馈内容</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">可行性</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">后续计划</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analysisData.slice(0, displayedRows).map((record, index) => (
                  <tr 
                    key={record.id} 
                    className={`hover:bg-gray-50 transition-all duration-500 ${
                      index === displayedRows - 1 ? 'animate-fadeInUp' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.contact}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={record.summary}>
                        {record.summary}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getFeasibilityColor(record.feasibility)}`}>
                        {record.feasibility}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.plan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentPage(PageType.HOME)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            重新分析
          </button>
          <button
            onClick={() => alert(`已确认提交 ${analysisData.length} 条记录到主数据库！`)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            确认提交 ({analysisData.length}条)
          </button>
        </div>
      </div>
    );
  }

  // 渲染查看全部页面（复用主页表格，无统计卡片）
  function renderViewAllPage() {
    return renderHomePage().props.children.slice(1); // 跳过统计卡片，只显示表格
  }
};

export default AICRMDashboard;
