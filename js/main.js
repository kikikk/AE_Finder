/**
 * AE Finder - 新布局版本
 */

// CEP接口
let csInterface = null;
try {
    csInterface = new CSInterface();
} catch (e) {}

// Node.js模块
let fs, path, os, child_process;
try {
    fs = cep_node.require('fs');
    path = cep_node.require('path');
    os = cep_node.require('os');
    child_process = cep_node.require('child_process');
} catch (e) {
    try {
        fs = require('fs');
        path = require('path');
        os = require('os');
        child_process = require('child_process');
    } catch (e2) {}
}

// 可编辑的文本文件类型
const TEXT_EXTENSIONS = ['txt', 'json', 'jsx', 'js', 'md', 'csv', 'xml', 'html', 'css', 'srt', 'ass', 'log', 'ini', 'cfg'];

// 文件类型配置
const FILE_TYPES = {
    image: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'tif', 'webp', 'ico'],
    video: ['mp4', 'webm', 'mov', 'avi', 'mkv', 'wmv', 'flv', 'm4v', 'mxf'],
    audio: ['mp3', 'wav', 'aac', 'flac', 'ogg', 'm4a', 'wma', 'aiff'],
    ae: ['aep', 'aepx'],
    psd: ['psd', 'psb', 'ai', 'eps'],
    text: TEXT_EXTENSIONS
};

// 文件类型图标 - 多样化
const ICONS = {
    folder: '📁', 
    image: '🖼️', 
    video: '🎬', 
    audio: '🎵',
    ae: '◈', 
    psd: '▧', 
    text: '📄', 
    script: '≡',
    file: '📃',
    parent: '↑'
};

// 拼音首字母映射表
const PINYIN_MAP = {
    '阿': 'a', '哀': 'a', '按': 'a', '暗': 'a', '爱': 'a',
    '八': 'b', '把': 'b', '白': 'b', '百': 'b', '半': 'b', '包': 'b', '北': 'b', '本': 'b', '比': 'b', '必': 'b', '边': 'b', '表': 'b', '别': 'b', '并': 'b', '不': 'b', '步': 'b', '部': 'b',
    '才': 'c', '财': 'c', '菜': 'c', '参': 'c', '草': 'c', '层': 'c', '曾': 'c', '差': 'c', '长': 'c', '常': 'c', '场': 'c', '车': 'c', '成': 'c', '城': 'c', '吃': 'c', '出': 'c', '初': 'c', '处': 'c', '传': 'c', '创': 'c', '此': 'c', '从': 'c', '存': 'c',
    '达': 'd', '答': 'd', '大': 'd', '带': 'd', '待': 'd', '代': 'd', '单': 'd', '当': 'd', '党': 'd', '到': 'd', '道': 'd', '得': 'd', '的': 'd', '等': 'd', '地': 'd', '第': 'd', '点': 'd', '电': 'd', '店': 'd', '东': 'd', '冬': 'd', '动': 'd', '都': 'd', '读': 'd', '度': 'd', '短': 'd', '对': 'd', '多': 'd',
    '而': 'e', '儿': 'e', '二': 'e',
    '发': 'f', '法': 'f', '反': 'f', '返': 'f', '范': 'f', '方': 'f', '房': 'f', '非': 'f', '飞': 'f', '分': 'f', '封': 'f', '风': 'f', '服': 'f', '父': 'f', '复': 'f', '副': 'f',
    '该': 'g', '改': 'g', '甘': 'g', '干': 'g', '刚': 'g', '高': 'g', '告': 'g', '哥': 'g', '歌': 'g', '革': 'g', '个': 'g', '各': 'g', '给': 'g', '根': 'g', '跟': 'g', '工': 'g', '公': 'g', '功': 'g', '共': 'g', '构': 'g', '购': 'g', '够': 'g', '古': 'g', '谷': 'g', '股': 'g', '骨': 'g', '固': 'g', '故': 'g', '顾': 'g', '关': 'g', '观': 'g', '官': 'g', '管': 'g', '光': 'g', '广': 'g', '规': 'g', '还': 'g', '国': 'g', '果': 'g', '过': 'g',
    '哈': 'h', '孩': 'h', '海': 'h', '寒': 'h', '含': 'h', '行': 'h', '好': 'h', '号': 'h', '合': 'h', '何': 'h', '河': 'h', '黑': 'h', '很': 'h', '恨': 'h', '红': 'h', '后': 'h', '候': 'h', '呼': 'h', '湖': 'h', '虎': 'h', '户': 'h', '护': 'h', '花': 'h', '华': 'h', '化': 'h', '话': 'h', '画': 'h', '怀': 'h', '坏': 'h', '欢': 'h', '还': 'h', '环': 'h', '换': 'h', '黄': 'h', '回': 'h', '会': 'h', '活': 'h', '火': 'h', '或': 'h', '货': 'h', '获': 'h',
    '几': 'j', '己': 'j', '计': 'j', '记': 'j', '继': 'j', '家': 'j', '加': 'j', '价': 'j', '假': 'j', '间': 'j', '简': 'j', '见': 'j', '建': 'j', '将': 'j', '江': 'j', '讲': 'j', '交': 'j', '角': 'j', '脚': 'j', '教': 'j', '叫': 'j', '节': 'j', '结': 'j', '姐': 'j', '解': 'j', '从': 'j', '今': 'j', '金': 'j', '进': 'j', '近': 'j', '尽': 'j', '经': 'j', '京': 'j', '精': 'j', '景': 'j', '静': 'j', '境': 'j', '九': 'j', '久': 'j', '酒': 'j', '旧': 'j', '就': 'j', '居': 'j', '局': 'j', '具': 'j', '剧': 'j', '据': 'j', '卷': 'j', '决': 'j', '觉': 'j', '绝': 'j', '军': 'j',
    '喀': 'k', '开': 'k', '看': 'k', '康': 'k', '考': 'k', '靠': 'k', '科': 'k', '可': 'k', '克': 'k', '刻': 'k', '客': 'k', '课': 'k', '肯': 'k', '空': 'k', '恐': 'k', '口': 'k', '快': 'k', '块': 'k', '况': 'k',
    '拉': 'l', '来': 'l', '兰': 'l', '蓝': 'l', '罪': 'l', '老': 'l', '乐': 'l', '雷': 'l', '类': 'l', '冷': 'l', '离': 'l', '里': 'l', '理': 'l', '力': 'l', '历': 'l', '立': 'l', '丽': 'l', '利': 'l', '例': 'l', '连': 'l', '联': 'l', '脸': 'l', '恋': 'l', '良': 'l', '亮': 'l', '量': 'l', '了': 'l', '料': 'l', '林': 'l', '零': 'l', '领': 'l', '灵': 'l', '另': 'l', '流': 'l', '六': 'l', '龙': 'l', '楼': 'l', '露': 'l', '路': 'l', '录': 'l', '绿': 'l', '论': 'l', '落': 'l',
    '妈': 'm', '麻': 'm', '马': 'm', '吗': 'm', '买': 'm', '卖': 'm', '满': 'm', '毛': 'm', '么': 'm', '没': 'm', '每': 'm', '美': 'm', '妹': 'm', '门': 'm', '们': 'm', '梦': 'm', '米': 'm', '密': 'm', '眠': 'm', '面': 'm', '民': 'm', '名': 'm', '明': 'm', '命': 'm', '摸': 'm', '模': 'm', '某': 'm', '母': 'm', '木': 'm', '目': 'm',
    '拿': 'n', '哪': 'n', '南': 'n', '男': 'n', '难': 'n', '脑': 'n', '呢': 'n', '内': 'n', '能': 'n', '你': 'n', '年': 'n', '念': 'n', '娘': 'n', '鸟': 'n', '宁': 'n', '牛': 'n', '农': 'n', '女': 'n',
    '哦': 'o', '欧': 'o',
    '怕': 'p', '拍': 'p', '排': 'p', '派': 'p', '盘': 'p', '判': 'p', '旁': 'p', '跑': 'p', '朋': 'p', '皮': 'p', '片': 'p', '票': 'p', '品': 'p', '平': 'p', '评': 'p', '破': 'p', '普': 'p',
    '七': 'q', '期': 'q', '其': 'q', '奇': 'q', '齐': 'q', '起': 'q', '气': 'q', '器': 'q', '千': 'q', '前': 'q', '钱': 'q', '潜': 'q', '浅': 'q', '强': 'q', '墙': 'q', '亲': 'q', '青': 'q', '轻': 'q', '清': 'q', '情': 'q', '请': 'q', '庆': 'q', '穷': 'q', '秋': 'q', '求': 'q', '球': 'q', '区': 'q', '曲': 'q', '取': 'q', '去': 'q', '全': 'q', '确': 'q', '群': 'q',
    '然': 'r', '让': 'r', '热': 'r', '人': 'r', '认': 'r', '任': 'r', '仍': 'r', '日': 'r', '容': 'r', '如': 'r', '入': 'r', '软': 'r',
    '三': 's', '色': 's', '杀': 's', '山': 's', '善': 's', '伤': 's', '上': 's', '少': 's', '社': 's', '设': 's', '谁': 's', '身': 's', '深': 's', '神': 's', '生': 's', '声': 's', '省': 's', '圣': 's', '剩': 's', '失': 's', '师': 's', '诗': 's', '十': 's', '石': 's', '时': 's', '实': 's', '食': 's', '史': 's', '使': 's', '式': 's', '示': 's', '世': 's', '事': 's', '市': 's', '是': 's', '适': 's', '室': 's', '视': 's', '试': 's', '收': 's', '手': 's', '守': 's', '首': 's', '受': 's', '书': 's', '数': 's', '树': 's', '双': 's', '水': 's', '顺': 's', '说': 's', '思': 's', '算': 's', '私': 's', '死': 's', '四': 's', '寺': 's', '似': 's', '送': 's', '诉': 's', '速': 's', '素': 's', '塑': 's', '算': 's', '随': 's', '岁': 's', '损': 's', '所': 's',
    '他': 't', '她': 't', '它': 't', '台': 't', '抬': 't', '太': 't', '态': 't', '谈': 't', '坦': 't', '汤': 't', '糖': 't', '堂': 't', '特': 't', '疼': 't', '提': 't', '题': 't', '体': 't', '天': 't', '田': 't', '条': 't', '跳': 't', '贴': 't', '铁': 't', '厅': 't', '停': 't', '庭': 't', '同': 't', '统': 't', '突': 't', '图': 't', '土': 't', '团': 't', '推': 't', '腿': 't', '退': 't', '托': 't',
    '挖': 'w', '外': 'w', '完': 'w', '玩': 'w', '晚': 'w', '万': 'w', '王': 'w', '网': 'w', '忘': 'w', '望': 'w', '危': 'w', '微': 'w', '为': 'w', '维': 'w', '伟': 'w', '尾': 'w', '委': 'w', '未': 'w', '位': 'w', '味': 'w', '温': 'w', '文': 'w', '问': 'w', '我': 'w', '卧': 'w', '握': 'w', '屋': 'w', '无': 'w', '五': 'w', '午': 'w', '舞': 'w', '物': 'w', '务': 'w', '误': 'w',
    '希': 'x', '息': 'x', '悉': 'x', '习': 'x', '席': 'x', '袭': 'x', '洗': 'x', '喜': 'x', '系': 'x', '细': 'x', '下': 'x', '夏': 'x', '先': 'x', '鲜': 'x', '闲': 'x', '显': 'x', '县': 'x', '现': 'x', '线': 'x', '限': 'x', '相': 'x', '香': 'x', '想': 'x', '享': 'x', '响': 'x', '向': 'x', '象': 'x', '消': 'x', '小': 'x', '校': 'x', '笑': 'x', '效': 'x', '些': 'x', '鞋': 'x', '写': 'x', '血': 'x', '新': 'x', '心': 'x', '信': 'x', '星': 'x', '兴': 'x', '形': 'x', '姓': 'x', '性': 'x', '幸': 'x', '需': 'x', '虚': 'x', '许': 'x', '序': 'x', '绪': 'x', '续': 'x', '轩': 'x', '宣': 'x', '学': 'x', '雪': 'x', '寻': 'x', '训': 'x', '迅': 'x',
    '压': 'y', '呀': 'y', '牙': 'y', '亚': 'y', '言': 'y', '沿': 'y', '眼': 'y', '演': 'y', '阳': 'y', '样': 'y', '要': 'y', '也': 'y', '夜': 'y', '一': 'y', '一': 'y', '衣': 'y', '医': 'y', '已': 'y', '以': 'y', '艺': 'y', '易': 'y', '亦': 'y', '意': 'y', '因': 'y', '音': 'y', '银': 'y', '引': 'y', '应': 'y', '英': 'y', '营': 'y', '影': 'y', '硬': 'y', '用': 'y', '优': 'y', '由': 'y', '油': 'y', '游': 'y', '友': 'y', '有': 'y', '又': 'y', '幼': 'y', '于': 'y', '与': 'y', '语': 'y', '玉': 'y', '预': 'y', '域': 'y', '雨': 'y', '元': 'y', '远': 'y', '院': 'y', '原': 'y', '圆': 'y', '月': 'y', '越': 'y', '运': 'y',
    '杂': 'z', '在': 'z', '咱': 'z', '早': 'z', '造': 'z', '怎': 'z', '曾': 'z', '增': 'z', '占': 'z', '站': 'z', '张': 'z', '章': 'z', '掌': 'z', '长': 'z', '找': 'z', '着': 'z', '照': 'z', '者': 'z', '这': 'z', '浙': 'z', '针': 'z', '真': 'z', '整': 'z', '正': 'z', '政': 'z', '证': 'z', '知': 'z', '之': 'z', '支': 'z', '执': 'z', '直': 'z', '指': 'z', '纸': 'z', '只': 'z', '至': 'z', '志': 'z', '制': 'z', '治': 'z', '中': 'z', '终': 'z', '钟': 'z', '种': 'z', '众': 'z', '重': 'z', '周': 'z', '主': 'z', '住': 'z', '注': 'z', '祖': 'z', '著': 'z', '篇': 'z', '转': 'z', '专': 'z', '装': 'z', '状': 'z', '资': 'z', '紫': 'z', '子': 'z', '字': 'z', '自': 'z', '总': 'z', '走': 'z', '组': 'z', '嘴': 'z', '最': 'z', '罪': 'z', '尊': 'z', '作': 'z', '坐': 'z', '做': 'z'
};

// 智能读取文件（自动检测编码）
function readFileWithEncoding(filePath) {
    try {
        const buffer = fs.readFileSync(filePath);
        
        // 检测 BOM
        if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
            // UTF-8 with BOM
            return buffer.slice(3).toString('utf8');
        }
        if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
            // UTF-16 LE
            return buffer.slice(2).toString('utf16le');
        }
        if (buffer[0] === 0xFE && buffer[1] === 0xFF) {
            // UTF-16 BE - Node.js 不直接支持，需要交换字节
            const swapped = Buffer.alloc(buffer.length - 2);
            for (let i = 2; i < buffer.length; i += 2) {
                swapped[i - 2] = buffer[i + 1];
                swapped[i - 1] = buffer[i];
            }
            return swapped.toString('utf16le');
        }
        
        // 尝试 UTF-8
        const utf8Content = buffer.toString('utf8');
        // 检查是否有乱码特征（连续的替换字符）
        const replacementCount = (utf8Content.match(/\uFFFD/g) || []).length;
        if (replacementCount < 5 || replacementCount / utf8Content.length < 0.01) {
            return utf8Content;
        }
        
        // 尝试 GBK/GB2312 (Windows 中文编码)
        // CEP 环境不直接支持 GBK，使用简单的启发式检测
        // 如果是GBK编码，则用 latin1 读取后转换
        try {
            const latin1Content = buffer.toString('latin1');
            // 尝试GBK解码
            const decoded = decodeGBK(buffer);
            if (decoded && decoded.length > 0) {
                return decoded;
            }
        } catch (e) {}
        
        return utf8Content;
    } catch (e) {
        return null;
    }
}

