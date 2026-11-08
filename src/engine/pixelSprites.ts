/**
 * 3頭身像素風（Chibi 3-Head-Tall Pixel Art）角色與 NPC 繪製引擎
 *
 * 比例規範：16 寬 x 24 高像素網格
 * - 第 0~7 列（8 列，佔 1/3）：大頭、髮髻/斗笠/鬼角、五官眼神
 * - 第 8~15 列（8 列，佔 1/3）：羽織/和服/鎧甲軀幹、雙手與配刀
 * - 第 16~23 列（8 列，佔 1/3）：袴褲與足袋草鞋（支援行走幀左右腳交替）
 */

export interface ChibiSpriteSpec {
  id: string;
  name: string;
  palette: Record<string, string>;
  /** 24 rows, each 16 chars */
  grid: string[];
}

const COMMON_PALETTE: Record<string, string> = {
  K: '#18181b', // 深黑輪廓/瞳孔
  H: '#27272a', // 黑髮
  W: '#f8fafc', // 純白/白髮/眼白
  S: '#fde68a', // 肌膚暖色
  P: '#fca5a5', // 臉頰腮紅
  G: '#fbbf24', // 金色飾品/刀鍔
  I: '#cbd5e1', // 刀刃銀白
  N: '#78350f', // 木柄/木屐深棕
  D: '#0f172a'  // 深色袴褲
};

function makePalette(overrides: Record<string, string>): Record<string, string> {
  return { ...COMMON_PALETTE, ...overrides };
}

/**
 * 通用 3頭身武士/NPC 24x16 模板建構器
 */
