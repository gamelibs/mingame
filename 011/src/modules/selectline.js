/**
 * 难度选择模块
 * 负责游戏难度选择的交互逻辑
 */
console.log('📁 SelectLine.js 开始加载...');

class SelectLine {
    constructor() {
        this.engine = null;
        this.stage = null;
        this.exportRoot = null;
        this.loadedSounds = null;

        // 难度选择相关
        this.startMc = null;
        this.selectedDifficulty = null;
        this.onDifficultyCallback = null;
    }

    /**
 * 获取难度对应的等级参数
 * @param {string} difficulty - 难度等级 ('easy', 'normal', 'hard')
 * @returns {number} 难度等级数值
 */
    getDifficultyLevel(difficulty) {
        const difficultyMap = {
            'easy': 3,    // 简单：3个蛋
            'normal': 4,  // 中等：4个蛋
            'hard': 5     // 困难：5个蛋
        };

        return difficultyMap[difficulty] || 4; // 默认中等难度
    }

    /**
     * 初始化难度选择模块
     * @param {Object} gameData - 游戏数据对象
     * @param {Function} callback - 难度选择完成回调
     */
    init(gameData, callback) {
        console.log('🎮 SelectLine 初始化...');

        this.engine = gameData.engine;
        this.stage = gameData.stage;
        this.exportRoot = gameData.exportRoot;
        this.loadedSounds = gameData.loadedSounds;
        this.onDifficultyCallback = callback;

        this.selectDifficulty();
    }

    /**
 * 隐藏选择难度UI
 */
    hideDifficultyUI() {
        console.log('🙈 隐藏选择难度UI...');

        const selectMc = utile.findMc(this.exportRoot, 'mc_select');
        if (selectMc) {
            selectMc.visible = false;
            console.log('✅ 已隐藏 mc_select');
        } else {
            console.log('⚠️ 未找到 mc_select 元件');
        }
    }
    /**
     * 显示难度选择界面
     */
    selectDifficulty() {
        console.log('🎮 选择游戏难度...');
        this.startMc = utile.findMc(this.exportRoot, 'mc_select');

        if (this.startMc) {
            console.log('✅ 找到难度选择界面');
            this.startMc.visible = true;

            const btnEasy = utile.findMc(this.startMc, 'btn_e');
            const btnNormal = utile.findMc(this.startMc, 'btn_n');
            const btnHard = utile.findMc(this.startMc, 'btn_h');

            this.stage.on('click', (event) => {
                const target = event.target;
                console.log('🎯 舞台点击事件，目标:', target);

                const clickedButton = this.findButtonContainer(target, [btnEasy, btnNormal, btnHard]);

                if (clickedButton === btnEasy) {
                    console.log('🟢 检测到简单难度按钮点击');
                    this.onDifficultySelected('easy');
                } else if (clickedButton === btnNormal) {
                    console.log('🟡 检测到普通难度按钮点击');
                    this.onDifficultySelected('normal');
                } else if (clickedButton === btnHard) {
                    console.log('🔴 检测到困难难度按钮点击');
                    this.onDifficultySelected('hard');
                }
            });

            [btnEasy, btnNormal, btnHard].forEach(btn => {
                if (btn) {
                    btn.mouseEnabled = true;
                    btn.cursor = "pointer";
                }
            });
        } else {
            console.warn('⚠️ 未找到难度选择界面，使用默认难度');
            this.onDifficultySelected('normal');
        }
    }

    /**
     * 查找按钮容器
     */
    findButtonContainer(target, buttons) {
        let current = target;

        for (let i = 0; i < 5 && current; i++) {
            for (const button of buttons) {
                if (current === button) {
                    console.log(`✅ 找到按钮容器: ${button.name} (向上${i}层)`);
                    return button;
                }
            }
            current = current.parent;
        }
        return null;
    }

    /**
     * 获取目标对象的路径（调试用）
     */
    getTargetPath(target) {
        const path = [];
        let current = target;

        for (let i = 0; i < 5 && current; i++) {
            const name = current.name || current.constructor.name;
            path.push(name);
            current = current.parent;
        }
        return path.join(' -> ');
    }