// 简单的 GBK 解码（覆盖常用中文字符）
function decodeGBK(buffer) {
    let result = '';
    let i = 0;
    while (i < buffer.length) {
        const byte1 = buffer[i];
        if (byte1 < 0x80) {
            // ASCII
            result += String.fromCharCode(byte1);
            i++;
        } else if (i + 1 < buffer.length) {
            const byte2 = buffer[i + 1];
            // GBK 双字节范围
            if (byte1 >= 0x81 && byte1 <= 0xFE && byte2 >= 0x40 && byte2 <= 0xFE) {
                // 尝试使用 TextDecoder (CEP 环境可能支持)
                try {
                    const decoder = new TextDecoder('gbk');
                    return decoder.decode(buffer);
                } catch (e) {
                    // TextDecoder 不支持 GBK，跳过这个字符
                    result += '?';
                    i += 2;
                }
            } else {
                result += '?';
                i++;
            }
        } else {
            result += '?';
            i++;
        }
    }
    return result;
}

// 获取中文字符串的拼音首字母
function getPinyinInitials(str) {
    let result = '';
    for (const char of str) {
        if (PINYIN_MAP[char]) {
            result += PINYIN_MAP[char];
        } else if (/[a-zA-Z0-9]/.test(char)) {
            result += char.toLowerCase();
        }
    }
    return result;
}

// 模糊搜索匹配
function fuzzyMatch(name, query) {
    const lowerName = name.toLowerCase();
    const lowerQuery = query.toLowerCase();
    
    // 1. 直接包含
    if (lowerName.includes(lowerQuery)) return true;
    
    // 2. 拼音首字母匹配
    const initials = getPinyinInitials(name);
    if (initials.includes(lowerQuery)) return true;
    
    // 3. 首字母连续匹配（模糊）
    let qi = 0;
    for (const char of lowerName) {
        if (char === lowerQuery[qi]) {
            qi++;
            if (qi === lowerQuery.length) return true;
        }
    }
    
    return false;
}

// 状态
const state = {
    currentPath: '',
    previewPath: '',  // 右侧预览区当前路径
    selectedFile: null,
    files: [],
    previewFiles: [],  // 右侧面板文件列表
    drives: [],
    history: [],
    tagFolders: [],
    pinnedItems: {},  // 置顶项: { 目录路径: [文件名1, 文件名2, ...] }
    lastPath: '',
    defaultPath: '',
    editingFile: null,
    originalContent: '',
    viewMode: 'list',
    previewViewMode: 'list',  // 右侧面板视图模式
    sortBy: 'name',
    sortAsc: true,
    previewSortBy: 'name',  // 右侧面板排序
    previewSortAsc: true,
    zoomList: 1,
    zoomPreview: 1,
    zoomEditor: 1,
    searchQuery: ''  // 全局搜索关键词
};

const STORAGE_KEY = 'ae_finder_data';
let elements = {};

// 列宽状态
const columnWidths = {
    left: { type: 50, date: 80 },
    right: { type: 50, date: 80 }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadStoredData();
    initElements();
    initDrives();
    initEventListeners();
    initSplitterDrag();
    initColumnResize();
    initZoom();
    initPathResizeObserver();
    renderTagFolders();
    
    const startPath = state.defaultPath || state.lastPath || os.homedir();
    navigateTo(startPath);
});

function loadStoredData() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            const parsed = JSON.parse(data);
            state.history = parsed.history || [];
            state.tagFolders = parsed.tagFolders || [];
            state.pinnedItems = parsed.pinnedItems || {};
            state.lastPath = parsed.lastPath || '';
            state.defaultPath = parsed.defaultPath || '';
            state.viewMode = parsed.viewMode || 'list';
            // 迁移旧的 'size' 排序到 'type'
            let sortBy = parsed.sortBy || 'name';
            if (sortBy === 'size') sortBy = 'type';
            state.sortBy = sortBy;
            state.sortAsc = parsed.sortAsc !== false;
        }
    } catch (e) {}
}

function saveData() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            history: state.history.slice(0, 50),
            tagFolders: state.tagFolders,
            pinnedItems: state.pinnedItems,
            lastPath: state.currentPath,
            defaultPath: state.defaultPath,
            viewMode: state.viewMode,
            sortBy: state.sortBy,
            sortAsc: state.sortAsc
        }));
    } catch (e) {}
}

function initElements() {
    elements = {
        appTitle: document.getElementById('app-title'),
        pathInput: document.getElementById('path-input'),
        historyDropdown: document.getElementById('history-dropdown'),
        btnOpenExplorer: document.getElementById('btn-open-explorer'),
        btnHome: document.getElementById('btn-home'),
        btnTags: document.getElementById('btn-tags'),
        tagsDropdown: document.getElementById('tags-dropdown'),
        btnPreviewHome: document.getElementById('btn-preview-home'),
        btnViewToggle: document.getElementById('btn-view-toggle'),
        listHeader: document.getElementById('list-header'),
        drivesBar: document.getElementById('drives-bar'),
        drivesBarRight: document.getElementById('drives-bar-right'),
        leftPath: document.getElementById('left-path'),
        rightPath: document.getElementById('right-path'),
        listContent: document.getElementById('list-content'),
        fileList: document.getElementById('file-list'),
        previewPanel: document.getElementById('preview-panel'),
        previewContainer: document.getElementById('preview-container'),
        previewPlaceholder: document.getElementById('preview-placeholder'),
        folderContents: document.getElementById('folder-contents'),
        mediaPreview: document.getElementById('media-preview'),
        previewListHeader: document.getElementById('preview-list-header'),
        btnPreviewViewToggle: document.getElementById('btn-preview-view-toggle'),
        editorPanel: document.getElementById('editor-panel'),
        editorTitle: document.getElementById('editor-title'),
        fileDetails: document.getElementById('file-details'),
        textEditor: document.getElementById('text-editor'),
        btnSave: document.getElementById('btn-save'),
        statusText: document.getElementById('status-text'),
        itemCount: document.getElementById('item-count')
    };
}

function initDrives() {
    const drives = [];
    for (let i = 65; i <= 90; i++) {
        const drive = String.fromCharCode(i) + ':\\';
        try {
            fs.accessSync(drive);
            drives.push(drive);
        } catch (e) {}
    }
    state.drives = drives;
    renderDrives();
}

// 渲染磁盘按钮（左右两侧）
function renderDrives() {
    const html = state.drives.map(drive => 
        `<button class="drive-btn" data-path="${drive}">${drive.replace('\\', '')}</button>`
    ).join('');
    elements.drivesBar.innerHTML = html;
    elements.drivesBarRight.innerHTML = html;
}

// 更新路径显示 - 面包屑导航
function updatePathDisplay(targetPath, container) {
    if (!targetPath) {
        container.innerHTML = '';
        container.title = '';
        return;
    }
    
    container.title = targetPath;
    
    // 解析路径段
    const segments = [];
    let currentPath = targetPath;
    
    // 提取盘符
    const driveMatch = targetPath.match(/^([A-Z]):\\/i);
    if (driveMatch) {
        segments.push({ name: driveMatch[1] + ':', fullPath: driveMatch[1] + ':\\' });
        currentPath = targetPath.slice(3);
    }
    
    // 提取各级文件夹
    if (currentPath) {
        const parts = currentPath.split('\\').filter(p => p);
        let buildPath = driveMatch ? driveMatch[1] + ':\\' : '';
        parts.forEach(part => {
            buildPath = path.join(buildPath, part);
            segments.push({ name: part, fullPath: buildPath });
        });
    }
    
    // 渲染面包屑
    const panelId = container.id;
    container.innerHTML = segments.map((seg, idx) => `
        <span class="path-segment">
            <span class="path-name" data-path="${seg.fullPath}" data-panel="${panelId}">${seg.name}</span>
            <span class="path-arrow" data-path="${seg.fullPath}" data-panel="${panelId}">▸</span>
        </span>
        ${idx < segments.length - 1 ? '' : ''}
    `).join('');
    
    // 自动滚动到最右边，保证最后的路径始终可见
    requestAnimationFrame(() => {
        container.scrollLeft = container.scrollWidth;
    });
}

// 监听容器大小变化，自动滚动面包屑到最右
function initPathResizeObserver() {
    const observer = new ResizeObserver(() => {
        if (elements.leftPath) {
            elements.leftPath.scrollLeft = elements.leftPath.scrollWidth;
        }
        if (elements.rightPath) {
            elements.rightPath.scrollLeft = elements.rightPath.scrollWidth;
        }
    });
    
    // 监听左右面板大小变化
    if (elements.fileList) observer.observe(elements.fileList);
    if (elements.previewPanel) observer.observe(elements.previewPanel);
}

function updateHomeButton() {
    // 只有当前路径是默认路径时才高亮
    if (state.defaultPath && state.currentPath === state.defaultPath) {
        elements.btnHome.classList.add('has-default');
        elements.btnHome.title = '当前为默认文件夹';
    } else if (state.defaultPath) {
        elements.btnHome.classList.remove('has-default');
        elements.btnHome.title = '跳转到默认: ' + state.defaultPath;
    } else {
        elements.btnHome.classList.remove('has-default');
        elements.btnHome.title = '设置默认文件夹';
    }
}

// 更新右侧面板默认按钮状态
function updatePreviewHomeButton() {
    if (state.defaultPath && state.previewPath === state.defaultPath) {
        elements.btnPreviewHome.classList.add('has-default');
        elements.btnPreviewHome.title = '当前为默认文件夹';
    } else if (state.previewPath) {
        elements.btnPreviewHome.classList.remove('has-default');
        elements.btnPreviewHome.title = '设为默认文件夹';
    }
}

function updateSortUI() {
    // 更新排序标识
    document.querySelectorAll('#list-header [data-sort]').forEach(col => {
        const arrow = col.querySelector('.sort-arrow');
        if (col.dataset.sort === state.sortBy) {
            col.classList.add('active');
            arrow.textContent = state.sortAsc ? '▲' : '▼';
        } else {
            col.classList.remove('active');
            arrow.textContent = '';
        }
    });
    
    // 更新视图按钮
    elements.btnViewToggle.textContent = state.viewMode === 'list' ? '☰' : '▦';
    elements.btnViewToggle.title = state.viewMode === 'list' ? '切换到网格视图' : '切换到列表视图';
    
    // 更新列表容器class
    elements.listContent.classList.toggle('grid-view', state.viewMode === 'grid');
}

// 更新右侧面板排序 UI
function updatePreviewSortUI() {
    // 更新排序标识
    document.querySelectorAll('#preview-list-header [data-sort]').forEach(col => {
        const arrow = col.querySelector('.sort-arrow');
        if (col.dataset.sort === state.previewSortBy) {
            col.classList.add('active');
            arrow.textContent = state.previewSortAsc ? '▲' : '▼';
        } else {
            col.classList.remove('active');
            arrow.textContent = '';
        }
    });
    
    // 更新视图按钮
    elements.btnPreviewViewToggle.textContent = state.previewViewMode === 'list' ? '☰' : '▦';
    elements.btnPreviewViewToggle.title = state.previewViewMode === 'list' ? '切换到网格视图' : '切换到列表视图';
}


function renderTagFolders() {
    // 更新标签按钮状态
    if (state.tagFolders.length > 0) {
        elements.btnTags.classList.add('has-tags');
        elements.btnTags.title = `标签文件夹 (${state.tagFolders.length})`;
    } else {
        elements.btnTags.classList.remove('has-tags');
        elements.btnTags.title = '标签文件夹';
    }
}

function showTagsDropdown() {
    const btn = elements.btnTags;
    const dropdown = elements.tagsDropdown;
    
    if (state.tagFolders.length === 0) {
        dropdown.innerHTML = '<div class="tags-empty">拖拽文件夹到此添加标签</div>';
    } else {
        dropdown.innerHTML = state.tagFolders.map((tag, idx) => `
            <div class="tag-folder" data-path="${tag.path}" data-index="${idx}">
                <span class="tag-name">${tag.path}</span>
                <span class="tag-remove" data-path="${tag.path}">×</span>
            </div>
        `).join('');
    }
    
    // 定位
    const rect = btn.getBoundingClientRect();
    dropdown.style.top = (rect.bottom + 2) + 'px';
    dropdown.style.left = rect.left + 'px';
    dropdown.classList.add('show');
}

function hideTagsDropdown() {
    elements.tagsDropdown.classList.remove('show');
}

function addTagFolder(folderPath) {
    if (state.tagFolders.find(t => t.path === folderPath)) return;
    if (state.tagFolders.length >= 20) {
        setStatus('最多20个标签');
        return;
    }
    state.tagFolders.push({ path: folderPath, name: path.basename(folderPath) });
    renderTagFolders();
    saveData();
    setStatus('已添加标签');
}

function removeTagFolder(folderPath) {
    state.tagFolders = state.tagFolders.filter(t => t.path !== folderPath);
    renderTagFolders();
    saveData();
}

// 添加历史记录 - 优化判定标准
function addHistory(folderPath) {
    // 不记录磁盘根目录
    if (/^[A-Z]:\\?$/i.test(folderPath)) return;
    // 不记录系统目录
    const lowerPath = folderPath.toLowerCase();
    if (lowerPath.includes('\\windows\\') || lowerPath.includes('\\$recycle.bin')) return;
    
    // 移除重复项
    state.history = state.history.filter(h => h.path !== folderPath);
    // 添加到开头
    state.history.unshift({ path: folderPath, time: new Date().toISOString() });
    // 限制数量
    state.history = state.history.slice(0, 50);
    saveData();
}

