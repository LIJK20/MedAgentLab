export const directorGroups = [
  { id: 'core', name: '核心导师', nameEn: 'Core Mentors' },
  { id: 'joint', name: '联合导师', nameEn: 'Joint Mentors' },
]

// 核心导师与联合导师 —— 内容依据 2026 招生海报及公开简历。
export const directors = [
  {
    id: 'yao',
    group: 'core',
    name: '姚志军',
    nameEn: 'Yao Zhijun',
    title: '教授 · 博士生导师',
    roleTag: '教授',
    affiliation: '兰州大学',
    bio:
      '兰州大学教授、博士生导师。现任图像图形学会脑图谱专业委员会委员、生物医学工程学会医学神经工程分会委员，甘肃省科普专家库、甘肃省科技专家库成员。长期从事人工智能与医工融合研究，涉及复杂系统建模、时间序列预测、医学影像智能诊断。 先后主持多项国家级、省部级科研项目。迄今已在Medical Image Analysis, NeuroImage, CNS Neuroscience & Therapeutics等知名学术期刊发表SCI论文70余篇，获授权国家发明专利5项、软件著作权多项。',
    keywords: ['复杂系统建模', '时间序列预测', '医学影像诊断'],
    initials: 'YZJ',
    photo: '/teachers/yzj.png',
    accentTone: 'ink',
  },
  {
    id: 'fu',
    group: 'core',
    name: '付钰',
    nameEn: 'Fu Yu',
    title: '青年研究员 · 硕士生导师',
    roleTag: '青年研究员',
    affiliation: '兰州大学',
    bio:
      '复旦大学张江科技研究院双聘研究员、浙江大学滨江研究院智能医疗技术与装备研究中心特聘研究员、四川农业大学信息工程学院研究生导师，Journal of Alzheimer’s Disease 候任副主编 (IF=3.1)、BioMedical Engineering OnLine 编委 (IF=2.9)、《哈尔滨工业大学学报》、《成都大学学报》青年编委。 近五年在 Nature Communications、Information Fusion、Medical Image Analysis、EJNMMI、IEEE TMI 等权威期刊及 ICLR、ICCV、NeurIPS、SIGKDD、MICCAI等顶级会议发表 SCI/EI 论文 70 余篇。主持多项国家级、省部级科研项目。曾获浙江大学优秀博士毕业生、中国医疗器械创新创业大赛一等奖/二等奖、Kaggle 全球竞赛金牌、IEEE TMI 杰出审稿人奖、ACM China 兰州分会新星奖等荣誉。',
    keywords: ['智慧医疗', '医学影像分析', '多模态融合'],
    initials: 'FY',
    photo: '/teachers/fy.png',
    accentTone: 'cyan',
  },
  {
    id: 'zheng',
    group: 'core',
    name: '郑芳',
    nameEn: 'Zheng Fang',
    title: '工程师',
    roleTag: '工程师',
    affiliation: '兰州大学',
    bio:
      '现从事 Agent自主协同学习、多模态数据建模、复杂决策与医学人工智能 相关研究，重点面向智慧医疗、脑科学与医学影像等应用场景，探索智能Agent在多源医学数据理解、跨模态信息融合、脑疾病建模、神经信号编解码和临床辅助决策中的关键技术，致力于构建具备自主学习、协同推理与复杂任务规划能力的新一代医学智能系统。主持、参与多项欧盟、国家级、省部级项目及教育部产学合作协同育人项目，发表多篇SCI、EI论文，曾获兰州大学教学成果奖二等奖、2025 HarmonyOS百校未来星讲师、云与计算先锋教师，获授权国家发明专利1项、软件著作权1项。',
    keywords: ['Agent 协同学习', '多模态建模', '医学智能体'],
    initials: 'ZF',
    photo: '/teachers/zf.png',
    accentTone: 'ink',
  },
  {
    id: 'huang-yanyan',
    group: 'joint',
    name: '黄岩岩',
    nameEn: 'Huang Yanyan',
    title: '香港大学博士研究生',
    roleTag: '联合导师',
    affiliation: '香港大学',
    bio:
      '香港大学博士研究生，师从于乐全教授；2023 年获浙江大学硕士学位，2020 年获哈尔滨工业大学工学学士学位。主要研究方向为人工智能医学影像分析、计算病理与基础模型，致力于开发具有更强诊断能力、跨域泛化能力与公平性的深度学习方法。近年来以第一作者在 Nature Communications、IEEE Transactions on Medical Imaging、Information Fusion、NeurIPS、ICCV、MICCAI 等国际权威期刊与顶级会议发表多篇论文。曾获 Kaggle Competitions Master 称号，取得 Kaggle 全球竞赛 3 枚金牌和 2 枚银牌。担任 Nature Communications、npj Digital Medicine、IEEE TPAMI、IEEE TMI、IEEE JBHI 等期刊审稿人，以及 NeurIPS、MICCAI、ICCV 等会议审稿人。',
    keywords: ['医学影像分析', '计算病理', '基础模型'],
    initials: 'HYY',
    photo: '/teachers/huangyanyan.png',
    accentTone: 'cyan',
  },
  {
    id: 'hu-zixin',
    group: 'joint',
    name: '胡子欣',
    nameEn: 'Hu Zixin',
    title: '青年副研究员 · 硕士生导师',
    roleTag: '联合导师',
    affiliation: '复旦大学',
    bio:
      '复旦大学人工智能创新与产业研究院青年副研究员、硕士生导师；2020 年获复旦大学生物信息学博士学位，2013 年获复旦大学软件工程硕士学位，2011 年获复旦大学统计学学士学位。曾于美国得克萨斯州立大学公共卫生学院及复旦大学生命科学学院从事科研工作。主要研究方向为复杂疾病的生物机制研究及精准干预，以及人工智能与生物信息学前沿方法论研究。近年来以第一作者或通讯作者身份在 National Science Review、Cell Discovery、Cell Host & Microbe 等国际权威期刊发表 SCI 论文 7 篇。先后主持和参与 3 项国家和省部级科研项目。曾荣获上海市青年科技启明星称号，并获国家自然科学青年基金资助。',
    keywords: ['复杂疾病机制', '精准干预', '生物信息学'],
    initials: 'HZX',
    photo: '/teachers/huzixin.jpg',
    accentTone: 'ink',
  },
]
