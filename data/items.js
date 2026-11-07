// 日本武士時代道具與裝備庫 (Items & Equipment Database)

window.ITEMS_DATA = {
  // --- 一、鍛造研磨素材 (Forging & Sharpening Materials) ---
  materials: [
    {
      id: "mat_tamahagane",
      name: "玉鋼",
      romaji: "Tamahagane",
      type: "forge",
      icon: "💎",
      rarity: 2,
      price: 50,
      desc: "日式傳統踏鞴製鐵法（Tatara）煉出的純淨高碳鋼，日本刀鍛造之命脈。用於鍛造新名刀與刀劍精煉。"
    },
    {
      id: "mat_whetstone_rough",
      name: "荒砥石",
      romaji: "Arato",
      type: "sharpen",
      icon: "🪨",
      rarity: 1,
      sharpenBonus: 5,
      price: 20,
      desc: "顆粒粗糙的基礎磨刀石，用於修整受損崩缺的刀刃，提升名刀基礎鋒利度（攻擊力+5）。"
    },
    {
      id: "mat_whetstone_mid",
      name: "中砥石",
      romaji: "Nakato",
      type: "sharpen",
      icon: "🧱",
      rarity: 2,
      sharpenBonus: 15,
      price: 80,
      desc: "質地細緻的研磨石，抹去荒砥粗紋，使刀刃形成平滑的肉置與刃線（攻擊力+15）。"
    },
    {
      id: "mat_whetstone_fine",
      name: "仕上砥石",
      romaji: "Shiageto",
      type: "sharpen",
      icon: "✨",
      rarity: 4,
      sharpenBonus: 40,
      price: 300,
      desc: "天然京都水石，研磨師父最高機密。磨出青幽如鏡的刀身與寒光地肌（攻擊力+40，暴擊率+1%）。"
    },
    {
      id: "mat_meteorite",
      name: "天外隕鐵",
      romaji: "Meteorite Steel",
      type: "forge",
      icon: "☄️",
      rarity: 5,
      price: 1000,
      desc: "夜空墜落的星辰殘鐵，蘊含奇異天磁，為鍛造「大業物」與「神話刀劍」不可或缺的至寶。"
    }
  ],

  // --- 二、戰國防具與衣裝 (Armors & Helmets) ---
  armors: [
    {
      id: "armor_01",
      name: "粗布陣羽織",
      romaji: "Jinbaori",
      slot: "body",
      hp: 120,
      def: 8,
      rarity: 1,
      color: "#a8a8a8",
      desc: "浪人諸國巡禮武者修行的麻布外衣，透氣俐落，略微防風避箭。"
    },
    {
      id: "armor_02",
      name: "鐵絲鎖子甲",
      romaji: "Kusari Katabira",
      slot: "body",
      hp: 300,
      def: 25,
      rarity: 2,
      color: "#4ade80",
      desc: "內襯細密鐵環鎖甲，隱匿於外袍之下，能有效抵擋暗器與刀劈突刺。"
    },
    {
      id: "armor_03",
      name: "黑漆塗腹卷",
      romaji: "Kuro-urushi Haramaki",
      slot: "body",
      hp: 680,
      def: 55,
      rarity: 3,
      color: "#38bdf8",
      desc: "以黑生漆浸潤硬皮與鐵札片緊密編織，貼合軀幹，行動靈敏而防禦出眾。"
    },
    {
      id: "armor_04",
      name: "南蠻胴具足",
      romaji: "Nanban Dou Gusoku",
      slot: "body",
      hp: 1450,
      def: 120,
      rarity: 4,
      color: "#c084fc",
      desc: "吸收西洋板甲工藝改良的戰國重甲，中心隆起成脊線，能直接偏轉鐵砲火繩槍彈丸！"
    },
    {
      id: "armor_05",
      name: "赤備武者大鎧",
      romaji: "Akazonae O-yoroi",
      slot: "body",
      hp: 3200,
      def: 240,
      rarity: 5,
      color: "#f59e0b",
      desc: "通體鮮紅塗漆的戰國武田／井伊赤備軍精銳大鎧。穿戴者宛如戰場燃燒之赤鬼，令人望風披靡。"
    }
  ],

  // --- 三、武士兜與面具 (Helmets & Masks) ---
  helmets: [
    {
      id: "helm_01",
      name: "編笠草帽",
      romaji: "Amigasa",
      slot: "head",
      hp: 60,
      def: 5,
      crit: 2,
      rarity: 1,
      color: "#a8a8a8",
      desc: "深覆容顏的竹編斗笠，隱藏浪人身分與眼神殺機。"
    },
    {
      id: "helm_02",
      name: "鬼武者面頰",
      romaji: "Menpo Onimusha",
      slot: "head",
      hp: 200,
      def: 18,
      crit: 4,
      rarity: 2,
      color: "#4ade80",
      desc: "鍛鐵製成的怒容下半面具，兼具喉部防護與威懾敵人的效果。"
    },
    {
      id: "helm_03",
      name: "般若狂面",
      romaji: "Hannya Mask",
      slot: "head",
      hp: 480,
      def: 38,
      crit: 7,
      rarity: 3,
      color: "#38bdf8",
      desc: "刻畫怨恨與怒火的古木雕面具，激發佩戴者心中對勝利的執念，提升會心率。"
    },
    {
      id: "helm_04",
      name: "三日月前立兜",
      romaji: "Mikazuki Kabuto",
      slot: "head",
      hp: 1100,
      def: 80,
      crit: 10,
      rarity: 4,
      color: "#c084fc",
      desc: "黑漆塗鐵兜冠頂立著一面巨大的金色彎月，象徵伊達政宗馳騁奧州之霸氣。"
    },
    {
      id: "helm_05",
      name: "第六天魔王之兜",
      romaji: "Demon King Helm",
      slot: "head",
      hp: 2500,
      def: 160,
      crit: 15,
      rarity: 5,
      color: "#f59e0b",
      desc: "相傳為織田信長所鑄之天魔兜，冠戴雙角，繚繞著焚毀佛門聖地本能寺的霸道炎氣。"
    }
  ],

  // --- 四、神聖飾品與護符 (Accessories & Relics) ---
  accessories: [
    {
      id: "acc_01",
      name: "出雲勝守",
      romaji: "Kachimamori",
      slot: "acc",
      hp: 100,
      atk: 15,
      critDmg: 10,
      rarity: 1,
      color: "#a8a8a8",
      desc: "祈求武運昌隆、刀槍不入的神社刺繡御守。"
    },
    {
      id: "acc_02",
      name: "德川三葉葵印籠",
      romaji: "Aoi Inro",
      slot: "acc",
      hp: 250,
      atk: 40,
      critDmg: 20,
      rarity: 2,
      color: "#4ade80",
      desc: "蒔繪漆器名物，腰間懸掛三葉葵紋，象徵天下大名的非凡威權。"
    },
    {
      id: "acc_03",
      name: "八坂翡翠勾玉",
      romaji: "Jade Magatama",
      slot: "acc",
      hp: 600,
      atk: 90,
      critDmg: 35,
      rarity: 3,
      color: "#38bdf8",
      desc: "胎形靈玉，佩戴於心前能寧心靜氣，提升劍術專注力與暴擊殺傷。"
    },
    {
      id: "acc_04",
      name: "八尺瓊勾玉",
      romaji: "Yasakani no Magatama",
      slot: "acc",
      hp: 1600,
      atk: 220,
      critDmg: 70,
      rarity: 5,
      color: "#f59e0b",
      desc: "日本三神器之一，凝聚萬物神靈之庇佑，大幅提升體力上限與奧義威力。"
    }
  ],

  // --- 五、消耗品與乾糧秘藥 (Consumables) ---
  consumables: [
    {
      id: "item_onigiri",
      name: "梅干飯糰",
      romaji: "Umeboshi Onigiri",
      type: "heal",
      icon: "🍙",
      healPercent: 40,
      price: 30,
      desc: "用竹葉包裹的酸梅越光米飯糰，生津止渴，立即回復 40% 體力。"
    },
    {
      id: "item_hyourougan",
      name: "伊賀兵糧丸",
      romaji: "Hyourougan",
      type: "buff_speed",
      icon: "💊",
      duration: 30,
      buffSpeed: 35,
      price: 80,
      desc: "忍者秘傳攜帶食，以人參、蕎麥、枸杞揉製，服用後 30 秒內身輕如燕，出刀速度提升 35%！"
    },
    {
      id: "item_sake_onigoroshi",
      name: "銘酒「鬼殺し」",
      romaji: "Sake Onigoroshi",
      type: "buff_berserk",
      icon: "🍶",
      duration: 25,
      buffAtk: 50,
      price: 150,
      desc: "辛口烈酒，武士大戰前痛飲入喉，激發豪氣進入【鬼神狂暴】狀態：攻擊力提升 50%，持續 25 秒！"
    },
    {
      id: "item_matcha",
      name: "宇治濃抹茶",
      romaji: "Uji Matcha",
      type: "buff_gold",
      icon: "🍵",
      duration: 60,
      buffGold: 100,
      price: 120,
      desc: "千利休茶道精髓，一期一會。使心靈通透，在接下來 60 秒內擊敵獲得的【金小判】翻倍！"
    }
  ]
};