function renderHistoryDropdown() {
    const sorted = [...state.history].sort((a, b) => new Date(b.time) - new Date(a.time));
    elements.historyDropdown.innerHTML = sorted.slice(0, 20).map(h => {
        const d = new Date(h.time);
        const timeStr = `${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
        return `<div class="history-item" data-path="${h.path}"><span class="history-path">${h.path}</span><span class="history-time">${timeStr}</span></div>`;
    }).join('');
}

// 计算历史下拉框位置，底部到列表内容区之上
function positionHistoryDropdown() {
    const inputRect = elements.pathInput.getBoundingClientRect();
    const listContent = document.getElementById('list-content');
    const listRect = listContent.getBoundingClientRect();
    
    elements.historyDropdown.style.top = (inputRect.bottom + 2) + 'px';
    elements.historyDropdown.style.left = inputRect.left + 'px';
    elements.historyDropdown.style.right = (window.innerWidth - inputRect.right) + 'px';
    elements.historyDropdown.style.maxHeight = (listRect.top - inputRect.bottom - 6) + 'px';
}

// 全局搜索功能 - 支持模糊搜索和拼音首字母
function performSearch(query) {
    state.searchQuery = query.trim();
    
    if (!state.searchQuery) {
        // 清空搜索，恢复原始列表
        renderFileList(state.files);
        if (state.previewPath) {
            showFolderContents(state.previewPath);
        }
        return;
    }
    
    // 搜索左侧容器 - 使用模糊匹配
    const filteredLeft = state.files.filter(f => fuzzyMatch(f.name, state.searchQuery));
    renderFilteredFileList(filteredLeft);
    
    // 搜索右侧容器
    if (state.previewPath) {
        searchRightPanel(state.previewPath, state.searchQuery);
    }
}

// 渲染过滤后的文件列表（左侧）
function renderFilteredFileList(files) {
    // 返回上级项 - 始终显示
    const parentPath = path.dirname(state.currentPath);
    const isRoot = parentPath === state.currentPath;
    
    let html = `
        <div class="list-item parent-item" data-path="${isRoot ? state.currentPath : parentPath}" data-type="parent" ${isRoot ? 'data-disabled="true"' : ''} title="返回上级目录">
            <span class="icon">${ICONS.parent}</span>
            <span class="name">..</span>
            <span class="type"></span>
            <span class="mtime"></span>
            <span class="actions"></span>
        </div>
    `;
    
    html += files.map(file => {
        const icon = getFileIcon(file.type, file.ext);
        const typeLabel = getTypeLabel(file.type, file.ext);
        const mtime = formatDateShort(file.mtime);
        const draggable = file.isDirectory ? 'draggable="true"' : '';
        
        return `
            <div class="list-item" data-path="${file.path}" data-type="${file.type}" ${draggable}>
                <span class="icon">${icon}</span>
                <span class="name">${highlightMatch(file.name, state.searchQuery)}</span>
                <span class="type">${typeLabel}</span>
                <span class="mtime">${mtime}</span>
                <span class="actions"></span>
            </div>
        `;
    }).join('');
    
    elements.listContent.innerHTML = html;
    applyColumnWidths('left');
}

// 搜索右侧面板 - 使用模糊匹配
function searchRightPanel(folderPath, query) {
    try {
        const items = fs.readdirSync(folderPath);
        const contents = [];
        
        items.forEach(name => {
            if (!fuzzyMatch(name, query)) return;
            try {
                const fullPath = path.join(folderPath, name);
                const stat = fs.statSync(fullPath);
                const ext = path.extname(name).toLowerCase().slice(1);
                const type = getFileType(ext, stat.isDirectory());
                contents.push({ name, path: fullPath, type, ext, isDirectory: stat.isDirectory(), size: stat.size, mtime: stat.mtime });
            } catch (e) {}
        });
        
        // 排序
        contents.sort((a, b) => {
            if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
            return a.name.localeCompare(b.name, 'zh-CN');
        });
        
        showFilteredFolderList(folderPath, contents, query);
    } catch (e) {}
}

// 渲染过滤后的右侧列表
function showFilteredFolderList(folderPath, contents, query) {
    elements.previewPlaceholder.style.display = 'none';
    elements.mediaPreview.style.display = 'none';
    elements.folderContents.style.display = 'block';
    elements.previewListHeader.style.display = 'flex';
    
    const folders = contents.filter(item => item.isDirectory);
    const files = contents.filter(item => !item.isDirectory);
    
    // 回退上一级行
    const parentPath = path.dirname(folderPath);
    const isRoot = parentPath === folderPath;
    let html = `
        <div class="folder-item parent-item" data-path="${isRoot ? folderPath : parentPath}" data-type="parent" ${isRoot ? 'data-disabled="true"' : ''} title="返回上级目录">
            <span class="icon">${ICONS.parent}</span>
            <span class="name">..</span>
            <span class="type"></span>
            <span class="mtime"></span>
            <span class="actions"></span>
        </div>
    `;
    
    // 文件夹
    folders.forEach(item => {
        const icon = getFileIcon(item.type, item.ext);
        const typeLabel = getTypeLabel(item.type, item.ext);
        const mtime = formatDateShort(item.mtime);
        html += `
            <div class="folder-item" data-path="${item.path}" data-type="${item.type}" data-ext="${item.ext}">
                <span class="icon">${icon}</span>
                <span class="name">${highlightMatch(item.name, query)}</span>
                <span class="type">${typeLabel}</span>
                <span class="mtime">${mtime}</span>
                <span class="actions"></span>
            </div>
        `;
    });
    
    // 文件
    if (files.length > 0) {
        html += `<div class="file-grid">`;
        files.forEach(item => {
            const fileUrl = `file:///${item.path.replace(/\\/g, '/')}`;
            const isMedia = ['image', 'video', 'audio'].includes(item.type);
            if (isMedia) {
                let mediaEl = '';
                if (item.type === 'image') {
                    mediaEl = `<img src="${fileUrl}" alt="${item.name}" loading="lazy">`;
                } else if (item.type === 'video') {
                    mediaEl = `<video src="${fileUrl}" controls preload="metadata"></video>`;
                } else if (item.type === 'audio') {
                    mediaEl = `<audio src="${fileUrl}" controls preload="metadata"></audio>`;
                }
                html += `
                    <div class="file-grid-item media-item" data-path="${item.path}" data-type="${item.type}" data-ext="${item.ext}">
                        <div class="thumb">${mediaEl}</div>
                        <div class="name">${highlightMatch(item.name, query)}</div>
                    </div>
                `;
            } else {
                const icon = getFileIcon(item.type, item.ext);
                html += `
                    <div class="file-grid-item" data-path="${item.path}" data-type="${item.type}" data-ext="${item.ext}">
                        <div class="thumb"><span class="thumb-icon">${icon}</span></div>
                        <div class="name">${highlightMatch(item.name, query)}</div>
                    </div>
                `;
            }
        });
        html += `</div>`;
    }
    
    elements.folderContents.innerHTML = html;
    applyColumnWidths('right');
    bindFolderItemEvents();
}

// 高亮匹配文字
function highlightMatch(text, query) {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query);
    if (idx === -1) return text;
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + query.length);
    const after = text.slice(idx + query.length);
    return `${before}<mark>${match}</mark>${after}`;
}

function goToDefaultOrSetDefault() {
    if (state.defaultPath) {
        if (state.currentPath === state.defaultPath) {
            // 当前已是默认路径，取消默认
            clearDefaultFolder();
        } else {
            // 有默认但不在当前路径，跳转过去
            navigateTo(state.defaultPath);
        }
    } else {
        // 没有默认，设置当前为默认
        state.defaultPath = state.currentPath;
        setStatus('已设为默认: ' + state.currentPath);
        saveData();
        updateHomeButton();
    }
}

function clearDefaultFolder() {
    state.defaultPath = '';
    setStatus('已取消默认文件夹');
    saveData();
    updateHomeButton();
}

function toggleSort(sortField) {
    if (state.sortBy === sortField) {
        state.sortAsc = !state.sortAsc;
    } else {
        state.sortBy = sortField;
        state.sortAsc = true;
    }
    sortAndRenderFiles();
    saveData();
}

function toggleView() {
    state.viewMode = state.viewMode === 'list' ? 'grid' : 'list';
    updateSortUI();
    renderFileList(state.files);
    saveData();
}

function sortAndRenderFiles() {
    sortFiles();
    updateSortUI();
    renderFileList(state.files);
}

function sortFiles() {
    const pinnedInDir = state.pinnedItems[state.currentPath] || [];
    
    state.files.sort((a, b) => {
        // 置顶项始终最优先
        const aPinned = pinnedInDir.includes(a.name);
        const bPinned = pinnedInDir.includes(b.name);
        if (aPinned !== bPinned) return aPinned ? -1 : 1;
        // 置顶项之间按置顶顺序
        if (aPinned && bPinned) {
            return pinnedInDir.indexOf(a.name) - pinnedInDir.indexOf(b.name);
        }
        
        // 文件夹优先
        if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
        
        let cmp = 0;
        switch (state.sortBy) {
            case 'name':
                cmp = a.name.localeCompare(b.name, 'zh-CN');
                break;
            case 'type':
                cmp = a.type.localeCompare(b.type, 'zh-CN');
                break;
            case 'mtime':
                cmp = new Date(a.mtime) - new Date(b.mtime);
                break;
        }
        return state.sortAsc ? cmp : -cmp;
    });
}

// 置顶/取消置顶
function togglePinItem(itemPath) {
    const dirPath = path.dirname(itemPath);
    const itemName = path.basename(itemPath);
    
    if (!state.pinnedItems[dirPath]) {
        state.pinnedItems[dirPath] = [];
    }
    
    const idx = state.pinnedItems[dirPath].indexOf(itemName);
    if (idx >= 0) {
        // 取消置顶
        state.pinnedItems[dirPath].splice(idx, 1);
        if (state.pinnedItems[dirPath].length === 0) {
            delete state.pinnedItems[dirPath];
        }
        setStatus('已取消置顶: ' + itemName);
    } else {
        // 置顶
        state.pinnedItems[dirPath].push(itemName);
        setStatus('已置顶: ' + itemName);
    }
    
    saveData();
    // 刷新列表
    if (state.currentPath === dirPath) {
        sortAndRenderFiles();
    }
    if (state.previewPath === dirPath) {
        showFolderContents(state.previewPath);
    }
}

// 检查是否已置顶
function isItemPinned(itemPath) {
    const dirPath = path.dirname(itemPath);
    const itemName = path.basename(itemPath);
    return (state.pinnedItems[dirPath] || []).includes(itemName);
}

