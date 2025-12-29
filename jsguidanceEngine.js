// 智能辅导核心模块 + 81章数据配置
let shenxueDB = null;
// 道德经81章完整数据
const DAODEJING_81_CHAPTERS = [
    // 第一卷：治神篇（1-20章）
    {
        id: "ddj001",
        title: "第1章：【道体分离之惑+命名依赖之困】·体道章",
        volume: "治神篇",
        coreGoal: "破除命名依赖，体悟道体本真",
        emotionFocus: "化解对事物标签化的执念",
        keyField: "治神时长",
        keywords: ["道体", "命名", "依赖", "体道", "标签"]
    },
    {
        id: "ddj002",
        title: "第2章：【二元对立之碍+完美主义之偏】·养身章",
        volume: "治神篇",
        coreGoal: "化解二元对立思维，接纳不完美",
        emotionFocus: "缓解完美主义带来的焦虑",
        keyField: "治神时长",
        keywords: ["二元", "对立", "完美", "养身", "焦虑"]
    },
    {
        id: "ddj003",
        title: "第3章：【欲望过亢之扰+攀比焦虑之困】·安民章",
        volume: "治神篇",
        coreGoal: "节制过度欲望，摆脱攀比焦虑",
        emotionFocus: "平复因攀比产生的失衡心态",
        keyField: "治神时长",
        keywords: ["欲望", "攀比", "焦虑", "安民", "节制"]
    },
    {
        id: "ddj004",
        title: "第4章：【用道失调之失+创造力枯竭之困】·无源章",
        volume: "治神篇",
        coreGoal: "找回道的本源动力，恢复创造力",
        emotionFocus: "缓解创造力枯竭带来的挫败感",
        keyField: "治神时长",
        keywords: ["用道", "创造力", "枯竭", "无源", "动力"]
    },
    {
        id: "ddj005",
        title: "第5章：【情感淡漠之隔+共情待深之缺】·虚用章",
        volume: "治神篇",
        coreGoal: "培养共情能力，破除情感淡漠",
        emotionFocus: "提升对他人情绪的感知与理解",
        keyField: "治神时长",
        keywords: ["情感", "淡漠", "共情", "虚用", "感知"]
    },
    {
        id: "ddj006",
        title: "第6章：【生命能量待蓄之困+元气涵养之需】·成象章",
        volume: "治神篇",
        coreGoal: "涵养生命元气，蓄满生命能量",
        emotionFocus: "缓解能量不足带来的疲惫感",
        keyField: "治神时长",
        keywords: ["能量", "元气", "涵养", "成象", "疲惫"]
    },
    {
        id: "ddj007",
        title: "第7章：【自我中心之执+人际连接之碍】·韬光章",
        volume: "治神篇",
        coreGoal: "破除自我中心，建立良好人际连接",
        emotionFocus: "化解人际孤立带来的孤独感",
        keyField: "治神时长",
        keywords: ["自我", "人际", "连接", "韬光", "孤独"]
    },
    {
        id: "ddj008",
        title: "第8章：【竞争焦虑之扰+生存恐惧之困】·易性章",
        volume: "治神篇",
        coreGoal: "顺应本性，摆脱竞争焦虑与生存恐惧",
        emotionFocus: "平复因竞争带来的紧张与恐惧",
        keyField: "治神时长",
        keywords: ["竞争", "生存", "恐惧", "易性", "紧张"]
    },
    {
        id: "ddj009",
        title: "第9章：【持盈过甚之执+掌控过度之困】·运夷章",
        volume: "治神篇",
        coreGoal: "学会适度放手，破除过度掌控的执念",
        emotionFocus: "缓解因无法掌控带来的焦虑",
        keyField: "治神时长",
        keywords: ["持盈", "掌控", "执念", "运夷", "放手"]
    },
    {
        id: "ddj010",
        title: "第10章：【身心分离之惑+知行脱节之困】·能为章",
        volume: "治神篇",
        coreGoal: "实现身心合一，做到知行合一",
        emotionFocus: "化解因知行脱节带来的愧疚感",
        keyField: "治神时长",
        keywords: ["身心", "知行", "合一", "能为", "愧疚"]
    },
    {
        id: "ddj011",
        title: "第11章：【有用无用之惑+实用主义之困】·无用章",
        volume: "治神篇",
        coreGoal: "超越实用主义，体悟无用之用",
        emotionFocus: "缓解因追求实用带来的功利心态",
        keyField: "治神时长",
        keywords: ["有用", "无用", "实用", "功利", "体悟"]
    },
    {
        id: "ddj012",
        title: "第12章：【感官过载之扰+信息焦虑之困】·检欲章",
        volume: "治神篇",
        coreGoal: "节制感官欲望，摆脱信息焦虑",
        emotionFocus: "平复因信息过载带来的烦躁感",
        keyField: "治神时长",
        keywords: ["感官", "信息", "焦虑", "检欲", "烦躁"]
    },
    {
        id: "ddj013",
        title: "第13章：【宠辱得失之扰+评价依赖之困】·厌耻章",
        volume: "治神篇",
        coreGoal: "看淡宠辱得失，摆脱他人评价依赖",
        emotionFocus: "缓解因他人评价带来的情绪波动",
        keyField: "治神时长",
        keywords: ["宠辱", "得失", "评价", "厌耻", "波动"]
    },
    {
        id: "ddj014",
        title: "第14章：【时空错位之惑+时间焦虑之困】·赞玄章",
        volume: "治神篇",
        coreGoal: "回归当下，摆脱时间焦虑与时空错位",
        emotionFocus: "缓解因过去遗憾或未来担忧带来的焦虑",
        keyField: "治神时长",
        keywords: ["时空", "时间", "焦虑", "赞玄", "当下"]
    },
    {
        id: "ddj015",
        title: "第15章：【人格僵化之碍+身份认同之惑】·显质章",
        volume: "治神篇",
        coreGoal: "打破人格僵化，重构灵活的身份认同",
        emotionFocus: "缓解因身份固化带来的束缚感",
        keyField: "治神时长",
        keywords: ["人格", "身份", "认同", "显质", "束缚"]
    },
    {
        id: "ddj016",
        title: "第16章：【归根之碍+漂泊无根之困】·归根章",
        volume: "治神篇",
        coreGoal: "找到生命本源，摆脱漂泊无根的困惑",
        emotionFocus: "缓解因无归属感带来的迷茫感",
        keyField: "治神时长",
        keywords: ["归根", "漂泊", "归属", "迷茫", "本源"]
    },
    {
        id: "ddj017",
        title: "第17章：【权威依赖之惑+自主决策之困】·淳风章",
        volume: "治神篇",
        coreGoal: "建立自主决策能力，摆脱权威依赖",
        emotionFocus: "缓解因无法自主带来的无助感",
        keyField: "治神时长",
        keywords: ["权威", "自主", "决策", "淳风", "无助"]
    },
    {
        id: "ddj018",
        title: "第18章：【道德伪善之惑+冷漠疏离之困】·俗薄章",
        volume: "治神篇",
        coreGoal: "践行真道德，破除冷漠疏离与伪善",
        emotionFocus: "化解因社会冷漠带来的失望感",
        keyField: "治神时长",
        keywords: ["道德", "伪善", "冷漠", "俗薄", "失望"]
    },
    {
        id: "ddj019",
        title: "第19章：【知识过载之扰+思维固化之困】·还淳章",
        volume: "治神篇",
        coreGoal: "简化知识体系，打破思维固化",
        emotionFocus: "缓解因知识过载带来的压迫感",
        keyField: "治神时长",
        keywords: ["知识", "思维", "固化", "还淳", "压迫"]
    },
    {
        id: "ddj020",
        title: "第20章：【存在孤独之惑+疏离合群之困】·异俗章",
        volume: "治神篇",
        coreGoal: "接纳存在孤独，在合群与疏离间找到平衡",
        emotionFocus: "缓解因孤独带来的无助与迷茫",
        keyField: "治神时长",
        keywords: ["孤独", "合群", "疏离", "异俗", "平衡"]
    },
    // 第二卷：治心篇（21-40章）
    {
        id: "ddj021",
        title: "第21章：【情志失察之感+情感表达之碍】·虚心章",
        volume: "治心篇",
        coreGoal: "提升情志觉察能力，顺畅表达情感",
        emotionFocus: "化解因情感压抑带来的内心冲突",
        keyField: "情绪稳定度",
        keywords: ["情志", "情感", "表达", "虚心", "压抑"]
    },
    {
        id: "ddj022",
        title: "第22章：【挫折创伤之扰+失败恐惧之困】·益谦章",
        volume: "治心篇",
        coreGoal: "接纳挫折失败，培养谦卑之心",
        emotionFocus: "缓解因失败恐惧带来的逃避心态",
        keyField: "情绪稳定度",
        keywords: ["挫折", "失败", "恐惧", "益谦", "逃避"]
    },
    {
        id: "ddj023",
        title: "第23章：【无常焦虑之惑+控制欲过强之困】·虚极章",
        volume: "治心篇",
        coreGoal: "接纳生命无常，放下过度控制欲",
        emotionFocus: "缓解因无常带来的焦虑与不安",
        keyField: "情绪稳定度",
        keywords: ["无常", "控制", "焦虑", "虚极", "不安"]
    },
    {
        id: "ddj024",
        title: "第24章：【虚荣外驰之惑+虚假自体之困】·苦恩章",
        volume: "治心篇",
        coreGoal: "破除虚荣外驰，找回真实自体",
        emotionFocus: "缓解因虚假自体带来的疲惫感",
        keyField: "情绪稳定度",
        keywords: ["虚荣", "自体", "真实", "苦恩", "疲惫"]
    },
    {
        id: "ddj025",
        title: "第25章：【方向迷失之惑+导航失灵之困】·象元章",
        volume: "治心篇",
        coreGoal: "找回人生方向，建立内在导航系统",
        emotionFocus: "缓解因方向迷失带来的迷茫感",
        keyField: "情绪稳定度",
        keywords: ["方向", "导航", "迷失", "象元", "迷茫"]
    },
    {
        id: "ddj026",
        title: "第26章：【轻重失衡之惑+本末倒置之困】·重德章",
        volume: "治心篇",
        coreGoal: "分清轻重缓急，回归事物本源",
        emotionFocus: "缓解因本末倒置带来的挫败感",
        keyField: "情绪稳定度",
        keywords: ["轻重", "本末", "重德", "挫败", "回归"]
    },
    {
        id: "ddj027",
        title: "第27章：【智慧闭塞之惑+认知局限之困】·巧用章",
        volume: "治心篇",
        coreGoal: "打开智慧通道，突破认知局限",
        emotionFocus: "缓解因认知局限带来的无力感",
        keyField: "情绪稳定度",
        keywords: ["智慧", "认知", "局限", "巧用", "无力"]
    },
    {
        id: "ddj028",
        title: "第28章：【刚柔失和之惑+情绪失控之困】·反朴章",
        volume: "治心篇",
        coreGoal: "调和刚柔关系，学会情绪管理",
        emotionFocus: "缓解因情绪失控带来的愧疚感",
        keyField: "情绪稳定度",
        keywords: ["刚柔", "情绪", "失控", "反朴", "愧疚"]
    },
    {
        id: "ddj029",
        title: "第29章：【强力妄为之惑+过度干预之困】·无为章",
        volume: "治心篇",
        coreGoal: "学会无为而治，避免强力妄为与过度干预",
        emotionFocus: "缓解因过度干预带来的焦虑感",
        keyField: "情绪稳定度",
        keywords: ["强力", "干预", "无为", "焦虑", "妄为"]
    },
    {
        id: "ddj030",
        title: "第30章：【暴力冲突之惑+攻击性倾向之困】·俭武章",
        volume: "治心篇",
        coreGoal: "化解暴力冲突，收敛攻击性倾向",
        emotionFocus: "缓解因攻击性带来的人际关系紧张",
        keyField: "情绪稳定度",
        keywords: ["暴力", "冲突", "攻击", "俭武", "紧张"]
    },
    {
        id: "ddj031",
        title: "第31章：【战争心态之扰+敌对思维之困】·偃武章",
        volume: "治心篇",
        coreGoal: "放下战争心态，破除敌对思维",
        emotionFocus: "缓解因敌对思维带来的内心紧张",
        keyField: "情绪稳定度",
        keywords: ["战争", "敌对", "思维", "偃武", "紧张"]
    },
    {
        id: "ddj032",
        title: "第32章：【秩序失序之惑+规则漠视之困】·圣德章",
        volume: "治心篇",
        coreGoal: "建立内在秩序，尊重外在规则",
        emotionFocus: "缓解因秩序混乱带来的焦虑感",
        keyField: "情绪稳定度",
        keywords: ["秩序", "规则", "失序", "圣德", "焦虑"]
    },
    {
        id: "ddj033",
        title: "第33章：【自知之惑+认知偏差之困】·辨德章",
        volume: "治心篇",
        coreGoal: "提升自我认知，纠正认知偏差",
        emotionFocus: "缓解因自我认知不足带来的迷茫感",
        keyField: "情绪稳定度",
        keywords: ["自知", "认知", "偏差", "辨德", "迷茫"]
    },
    {
        id: "ddj034",
        title: "第34章：【大小迷失之惑+格局狭隘之困】·任成章",
        volume: "治心篇",
        coreGoal: "拓宽人生格局，摆脱大小迷失的困惑",
        emotionFocus: "缓解因格局狭隘带来的挫败感",
        keyField: "情绪稳定度",
        keywords: ["大小", "格局", "狭隘", "任成", "挫败"]
    },
    {
        id: "ddj035",
        title: "第35章：【平淡之扰+刺激依赖之困】·仁德章",
        volume: "治心篇",
        coreGoal: "接纳平淡生活，摆脱刺激依赖",
        emotionFocus: "缓解因平淡带来的空虚感",
        keyField: "情绪稳定度",
        keywords: ["平淡", "刺激", "依赖", "仁德", "空虚"]
    },
    {
        id: "ddj036",
        title: "第36章：【微明之惑+预判之困】·微明章",
        volume: "治心篇",
        coreGoal: "洞察细微之处，放下过度预判",
        emotionFocus: "缓解因无法预判带来的焦虑感",
        keyField: "情绪稳定度",
        keywords: ["微明", "预判", "洞察", "焦虑", "细微"]
    },
    {
        id: "ddj037",
        title: "第37章：【欲望无厌之惑+贪得无厌之困】·为政章",
        volume: "治心篇",
        coreGoal: "节制无限欲望，摆脱贪得无厌的困境",
        emotionFocus: "缓解因欲望无法满足带来的痛苦感",
        keyField: "情绪稳定度",
        keywords: ["欲望", "贪得", "无厌", "为政", "痛苦"]
    },
    {
        id: "ddj038",
        title: "第38章：【上德失落+道德滑坡之困】·论德章",
        volume: "治心篇",
        coreGoal: "重拾高尚道德，遏制道德滑坡",
        emotionFocus: "缓解因道德失落带来的失望感",
        keyField: "情绪稳定度",
        keywords: ["上德", "道德", "滑坡", "论德", "失望"]
    },
    {
        id: "ddj039",
        title: "第39章：【得一之惑+身心失衡之困】·法本章",
        volume: "治心篇",
        coreGoal: "求得身心合一，化解身心失衡的困惑",
        emotionFocus: "缓解因身心失衡带来的疲惫感",
        keyField: "情绪稳定度",
        keywords: ["得一", "身心", "失衡", "法本", "疲惫"]
    },
    {
        id: "ddj040",
        title: "第40章：【创造之惑+生命动能停滞之困】·去用章",
        volume: "治心篇",
        coreGoal: "激活生命动能，摆脱创造停滞的困境",
        emotionFocus: "缓解因动能不足带来的无力感",
        keyField: "情绪稳定度",
        keywords: ["创造", "动能", "停滞", "去用", "无力"]
    },
    // 第三卷：治身篇（41-60章）
    {
        id: "ddj041",
        title: "第41章：【成长焦虑之惑+大器晚成之困】·同异章",
        volume: "治身篇",
        coreGoal: "接纳成长节奏，相信大器晚成",
        emotionFocus: "缓解因成长焦虑带来的浮躁感",
        keyField: "睡眠时长",
        keywords: ["成长", "焦虑", "大器晚成", "同异", "浮躁"]
    },
    {
        id: "ddj042",
        title: "第42章：【阴阳失和之惑+内在冲突之困】·道化章",
        volume: "治身篇",
        coreGoal: "调和内在阴阳，化解内在冲突",
        emotionFocus: "缓解因内在冲突带来的痛苦感",
        keyField: "睡眠时长",
        keywords: ["阴阳", "内在", "冲突", "道化", "痛苦"]
    },
    {
        id: "ddj043",
        title: "第43章：【柔性缺失+刚性过盛之困】·偏用章",
        volume: "治身篇",
        coreGoal: "培养柔性品质，中和过度刚性",
        emotionFocus: "缓解因刚性过盛带来的人际关系紧张",
        keyField: "睡眠时长",
        keywords: ["柔性", "刚性", "偏用", "紧张", "中和"]
    },
    {
        id: "ddj044",
        title: "第44章：【名利执念+价值物化之困】·立戒章",
        volume: "治身篇",
        coreGoal: "放下名利执念，摆脱价值物化的困境",
        emotionFocus: "缓解因名利追逐带来的焦虑感",
        keyField: "睡眠时长",
        keywords: ["名利", "价值", "物化", "立戒", "焦虑"]
    },
    {
        id: "ddj045",
        title: "第45章：【清静之惑+心神不宁之困】·洪德章",
        volume: "治身篇",
        coreGoal: "求得内心清静，化解心神不宁的困惑",
        emotionFocus: "缓解因心神不宁带来的烦躁感",
        keyField: "睡眠时长",
        keywords: ["清静", "心神", "不宁", "洪德", "烦躁"]
    },
    {
        id: "ddj046",
        title: "第46章：【纵欲耗损之惑+气血亏虚之困】·俭欲章",
        volume: "治身篇",
        coreGoal: "节制纵欲行为，涵养气血精神",
        emotionFocus: "缓解因气血亏虚带来的疲惫感",
        keyField: "睡眠时长",
        keywords: ["纵欲", "气血", "亏虚", "俭欲", "疲惫"]
    },
    {
        id: "ddj047",
        title: "第47章：【外求之扰+内虚之困】·鉴远章",
        volume: "治身篇",
        coreGoal: "减少向外探求，填补内在空虚",
        emotionFocus: "缓解因内虚带来的迷茫感",
        keyField: "睡眠时长",
        keywords: ["外求", "内虚", "鉴远", "迷茫", "填补"]
    },
    {
        id: "ddj048",
        title: "第48章：【有为过度之惑+努力耗损之困】·忘知章",
        volume: "治身篇",
        coreGoal: "减少过度有为，避免努力耗损",
        emotionFocus: "缓解因过度努力带来的疲惫感",
        keyField: "睡眠时长",
        keywords: ["有为", "努力", "耗损", "忘知", "疲惫"]
    },
    {
        id: "ddj049",
        title: "第49章：【分别之惑+偏见之困】·任德章",
        volume: "治身篇",
        coreGoal: "破除分别之心，放下偏见执念",
        emotionFocus: "缓解因偏见带来的人际关系紧张",
        keyField: "睡眠时长",
        keywords: ["分别", "偏见", "任德", "紧张", "放下"]
    },
    {
        id: "ddj050",
        title: "第50章：【生死之惑+存在之困】·贵生章",
        volume: "治身篇",
        coreGoal: "接纳生死规律，化解存在的困惑",
        emotionFocus: "缓解因生死担忧带来的焦虑感",
        keyField: "睡眠时长",
        keywords: ["生死", "存在", "贵生", "焦虑", "接纳"]
    },
    {
        id: "ddj051",
        title: "第51章：【玄德不养之惑+德性不足之困】·养德章",
        volume: "治身篇",
        coreGoal: "涵养玄德品质，弥补德性不足",
        emotionFocus: "缓解因德性不足带来的愧疚感",
        keyField: "睡眠时长",
        keywords: ["玄德", "德性", "养德", "愧疚", "涵养"]
    },
    {
        id: "ddj052",
        title: "第52章：【母体失联之惑+归属缺失之困】·归元章",
        volume: "治身篇",
        coreGoal: "找回母体连接，填补归属缺失",
        emotionFocus: "缓解因无归属感带来的孤独感",
        keyField: "睡眠时长",
        keywords: ["母体", "归属", "归元", "孤独", "连接"]
    },
    {
        id: "ddj053",
        title: "第53章：【邪径迷恋之惑+捷径依赖之困】·益证章",
        volume: "治身篇",
        coreGoal: "远离邪径捷径，脚踏实地前行",
        emotionFocus: "缓解因捷径依赖带来的挫败感",
        keyField: "睡眠时长",
        keywords: ["邪径", "捷径", "益证", "挫败", "踏实"]
    },
    {
        id: "ddj054",
        title: "第54章：【根基不牢之惑+基础薄弱之困】·修观章",
        volume: "治身篇",
        coreGoal: "夯实人生根基，弥补基础薄弱",
        emotionFocus: "缓解因根基不牢带来的焦虑感",
        keyField: "睡眠时长",
        keywords: ["根基", "基础", "修观", "焦虑", "夯实"]
    },
    {
        id: "ddj055",
        title: "第55章：【赤子失真之惑+纯真丧失之困】·玄符章",
        volume: "治身篇",
        coreGoal: "找回赤子之心，重拾纯真本性",
        emotionFocus: "缓解因纯真丧失带来的失落感",
        keyField: "睡眠时长",
        keywords: ["赤子", "纯真", "玄符", "失落", "找回"]
    },
    {
        id: "ddj056",
        title: "第56章：【是非纠缠之惑+争辩成瘾之困】·玄德章",
        volume: "治身篇",
        coreGoal: "摆脱是非纠缠，放下争辩成瘾",
        emotionFocus: "缓解因争辩带来的情绪波动",
        keyField: "睡眠时长",
        keywords: ["是非", "争辩", "玄德", "波动", "放下"]
    },
    {
        id: "ddj057",
        title: "第57章：【以奇治国之惑+投机取巧之困】·淳风章",
        volume: "治身篇",
        coreGoal: "摒弃投机取巧，回归淳朴本性",
        emotionFocus: "缓解因投机失败带来的挫败感",
        keyField: "睡眠时长",
        keywords: ["投机", "淳朴", "淳风", "挫败", "摒弃"]
    },
    {
        id: "ddj058",
        title: "第58章：【福祸迷惑之惑+得失焦虑之困】·顺化章",
        volume: "治身篇",
        coreGoal: "看透福祸相依，放下得失焦虑",
        emotionFocus: "缓解因得失带来的情绪波动",
        keyField: "睡眠时长",
        keywords: ["福祸", "得失", "顺化", "波动", "看透"]
    },
    {
        id: "ddj059",
        title: "第59章：【积蓄障碍之惑+储备不足之困】·守道章",
        volume: "治身篇",
        coreGoal: "克服积蓄障碍，弥补储备不足",
        emotionFocus: "缓解因储备不足带来的焦虑感",
        keyField: "睡眠时长",
        keywords: ["积蓄", "储备", "守道", "焦虑", "克服"]
    },
    {
        id: "ddj060",
        title: "第60章：【复杂焦虑之惑+简化能力之困】·居位章",
        volume: "治身篇",
        coreGoal: "学会简化生活，摆脱复杂焦虑",
        emotionFocus: "缓解因复杂带来的烦躁感",
        keyField: "睡眠时长",
        keywords: ["复杂", "简化", "居位", "烦躁", "学会"]
    },
    // 第四卷：治性篇（61-80章）
    {
        id: "ddj061",
        title: "第61章：【谦卑障碍之惑+傲慢自负之困】·谦德章",
        volume: "治性篇",
        coreGoal: "培养谦卑品质，克服傲慢自负",
        emotionFocus: "缓解因傲慢带来的人际关系紧张",
        keyField: "神聚度",
        keywords: ["谦卑", "傲慢", "谦德", "紧张", "培养"]
    },
    {
        id: "ddj062",
        title: "第62章：【为贵之惑+本末倒置之困】·为道章",
        volume: "治性篇",
        coreGoal: "分清贵贱主次，避免本末倒置",
        emotionFocus: "缓解因本末倒置带来的挫败感",
        keyField: "神聚度",
        keywords: ["贵贱", "本末", "为道", "挫败", "分清"]
    },
    {
        id: "ddj063",
        title: "第63章：【大事难为之惑+畏难情绪之困】·为无为章",
        volume: "治性篇",
        coreGoal: "分解大事难事，克服畏难情绪",
        emotionFocus: "缓解因畏难带来的逃避心态",
        keyField: "神聚度",
        keywords: ["大事", "畏难", "为无为", "逃避", "分解"]
    },
    {
        id: "ddj064",
        title: "第64章：【未兆未察之惑+危机意识之困】·守微章",
        volume: "治性篇",
        coreGoal: "洞察细微征兆，培养危机意识",
        emotionFocus: "缓解因未察危机带来的焦虑感",
        keyField: "神聚度",
        keywords: ["未兆", "危机", "守微", "焦虑", "洞察"]
    },
    {
        id: "ddj065",
        title: "第65章：【明民之惑+沟通障碍之困】·淳德章",
        volume: "治性篇",
        coreGoal: "学会清晰沟通，破除沟通障碍",
        emotionFocus: "缓解因沟通不畅带来的挫败感",
        keyField: "神聚度",
        keywords: ["明民", "沟通", "淳德", "挫败", "清晰"]
    },
    {
        id: "ddj066",
        title: "第66章：【江海为下之惑+谦下不足之困】·后己章",
        volume: "治性篇",
        coreGoal: "学会谦下待人，培养江海胸襟",
        emotionFocus: "缓解因谦下不足带来的人际关系紧张",
        keyField: "神聚度",
        keywords: ["谦下", "江海", "后己", "紧张", "胸襟"]
    },
    {
        id: "ddj067",
        title: "第67章：【三宝遗失之惑+德性缺失之困】·三宝章",
        volume: "治性篇",
        coreGoal: "找回慈、俭、不敢为天下先三宝",
        emotionFocus: "缓解因德性缺失带来的愧疚感",
        keyField: "神聚度",
        keywords: ["三宝", "慈", "俭", "三宝章", "愧疚"]
    },
    {
        id: "ddj068",
        title: "第68章：【不争之德之惑+好胜心过强之困】·配天章",
        volume: "治性篇",
        coreGoal: "培养不争之德，克服好胜之心",
        emotionFocus: "缓解因好胜带来的焦虑感",
        keyField: "神聚度",
        keywords: ["不争", "好胜", "配天", "焦虑", "培养"]
    },
    {
        id: "ddj069",
        title: "第69章：【用兵有言之惑+冲突倾向之困】·玄用章",
        volume: "治性篇",
        coreGoal: "放下冲突倾向，学会以柔克刚",
        emotionFocus: "缓解因冲突带来的紧张感",
        keyField: "神聚度",
        keywords: ["用兵", "冲突", "玄用", "紧张", "柔克刚"]
    },
    {
        id: "ddj070",
        title: "第70章：【知稀之惑+真知匮乏之困】·知难章",
        volume: "治性篇",
        coreGoal: "追求真知灼见，克服真知匮乏",
        emotionFocus: "缓解因无知带来的迷茫感",
        keyField: "神聚度",
        keywords: ["真知", "匮乏", "知难", "迷茫", "追求"]
    },
    {
        id: "ddj071",
        title: "第71章：【知不知之惑+认知盲区之困】·知病章",
        volume: "治性篇",
        coreGoal: "认知自身盲区，保持谦逊之心",
        emotionFocus: "缓解因认知盲区带来的挫败感",
        keyField: "神聚度",
        keywords: ["认知", "盲区", "知病", "挫败", "谦逊"]
    },
    {
        id: "ddj072",
        title: "第72章：【民不畏威之惑+规则漠视之困】·爱身章",
        volume: "治性篇",
        coreGoal: "敬畏规则，学会自爱自重",
        emotionFocus: "缓解因规则漠视带来的焦虑感",
        keyField: "神聚度",
        keywords: ["规则", "敬畏", "爱身", "焦虑", "自爱"]
    },
    {
        id: "ddj073",
        title: "第73章：【天网失敬之惑+侥幸妄为之困】·任为章",
        volume: "治性篇",
        coreGoal: "敬畏天网规律，克服侥幸妄为",
        emotionFocus: "缓解因侥幸带来的焦虑感",
        keyField: "神聚度",
        keywords: ["天网", "侥幸", "任为", "焦虑", "敬畏"]
    },
    {
        id: "ddj074",
        title: "第74章：【民不畏死之惑+生命漠视之困】·制惑章",
        volume: "治性篇",
        coreGoal: "敬畏生命，克服生命漠视的困境",
        emotionFocus: "缓解因生命漠视带来的麻木感",
        keyField: "神聚度",
        keywords: ["生命", "漠视", "制惑", "麻木", "敬畏"]
    },
    {
        id: "ddj075",
        title: "第75章：【民生艰难之惑+生存压力之困】·贪损章",
        volume: "治性篇",
        coreGoal: "减轻生存压力，克服贪婪带来的困境",
        emotionFocus: "缓解因生存压力带来的焦虑感",
        keyField: "神聚度",
        keywords: ["民生", "生存", "贪损", "焦虑", "减压"]
    },
    {
        id: "ddj076",
        title: "第76章：【刚硬偏执之惑+柔润不足之困】·戒强章",
        volume: "治性篇",
        coreGoal: "克服刚硬偏执，培养柔润品质",
        emotionFocus: "缓解因偏执带来的人际关系紧张",
        keyField: "神聚度",
        keywords: ["刚硬", "柔润", "戒强", "紧张", "偏执"]
    },
    {
        id: "ddj077",
        title: "第77章：【天道失衡之惑+公平执念之困】·天道章",
        volume: "治性篇",
        coreGoal: "接纳天道规律，放下公平执念",
        emotionFocus: "缓解因公平执念带来的痛苦感",
        keyField: "神聚度",
        keywords: ["天道", "公平", "天道章", "痛苦", "接纳"]
    },
    {
        id: "ddj078",
        title: "第78章：【柔水攻坚之惑+以柔克刚之碍】·任信章",
        volume: "治性篇",
        coreGoal: "学会以柔克刚，体悟柔水攻坚的智慧",
        emotionFocus: "缓解因强硬带来的挫败感",
        keyField: "神聚度",
        keywords: ["柔水", "攻坚", "任信", "挫败", "柔克刚"]
    },
    {
        id: "ddj079",
        title: "第79章：【和大怨余怨之惑+怨恨执念之困】·任德章",
        volume: "治性篇",
        coreGoal: "放下怨恨执念，化解过往恩怨",
        emotionFocus: "缓解因怨恨带来的内心痛苦",
        keyField: "神聚度",
        keywords: ["怨恨", "恩怨", "任德", "痛苦", "放下"]
    },
    {
        id: "ddj080",
        title: "第80章：【理想主义+现实适应之困】·独立章",
        volume: "治性篇",
        coreGoal: "平衡理想现实，提升现实适应能力",
        emotionFocus: "缓解因理想与现实差距带来的失落感",
        keyField: "神聚度",
        keywords: ["理想", "现实", "独立", "失落", "平衡"]
    },
    // 第五卷：治世篇（81章）
    {
        id: "ddj081",
        title: "第81章：【生命圆满之惑+价值混乱之困】·显质章",
        volume: "治世篇",
        coreGoal: "明晰生命价值，追求生命圆满",
        emotionFocus: "缓解因价值混乱带来的迷茫感",
        keyField: "互动满意度",
        keywords: ["圆满", "价值", "显质", "迷茫", "明晰"]
    }
];

