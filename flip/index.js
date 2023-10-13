const container = document.getElementById('container');
let sourceNode;
let f;
let isMoving = false;
let initialX, initialY;
let offsetX, offsetY;
const scrollGap = 5

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

container.ontouchstart = (e) => {
  if (e.target === container) {
    return
  }

  sourceNode = e.target
  sourceNode.classList.add('touching')
  isMoving = true
  const touch = e.touches[0]

  initialX = touch.clientX
  initialY = touch.clientY

  offsetX = initialX - sourceNode.offsetLeft
  offsetY = initialY - sourceNode.offsetTop

  // f = new Flip(container.children, 0.3)
};

container.ontouchmove = (e) => {
  if (!isMoving) return
  if (e.target !== container) {
    e.preventDefault()
  }
  const touch = e.touches[0]

  const disX = touch.clientX - initialX
  const disY = touch.clientY - initialY

  sourceNode.style.transform = `translate(${disX}px, ${disY}px)`;

  const children = [...container.children];

  children.forEach((item, index) => {
    if (item !== sourceNode) {
      const crossRect = item.getBoundingClientRect()
      if (touch.clientX - crossRect.x > 0 && touch.clientX - crossRect.x < 80 && touch.clientY - crossRect.y > 0 && touch.clientY - crossRect.y < 80) {
        const sourceIndex = children.indexOf(sourceNode);
        const targetIndex = index;
        const sourceRow = Math.floor(sourceIndex / 3)
        const targetRow = Math.floor(targetIndex / 3)
        const sourceColumn = sourceIndex % 3
        const targetColumn = targetIndex % 3
        if (sourceIndex < targetIndex) {
          console.log('向后')
          container.insertBefore(sourceNode, item.nextElementSibling);
        } else {
          console.log('向前')
          container.insertBefore(sourceNode, item);
        }
        sourceNode.style.transform = 'none';
        if (sourceRow === targetRow) {
          initialX = initialX + 100 * (targetColumn - sourceColumn)
        } else {
          if (sourceColumn !== targetColumn) {
            initialX = initialX + 100 * (targetColumn - sourceColumn)
          }
          initialY = initialY + 100 * (targetRow - sourceRow)
        }

        // f.play();

      }
    }
  })

}

container.ontouchend = (e) => {
  isMoving = false
  sourceNode.style.transform = 'none'
  sourceNode.classList.remove('touching')
}
