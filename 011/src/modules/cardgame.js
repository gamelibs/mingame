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
        this.victoryMc = null;
        this.goButton = null;
        this.cardContainer = null;
        this.scoreDisplay = null;

        console.log('🎴 CardGame 初始化完成');

        // 卡牌配置
        this.cardConfig = {
            0: { name: '锤子', rarity: 'mythic', probability: 90 },
            1: { name: '灰龙', rarity: 'common', probability: 1 },
            2: { name: '绿龙', rarity: 'rare', probability: 1 },
            3: { name: '蓝龙', rarity: 'epic', probability: 1 },
            4: { name: '黑龙', rarity: 'evildragon', probability: 1 },
            5: { name: '紫龙', rarity: 'legendary', probability: 1 },
            6: { name: '红龙', rarity: 'legendary', probability: 1 },
            7: { name: '黄金龙', rarity: 'legendary', probability: 1 },
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
        this.victoryMc = utile.findMc(this.exportRoot, 'mc_victory');
        if (!this.victoryMc) {
            console.error('❌ 未找到 mc_victory 元件');
            return;
        }

        // 查找 mc_card_container 元件
        this.cardContainer = utile.findMc(this.victoryMc, 'mc_card_container');
        if (!this.cardContainer) {
            console.error('❌ 未找到 mc_card_container 元件');
            return;
        }

        // 查找 btn_go 按钮
        this.goButton = utile.findMc(this.victoryMc, 'btn_go');
        if (!this.goButton) {
            console.error('❌ 未找到 btn_go 按钮');
            return;
        }

        // 初始化积分显示
        this.initScoreDisplay();

        // 绑定事件
        // this.bindEvents();

        console.log('✅ 抽卡游戏初始化完成');
        console.log(`📽️ mc_card_container 总帧数: ${this.cardContainer.totalFrames}`);
    }

    /**
     * 初始化积分显示
     */
    initScoreDisplay() {
        // 查找现有的积分显示元件
        const scoreContainer = utile.findMc(this.victoryMc, 'mc_score');
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
    // bindEvents() {
    //     console.log('🔗 绑定抽卡事件...');

    //     // 延迟绑定，确保在屏蔽层事件之后
    //     setTimeout(() => {
    //         // 移除可能存在的旧事件
    //         this.goButton.removeAllEventListeners();

    //         // 绑定新的点击事件
    //         this.goButton.on('click', (event) => {
    //             console.log('🎯 GO按钮被点击');
    //             event.stopImmediatePropagation(); // 阻止事件继续传播到屏蔽层
    //             this.startCardDraw();
    //         });

    //         // 设置按钮可点击
    //         this.goButton.cursor = 'pointer';
    //         this.goButton.mouseEnabled = true;

    //         console.log('✅ GO按钮事件绑定完成');
    //     }, 100);
    // }

    /**
     * 开始抽卡
     */
    async startCardDraw() {
        console.log('🎴 开始抽卡...');

        // 检查是否正在抽卡
        if (this.isDrawing) {
            console.log('⏳ 正在抽卡中，请稍候...');
            return;
        }


        // 设置抽卡状态
        this.isDrawing = true;

        try {
            // 播放抽卡音效
            this.playSound('cardDraw');

            // 执行抽卡动画
            await this.playCardAnimation();

            console.log('✅ 抽卡完成');

        } catch (error) {
            console.error('❌ 抽卡失败:', error);
        } finally {
            this.isDrawing = false;
        }
    }

    /**
  * 播放卡牌动画
  */
    async playCardAnimation() {
        console.log('🎬 播放卡牌动画...');

        return new Promise((resolve) => {
            if (!this.cardContainer) {
                console.error('❌ cardContainer 为空');
                resolve();
                return;
            }

            // 确保动画从第0帧开始
            this.cardContainer.gotoAndStop(0);

            let currentFrame = 0;
            const totalFrames = this.cardContainer.totalFrames;
            const finalFrame = Math.floor(Math.random() * totalFrames);

            console.log(`🎯 开始播放动画，总帧数: ${totalFrames}，目标帧: ${finalFrame}`);

            // 第一阶段：慢速播放 (2秒)
            const slowSpeed = 100; // 每帧100ms
            const slowPhase = () => {
                if (currentFrame < totalFrames * 0.3) {
                    this.cardContainer.gotoAndStop(currentFrame % totalFrames);
                    currentFrame++;
                    setTimeout(slowPhase, slowSpeed);
                } else {
                    fastPhase();
                }
            };

            // 第二阶段：快速播放 (2秒)
            const fastSpeed = 30; // 每帧30ms
            const fastPhase = () => {
                if (currentFrame < totalFrames * 2) {
                    this.cardContainer.gotoAndStop(currentFrame % totalFrames);
                    currentFrame++;
                    setTimeout(fastPhase, fastSpeed);
                } else {
                    finalPhase();
                }
            };

            // 第三阶段：慢速定位到目标帧 (1秒)
            const finalPhase = () => {
                // 根据概率确定最终卡牌
                const cardResult = this.getCardByProbability();
                // 将卡牌ID映射到对应的帧数
                const finalFrame = this.getFrameByCardId(cardResult.id);

                const frameDistance = Math.abs(finalFrame - (currentFrame % totalFrames));
                const steps = Math.min(frameDistance, 10);
                let stepCount = 0;

                const finalStep = () => {
                    if (stepCount < steps) {
                        const progress = stepCount / steps;
                        const currentPos = (currentFrame % totalFrames);
                        const targetPos = finalFrame;
                        const framePos = Math.round(currentPos + (targetPos - currentPos) * progress);

                        this.cardContainer.gotoAndStop(framePos % totalFrames);
                        stepCount++;
                        setTimeout(finalStep, 100);
                    } else {
                        // 最终停在目标帧
                        this.cardContainer.gotoAndStop(finalFrame);
                        console.log(`🎲 动画停止在第 ${finalFrame} 帧，抽中: ${cardResult.name}`);

                        // 播放结果音效
                        this.playSound('cardReveal');

                        // 显示结果消息并调用激励广告
                        this.showMessage(`恭喜获得: ${cardResult.name}`);

                        // 调用激励广告
                        this.showRewardedAd(cardResult);

                        resolve();
                    }
                };

                finalStep();
            }

            // 开始慢速阶段
            slowPhase();
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
        messageText.x = this.victoryMc.x || 400;
        messageText.y = (this.victoryMc.y || 300) - 100;
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
        if (this.victoryMc) {
            this.victoryMc.visible = true;
        }
    }

    /**
     * 隐藏抽卡界面
     */
    hide() {
        if (this.victoryMc) {
            this.victoryMc.visible = false;
        }
    }
}

// 导出类
window.CardGame = CardGame;