    /**
     * 处理难度选择
     */
    onDifficultySelected(difficulty) {
        console.log(`🎯 用户选择难度: ${difficulty}`);

        // 播放点击音效
        if (this.engine && this.loadedSounds.has('popo')) {
            this.engine.playSound('popo');
        }

        // 隐藏难度选择界面
        if (this.startMc) {
            this.startMc.visible = false;
        }

        this.selectedDifficulty = difficulty;

        // 调用回调函数，通知游戏场景难度选择完成
        if (this.onDifficultyCallback) {
            this.onDifficultyCallback(difficulty);
        }
    }

    /**
     * 获取选择的难度
     */
    getSelectedDifficulty() {
        return this.selectedDifficulty;
    }


    selectDifficulty() {
        console.log('🎮 选择游戏难度...');
        this.startMc = utile.findMc(this.exportRoot, 'mc_select');

        if (this.startMc) {
            console.log('✅ 找到难度选择界面');

            // 显示难度选择界面
            this.startMc.visible = true;

            // 查找三个难度按钮
            const btnEasy = utile.findMc(this.startMc, 'btn_e');
            const btnNormal = utile.findMc(this.startMc, 'btn_n');
            const btnHard = utile.findMc(this.startMc, 'btn_h');

            this.stage.on('click', (event) => {
                const target = event.target;
                console.log('🎯 舞台点击事件，目标:', target);
                console.log('🎯 目标名称:', target.name);
                console.log('🎯 目标父级:', target.parent);

                // 向上查找按钮容器
                const clickedButton = this.findButtonContainer(target, [btnEasy, btnNormal, btnHard]);

                if (clickedButton === btnEasy) {
                    console.log('🟢 检测到简单难度按钮点击');
                    this.onDifficultySelected('easy');
                } else if (clickedButton === btnNormal) {
                    console.log('🟡 检测到普通难度按钮点击');
                    this.onDifficultySelected('normal');
                } else if (clickedButton === btnHard) {
                    console.log('🔴 检测到困难难度按钮点击');
                    this.onDifficultySelected('hard');
                } else {
                    console.log('🎯 点击了其他区域，目标路径:', this.getTargetPath(target));
                }
            });
            // 设置按钮样式
            [btnEasy, btnNormal, btnHard].forEach(btn => {
                if (btn) {
                    btn.mouseEnabled = true;
                    btn.cursor = "pointer";
                }
            });
        } else {
            console.warn('⚠️ 未找到难度选择界面，跳过难度选择');
            this.onDifficultySelected('normal');
        }


    }
    /**
     * 查找按钮容器
     * @param {Object} target - 点击的目标对象
     * @param {Array} buttons - 按钮数组
     * @returns {Object|null} 找到的按钮容器
     */
    findButtonContainer(target, buttons) {
        let current = target;

        // 向上遍历父级，最多查找5层
        for (let i = 0; i < 5 && current; i++) {
            // 检查当前对象是否是按钮之一
            for (const button of buttons) {
                if (current === button) {
                    console.log(`✅ 找到按钮容器: ${button.name} (向上${i}层)`);
                    return button;
                }
            }
            current = current.parent;
        }

        return null;
    }
    /**
     * 获取目标对象的路径（用于调试）
     * @param {Object} target - 目标对象
     * @returns {string} 路径字符串
     */
    getTargetPath(target) {
        const path = [];
        let current = target;

        for (let i = 0; i < 5 && current; i++) {
            const name = current.name || current.constructor.name;
            path.push(name);
            current = current.parent;
        }

        return path.join(' -> ');
    }

    // 辅助方法：检查target是否是parent的子元素
    isChildOf(target, parent) {
        if (!target || !parent) return false;
        let current = target.parent;
        while (current) {
            if (current === parent) return true;
            current = current.parent;
        }
        return false;
    }

    /**
 * 处理难度选择
 * @param {string} difficulty - 选择的难度 ('easy', 'normal', 'hard')
 */
    onDifficultySelected(difficulty) {
        console.log(`🎯 用户选择难度: ${difficulty}`);

        // 播放点击音效
        if (this.engine && this.loadedSounds.has('popo')) {
            this.engine.playSound('popo');
        }

        // 隐藏难度选择界面
        if (this.startMc) {
            this.startMc.visible = false;
        }

        // 保存选择的难度
        this.selectedDifficulty = difficulty;

        // 根据难度设置游戏参数
        // this.applyDifficultySettings(difficulty);

        // 继续游戏初始化流程
        // this.continueInitialization();
    }
}

// 创建全局实例
window.SelectLine = new SelectLine();
console.log('✅ SelectLine 模块加载完成');