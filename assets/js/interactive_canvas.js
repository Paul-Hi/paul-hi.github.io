const ZOOM_SCALE = 1.1;
const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

class CanvasView {
    constructor(_origin, _canvasContext) {
        const identity = [1, 0, 0, 1, 0, 0];

        this.mainContext = _canvasContext;
        this.matrix = identity;
        this.scale = 1;
        this.position = _origin;
        this.dirty = true;
    }

    apply() {
        if (this.dirty) {
            this.update();
        }
        this.mainContext.setTransform(this.matrix[0], this.matrix[1], this.matrix[2], this.matrix[3], this.matrix[4], this.matrix[5]);
    }

    update() {
        this.dirty = false;
        this.matrix[3] = this.matrix[0] = this.scale;
        this.matrix[2] = this.matrix[1] = 0;
        this.matrix[4] = this.position.x;
        this.matrix[5] = this.position.y;
    }

    pan(amount) {
        if (this.dirty) {
            this.update()
        }
        this.position.x += amount.x;
        this.position.y += amount.y;
        this.dirty = true;
    }

    scaleAt(at, amount) {
        if (this.dirty) {
            this.update()
        }
        amount = this.scale * amount < 0.1 || this.scale * amount > 100.0 ? 1.0 : amount;
        this.scale *= amount;
        this.position.x = at.x - (at.x - this.position.x) * amount;
        this.position.y = at.y - (at.y - this.position.y) * amount;
        this.dirty = true;
    }
};

