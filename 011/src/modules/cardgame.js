/**
 * 抽卡游戏类
 */
class CardGame {
    constructor() {
        this.stage = null;
        this.exportRoot = null;
        this.engine = null;
        this.loadedSounds = null;

        // 游戏状态
        this.isDrawing = false;
        this.playerScore = 0;
        this.drawCost = 100;

        // UI元件引用
        this.goButton = null;
        this.cardContainer = null;
        this.scoreDisplay = null;
        this.block = null;

        console.log('🎴 CardGame 初始化完成');

        // 卡牌配置
        this.cardConfig = {
            0: { name: '锤子', rarity: 'hammer', probability: 100 },
            1: { name: '灰龙', rarity: 'common', probability: 0 },
            2: { name: '绿龙', rarity: 'rare', probability: 0 },
            3: { name: '蓝龙', rarity: 'epic', probability: 0 },
            4: { name: '黑龙', rarity: 'evildragon', probability: 0 },
            5: { name: '紫龙', rarity: 'legendary', probability: 0 },
            6: { name: '红龙', rarity: 'legendary', probability: 0 },
            7: { name: '黄金龙', rarity: 'legendary', probability: 0 },
        };

        // UI元件
        this.cardContainer = null;
        this.cardSlots = [];
        this.goButton = null;
        this.scoreDisplay = null;

        console.log('🎴 CardGame 初始化完成');
    }
    /**
     * 初始化抽卡游戏
     */
    async init(gameData) {
        console.log('🎴 抽卡游戏初始化开始...');

        this.stage = gameData.stage;
        this.exportRoot = gameData.exportRoot;
        this.engine = gameData.engine;
        this.loadedSounds = gameData.loadedSounds;

        // 获取玩家积分
        this.playerScore = this.getPlayerScore();

        // 查找 mc_victory 元件
        this.card_reward_Mc = utile.findMc(this.exportRoot, 'mc_card_reward');
        if (!this.card_reward_Mc) {
            console.error('❌ 未找到 mc_card_reward 元件');
            return;
        }

        this.block = utile.findMc(this.card_reward_Mc, 'mc_card_container');
        if (this.block) {
            this.block.mouseEnabled = true;

            // 绑定屏蔽层点击事件
            if (!this.block.hasEventListener("click")) {
                this.block.on('click', function (event) {
                    console.log('🛡️ 胜利界面屏蔽层拦截了点击事件');
                    event.stopImmediatePropagation();
                    event.stopPropagation();
                    event.preventDefault();
                    return false;
                });
            }
        }

        // 卡牌容器
        this.cardContainer = utile.findMc(this.card_reward_Mc, 'mc_card_container');
        if (!this.cardContainer) {
            console.warn('⚠️ 未找到 mc_card_container，动画逻辑将退化');
        }

        // GO 按钮
        this.goButton = utile.findMc(this.card_reward_Mc, 'btn_go');
        if (!this.goButton) {
            console.error('❌ 未找到 btn_go');
            return;
        }

        this.goButton.play();
        // 初始化积分显示
        // this.initScoreDisplay();

        // 绑定事件
        this.bindEvents();

        console.log('✅ 抽卡游戏初始化完成');
        console.log(`📽️ mc_card_container 总帧数: ${this.cardContainer.totalFrames}`);
    }

    // 新增：等待音效播放结束
    playSoundWait(id) {
        if (!this.engine || !this.loadedSounds || !this.loadedSounds.has(id)) {
            return Promise.resolve();
        }
        return new Promise(resolve => {
            try {
                const inst = this.engine.playSound(id);
                if (!inst || !inst.on) return resolve();
                const done = () => resolve();
                inst.on('complete', done);
                inst.on('failed', done);
                inst.on('interrupted', done);
            } catch (e) {
                resolve();
            }
        });
    }

