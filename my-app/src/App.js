import logo from './logo.svg';
import './App.css';

import React from 'react';

//For my sanity +Z comes out of the screen, Y up and X to the right.
//X = i value, Y = j value, Z = k value
class Vector {
  constructor(i, j, k) {
    this.i = i;
    this.j = j;
    this.k = k;
    this.eps = .01;
    this.magnitude = Math.sqrt(((i * i) + (j * j) + (k * k)));
  }

  normalize() {
    this.i = this.i / this.magnitude;
    this.j = this.j / this.magnitude;
    this.k = this.k / this.magnitude;
  }

  toJSColor() {
    if(this.i > 255 || this.i < 0) {
      this.i = 255;
    }
    if(this.j > 255 || this.j < 0) {
      this.j = 255;
    }
    if(this.k > 255 || this.k < 0) {
      this.k = 255;
    }
    return [this.i, this.j, this.k]
  }
  //this is where I would put my overloaded operators IF I HAD ANY
  isEqual(vector) {
    if(vector instanceof Vector) {
      if(Math.abs((this.i - vector.i)) <= this.eps
      && Math.abs((this.j - vector.j)) <= this.eps
      && Math.abs((this.k - vector.k)) <= this.eps) {
        return true;
      } else {
        return false;
      }
    }
  }

  sub(vector) {
    if(vector instanceof Vector) {
      //console.log(`This: ${this.i}, ${this.j}, ${this.k}, Subtracted: ${vector.i}, ${vector.j}, ${vector.k}`)
      //console.log(`Subtracted: ${this.i - vector.i}, ${this.j - vector.j}, ${this.k - vector.k}`)
      return new Vector(this.i - vector.i, this.j - vector.j, this.k - vector.k);
    }
  }

  add(vector) {
    if(vector instanceof Vector) {
      //console.log(`This: ${this.i}, ${this.j}, ${this.k}, Added: ${vector.i}, ${vector.j}, ${vector.k}`)
      //console.log(`Subtracted: ${this.i + vector.i}, ${this.j + vector.j}, ${this.k +  vector.k}`)
      return new Vector(this.i + vector.i, this.j + vector.j, this.k + vector.k);
    }
  }
  scalarDivide(num) {
    //console.log(`Divided: ${this.i}, ${this.j}, ${this.k}`)
    return new Vector(this.i/num, this.j/num, this.k/num);
  }

  scalarMultiply(num) {
    //console.log(`Multiplied: ${this.i * num}, ${this.j * num}, ${this.k * num}`)
    return new Vector(this.i*num, this.j*num, this.k*num);
  }

  /*Dot Product
  float Vector3::operator*(const Vector3& vector)
  {
	return (x * vector.x + y * vector.y + z * vector.z);
  }*/

  dot(vector) {
    if(vector instanceof Vector) {
      return ((this.i * vector.i) +  (this.j * vector.j) + (this.k * vector.k));
    }
  }
}

class Material {
  constructor() {

  }

  onHit(ray) {
    return new Vector (0,0,0);
  }
}

class Mirror extends Material {
  constructor() {

  }

  onHit(ray) {
    //Call upon succesful hits form a solid object only. We take the position of hint, calculate the angle and use that to calculate the bounce.
  }
}

class Matte extends Material {
  constructor() {

  }

  onHit(ray) {

  }
}

class SolidObject {
  constructor(pos, material) {
    this.xPos = pos.i;
    this.yPos = pos.j;
    this.zPos = pos.k;
    this.center = new Vector(pos.i, pos.j, pos.z);
    this.material = material;
  }

  checkForHit(ray) {
    return false;
  }
}

class Sphere extends SolidObject {
  constructor(pos, material, radius) {
    super(pos);
    this.radius = radius;
    this.center = pos;
  }

  checkForHit(ray) {
    //console.log(`Sphere Center: ${this.center.i}, ${this.center.j}, ${this.center.k}`);
    let tempVec = ray.start.sub(this.center);
   // console.log(`TempVec: ${tempVec.i}, ${tempVec.j}, ${tempVec.k}`)
    let a = ray.direction.dot(ray.direction);
    //console.log(`Ray Direction: ${ray.direction.i}, ${ray.direction.j}, ${ray.direction.k}`)
    //console.log(` a: ${a}`);
    let b = 2.0 * tempVec.dot(ray.direction);
    //console.log(` b: ${b}`);
    let c = tempVec.dot(tempVec);
    //console.log(` c: ${c}`);
    c = c - this.radius*this.radius;
    let discriminant = (b*b) - (4*a*c);
    //console.log(` d: ${discriminant}`);
    if(this.lowestDiscriminant === undefined) {
      console.log("set discriminant");
      this.lowestDiscriminant = discriminant;
      console.log(discriminant);
    }
    else if(this.lowestDiscriminant < discriminant) {
      this.lowestDiscriminant = discriminant;
      console.log(`Lowest Value: ${discriminant}`)
    }
    return discriminant > 0 ? true : false;
  }
}

class Scene {
  constructor() {
    if(!arguments) {
      this.objects = [];
    }
    this.objects = [...arguments];
  }

  addObject(object) {
    if(object instanceof SolidObject) {
      console.log(Array.isArray(this.objects));
      this.objects.push(object);
    }

  }

  get getObjects() {
    return this.objects;
  }
}

class Ray {
  constructor(vectorStart, vectorEnd) {
    this.start = vectorStart;
    this.end = vectorEnd;
    this.direction = vectorStart.sub(vectorEnd);
    //console.log(this.direction);
  }