export const SPRITE_SPECS: Record<string, ChibiSpriteSpec> = {
  // 1. 劍豪羽織 (samurai_general)
  samurai_general: {
    id: 'samurai_general',
    name: '劍豪羽織',
    palette: makePalette({
      A: '#1e3a8a', // 靛藍羽織
      B: '#3b82f6', // 淺藍內襯
      R: '#dc2626'  // 朱紅刀鞘
    }),
    grid: [
      '......HHHH......', // 0: 頂髻 (Chonmage)
      '.....HHHHHH.....', // 1
      '...HHHHHHHHHH...', // 2: 額髮
      '..HHHSSSSSSHHH..', // 3: 額頭
      '..HHSSSSSSSSHH..', // 4: 眉間
      '..HHSKSSSSKSHH..', // 5: 雙眼
      '..HHSPSSSSPSHH..', // 6: 臉頰腮紅
      '...SSSSSSSSSS...', // 7: 下巴 (Head = 8 rows)
      '....AABBBBAA....', // 8: 領口
      '...AAABBBBAAA...', // 9: 肩膀羽織
      '..AAAABBBBAAAA..', // 10: 胸口
      '..AAABGGGG.AAA..', // 11: 腰帶與金刀鍔
      '..SSAAAGGGAAASS.', // 12: 雙手握持
      '..SSAAABBBAAASS.', // 13: 羽織下擺
      '.RR.AAABBBAAA...', // 14: 刀鞘探出
      'RR..AAABBBAAA...', // 15: 軀幹底 (Body = 8 rows)
      '....DDDDDDDD....', // 16: 袴褲上部
      '...DDDDDDDDDD...', // 17
      '...DDDD..DDDD...', // 18: 分腿
      '...DDDD..DDDD...', // 19
      '...DDDD..DDDD...', // 20
      '....WW....WW....', // 21: 白足袋
      '...NNNN..NNNN...', // 22: 草鞋
      '................'  // 23 (Legs = 8 rows)
    ]
  },

  // 2. 般若狂戰 (samurai_oni)
  samurai_oni: {
    id: 'samurai_oni',
    name: '般若武者',
    palette: makePalette({
      A: '#991b1b', // 赤紅戰袍
      B: '#f59e0b', // 金紋
      R: '#fef08a'  // 雙角象牙色
    }),
    grid: [
      '..RR..WWWW..RR..', // 0: 雙鬼角與白狂髮
      '..RRRWWWWWWWRR..', // 1
      '...WWWWWWWWWW...', // 2
      '..WWWSSSSSSWWW..', // 3
      '..WWSSSSSSSSWW..', // 4
      '..WWSKSSSSKSWW..', // 5
      '..WWSPSSSSPSWW..', // 6
      '...SSSSSSSSSS...', // 7
      '....AABBBBAA....', // 8
      '...AAABBBBAAA...', // 9
      '..AAAABBBBAAAA..', // 10
      '..AAABGGGG.AAA..', // 11
      '..SSAAAGGGAAASS.', // 12
      '..SSAAABBBAAASS.', // 13
      '.II.AAABBBAAA...', // 14
      'II..AAABBBAAA...', // 15
      '....DDDDDDDD....', // 16
      '...DDDDDDDDDD...', // 17
      '...DDDD..DDDD...', // 18
      '...DDDD..DDDD...', // 19
      '...DDDD..DDDD...', // 20
      '....WW....WW....', // 21
      '...NNNN..NNNN...', // 22
      '................'  // 23
    ]
  },

  // 3. 旗本武者 (samurai_lord)
  samurai_lord: {
    id: 'samurai_lord',
    name: '旗本大將',
    palette: makePalette({
      A: '#065f46', // 翠綠重甲
      B: '#d97706', // 黃金兜飾
      R: '#dc2626'
    }),
    grid: [
      '....BB....BB....', // 0: 鍬形黃金兜角
      '...BBBB..BBBB...', // 1
      '..BBBBBBBBBBBB..', // 2: 兜鉢
      '..HHHSSSSSSHHH..', // 3
      '..HHSSSSSSSSHH..', // 4
      '..HHSKSSSSKSHH..', // 5
      '..HHSSSSSSSSHH..', // 6
      '...SSSSSSSSSS...', // 7
      '....AABBBBAA....', // 8
      '..AAAABBBBAAAA..', // 9: 大袖肩甲
      '..AAAABBBBAAAA..', // 10
      '..AAABGGGG.AAA..', // 11
      '..SSAAAGGGAAASS.', // 12
      '..SSAAABBBAAASS.', // 13
      '.RR.AAABBBAAA...', // 14
      'RR..AAABBBAAA...', // 15
      '....DDDDDDDD....', // 16
      '...DDDDDDDDDD...', // 17
      '...DDDD..DDDD...', // 18
      '...DDDD..DDDD...', // 19
      '...DDDD..DDDD...', // 20
      '....WW....WW....', // 21
      '...NNNN..NNNN...', // 22
      '................'  // 23
    ]
  },

  // 4. 破邪巫女 / 神無月楓 (samurai_female / npc_kaede)
  samurai_female: {
    id: 'samurai_female',
    name: '破邪巫女',
    palette: makePalette({
      A: '#ffffff', // 純白千早白衣
      B: '#e11d48', // 緋紅巫女袴與髮飾
      R: '#f43f5e'
    }),
    grid: [
      '....BBHHHHBB....', // 0: 紅蝶髮飾
      '...HHHHHHHHHH...', // 1
      '..HHHHHHHHHHHH..', // 2
      '..HHHSSSSSSHHH..', // 3
      '..HHSSSSSSSSHH..', // 4
      '..HHSKSSSSKSHH..', // 5
      '..HHSPSSSSPSHH..', // 6
      '..HHSSSSSSSSHH..', // 7: 姬髮式垂髮
      '....AABBBBAA....', // 8: 紅領白衣
      '...AAAAAAAAAA...', // 9
      '..AAAAAAAAAAAA..', // 10: 寬大白振袖
      '..AAABBBBBBBAA..', // 11: 緋袴腰帶
      '..SSBBBBBBBBSS..', // 12: 手持神樂鈴
      '..SSBBBBBBBBSS.G', // 13: 金色神樂鈴
      '....BBBBBBBB..GG', // 14
      '...BBBBBBBBBB...', // 15
      '...BBBBBBBBBB...', // 16: 緋紅長袴
      '...BBBBBBBBBB...', // 17
      '...BBBB..BBBB...', // 18
      '...BBBB..BBBB...', // 19
      '...BBBB..BBBB...', // 20
      '....WW....WW....', // 21
      '...BBBB..BBBB...', // 22: 紅緒草履
      '................'  // 23
    ]
  },

  // 5. 師尊・柳生嚴信 (npc_yagyu)
  npc_yagyu: {
    id: 'npc_yagyu',
    name: '柳生嚴信',
    palette: makePalette({
      H: '#cbd5e1', // 宗師銀白髮髻
      A: '#312e81', // 深紫宗師道服
      B: '#fbbf24', // 金紋家徽
      R: '#78350f'  // 隨身木刀
    }),
    grid: [
      '......HHHH......', // 0
      '.....HHHHHH.....', // 1
      '...HHHHHHHHHH...', // 2
      '..HHHSSSSSSHHH..', // 3
      '..HHWSSSSSSWHH..', // 4: 銀白長眉
      '..HHSKSSSSKSHH..', // 5
      '..HHSSSSSSSSHH..', // 6
      '...SSWWWWWWSS...', // 7: 宗師白鬍鬚
      '....AABBBBAA....', // 8
      '...AAABBBBAAA...', // 9
      '..AAAABBBBAAAA..', // 10
      '..AAABGGGG.AAA..', // 11
      '..SSAAAGGGAAASS.', // 12
      '..SSAAABBBAAASS.', // 13
      '.RR.AAABBBAAA...', // 14
      'RR..AAABBBAAA...', // 15
      '....DDDDDDDD....', // 16
      '...DDDDDDDDDD...', // 17
      '...DDDD..DDDD...', // 18
      '...DDDD..DDDD...', // 19
      '...DDDD..DDDD...', // 20
      '....WW....WW....', // 21
      '...NNNN..NNNN...', // 22
      '................'  // 23
    ]
  },

  // 6. 名匠・國友鐵齋 (npc_tessai)
  npc_tessai: {
    id: 'npc_tessai',
    name: '國友鐵齋',
    palette: makePalette({
      A: '#9a3412', // 鍛冶屋棕紅圍裙
      B: '#f97316', // 橘紅火紋頭巾
      R: '#64748b'  // 大鐵鎚
    }),
    grid: [
      '....BBBBBBBB....', // 0: 扭結鉢卷頭巾
      '...BBBBBBBBBB...', // 1
      '..HHHHHHHHHHHH..', // 2
      '..HHHSSSSSSHHH..', // 3
      '..HHSSSSSSSSHH..', // 4
      '..HHSKSSSSKSHH..', // 5
      '..HHSSSSSSSSHH..', // 6
      '...SSHHHHHHSS...', // 7: 絡腮鬍
      '....SSSSSSSS....', // 8: 壯碩胸膛
      '...SAAASSSAAAS..', // 9: 鍛造背心
      '..SSAAAAAAAASS..', // 10
      '..SSAAAGGGGASS..', // 11
      '..SSAAAAAAAA.RRR', // 12: 手舉大鍛造鎚
      '....AAAAAAAA.RRR', // 13
      '....AAAAAAAA..N.', // 14
      '....AAAAAAAA..N.', // 15
      '....DDDDDDDD....', // 16
      '...DDDDDDDDDD...', // 17
      '...DDDD..DDDD...', // 18
      '...DDDD..DDDD...', // 19
      '...DDDD..DDDD...', // 20
      '....WW....WW....', // 21
      '...NNNN..NNNN...', // 22
      '................'  // 23
    ]
  },

  // 7. 忍者・影縫疾風 (npc_hayate)
  npc_hayate: {
    id: 'npc_hayate',
    name: '影縫疾風',
    palette: makePalette({
      A: '#0f172a', // 夜行黑衣
      B: '#0284c7', // 疾風藍圍巾
      R: '#e11d48'
    }),
    grid: [
      '....AAAAAAAA....', // 0: 忍者頭巾
      '...AAAAAAAAAA...', // 1
      '..AAAAAAAAAAA...', // 2
      '..AAASSSSSSAAA..', // 3: 只露雙眼
      '..AAASSSSSSAAA..', // 4
      '..AAASKSSKSAAA..', // 5: 銳利眼神
      '..AAAAAAAAAAAA..', // 6: 面罩遮口
      '...BBBBBBBBBB...', // 7: 飄揚藍圍巾
      '....AABBBBAA..BB', // 8: 圍巾尾端
      '...AAAAAAAAAA..B', // 9
      '..AAAAAAAAAAAA..', // 10
      '..AAABGGGG.AAA..', // 11
      '..SSAAAAAAAAASS.', // 12
      '..SSAAAAAAAAASS.', // 13
      '....AAAAAAAA....', // 14
      '....AAAAAAAA....', // 15
      '....DDDDDDDD....', // 16
      '...DDDDDDDDDD...', // 17
      '...DDDD..DDDD...', // 18
      '...DDDD..DDDD...', // 19
      '...DDDD..DDDD...', // 20
      '....AA....AA....', // 21
      '...NNNN..NNNN...', // 22
      '................'  // 23
    ]
  },

  // 8. 茶屋看板娘・小町 (npc_town_girl)
  npc_town_girl: {
    id: 'npc_town_girl',
    name: '茶屋小町',
    palette: makePalette({
      A: '#f472b6', // 櫻花粉和服
      B: '#fde047', // 鵝黃腰帶
      R: '#86efac'  // 抹茶綠糰子串
    }),
    grid: [
      '.....HHHHHH.....', // 0: 丸子頭
      '....HHHHHHHH....', // 1
      '...HHHHHHHHHH...', // 2
      '..HHHSSSSSSHHH..', // 3
      '..HHSSSSSSSSHH..', // 4
      '..HHSKSSSSKSHH..', // 5
      '..HHSPSSSSPSHH..', // 6
      '...SSSSSSSSSS...', // 7
      '....AAAAAAAA....', // 8
      '...AAAAAAAAAA...', // 9
      '..AAAAAAAAAAAA..', // 10
      '..AAABBBBBBBAA..', // 11
      '..SSBBBBBBBBSS.P', // 12: 手拿三色糰子 (粉/白/綠)
      '..SSAAAAAAAASS.W', // 13
      '....AAAAAAAA...R', // 14
      '....AAAAAAAA...N', // 15
      '....AAAAAAAA....', // 16
      '....AAAAAAAA....', // 17
      '....AAA..AAA....', // 18
      '....AAA..AAA....', // 19
      '....AAA..AAA....', // 20
      '....WW....WW....', // 21
      '...NNNN..NNNN...', // 22
      '................'  // 23
    ]
  },

  // 9. 妖怪：貪吃赤面鬼 (yokai_oni)
  yokai_oni: {
    id: 'yokai_oni',
    name: '赤面小鬼',
    palette: makePalette({
      S: '#ef4444', // 赤紅鬼皮膚
      A: '#facc15', // 虎皮紋短褲
      B: '#18181b', // 虎斑黑紋
      R: '#fef08a'  // 小尖角
    }),
    grid: [
      '...R..HHHH..R...', // 0: 呆萌雙角
      '..RRHHHHHHHHHRR.', // 1
      '..HHHHHHHHHHHH..', // 2
      '..HHSSSSSSSSHH..', // 3
      '..HSSSSSSSSSSSH.', // 4
      '..HSSKSSSSKSSSH.', // 5: 圓滾滾大眼
      '..HSSWSSSSWSSSH.', // 6: 小虎牙
      '...SSSSSSSSSS...', // 7
      '....SSSSSSSS....', // 8: 圓肚皮
      '...SSSSSSSSSS...', // 9
      '..SSSSSSSSSSSS..', // 10
      '..SSSSGGGGSSSS..', // 11
      '..SSSSSSSSSSSS.N', // 12: 握著狼牙木棒
      '...SSSSSSSSSS.NN', // 13
      '....AAAAAAA...NN', // 14
      '...AAABBBAAA..NN', // 15: 虎皮短褲
      '...AABBBBBAA....', // 16
      '...AAABBBAAA....', // 17
      '...SSSS..SSSS...', // 18
      '...SSSS..SSSS...', // 19
      '...SSSS..SSSS...', // 20
      '...SSSS..SSSS...', // 21
      '...NNNN..NNNN...', // 22
      '................'  // 23
    ]
  },

  // 10. 妖怪：鞍馬小天狗 (yokai_tengu)
  yokai_tengu: {
    id: 'yokai_tengu',
    name: '鞍馬天狗',
    palette: makePalette({
      S: '#f87171', // 紅臉天狗
      A: '#fb923c', // 山伏橘衣
      B: '#f8fafc', // 白結袈裟
      R: '#22c55e'  // 天狗羽團扇
    }),
    grid: [
      '......KKKK......', // 0: 頭襟小帽 (Tokin)
      '....WWWWWWWW....', // 1: 白髮
      '...WWWWWWWWWW...', // 2
      '..WWWSSSSSSWWW..', // 3
      '..WWSSSSSSSSWW..', // 4
      '..WWSKSSSSKSWW..', // 5
      '..WWSSSSSSSSWW..', // 6
      '...WWWWWWWWWW...', // 7
      '.WW.AABBBBAA.WW.', // 8: 背後白羽翼
      'WWW.AAABBBBAAWWW', // 9
      'WWW.AAAAAAAA.WWW', // 10
      '.WW.AABGGGAA.WW.', // 11
      '....SSAAAAAASS.R', // 12: 綠葉團扇
      '....SSAAAAAASSRR', // 13
      '.....AAAAAAA..R.', // 14
      '.....AAAAAAA....', // 15
      '....DDDDDDDD....', // 16
      '...DDDDDDDDDD...', // 17
      '...DDDD..DDDD...', // 18
      '...DDDD..DDDD...', // 19
      '....WW....WW....', // 20
      '....NN....NN....', // 21: 一本齒高木屐
      '....NN....NN....', // 22
      '................'  // 23
    ]
  },

  // 11. 妖怪：提燈小妖 / 白狐妖 (yokai_kitsune)
  yokai_kitsune: {
    id: 'yokai_kitsune',
    name: '稻荷白狐',
    palette: makePalette({
      S: '#f8fafc', // 白毛狐臉
      A: '#ef4444', // 紅耳紋與紅圍兜
      B: '#f59e0b', // 金鈴鐺
      R: '#38bdf8'  // 狐火藍光
    }),
    grid: [
      '..AA........AA..', // 0: 狐狸尖耳
      '.AAWW......WWAA.', // 1
      '.AWWWWWWWWWWWWA.', // 2
      '..WWWWWWWWWWWW..', // 3
      '..WWWWWWWWWWWW..', // 4
      '..WWWKWWWWKWWW..', // 5
      '..WWWPWWWWPWWW..', // 6
      '....WWWWKWWW....', // 7: 小黑鼻頭
      '....AAAAAAA.....', // 8: 紅色祈福圍兜
      '...AAABBBAAA....', // 9: 大金鈴鐺
      '..WWWWBBBBWWWW.R', // 10: 身旁漂浮藍狐火
      '..WWWWWWWWWWWWWR', // 11
      '..WWWWWWWWWWWW..', // 12
      '...WWWWWWWWWW.WW', // 13: 蓬鬆大狐尾
      '....AAAAAAAA.WWW', // 14
      '....AAAAAAAA.WWW', // 15
      '....WWWWWWWW.WW.', // 16
      '....WWWWWWWW....', // 17
      '....WWW..WWW....', // 18
      '....WWW..WWW....', // 19
      '....WWW..WWW....', // 20
      '....AAA..AAA....', // 21
      '....NNN..NNN....', // 22
      '................'  // 23
    ]
  }
};