    /**
     * 初始化积分显示
     */
    initScoreDisplay() {
        // 查找现有的积分显示元件
        const scoreContainer = utile.findMc(this.cardContainer, 'mc_score');
        if (scoreContainer) {
            this.scoreDisplay = utile.findMc(scoreContainer, 'text_score');
            if (this.scoreDisplay) {
                this.updateScoreDisplay();
                console.log('💰 积分显示初始化完成');
            } else {
                console.error('❌ 未找到 text_score 元件');
            }
        } else {
            console.error('❌ 未找到 mc_score 元件');
        }
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        console.log('🔗 绑定抽卡事件...');

        // 延迟绑定，确保在屏蔽层事件之后
        setTimeout(() => {
            // 移除可能存在的旧事件
            this.goButton.removeAllEventListeners('click');

            // 绑定新的点击事件
            this.goButton.on('click', (event) => {
                console.log('🎯 GO按钮被点击');
                event.stopImmediatePropagation(); // 阻止事件继续传播到屏蔽层
                this.startCardDraw();
            });

            // 设置按钮可点击
            this.goButton.cursor = 'pointer';
            this.goButton.mouseEnabled = true;

            console.log('✅ GO按钮事件绑定完成');
        }, 100);
    }

    /**
     * 开始抽卡
     */
    async startCardDraw() {
        this.goButton.stop();
        if (!this.cardContainer || this.isDrawing) return;
        this.isDrawing = true;
        if (this.goButton) this.goButton.mouseEnabled = false;

        try {
            const result = this.getCardByProbability();
            // 随机圈数（可调 5~8 / 6~9）
            const rotations = 6 + Math.floor(Math.random() * 4); // 6~9
            await this.spinToResultSimple(result, {
                rotations,
                framesPerTick: 1,   // 每 tick 前进帧数(提高=更快)
                loopSound: true
            });
            this.playSound('cardReveal');
            // this.showMessage(`恭喜获得: ${result.name}`);
            this.showRewardedAd(result);
        } catch (e) {
            console.error('❌ 抽卡失败:', e);
        } finally {
            this.isDrawing = false;
            if (this.goButton) this.goButton.mouseEnabled = true;
        }
    }

    /**
   * 简单恒速旋转：按固定帧步长推进；开始播放音效，结束立即停止
   * @param {Object} cardResult
   * @param {Object} opts { rotations, framesPerTick, loopSound }
   */
    spinToResultSimple(cardResult, opts = {}) {
        return new Promise(resolve => {
            const mc = this.cardContainer;
            if (!mc || !mc.totalFrames) return resolve();

            const totalFrames = mc.totalFrames;
            const startFrame = mc.currentFrame || 0;
            const targetFrame = this.getFrameByCardId(cardResult.id);

            const rotations = Math.max(1, opts.rotations || 6);
            const framesPerTick = Math.max(1, opts.framesPerTick || 6);

            // 计算需要前进的总帧数（保证正向）
            const forwardDelta = ((targetFrame - startFrame) + totalFrames) % totalFrames;
            const totalAdvance = rotations * totalFrames + forwardDelta;

            let advanced = 0;
            let spinSoundInstance = null;

            // 播放旋转音效（持续到结束）
            if (opts.loopSound && this.engine && this.loadedSounds && this.loadedSounds.has('card')) {
                try {
                    spinSoundInstance = this.engine.playSound('card', { loop: -1, volume: 1 });
                } catch (e) { }
            }

            mc.gotoAndStop(startFrame);

            let finished = false;
            const finish = () => {
                this.goButton.play();
                if (finished) return;
                finished = true;
                try {
                    mc.gotoAndStop(targetFrame);
                    if (spinSoundInstance) spinSoundInstance.stop && spinSoundInstance.stop();
                    
                } catch (e) { }
                createjs.Ticker.off('tick', tickHandler);
                resolve();
            };

            const tickHandler = () => {
                if (finished) return;
                const remain = totalAdvance - advanced;
                if (remain <= 0) {
                    finish();
                    return;
                }
                const step = remain < framesPerTick ? remain : framesPerTick;
                advanced += step;
                const frame = (startFrame + advanced) % totalFrames;
                mc.gotoAndStop(frame);
                if (advanced >= totalAdvance) finish();
            };

            createjs.Ticker.on('tick', tickHandler);
            // 兜底（极少数情况下防止意外不结束）
            setTimeout(() => finish(), 30000);
        });
    }

