// 图形类型枚举
const graphType = {
    open: 0,
    wall: 1,
    clos: -1
};

// A* 4方向寻路算法类
class OvoAstar4 {
    constructor() {
        this.grid = null;
        this.mapWidth = 0;
        this.mapHeight = 0;
        this.moveD = 10;
        this.moveR = 14;
        this.move = [this.moveD, this.moveR];
        this.mapCell = [];
        this.lastOpenCell = null;
        this.markTag = 0;
    }

    // 单例模式
    static getInstance() {
        if (!OvoAstar4._instance) {
            OvoAstar4._instance = new OvoAstar4();
        }
        return OvoAstar4._instance;
    }

    // 静态变量只包含四个方向的移动（上、下、左、右）
    static get posXarr() { return [0, 1, 0, -1]; }
    static get posYarr() { return [-1, 0, 1, 0]; }

    init(rows, clos, _size, gridCell) {
        this.grid = gridCell;
        this.mapWidth = rows;
        this.mapHeight = clos;
        this.moveD = _size;
        this.move = [this.moveD, this.moveD, this.moveD, this.moveD];

        let cellLen = this.mapWidth * this.mapHeight;
        if (cellLen > this.mapCell.length) {
            this.mapCell.length = cellLen;
        }

        let cid = 0;

        for (let i = 0; i < this.mapWidth; ++i) {
            for (let j = 0; j < this.mapHeight; ++j) {
                this.mapCell[cid] = new MapCell();
                this.mapCell[cid].x = i;
                this.mapCell[cid].y = j;
                this.mapCell[cid].unMove = gridCell[i][j].type !== graphType.open;
                cid++;
            }
        }
    }

    search(p1, p2) {
        if (p1.x === p2.x && p1.y === p2.y) return [];

        this.reStartXY(p1.x, p1.y);

        let isPath = false;
        let currX = p1.x;
        let currY = p1.y;

        let currCell = this.mapCell[currX * this.mapHeight + currY];
        currCell.lastX = -1;
        currCell.lastY = -1;
        currCell.x = currX;
        currCell.y = currY;
        currCell.markTag = this.markTag;
        currCell.h = Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y);

        while (true) {
            if (currX === p2.x && currY === p2.y) {
                isPath = true;
                break;
            }

            if (currCell.state !== MapCell.close) {
                this.closeCell(currCell);
            }

            for (let i = 0; i < 4; i++) {
                let x = currX + OvoAstar4.posXarr[i];
                let y = currY + OvoAstar4.posYarr[i];

                if (x < 0 || x >= this.mapWidth || y < 0 || y >= this.mapHeight)
                    continue;

                let cell = this.mapCell[x * this.mapHeight + y];
                cell.unMove = this.grid[x][y].type !== graphType.open;
                if (cell.unMove) continue;

                let moveCost = this.moveD;
                if (cell.markTag !== this.markTag || cell.state === MapCell.none) {
                    cell.markTag = this.markTag;
                    cell.lastX = currX;
                    cell.lastY = currY;
                    cell.dir = i;
                    cell.g = currCell.g + moveCost;
                    cell.h = Math.abs(p2.x - x) + Math.abs(p2.y - y);
                    this.openCell(cell);
                } else if (cell.state === MapCell.open) {
                    if (cell.g > currCell.g + moveCost) {
                        cell.lastX = currX;
                        cell.lastY = currY;
                        cell.dir = i;
                        cell.g = currCell.g + moveCost;
                        this.reopenCell(cell);
                    }
                }
            }

            if (!this.lastOpenCell) break;

            currCell = this.lastOpenCell;
            currX = currCell.x;
            currY = currCell.y;
        }

        if (isPath) {
            let result = [];
            while (currCell && currCell.lastX >= 0 && currCell.lastY >= 0) {
                let lastNode = {
                    x: currCell.x,
                    y: currCell.y,
                    dir: currCell.dir,
                };
                result.unshift(lastNode);
                if (currCell.lastX === p1.x && currCell.lastY === p1.y) break;
                currCell = this.mapCell[currCell.lastX * this.mapHeight + currCell.lastY];
            }
            return result.length > 0 ? result : [];
        }

        return [];
    }

    reopenCell(cell) {
        let f = cell.h + cell.g;
        cell.f = f;

        let nextCell = cell.next;
        if (nextCell && nextCell.f > f) {
            do {
                nextCell = nextCell.next;
            } while (nextCell && nextCell.f > f);
            if (cell.prev) {
                cell.prev.next = cell.next;
            }
            if (cell.next) {
                cell.next.prev = cell.prev;
            }
            if (nextCell) {
                cell.next = nextCell;
                if (nextCell.prev) {
                    cell.prev = nextCell.prev;
                    nextCell.prev.next = cell;
                } else {
                    cell.prev = this.lastOpenCell;
                    cell.next = null;
                    this.lastOpenCell.next = cell;
                    this.lastOpenCell = cell;
                }
            }
        }
    }

    openCell(cell) {
        cell.state = MapCell.open;
        let f = cell.h + cell.g;
        cell.f = f;
        let lastCell = this.lastOpenCell;
        if (!lastCell) {
            this.lastOpenCell = cell;
            cell.prev = null;
            cell.next = null;
        } else {
            while (lastCell.f < f) {
                if (lastCell.prev == null) {
                    lastCell.prev = cell;
                    cell.prev = null;
                    cell.next = lastCell;
                    return;
                }
                lastCell = lastCell.prev;
            }

            cell.prev = lastCell;
            if (lastCell.next) {
                cell.next = lastCell.next;
                lastCell.next.prev = cell;
                lastCell.next = cell;
            } else {
                cell.next = null;
                lastCell.next = cell;
                this.lastOpenCell = cell;
            }
        }
    }

    closeCell(cell) {
        if (cell.state == MapCell.open) {
            if (cell.prev) {
                cell.prev.next = cell.next;
            }
            if (cell.next) {
                cell.next.prev = cell.prev;
            }
            if (cell == this.lastOpenCell) {
                this.lastOpenCell = cell.prev;
            }
        }
        cell.state = MapCell.close;
    }

    reStartXY(x, y) {
        let cell = this.mapCell[x * this.mapHeight + y];
        cell.lastX = 0;
        cell.lastY = 0;
        cell.h = 0;
        cell.g = 0;
        cell.f = 0;
        cell.prev = null;
        cell.next = null;
        cell.state = 0;
        cell.dir = 0;
        this.lastOpenCell = null;
        this.markTag = this.markTag + 1;
    }
}

// MapCell 类
class MapCell {
    static get none() { return 0; }
    static get open() { return 1; }
    static get close() { return 2; }

    constructor() {
        this.x = 0;
        this.y = 0;
        this.unMove = false;
        this.markTag = 0;
        this.lastX = -1;
        this.lastY = -1;
        this.h = 0;
        this.g = 0;
        this.f = 0;
        this.prev = null;
        this.next = null;
        this.dir = 0;
        this.state = MapCell.none;
    }
}

// 导出类和常量
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { OvoAstar4, MapCell, graphType };
} else {
    window.OvoAstar4 = OvoAstar4;
    window.MapCell = MapCell;
    window.graphType = graphType;
}
