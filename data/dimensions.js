// 《無雙劍心：武士之刃》劍境維度系統 (Cascading Sword Dimensions - Antimatter Dimensions style)
// 包含 8 階劍境維度、拔刀神速刻印、境界突破 (Dimension Shift) 與 劍星天河 (Sword Galaxy)

const DIMENSIONS_DATA = {
  // 8 大階層維度定義 (Cascading Tiers: 8 -> 7 -> 6 -> 5 -> 4 -> 3 -> 2 -> 1 -> 劍氣)
  tiers: [
    {
      id: 1,
      key: "dim_1",
      name: "第 1 維度・孤劍揮斬",
      romaji: "1st Stance: Lone Blade",
      desc: "專注於每一次拔刀與揮斬，直接產生源源不絕的【劍氣】。",
      baseCost: 10,
      costMult: 1000,
      produces: "swordQi",
      translations: {
        "zh-TW": { name: "第 1 維度・孤劍揮斬", desc: "專注於每一次拔刀與揮斬，直接產生源源不絕的【劍氣】。" },
        "en": { name: "1st Dimension: Lone Slash", desc: "Master fundamental blade strikes, generating pure Sword Qi." },
        "ja": { name: "第1次元・孤剣の一閃", desc: "基本の一太刀を極め、無尽の【剣気】を生み出す。" }
      }
    },
    {
      id: 2,
      key: "dim_2",
      name: "第 2 維度・道場門弟",
      romaji: "2nd Stance: Dojo Disciples",
      desc: "招募一心求道的門徒，持續修業並產生【第 1 維度・孤劍揮斬】。",
      baseCost: 100,
      costMult: 10000,
      produces: 1,
      translations: {
        "zh-TW": { name: "第 2 維度・道場門弟", desc: "招募一心求道的門徒，持續修業並產生【第 1 維度・孤劍揮斬】。" },
        "en": { name: "2nd Dimension: Dojo Disciples", desc: "Recruit dedicated students to produce the 1st Dimension." },
        "ja": { name: "第2次元・道場門弟", desc: "剣道を志す門弟を募り、【第1次元・孤剣の一閃】を指導・産出する。" }
      }
    },
    {
      id: 3,
      key: "dim_3",
      name: "第 3 維度・師範代",
      romaji: "3rd Stance: Senior Instructors",
      desc: "指派深諳劍術精要的師範代，督導修習並產生【第 2 維度・道場門弟】。",
      baseCost: 10000,
      costMult: 100000,
      produces: 2,
      translations: {
        "zh-TW": { name: "第 3 維度・師範代", desc: "指派深諳劍術精要的師範代，督導修習並產生【第 2 維度・道場門弟】。" },
        "en": { name: "3rd Dimension: Senior Instructors", desc: "Appoint master instructors to produce the 2nd Dimension." },
        "ja": { name: "第3次元・師範代", desc: "奥義に精通した師範代を配置し、【第2次元・道場門弟】を指導・産出する。" }
      }
    },
    {
      id: 4,
      key: "dim_4",
      name: "第 4 維度・流派宗家",
      romaji: "4th Stance: School Grandmasters",
      desc: "立一家之絕學，統領眾家師範，持續產生【第 3 維度・師範代】。",
      baseCost: 1000000,
      costMult: 1000000,
      produces: 3,
      translations: {
        "zh-TW": { name: "第 4 維度・流派宗家", desc: "立一家之絕學，統領眾家師範，持續產生【第 3 維度・師範代】。" },
        "en": { name: "4th Dimension: School Grandmasters", desc: "Found authentic traditions to produce the 3rd Dimension." },
        "ja": { name: "第4次元・流派宗家", desc: "一派の宗家を立て、師範代を統率して【第3次元・師範代】を産出する。" }
      }
    },
    {
      id: 5,
      key: "dim_5",
      name: "第 5 維度・天下劍豪",
      romaji: "5th Stance: Renowned Swordmasters",
      desc: "名震八荒的天下劍豪，啟發各派宗家，產生【第 4 維度・流派宗家】。",
      baseCost: 100000000,
      costMult: 10000000,
      produces: 4,
      translations: {
        "zh-TW": { name: "第 5 維度・天下劍豪", desc: "名震八荒的天下劍豪，啟發各派宗家，產生【第 4 維度・流派宗家】。" },
        "en": { name: "5th Dimension: Renowned Swordmasters", desc: "Legendary masters who inspire Grandmasters, producing the 4th Dimension." },
        "ja": { name: "第5次元・天下の剣豪", desc: "天下に名を轟かす剣豪が宗家を啓発し、【第4次元・流派宗家】を産出する。" }
      }
    },
    {
      id: 6,
      key: "dim_6",
      name: "第 6 維度・無雙劍聖",
      romaji: "6th Stance: Peerless Kensei",
      desc: "參悟劍道至理的無雙劍聖，指引天下劍豪，產生【第 5 維度・天下劍豪】。",
      baseCost: 10000000000,
      costMult: 100000000,
      produces: 5,
      translations: {
        "zh-TW": { name: "第 6 維度・無雙劍聖", desc: "參悟劍道至理的無雙劍聖，指引天下劍豪，產生【第 5 維度・天下劍豪】。" },
        "en": { name: "6th Dimension: Peerless Kensei", desc: "Transcendent sword saints who produce the 5th Dimension." },
        "ja": { name: "第6次元・無双の剣聖", desc: "神域に達した剣聖が天下の剣豪を導き、【第5次元・天下の剣豪】を産出する。" }
      }
    },
    {
      id: 7,
      key: "dim_7",
      name: "第 7 維度・天人一刀",
      romaji: "7th Stance: Celestial One-Blade",
      desc: "人刀一體，劍氣貫穿天河，感召無雙劍聖，產生【第 6 維度・無雙劍聖】。",
      baseCost: 1000000000000,
      costMult: 1000000000,
      produces: 6,
      translations: {
        "zh-TW": { name: "第 7 維度・天人一刀", desc: "人刀一體，劍氣貫穿天河，感召無雙劍聖，產生【第 6 維度・無雙劍聖】。" },
        "en": { name: "7th Dimension: Celestial One-Blade", desc: "Unity of blade and universe, producing the 6th Dimension." },
        "ja": { name: "第7次元・天人一刀", desc: "刀人一体となりて天河を貫き、【第6次元・無双の剣聖】を産出する。" }
      }
    },
    {
      id: 8,
      key: "dim_8",
      name: "第 8 維度・無念無想",
      romaji: "8th Stance: Formless Void",
      desc: "斬破虛空與時間的終極劍境，萬象歸一，持續產生【第 7 維度・天人一刀】。",
      baseCost: 100000000000000,
      costMult: 10000000000,
      produces: 7,
      translations: {
        "zh-TW": { name: "第 8 維度・無念無想", desc: "斬破虛空與時間的終極劍境，萬象歸一，持續產生【第 7 維度・天人一刀】。" },
        "en": { name: "8th Dimension: Formless Void", desc: "The ultimate emptiness transcending time and space, producing the 7th Dimension." },
        "ja": { name: "第8次元・無念無想", desc: "虚空と因果を斬り裂く究極の境地。万象を帰一させ、【第7次元・天人一刀】を産出する。" }
      }
    }
  ],

  // 拔刀神速刻印設定 (Tickspeed settings)
  tickspeed: {
    baseCost: 10,
    costMult: 10,
    baseMultiplier: 1.11
  },

  // 境界飛躍設定 (Dimension Shift / Boost)
  shift: {
    baseReq: 20, // 第 4 維度 20 個起
    costPerShift: 15
  },

  // 劍魂星宿 (Sword Galaxy)
  galaxy: {
    baseReq: 80, // 第 8 維度 80 個起
    multBonus: 0.02 // 每次使神速倍率提升 0.02 (1.11 -> 1.13 -> 1.15...)
  }
};

