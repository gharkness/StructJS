function Dictionary() {
    this.neighbors = {};
    this.add = function(key,value) {
        this.neighbors[key] = value;
    };
    this.get = function(key) {
        return this.neighbors[key];
    };
    this.remove = function(key) {
        delete this.neighbors[key];
    };
}
