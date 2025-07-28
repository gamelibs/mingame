/**
 * 引导功能模块
 * 负责游戏引导的交互逻辑
 */
console.log('📁 GuideLine.js 开始加载...');

class GuideLine {
    constructor() {
        this.engine = null;
        this.stage = null;
        this.exportRoot = null;
        this.gamebox = null;
        this.loadedSounds = null;
        this.gameData = null;

        // 引导相关
        this.guideGesture = null;
        this.pointSeats = [];
        this.currentPointIndex = 0;
        this.waitingForClick = false;
        this.expectedClickCellId = null;
        this.onGuideCompleteCallback = null;
        this.getCellDataCallback = null;
    }

    /**
     * 初始化引导模块
     * @param {Object} gameData - 游戏数据对象
     * @param {Function} onComplete - 引导完成回调
     * @param {Function} getCellData - 获取格子数据的回调
     */
    init(gameData, onComplete, getCellData) {
        console.log('🎮 GuideLine 初始化...');
        
        this.engine = gameData.engine;
        this.stage = gameData.stage;
        this.exportRoot = gameData.exportRoot;
        this.gamebox = gameData.gamebox;
        this.loadedSounds = gameData.loadedSounds;
        this.gameData = gameData.gameData;
        this.onGuideCompleteCallback = onComplete;
        this.getCellDataCallback = getCellData;
    }

    

    /**
     * 显示指示位置（不创建指示圈，仅记录位置）
     */
    showPointSeats(pointSeat) {
        if (!pointSeat || pointSeat.length === 0) {
            console.log('📍 没有指示位置');
            this.pointSeats = [];
            return;
        }

        // 保存有效的指示位置
        this.pointSeats = pointSeat.filter(seat => seat >= 0);
        this.currentPointIndex = 0; // 当前指示位置索引

        console.log(`📍 记录了 ${this.pointSeats.length} 个指示位置:`, this.pointSeats);
    }

    /**
     * 初始化引导手势
     */
    initGuideGesture() {
        console.log('👆 初始化引导手势...');

        // 检查用户类型，决定是否需要引导
        const shouldShowGuide = this.shouldShowGuideForUser();

        if (!shouldShowGuide) {
            console.log('👤 老用户无需引导，跳过引导功能');
            return;
        }

        // 查找场景中的引导手势元件
        this.findGuideGesture();

        // 如果找到引导手势且有指示位置，开始引导流程
        if (this.guideGesture && this.pointSeats && this.pointSeats.length > 0) {
            this.startGuideProcess();
        } else {
            console.log('📍 没有引导手势或指示位置，跳过引导');
        }
    }

    /**
     * 判断是否需要为当前用户显示引导
     * @returns {boolean} 是否需要显示引导
     */
    shouldShowGuideForUser() {
        // 从游戏数据中获取用户状态
        if (this.gameData && this.gameData.isNewUser !== undefined) {
            const isNewUser = this.gameData.isNewUser;
            console.log(`🔍 用户类型检查: ${isNewUser ? '新用户' : '老用户'}`);
            return isNewUser;
        }

        // 如果没有用户数据，默认显示引导（安全起见）
        console.log('⚠️ 无法确定用户类型，默认显示引导');
        return true;
    }

    /**
     * 查找引导手势元件
     */
    findGuideGesture() {
        console.log('🔍 查找引导手势元件 guide_mc...');

        // 使用 utile 工具类查找元件
        this.guideGesture = utile.findMc(this.exportRoot, 'guide_mc');

        if (this.guideGesture) {
            console.log('✅ 找到引导手势元件 guide_mc:', this.guideGesture);
            // 初始时隐藏引导手势
            this.guideGesture.visible = false;
        } else {
            console.warn('⚠️ 未找到引导手势元件 guide_mc');
            // 打印可用的子元件名称用于调试
            console.log('📋 打印可用元件列表以便调试:');
            utile.logAvailableChildren(this.exportRoot);
        }
    }

    /**
     * 移动引导手势到目标位置
     */
    moveGuideGestureToTarget() {
        if (!this.guideGesture) {
            console.log('📍 没有引导手势，跳过引导');
            return;
        }

        if (!this.pointSeats || this.pointSeats.length === 0) {
            console.log('📍 没有有效的指示位置，隐藏引导手势');
            this.guideGesture.visible = false;
            return;
        }

        // 移动到当前指示位置
        this.moveGuideToCurrentPoint();
    }