    /**
  * 播放卡牌动画
  */
    /**
       * 播放卡牌动画 + 等待音效(card.mp3)结束后才显示结果
       * @param {string} soundId
       */
    async playCardAnimation(soundId = 'card') {
        console.log('🎬 播放卡牌动画并等待音效结束...');
        return new Promise(async (resolve) => {
            if (!this.cardContainer) {
                console.error('❌ cardContainer 为空');
                return resolve();
            }

            this.cardContainer.gotoAndStop(0);

            const totalFrames = this.cardContainer.totalFrames;
            let currentFrame = 0;
            let phase = 'slow';
            let spinning = true;
            let soundFinished = false;

            // 启动音效并等待
            this.playSoundWait(soundId).then(() => {
                soundFinished = true;
            }).catch(() => { soundFinished = true; });

            const slowSpeed = 100; // 前 30% 慢速
            const fastSpeed = 30;  // 中段快速
            const extraSpinFastSpeed = 40; // 等待音效时的额外旋转速度

            const tickSpin = () => {
                if (!spinning) return;

                // 选择当前速度
                if (phase === 'slow') {
                    this.cardContainer.gotoAndStop(currentFrame % totalFrames);
                    currentFrame++;
                    if (currentFrame >= totalFrames * 0.3) {
                        phase = 'fast';
                    }
                    setTimeout(tickSpin, slowSpeed);
                } else if (phase === 'fast') {
                    this.cardContainer.gotoAndStop(currentFrame % totalFrames);
                    currentFrame++;
                    if (currentFrame >= totalFrames * 2) {
                        phase = 'waitSound';
                    }
                    setTimeout(tickSpin, fastSpeed);
                } else if (phase === 'waitSound') {
                    // 音效未结束：继续匀速转
                    if (!soundFinished) {
                        this.cardContainer.gotoAndStop(currentFrame % totalFrames);
                        currentFrame++;
                        setTimeout(tickSpin, extraSpinFastSpeed);
                    } else {
                        // 进入最终收敛
                        phase = 'final';
                        finalPhase();
                    }
                }
            };

            const finalPhase = () => {
                // 根据概率确定最终卡牌
                const cardResult = this.getCardByProbability();
                const targetFrame = this.getFrameByCardId(cardResult.id);

                const currentPos = currentFrame % totalFrames;
                const frameDistance = Math.abs(targetFrame - currentPos);
                const steps = Math.min(frameDistance, 10);
                let step = 0;

                const easeStep = () => {
                    if (step < steps) {
                        const progress = step / steps;
                        const framePos = Math.round(currentPos + (targetFrame - currentPos) * progress);
                        this.cardContainer.gotoAndStop(framePos % totalFrames);
                        step++;
                        setTimeout(easeStep, 100);
                    } else {
                        this.cardContainer.gotoAndStop(targetFrame);
                        console.log(`🎲 最终停在帧 ${targetFrame} -> ${cardResult.name}`);
                        // 结果音效
                        this.playSound('cardReveal');
                        // this.showMessage(`恭喜获得: ${cardResult.name}`);
                        this.showRewardedAd(cardResult);
                        spinning = false;
                        resolve();
                    }
                };
                easeStep();
            };

            tickSpin();
        });
    }

    // /**
    //  * 根据帧数获取对应的卡牌
    //  * @param {number} frame - 动画停止的帧数
    //  * @returns {Object} 卡牌配置对象
    //  */
    // getCardByFrame(frame) {
    //     // 使用概率抽取卡牌，而不是简单的帧数映射
    //     const randomNum = Math.random() * 100;
    //     let currentProbability = 0;

    //     for (const [cardId, config] of Object.entries(this.cardConfig)) {
    //         currentProbability += config.probability;
    //         if (randomNum <= currentProbability) {
    //             return config;
    //         }
    //     }