// 初始化时加载数据库
window.addEventListener('DOMContentLoaded', async () => {
    try {
        // 优先加载本地JSON文件，若失败则使用内置默认数据
        const response = await fetch('data/shenxueDB.json').catch(async () => {
            return {
                json: () => ({
                    "心传": [
                        {
                            "id": "xc001",
                            "章节": "道维-破妄见真",
                            "原文": "万物衍化本清静，有心无依为真心。",
                            "关键词": ["清静", "破妄", "真心", "工作冲突"],
                            "应用场景": "工作冲突时践行'不争'",
                            "指导模板": "当你感到%s时，默念原文三遍，观察情绪而不评判。"
                        },
                        {
                            "id": "xc002",
                            "章节": "德维-积德显真",
                            "原文": "积善之家必有余庆，积不善之家必有余殃。",
                            "关键词": ["积德", "善", "家庭", "因果"],
                            "应用场景": "家庭关系紧张时",
                            "指导模板": "今日与家人互动%d次，建议以'善'为先，减少辩解。"
                        }
                    ],
                    "心践论": [
                        {
                            "id": "sj001",
                            "十目": "格念",
                            "原文": "吾日三省吾身。",
                            "关键词": ["反省", "妄念", "晨起", "三省"],
                            "应用场景": "每日晨起标记妄念",
                            "指导模板": "今日共标记%d条妄念，建议晚间静坐时逐一反观其来源。"
                        },
                        {
                            "id": "sj002",
                            "十目": "正心",
                            "原文": "心正而后身修，身修而后家齐。",
                            "关键词": ["正心", "不公", "嗔怒", "平和"],
                            "应用场景": "遇不公事保持平和",
                            "指导模板": "遇%s时，先做三次深呼吸，再问'此事会伤害我的'真心'吗？"
                        }
                    ],
                    "道德经": DAODEJING_81_CHAPTERS
                })
            };
        });
        shenxueDB = await response.json();
        console.log('圣学数据库加载成功，包含道德经81章数据');
    } catch (e) {
        console.warn('圣学数据库加载失败:', e);
        shenxueDB = { "心传": [], "心践论": [], "道德经": DAODEJING_81_CHAPTERS };
    }
    
    // 初始化章节搜索结果
    initChapterSearch();
});

