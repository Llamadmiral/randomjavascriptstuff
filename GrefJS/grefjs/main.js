const SHAPE_TYPE_RECTANGLE = 'Rectangle';
const MOVEMENT_ACTION = 'MoveAction';
const FUNCTION_ACTION = 'FunctionAction';

/*---------- CLASSES ----------*/
class CanvasWrapper {
    constructor(canvas) {
        this._canvas = canvas;
        this._context = this._canvas.getContext("2d");
        this._objectHandler = new ObjectHandler();
    }

    draw(ctx) {
        let objHandler = new ObjectHandler();
        objHandler.updateAll();
        objHandler.drawAll(ctx);
    }

    get canvas() {
        return this._canvas;
    }

    get objectHandler() {
        return this._objectHandler;
    }


    get context() {
        return this._context;
    }

    addShape(shapeType, par) {
        let newShape = null;
        switch (shapeType) {
            case SHAPE_TYPE_RECTANGLE:
                newShape = new Rectangle(par['x'], par['y'], par['w'], par['h'], par['collision']);
                this.objectHandler.addObject(newShape, par['z']);
                break;
            default:
                break;
        }
        return newShape;
    }

    start() {
        window.setInterval(this.draw, 30, this.context);
    }

}

class ObjectHandler {
    constructor() {
        if (!!ObjectHandler.instance) {
            return ObjectHandler.instance;
        }
        ObjectHandler.instance = this;

        this._objects = {};
        this._collisionObjects = [];

        return this;
    }


    get objects() {
        return this._objects;
    }

    get collisionObjects() {
        return this._collisionObjects;
    }

    addObject(obj, index) {
        if (this._objects.hasOwnProperty(index)) {
            this._objects[index].push(obj);
        } else {
            this._objects[index] = [obj];
        }
        if (obj.collision) {
            this._collisionObjects.push(obj);
        }
    }

    drawAll(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        for (let prop in this.objects) {
            if (this.objects.hasOwnProperty(prop)) {
                for (let i = 0; i < this.objects[prop].length; i++) {
                    this.objects[prop][i].draw(ctx);
                }
            }
        }
    }

    updateAll() {
        for (let prop in this.objects) {
            if (this.objects.hasOwnProperty(prop)) {
                for (let i = 0; i < this.objects[prop].length; i++) {
                    this.objects[prop][i].update();
                }
            }
        }
    }

}

class Renderable {
    constructor(type, x, y, collision = false) {
        this._x = x;
        this._y = y;
        this._type = type;
        this._actions = [];
        this._collision = collision;
    }


    draw(ctx) {
        console.log('Draw called on ' + this.type + ', but method is not implemented!');
    }


    update() {
        if (this.actions.length > 0) {
            let action = this._actions[0];
            action.execute();
            if (action.finished) {
                this._actions.shift();
            }
        }
    }

    get type() {
        return this._type;
    }

    get actions() {
        return this._actions;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    get collision() {
        return this._collision;
    }

    set collision(value) {
        this._collision = value;
    }

    addAction(action) {
        action.actor = this;
        this.actions.push(action);
    }

    step(x, y) {
        let stepped = false;
        if (this._collision) {
            let newX = this.x + x;
            let newY = this.y + y;
            let objHandler = new ObjectHandler();
            for (let obj in objHandler.collisionObjects) {
                if (objHandler.collisionObjects.hasOwnProperty(obj)) {
                    let other = objHandler.collisionObjects[obj];
                    if (this !== other) {
                        let baseCollision = newX < other.x + other.width &&
                            newX + this.width > other.x &&
                            newY < other.y + other.height &&
                            newY + this.height > other.y;
                        if (!baseCollision) {
                            this._x += x;
                            this._y += y;
                            stepped = true;
                        } else {
                            if (y !== 0 && (this.x === other.x + other.width || this.x + this.width === other.x)) {
                                this._y += y;
                                stepped = true;
                            }
                            if (x !== 0 && (this.y === other.y + other.height || this.y + this.height === other.y)) {
                                this._x += x;
                                stepped = true;
                            }
                        }
                    }
                }
            }
        } else {
            stepped = true;
            this._x += x;
            this._y += y;
        }
        return stepped;
    }
}

class Action {
    constructor(type) {
        this._actor = null;
        this._type = type;
        this._finished = false;
    }

    get type() {
        return this._type;
    }


    get finished() {
        return this._finished;
    }

    set finished(value) {
        this._finished = value;
    }

    get actor() {
        return this._actor;
    }

    set actor(value) {
        this._actor = value;
    }

    execute() {
        console.log('Action is not implemented for ' + this._type + '!');
    }
}

class MoveAction extends Action {
    constructor(x, y, n) {
        super(MOVEMENT_ACTION);
        this._x = x;
        this._y = y;
        this._n = n;
    }

    execute() {
        let hasStepped = this._actor.step(this._x, this._y);
        if (hasStepped) {
            this._n--;
            if (this._n === 0) {
                this.finished = true;
            }
        }
    }

}

class FunctionAction extends Action {
    constructor(func) {
        super(FUNCTION_ACTION);
        this._func = func;
    }

    execute() {
        this._func();
        this.finished = true;
    }
}

/*--------- SHAPES ---------*/

class Rectangle extends Renderable {
    constructor(x, y, w, h, collision) {
        super(SHAPE_TYPE_RECTANGLE, x, y, collision);
        this._w = w;
        this._h = h;
        this._strokeStyle = 'red';
    }

    get width() {
        return this._w;
    }

    get height() {
        return this._h;
    }

    get strokeStyle() {
        return this._strokeStyle;
    }

    draw(ctx) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.strokeStyle;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

}

/*--------- SHAPES ---------*/


/*---------- CLASSES ----------*/

function createCanvasWrapper(canvas) {
    return new CanvasWrapper(canvas);
}