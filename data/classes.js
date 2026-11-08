/**
 * 《武士之刃：無雙斬》四大戰國武士流派與天賦系統 (data/classes.js)
 * 1. 劍聖 (二天一流 / 高暴擊連擊)
 * 2. 鬼武者 (狂戰吸血 / 範圍斬擊)
 * 3. 陰陽劍士 (元素附魔 / 妖術護盾)
 * 4. 守護大名 (重甲反傷 / 不屈鐵壁)
 */
(function() {
  'use strict';

  const SAMURAI_CLASSES = {
    kensei: {
      id: 'kensei',
      name: '劍聖',
      subtitle: '二天一流・神速連斬',
      icon: '⚔️',
      themeColor: '#38bdf8',
      desc: '追求極致劍道巔峰的武道宗師，身姿如疾風殘影，擅長以迅雷不及掩耳的連擊與致命暴擊秒殺敵首。',
      passives: {
        critRate: 10,
        atkSpd: 15,
        damageBonus: 5
      },
      talents: [
        {
          id: 'kensei_crit',
          name: '斬鐵之訣',
          icon: '⚡',
          maxRank: 10,
          desc: '每級提升 2% 暴擊率與 5% 暴擊傷害。',
          getBonus: (rank) => ({ critRate: rank * 2, critDmg: rank * 5 })
        },
        {
          id: 'kensei_dual',
          name: '二天奧義',
          icon: '🌪️',
          maxRank: 10,
          desc: '每級提升 3% 攻擊速度與 2% 雙重打擊機率。',
          getBonus: (rank) => ({ atkSpd: rank * 3, doubleStrike: rank * 2 })
        },
        {
          id: 'kensei_iaido',
          name: '無念居合',
          icon: '🗡️',
          maxRank: 10,
          desc: '每級提升 4% 最終傷害，並使暴擊時有 1% 機率觸發十倍神聖斬殺。',
          getBonus: (rank) => ({ dmgBonus: rank * 4, divineKillRate: rank * 1 })
        }
      ]
    },

    onimusha: {
      id: 'onimusha',
      name: '鬼武者',
      subtitle: '修羅狂戰・幽冥嗜血',
      icon: '👹',
      themeColor: '#ef4444',
      desc: '融合地獄幽冥鬼氣的狂戰狂人，愈戰愈勇，在鮮血與刀芒中汲取敵人的生命精華。',
      passives: {
        atkPct: 15,
        lifeSteal: 5,
        hpPct: 10
      },
      talents: [
        {
          id: 'oni_blood',
          name: '修羅血契',
          icon: '🩸',
          maxRank: 10,
          desc: '每級提升 1.5% 普攻生命吸血與 3% 最大生命。',
          getBonus: (rank) => ({ lifeSteal: rank * 1.5, hpPct: rank * 3 })
        },
        {
          id: 'oni_rend',
          name: '深淵破甲',
          icon: '🪓',
          maxRank: 10,
          desc: '每級提升 15 點無視防禦破甲值，並增加 2% 攻擊力。',
          getBonus: (rank) => ({ armorPen: rank * 15, atkPct: rank * 2 })
        },
        {
          id: 'oni_frenzy',
          name: '修羅狂暴',
          icon: '🔥',
          maxRank: 10,
          desc: '每級提升 4% 狂暴傷害，生命低於 50% 時吸血效果提升 50%。',
          getBonus: (rank) => ({ berserkDmg: rank * 4, lowHpDrainBonus: rank * 5 })
        }
      ]
    },

    onmyoji: {
      id: 'onmyoji',
      name: '陰陽劍士',
      subtitle: '五行符咒・式神靈壁',
      icon: '☯️',
      themeColor: '#a855f7',
      desc: '兼具武士刀術與陰陽神道術的秘傳修驗者，刀鋒附帶陰陽五行真氣，擁有強韌的式神護盾保護。',
      passives: {
        shieldPct: 20,
        elementalDmg: 15,
        magicFind: 10
      },
      talents: [
        {
          id: 'onmyo_barrier',
          name: '式神靈壁',
          icon: '🛡️',
          maxRank: 10,
          desc: '每級提供戰鬥開局相當於 4% 最大生命的神聖護盾，並每秒回盾 0.5%。',
          getBonus: (rank) => ({ shieldBonus: rank * 4, shieldRegen: rank * 0.5 })
        },
        {
          id: 'onmyo_fire',
          name: '迦具土真火',
          icon: '🕯️',
          maxRank: 10,
          desc: '攻擊附帶五行真火，每級造成相當於攻擊力 6% 的額外真實傷害。',
          getBonus: (rank) => ({ trueDmgBonus: rank * 6 })
        },
        {
          id: 'onmyo_thunder',
          name: '雷公天罰',
          icon: '🌩️',
          maxRank: 10,
          desc: '每級提升 3% 稀有掉寶率 (MF)，並使攻擊有 3% 機率召喚天雷轟擊敵方全體。',
          getBonus: (rank) => ({ magicFind: rank * 3, thunderChance: rank * 3 })
        }
      ]
    },

    daimyo: {
      id: 'daimyo',
      name: '守護大名',
      subtitle: '重甲不屈・鐵壁反震',
      icon: '🏯',
      themeColor: '#eab308',
      desc: '身著重裝黑鋼大鎧的一國之主，坐鎮如泰山不可動搖，受到的攻擊將化作致命的荊棘震盪反噬敵手。',
      passives: {
        defPct: 25,
        hpPct: 25,
        dmgRed: 10
      },
      talents: [
        {
          id: 'daimyo_iron',
          name: '金剛之軀',
          icon: '🧱',
          maxRank: 10,
          desc: '每級提升 4% 防禦力與 1% 受傷減免。',
          getBonus: (rank) => ({ defPct: rank * 4, dmgRed: rank * 1 })
        },
        {
          id: 'daimyo_thorns',
          name: '霸王荊棘',
          icon: '💥',
          maxRank: 10,
          desc: '每級將受到傷害的 8% 轉化為真傷反震給攻擊者。',
          getBonus: (rank) => ({ thornsPct: rank * 8 })
        },
        {
          id: 'daimyo_recovery',
          name: '不屈軍令',
          icon: '🎌',
          maxRank: 10,
          desc: '每秒自動恢復 0.5% 最大生命值，金幣掉落提升 5%。',
          getBonus: (rank) => ({ hpRegenPct: rank * 0.5, goldBonus: rank * 5 })
        }
      ]
    }
  };

  /**
   * 計算特定職業與當前天賦配置的總增益
   * @param {string} classId
   * @param {Object} talentRanks { talentId: rank }
   */
  function calculateClassBonuses(classId, talentRanks = {}) {
    const cls = SAMURAI_CLASSES[classId] || SAMURAI_CLASSES.kensei;
    const totals = {
      atkPct: 0,
      defPct: 0,
      hpPct: 0,
      critRate: 0,
      critDmg: 0,
      atkSpd: 0,
      lifeSteal: 0,
      armorPen: 0,
      dmgRed: 0,
      magicFind: 0,
      goldBonus: 0,
      shieldBonus: 0,
      trueDmgBonus: 0,
      thornsPct: 0,
      hpRegenPct: 0,
      doubleStrike: 0,
      divineKillRate: 0,
      thunderChance: 0
    };

    // 職業被動
    if (cls.passives) {
      for (const [k, v] of Object.entries(cls.passives)) {
        if (totals[k] !== undefined) totals[k] += v;
      }
    }

    // 天賦加成
    if (cls.talents && Array.isArray(cls.talents)) {
      cls.talents.forEach(tal => {
        const rank = talentRanks[tal.id] || 0;
        if (rank > 0 && typeof tal.getBonus === 'function') {
          const bonus = tal.getBonus(rank);
          for (const [bk, bv] of Object.entries(bonus)) {
            if (totals[bk] !== undefined) totals[bk] += bv;
          }
        }
      });
    }

    return totals;
  }

  // 導出全局變量
  window.SAMURAI_CLASSES = SAMURAI_CLASSES;
  window.calculateClassBonuses = calculateClassBonuses;

})();