class InteractiveCanvas {
    constructor(_parent, _data, _maxSubCanvases) {
        this.parent = _parent;
        this.data = _data;
        this.maxSubCanvases = _maxSubCanvases;

        var box = document.createElement("div");
        box.className = "w-100 mx-auto d-flex flex-column"

        this.buttonGroup = document.createElement("div");
        this.buttonGroup.className = "bg-secondary w-100 text-center";

        this.mainCanvas = document.createElement("canvas");
        this.mainCanvas.className = "border border-tertiary mx-05"

        this.mainCanvas.width = 1280;
        this.mainCanvas.height = 720;
        this.mainCanvas.style.background = "#22222244";

        this.mainCanvas.addEventListener("mousemove", (e) => this.onPointerMove(e), { passive: true });
        this.mainCanvas.addEventListener("mousedown", (e) => this.onPointerDown(e), { passive: true });
        this.mainCanvas.addEventListener("mouseup", (e) => this.onPointerUp(e), { passive: true });
        this.mainCanvas.addEventListener("mouseout", (e) => this.onPointerUp(e), { passive: true });
        this.mainCanvas.addEventListener("wheel", (e) => this.onMouseWheelEvent(e), { passive: false });

        this.mainCanvas.addEventListener('touchmove', (e) => this.onTouch(e, (e) => this.onPointerMove(e)), { passive: false });
        this.mainCanvas.addEventListener('touchstart', (e) => this.onTouch(e, (e) => this.onPointerDown(e)), { passive: false });
        this.mainCanvas.addEventListener('touchend', (e) => this.onTouch(e, (e) => this.onPointerUp(e)), { passive: false });
        this.mainCanvas.addEventListener('touchou', (e) => this.onTouch(e, (e) => this.onPointerUp(e)), { passive: false });

        this.mainContext = this.mainCanvas.getContext("2d");
        this.mainContext.webkitImageSmoothingEnabled = false;
        this.mainContext.mozImageSmoothingEnabled = false;
        this.mainContext.imageSmoothingEnabled = false;
        this.mainView = new CanvasView({ x: this.mainCanvas.width / 2, y: this.mainCanvas.height / 2 }, this.mainContext)
        this.pointerContext = { x: 0, y: 0, dragging: false, oldPinchDistance: null };

        this.subcanvases = []
        this.subcanvasWrapper = document.createElement('div');
        this.subcanvasWrapper.className = "d-grid w-100 mb-2";
        this.subcanvasesDirty = true;

        // Buttons
        this.buttons = [];
        this.images = [];
        var subCanvasRow;
        for (let i = 0; i < this.data.images.length; i++) {
            var button = document.createElement('div');
            button.className = "btn btn-secondary border border-2 border-secondary p-2"
            button.role = "button";
            button.appendChild(document.createTextNode(this.data.images[i].title));
            button.addEventListener("click", () => {
                this.buttons[this.activeIdx].classList.remove("active"); this.activeIdx = i; this.mainView.dirty = true; this.buttons[this.activeIdx].classList.add("active");
            }, { passive: false });
            this.buttons.push(button);
            this.buttonGroup.appendChild(button);

            var img = new Image;
            img.src = this.data.images[i].image;
            this.images.push(img);

            if (i % this.maxSubCanvases == 0) {
                subCanvasRow = document.createElement("div");
                subCanvasRow.className = "row w-100 mx-auto justify-content-start";
                this.subcanvasWrapper.appendChild(subCanvasRow);
            }
            this.addSubCanvas(subCanvasRow, i);
        }

        box.appendChild(this.buttonGroup);
        box.appendChild(this.mainCanvas);
        this.parent.appendChild(box);
        this.parent.appendChild(this.subcanvasWrapper);

        this.activeIdx = 0;
        this.buttons[this.activeIdx].classList.add("active")

        Promise.all(this.images.filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = resolve; }))).then(() => {
            this.draw()
        });
    }

    addSubCanvas(subCanvasRow, i) {
        var labeledSubCanvas = document.createElement("div");
        labeledSubCanvas.className = "text-center col gy-1 gx-1 d-flex flex-column";
        var width = 1.0 / this.maxSubCanvases * 100.0;
        labeledSubCanvas.style.width = width + "%";
        labeledSubCanvas.style.maxWidth = width + "%";
        var subCanvas = document.createElement("canvas");
        subCanvas.className = "w-100 h-100 border border-tertiary";

        subCanvas.width = 128;
        subCanvas.height = 128;
        subCanvas.style.background = "#22222244";

        const ctx = subCanvas.getContext("2d");
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        var title = document.createElement("div");
        title.className = "bg-secondary w-100"
        var t = document.createElement("span");
        t.className = "interactive-title-text d-inline-block mx-1 pt-1";
        t.style.maxWidth = "95%";
        t.innerText = this.data.images[i].title;
        title.appendChild(t);
        labeledSubCanvas.appendChild(title);
        labeledSubCanvas.appendChild(subCanvas);
        subCanvasRow.appendChild(labeledSubCanvas);
        this.subcanvases.push(subCanvas);
    }

    drawMainCanvas(i) {
        this.mainContext.webkitImageSmoothingEnabled = this.mainView.scale < 4.0;
        this.mainContext.mozImageSmoothingEnabled = this.mainView.scale < 4.0;
        this.mainContext.imageSmoothingEnabled = this.mainView.scale < 4.0;

        this.mainContext.setTransform(1, 0, 0, 1, 0, 0);
        this.mainContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);

        this.mainView.apply();

        this.mainContext.drawImage(this.images[i], -this.images[i].width / 2, -this.images[i].height / 2);
    }

    draw() {
        if (this.mainView.dirty) {
            this.drawMainCanvas(this.activeIdx);
        }
        if (this.subcanvasesDirty) {
            var i = 0;
            var x = (1.0 / this.mainView.scale * (this.pointerContext.x - this.mainView.position.x)) + this.images[i].width / 2;
            var y = (1.0 / this.mainView.scale * (this.pointerContext.y - this.mainView.position.y)) + this.images[i].height / 2;
            for (const subCanvas of this.subcanvases) {
                const ctx = subCanvas.getContext("2d");
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, subCanvas.width, subCanvas.height);
                ctx.setTransform(1.0, 0, 0, 1.0, subCanvas.width / 2, subCanvas.height / 2);
                var sx = 64;
                ctx.drawImage(this.images[i], x - sx, y - sx, sx * 2, sx * 2, -(subCanvas.width) / 2, -(subCanvas.height) / 2, subCanvas.width, subCanvas.height);
                i += 1;
            }
            this.subcanvasesDirty = false;
        }

        requestAnimationFrame(() => this.draw());
    }


    getPointerPos(e) {
        var x = 0;
        var y = 0;
        if (e.touches && e.touches.length == 1) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        else if (e.clientX && e.clientY) {
            x = e.clientX;
            y = e.clientY;
        }

        var rect = this.mainCanvas.getBoundingClientRect();
        return {
            x: (x - rect.left) / (rect.right - rect.left) * this.mainCanvas.width,
            y: (y - rect.top) / (rect.bottom - rect.top) * this.mainCanvas.height
        };
    }

    onPointerDown(e) {
        this.pointerContext.dragging = true

        this.pointerContext.x = this.getPointerPos(e).x;
        this.pointerContext.y = this.getPointerPos(e).y;
    }

    onPointerUp(e) {
        this.pointerContext.dragging = false
        this.pointerContext.oldPinchDistance = null;

        this.pointerContext.x = this.getPointerPos(e).x;
        this.pointerContext.y = this.getPointerPos(e).y;
    }

    onPointerMove(e) {
        if (this.pointerContext.dragging) {
            this.mainView.pan({ x: this.getPointerPos(e).x - this.pointerContext.x, y: this.getPointerPos(e).y - this.pointerContext.y });
        }
        else {
            this.subcanvasesDirty = true;
        }

        this.pointerContext.x = this.getPointerPos(e).x;
        this.pointerContext.y = this.getPointerPos(e).y;

    }

    onMouseWheelEvent(e) {
        var x = this.getPointerPos(e).x;
        var y = this.getPointerPos(e).y;
        if (e.deltaY < 0) {
            this.mainView.scaleAt({ x, y }, ZOOM_SCALE)
        }
        else {
            this.mainView.scaleAt({ x, y }, 1.0 / ZOOM_SCALE)
        }
        e.preventDefault();
    }

    onPinch(e) {
        var touch0 = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        var touch1 = { x: e.touches[1].clientX, y: e.touches[1].clientY }

        const currentDistance = (touch0.x - touch1.x) ** 2 + (touch0.y - touch1.y) ** 2;

        if (this.pointerContext.oldPinchDistance == null) {
            this.pointerContext.oldPinchDistance = currentDistance;
        }
        else {
            var rect = this.mainCanvas.getBoundingClientRect();
            touch0.x = (touch0.x - rect.left) / (rect.right - rect.left) * this.mainCanvas.width;
            touch0.y = (touch0.y - rect.top) / (rect.bottom - rect.top) * this.mainCanvas.height;
            touch1.x = (touch1.x - rect.left) / (rect.right - rect.left) * this.mainCanvas.width;
            touch1.y = (touch1.y - rect.top) / (rect.bottom - rect.top) * this.mainCanvas.height;
            var x = (touch0.x + 0.5 * (touch1.x - touch0.x));
            var y = (touch0.y + 0.5 * (touch1.y - touch0.y));
            this.mainView.scaleAt({ x, y }, currentDistance / this.pointerContext.oldPinchDistance);
            this.pointerContext.oldPinchDistance = currentDistance;
            this.pointerContext.x = x;
            this.pointerContext.y = y;
        }
    }

    onTouch(e, singleTouchHandler) {
        if (e.touches.length == 1) {
            singleTouchHandler(e);
        }
        else if (e.type == "touchmove" && e.touches.length == 2) {
            this.pointerContext.dragging = false;
            this.onPinch(e);
        }
        this.subcanvasesDirty = true;
        e.preventDefault();
    }
}