function initEventListeners() {
    // 搜索输入 - 实时搜索
    const pathInputWrapper = document.getElementById('path-input-wrapper');
    const pathInputClear = document.getElementById('path-input-clear');
    
    let searchTimer = null;
    let pathNavTimer = null;
    elements.pathInput.addEventListener('input', (e) => {
        const value = e.target.value.trim();
        
        // 更新清除按钮显示状态
        pathInputWrapper.classList.toggle('has-value', value.length > 0);
        
        // 如果是路径格式，实时导航
        if (value.match(/^[A-Z]:\\/i) || value.startsWith('/') || value.startsWith('\\')) {
            elements.historyDropdown.classList.remove('show');
            
            // 防抖导航
            clearTimeout(pathNavTimer);
            pathNavTimer = setTimeout(() => {
                // 检查路径是否存在且是文件夹
                try {
                    if (fs.existsSync(value) && fs.statSync(value).isDirectory()) {
                        navigateTo(value);
                        showFolderContents(value);
                    }
                } catch (err) {}
            }, 300);
            return;
        }
        
        // 防抖搜索
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            performSearch(value);
        }, 150);
    });
    
    // 清除按钮点击
    pathInputClear.addEventListener('click', () => {
        elements.pathInput.value = '';
        pathInputWrapper.classList.remove('has-value');
        performSearch('');
        elements.historyDropdown.classList.remove('show');
    });
    
    elements.pathInput.addEventListener('focus', () => {
        const value = elements.pathInput.value.trim();
        // 只有当输入框为空时才显示历史
        if (!value) {
            renderHistoryDropdown();
            positionHistoryDropdown();
            elements.historyDropdown.classList.add('show');
        }
    });
    
    // 点击页面其他区域时关闭下拉框
    document.addEventListener('mousedown', (e) => {
        if (!elements.pathInput.contains(e.target) && !elements.historyDropdown.contains(e.target)) {
            elements.historyDropdown.classList.remove('show');
        }
    });
    elements.pathInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            elements.historyDropdown.classList.remove('show');
            const value = elements.pathInput.value.trim();
            // 如果是路径格式，导航到该路径
            if (value.match(/^[A-Z]:\\/i) || value.startsWith('/') || value.startsWith('\\')) {
                navigateTo(value);
            }
        } else if (e.key === 'Escape') {
            // ESC清除搜索
            elements.pathInput.value = '';
            performSearch('');
            elements.pathInput.blur();
        }
    });
    
    // 搜索框右键菜单
    elements.pathInput.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showInputContextMenu(e.clientX, e.clientY);
    });
    
    // 双击搜索框打开文件夹选择器
    elements.pathInput.addEventListener('dblclick', () => {
        openFolderPicker('both');
    });
    
    // 历史记录点击 - 同时更新左右两侧
    elements.historyDropdown.addEventListener('click', (e) => {
        const item = e.target.closest('.history-item');
        if (item) {
            const historyPath = item.dataset.path;
            navigateTo(historyPath);
            showFolderContents(historyPath);
            elements.historyDropdown.classList.remove('show');
        }
    });
    
    // 历史记录右键 - 删除
    elements.historyDropdown.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const item = e.target.closest('.history-item');
        if (item) {
            showHistoryContextMenu(e.clientX, e.clientY, item.dataset.path);
        }
    });
    
    // 默认文件夹按钮
    elements.btnHome.addEventListener('click', goToDefaultOrSetDefault);
    elements.btnHome.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (state.defaultPath) clearDefaultFolder();
    });
    
    // 右侧面板默认按钮 - 点击切换默认状态
    elements.btnPreviewHome.addEventListener('click', () => {
        if (state.previewPath) {
            if (state.defaultPath === state.previewPath) {
                // 当前已是默认，取消
                clearDefaultFolder();
                updatePreviewHomeButton();
            } else {
                // 设为默认
                state.defaultPath = state.previewPath;
                setStatus('已设为默认: ' + state.previewPath);
                saveData();
                updateHomeButton();
                updatePreviewHomeButton();
            }
        }
    });
    elements.btnPreviewHome.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (state.defaultPath) clearDefaultFolder();
    });
    
    // 左侧磁盘按钮
    elements.drivesBar.addEventListener('click', (e) => {
        if (e.target.classList.contains('drive-btn') && e.target.dataset.path) {
            navigateTo(e.target.dataset.path);
        }
    });
    
    // 右侧磁盘按钮 - 显示磁盘内容在右侧面板
    elements.drivesBarRight.addEventListener('click', (e) => {
        if (e.target.classList.contains('drive-btn') && e.target.dataset.path) {
            showFolderContents(e.target.dataset.path);
        }
    });
    
    // 点击AE Finder刷新
    elements.appTitle.addEventListener('click', () => {
        navigateTo(state.currentPath);
        setStatus('已刷新');
    });
    
    // 面包屑路径导航事件
    initBreadcrumbEvents();
    
    // 从资源管理器打开文件夹到扩展内
    elements.btnOpenExplorer.addEventListener('click', () => {
        openFolderPicker('both');
    });
    
    // 视图切换
    elements.btnViewToggle.addEventListener('click', toggleView);
    
    // 排序
    elements.listHeader.addEventListener('click', (e) => {
        const col = e.target.closest('[data-sort]');
        if (col) toggleSort(col.dataset.sort);
    });
    
    // 标签按钮悬浮展开
    let tagsHoverTimeout = null;
    elements.btnTags.addEventListener('mouseenter', () => {
        if (tagsHoverTimeout) clearTimeout(tagsHoverTimeout);
        showTagsDropdown();
    });
    
    // 鼠标离开标签按钮时延迟关闭
    elements.btnTags.addEventListener('mouseleave', () => {
        tagsHoverTimeout = setTimeout(() => {
            if (!elements.tagsDropdown.matches(':hover')) {
                hideTagsDropdown();
            }
        }, 150);
    });
    
    // 鼠标离开下拉菜单时关闭
    elements.tagsDropdown.addEventListener('mouseleave', () => {
        tagsHoverTimeout = setTimeout(() => {
            if (!elements.btnTags.matches(':hover')) {
                hideTagsDropdown();
            }
        }, 150);
    });
    
    // 鼠标进入下拉菜单时取消关闭
    elements.tagsDropdown.addEventListener('mouseenter', () => {
        if (tagsHoverTimeout) clearTimeout(tagsHoverTimeout);
    });
    
    // 标签按钮点击也展开
    elements.btnTags.addEventListener('click', (e) => {
        e.stopPropagation();
        showTagsDropdown();
    });
    
    // 标签下拉菜单点击
    elements.tagsDropdown.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.tag-remove');
        if (removeBtn) {
            e.stopPropagation();
            removeTagFolder(removeBtn.dataset.path);
            showTagsDropdown(); // 刷新列表
            return;
        }
        const tag = e.target.closest('.tag-folder');
        if (tag) {
            const tagPath = tag.dataset.path;
            navigateTo(tagPath);
            showFolderContents(tagPath);
            hideTagsDropdown();
        }
    });
    
    // 标签下拉菜单右键 - 删除标签
    elements.tagsDropdown.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const tag = e.target.closest('.tag-folder');
        if (tag) {
            showTagContextMenu(e.clientX, e.clientY, tag.dataset.path);
        }
    });
    
    // 标签下拉菜单拖放
    elements.tagsDropdown.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    elements.tagsDropdown.addEventListener('drop', (e) => {
        e.preventDefault();
        const folderPath = e.dataTransfer.getData('text/plain');
        if (folderPath) {
            addTagFolder(folderPath);
            showTagsDropdown();
        }
    });
    
    // 点击其他地方关闭标签下拉
    document.addEventListener('click', (e) => {
        if (!elements.btnTags.contains(e.target) && !elements.tagsDropdown.contains(e.target)) {
            hideTagsDropdown();
        }
    });
    
    // 左侧容器鼠标移动 - 动态显示提示
    elements.listContent.addEventListener('mousemove', (e) => {
        const item = e.target.closest('.list-item');
        if (item) {
            const iconEl = item.querySelector('.icon');
            if (iconEl) {
                const iconRect = iconEl.getBoundingClientRect();
                if (e.clientX < iconRect.left) {
                    // 鼠标在图标左侧空隙
                    if (item.dataset.originalTitle === undefined) {
                        item.dataset.originalTitle = item.title || '';
                    }
                    item.title = '双击打开文件夹';
                } else {
                    // 鼠标在正常区域，恢复原始提示
                    if (item.dataset.originalTitle !== undefined) {
                        item.title = item.dataset.originalTitle;
                    }
                }
            }
        }
    });
    
    // 文件列表点击
    elements.listContent.addEventListener('click', (e) => {
        const item = e.target.closest('.list-item');
        if (!item) return;
        
        // 返回上级项：单击直接导航（检查禁用状态）
        if (item.dataset.type === 'parent') {
            if (item.dataset.disabled === 'true') return;
            navigateTo(item.dataset.path);
            return;
        }
        
        // 支持Ctrl/Shift多选
        if (e.ctrlKey || e.metaKey) {
            // Ctrl+点击：切换选中状态
            item.classList.toggle('selected');
            // 如果有选中项，显示最后点击的项的详情
            if (item.classList.contains('selected')) {
                showEditorOrDetailsForPath(item.dataset.path);
            }
            return;
        }
        
        if (e.shiftKey) {
            // Shift+点击：范围选择（简化处理：将当前项也选中）
            item.classList.add('selected');
            return;
        }
        
        // 普通点击：单选并预览
        selectFile(item.dataset.path);
    });
    
    // 文件列表双击
    elements.listContent.addEventListener('dblclick', (e) => {
        const item = e.target.closest('.list-item');
        
        // 双击空白区域或选项图标前面的空隙：打开文件夹选择器
        // 检查是否点击在图标左侧空隙（点击位置在图标左边界之前）
        if (item) {
            const iconEl = item.querySelector('.icon');
            if (iconEl) {
                const iconRect = iconEl.getBoundingClientRect();
                if (e.clientX < iconRect.left) {
                    openFolderPicker('left');
                    return;
                }
            }
        }
        
        if (!item) {
            // 双击空白区域：打开文件夹选择器
            openFolderPicker('left');
            return;
        }
        
        if (item.dataset.type === 'parent') return; // 返回上级已由单击处理
        
        const filePath = item.dataset.path;
        try {
            if (fs.statSync(filePath).isDirectory()) {
                navigateTo(filePath);
            } else {
                importToAE(filePath);
            }
        } catch (err) {}
    });
    
    // 文件列表拖拽
    elements.listContent.addEventListener('dragstart', (e) => {
        const item = e.target.closest('.list-item');
        if (item && item.dataset.type === 'folder') {
            e.dataTransfer.setData('text/plain', item.dataset.path);
        }
    });
    
    // 文件列表右键菜单
    elements.listContent.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const item = e.target.closest('.list-item');
        if (item && item.dataset.type !== 'parent') {
            showItemContextMenu(e.clientX, e.clientY, item.dataset.path, item.dataset.type);
        } else if (!item) {
            showNewFileMenu(e.clientX, e.clientY);
        }
    });
    
    // 编辑器按钮
    elements.btnSave.addEventListener('click', saveTextFile);
    
    // 右侧面板排序点击
    elements.previewListHeader.addEventListener('click', (e) => {
        const sortEl = e.target.closest('[data-sort]');
        if (!sortEl) return;
        const sortKey = sortEl.dataset.sort;
        if (state.previewSortBy === sortKey) {
            state.previewSortAsc = !state.previewSortAsc;
        } else {
            state.previewSortBy = sortKey;
            state.previewSortAsc = true;
        }
        updatePreviewSortUI();
        // 重新排序并显示
        if (state.previewPath) {
            showFolderContents(state.previewPath);
        }
    });
    
    // 右侧面板视图切换
    elements.btnPreviewViewToggle.addEventListener('click', () => {
        state.previewViewMode = state.previewViewMode === 'list' ? 'grid' : 'list';
        updatePreviewSortUI();
        if (state.previewPath) {
            showFolderContents(state.previewPath);
        }
    });
    
    // 左侧分类行右键菜单
    elements.listHeader.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showHeaderContextMenu(e.clientX, e.clientY, 'left');
    });
    
    // 右侧分类行右键菜单
    elements.previewListHeader.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showHeaderContextMenu(e.clientX, e.clientY, 'right');
    });
    
    // 框选功能
    initSelectionBox(elements.listContent);
    initSelectionBox(elements.folderContents);
}

function navigateTo(targetPath) {
    try {
        targetPath = path.normalize(targetPath);
        if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isDirectory()) {
            setStatus('无效路径');
            return;
        }
        
        // 清除搜索状态
        state.searchQuery = '';
        elements.pathInput.value = '';  // 清空搜索框
        
        state.currentPath = targetPath;
        
        loadDirectory(targetPath);
        addHistory(targetPath);
        updatePathDisplay(targetPath, elements.leftPath);
        updateHomeButton();
        setStatus('已加载: ' + path.basename(targetPath));
    } catch (error) {
        setStatus('错误: ' + error.message);
    }
}

function loadDirectory(dirPath) {
    const startTime = Date.now();
    try {
        const items = fs.readdirSync(dirPath);
        const files = [];
        
        items.forEach(name => {
            try {
                const fullPath = path.join(dirPath, name);
                const stat = fs.statSync(fullPath);
                const ext = path.extname(name).toLowerCase().slice(1);
                files.push({
                    name,
                    path: fullPath,
                    isDirectory: stat.isDirectory(),
                    size: stat.size,
                    mtime: stat.mtime,
                    ext,
                    type: getFileType(ext, stat.isDirectory())
                });
            } catch (e) {}
        });
        
        state.files = files;
        sortFiles();
        updateSortUI();
        renderFileList(files);
        
        elements.itemCount.textContent = `${files.length} 项 (${Date.now() - startTime}ms)`;
    } catch (error) {
        setStatus('无法读取: ' + error.message);
    }
}

function getFileType(ext, isDir) {
    if (isDir) return 'folder';
    for (const [type, exts] of Object.entries(FILE_TYPES)) {
        if (exts.includes(ext)) return type;
    }
    return 'file';
}

function renderFileList(files) {
    // 返回上级项 - 始终显示
    const parentPath = path.dirname(state.currentPath);
    const isRoot = parentPath === state.currentPath;
    
    let html = `
        <div class="list-item parent-item" data-path="${isRoot ? state.currentPath : parentPath}" data-type="parent" ${isRoot ? 'data-disabled="true"' : ''} title="返回上级目录">
            <span class="icon">${ICONS.parent}</span>
            <span class="name">..</span>
            <span class="type"></span>
            <span class="mtime"></span>
            <span class="actions"></span>
        </div>
    `;
    
    html += files.map(file => {
        const icon = getFileIcon(file.type, file.ext);
        const typeLabel = getTypeLabel(file.type, file.ext);
        const mtime = formatDateShort(file.mtime);
        const draggable = file.isDirectory ? 'draggable="true"' : '';
        const isPinned = isItemPinned(file.path);
        const pinnedClass = isPinned ? ' pinned' : '';
        return `
            <div class="list-item${pinnedClass}" data-path="${file.path}" data-type="${file.type}" ${draggable}>
                <span class="icon">${icon}</span>
                <span class="name">${file.name}</span>
                <span class="type">${typeLabel}</span>
                <span class="mtime">${mtime}</span>
                <span class="actions"></span>
            </div>
        `;
    }).join('');
    
    elements.listContent.innerHTML = html;
    applyColumnWidths('left');
}

// 根据文件类型和扩展名返回合适的图标
function getFileIcon(type, ext) {
    // 脚本文件特殊处理
    if (['jsx', 'js', 'py', 'sh', 'bat', 'cmd', 'ps1'].includes(ext)) {
        return ICONS.script;
    }
    return ICONS[type] || ICONS.file;
}

// 获取文件类型标签
function getTypeLabel(type, ext) {
    const labels = {
        folder: '文件夹',
        image: '图片',
        video: '视频',
        audio: '音频',
        ae: 'AE',
        psd: 'PSD',
        text: '文本',
        archive: '压缩包',
        script: '脚本'
    };
    // 脚本文件特殊处理
    if (['jsx', 'js', 'py', 'sh', 'bat', 'cmd', 'ps1'].includes(ext)) {
        return '脚本';
    }
    return labels[type] || ext.toUpperCase() || '文件';
}

function selectFile(filePath) {
    // 更新选中状态
    document.querySelectorAll('.list-item.selected').forEach(el => el.classList.remove('selected'));
    const item = document.querySelector(`.list-item[data-path="${CSS.escape(filePath)}"]`);
    if (item) item.classList.add('selected');
    
    state.selectedFile = filePath;
    
    try {
        const stat = fs.statSync(filePath);
        const ext = path.extname(filePath).toLowerCase().slice(1);
        const type = getFileType(ext, stat.isDirectory());
        const fileName = path.basename(filePath);
        
        // 根据类型显示不同内容
        if (stat.isDirectory()) {
            // 文件夹：显示内容列表
            showFolderContents(filePath);
        } else if (type === 'image' || type === 'video' || type === 'audio') {
            // 媒体文件：显示预览
            showMediaPreview(filePath, type, ext);
        } else if (type === 'text') {
            // 文档文件：显示内容
            showTextFilePreview(filePath);
        } else {
            // 其他文件：显示图标
            showFileIcon(type, ext, filePath);
        }
        
        // 编辑/详情区
        showEditorOrDetails(filePath, type, ext, stat);
        
    } catch (error) {
        setStatus('无法读取文件');
    }
}

// 显示文件夹内容（显示全部文件）
function showFolderContents(folderPath) {
    // 记录右侧面板当前路径
    state.previewPath = folderPath;
    
    // 更新右侧路径显示
    updatePathDisplay(folderPath, elements.rightPath);
    updatePreviewHomeButton();
    
    // 更新排序UI
    updatePreviewSortUI();
    
    try {
        const items = fs.readdirSync(folderPath);
        const contents = [];
        
        items.forEach(name => {
            try {
                const fullPath = path.join(folderPath, name);
                const stat = fs.statSync(fullPath);
                const ext = path.extname(name).toLowerCase().slice(1);
                const type = getFileType(ext, stat.isDirectory());
                contents.push({ name, path: fullPath, type, ext, isDirectory: stat.isDirectory(), size: stat.size, mtime: stat.mtime });
            } catch (e) {}
        });
        
        // 排序：置顶项优先，文件夹优先，然后按右侧面板排序设置
        const pinnedInDir = state.pinnedItems[folderPath] || [];
        contents.sort((a, b) => {
            // 置顶项最优先
            const aPinned = pinnedInDir.includes(a.name);
            const bPinned = pinnedInDir.includes(b.name);
            if (aPinned !== bPinned) return aPinned ? -1 : 1;
            if (aPinned && bPinned) {
                return pinnedInDir.indexOf(a.name) - pinnedInDir.indexOf(b.name);
            }
            
            if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
            let cmp = 0;
            switch (state.previewSortBy) {
                case 'name':
                    cmp = a.name.localeCompare(b.name, 'zh-CN');
                    break;
                case 'type':
                    cmp = a.type.localeCompare(b.type, 'zh-CN');
                    break;
                case 'mtime':
                    cmp = new Date(a.mtime) - new Date(b.mtime);
                    break;
            }
            return state.previewSortAsc ? cmp : -cmp;
        });
        
        // 显示所有文件列表
        showFolderList(folderPath, contents);
        
    } catch (e) {
        elements.folderContents.innerHTML = '<div style="color:var(--text-secondary);padding:20px;">无法读取</div>';
        elements.previewPlaceholder.style.display = 'none';
        elements.mediaPreview.style.display = 'none';
        elements.folderContents.style.display = 'block';
    }
}