/**
 * 初始化章节搜索框
 */
function initChapterSearch() {
    const chapterResults = document.getElementById('chapter_results');
    if (!chapterResults) return;
    
    // 渲染所有章节
    renderChapterResults(DAODEJING_81_CHAPTERS);
}

/**
 * 搜索章节
 */
function searchChapter() {
    const searchInput = document.getElementById('chapter_search');
    const chapterResults = document.getElementById('chapter_results');
    if (!searchInput || !chapterResults) return;
    
    const keyword = searchInput.value.trim().toLowerCase();
    let filteredChapters = DAODEJING_81_CHAPTERS;
    
    if (keyword) {
        filteredChapters = DAODEJING_81_CHAPTERS.filter(chapter => {
            return chapter.title.toLowerCase().includes(keyword) || 
                   chapter.keywords.some(k => k.toLowerCase().includes(keyword)) ||
                   chapter.volume.toLowerCase().includes(keyword);
        });
    }
    
    // 渲染筛选结果
    renderChapterResults(filteredChapters);
    // 显示结果列表
    chapterResults.classList.add('visible');
}

/**
 * 渲染章节搜索结果
 * @param {Array} chapters - 章节数组
 */
function renderChapterResults(chapters) {
    const chapterResults = document.getElementById('chapter_results');
    if (!chapterResults) return;
    
    chapterResults.innerHTML = '';
    
    if (chapters.length === 0) {
        chapterResults.innerHTML = '<div class="search-result-item">未找到匹配章节，请更换关键词</div>';
        return;
    }
    
    chapters.forEach(chapter => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.textContent = chapter.title;
        item.onclick = () => {
            selectChapter(chapter);
        };
        chapterResults.appendChild(item);
    });
}

