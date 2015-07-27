game.ShapeObject = me.Entity.extend({
     /**
     * constructor
     */
    init: function (x, y, settings) {
        // ensure we do not create a default shape
        settings.shapes = [];
        // call the super constructor
        this._super(me.Entity, "init", [x, y, settings]);
        
        // hovering flag
        this.hover = false;
        this.selected = false;

        // to memorize where we grab the shape
        this.grabOffset = new me.Vector2d(0,0);

        //register on pointer event
        me.input.registerPointerEvent("pointerdown", this, this.onSelect.bind(this));
        me.input.registerPointerEvent("pointercancel", this, this.onRelease.bind(this));
        me.input.registerPointerEvent("pointerup", this, this.onRelease.bind(this));
        me.input.registerPointerEvent("pointerenter", this, this.onEnter.bind(this));
        me.input.registerPointerEvent("pointerleave", this, this.onLeave.bind(this));
        
        //me.input.registerPointerEvent("pointermove", this, this.onMove.bind(this));
        me.event.subscribe(me.event.MOUSEMOVE, this.onMove.bind(this));
    },

    /**
     * pointerenter function
     */
    onEnter: function (event) {
        this.hover = false;

        // the pointer event system will use the object bounding rect, check then with with all defined shapes
        for (var i = this.body.shapes.length, shape; i--, (shape = this.body.shapes[i]);) {
            if (shape.containsPoint(event.gameX - this.pos.x, event.gameY - this.pos.y)) {
                this.hover = true;
                // don't propagate the event furthermore
                return false;
            }
        }
    },

    // pointer leave function
    onLeave : function (/*event*/) {
        this.hover = false;
    },


    // pointer down function
    onSelect : function (event) {
        if (this.hover === true) {

            me.game.world.moveToTop(this);

            // the pointer event system will use the object bounding rect, check then with with all defined shapes
            for (var i = this.body.shapes.length, shape; i--, (shape = this.body.shapes[i]);) {
                if (shape.containsPoint(event.gameX - this.pos.x, event.gameY - this.pos.y)) {
                    this.grabOffset.set(event.gameX, event.gameY);
                    this.grabOffset.sub(this.pos);
                    this.selected = true;
                    // don't propagate the event furthermore
                    return false;
                }
            }
        }
    },

    // mouse up function
    onRelease : function (/*event*/) {
        if (this.selected === true) {
            this.selected = false;
            // don't propagate the event furthermore
            return false;
        }
    },

    /**
     * pointermove function
     */
    onMove: function (event) {
        if (this.selected === true) {
            // follow the mouse/finger
            this.pos.set(event.gameX, event.gameY, this.pos.z);
            this.pos.sub(this.grabOffset);
        }
    },

    /**
     * update function
     */
    update: function () {
        return this.hover || this.selected;
    },

    /**
     * draw the square
     */
    draw: function (renderer) {
        renderer.setGlobalAlpha(this.hover ? 1.0 : 0.5);
        this._super(me.Entity, "draw", [renderer]);
        renderer.setGlobalAlpha(1.0);
    }
});



game.Circle = game.ShapeObject.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        // call the super constructor
        this._super(game.ShapeObject, "init", [x, y, settings]);

        // add an ellipse shape
        this.body.addShape(new me.Ellipse(this.width/2, this.height/2, this.width, this.height));

        // tomato
        this.renderable = new me.Sprite(0, 0, {image: me.loader.getImage("orange")});
    }
});

game.Poly = game.ShapeObject.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        // call the super constructor
        this._super(game.ShapeObject, "init", [x, y, settings]);

        // add all PE shapes to the body
        this.body.addShapesFromJSON(me.loader.getJSON("shapesdef1"), settings.sprite);

        // add the star sprite
        this.renderable = new me.Sprite(0, 0, {image: me.loader.getImage(settings.sprite)});
    },
});


 game.Poly2 = game.ShapeObject.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        // call the super constructor
        this._super(game.ShapeObject, "init", [x, y, settings]);

        // add all PE shapes to the body
        this.body.addShapesFromJSON(me.loader.getJSON("shapesdef2"), settings.sprite, settings.width);

        // add the star sprite
        this.renderable = new me.Sprite(0, 0, {image: me.loader.getImage(settings.sprite)});
    }
});