// 显示文件夹列表（文件夹列表视图，其他文件网格视图带缩略图）
function showFolderList(folderPath, contents) {
    elements.previewPlaceholder.style.display = 'none';
    elements.mediaPreview.style.display = 'none';
    elements.folderContents.style.display = 'block';
    // 显示列表头
    elements.previewListHeader.style.display = 'flex';
    
    // 分离文件夹和文件
    const folders = contents.filter(item => item.isDirectory);
    const files = contents.filter(item => !item.isDirectory);
    
    // 回退上一级行 - 始终显示在列表顶部
    const parentPath = path.dirname(folderPath);
    const isRoot = parentPath === folderPath;
    let html = `
        <div class="folder-item parent-item" data-path="${isRoot ? folderPath : parentPath}" data-type="parent" ${isRoot ? 'data-disabled="true"' : ''} title="返回上级目录">
            <span class="icon">${ICONS.parent}</span>
            <span class="name">..</span>
            <span class="type"></span>
            <span class="mtime"></span>
            <span class="actions"></span>
        </div>
    `;
    
    // 文件夹列表视图
    const pinnedInDir = state.pinnedItems[folderPath] || [];
    folders.forEach(item => {
        const icon = getFileIcon(item.type, item.ext);
        const typeLabel = getTypeLabel(item.type, item.ext);
        const mtime = formatDateShort(item.mtime);
        const isPinned = pinnedInDir.includes(item.name);
        const pinnedClass = isPinned ? ' pinned' : '';
        html += `
            <div class="folder-item${pinnedClass}" data-path="${item.path}" data-type="${item.type}" data-ext="${item.ext}">
                <span class="icon">${icon}</span>
                <span class="name">${item.name}</span>
                <span class="type">${typeLabel}</span>
                <span class="mtime">${mtime}</span>
                <span class="actions"></span>
            </div>
        `;
    });
    
    // 文件显示（可视听文件全宽带控件，其他文件行显示）
    if (files.length > 0) {
        html += `<div class="file-grid">`;
        files.forEach(item => {
            const fileUrl = `file:///${item.path.replace(/\\/g, '/')}`;
            const isMedia = ['image', 'video', 'audio'].includes(item.type);
            
            const isFilePinned = pinnedInDir.includes(item.name);
            const filePinnedClass = isFilePinned ? ' pinned' : '';
            
            if (isMedia) {
                // 可视听文件 - 全宽显示带控件
                let mediaEl = '';
                if (item.type === 'image') {
                    mediaEl = `<img src="${fileUrl}" alt="${item.name}" loading="lazy">`;
                } else if (item.type === 'video') {
                    mediaEl = `<video src="${fileUrl}" controls preload="metadata"></video>`;
                } else if (item.type === 'audio') {
                    mediaEl = `<audio src="${fileUrl}" controls preload="metadata"></audio>`;
                }
                html += `
                    <div class="file-grid-item media-item${filePinnedClass}" data-path="${item.path}" data-type="${item.type}" data-ext="${item.ext}">
                        <div class="thumb">${mediaEl}</div>
                        <div class="name">${item.name}</div>
                    </div>
                `;
            } else {
                // 其他文件 - 行显示
                const icon = getFileIcon(item.type, item.ext);
                html += `
                    <div class="file-grid-item${filePinnedClass}" data-path="${item.path}" data-type="${item.type}" data-ext="${item.ext}">
                        <div class="thumb"><span class="thumb-icon">${icon}</span></div>
                        <div class="name">${item.name}</div>
                    </div>
                `;
            }
        });
        html += `</div>`;
    }
    
    elements.folderContents.innerHTML = html;
    applyColumnWidths('right');
    bindFolderItemEvents();
}

// 绑定右侧列表项事件
function bindFolderItemEvents() {
    // 右侧容器鼠标移动 - 动态显示提示
    elements.folderContents.onmousemove = (e) => {
        const item = e.target.closest('.folder-item, .file-grid-item');
        if (item) {
            const iconEl = item.querySelector('.icon');
            if (iconEl) {
                const iconRect = iconEl.getBoundingClientRect();
                if (e.clientX < iconRect.left) {
                    // 鼠标在图标左侧空隙
                    if (item.dataset.originalTitle === undefined) {
                        item.dataset.originalTitle = item.title || '';
                    }
                    item.title = '双击打开文件夹';
                } else {
                    // 鼠标在正常区域，恢复原始提示
                    if (item.dataset.originalTitle !== undefined) {
                        item.title = item.dataset.originalTitle;
                    }
                }
            }
        }
    };
    
    // 双击空白区域或选项图标前面的空隙：打开文件夹选择器或导入选中项
    elements.folderContents.ondblclick = (e) => {
        const item = e.target.closest('.folder-item, .file-grid-item');
        
        // 检查是否点击在图标左侧空隙
        if (item) {
            const iconEl = item.querySelector('.icon');
            if (iconEl) {
                const iconRect = iconEl.getBoundingClientRect();
                if (e.clientX < iconRect.left) {
                    openFolderPicker('right');
                    return;
                }
            }
        }
        
        if (!item) {
            // 双击空白区域：打开文件夹选择器
            openFolderPicker('right');
        }
    };
    
    // 文件夹列表项事件
    elements.folderContents.querySelectorAll('.folder-item').forEach(el => {
        const itemType = el.dataset.type;
        
        // 回退项单击
        if (itemType === 'parent') {
            el.addEventListener('click', () => {
                if (el.dataset.disabled === 'true') return;
                const parentPath = el.dataset.path;
                showFolderContents(parentPath);
            });
            return;
        }
        
        // 文件夹单击：选中并显示详情（支持Ctrl/Shift多选）
        el.addEventListener('click', (e) => {
            if (e.ctrlKey || e.metaKey) {
                // Ctrl+点击：切换选中状态
                el.classList.toggle('selected');
                if (el.classList.contains('selected')) {
                    selectRightPanelItem(el.dataset.path);
                }
                return;
            }
            if (e.shiftKey) {
                // Shift+点击：范围选择
                el.classList.add('selected');
                return;
            }
            // 普通点击：单选
            clearRightPanelSelection();
            el.classList.add('selected');
            elements.mediaPreview.style.display = 'none';
            selectRightPanelItem(el.dataset.path);
        });
        
        // 文件夹双击：在右侧展开
        el.addEventListener('dblclick', () => {
            showFolderContents(el.dataset.path);
        });
        
        // 右键菜单
        el.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showItemContextMenu(e.clientX, e.clientY, el.dataset.path, 'folder');
        });
    });
    
    // 文件网格项事件
    elements.folderContents.querySelectorAll('.file-grid-item').forEach(el => {
        const itemType = el.dataset.type;
        const itemPath = el.dataset.path;
        
        // 单击：选中并显示详情（支持Ctrl/Shift多选）
        el.addEventListener('click', (e) => {
            // 如果点击的是媒体控件，不处理选中
            if (e.target.closest('video, audio')) return;
            
            if (e.ctrlKey || e.metaKey) {
                // Ctrl+点击：切换选中状态
                el.classList.toggle('selected');
                if (el.classList.contains('selected')) {
                    selectRightPanelItem(itemPath);
                }
                return;
            }
            if (e.shiftKey) {
                // Shift+点击：范围选择
                el.classList.add('selected');
                return;
            }
            // 普通点击：单选
            clearRightPanelSelection();
            el.classList.add('selected');
            selectRightPanelItem(itemPath);
        });
        
        // 双击：导入AE
        el.addEventListener('dblclick', (e) => {
            if (e.target.closest('video, audio')) return;
            importToAE(itemPath);
        });
        
        // 右键菜单
        el.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showItemContextMenu(e.clientX, e.clientY, itemPath, itemType);
        });
    });
}

// 清除右侧面板选中状态
function clearRightPanelSelection() {
    elements.folderContents.querySelectorAll('.folder-item.selected, .file-grid-item.selected').forEach(e => e.classList.remove('selected'));
}

// 在右侧列表下方显示媒体预览
function showMediaPreviewInline(filePath, type, ext) {
    elements.mediaPreview.style.display = 'flex';
    elements.mediaPreview.innerHTML = '';
    
    const fileUrl = `file:///${filePath.replace(/\\/g, '/')}`;
    
    if (type === 'image') {
        const img = document.createElement('img');
        img.src = fileUrl;
        elements.mediaPreview.appendChild(img);
    } else if (type === 'video') {
        const video = document.createElement('video');
        video.src = fileUrl;
        video.controls = true;
        video.preload = 'metadata';
        video.style.maxWidth = '100%';
        video.style.maxHeight = '100%';
        elements.mediaPreview.appendChild(video);
    } else if (type === 'audio') {
        const audio = document.createElement('audio');
        audio.src = fileUrl;
        audio.controls = true;
        elements.mediaPreview.appendChild(audio);
    }
}

// 显示文档内容预览
function showTextPreview(filePath) {
    elements.mediaPreview.style.display = 'flex';
    elements.mediaPreview.innerHTML = '';
    
    try {
        const content = readFileWithEncoding(filePath);
        if (content === null) throw new Error('读取失败');
        const pre = document.createElement('pre');
        pre.className = 'text-preview';
        pre.textContent = content.slice(0, 50000); // 限制长度
        if (content.length > 50000) {
            pre.textContent += '\n\n... (内容已截断)';
        }
        elements.mediaPreview.appendChild(pre);
    } catch (e) {
        elements.mediaPreview.innerHTML = '<div style="color:var(--text-secondary);padding:20px;">无法读取文件</div>';
    }
}

// 右侧面板项目单击：显示详情或编辑器
function selectRightPanelItem(filePath) {
    try {
        const stat = fs.statSync(filePath);
        const ext = path.extname(filePath).toLowerCase().slice(1);
        const type = getFileType(ext, stat.isDirectory());
        
        // 更新选中文件
        state.selectedFile = filePath;
        
        // 底部显示详情或编辑器
        showEditorOrDetails(filePath, type, ext, stat);
        
    } catch (e) {
        setStatus('无法读取文件');
    }
}

// 显示媒体预览（左侧单击媒体文件时）
function showMediaPreview(filePath, type, ext) {
    elements.previewPlaceholder.style.display = 'none';
    elements.folderContents.style.display = 'none';
    elements.mediaPreview.style.display = 'flex';
    elements.mediaPreview.innerHTML = '';
    // 隐藏列表头
    elements.previewListHeader.style.display = 'none';
    // 更新路径显示
    updatePathDisplay(filePath, elements.rightPath);
    
    const fileUrl = `file:///${filePath.replace(/\\/g, '/')}`;
    
    if (type === 'image') {
        const img = document.createElement('img');
        img.src = fileUrl;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        img.style.objectFit = 'contain';
        elements.mediaPreview.appendChild(img);
    } else if (type === 'video') {
        const video = document.createElement('video');
        video.src = fileUrl;
        video.controls = true;
        video.preload = 'metadata';
        video.style.maxWidth = '100%';
        video.style.maxHeight = '100%';
        elements.mediaPreview.appendChild(video);
    } else if (type === 'audio') {
        const audio = document.createElement('audio');
        audio.src = fileUrl;
        audio.controls = true;
        audio.style.width = '90%';
        elements.mediaPreview.appendChild(audio);
    } else {
        showFileIcon(type, ext, filePath);
    }
}

// 显示文档文件预览（左侧单击文档时）
function showTextFilePreview(filePath) {
    elements.previewPlaceholder.style.display = 'none';
    elements.folderContents.style.display = 'none';
    elements.mediaPreview.style.display = 'flex';
    elements.mediaPreview.innerHTML = '';
    // 隐藏列表头
    elements.previewListHeader.style.display = 'none';
    // 更新路径显示
    updatePathDisplay(filePath, elements.rightPath);
    
    try {
        const content = readFileWithEncoding(filePath);
        if (content === null) throw new Error('读取失败');
        const pre = document.createElement('pre');
        pre.className = 'text-preview';
        pre.textContent = content.slice(0, 50000);
        if (content.length > 50000) {
            pre.textContent += '\n\n... (内容已截断)';
        }
        elements.mediaPreview.appendChild(pre);
    } catch (e) {
        elements.mediaPreview.innerHTML = '<div style="color:var(--text-secondary);padding:20px;">无法读取文件</div>';
    }
}

// 显示文件图标
function showFileIcon(type, ext, filePath) {
    elements.previewPlaceholder.style.display = 'none';
    elements.folderContents.style.display = 'none';
    elements.mediaPreview.style.display = 'flex';
    // 隐藏列表头
    elements.previewListHeader.style.display = 'none';
    // 更新路径显示
    if (filePath) updatePathDisplay(filePath, elements.rightPath);
    
    const icon = getFileIcon(type, ext);
    elements.mediaPreview.innerHTML = `<span style="font-size:64px">${icon}</span>`;
}

// 辅助函数：根据路径显示详情
function showEditorOrDetailsForPath(filePath) {
    try {
        const stat = fs.statSync(filePath);
        const ext = path.extname(filePath).toLowerCase().slice(1);
        const type = getFileType(ext, stat.isDirectory());
        showEditorOrDetails(filePath, type, ext, stat);
    } catch (e) {}
}

function showEditorOrDetails(filePath, type, ext, stat) {
    const isText = TEXT_EXTENSIONS.includes(ext);
    
    // 更新标题
    elements.editorTitle.textContent = isText ? '编辑文件' : '文件详情';
    
    // 显示/隐藏保存按钮
    elements.btnSave.style.display = isText ? 'inline-block' : 'none';
    
    if (isText && !stat.isDirectory()) {
        // 显示文本编辑器
        elements.fileDetails.style.display = 'none';
        elements.textEditor.style.display = 'block';
        
        try {
            const content = readFileWithEncoding(filePath);
            if (content === null) throw new Error('读取失败');
            elements.textEditor.value = content;
            state.editingFile = filePath;
            state.originalContent = content;
        } catch (e) {
            elements.textEditor.value = '无法读取文件内容';
        }
    } else {
        // 显示文件详情
        elements.textEditor.style.display = 'none';
        elements.fileDetails.style.display = 'flex';
        state.editingFile = null;
        
        document.getElementById('detail-name').textContent = path.basename(filePath);
        document.getElementById('detail-path').textContent = filePath;
        document.getElementById('detail-size').textContent = formatSize(stat.size);
        document.getElementById('detail-type').textContent = stat.isDirectory() ? '文件夹' : (ext.toUpperCase() || '未知');
        document.getElementById('detail-mtime').textContent = formatDate(stat.mtime);
    }
}

function saveTextFile() {
    if (!state.editingFile) return;
    
    try {
        const content = elements.textEditor.value;
        fs.writeFileSync(state.editingFile, content, 'utf8');
        state.originalContent = content;
        setStatus('已保存: ' + path.basename(state.editingFile));
    } catch (e) {
        setStatus('保存失败: ' + e.message);
    }
}