/**
 * 选择章节
 * @param {Object} chapter - 章节对象
 */
function selectChapter(chapter) {
    const chapterSearch = document.getElementById('chapter_search');
    const chapterHidden = document.getElementById('daodejing_chapter');
    const chapterHint = document.getElementById('chapter-hint');
    const shenjuHint = document.getElementById('shenju-hint');
    const emotionHint = document.getElementById('emotion-hint');
    const zhishenHint = document.getElementById('zhishen-hint');
    const interactionHint = document.getElementById('interaction-hint');
    
    if (!chapterSearch || !chapterHidden) return;
    
    // 填充数据
    chapterSearch.value = chapter.title;
    chapterHidden.value = chapter.title;
    
    // 更新提示信息
    if (chapterHint) {
        chapterHint.textContent = `已选择：${chapter.volume} - ${chapter.title} | 核心修习：${chapter.coreGoal}`;
    }
    
    if (shenjuHint) {
        shenjuHint.textContent = `10分=满分聚度 | 本章核心修习目标：${chapter.coreGoal}`;
    }
    
    if (emotionHint) {
        emotionHint.textContent = `10分=满分稳定 | 本章情志调和重点：${chapter.emotionFocus}`;
    }
    
    if (zhishenHint) {
        zhishenHint.textContent = `支持小数点（例：15.5） | 本章重点字段：${chapter.keyField}`;
        // 标记重点字段
        const zhishenInput = document.getElementById('wuwei_zhishen_time');
        const interactionInput = document.getElementById('interaction_value');
        if (chapter.keyField === "治神时长" && zhishenInput) {
            zhishenInput.style.borderColor = "#2E7D32";
        } else if (chapter.keyField === "互动满意度" && interactionInput) {
            interactionInput.style.borderColor = "#2E7D32";
        }
    }
    
    if (interactionHint) {
        interactionHint.textContent = `10分=满分满意 | 本章对应治世篇-人际践行效果`;
    }
    
    // 隐藏结果列表
    document.getElementById('chapter_results').classList.remove('visible');
    
    // 更新模块4完成状态
    updateModuleCompleteStatus(4, true);
}