  at(time) {
    return this.start + this.direction * time;
  }
}

class LightSource extends SolidObject {
  constructor(pos) {
    super(pos);
  }

  checkForHit(ray) {
    return false;
  }
}

export default class Raytracer extends React.Component {
  canvasRef = React.createRef();
  constructor(props) {
    super();
    //let pixelImage = new Uint8ClampedArray(props.mWidth * props.mHeight * 4);
    for(let x = 0; x < props.mWidth; x++) {
    }
    this.state = {
      sceneRendered: false,
      width: props.mWidth,
      height: props.mHeight,
      //renderImage: pixelImage,
      cameraPos: new Vector(0, 0, 0),
      cameraFocalLength: 1,
    }
    console.log("Constructor Done");
  }
  componentDidMount() {
    this.setState({ horizontal: new Vector(this.state.width, 0, 0),
                    vertical: new Vector(0, this.state.height, 0),
                    viewport: new Vector(0, 0, 0),
                    objectsList: new Scene()});
    console.log("Mounted");
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.viewport !== undefined) {
      //console.log(`Current State: ${this.state.viewport.i} ${this.state.viewport.j} ${this.state.viewport.k}`)
    }
    if(prevState.viewport !== undefined) {
      //console.log(`Previous State: ${prevState.viewport.i} ${prevState.viewport.j} ${prevState.viewport.k}`)
    }
    if(this.state.objectsList.getObjects.length == 0) {
      this.updateObjectsList(new Sphere(new Vector(0, 0, -1), null, .5));
    }
    if(this.state.viewport.isEqual(prevState.viewport)) {
      if(!this.state.sceneRendered) {
        this.renderScene();
        this.setState({sceneRendered: true});
      }
      return;
    }
    this.calculateViewport();


  }
  updateObjectsList(object) {
    this.state.objectsList.addObject(object);
    this.setState({
      objectsList: new Scene(this.state.objectsList.getObjects)
    })
  }
  calculateViewport() {
    let temp = this.state.cameraPos;
    let temp2 = this.state.horizontal.scalarDivide(2);
    let temp3 = this.state.vertical.scalarDivide(2);
    let temp4 = new Vector(0, 0, this.state.cameraFocalLength);
    let newViewport = temp.sub(temp2);
    newViewport = newViewport.sub(temp3);
    newViewport = newViewport.sub(temp4);
    //console.log(`Viewport is now: ${newViewport}`)
    this.setState({viewport: newViewport})
  }

  renderScene() {
    const canvas = this.canvasRef.current;
    if(!canvas) {
      throw new Error("WHAT");
    }
    const context = canvas.getContext("2d");
    //console.log(`Viewport: ${this.state.viewport.i}, ${this.state.viewport.j}, ${this.state.viewport.k}`);
    let time = Date.now();
    for(var x = this.state.width - 1; x > 0; x--) {
      console.log("New Scanline");
      for(var y = this.state.height - 1; y > 0; y--) {
        let u = x / (this.state.width -1);
        let v = y / (this.state.width - 1);
        //console.log(`U: ${u}`)
        //console.log(`V: ${v}`)
        let hitList = this.shootRay(u, v);
        if(hitList.length != 0) {
          let color = new Uint8ClampedArray(4);
          color[0] = 0;
          color[1] = 0;
          color[2] = 255;
          color[3] = 255;
          let imageData = new ImageData(color, 1, 1);
          context.putImageData(imageData, x, y);
        }
        else {
          let color = new Uint8ClampedArray(4);
          color[0] = 0;
          color[1] = 0;
          color[2] = 0;
          color[3] = 255;
          let imageData = new ImageData(color, 1, 1);
          context.putImageData(imageData, x, y);
        }
      }
    }
    let elapsed = ((Date.now() - time) / 1000);
    console.log(`${elapsed}s`);
  }

  updateCamera(vector) {
    this.setState(() => {
      this.state.cameraPos = vector;
    })
  }

  shootRay(targetX, targetY) {
    //Simplify the math because JAVASCRIPT WONT LET ME OVERLOAD OPERATORS


    let scalarHorizontal = this.state.horizontal.scalarMultiply(targetX);
    let scalarVertical = this.state.vertical.scalarMultiply(targetY);

    let targetVector = this.state.viewport.add(scalarHorizontal);
    targetVector = targetVector.add(scalarVertical);
    targetVector = targetVector.sub(this.state.cameraPos);
    console.log(`U: ${targetX} V: ${targetY}`)
    console.log(`Ray fired from: ${this.state.cameraPos.i}, ${this.state.cameraPos.j}, ${this.state.cameraPos.k}`)
    console.log(`to: ${targetVector.i}, ${targetVector.j}, ${targetVector.k}`)
    let ray = new Ray(this.state.cameraPos, targetVector)
    let hitObjects = [];
    for(let i = 0; i < this.state.objectsList.getObjects.length; i++) {
      this.state.objectsList.getObjects.map((element)=> {
        //console.log(element);
        return element[i].checkForHit(ray);
      })
    }
    if(hitObjects.length > 0) {
      console.log(`Objects Hit: ${hitObjects}`)
    }
    return hitObjects;
  }

  rayHit() {

  }

  updateCanvas() {
    this.setState(()=> {

    })
  }
  render() {
    return ( <canvas ref={this.canvasRef} width={this.state.width} height ={this.state.height}>

    </canvas>)
  }
}