    //     // 默认返回灰龙
    //     return this.cardConfig[0];
    // }

    /**
     * 更新积分显示
     */
    updateScoreDisplay() {
        if (this.scoreDisplay && this.scoreDisplay.text !== undefined) {
            this.scoreDisplay.text = `${this.playerScore}`;
        }
    }


    /**
 * 根据概率获取卡牌
 * @returns {Object} 卡牌配置对象（包含id）
 */
    getCardByProbability() {
        const randomNum = Math.random() * 100;
        let currentProbability = 0;

        console.log(`🎲 随机数: ${randomNum.toFixed(2)}`);

        for (const [cardId, config] of Object.entries(this.cardConfig)) {
            currentProbability += config.probability;
            console.log(`🔍 检查卡牌${cardId}(${config.name}): 当前累计概率${currentProbability}%`);

            if (randomNum <= currentProbability) {
                console.log(`✅ 抽中: ${config.name} (概率${config.probability}%)`);
                return { ...config, id: cardId };
            }
        }

        // 默认返回第一个卡牌
        console.log('⚠️ 使用默认卡牌');
        return { ...this.cardConfig[0], id: '0' };
    }

    /**
     * 根据卡牌ID获取对应的帧数
     * @param {string} cardId - 卡牌ID
     * @returns {number} 对应的帧数
     */
    getFrameByCardId(cardId) {
        const totalFrames = this.cardContainer.totalFrames;
        const cardIndex = parseInt(cardId);
        // 将8个卡牌平均分布到总帧数中
        return Math.floor((cardIndex * totalFrames) / 8);
    }

    /**
     * 调用激励广告
     * @param {Object} cardResult - 抽中的卡牌结果
     */
    showRewardedAd(cardResult) {
        console.log(`🎬 准备播放激励广告，奖励: ${cardResult.name} (+${cardResult.score}分)`);

        // 这里调用激励广告API
        // 假设广告成功后会调用回调函数
        if (window.showRewardedVideo) {
            window.showRewardedVideo(() => {
                // 广告观看完成后的回调
                this.onAdWatchComplete(cardResult);
            });
        } else {
            console.log('🎬 激励广告API不可用，直接给予奖励');
            this.onAdWatchComplete(cardResult);
        }
    }

    /**
     * 广告观看完成回调
     * @param {Object} cardResult - 抽中的卡牌结果
     */
    onAdWatchComplete(cardResult) {
        console.log(`🎉 广告观看完成，获得奖励: ${cardResult.name} (+${cardResult.score}分)`);



    }

    /**
     * 显示消息
     */
    showMessage(message) {
        console.log(`💬 消息: ${message}`);

        const messageText = new createjs.Text(message, 'bold 20px Arial', '#FFD700');
        messageText.textAlign = 'center';
        messageText.x = this.cardContainer.x || 400;
        messageText.y = (this.cardContainer.y || 300) - 100;
        messageText.alpha = 0;

        this.stage.addChild(messageText);

        // 消息动画
        createjs.Tween.get(messageText)
            .to({ alpha: 1, y: messageText.y - 20 }, 300)
            .wait(2000)
            .to({ alpha: 0, y: messageText.y - 40 }, 300)
            .call(() => {
                this.stage.removeChild(messageText);
            });
    }

    /**
     * 播放音效
     */
    playSound(soundName) {
        if (this.engine && this.loadedSounds && this.loadedSounds.has(soundName)) {
            this.engine.playSound(soundName);
        }
    }

    /**
     * 获取玩家积分
     */
    getPlayerScore() {
        return 1000; // 默认积分
    }

    /**
     * 显示抽卡界面
     */
    show() {
        if (this.cardContainer) {
            this.cardContainer.visible = true;
        }
    }

    /**
     * 隐藏抽卡界面
     */
    hide() {
        if (this.cardContainer) {
            this.cardContainer.visible = false;
        }
    }
}

// 导出类
window.CardGame = CardGame;