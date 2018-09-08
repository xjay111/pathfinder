
const childMap: Array<Array<number>> = [
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1]
]

const cost1: number = 10
const cost2: number = 14

const AStar = class Astar {
    open:Object = {}
    close:Object = {}
    mapArr:Array<Array<number>> = null 
    constructor(){

    }

    insert(table:Object,pt:Object){
        table['x'+pt['point']['x'] +'y'+pt['point']['y']] = pt
    }

    remove(table:Object,pt:Object){
        delete table['x' + pt['point']['x'] + 'y' + pt['point']['y']] 
    }

    inTable(table:Object,pt:cc.Vec2){
        return table.hasOwnProperty('x' + pt.x + 'y' + pt.y)
    }

    validPoint(pt:cc.Vec2){
        return pt.x >= 0 && pt.y >= 0 && pt.x < this.mapArr.length && pt.y < this.mapArr[pt.x].length  
            
    }

    canGo(cPoint:cc.Vec2,dst:cc.Vec2){
        let x = dst.x - cPoint.x 
        let y = dst.y - cPoint.y
        if( x == 1 && y == 1 ){
            let p1 = cc.v2(cPoint.x + 1,cPoint.y)
            let p2 = cc.v2(cPoint.x,cPoint.y + 1)
            let b1 = this.validPoint(p1)
            let b2 = this.validPoint(p2)
            return (!b1 ||(b1 && this.mapArr[p1.x][p1.y]!=1) && (!b2||(b1 && this.mapArr[p2.x][p2.y]!=1)) )
        } else if (x == 1 && y == -1) {
            let p1 = cc.v2(cPoint.x + 1, cPoint.y)
            let p2 = cc.v2(cPoint.x, cPoint.y - 1)
            let b1 = this.validPoint(p1)
            let b2 = this.validPoint(p2)
            return (!b1 || (b1 && this.mapArr[p1.x][p1.y] != 1) && (!b2 || (b1 && this.mapArr[p2.x][p2.y] != 1)))
        } else if (x == -1 && y == -1){
            let p1 = cc.v2(cPoint.x - 1, cPoint.y )
            let p2 = cc.v2(cPoint.x, cPoint.y - 1)
            let b1 = this.validPoint(p1)
            let b2 = this.validPoint(p2)
            return (!b1 || (b1 && this.mapArr[p1.x][p1.y] != 1) && (!b2 || (b1 && this.mapArr[p2.x][p2.y] != 1)))
        }else if (x==-1 && y==1){
            let p1 = cc.v2(cPoint.x - 1, cPoint.y )
            let p2 = cc.v2(cPoint.x, cPoint.y + 1)
            let b1 = this.validPoint(p1)
            let b2 = this.validPoint(p2)
            return (!b1 || (b1 && this.mapArr[p1.x][p1.y] != 1) && (!b2 || (b1 && this.mapArr[p2.x][p2.y] != 1)))
        }
        return true 
    }
    isWall(pt:cc.Vec2){
        return this.mapArr[pt.x][pt.y] == 1
    }
    generiteChildren(cPoint:cc.Vec2,endPoint:cc.Vec2,cPointG:number){
        let result: Array<Object> = []
        for(let i in childMap){
            let p = cc.v2(cPoint.x + childMap[i][0] ,cPoint.y + childMap[i][1])
            if(!this.inTable(this.close,p) && this.validPoint(p) && !this.isWall(p) && this.canGo(cPoint,p) ){
                result.push(this.generiteChild(p, cPoint, endPoint,cPointG))
            }
        }
        return result 
    }

    generiteChild(cPoint:cc.Vec2,startPoint: cc.Vec2, endPoint: cc.Vec2,parentG:number){
        let g = Math.abs(cPoint.x - startPoint.x) + Math.abs(cPoint.y - startPoint.y) <= 1 ? cost1 : cost2
        g = g + parentG
        let h = Math.pow(endPoint.x - cPoint.x,2) + Math.pow(endPoint.y - cPoint.y ,2)
        let f = g + h 
        return {
            g: g,
            f:f,
            h:h,
            point:cPoint
        }
    }

    find(map:Array<Array<number>>,start:cc.Vec2,end:cc.Vec2){
        let found:boolean = false 
        let result:Object = null 
        this.mapArr = map 
        this.open = {}
        this.close = {}
        let tmp = this.generiteChild(start, start, end, 0)
        tmp['g'] = 0 
        tmp['f'] = tmp['h']
        this.insert(this.open,tmp)

        while(!this.isEmpty(this.open)){
            let cPoint = this.getBestPoint()
            if(cPoint['point']['x'] == end.x && cPoint['point']['y'] == end.y){
                found = true 
                result = cPoint 
                break                 
            }
            this.remove(this.open,cPoint)
            this.insert(this.close,cPoint)
            let children = this.generiteChildren(cPoint['point'],end,cPoint['g'])
            let currentPoint = cPoint['point']
            for (let i in children){
                let child = children[i]
                if(!this.inTable(this.open,child['point'])){
                    child['parent'] = cPoint
                    this.insert(this.open,child)
                }else {
                    let g = Math.abs(currentPoint.x - child['point'].x) + Math.abs(currentPoint.y - child['point'].y) <= 1 ? cost1 :cost2
                    g = g + cPoint['g']
                    if(g < child['g']){
                        child['g'] = g 
                        child['f'] = child['h'] + g 
                        child['parent'] = cPoint
                    }
                }
            }
        }
        if(found){
            let res = []
            res.unshift(result['point'])
            while(result.hasOwnProperty('parent')){
                result = result['parent']
                res.unshift(result['point'])
            }
            return res
        }
        return null 
    }

    getBestPoint(){
        let f = Number.MAX_VALUE
        let result:Object = null 
        for(let i in this.open){
            if(this.open[i].f < f){
                f = this.open[i].f
                result = this.open[i] 
            }
        }
        return result 
    }
    isEmpty(table:Object){
        for(let i in table)
            return false 
        return true 
    }
}

export  default new AStar()