    /**
     * 移动引导手势到当前指示点
     */
    moveGuideToCurrentPoint() {
        if (this.currentPointIndex >= this.pointSeats.length) {
            console.log('🎉 所有指示点都已完成，隐藏引导手势');
            this.hideGuideGesture();
            this.completeGuideProcess();
            return;
        }

        const targetCellId = this.pointSeats[this.currentPointIndex];
        const cellData = this.getCellDataCallback ? this.getCellDataCallback(targetCellId) : null;

        if (cellData) {
            console.log(`👆 移动引导手势到格子 ${targetCellId} (${cellData.centerX}, ${cellData.centerY}) - 第 ${this.currentPointIndex + 1} 个指示点`);

            // 计算引导手势的正确位置
            const guidePosition = this.calculateGuidePosition(cellData);

            console.log(`📍 引导手势坐标调整: 格子坐标(${cellData.centerX}, ${cellData.centerY}) -> 引导坐标(${guidePosition.x}, ${guidePosition.y})`);

            // 设置引导手势位置
            this.guideGesture.x = guidePosition.x;
            this.guideGesture.y = guidePosition.y;
            this.guideGesture.visible = true;

            // 添加动画效果
            this.animateGuideGesture();

            // 设置等待点击状态
            this.waitingForClick = true;
            this.expectedClickCellId = targetCellId;

            console.log(`⏳ 等待用户点击格子 ${targetCellId}`);
        } else {
            console.warn(`⚠️ 格子 ${targetCellId} 数据不存在`);
        }
    }

    /**
     * 计算引导手势的正确位置
     */
    calculateGuidePosition(cellData) {
        if (!this.guideGesture || !this.gamebox) {
            // 如果没有 gamebox 或引导手势，直接使用格子坐标
            return { x: cellData.centerX, y: cellData.centerY };
        }

        // 检查引导手势的父容器
        const guideParent = this.guideGesture.parent;
        console.log(`🔍 引导手势父容器:`, guideParent?.constructor?.name || 'unknown');
        console.log(`🔍 gamebox 容器:`, this.gamebox?.constructor?.name || 'unknown');

        // 如果引导手势在 exportRoot 中，而格子坐标是相对于 gamebox 的
        if (guideParent === this.exportRoot && this.gamebox !== this.exportRoot) {
            // 需要将 gamebox 相对坐标转换为 exportRoot 绝对坐标
            const gameboxX = this.gamebox.x || 0;
            const gameboxY = this.gamebox.y || 0;

            console.log(`📐 坐标转换: gamebox偏移(${gameboxX}, ${gameboxY})`);

            return {
                x: cellData.centerX + gameboxX,
                y: cellData.centerY + gameboxY
            };
        }

        // 如果引导手势和格子在同一个坐标系中，直接使用格子坐标
        return { x: cellData.centerX, y: cellData.centerY };
    }

    /**
     * 引导手势动画
     */
    animateGuideGesture() {
        if (!this.guideGesture) return;

        console.log('✨ 启动引导手势动画');

        // 停止之前的动画
        createjs.Tween.removeTweens(this.guideGesture);

        // 创建点击动画：缩放 + 透明度变化
        createjs.Tween.get(this.guideGesture, { loop: true })
            .to({ scaleX: 1.2, scaleY: 1.2, alpha: 0.8 }, 600, createjs.Ease.sineInOut)
            .to({ scaleX: 1.0, scaleY: 1.0, alpha: 1.0 }, 600, createjs.Ease.sineInOut)
            .wait(500);
    }

    /**
     * 隐藏引导手势
     */
    hideGuideGesture() {
        if (this.guideGesture) {
            console.log('👆 隐藏引导手势');
            createjs.Tween.removeTweens(this.guideGesture);
            this.guideGesture.visible = false;
        }
    }

    /**
     * 显示引导手势
     */
    showGuideGesture() {
        if (this.guideGesture) {
            console.log('👆 显示引导手势');
            this.guideGesture.visible = true;
            this.animateGuideGesture();
        }
    }

    /**
     * 重置引导状态
     */
    resetGuideState() {
        console.log('🔄 重置引导状态');
        this.currentPointIndex = 0;
        this.waitingForClick = false;
        this.expectedClickCellId = null;

        if (this.guideGesture) {
            createjs.Tween.removeTweens(this.guideGesture);
            this.guideGesture.visible = false;
        }
    }

    /**
     * 开始引导流程
     */
    startGuideProcess() {
        console.log('🎯 开始引导流程');
        this.resetGuideState();
        this.moveGuideToCurrentPoint();
    }

    /**
     * 完成引导流程
     */
    completeGuideProcess() {
        console.log('🎊 引导流程完成！');

        // 重置所有引导相关状态
        this.resetGuideState();

        // 引导完成回调
        if (this.onGuideCompleteCallback) {
            this.onGuideCompleteCallback();
        }

        console.log('💡 现在你可以点击蛋选中它，然后点击空格子移动蛋进行合成！');
    }

    /**
     * 引导点击成功处理
     */
    onGuideClickSuccess(cellId) {
        console.log(`🎯 引导点击成功: 格子 ${cellId}`);

        // 取消等待状态
        this.waitingForClick = false;
        this.expectedClickCellId = null;

        // 移动到下一个指示点
        this.currentPointIndex++;

        // 延迟一下再移动到下一个位置，让用户看到反馈
        setTimeout(() => {
            this.moveGuideToCurrentPoint();
        }, 500);
    }

    /**
     * 检查是否在等待引导点击
     */
    isWaitingForGuideClick(cellId) {
        return this.waitingForClick && this.expectedClickCellId === cellId;
    }
}

// 创建全局实例
window.GuideLine = new GuideLine();
console.log('✅ GuideLine 模块加载完成');