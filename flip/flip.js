const Flip = (function () {
  class FlipDom {
    constructor(dom, duration = 0.5) {
      this.dom = dom;
      this.transition = typeof duration === 'number' ? `${duration}s` : duration;
      this.firstPosition = {
        x: null,
        y: null,
      }
      this.isPlaying = false;
      this.transitionEndHandler = () => {
        this.isPlaying = false;
        this.recordFirst();
      }
    }

    getDomPosition() {
      const rect = this.dom.getBoundingClientRect();
      return {
        x: rect.left,
        y: rect.top,
      }
    }

    recordFirst(firstPosition) {
      if (!firstPosition) {
        firstPosition = this.getDomPosition();
      }
      this.firstPosition.x = firstPosition.x;
      this.firstPosition.y = firstPosition.y;
    }

    *play() {
      // if (this.dom.classList.contains('touching')) {
      //   return
      // }
      if (!this.isPlaying) {
        const lastPosition = this.getDomPosition();
        const dis = {
          x: lastPosition.x - this.firstPosition.x,
          y: lastPosition.y - this.firstPosition.y,
        }
        if (!dis.x && !dis.y) {
          return
        }
        this.dom.style.transition = 'none';
        this.dom.style.transform = `translate(${-dis.x}px, ${-dis.y}px)`
        yield 'moveToFirst';
        this.isPlaying = true;
      }

      const isMoving = this.dom.classList.contains('moving');

      setTimeout(() => {
        this.dom.style.transition = isMoving ? 'none' : this.transition;
        this.dom.style.transform = `none`;
        this.dom.removeEventListener('transitionend', this.transitionEndHandler);
        this.dom.addEventListener('transitionend', this.transitionEndHandler);
      }, 0)
    }
  }

  class Flip {
    constructor(dom, duration = 0.5) {
      this.flipDoms = [...dom].map((it) => new FlipDom(it, duration));
      this.flipDoms = new Set(this.flipDoms);
      this.duration = duration;
      this.flipDoms.forEach((it) => it.recordFirst());
    }

    addDom(dom, firstPosition) {
      const flipDom = new FlipDom(dom, this.duration);
      this.flipDoms.add(flipDom);
      flipDom.recordFirst(firstPosition);
    }

    play() {
      let gs = [...this.flipDoms].map((it) => {
        const generator = it.play();
        return {
          generator,
          iteratorResult: generator.next()
        }
      }).filter((g) => {
        return !g.iteratorResult.done
      });


      while (gs.length > 0) {
        gs = gs.map((g) => {
          g.iteratorResult = g.generator.next();
          return g
        }).filter((g) => !g.iteratorResult.done);
      }
    }
  }

  return Flip;
})()