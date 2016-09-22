function Node(value) {
    this.value = value;
    var neighbors = [];
    this.getNeighbors = () => {
        return neighbors;
    }
}
