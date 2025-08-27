import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Plus, FileText, Download, RefreshCw, Phone, Mail, MessageSquare, Calendar, Star, FileAudio, FileVideo, Upload, X, Trash2, ArrowLeft, Eye, User, ChevronDown, Home, Cpu, List, Menu } from 'lucide-react';

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

// 导航卡片组件
interface NavigationCardsProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

const NavigationCards: React.FC<NavigationCardsProps> = ({ currentPage, onPageChange }) => {
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
    <div className="flex flex-col space-y-3">
      {/* 导航标题 */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">任务流</h3>
      </div>
      
      {menuItems.map((item, index) => {
        const isActive = currentPage === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
              isActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 bg-gray-50'
            }`}
            style={{ height: '48px', minHeight: '48px', maxHeight: '48px' }}
          >
            <div className="flex items-center justify-center h-full w-full">
              <span className={`text-sm font-medium ${
                isActive ? 'text-blue-700' : 'text-gray-900'
              }`}>
                {index + 1}. {item.label}
              </span>
            </div>
          </button>
        );
      })}
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
  const [analysisStep, setAnalysisStep] = useState(0); // AI分析步骤
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
    // 生成AI分析的模拟数据 - 10条丰富数据
    const mockAnalysisData: AnalysisRecord[] = [
      {
        id: Date.now() + 1,
        company: '小鹏汽车',
        contact: '张浩',
        time: '12-15 14:30',
        summary: '智能驾驶系统升级需求，希望集成更先进的AI算法提升自动驾驶能力，讨论了传感器数据融合和决策算法优化方案。',
        category: '产品优化',
        feasibility: '可行',
        plan: '技术对接',
        notes: '新能源汽车',
        sourceFile: 'xpeng_meeting.mp4',
        contactMethod: '会议'
      },
      {
        id: Date.now() + 2,
        company: '小米汽车',
        contact: '李天',
        time: '12-14 16:20',
        summary: '车载智能系统合作讨论，计划打造全新的车机交互体验，需要AI语音助手和智能推荐功能的技术支持。',
        category: '产品优化',
        feasibility: '可行',
        plan: '商务洽谈',
        notes: '高优先级',
        sourceFile: 'xiaomi_auto_chat.txt',
        contactMethod: '微信'
      },
      {
        id: Date.now() + 3,
        company: '蔚来汽车',
        contact: '王磊',
        time: '12-13 10:15',
        summary: '用户服务体验优化项目，希望通过AI技术提升售后服务效率，包括故障预测、维修建议和用户画像分析。',
        category: 'VIP定制',
        feasibility: '可行',
        plan: '需求梳理',
        notes: '服务创新',
        sourceFile: 'nio_service_record.mp3',
        contactMethod: '电话'
      },
      {
        id: Date.now() + 4,
        company: '招商银行',
        contact: '陈刚',
        time: '12-12 09:30',
        summary: '智能风控系统升级，需要AI算法帮助识别异常交易行为，提升风险控制能力和用户体验，讨论了模型训练和部署方案。',
        category: '产品优化',
        feasibility: '可行',
        plan: '方案设计',
        notes: '金融科技',
        sourceFile: 'cmb_risk_analysis.pdf',
        contactMethod: '邮件'
      },
      {
        id: Date.now() + 5,
        company: '建设银行',
        contact: '刘强',
        time: '12-11 15:45',
        summary: '客户服务智能化改造，希望通过AI客服机器人减少人工客服压力，提升服务质量和响应速度，需要自然语言处理技术支持。',
        category: '产品优化',
        feasibility: '可行',
        plan: '技术对接',
        notes: '数字化转型',
        sourceFile: 'ccb_customer_service.wav',
        contactMethod: '会议'
      },
      {
        id: Date.now() + 6,
        company: '兴业银行',
        contact: '周杰',
        time: '12-10 11:20',
        summary: '反欺诈系统优化需求，当前系统误报率较高，希望通过机器学习算法优化检测准确性，减少对正常用户的影响。',
        category: 'bug',
        feasibility: '不可行',
        plan: '销售跟进',
        notes: '技术挑战',
        sourceFile: 'cib_fraud_detection.txt',
        contactMethod: '微信'
      },
      {
        id: Date.now() + 7,
        company: '滴滴出行',
        contact: '吴凯',
        time: '12-09 14:00',
        summary: '智能调度算法优化，希望通过AI技术提升车辆调度效率，减少用户等待时间，讨论了实时路况分析和需求预测模型。',
        category: '产品优化',
        feasibility: '可行',
        plan: '合同签署',
        notes: '出行服务',
        sourceFile: 'didi_scheduling.mp4',
        contactMethod: '会议'
      },
      {
        id: Date.now() + 8,
        company: '美团',
        contact: '郑辉',
        time: '12-08 16:30',
        summary: '外卖配送路径优化项目，需要AI算法优化配送路线，提升配送效率和用户满意度，包括配送时间预估和动态路径调整。',
        category: 'VIP定制',
        feasibility: '可行',
        plan: '技术对接',
        notes: '本地生活',
        sourceFile: 'meituan_delivery.json',
        contactMethod: '邮件'
      },
      {
        id: Date.now() + 9,
        company: '京东集团',
        contact: '孙明',
        time: '12-07 13:15',
        summary: '供应链智能化升级，希望通过AI技术优化库存管理和需求预测，降低运营成本，提升供应链效率和响应速度。',
        category: '产品优化',
        feasibility: '可行',
        plan: '需求梳理',
        notes: '电商物流',
        sourceFile: 'jd_supply_chain.xlsx',
        contactMethod: '电话'
      },
      {
        id: Date.now() + 10,
        company: '字节跳动',
        contact: '许松',
        time: '12-06 10:45',
        summary: '内容推荐算法优化，当前算法存在信息茧房问题，希望通过改进推荐策略提升用户体验，增加内容多样性和用户粘性。',
        category: 'bug',
        feasibility: '可行',
        plan: '产品优化',
        notes: '算法优化',
        sourceFile: 'bytedance_algorithm.py',
        contactMethod: '微信'
      }
    ];
    
    // 设置AI分析过程
    setAnalysisData(mockAnalysisData);
    setDisplayedRows(0);
    setIsGenerating(true);
    setAnalysisStep(0);

    // 模拟AI Agent分析步骤
    const processAnalysisSteps = async () => {
      const steps = 4; // 总共4个分析步骤
      for (let step = 1; step <= steps; step++) {
        await new Promise(resolve => setTimeout(resolve, 800)); // 每步骤800ms
        setAnalysisStep(step);
      }
      
      // 分析完成，开始逐行显示数据
      await new Promise(resolve => setTimeout(resolve, 500));
      
      for (let i = 0; i <= mockAnalysisData.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 600)); // 每行间隔600ms
        setDisplayedRows(i);
      }
      setIsGenerating(false);
    };
    
    processAnalysisSteps();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newFiles: FileData[] = [];
    Array.from(files).forEach((file) => {
      const fileData: FileData = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      };
      newFiles.push(fileData);
    });
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId: number) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string, fileType: string) => {
    if (fileType.startsWith('video/')) {
      return <FileVideo className="w-5 h-5 text-purple-500" />;
    } else if (fileType.startsWith('audio/')) {
      return <FileAudio className="w-5 h-5 text-green-500" />;
    } else {
      return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleEditField = (rowId: number, field: string, value: string) => {
    setAnalysisData(prev => prev.map(item => 
      item.id === rowId ? { ...item, [field]: value } : item
    ));
  };

  const openDetailModal = (record: AnalysisRecord) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  const handleConfirm = () => {
    if (uploadedFiles.length === 0) {
      alert('请先选择文件');
      return;
    }
    generateAnalysisData();
    setShowUploadModal(false);
    setCurrentPage(PageType.AI_GENERATE);
  };

  // 主布局组件
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="px-6 py-4">
            <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div>
                <h1 className="text-2xl font-bold">
                  AI CRM - 客户沟通管理系统
                </h1>
                <div className="text-sm opacity-90">
                  科技驱动，智能管理
                </div>
              </div>
            </div>
            <UserInfo />
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex flex-1">
        {/* 左侧导航 - 固定宽度 */}
        <div className="w-48 bg-white shadow-lg border-r border-gray-200 p-4 h-screen">
          <NavigationCards
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
        
        {/* 右侧内容区域 - 剩余宽度 */}
        <div className="flex-1 px-6 py-6 overflow-auto">
          {currentPage === PageType.HOME && renderHomePage()}
          {currentPage === PageType.AI_GENERATE && renderAIGeneratePage()}
          {currentPage === PageType.VIEW_ALL && renderViewAllPage()}
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

            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-700 mb-2">拖拽文件到此处，或点击选择文件</p>
              <p className="text-sm text-gray-500 mb-4">支持视频、音频、聊天记录等文件格式</p>
              
              <input
                type="file"
                id="fileInput"
                multiple
                accept="video/*,audio/*,.txt,.doc,.docx,.pdf"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <label
                htmlFor="fileInput"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                选择文件
              </label>
            </div>

            {/* 已上传文件列表 */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">已选择的文件:</h4>
                <div className="space-y-2">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.name, file.type)}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirm}
                disabled={uploadedFiles.length === 0}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  uploadedFiles.length > 0
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
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
      <div className="space-y-8">
        {/* 欢迎引导语 */}
        <div className="py-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            👋 Hello, 我是 AI CRM 助手
          </h2>
          <button
            onClick={() => setCurrentPage(PageType.VIEW_ALL)}
            className="text-blue-600 hover:text-blue-700 transition-colors text-base font-normal"
          >
            全部记录
          </button>
        </div>

        {/* 功能亮点介绍卡片 */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">一键数据处理</h3>
                <p className="text-gray-600">批量处理销售拜访记录，AI提炼关键要点</p>
                  </div>
                  </div>
                </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">全局业务洞察</h3>
                <p className="text-gray-600">一张表查看所有业务核心数据，助力经营决策</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-green-100">
                <RefreshCw className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">全网Token消费低</h3>
                <p className="text-gray-600">每次只操作一个对象，精打细算每个 Token算力</p>
              </div>
            </div>
          </div>
        </div>

        

        {/* 文件上传卡片 */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">上传客户沟通文件</h3>
            <p className="text-gray-600 mb-4">支持视频、音频、聊天记录等多种格式</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>开始上传</span>
            </button>
          </div>
        </div>
        
      </div>
    );
  }

    // 渲染AI生成页面
  function renderAIGeneratePage() {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-100">
              <Cpu className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-semibold text-blue-800">
                🤖 AI Agent {isGenerating ? (analysisStep < 4 ? '分析中' : '生成表格中') : '分析完成'}
              </div>
              <div className="text-sm text-blue-600 mt-1">
                {isGenerating 
                  ? (analysisStep < 4 ? `正在执行第 ${analysisStep + 1} 步处理...` : '正在生成结构化表格...')
                  : '智能分析引擎已处理完成'
                }
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 rounded-lg p-4 mb-4">
            <div className="text-sm text-gray-700 mb-2">
              <span className="font-medium text-blue-700">Agent 处理流程：</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-1 ${analysisStep >= 1 ? 'bg-green-500' : analysisStep === 0 && isGenerating ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}></div>
                语音转文字
              </div>
              <div className="text-gray-400">→</div>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-1 ${analysisStep >= 2 ? 'bg-green-500' : analysisStep === 1 && isGenerating ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}></div>
                关键信息提取
              </div>
              <div className="text-gray-400">→</div>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-1 ${analysisStep >= 3 ? 'bg-green-500' : analysisStep === 2 && isGenerating ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}></div>
                结构化分析
              </div>
              <div className="text-gray-400">→</div>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-1 ${analysisStep >= 4 ? 'bg-green-500' : analysisStep === 3 && isGenerating ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}></div>
                智能分类
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-blue-700">
              <span className="font-medium">分析结果：</span>
              {isGenerating 
                ? `正在处理中... (${displayedRows}/${analysisData.length})`
                : `成功生成 ${analysisData.length} 条结构化客户沟通记录`
              }
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <div className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
              <span>{isGenerating ? 'AI 引擎运行中' : '分析已完成'}</span>
            </div>
          </div>
        </div>

        {/* 完整的数据表格 */}
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">后续计划</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">备注</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">操作</th>
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
                    {/* 客户信息 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingRow === record.id && editingField === 'company' ? (
                        <input
                          type="text"
                          value={record.company}
                          onChange={(e) => handleEditField(record.id, 'company', e.target.value)}
                          onBlur={() => {
                            setEditingRow(null);
                            setEditingField(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                          className="w-full min-w-[120px] px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                      ) : (
                        <div 
                          className="text-sm font-medium text-gray-900 cursor-pointer hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                          onClick={() => {
                            setEditingRow(record.id);
                            setEditingField('company');
                          }}
                        >
                          {record.company}
                        </div>
                      )}
                    </td>

                    {/* 联系人 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingRow === record.id && editingField === 'contact' ? (
                        <input
                          type="text"
                          value={record.contact}
                          onChange={(e) => handleEditField(record.id, 'contact', e.target.value)}
                          onBlur={() => {
                            setEditingRow(null);
                            setEditingField(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                          className="w-full min-w-[100px] px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                      ) : (
                        <div 
                          className="text-sm text-gray-900 cursor-pointer hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                          onClick={() => {
                            setEditingRow(record.id);
                            setEditingField('contact');
                          }}
                        >
                          {record.contact}
                        </div>
                      )}
                    </td>

                    {/* 沟通时间 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingRow === record.id && editingField === 'time' ? (
                        <input
                          type="text"
                          value={record.time}
                          onChange={(e) => handleEditField(record.id, 'time', e.target.value)}
                          onBlur={() => {
                            setEditingRow(null);
                            setEditingField(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                          className="w-full min-w-[110px] px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                      ) : (
                        <div 
                          className="text-sm text-gray-900 cursor-pointer hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                          onClick={() => {
                            setEditingRow(record.id);
                            setEditingField('time');
                          }}
                        >
                          {record.time}
                        </div>
                      )}
                    </td>

                    {/* 反馈内容 */}
                    <td className="px-6 py-4 relative">
                      {editingRow === record.id && editingField === 'summary' ? (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={(e) => {
                          if (e.target === e.currentTarget) {
                            setEditingRow(null);
                            setEditingField(null);
                          }
                        }}>
                          <div className="bg-white rounded-lg p-6 shadow-xl max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
                            <div className="mb-4">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">编辑反馈内容</h3>
                              <p className="text-sm text-gray-600">客户：{record.company} - {record.contact}</p>
                            </div>
                            <textarea
                              value={record.summary}
                              onChange={(e) => handleEditField(record.id, 'summary', e.target.value)}
                              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                              autoFocus
                              placeholder="请输入详细的反馈内容..."
                            />
                            <div className="flex justify-end space-x-3 mt-4">
                              <button
                                onClick={() => {
                                  setEditingRow(null);
                                  setEditingField(null);
                                }}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                取消
                              </button>
                              <button
                                onClick={() => {
                                  setEditingRow(null);
                                  setEditingField(null);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                保存
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="text-sm text-gray-900 max-w-xs truncate cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                          title={record.summary}
                          onClick={() => {
                            setEditingRow(record.id);
                            setEditingField('summary');
                          }}
                        >
                          {record.summary}
                        </div>
                      )}
                    </td>

                    {/* 分类 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingRow === record.id && editingField === 'category' ? (
                        <select
                          value={record.category}
                          onChange={(e) => {
                            handleEditField(record.id, 'category', e.target.value);
                            setEditingRow(null);
                            setEditingField(null);
                          }}
                          onBlur={() => {
                            setEditingRow(null);
                            setEditingField(null);
                          }}
                          className="min-w-[100px] px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        >
                          <option value="bug">bug</option>
                          <option value="产品优化">产品优化</option>
                          <option value="VIP定制">VIP定制</option>
                        </select>
                      ) : (
                        <span 
                          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border cursor-pointer hover:opacity-80 ${getCategoryColor(record.category)}`}
                          onClick={() => {
                            setEditingRow(record.id);
                            setEditingField('category');
                          }}
                        >
                          {record.category}
                        </span>
                      )}
                    </td>

                    {/* 可行性 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingRow === record.id && editingField === 'feasibility' ? (
                        <select
                          value={record.feasibility}
                          onChange={(e) => {
                            handleEditField(record.id, 'feasibility', e.target.value);
                            setEditingRow(null);
                            setEditingField(null);
                          }}
                          onBlur={() => {
                            setEditingRow(null);
                            setEditingField(null);
                          }}
                          className="min-w-[100px] px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        >
                          <option value="可行">可行</option>
                          <option value="不可行">不可行</option>
                        </select>
                      ) : (
                        <span 
                          className={`text-sm font-medium cursor-pointer hover:opacity-80 px-2 py-1 rounded ${getFeasibilityColor(record.feasibility)}`}
                          onClick={() => {
                            setEditingRow(record.id);
                            setEditingField('feasibility');
                          }}
                        >
                          {record.feasibility}
                        </span>
                      )}
                    </td>

                    {/* 后续计划 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingRow === record.id && editingField === 'plan' ? (
                        <input
                          type="text"
                          value={record.plan}
                          onChange={(e) => handleEditField(record.id, 'plan', e.target.value)}
                          onBlur={() => {
                            setEditingRow(null);
                            setEditingField(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                          className="w-full min-w-[120px] px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                      ) : (
                        <div 
                          className="text-sm text-gray-900 cursor-pointer hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                          onClick={() => {
                            setEditingRow(record.id);
                            setEditingField('plan');
                          }}
                        >
                          {record.plan}
                        </div>
                      )}
                    </td>

                    {/* 备注 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingRow === record.id && editingField === 'notes' ? (
                        <input
                          type="text"
                          value={record.notes}
                          onChange={(e) => handleEditField(record.id, 'notes', e.target.value)}
                          onBlur={() => {
                            setEditingRow(null);
                            setEditingField(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                          className="w-full min-w-[100px] px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                      ) : (
                        <div 
                          className="text-sm text-gray-500 cursor-pointer hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                          onClick={() => {
                            setEditingRow(record.id);
                            setEditingField('notes');
                          }}
                        >
                          {record.notes}
                        </div>
                      )}
                    </td>

                    {/* 操作 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => openDetailModal(record)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="查看详情"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
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
          <div className="flex items-center space-x-3">
            <button
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              保存草稿
            </button>
            <button
              onClick={() => {
                alert(`已确认提交 ${analysisData.length} 条记录到主数据库！`);
                // 提交后自动跳转到第三页（查看全部）
                setTimeout(() => {
                  setCurrentPage(PageType.VIEW_ALL);
                }, 1000); // 1秒后跳转
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              确认提交 ({analysisData.length}条)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 渲染查看全部页面（复用主页表格，无统计卡片）
  function renderViewAllPage() {
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
};

export default AICRMDashboard;
                        