/**
 * 將傳入的 avatar 或名稱對應到 3頭身像素角色 ID
 */
export function resolveSpriteId(key: string): string {
  if (!key) return 'samurai_general';
  if (SPRITE_SPECS[key]) return key;
  if (key.includes('楓') || key.includes('巫女') || key === '🌸') return 'samurai_female';
  if (key.includes('嚴信') || key.includes('柳生') || key.includes('宗旦') || key === '⚔️' || key === '♟️') return 'npc_yagyu';
  if (key.includes('鐵齋') || key.includes('小鐵') || key === '🔨') return 'npc_tessai';
  if (key.includes('疾風') || key.includes('彌七') || key.includes('服部') || key === '🥷' || key === '🏃') return 'npc_hayate';
  if (key.includes('小町') || key.includes('阿春') || key.includes('糰子') || key === '🍡' || key === '🍵' || key === '🐱') return 'npc_town_girl';
  if (key.includes('天狗') || key === '👺') return 'yokai_tengu';
  if (key.includes('狐') || key.includes('提燈') || key.includes('靈') || key === '🦊' || key === '🔥' || key === '🦇') return 'yokai_kitsune';
  if (key.includes('鬼') || key.includes('大王') || key.includes('蛟') || key === '👹' || key === '👑' || key === '💀') return 'yokai_oni';
  return 'samurai_general';
}