// 统一的右键菜单（用于文件和文件夹）
function showItemContextMenu(x, y, itemPath, itemType) {
    const oldMenu = document.getElementById('context-menu');
    if (oldMenu) oldMenu.remove();
    
    const menu = document.createElement('div');
    menu.id = 'context-menu';
    
    const isPinned = isItemPinned(itemPath);
    
    let menuHtml = `<div class="menu-item" data-action="import">导入到 AE</div>`;
    
    if (itemType === 'folder') {
        menuHtml += `
            <div class="menu-item" data-action="open">在左侧打开</div>
            <div class="menu-item" data-action="tag">添加到标签</div>
        `;
    }
    
    menuHtml += `
        <div class="menu-separator"></div>
        <div class="menu-item" data-action="pin">${isPinned ? '取消置顶' : '置顶'}</div>
        <div class="menu-item" data-action="rename">重命名</div>
        <div class="menu-item" data-action="delete">删除</div>
        <div class="menu-separator"></div>
        <div class="menu-item" data-action="refresh">刷新</div>
        <div class="menu-item" data-action="new-folder">新建文件夹</div>
        <div class="menu-item" data-action="new-txt">新建文本文件</div>
        <div class="menu-item" data-action="new-jsx">新建 JSX 脚本</div>
        <div class="menu-separator"></div>
        <div class="menu-item" data-action="copy-path">复制路径</div>
        <div class="menu-item" data-action="explorer">在资源管理器中显示</div>
    `;
    
    menu.innerHTML = menuHtml;
    menu.style.cssText = `position:fixed;left:${x}px;top:${y}px;background:#2d2d2d;border:1px solid #3c3c3c;border-radius:4px;padding:4px 0;z-index:1000;`;
    
    document.body.appendChild(menu);
    
    menu.addEventListener('click', (e) => {
        const item = e.target.closest('.menu-item');
        if (item) {
            const action = item.dataset.action;
            switch (action) {
                case 'import':
                    importToAE(itemPath);
                    break;
                case 'open':
                    navigateTo(itemPath);
                    break;
                case 'tag':
                    addTagFolder(itemPath);
                    break;
                case 'pin':
                    togglePinItem(itemPath);
                    break;
                case 'rename':
                    showRenameDialog(itemPath);
                    break;
                case 'delete':
                    showDeleteConfirm(itemPath);
                    break;
                case 'copy-path':
                    copyToClipboard(itemPath);
                    setStatus('已复制路径');
                    break;
                case 'explorer':
                    child_process.exec(`explorer /select,"${itemPath}"`);
                    break;
                case 'new-folder':
                    createNewItem('folder');
                    break;
                case 'new-txt':
                    createNewItem('txt');
                    break;
                case 'new-jsx':
                    createNewItem('jsx');
                    break;
                case 'refresh':
                    navigateTo(state.currentPath);
                    if (state.previewPath) showFolderContents(state.previewPath);
                    setStatus('已刷新');
                    break;
            }
        }
        menu.remove();
    });
    
    setTimeout(() => {
        document.addEventListener('click', function close() {
            menu.remove();
            document.removeEventListener('click', close);
        }, { once: true });
    }, 0);
}

// 内联重命名
function showRenameDialog(itemPath) {
    const oldName = path.basename(itemPath);
    const parentDir = path.dirname(itemPath);
    
    // 查找对应的列表项
    let listItem = null;
    
    // 在左侧列表中查找
    const leftItems = elements.listContent.querySelectorAll('.list-item[data-path]');
    for (const item of leftItems) {
        if (item.dataset.path === itemPath) {
            listItem = item;
            break;
        }
    }
    
    // 在右侧列表中查找
    if (!listItem) {
        const rightItems = document.querySelectorAll('#folder-contents .folder-item[data-path], #folder-contents .file-item[data-path], #folder-contents .file-grid-item[data-path]');
        for (const item of rightItems) {
            if (item.dataset.path === itemPath) {
                listItem = item;
                break;
            }
        }
    }
    
    if (!listItem) {
        setStatus('找不到该项');
        return;
    }
    
    // 获取名称元素
    const nameSpan = listItem.querySelector('.name');
    if (!nameSpan) {
        setStatus('无法重命名');
        return;
    }
    
    // 保存原始内容
    const originalContent = nameSpan.innerHTML;
    
    // 创建输入框
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'inline-edit-input';
    input.value = oldName;
    
    // 替换名称内容
    nameSpan.innerHTML = '';
    nameSpan.appendChild(input);
    listItem.classList.add('renaming');
    
    // 选中文件名（不含扩展名）
    input.focus();
    const dotIndex = oldName.lastIndexOf('.');
    if (dotIndex > 0 && !listItem.dataset.type?.includes('folder')) {
        input.setSelectionRange(0, dotIndex);
    } else {
        input.select();
    }
    
    let isConfirmed = false;
    
    // 确认重命名
    function confirmRename() {
        if (isConfirmed) return;
        isConfirmed = true;
        
        const newName = input.value.trim();
        
        // 恢复原始状态
        nameSpan.innerHTML = originalContent;
        listItem.classList.remove('renaming');
        
        if (!newName || newName === oldName) {
            return;
        }
        
        const newPath = path.join(parentDir, newName);
        try {
            if (fs.existsSync(newPath)) {
                setStatus('同名文件已存在');
                return;
            }
            fs.renameSync(itemPath, newPath);
            setStatus('已重命名: ' + newName);
            // 刷新列表
            navigateTo(state.currentPath);
            if (state.previewPath) {
                showFolderContents(state.previewPath);
            }
        } catch (e) {
            setStatus('重命名失败: ' + e.message);
        }
    }
    
    // 取消重命名
    function cancelRename() {
        if (isConfirmed) return;
        isConfirmed = true;
        nameSpan.innerHTML = originalContent;
        listItem.classList.remove('renaming');
    }
    
    // 事件绑定
    input.addEventListener('keydown', (e) => {
        e.stopPropagation();
        if (e.key === 'Enter') {
            e.preventDefault();
            confirmRename();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelRename();
        }
    });
    
    input.addEventListener('blur', () => {
        setTimeout(() => {
            if (!isConfirmed) {
                confirmRename();
            }
        }, 100);
    });
    
    // 阻止点击事件冒泡
    input.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// 删除确认对话框
function showDeleteConfirm(itemPath) {
    const itemName = path.basename(itemPath);
    let isFolder = false;
    try {
        isFolder = fs.statSync(itemPath).isDirectory();
    } catch (e) {}
    
    const dialog = document.createElement('div');
    dialog.className = 'dialog-overlay';
    dialog.innerHTML = `
        <div class="dialog-box">
            <div class="dialog-title">确认删除</div>
            <div class="dialog-message">确定要删除 ${isFolder ? '文件夹' : '文件'}「${itemName}」吗？</div>
            <div class="dialog-buttons">
                <button class="dialog-btn cancel">取消</button>
                <button class="dialog-btn confirm danger">删除</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);
    
    dialog.querySelector('.confirm').addEventListener('click', () => {
        try {
            if (isFolder) {
                // 递归删除文件夹
                deleteFolderRecursive(itemPath);
            } else {
                fs.unlinkSync(itemPath);
            }
            setStatus('已删除: ' + itemName);
            // 刷新列表
            navigateTo(state.currentPath);
            if (state.previewPath) {
                showFolderContents(state.previewPath);
            }
        } catch (e) {
            setStatus('删除失败: ' + e.message);
        }
        dialog.remove();
    });
    
    dialog.querySelector('.cancel').addEventListener('click', () => dialog.remove());
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) dialog.remove();
    });
}

// 递归删除文件夹
function deleteFolderRecursive(folderPath) {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach(file => {
            const curPath = path.join(folderPath, file);
            if (fs.statSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(folderPath);
    }
}

// 兼容旧的showContextMenu函数
function showContextMenu(x, y, folderPath) {
    showItemContextMenu(x, y, folderPath, 'folder');
}

// 搜索框右键菜单
function showInputContextMenu(x, y) {
    const oldMenu = document.getElementById('context-menu');
    if (oldMenu) oldMenu.remove();
    
    const input = elements.pathInput;
    const hasSelection = input.selectionStart !== input.selectionEnd;
    const hasContent = input.value.length > 0;
    
    const menu = document.createElement('div');
    menu.id = 'context-menu';
    menu.innerHTML = `
        <div class="menu-item" data-action="cut" ${!hasSelection ? 'data-disabled="true"' : ''}>剪切</div>
        <div class="menu-item" data-action="copy" ${!hasSelection ? 'data-disabled="true"' : ''}>复制</div>
        <div class="menu-item" data-action="paste">粘贴</div>
        <div class="menu-separator"></div>
        <div class="menu-item" data-action="select-all" ${!hasContent ? 'data-disabled="true"' : ''}>全选</div>
        <div class="menu-item" data-action="clear" ${!hasContent ? 'data-disabled="true"' : ''}>清除</div>
    `;
    menu.style.cssText = `position:fixed;left:${x}px;top:${y}px;background:#2d2d2d;border:1px solid #3c3c3c;border-radius:4px;padding:4px 0;z-index:1000;`;
    
    document.body.appendChild(menu);
    
    menu.addEventListener('click', async (e) => {
        const item = e.target.closest('.menu-item');
        if (item && item.dataset.disabled !== 'true') {
            const action = item.dataset.action;
            switch (action) {
                case 'cut':
                    document.execCommand('cut');
                    break;
                case 'copy':
                    document.execCommand('copy');
                    break;
                case 'paste':
                    // 使用 clipboard API 粘贴
                    try {
                        const text = await navigator.clipboard.readText();
                        const start = input.selectionStart;
                        const end = input.selectionEnd;
                        input.value = input.value.slice(0, start) + text + input.value.slice(end);
                        input.selectionStart = input.selectionEnd = start + text.length;
                        input.dispatchEvent(new Event('input'));
                    } catch (err) {
                        document.execCommand('paste');
                    }
                    break;
                case 'select-all':
                    input.select();
                    break;
                case 'clear':
                    input.value = '';
                    input.dispatchEvent(new Event('input'));
                    document.getElementById('path-input-wrapper').classList.remove('has-value');
                    performSearch('');
                    break;
            }
        }
        menu.remove();
    });
    
    setTimeout(() => {
        document.addEventListener('click', function close() {
            menu.remove();
            document.removeEventListener('click', close);
        }, { once: true });
    }, 0);
}

// 空白区域右键菜单（合并新建选项）
function showNewFileMenu(x, y) {
    const oldMenu = document.getElementById('context-menu');
    if (oldMenu) oldMenu.remove();
    
    const menu = document.createElement('div');
    menu.id = 'context-menu';
    menu.innerHTML = `
        <div class="menu-item" data-action="refresh">刷新</div>
        <div class="menu-separator"></div>
        <div class="menu-item" data-action="new-folder">新建文件夹</div>
        <div class="menu-item" data-action="new-txt">新建文本文件</div>
        <div class="menu-item" data-action="new-jsx">新建 JSX 脚本</div>
        <div class="menu-separator"></div>
        <div class="menu-item" data-action="open-explorer">在资源管理器中打开</div>
    `;
    menu.style.cssText = `position:fixed;left:${x}px;top:${y}px;background:#2d2d2d;border:1px solid #3c3c3c;border-radius:4px;padding:4px 0;z-index:1000;`;
    
    document.body.appendChild(menu);
    
    menu.addEventListener('click', (e) => {
        const item = e.target.closest('.menu-item');
        if (item) {
            const action = item.dataset.action;
            switch (action) {
                case 'refresh':
                    navigateTo(state.currentPath);
                    if (state.previewPath) showFolderContents(state.previewPath);
                    setStatus('已刷新');
                    break;
                case 'new-folder':
                    createNewItem('folder');
                    break;
                case 'new-txt':
                    createNewItem('txt');
                    break;
                case 'new-jsx':
                    createNewItem('jsx');
                    break;
                case 'open-explorer':
                    child_process.exec(`explorer "${state.currentPath}"`);
                    break;
            }
        }
        menu.remove();
    });
    
    setTimeout(() => {
        document.addEventListener('click', function close() {
            menu.remove();
            document.removeEventListener('click', close);
        }, { once: true });
    }, 0);
}

function createNewItem(type) {
    let name;
    
    // 找一个不重复的名称
    let counter = 0;
    do {
        if (type === 'folder') {
            name = counter === 0 ? '新建文件夹' : `新建文件夹 (${counter})`;
        } else {
            const ext = type === 'txt' ? '.txt' : '.jsx';
            const label = type === 'txt' ? '文本' : '脚本';
            name = counter === 0 ? `新建${label}${ext}` : `新建${label} (${counter})${ext}`;
        }
        counter++;
    } while (fs.existsSync(path.join(state.currentPath, name)));
    
    // 在列表顶部插入一个可编辑的行
    const icon = type === 'folder' ? ICONS.folder : (type === 'jsx' ? ICONS.script : ICONS.text);
    const typeLabel = type === 'folder' ? '文件夹' : (type === 'jsx' ? '脚本' : '文本');
    
    const newItemHtml = `
        <div class="list-item new-item-editing" data-type="${type}">
            <span class="icon">${icon}</span>
            <input type="text" class="inline-edit-input" value="${name}">
            <span class="type">${typeLabel}</span>
            <span class="mtime"></span>
            <span class="actions"></span>
        </div>
    `;
    
    // 插入到返回上级项之后
    const parentItem = elements.listContent.querySelector('.parent-item');
    if (parentItem) {
        parentItem.insertAdjacentHTML('afterend', newItemHtml);
    } else {
        elements.listContent.insertAdjacentHTML('afterbegin', newItemHtml);
    }
    
    const newItem = elements.listContent.querySelector('.new-item-editing');
    const input = newItem.querySelector('.inline-edit-input');
    
    // 应用列宽
    applyColumnWidths('left');
    
    // 选中文件名（不含扩展名）
    input.focus();
    if (type === 'folder') {
        input.select();
    } else {
        const dotIndex = name.lastIndexOf('.');
        if (dotIndex > 0) {
            input.setSelectionRange(0, dotIndex);
        } else {
            input.select();
        }
    }
    
    // 确认创建
    function confirmCreate() {
        const newName = input.value.trim();
        if (!newName) {
            cancelCreate();
            return;
        }
        
        const fullPath = path.join(state.currentPath, newName);
        
        if (fs.existsSync(fullPath)) {
            setStatus('同名文件已存在');
            input.focus();
            input.select();
            return;
        }
        
        try {
            if (type === 'folder') {
                fs.mkdirSync(fullPath);
            } else {
                const defaultContent = type === 'jsx' ? '// After Effects 脚本\n' : '';
                fs.writeFileSync(fullPath, defaultContent, 'utf8');
            }
            setStatus('已创建: ' + newName);
            navigateTo(state.currentPath);
        } catch (e) {
            setStatus('创建失败: ' + e.message);
            cancelCreate();
        }
    }
    
    // 取消创建
    function cancelCreate() {
        newItem.remove();
    }
    
    // 事件绑定
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            confirmCreate();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelCreate();
        }
    });
    
    input.addEventListener('blur', () => {
        // 延迟执行，允许其他事件先处理
        setTimeout(() => {
            if (document.contains(newItem)) {
                confirmCreate();
            }
        }, 100);
    });
}

// 批量导入选中的文件
function importSelectedToAE(container) {
    const selectedItems = container.querySelectorAll('.list-item.selected:not(.parent-item), .folder-item.selected:not(.parent-item), .file-grid-item.selected');
    
    if (selectedItems.length === 0) {
        setStatus('没有选中的文件');
        return;
    }
    
    if (selectedItems.length === 1) {
        // 单个文件，使用普通导入
        importToAE(selectedItems[0].dataset.path);
        return;
    }
    
    // 多个文件批量导入
    const filePaths = [];
    selectedItems.forEach(item => {
        const itemPath = item.dataset.path;
        if (itemPath) {
            filePaths.push(itemPath);
        }
    });
    
    if (filePaths.length === 0) return;
    
    importMultipleToAE(filePaths);
}

