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
    constructor(_parent, _data) {
        this.parent = _parent;
        this.data = _data;

        var box = document.createElement("div");
        box.className = "w-100 border border-tertiary text-center d-flex flex-column"

        var dataset = document.createElement("div");
        dataset.className = "bg-secondary";
        var t = document.createElement("span");
        t.innerText = this.data.dataset;
        t.color = "white";
        t.style.fontSize = " x-large";
        dataset.appendChild(t);

        this.buttonGroup = document.createElement("div");
        this.buttonGroup.className = "bg-secondary w-100 align-items-center";

        this.mainCanvas = document.createElement("canvas");
        this.mainCanvas.className = "border border-tertiary w-100 h-100"

        this.mainCanvas.width = 1280;
        this.mainCanvas.height = 720;
        this.mainCanvas.style.background = "#22222244";

        this.mainCanvas.addEventListener("mousemove", (e) => this.onMouseEvent(e), { passive: true });
        this.mainCanvas.addEventListener("mousedown", (e) => this.onMouseEvent(e), { passive: true });
        this.mainCanvas.addEventListener("mouseup", (e) => this.onMouseEvent(e), { passive: true });
        this.mainCanvas.addEventListener("mouseout", (e) => this.onMouseEvent(e), { passive: true });
        this.mainCanvas.addEventListener("wheel", (e) => this.onMouseWheelEvent(e), { passive: false });

        this.mainContext = this.mainCanvas.getContext("2d");
        this.mainContext.webkitImageSmoothingEnabled = false;
        this.mainContext.mozImageSmoothingEnabled = false;
        this.mainContext.imageSmoothingEnabled = false;
        this.mainView = new CanvasView({ x: this.mainCanvas.width / 2, y: this.mainCanvas.height / 2 }, this.mainContext)
        this.mouseContext = { x: 0, y: 0, oldX: 0, oldY: 0, button: false };

        this.subcanvases = []
        this.subcanvasWrapper = document.createElement('div');
        this.subcanvasWrapper.className = "d-flex flex-wrap justify-content-center w-100";
        this.subcanvasesDirty = true;

        // Buttons
        this.buttons = [];
        this.images = [];
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

            this.addSubCanvas(i);
        }

        box.appendChild(dataset);
        box.appendChild(this.buttonGroup);
        box.appendChild(this.mainCanvas);
        this.parent.appendChild(box);
        this.parent.appendChild(this.subcanvasWrapper);

        this.activeIdx = 0;
        this.buttons[this.activeIdx].classList.add("active")
        this.images[this.images.length - 1].onload = () => this.draw();
    }

    addSubCanvas(i) {
        var labeledSubCanvas = document.createElement("div");
        labeledSubCanvas.className = "w-25 border border-tertiary text-center d-flex flex-column mt-1"
        var subCanvas = document.createElement("canvas");
        subCanvas.className = "w-100 h-100 border border-tertiary"

        subCanvas.width = 256;
        subCanvas.height = 256;
        subCanvas.style.background = "#22222244";

        const ctx = subCanvas.getContext("2d");
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        var title = document.createElement("div");
        title.className = "bg-secondary"
        title.appendChild(document.createTextNode(this.data.images[i].title));
        labeledSubCanvas.appendChild(title);
        labeledSubCanvas.appendChild(subCanvas);
        this.subcanvasWrapper.appendChild(labeledSubCanvas);
        this.subcanvases.push(subCanvas);
    }

    drawMainCanvas(i) {
        this.mainContext.webkitImageSmoothingEnabled = this.mainView.scale < 4.0;
        this.mainContext.mozImageSmoothingEnabled = this.mainView.scale < 4.0;
        this.mainContext.imageSmoothingEnabled = this.mainView.scale < 4.0;

        this.mainContext.setTransform(1, 0, 0, 1, 0, 0);
        this.mainContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
        this.drawCanvasBackground(this.mainContext, this.mainCanvas.width, this.mainCanvas.height, this.mainView.scale);

        this.mainView.apply();

        this.mainContext.drawImage(this.images[i], -this.images[i].width / 2, -this.images[i].height / 2);
    }

    draw() {
        if (this.mainView.dirty) {
            this.drawMainCanvas(this.activeIdx);
        }
        if (this.subcanvasesDirty) {
            var i = 0;
            var x = (1.0 / this.mainView.scale * (this.mouseContext.x - this.mainView.position.x)) + this.images[i].width / 2;
            var y = (1.0 / this.mainView.scale * (this.mouseContext.y - this.mainView.position.y)) + this.images[i].height / 2;
            for (const subCanvas of this.subcanvases) {
                const ctx = subCanvas.getContext("2d");
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, subCanvas.width, subCanvas.height);
                this.drawCanvasBackground(ctx, subCanvas.width, subCanvas.height, 1.0);
                ctx.setTransform(1.0, 0, 0, 1.0, subCanvas.width / 2, subCanvas.height / 2);
                var sx = 100;
                ctx.drawImage(this.images[i], x - sx, y - sx, sx * 2, sx * 2, -(subCanvas.width) / 2, -(subCanvas.height) / 2, subCanvas.width, subCanvas.height);
                i += 1;
            }
            this.subcanvasesDirty = false;
        }

        requestAnimationFrame(() => this.draw());
    }

    drawCanvasBackground(ctx, w, h, scale) {
        const cellSize = 20;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.1;
        ctx.strokeStyle = "#000000";

        for (let x = (this.mainView.position.x % cellSize) * scale; x <= w; x += cellSize * scale) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
        }

        for (let y = (this.mainView.position.y % cellSize) * scale; y <= h; y += cellSize * scale) {
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
        }

        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }


    getMousePos(e) {
        var rect = this.mainCanvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) / (rect.right - rect.left) * this.mainCanvas.width,
            y: (e.clientY - rect.top) / (rect.bottom - rect.top) * this.mainCanvas.height
        };
    }

    onMouseEvent(e) {
        if (e.type === "mousedown") {
            this.mouseContext.button = true
        }
        if (e.type === "mouseup" || e.type === "mouseout") {
            this.mouseContext.button = false
        }

        this.mouseContext.oldX = this.mouseContext.x;
        this.mouseContext.oldY = this.mouseContext.y;

        this.mouseContext.x = this.getMousePos(e).x;
        this.mouseContext.y = this.getMousePos(e).y

        this.subcanvasesDirty = true;

        if (this.mouseContext.button) {
            this.mainView.pan({ x: this.mouseContext.x - this.mouseContext.oldX, y: this.mouseContext.y - this.mouseContext.oldY });
        }
    }

    onMouseWheelEvent(e) {
        var x = this.getMousePos(e).x;
        var y = this.getMousePos(e).y;
        if (e.deltaY < 0) {
            this.mainView.scaleAt({ x, y }, ZOOM_SCALE)
        }
        else {
            this.mainView.scaleAt({ x, y }, 1.0 / ZOOM_SCALE)
        }
        e.preventDefault();
    }
}
