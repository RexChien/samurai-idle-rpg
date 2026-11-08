export interface TalentNode {
  id: string;
  name: string;
  maxRank: number;
  desc: string;
  statKey: string;
  valuePerRank: number;
  unit: string;
}

export interface SamuraiClass {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  themeColor: string;
  desc: string;
  baseStats: {
    atk: number;
    def: number;
    hp: number;
    critRate: number;
    critDmg: number;
    evasion: number;
  };
  trees: {
    name: string;
    talents: TalentNode[];
  }[];
}

export const SAMURAI_CLASSES: Record<string, SamuraiClass> = {
  kensei: {
    id: 'kensei',
    name: '劍聖',
    subtitle: '一擊必殺・至高劍道',
    icon: '⚔️',
    themeColor: '#f59e0b',
    desc: '研習柳生新陰流與二天一流的宗師，追求揮刀極致的殺傷力與暴擊。刀光如電，破敵無形。',
    baseStats: { atk: 35, def: 18, hp: 160, critRate: 15, critDmg: 180, evasion: 8 },
    trees: [
      {
        name: '【心眼】破甲修煉',
        talents: [
          { id: 'k_t1', name: '剛刃修習', maxRank: 10, desc: '提升基礎攻擊力', statKey: 'atk', valuePerRank: 8, unit: '點' },
          { id: 'k_t2', name: '死線洞察', maxRank: 10, desc: '提升暴擊率', statKey: 'critRate', valuePerRank: 1.5, unit: '%' },
          { id: 'k_t3', name: '無想拔刀', maxRank: 10, desc: '提升暴擊傷害', statKey: 'critDmg', valuePerRank: 5, unit: '%' }
        ]
      }
    ]
  },
  shadowblade: {
    id: 'shadowblade',
    name: '影刃',
    subtitle: '伊賀秘傳・疾風暗殺',
    icon: '🥷',
    themeColor: '#38bdf8',
    desc: '精通甲賀與伊賀秘術的鬼魅武士，以極速連擊與虛無身法著稱。如影隨形，刃不沾血。',
    baseStats: { atk: 30, def: 14, hp: 140, critRate: 20, critDmg: 160, evasion: 22 },
    trees: [
      {
        name: '【殘影】身法修煉',
        talents: [
          { id: 's_t1', name: '輕身步法', maxRank: 10, desc: '提升閃避率', statKey: 'evasion', valuePerRank: 1.5, unit: '%' },
          { id: 's_t2', name: '淬毒疾刃', maxRank: 10, desc: '提升基礎攻擊力', statKey: 'atk', valuePerRank: 7, unit: '點' },
          { id: 's_t3', name: '絕影連斬', maxRank: 10, desc: '提升暴擊傷害', statKey: 'critDmg', valuePerRank: 4.5, unit: '%' }
        ]
      }
    ]
  },
  guardian: {
    id: 'guardian',
    name: '御前侍衛',
    subtitle: '金剛鐵壁・不動明王',
    icon: '🛡️',
    themeColor: '#10b981',
    desc: '幕府旗本大將之護衛，身披百鍛重甲，宛如人間移動壁壘。不動如山，固若金湯。',
    baseStats: { atk: 24, def: 32, hp: 260, critRate: 8, critDmg: 150, evasion: 5 },
    trees: [
      {
        name: '【鐵壁】金剛修煉',
        talents: [
          { id: 'g_t1', name: '重甲剛體', maxRank: 10, desc: '提升基礎防禦力', statKey: 'def', valuePerRank: 6, unit: '點' },
          { id: 'g_t2', name: '生生不息', maxRank: 10, desc: '提升最大生命值', statKey: 'hp', valuePerRank: 35, unit: '點' },
          { id: 'g_t3', name: '震懾反擊', maxRank: 10, desc: '提升反彈荊棘傷害', statKey: 'thorns', valuePerRank: 8, unit: '點' }
        ]
      }
    ]
  },
  spellblade: {
    id: 'spellblade',
    name: '陰陽劍士',
    subtitle: '破邪五行・式神同契',
    icon: '☯️',
    themeColor: '#c084fc',
    desc: '融匯出雲古神道與五行術數的靈能劍客，刀刃附著陰陽破魔符咒，斬破一切常世妖煞。',
    baseStats: { atk: 28, def: 20, hp: 180, critRate: 12, critDmg: 160, evasion: 10 },
    trees: [
      {
        name: '【式神】五行修煉',
        talents: [
          { id: 'sp_t1', name: '式神同契', maxRank: 10, desc: '提升基礎攻擊力與防禦', statKey: 'atk', valuePerRank: 6, unit: '點' },
          { id: 'sp_t2', name: '靈符護體', maxRank: 10, desc: '提升基礎生命值', statKey: 'hp', valuePerRank: 25, unit: '點' },
          { id: 'sp_t3', name: '真言破邪', maxRank: 10, desc: '提升暴擊率', statKey: 'critRate', valuePerRank: 1.2, unit: '%' }
        ]
      }
    ]
  }
};