// 批量导入多个文件
function importMultipleToAE(filePaths) {
    if (!csInterface) {
        setStatus('无法导入 - 未AE连接');
        return;
    }
    
    const importableExts = [
        ...FILE_TYPES.image,
        ...FILE_TYPES.video,
        ...FILE_TYPES.audio,
        ...FILE_TYPES.ae,
        ...FILE_TYPES.psd
    ];
    
    // 过滤出可导入的文件
    const importableFiles = [];
    filePaths.forEach(filePath => {
        try {
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                // 文件夹 - 添加其中的可导入文件
                const items = fs.readdirSync(filePath);
                items.forEach(name => {
                    const ext = path.extname(name).toLowerCase().slice(1);
                    if (importableExts.includes(ext)) {
                        importableFiles.push(path.join(filePath, name).replace(/\\/g, '/'));
                    }
                });
            } else {
                // 普通文件
                const ext = path.extname(filePath).toLowerCase().slice(1);
                if (importableExts.includes(ext)) {
                    importableFiles.push(filePath.replace(/\\/g, '/'));
                }
            }
        } catch (e) {}
    });
    
    if (importableFiles.length === 0) {
        setStatus('没有可导入的文件');
        return;
    }
    
    // 批量导入
    const fileListStr = importableFiles.map(f => `"${f}"`).join(',');
    const script = `(function(){
        var files = [${fileListStr}];
        var imported = 0;
        for (var i = 0; i < files.length; i++) {
            try {
                var f = new File(files[i]);
                if (f.exists) {
                    app.project.importFile(new ImportOptions(f));
                    imported++;
                }
            } catch(e) {}
        }
        return imported;
    })()`;
    
    csInterface.evalScript(script, (result) => {
        const count = parseInt(result) || 0;
        setStatus(count > 0 ? `已导入 ${count} 个文件` : '导入失败');
    });
}

function importToAE(filePath) {
    if (!csInterface) {
        setStatus('无法导入 - 未AE连接');
        return;
    }
    
    // 检查是文件还是文件夹
    let isFolder = false;
    try {
        isFolder = fs.statSync(filePath).isDirectory();
    } catch (e) {
        setStatus('无法访问: ' + filePath);
        return;
    }
    
    if (isFolder) {
        // 文件夹导入 - 递归搜集所有可导入文件，在AE中创建相同目录结构
        const importableExts = [
            ...FILE_TYPES.image,
            ...FILE_TYPES.video,
            ...FILE_TYPES.audio,
            ...FILE_TYPES.ae,
            ...FILE_TYPES.psd
        ];
        
        // 递归收集所有可导入文件
        function collectImportableFiles(dirPath, relativePath = '') {
            const results = [];
            try {
                const items = fs.readdirSync(dirPath);
                items.forEach(name => {
                    const fullPath = path.join(dirPath, name);
                    const relPath = relativePath ? relativePath + '/' + name : name;
                    try {
                        const stat = fs.statSync(fullPath);
                        if (stat.isDirectory()) {
                            // 递归子文件夹
                            results.push(...collectImportableFiles(fullPath, relPath));
                        } else {
                            const ext = path.extname(name).toLowerCase().slice(1);
                            if (importableExts.includes(ext)) {
                                results.push({
                                    path: fullPath.replace(/\\/g, '/'),
                                    relativePath: relPath
                                });
                            }
                        }
                    } catch (e) {}
                });
            } catch (e) {}
            return results;
        }
        
        try {
            const importableFiles = collectImportableFiles(filePath);
            
            if (importableFiles.length === 0) {
                setStatus('文件夹内无可导入文件');
                return;
            }
            
            // 获取文件夹名称
            const folderName = path.basename(filePath);
            
            // 构建文件列表（包含相对路径信息）
            const fileDataStr = importableFiles.map(f => 
                `{path:"${f.path}",rel:"${f.relativePath}"}`
            ).join(',');
            
            const script = `(function(){
                var files = [${fileDataStr}];
                var rootFolderName = "${folderName}";
                var imported = 0;
                var folderCache = {};
                
                // 创建根文件夹
                var rootFolder = app.project.items.addFolder(rootFolderName);
                folderCache[""] = rootFolder;
                
                // 获取或创建子文件夹
                function getOrCreateFolder(relPath) {
                    if (folderCache[relPath]) return folderCache[relPath];
                    
                    var parts = relPath.split("/");
                    var folderName = parts.pop();
                    var parentPath = parts.join("/");
                    var parentFolder = getOrCreateFolder(parentPath);
                    
                    var newFolder = app.project.items.addFolder(folderName);
                    newFolder.parentFolder = parentFolder;
                    folderCache[relPath] = newFolder;
                    return newFolder;
                }
                
                for (var i = 0; i < files.length; i++) {
                    try {
                        var f = new File(files[i].path);
                        if (f.exists) {
                            var item = app.project.importFile(new ImportOptions(f));
                            // 获取父文件夹路径
                            var relParts = files[i].rel.split("/");
                            relParts.pop(); // 移除文件名
                            var parentRel = relParts.join("/");
                            item.parentFolder = getOrCreateFolder(parentRel);
                            imported++;
                        }
                    } catch(e) {}
                }
                return imported;
            })()`;
            
            csInterface.evalScript(script, (result) => {
                const count = parseInt(result) || 0;
                setStatus(count > 0 ? `已导入 ${count} 个文件到「${folderName}」` : '导入失败');
            });
        } catch (e) {
            setStatus('读取文件夹失败');
        }
    } else {
        // 单文件导入
        const script = `(function(){var f=new File("${filePath.replace(/\\/g, '/')}");if(f.exists){return app.project.importFile(new ImportOptions(f)).name}return null})()`;
        csInterface.evalScript(script, (result) => {
            setStatus(result && result !== 'null' ? '已导入: ' + result : '导入失败');
        });
    }
}

// 分类行右键菜单
function showHeaderContextMenu(x, y, panel) {
    const oldMenu = document.getElementById('context-menu');
    if (oldMenu) oldMenu.remove();
    
    const menu = document.createElement('div');
    menu.id = 'context-menu';
    
    const sortBy = panel === 'left' ? state.sortBy : state.previewSortBy;
    const sortAsc = panel === 'left' ? state.sortAsc : state.previewSortAsc;
    
    menu.innerHTML = `
        <div class="menu-item" data-action="sort-name">按名称排序 ${sortBy === 'name' ? (sortAsc ? '▲' : '▼') : ''}</div>
        <div class="menu-item" data-action="sort-type">按类型排序 ${sortBy === 'type' ? (sortAsc ? '▲' : '▼') : ''}</div>
        <div class="menu-item" data-action="sort-mtime">按日期排序 ${sortBy === 'mtime' ? (sortAsc ? '▲' : '▼') : ''}</div>
        <div class="menu-separator"></div>
        <div class="menu-item" data-action="refresh">刷新</div>
    `;
    menu.style.cssText = `position:fixed;left:${x}px;top:${y}px;background:#2d2d2d;border:1px solid #3c3c3c;border-radius:4px;padding:4px 0;z-index:1000;`;
    
    document.body.appendChild(menu);
    
    menu.addEventListener('click', (e) => {
        const item = e.target.closest('.menu-item');
        if (item) {
            const action = item.dataset.action;
            if (action.startsWith('sort-')) {
                const sortKey = action.replace('sort-', '');
                if (panel === 'left') {
                    toggleSort(sortKey);
                } else {
                    if (state.previewSortBy === sortKey) {
                        state.previewSortAsc = !state.previewSortAsc;
                    } else {
                        state.previewSortBy = sortKey;
                        state.previewSortAsc = true;
                    }
                    updatePreviewSortUI();
                    if (state.previewPath) showFolderContents(state.previewPath);
                }
            } else if (action === 'refresh') {
                if (panel === 'left') {
                    navigateTo(state.currentPath);
                } else if (state.previewPath) {
                    showFolderContents(state.previewPath);
                }
                setStatus('已刷新');
            }
        }
        menu.remove();
    });
    
    setTimeout(() => {
        document.addEventListener('click', function close() {
            menu.remove();
            document.removeEventListener('click', close);
        }, { once: true });
    }, 0);
}

// 框选功能 - 任Windows资源管理器一样，从任何位置都可以开始框选
let _activeSelectionContainer = null; // 当前正在框选的容器

function initSelectionBox(container) {
    let startX, startY;
    let selectionBox = null;
    let dragThreshold = 5;
    let mouseDownX, mouseDownY;
    let mouseDownInContainer = false;
    
    container.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        
        // 记录初始位置
        mouseDownX = e.clientX;
        mouseDownY = e.clientY;
        mouseDownInContainer = true;
        
        // 记录起始位置
        const rect = container.getBoundingClientRect();
        startX = e.clientX - rect.left + container.scrollLeft;
        startY = e.clientY - rect.top + container.scrollTop;
    });
    
    container.addEventListener('mousemove', (e) => {
        if (!mouseDownInContainer) return;
        if (_activeSelectionContainer && _activeSelectionContainer !== container) return;
        
        // 检查是否已超过拖拽阈值
        const dx = Math.abs(e.clientX - mouseDownX);
        const dy = Math.abs(e.clientY - mouseDownY);
        
        if (!selectionBox && (dx > dragThreshold || dy > dragThreshold)) {
            // 开始框选
            _activeSelectionContainer = container;
            
            // 如果不按Shift，清除原有选中
            if (!e.shiftKey) {
                container.querySelectorAll('.list-item.selected, .folder-item.selected, .file-grid-item.selected').forEach(el => el.classList.remove('selected'));
            }
            
            // 创建框选矩形
            selectionBox = document.createElement('div');
            selectionBox.className = 'selection-box';
            selectionBox.style.cssText = `left:${startX}px;top:${startY}px;width:0;height:0;`;
            container.style.position = 'relative';
            container.appendChild(selectionBox);
        }
        
        if (!selectionBox) return;
        
        const rect = container.getBoundingClientRect();
        const currentX = e.clientX - rect.left + container.scrollLeft;
        const currentY = e.clientY - rect.top + container.scrollTop;
        
        const left = Math.min(startX, currentX);
        const top = Math.min(startY, currentY);
        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);
        
        selectionBox.style.left = left + 'px';
        selectionBox.style.top = top + 'px';
        selectionBox.style.width = width + 'px';
        selectionBox.style.height = height + 'px';
        
        // 检测被框选的项
        const boxRect = { left, top, right: left + width, bottom: top + height };
        container.querySelectorAll('.list-item:not(.parent-item), .folder-item:not(.parent-item), .file-grid-item').forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const itemLeft = itemRect.left - rect.left + container.scrollLeft;
            const itemTop = itemRect.top - rect.top + container.scrollTop;
            const itemRight = itemLeft + itemRect.width;
            const itemBottom = itemTop + itemRect.height;
            
            // 检查矩形是否相交
            const intersects = !(itemRight < boxRect.left || itemLeft > boxRect.right || 
                                 itemBottom < boxRect.top || itemTop > boxRect.bottom);
            
            item.classList.toggle('selected', intersects);
        });
        
        e.preventDefault();
    });
    
    // 结束框选
    function endSelection() {
        if (selectionBox) {
            selectionBox.remove();
            selectionBox = null;
        }
        mouseDownInContainer = false;
        startX = undefined;
        startY = undefined;
        if (_activeSelectionContainer === container) {
            _activeSelectionContainer = null;
        }
    }
    
    container.addEventListener('mouseup', endSelection);
    container.addEventListener('mouseleave', (e) => {
        // 鼠标离开容器时不立即结束，等待mouseup
    });
    document.addEventListener('mouseup', endSelection);
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// 打开文件夹选择器
function openFolderPicker(panel) {
    // 创建隐藏的input元素用于选择文件夹
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;
    input.style.display = 'none';
    document.body.appendChild(input);
    
    input.addEventListener('change', () => {
        if (input.files && input.files.length > 0) {
            // 获取选中的文件夹路径
            const filePath = input.files[0].path;
            const folderPath = path.dirname(filePath);
            
            // 左右两侧都刷新到选中的文件夹
            navigateTo(folderPath);
            showFolderContents(folderPath);
        }
        input.remove();
    });
    
    input.click();
}

function initSplitterDrag() {
    // 垂直分隔条（左右面板）
    const splitter = document.getElementById('splitter');
    const fileList = document.getElementById('file-list');
    let isDraggingV = false, startX, startWidth;
    
    splitter.addEventListener('mousedown', (e) => {
        isDraggingV = true;
        startX = e.clientX;
        startWidth = fileList.offsetWidth;
        document.body.style.cursor = 'col-resize';
        e.preventDefault();
    });
    
    // 水平分隔条（上下面板）
    const splitterH = document.getElementById('splitter-h');
    const mainContainer = document.getElementById('main-container');
    const editorPanel = document.getElementById('editor-panel');
    let isDraggingH = false, startY, startMainHeight, startEditorHeight;
    
    splitterH.addEventListener('mousedown', (e) => {
        isDraggingH = true;
        startY = e.clientY;
        startMainHeight = mainContainer.offsetHeight;
        startEditorHeight = editorPanel.offsetHeight;
        document.body.style.cursor = 'row-resize';
        e.preventDefault();
    });
    
    // 标签区分隔条
    const splitterTags = document.getElementById('splitter-tags');
    const tagsBar = document.getElementById('tags-bar');
    let isDraggingT = false, startTagsHeight;
    
    if (splitterTags && tagsBar) {
        splitterTags.addEventListener('mousedown', (e) => {
            isDraggingT = true;
            startY = e.clientY;
            startTagsHeight = tagsBar.offsetHeight;
            document.body.style.cursor = 'ns-resize';
            e.preventDefault();
        });
    }
    
    document.addEventListener('mousemove', (e) => {
        if (isDraggingV) {
            const newWidth = Math.max(150, Math.min(500, startWidth + e.clientX - startX));
            fileList.style.width = newWidth + 'px';
        }
        if (isDraggingH) {
            const delta = e.clientY - startY;
            const newMainHeight = Math.max(100, startMainHeight + delta);
            const newEditorHeight = Math.max(60, startEditorHeight - delta);
            mainContainer.style.flex = 'none';
            mainContainer.style.height = newMainHeight + 'px';
            editorPanel.style.flex = 'none';
            editorPanel.style.height = newEditorHeight + 'px';
        }
        if (isDraggingT) {
            const delta = e.clientY - startY;
            const newHeight = Math.max(20, Math.min(150, startTagsHeight + delta));
            tagsBar.style.maxHeight = newHeight + 'px';
            tagsBar.style.minHeight = newHeight + 'px';
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDraggingV = false;
        isDraggingH = false;
        isDraggingT = false;
        document.body.style.cursor = '';
    });
}

// 列宽拖拽调整
// 第一个竖线调整"类型"列，第二个竖线调整"修改日期"列
// 向右拖竖线 = 增加该列宽度
let _colResizing = false;

function initColumnResize() {
    const leftHeader = document.getElementById('list-header');
    const rightHeader = document.getElementById('preview-list-header');
    
    let colDragPanel = null;
    let colDragColumn = null;
    let colStartX = 0;
    let colStartWidth = 0;
    let colActiveDivider = null;
    
    function onColMouseMove(e) {
        if (!_colResizing) return;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        const delta = e.clientX - colStartX;
        // 竖线在列的左侧，向右拖=增加列宽
        const newWidth = Math.max(30, Math.min(200, colStartWidth + delta));
        columnWidths[colDragPanel][colDragColumn] = newWidth;
        // 只更新被拖动的那一列
        applySingleColumnWidth(colDragPanel, colDragColumn, newWidth);
    }
    
    function onColMouseUp(e) {
        if (_colResizing) {
            e.preventDefault();
            e.stopPropagation();
            _colResizing = false;
            if (colActiveDivider) colActiveDivider.classList.remove('dragging');
            colActiveDivider = null;
            colDragPanel = null;
            colDragColumn = null;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            document.removeEventListener('mousemove', onColMouseMove, true);
            document.removeEventListener('mouseup', onColMouseUp, true);
        }
    }
    
    [leftHeader, rightHeader].forEach(header => {
        if (!header) return;
        const panel = header.id === 'list-header' ? 'left' : 'right';
        const dividers = header.querySelectorAll('.col-divider');
        
        dividers.forEach((divider, index) => {
            divider.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                _colResizing = true;
                colDragPanel = panel;
                colDragColumn = index === 0 ? 'type' : 'date';
                colStartX = e.clientX;
                colStartWidth = columnWidths[panel][colDragColumn];
                colActiveDivider = divider;
                
                divider.classList.add('dragging');
                document.body.style.cursor = 'col-resize';
                document.body.style.userSelect = 'none';
                
                // 使用捕获阶段确保优先处理
                document.addEventListener('mousemove', onColMouseMove, true);
                document.addEventListener('mouseup', onColMouseUp, true);
            });
        });
    });
}

