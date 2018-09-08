// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import astar from './AStar'

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Node)
    actor:cc.Node = null 

    @property(cc.Node)
    map:cc.Node = null
    // LIFE-CYCLE CALLBACKS:
    @property
    tiledMap: cc.TiledMap = null 
    @property
    wallLayer:cc.TiledLayer = null 
    // onLoad () {}
    @property(Array)
    mapArr: Array<Array<number>> = []

    @property(cc.Prefab)
    prefab:cc.Prefab = null 

    start () {
        this.tiledMap = this.map.getComponent(cc.TiledMap)
        this.wallLayer = this.tiledMap.getLayer('layer_0')
        cc.log(this.isWall(this.actor.position))
        cc.find('Canvas/Round8').on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this)
        this.initMapArr()
    }
    initMapArr(){
        let size = this.wallLayer.getMapTileSize()
        let layerSize  = this.wallLayer.getLayerSize()
        for(let i = 0;i < layerSize.height ; ++ i){
            this.mapArr[i] = []
            for (let j = 0 ; j < layerSize.width; ++ j){
                this.mapArr[i].push(this.isWallGID(cc.v2(i ,j))? 1: 0)
            }
        }
    }
    update(dt){
        // this.node.position = this.actor.position    
    }
    getPosInMap(pos:cc.Vec2){
        let y = (this.wallLayer.node.height - pos.y) / 16
        y = Math.floor(y)
        let x = Math.floor(pos.x / 16)
        return cc.v2(x ,y)
    }
    isWallGID(pos:cc.Vec2){
        let walls = {
            4: true,
            5: true,
            10: true,
            11: true,
            12: true,
            13: true,
            18: true,
            19: true,
            14: true,
            15: true,
            20: true,
            21: true
        }
        let gid = this.wallLayer.getTileGIDAt(pos)
        return walls[gid - 1] == true 
    }
    isWall(pos:cc.Vec2){
        let walls = {
            4:true,
            5:true,
            10:true,
            11:true,
            12:true,
            13:true,
            18:true,
            19:true,
            14:true,
            15:true,
            20:true,
            21:true
        }
        let gid = this.wallLayer.getTileGIDAt(this.getPosInMap(pos))
        return walls[gid-1] == true 
    }

    onTouchEnd(p:cc.Touch){
        let node = cc.find('Canvas/Round8')
        let pos = node.convertToNodeSpaceAR(p.getLocation())
        if(!this.isWall(pos)){
            pos = this.getPosInMap(pos)
            let actorPos = this.getPosInMap(this.actor.position)
            if(!this.isWall(this.actor.position)){
                let t1 = Date.now()
                let result = astar.find(this.mapArr,actorPos,pos)
                cc.log(Date.now() - t1 )
                let act = cc.delayTime(0)
                for(let i = 1,len = result.length; i < len ; ++i){
                    act = cc.sequence(act,cc.moveTo(0.05,this.mapPosToNodePos(result[i])))
                }
                this.actor.runAction(act)
            }
        }else{
        }
    }

    mapPosToNodePos(pos:cc.Vec2){
        let sz = this.wallLayer.getMapTileSize()
        let x = pos.x * sz.width 
        let y = this.wallLayer.getLayerSize().height * sz.height   - pos.y *sz.height - sz.height 
        return cc.v2(x+sz.width/2,y + sz.height / 2)
    }
    // update (dt) {}
}