/**
 * 获取智能辅导建议
 * @param {string} question - 用户问题/场景描述
 * @param {object} userData - 用户数据
 * @returns {array} 匹配的指导建议
 */
function getGuidance(question, userData = {}) {
    if (!shenxueDB || !question || Object.keys(shenxueDB).length === 0) {
        return [{原文: '数据库加载完成或无匹配内容', 建议: '请尝试输入具体场景（如"工作冲突""情绪波动"）获取指导'}];
    }
    
    // 提取关键词
    const keywords = question.match(/[\u4e00-\u9fa5]+/g) || [];
    let results = [];
    
    // 遍历数据库，计算匹配度
    Object.keys(shenxueDB).forEach(bookName => {
        shenxueDB[bookName].forEach(item => {
            let matchScore = 0;
            
            // 处理道德经章节数据
            if (bookName === "道德经" && item.keywords) {
                matchScore = item.keywords.filter(k => 
                    keywords.some(q => q.includes(k) || k.includes(q))
                ).length;
            } else if (item.keywords) {
                // 处理心传、心践论数据
                matchScore = item.keywords.filter(k => 
                    keywords.some(q => q.includes(k) || k.includes(q))
                ).length;
            }
            
            if (matchScore > 0) {
                // 个性化建议模板填充
                let advice = item.指导模板 || item.coreGoal || "请践行本章核心修习目标";
                advice = advice.replace(/%s/g, userData.心传能量 || userData.心传场景 || '不适');
                advice = advice.replace(/%d/g, userData.心传格除次数 || 0);
                
                results.push({
                    书名: bookName,
                    章节: item.章节 || item.ten || item.title || '未知章节',
                    原文: item.原文 || item.coreGoal,
                    应用场景: item.应用场景 || item.volume,
                    建议: advice,
                    匹配度: matchScore
                });
            }
        });
    });
    
    // 按匹配度排序，返回前3条
    return results.length > 0 
        ? results.sort((a, b) => b.匹配度 - a.匹配度).slice(0, 3)
        : [{原文: '暂无匹配原文', 建议: '请尝试使用关键词：工作冲突、家庭关系、情绪波动、HRV低、妄念等'}];
}