window.addEventListener("load", function () {
    let canvas = document.getElementById("canvas");
    let canvasWrapper = createCanvasWrapper(canvas);
    let leftRectangle = canvasWrapper.addShape(SHAPE_TYPE_RECTANGLE, {
        'x': 5,
        'y': 5,
        'w': 100,
        'h': 100,
        'z': 0,
        'collision': true
    });
    leftRectangle.addAction(new MoveAction(1, 0, 200));
    leftRectangle.addAction(new FunctionAction(function () {
        console.log('Finished!')
    }));

    let rightRectange = canvasWrapper.addShape(SHAPE_TYPE_RECTANGLE, {
        'x': 160,
        'y': 5,
        'w': 100,
        'h': 100,
        'z': 0,
        'collision': true
    });

    rightRectange.addAction(new MoveAction(-1, 1, 200));
    rightRectange.addAction(new FunctionAction(function () {
        console.log('Finished!')
    }));

    canvasWrapper.start();
});