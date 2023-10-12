const container = document.getElementById('container');
let sourceNode;
let f;
let isMoving = false;
const scrollGap = 10

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
  // console.log('e: ', container.clientHeight, container.scrollHeight)
  // console.log('move: ', e.clientY)
  const { clientY } = e
  const { clientHeight, scrollHeight, scrollTop } = container
  if (scrollHeight <= clientHeight) return
  if (scrollTop + clientHeight === scrollHeight) {
    // console.log('到底了')
    return
  }
  if (clientHeight - clientY < 80) {
    // console.log('到下边界了')
    container.scrollTop += scrollGap
  }
  if (clientY < 80 && scrollTop !== 0) {
    // console.log('向上')
    container.scrollTop -= scrollGap
  }
}

container.ondragend = (e) => {
  e.target.classList.remove('moving');
}