// 格式化反物質維度風格數值 (Exponential / Scientific Format)
window.formatDimNumber = function(num, decimals = 2) {
  if (num === null || num === undefined || isNaN(num)) return "0";
  if (num === 0) return "0";
  if (num < 0) return "-" + window.formatDimNumber(-num, decimals);
  if (num < 1000000) {
    if (Number.isInteger(num)) return num.toLocaleString();
    return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: decimals });
  }
  const exp = Math.floor(Math.log10(num));
  const mantissa = num / Math.pow(10, exp);
  return mantissa.toFixed(decimals) + "e" + exp;
};

// 取得多國語系維度名稱與說明
window.getDimensionText = function(tierId, lang) {
  lang = lang || (window.getLang ? window.getLang() : "zh-TW");
  const tier = DIMENSIONS_DATA.tiers.find(t => t.id === tierId);
  if (!tier) return { name: `Tier ${tierId}`, desc: "" };
  if (tier.translations && tier.translations[lang]) {
    return tier.translations[lang];
  }
  return { name: tier.name, desc: tier.desc };
};

if (typeof window !== "undefined") {
  window.DIMENSIONS_DATA = DIMENSIONS_DATA;
}
if (typeof global !== "undefined") {
  global.DIMENSIONS_DATA = DIMENSIONS_DATA;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = DIMENSIONS_DATA;
}
