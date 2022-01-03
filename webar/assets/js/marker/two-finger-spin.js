AFRAME.registerComponent('two-finger-spin', {
    schema: {
      factor: {default: 5}
    },
    init: function() {
      this.handleEvent = this.handleEvent.bind(this)
      this.el.sceneEl.addEventListener('onefingermove', this.handleEvent)
    },
    remove: function() {
      this.el.sceneEl.removeEventListener('onefingermove', this.handleEvent)
    },
    handleEvent: function(event) {
      // this.el.object3D.rotation.z += event.detail.positionChange.x * this.data.factor
      let rotate = event.detail.positionChange.x * this.data.factor
      this.el.object3D.rotateOnAxis( new THREE.Vector3(0,1,0), rotate);
      // alert(rotate)
    }
  })