/**
 * 在 Canvas 2D 上直接繪製 3頭身像素小人（支援面向翻轉與行走步伐動畫）
 */
export function drawChibiSprite(
  ctx: CanvasRenderingContext2D,
  spriteKey: string,
  centerX: number,
  bottomY: number,
  scale = 2,
  facing: 'down' | 'up' | 'left' | 'right' = 'down',
  walkFrame = 0
) {
  const id = resolveSpriteId(spriteKey);
  const spec = SPRITE_SPECS[id] || SPRITE_SPECS.samurai_general;
  const cols = 16;
  const rows = 24;
  const spriteW = cols * scale;
  const spriteH = rows * scale;

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  // 行走上下輕微彈跳
  const isStepping = walkFrame > 0.1;
  const stepPhase = Math.floor(walkFrame) % 2;
  const bobY = isStepping ? (stepPhase === 0 ? -scale : 0) : 0;

  ctx.translate(Math.round(centerX), Math.round(bottomY + bobY));
  if (facing === 'left') {
    ctx.scale(-1, 1);
  }

  const startX = -Math.round(spriteW / 2);
  const startY = -spriteH;

  // 第一層：繪製武士道列傳風格的深色像素外框 (1px Pixel Outline)，讓角色在全彩地圖上立體鮮明
  ctx.fillStyle = '#090d16';
  for (let r = 0; r < rows; r++) {
    const rowStr = spec.grid[r];
    if (!rowStr) continue;
    for (let c = 0; c < cols; c++) {
      const ch = rowStr[c];
      if (!ch || ch === '.') continue;

      let drawR = r;
      if (isStepping && r >= 19 && r <= 22) {
        const isLeftLeg = c < 8;
        if ((stepPhase === 0 && isLeftLeg) || (stepPhase === 1 && !isLeftLeg)) {
          drawR = r - 1;
        }
      }
      const px = startX + c * scale;
      const py = startY + drawR * scale;
      ctx.fillRect(px - scale, py, scale, scale);
      ctx.fillRect(px + scale, py, scale, scale);
      ctx.fillRect(px, py - scale, scale, scale);
      ctx.fillRect(px, py + scale, scale, scale);
    }
  }

  // 第二層：繪製全彩 3頭身像素角色本體
  for (let r = 0; r < rows; r++) {
    const rowStr = spec.grid[r];
    if (!rowStr) continue;
    for (let c = 0; c < cols; c++) {
      const ch = rowStr[c];
      if (!ch || ch === '.') continue;

      let color = spec.palette[ch];
      if (!color) continue;

      // 背面朝上時，第 3~7 列臉部改畫後腦勺髮色
      if (facing === 'up' && r >= 3 && r <= 7 && (ch === 'S' || ch === 'K' || ch === 'P')) {
        color = spec.palette['H'] || '#27272a';
      }

      // 行走時第 19~22 列左右腳交替抬起 1 格
      let drawR = r;
      if (isStepping && r >= 19 && r <= 22) {
        const isLeftLeg = c < 8;
        if ((stepPhase === 0 && isLeftLeg) || (stepPhase === 1 && !isLeftLeg)) {
          drawR = r - 1;
        }
      }

      ctx.fillStyle = color;
      ctx.fillRect(startX + c * scale, startY + drawR * scale, scale, scale);
    }
  }

  ctx.restore();
}

const dataUrlCache: Record<string, string> = {};

/**
 * 產生 3頭身像素角色 PNG Data URL，供 UI 頭像與對話框使用（相容 SSR / Node 測試環境）
 */
export function getChibiDataUrl(spriteKey: string, scale = 3): string {
  const id = resolveSpriteId(spriteKey);
  const cacheKey = `${id}_${scale}`;
  if (dataUrlCache[cacheKey]) return dataUrlCache[cacheKey];

  if (typeof document === 'undefined') {
    return '';
  }

  const canvas = document.createElement('canvas');
  canvas.width = 16 * scale;
  canvas.height = 24 * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  drawChibiSprite(ctx, id, canvas.width / 2, canvas.height, scale, 'down', 0);
  const url = canvas.toDataURL('image/png');
  dataUrlCache[cacheKey] = url;
  return url;
}
