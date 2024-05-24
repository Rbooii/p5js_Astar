const Model_Scale = 0.4 //0 - 1 higher is harder 
const cols = 70;
const rows = cols
let grid = new Array(cols)
let openSet = [];
let closedSet = [];
let start;
let end;
let w, h;
let path = [];
let current;
let noSolution = false;

function removeArr(arr, elt) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == elt) {
            arr.splice(i, 1)
        }
    }
}

function heuristic(a, b) {
    let d = dist(a.i, a.j, b.i, b.j) //euclid pythagoras theorem
    //let d = abs(a.i - b.i) + abs(a.j - b.j)
    return d
}

function Spot(i, j) {
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.previous = undefined;
    this.wall = false

    if (random(1) < Model_Scale) {
        this.wall = true
    }

    this.show = function (col) {
        fill(col)
        if (this.wall) {
            fill(0)
           
        }
        noStroke()
        ellipse(this.i * w + w / 2, this.j * h + h / 2, w, h)

    }

    this.neighbors = [];
    this.addNeigh = function (grid) {
        if (i < cols - 1) {
            this.neighbors.push(grid[this.i + 1][this.j])
        }
        if (i > 0) {
            this.neighbors.push(grid[this.i - 1][this.j])
        }
        if (j < rows - 1) {
            this.neighbors.push(grid[this.i][this.j + 1])
        }
        if (j > 0) {
            this.neighbors.push(grid[this.i][this.j - 1])
        }
        if (i > 0 && j > 0) {
            this.neighbors.push(grid[i - 1][j - 1])
        }
        if (i < cols - 1 && j > 0) {
            this.neighbors.push(grid[i + 1][j - 1])
        }
        if (i > 0 && j < rows - 1) {
            this.neighbors.push(grid[i - 1][j + 1])
        }
        if (i < cols - 1 && j < rows - 1) {
            this.neighbors.push(grid[i + 1][j + 1])
        }
    }
}


function setup() {
    createCanvas(400, 400)

    w = width / cols
    h = height / rows

    //make 2d array
    for (let i = 0; i < cols; i++) {
        grid[i] = new Array(rows)
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = new Spot(i, j)
        }
    }
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].addNeigh(grid)
        }
    }

    start = grid[0][0]
    end = grid[cols - 1][rows - 1]
    start.wall = false
    end.wall = false

    openSet.push(start)

    console.log("A* start")
}

function draw() {
    background(255)

    if (openSet.length > 0) {
        //keep going
        let winner = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i
            }
        }
        current = openSet[winner]
        if (current === end) {
            noLoop()
            console.log("Done")
        }

        closedSet.push(current)
        removeArr(openSet, current)

        let neighbors = current.neighbors
        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i]
            if (!closedSet.includes(neighbor) && !neighbor.wall) {
                let tempG = current.g + 1
                let newPath = false
                if (openSet.includes(neighbor)) {
                    if (tempG < neighbor.g) {
                        neighbor.g = tempG
                        newPath = true
                    }
                } else {
                    neighbor.g = tempG
                    newPath = true
                    openSet.push(neighbor)
                }

                if (newPath) {
                    neighbor.h = heuristic(neighbor, end)
                    neighbor.f = neighbor.g + neighbor.h
                    neighbor.previous = current;
                }
            }
        }
    } else {
        //no solution
        console.log("no solution")
        noSolution = true
        path = []
        noLoop()
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].show(color(255))
        }
    }



    for (let i = 0; i < closedSet.length; i++) {
        closedSet[i].show(color(200, 200, 200))
    }
    for (let i = 0; i < openSet.length; i++) {
        openSet[i].show(color(66, 245, 75))
    }

    //find the path
    if (!noSolution) {
        path = [];
        let temp = current
        path.push(temp)
        while (temp.previous) {
            path.push(temp.previous)
            temp = temp.previous
        }
    }


    //for (let i = 0; i < path.length; i++) {
    //path[i].show(color(66, 230, 245))
    //}

    noFill()
    stroke("red")
    strokeWeight(w/2.3)
    beginShape()
    for (let i = 0; i < path.length; i++) {
        vertex(path[i].i * w + w / 2, path[i].j * h + h / 2)
    }
    endShape()
}