// 应用单列宽度（拖动时用）
function applySingleColumnWidth(panel, column, width) {
    const header = panel === 'left' ? document.getElementById('list-header') : document.getElementById('preview-list-header');
    const content = panel === 'left' ? document.getElementById('list-content') : document.getElementById('folder-contents');
    
    const colClass = column === 'type' ? '.col-type' : '.col-date';
    const itemClass = column === 'type' ? '.type' : '.mtime';
    const widthPx = width + 'px';
    
    // 更新列表头
    if (header) {
        const colEl = header.querySelector(colClass);
        if (colEl) {
            colEl.style.width = widthPx;
            colEl.style.minWidth = widthPx;
            colEl.style.maxWidth = widthPx;
        }
    }
    
    // 更新列表项
    if (content) {
        const items = content.querySelectorAll(itemClass);
        items.forEach(el => {
            el.style.width = widthPx;
            el.style.minWidth = widthPx;
            el.style.maxWidth = widthPx;
        });
    }
}

// 应用所有列宽度（初始化/刷新时用）
function applyColumnWidths(panel) {
    const header = panel === 'left' ? document.getElementById('list-header') : document.getElementById('preview-list-header');
    const content = panel === 'left' ? document.getElementById('list-content') : document.getElementById('folder-contents');
    
    const typeWidthPx = columnWidths[panel].type + 'px';
    const dateWidthPx = columnWidths[panel].date + 'px';
    
    if (header) {
        const colType = header.querySelector('.col-type');
        const colDate = header.querySelector('.col-date');
        if (colType) {
            colType.style.width = typeWidthPx;
            colType.style.minWidth = typeWidthPx;
            colType.style.maxWidth = typeWidthPx;
        }
        if (colDate) {
            colDate.style.width = dateWidthPx;
            colDate.style.minWidth = dateWidthPx;
            colDate.style.maxWidth = dateWidthPx;
        }
    }
    
    if (content) {
        content.querySelectorAll('.type').forEach(el => {
            el.style.width = typeWidthPx;
            el.style.minWidth = typeWidthPx;
            el.style.maxWidth = typeWidthPx;
        });
        content.querySelectorAll('.mtime').forEach(el => {
            el.style.width = dateWidthPx;
            el.style.minWidth = dateWidthPx;
            el.style.maxWidth = dateWidthPx;
        });
    }
}

// 历史记录右键菜单
function showHistoryContextMenu(x, y, historyPath) {
    const oldMenu = document.getElementById('context-menu');
    if (oldMenu) oldMenu.remove();
    
    const menu = document.createElement('div');
    menu.id = 'context-menu';
    menu.innerHTML = `
        <div class="menu-item" data-action="copy">复制路径</div>
        <div class="menu-item" data-action="delete">删除此记录</div>
    `;
    menu.style.cssText = `position:fixed;left:${x}px;top:${y}px;background:#2d2d2d;border:1px solid #3c3c3c;border-radius:4px;padding:4px 0;z-index:1000;`;
    
    document.body.appendChild(menu);
    
    menu.addEventListener('click', (e) => {
        const item = e.target.closest('.menu-item');
        if (item) {
            if (item.dataset.action === 'copy') {
                copyToClipboard(historyPath);
                setStatus('已复制路径');
            } else if (item.dataset.action === 'delete') {
                state.history = state.history.filter(h => h.path !== historyPath);
                saveData();
                renderHistoryDropdown();
                setStatus('已删除历史记录');
            }
        }
        menu.remove();
    });
    
    setTimeout(() => {
        document.addEventListener('click', function close() {
            menu.remove();
            document.removeEventListener('click', close);
        }, { once: true });
    }, 0);
}

// 标签右键菜单
function showTagContextMenu(x, y, tagPath) {
    const oldMenu = document.getElementById('context-menu');
    if (oldMenu) oldMenu.remove();
    
    const menu = document.createElement('div');
    menu.id = 'context-menu';
    menu.innerHTML = `
        <div class="menu-item" data-action="copy">复制路径</div>
        <div class="menu-item" data-action="delete">删除此标签</div>
    `;
    menu.style.cssText = `position:fixed;left:${x}px;top:${y}px;background:#2d2d2d;border:1px solid #3c3c3c;border-radius:4px;padding:4px 0;z-index:1000;`;
    
    document.body.appendChild(menu);
    
    menu.addEventListener('click', (e) => {
        const item = e.target.closest('.menu-item');
        if (item) {
            if (item.dataset.action === 'copy') {
                copyToClipboard(tagPath);
                setStatus('已复制路径');
            } else if (item.dataset.action === 'delete') {
                removeTagFolder(tagPath);
                showTagsDropdown();
                setStatus('已删除标签');
            }
        }
        menu.remove();
    });
    
    setTimeout(() => {
        document.addEventListener('click', function close() {
            menu.remove();
            document.removeEventListener('click', close);
        }, { once: true });
    }, 0);
}

// 右侧媒体预览区拖拽调整大小（四周边框均可拖拽）
function initMediaPreviewResize() {
    let isDragging = false;
    let dragEdge = null; // 'top', 'bottom', 'left', 'right'
    let startX, startY, startWidth, startHeight;
    const EDGE_SIZE = 8;
    
    elements.mediaPreview.addEventListener('mousedown', (e) => {
        const rect = elements.mediaPreview.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 检测是否在边缘
        if (y <= EDGE_SIZE) dragEdge = 'top';
        else if (y >= rect.height - EDGE_SIZE) dragEdge = 'bottom';
        else if (x <= EDGE_SIZE) dragEdge = 'left';
        else if (x >= rect.width - EDGE_SIZE) dragEdge = 'right';
        else return;
        
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = rect.width;
        startHeight = rect.height;
        elements.mediaPreview.classList.add('resizing');
        
        if (dragEdge === 'top' || dragEdge === 'bottom') {
            document.body.style.cursor = 'ns-resize';
        } else {
            document.body.style.cursor = 'ew-resize';
        }
        e.preventDefault();
        e.stopPropagation();
    });
    
    // 鼠标移动时更新光标样式
    elements.mediaPreview.addEventListener('mousemove', (e) => {
        if (isDragging) return;
        const rect = elements.mediaPreview.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (y <= EDGE_SIZE || y >= rect.height - EDGE_SIZE) {
            elements.mediaPreview.style.cursor = 'ns-resize';
        } else if (x <= EDGE_SIZE || x >= rect.width - EDGE_SIZE) {
            elements.mediaPreview.style.cursor = 'ew-resize';
        } else {
            elements.mediaPreview.style.cursor = '';
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        if (dragEdge === 'top') {
            const delta = startY - e.clientY;
            const newHeight = Math.max(80, Math.min(500, startHeight + delta));
            elements.mediaPreview.style.height = newHeight + 'px';
        } else if (dragEdge === 'bottom') {
            const delta = e.clientY - startY;
            const newHeight = Math.max(80, Math.min(500, startHeight + delta));
            elements.mediaPreview.style.height = newHeight + 'px';
        }
        // 宽度由容器自动处理，不需要调整
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            dragEdge = null;
            elements.mediaPreview.classList.remove('resizing');
            document.body.style.cursor = '';
        }
    });
}

// Ctrl+滚轮缩放 - 直接在各容器上监听
function initZoom() {
    const MIN_ZOOM = 0.5;
    const MAX_ZOOM = 2.0;
    const STEP = 0.1;
    
    function applyZoom(panel, delta) {
        // 如果正在拖拽列宽，不缩放
        if (_colResizing) return;
        
        let zoom, cssVar;
        
        if (panel === 'list') {
            state.zoomList = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, state.zoomList + delta));
            zoom = state.zoomList;
            cssVar = '--zoom-list';
        } else if (panel === 'preview') {
            state.zoomPreview = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, state.zoomPreview + delta));
            zoom = state.zoomPreview;
            cssVar = '--zoom-preview';
        } else if (panel === 'editor') {
            state.zoomEditor = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, state.zoomEditor + delta));
            zoom = state.zoomEditor;
            cssVar = '--zoom-editor';
        }
        
        // 应用到根元素
        document.documentElement.style.setProperty(cssVar, zoom);
        setStatus(`缩放: ${Math.round(zoom * 100)}%`);
    }
    
    // 左侧文件列表缩放
    if (elements.fileList) {
        elements.fileList.addEventListener('wheel', (e) => {
            if (e.ctrlKey && !_colResizing) {
                e.preventDefault();
                e.stopPropagation();
                applyZoom('list', e.deltaY < 0 ? STEP : -STEP);
            }
        }, { passive: false });
    }
    
    // 右侧预览区缩放
    if (elements.previewPanel) {
        elements.previewPanel.addEventListener('wheel', (e) => {
            if (e.ctrlKey && !_colResizing) {
                e.preventDefault();
                e.stopPropagation();
                applyZoom('preview', e.deltaY < 0 ? STEP : -STEP);
            }
        }, { passive: false });
    }
    
    // 底部编辑区缩放
    if (elements.editorPanel) {
        elements.editorPanel.addEventListener('wheel', (e) => {
            if (e.ctrlKey && !_colResizing) {
                e.preventDefault();
                e.stopPropagation();
                applyZoom('editor', e.deltaY < 0 ? STEP : -STEP);
            }
        }, { passive: false });
    }
    
    // 全局禁用浏览器默认的Ctrl+滚轮缩放
    document.addEventListener('wheel', (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
        }
    }, { passive: false });
}

function setStatus(text) {
    elements.statusText.textContent = text;
}

function formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatDate(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function formatDateShort(date) {
    const d = new Date(date);
    return `${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

// 面包屑路径导航事件
let activePathDropdown = null;

function initBreadcrumbEvents() {
    // 路径拖拽滚动
    initPathDragScroll();
    
    // 点击路径名称跳转
    document.addEventListener('click', (e) => {
        // 点击路径名称 - 跳转
        if (e.target.classList.contains('path-name')) {
            const targetPath = e.target.dataset.path;
            const panelId = e.target.dataset.panel;
            closePathDropdown();
            
            if (panelId === 'left-path') {
                navigateTo(targetPath);
            } else if (panelId === 'right-path') {
                showFolderContents(targetPath);
            }
            return;
        }
        
        // 点击箭头 - 展开下拉菜单
        if (e.target.classList.contains('path-arrow')) {
            e.stopPropagation();
            const targetPath = e.target.dataset.path;
            const panelId = e.target.dataset.panel;
            showPathDropdown(e.target, targetPath, panelId);
            return;
        }
        
        // 点击其他地方关闭下拉
        if (!e.target.closest('.path-dropdown')) {
            closePathDropdown();
        }
    });
    
    // 右键菜单 - 复制路径
    document.addEventListener('contextmenu', (e) => {
        const pathName = e.target.closest('.path-name');
        const panelPath = e.target.closest('.panel-path');
        
        if (pathName || panelPath) {
            e.preventDefault();
            let copyPath = '';
            
            if (pathName) {
                copyPath = pathName.dataset.path;
            } else if (panelPath) {
                // 获取整个路径
                copyPath = panelPath.id === 'left-path' ? state.currentPath : state.previewPath;
            }
            
            if (copyPath) {
                showPathContextMenu(e.clientX, e.clientY, copyPath);
            }
        }
    });
}

// 路径右键菜单
function showPathContextMenu(x, y, pathToCopy) {
    const oldMenu = document.getElementById('context-menu');
    if (oldMenu) oldMenu.remove();
    
    const menu = document.createElement('div');
    menu.id = 'context-menu';
    menu.innerHTML = `
        <div class="menu-item" data-action="copy">复制路径</div>
    `;
    menu.style.cssText = `position:fixed;left:${x}px;top:${y}px;background:#2d2d2d;border:1px solid #3c3c3c;border-radius:4px;padding:4px 0;z-index:1000;`;
    
    document.body.appendChild(menu);
    
    menu.addEventListener('click', (e) => {
        const item = e.target.closest('.menu-item');
        if (item && item.dataset.action === 'copy') {
            copyToClipboard(pathToCopy);
            setStatus('已复制路径');
        }
        menu.remove();
    });
    
    setTimeout(() => {
        document.addEventListener('click', function close() {
            menu.remove();
            document.removeEventListener('click', close);
        }, { once: true });
    }, 0);
}

function showPathDropdown(arrowEl, parentPath, panelId) {
    closePathDropdown();
    
    // 获取该路径下的子文件夹
    let items = [];
    
    // 如果是盘符，显示所有磁盘
    if (/^[A-Z]:$/i.test(parentPath.replace('\\', ''))) {
        items = state.drives.map(d => ({ name: d.replace('\\', ''), path: d, isFolder: true }));
    } else {
        try {
            const entries = fs.readdirSync(parentPath);
            entries.forEach(name => {
                try {
                    const fullPath = path.join(parentPath, name);
                    if (fs.statSync(fullPath).isDirectory()) {
                        items.push({ name, path: fullPath, isFolder: true });
                    }
                } catch (e) {}
            });
            items.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
        } catch (e) {}
    }
    
    if (items.length === 0) return;
    
    // 创建下拉菜单
    const dropdown = document.createElement('div');
    dropdown.className = 'path-dropdown';
    dropdown.dataset.panel = panelId;
    
    dropdown.innerHTML = items.map(item => `
        <div class="path-dropdown-item" data-path="${item.path}">
            <span class="icon">📁</span>
            <span>${item.name}</span>
        </div>
    `).join('');
    
    // 定位
    const rect = arrowEl.getBoundingClientRect();
    dropdown.style.top = (rect.bottom + 2) + 'px';
    dropdown.style.left = rect.left + 'px';
    
    // 点击项目
    dropdown.addEventListener('click', (e) => {
        const item = e.target.closest('.path-dropdown-item');
        if (item) {
            const targetPath = item.dataset.path;
            if (panelId === 'left-path') {
                navigateTo(targetPath);
            } else if (panelId === 'right-path') {
                showFolderContents(targetPath);
            }
            closePathDropdown();
        }
    });
    
    document.body.appendChild(dropdown);
    activePathDropdown = dropdown;
}

function closePathDropdown() {
    if (activePathDropdown) {
        activePathDropdown.remove();
        activePathDropdown = null;
    }
}

// 路径自动滚动到最右边
function initPathDragScroll() {
    // 不再需要拖拽功能，改为自动滚动
}
