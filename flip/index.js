const container = document.getElementById('container');
let sourceNode;
let f;
container.ondragstart = (e) => {
  setTimeout(() => {
    e.target.classList.add('moving');
  }, 0)
  e.dataTransfer.effectAllowed = 'move';
  sourceNode = e.target;
  f = new Flip(container.children, 0.3)
}

// 浏览器是默认不允许元素拖拽到自身上的
container.ondragenter = (e) => {
  e.preventDefault();
  if (e.target === container || e.target === sourceNode) {
    return;
  }
  const children = [...container.children];
  const sourceIndex = children.indexOf(sourceNode);
  const targetIndex = children.indexOf(e.target);
  if (sourceIndex < targetIndex) {
    // console.log('向后')
    container.insertBefore(sourceNode, e.target.nextElementSibling);
  } else {
    // console.log('向前')
    container.insertBefore(sourceNode, e.target);
  }
  f.play();
  // console.log('dragenter: ', e.target)
}

container.ondragover = (e) => {
  e.preventDefault();
}

container.ondragend = (e) => {
  e.target.classList.remove('moving');
}