import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Plus, FileText, Download, RefreshCw, Phone, Mail, MessageSquare, Calendar, Star, FileAudio, FileVideo, FileImage, Upload, X, Trash2, ArrowLeft, Eye, User, ChevronDown } from 'lucide-react';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAnalysisPage, setShowAnalysisPage] = useState(false);
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
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
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

  const handleFileUpload = (files: FileList) => {
    const newFiles = Array.from(files).map((file: File) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
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
    handleFileUpload(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileUpload(files);
    }
  };

  const removeFile = (fileId: number) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string, fileType: string) => {
    if (fileType.startsWith('video/') || fileName.endsWith('.mp4') || fileName.endsWith('.mov')) {
      return <FileVideo className="w-4 h-4 text-blue-500" />;
    } else if (fileType.startsWith('audio/') || fileName.endsWith('.wav') || fileName.endsWith('.mp3')) {
      return <FileAudio className="w-4 h-4 text-green-500" />;
    } else if (fileType.startsWith('text/') || fileName.endsWith('.txt') || fileName.endsWith('.docx')) {
      return <MessageSquare className="w-4 h-4 text-gray-500" />;
    } else {
      return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleConfirm = () => {
    // 生成AI分析的模拟数据 - 20条丰富数据
    const mockAnalysisData = [
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
      },
      {
        id: Date.now() + 3,
        company: '招商银行',
        contact: '王五',
        time: '08-24 09:15',
        summary: '系统集成方案讨论，银行方面希望将现有核心业务系统与我们的平台进行深度集成，涉及数据安全和监管合规问题。需要符合央行相关规定。',
        category: 'VIP定制',
        feasibility: '可行',
        plan: '商务洽谈',
        notes: 'VIP客户',
        sourceFile: uploadedFiles[2]?.name || 'cmb_meeting.wav',
        contactMethod: '会议'
      },
      {
        id: Date.now() + 4,
        company: '字节跳动',
        contact: '赵六',
        time: '08-23 11:45',
        summary: 'API接口性能问题反馈，在高频调用场景下出现超时现象，需要技术团队排查原因并提供解决方案。特别是推荐算法接口响应时间过长。',
        category: 'bug',
        feasibility: '可行',
        plan: '技术对接',
        notes: '紧急处理',
        sourceFile: 'bytedance_api_logs.txt',
        contactMethod: '邮件'
      },
      {
        id: Date.now() + 5,
        company: '工商银行',
        contact: '钱七',
        time: '08-22 15:30',
        summary: '数据迁移方案确认，银行现有数据量庞大，需要制定详细的迁移计划，确保业务连续性和数据完整性。涉及核心账务系统的平滑过渡。',
        category: 'VIP定制',
        feasibility: '不可行',
        plan: '需求梳理',
        notes: '风险较高',
        sourceFile: 'icbc_migration_plan.docx',
        contactMethod: '会议'
      },
      {
        id: Date.now() + 6,
        company: '美团',
        contact: '孙八',
        time: '08-21 10:20',
        summary: '业务流程优化建议，希望简化订单处理流程，提升用户下单效率，减少不必要的确认步骤。重点关注外卖配送时效性问题。',
        category: '产品优化',
        feasibility: '可行',
        plan: '产品优化',
        notes: '配送优化',
        sourceFile: 'meituan_process_flow.mp4',
        contactMethod: '电话'
      },
      {
        id: Date.now() + 7,
        company: '京东集团',
        contact: '周九',
        time: '08-20 14:15',
        summary: '物流系统对接需求，京东物流希望与我们的供应链管理系统建立数据连接，实现订单状态实时同步。包括仓储管理和配送跟踪功能。',
        category: 'VIP定制',
        feasibility: '可行',
        plan: '技术对接',
        notes: '战略合作',
        sourceFile: 'jd_logistics_api.txt',
        contactMethod: '会议'
      },
      {
        id: Date.now() + 8,
        company: '中国平安',
        contact: '吴十',
        time: '08-19 09:45',
        summary: '保险产品数字化改造咨询，平安希望了解我们在金融科技方面的解决方案，特别是在智能核保和风控方面的能力。涉及AI风险评估模型。',
        category: '产品优化',
        feasibility: '可行',
        plan: '商务洽谈',
        notes: '潜在大客户',
        sourceFile: 'pingan_insurance_demo.mp4',
        contactMethod: '会议'
      },
      {
        id: Date.now() + 9,
        company: '建设银行',
        contact: '郑一',
        time: '08-18 16:30',
        summary: '移动银行应用性能优化，客户反映APP在某些功能模块存在卡顿现象，希望我们协助进行性能调优。主要集中在转账和理财模块。',
        category: 'bug',
        feasibility: '可行',
        plan: '技术对接',
        notes: '性能调优',
        sourceFile: 'ccb_performance_test.wav',
        contactMethod: '电话'
      },
      {
        id: Date.now() + 10,
        company: '滴滴出行',
        contact: '王二',
        time: '08-17 13:20',
        summary: '地图服务集成方案，滴滴希望在我们的平台中集成他们的地图和导航服务，为用户提供更好的出行体验。涉及实时路况和智能路线规划。',
        category: 'VIP定制',
        feasibility: '不可行',
        plan: '需求梳理',
        notes: '技术难度大',
        sourceFile: 'didi_map_integration.docx',
        contactMethod: '微信'
      },
      {
        id: Date.now() + 11,
        company: '中国银行',
        contact: '刘明',
        time: '08-16 11:00',
        summary: '跨境支付系统升级需求，银行希望优化现有的跨境汇款流程，提升汇款速度和降低手续费。需要支持多种货币的实时汇率转换。',
        category: 'VIP定制',
        feasibility: '可行',
        plan: '方案设计',
        notes: '国际业务',
        sourceFile: 'boc_cross_border.pdf',
        contactMethod: '会议'
      },
      {
        id: Date.now() + 12,
        company: '百度',
        contact: '陈华',
        time: '08-15 14:45',
        summary: '搜索算法优化咨询，百度技术团队希望了解我们在自然语言处理方面的技术能力，探讨搜索结果准确性提升的可能性。',
        category: '产品优化',
        feasibility: '可行',
        plan: '技术对接',
        notes: 'AI算法',
        sourceFile: 'baidu_nlp_discussion.mp3',
        contactMethod: '电话'
      },
      {
        id: Date.now() + 13,
        company: '农业银行',
        contact: '张伟',
        time: '08-14 10:30',
        summary: '农村金融服务数字化改造，银行希望推进农村地区的移动支付和线上贷款服务，需要考虑网络环境和用户教育问题。',
        category: 'VIP定制',
        feasibility: '可行',
        plan: '需求梳理',
        notes: '农村金融',
        sourceFile: 'abc_rural_finance.docx',
        contactMethod: '会议'
      },
      {
        id: Date.now() + 14,
        company: '小米科技',
        contact: '李娜',
        time: '08-13 16:15',
        summary: 'IoT设备数据管理平台需求，小米希望建设统一的智能设备数据收集和分析平台，实现设备间的智能联动和用户行为分析。',
        category: '产品优化',
        feasibility: '可行',
        plan: '技术对接',
        notes: 'IoT平台',
        sourceFile: 'xiaomi_iot_requirements.txt',
        contactMethod: '微信'
      },
      {
        id: Date.now() + 15,
        company: '兴业银行',
        contact: '王强',
        time: '08-12 09:20',
        summary: '企业级风控系统升级，银行需要加强对企业贷款的风险评估能力，希望引入更多维度的数据分析和机器学习模型。',
        category: 'VIP定制',
        feasibility: '可行',
        plan: '商务洽谈',
        notes: '风控升级',
        sourceFile: 'cib_risk_control.wav',
        contactMethod: '会议'
      },
      {
        id: Date.now() + 16,
        company: '网易',
        contact: '赵敏',
        time: '08-11 15:40',
        summary: '游戏数据分析平台优化，网易游戏部门希望提升玩家行为分析的实时性和准确性，为游戏运营提供更精准的数据支持。',
        category: '产品优化',
        feasibility: '可行',
        plan: '产品优化',
        notes: '游戏分析',
        sourceFile: 'netease_game_analytics.mp4',
        contactMethod: '电话'
      },
      {
        id: Date.now() + 17,
        company: '浦发银行',
        contact: '孙丽',
        time: '08-10 11:25',
        summary: '个人理财产品推荐系统，银行希望基于客户的风险偏好和投资历史，智能推荐合适的理财产品，提升客户满意度和产品销售。',
        category: 'VIP定制',
        feasibility: '可行',
        plan: '方案设计',
        notes: '智能推荐',
        sourceFile: 'spdb_wealth_management.pdf',
        contactMethod: '会议'
      },
      {
        id: Date.now() + 18,
        company: '快手',
        contact: '周杰',
        time: '08-09 14:10',
        summary: '短视频内容审核系统优化，快手需要提升内容审核的效率和准确性，减少人工审核成本，同时确保平台内容质量。',
        category: 'bug',
        feasibility: '可行',
        plan: '技术对接',
        notes: '内容审核',
        sourceFile: 'kuaishou_content_review.txt',
        contactMethod: '微信'
      },
      {
        id: Date.now() + 19,
        company: '中信银行',
        contact: '马云',
        time: '08-08 10:55',
        summary: '信用卡智能营销系统，银行希望通过客户行为分析，实现精准的信用卡产品推广，提升申请转化率和客户价值。',
        category: 'VIP定制',
        feasibility: '不可行',
        plan: '需求梳理',
        notes: '营销精准度待评估',
        sourceFile: 'citic_credit_card.docx',
        contactMethod: '会议'
      },
      {
        id: Date.now() + 20,
        company: '华为云',
        contact: '林峰',
        time: '08-07 16:35',
        summary: '云服务监控告警系统升级，华为云希望提升服务监控的实时性和告警的准确性，减少误报和漏报，提升运维效率。',
        category: '产品优化',
        feasibility: '可行',
        plan: '技术对接',
        notes: '云服务监控',
        sourceFile: 'huawei_cloud_monitoring.mp3',
        contactMethod: '电话'
      }
    ];
    
    // 设置动画效果
    setAnalysisData(mockAnalysisData);
    setShowUploadModal(false);
    setShowAnalysisPage(true);
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

  const handleEditField = (rowId: number, field: string, value: string) => {
    setAnalysisData(prev => prev.map(item => 
      item.id === rowId ? { ...item, [field]: value } : item
    ));
  };

  const handleConfirmAnalysis = () => {
    alert(`已确认提交 ${analysisData.length} 条记录到主数据库！`);
    setShowAnalysisPage(false);
    setAnalysisData([]);
    setUploadedFiles([]);
  };

  const handleBackToUpload = () => {
    setShowAnalysisPage(false);
    setShowUploadModal(true);
  };

  const openDetailModal = (record: AnalysisRecord) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  const saveDetailChanges = () => {
    if (selectedRecord) {
      handleEditField(selectedRecord.id, 'company', selectedRecord.company);
      handleEditField(selectedRecord.id, 'contact', selectedRecord.contact);
      handleEditField(selectedRecord.id, 'time', selectedRecord.time);
      handleEditField(selectedRecord.id, 'summary', selectedRecord.summary);
      handleEditField(selectedRecord.id, 'category', selectedRecord.category);
      handleEditField(selectedRecord.id, 'feasibility', selectedRecord.feasibility);
      handleEditField(selectedRecord.id, 'plan', selectedRecord.plan);
      handleEditField(selectedRecord.id, 'notes', selectedRecord.notes);
    }
    setShowDetailModal(false);
    setSelectedRecord(null);
  };

  if (showAnalysisPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold">AI 分析结果 - 客户沟通信息提取</h1>
                <button
                  onClick={handleBackToUpload}
                  className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors bg-white/10 rounded-lg px-3 py-2 hover:bg-white/20"
                >
                  <ArrowLeft className="w-5 h-5" />
                  返回上传
                </button>
              </div>
              <UserInfo />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* AI Analysis Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">
                {isGenerating ? (
                  <div className="animate-spin">🔄</div>
                ) : (
                  "🤖"
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-800 mb-2">
                  {isGenerating ? 'AI正在分析生成数据...' : 'AI分析完成'}
                </h3>
                <p className="text-blue-700">
                  {isGenerating ? 
                    `正在生成客户沟通信息，已完成 ${displayedRows}/${analysisData.length} 条` :
                    '从上传文件中提取到以下客户沟通信息，请核对并编辑：'
                  }
                </p>
                {!isGenerating && (
                  <div className="mt-3 text-sm text-blue-600 space-y-1">
                    <div className="flex items-center space-x-4">
                      <span>💡 提示：</span>
                    </div>
                    <div className="ml-6 space-y-1">
                      <p>• 点击字段内容可以直接编辑</p>
                      <p>• 点击 👁️ 可以查看详细编辑窗口</p>
                      <p>• 下拉菜单支持快速选择常用选项</p>
                    </div>
                  </div>
                )}
                {isGenerating && (
                  <div className="mt-3 bg-blue-100 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <span className="text-sm text-blue-700 ml-2">AI正在智能分析文件内容...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Analysis Data Table */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">客户信息</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">接口人</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">沟通时间</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">反馈内容AI总结</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">问题分类</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">可行性</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">后续计划</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">备注</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">附件</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analysisData.slice(0, displayedRows).map((record, index) => (
                    <tr 
                      key={record.id} 
                      className={`hover:bg-gray-50 transition-all duration-500 ${
                        index === displayedRows - 1 ? 'animate-fadeInUp' : ''
                      }`}
                      style={{
                        animation: index === displayedRows - 1 ? 'fadeInUp 0.5s ease-out' : 'none'
                      }}
                    >
                      {/* 客户信息 */}
                      <td className="px-4 py-4 whitespace-nowrap relative">
                        {editingRow === record.id && editingField === 'company' ? (
                          <input
                            type="text"
                            value={record.company}
                            onChange={(e) => handleEditField(record.id, 'company', e.target.value)}
                            onBlur={() => {setEditingRow(null); setEditingField(null);}}
                            onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                            className="w-full px-2 py-1 border border-blue-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            autoFocus
                          />
                        ) : (
                          <div 
                            className="text-sm font-medium text-gray-900 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                            onClick={() => {setEditingRow(record.id); setEditingField('company');}}
                            title="点击编辑"
                          >
                            {record.company}
                          </div>
                        )}
                      </td>

                      {/* 接口人 */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {editingRow === record.id && editingField === 'contact' ? (
                            <input
                              type="text"
                              value={record.contact}
                              onChange={(e) => handleEditField(record.id, 'contact', e.target.value)}
                              onBlur={() => {setEditingRow(null); setEditingField(null);}}
                              onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                              className="w-full px-2 py-1 border border-blue-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              autoFocus
                            />
                          ) : (
                            <span 
                              className="text-sm text-gray-900 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                              onClick={() => {setEditingRow(record.id); setEditingField('contact');}}
                              title="点击编辑"
                            >
                              {record.contact}
                            </span>
                          )}
                          <div className="text-gray-400">
                            {getContactMethodIcon(record.contactMethod)}
                          </div>
                        </div>
                      </td>

                      {/* 沟通时间 */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {editingRow === record.id && editingField === 'time' ? (
                          <input
                            type="text"
                            value={record.time}
                            onChange={(e) => handleEditField(record.id, 'time', e.target.value)}
                            onBlur={() => {setEditingRow(null); setEditingField(null);}}
                            onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                            className="w-full px-2 py-1 border border-blue-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            autoFocus
                            placeholder="MM-DD HH:mm"
                          />
                        ) : (
                          <div 
                            className="text-sm text-gray-900 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                            onClick={() => {setEditingRow(record.id); setEditingField('time');}}
                            title="点击编辑时间"
                          >
                            {record.time}
                          </div>
                        )}
                      </td>

                      {/* 反馈内容AI总结 */}
                      <td className="px-4 py-4 relative">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {editingRow === record.id && editingField === 'summary' ? (
                            <div className="absolute top-0 left-0 right-0 z-10 bg-white border border-blue-300 rounded-lg shadow-lg p-3 max-w-md">
                              <textarea
                                value={record.summary}
                                onChange={(e) => handleEditField(record.id, 'summary', e.target.value)}
                                onBlur={() => {setEditingRow(null); setEditingField(null);}}
                                rows={4}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                autoFocus
                                placeholder="输入反馈内容总结..."
                              />
                              <div className="flex justify-end mt-2">
                                <button
                                  onClick={() => {setEditingRow(null); setEditingField(null);}}
                                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                  确定
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div 
                                className="truncate cursor-pointer hover:bg-blue-50 px-2 py-1 rounded transition-colors" 
                                title={record.summary}
                                onClick={() => {setEditingRow(record.id); setEditingField('summary');}}
                              >
                                {record.summary}
                              </div>
                              <button 
                                className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                                onClick={() => openDetailModal(record)}
                              >
                                详细编辑
                              </button>
                            </>
                          )}
                        </div>
                      </td>

                      {/* 问题分类 */}
                      <td className="px-4 py-4 whitespace-nowrap relative">
                        {editingRow === record.id && editingField === 'category' ? (
                          <div className="absolute top-0 left-0 z-10 bg-white border border-blue-300 rounded-lg shadow-lg">
                            <select
                              value={record.category}
                              onChange={(e) => {
                                handleEditField(record.id, 'category', e.target.value);
                                setEditingRow(null);
                                setEditingField(null);
                              }}
                              onBlur={() => {setEditingRow(null); setEditingField(null);}}
                              className="px-3 py-2 border-0 rounded text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                              autoFocus
                            >
                              <option value="bug">bug</option>
                              <option value="产品优化">产品优化</option>
                              <option value="VIP定制">VIP定制</option>
                            </select>
                          </div>
                        ) : (
                          <span 
                            className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border cursor-pointer hover:opacity-80 transition-opacity ${getCategoryColor(record.category)}`}
                            onClick={() => {setEditingRow(record.id); setEditingField('category');}}
                            title="点击选择分类"
                          >
                            {record.category}
                          </span>
                        )}
                      </td>

                      {/* 可行性 */}
                      <td className="px-4 py-4 whitespace-nowrap relative">
                        {editingRow === record.id && editingField === 'feasibility' ? (
                          <div className="absolute top-0 left-0 z-10 bg-white border border-blue-300 rounded-lg shadow-lg">
                            <select
                              value={record.feasibility}
                              onChange={(e) => {
                                handleEditField(record.id, 'feasibility', e.target.value);
                                setEditingRow(null);
                                setEditingField(null);
                              }}
                              onBlur={() => {setEditingRow(null); setEditingField(null);}}
                              className="px-3 py-2 border-0 rounded text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                              autoFocus
                            >
                              <option value="可行">可行</option>
                              <option value="不可行">不可行</option>
                            </select>
                          </div>
                        ) : (
                          <span 
                            className={`text-sm font-medium cursor-pointer hover:underline transition-colors px-2 py-1 rounded hover:bg-gray-100 ${getFeasibilityColor(record.feasibility)}`}
                            onClick={() => {setEditingRow(record.id); setEditingField('feasibility');}}
                            title="点击选择可行性"
                          >
                            {record.feasibility}
                          </span>
                        )}
                      </td>

                      {/* 后续计划 */}
                      <td className="px-4 py-4 whitespace-nowrap relative">
                        {editingRow === record.id && editingField === 'plan' ? (
                          <div className="absolute top-0 left-0 z-10 bg-white border border-blue-300 rounded-lg shadow-lg">
                            <select
                              value={record.plan}
                              onChange={(e) => {
                                handleEditField(record.id, 'plan', e.target.value);
                                setEditingRow(null);
                                setEditingField(null);
                              }}
                              onBlur={() => {setEditingRow(null); setEditingField(null);}}
                              className="px-3 py-2 border-0 rounded text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                              autoFocus
                            >
                              <option value="销售跟进">销售跟进</option>
                              <option value="技术对接">技术对接</option>
                              <option value="商务洽谈">商务洽谈</option>
                              <option value="需求梳理">需求梳理</option>
                              <option value="方案设计">方案设计</option>
                              <option value="产品优化">产品优化</option>
                            </select>
                          </div>
                        ) : (
                          <span 
                            className="text-sm text-gray-900 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                            onClick={() => {setEditingRow(record.id); setEditingField('plan');}}
                            title="点击选择后续计划"
                          >
                            {record.plan}
                          </span>
                        )}
                      </td>

                      {/* 备注 */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {editingRow === record.id && editingField === 'notes' ? (
                          <input
                            type="text"
                            value={record.notes}
                            onChange={(e) => handleEditField(record.id, 'notes', e.target.value)}
                            onBlur={() => {setEditingRow(null); setEditingField(null);}}
                            onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                            className="w-full px-2 py-1 border border-blue-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            autoFocus
                            placeholder="添加备注..."
                          />
                        ) : (
                          <div 
                            className="text-sm text-gray-900 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded transition-colors min-h-[1.5rem]"
                            onClick={() => {setEditingRow(record.id); setEditingField('notes');}}
                            title="点击编辑备注"
                          >
                            {record.notes || '点击添加备注'}
                          </div>
                        )}
                      </td>

                      {/* 附件 */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getFileIcon(record.sourceFile, 'text/plain')}
                          <span className="text-xs text-gray-600 truncate max-w-20" title={record.sourceFile}>
                            {record.sourceFile}
                          </span>
                        </div>
                      </td>

                      {/* 操作 */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() => openDetailModal(record)}
                          className="text-blue-600 hover:text-blue-900 text-sm p-1 rounded hover:bg-blue-50 transition-colors"
                          title="详细编辑"
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
          <div className="flex justify-between items-center mt-6">
            <div className="flex space-x-3">
              <button
                onClick={handleBackToUpload}
                disabled={isGenerating}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                重新分析
              </button>
              <button
                onClick={() => alert('已保存草稿！')}
                disabled={isGenerating}
                className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                保存草稿
              </button>
            </div>
            <button
              onClick={handleConfirmAnalysis}
              disabled={isGenerating}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>生成中... ({displayedRows}/{analysisData.length})</span>
                </>
              ) : (
                <span>确认提交 ({analysisData.length}条)</span>
              )}
            </button>
          </div>
        </div>

        {/* Detail Edit Modal */}
        {showDetailModal && selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">详细编辑</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">客户公司</label>
                  <input
                    type="text"
                    value={selectedRecord.company}
                    onChange={(e) => setSelectedRecord({...selectedRecord, company: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">联系人</label>
                  <input
                    type="text"
                    value={selectedRecord.contact}
                    onChange={(e) => setSelectedRecord({...selectedRecord, contact: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">沟通时间</label>
                  <input
                    type="text"
                    value={selectedRecord.time}
                    onChange={(e) => setSelectedRecord({...selectedRecord, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">反馈内容总结</label>
                  <textarea
                    value={selectedRecord.summary}
                    onChange={(e) => setSelectedRecord({...selectedRecord, summary: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">问题分类</label>
                    <select
                      value={selectedRecord.category}
                      onChange={(e) => setSelectedRecord({...selectedRecord, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="bug">bug</option>
                      <option value="产品优化">产品优化</option>
                      <option value="VIP定制">VIP定制</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">可行性评估</label>
                    <select
                      value={selectedRecord.feasibility}
                      onChange={(e) => setSelectedRecord({...selectedRecord, feasibility: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="可行">可行</option>
                      <option value="不可行">不可行</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">后续计划</label>
                  <select
                    value={selectedRecord.plan}
                    onChange={(e) => setSelectedRecord({...selectedRecord, plan: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="销售跟进">销售跟进</option>
                    <option value="技术对接">技术对接</option>
                    <option value="商务洽谈">商务洽谈</option>
                    <option value="需求梳理">需求梳理</option>
                    <option value="方案设计">方案设计</option>
                    <option value="产品优化">产品优化</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
                  <input
                    type="text"
                    value={selectedRecord.notes}
                    onChange={(e) => setSelectedRecord({...selectedRecord, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="添加备注信息..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={saveDetailChanges}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  保存更改
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold">AI CRM 系统 - 客户沟通管理</h1>
              <div className="text-sm opacity-90">
                科技驱动，智能管理
              </div>
            </div>
            <UserInfo />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
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
                <span>导出</span>
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
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200 rounded-b-xl">
          <div className="text-sm text-gray-700">
            显示 {(currentPage - 1) * recordsPerPage + 1} 到 {Math.min(currentPage * recordsPerPage, filteredData.length)} 条，共 {filteredData.length} 条记录
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
            >
              上一页
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 text-sm border rounded ${
                      currentPage === pageNum
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
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
            >
              下一页
            </button>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
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

            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
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
                onChange={handleFileInputChange}
                className="hidden"
                accept="video/*,audio/*,.txt,.docx,.pdf"
              />
              <label
                htmlFor="fileInput"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <FileImage className="w-4 h-4 mr-2" />
                选择文件
              </label>
            </div>

            {/* File List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">已上传文件 ({uploadedFiles.length})</h4>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.name, file.type)}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{file.name}</div>
                          <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
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
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                确定 - 下一步 (AI分析)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AICRMDashboard;
