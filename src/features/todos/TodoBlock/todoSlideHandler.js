export const pointerDownHandler = (setShowedAction, rightSideSlideEvent, leftSideSlideEvent) => (e) => {
    let node = e.target.closest(".todoBlock")
    node.setPointerCapture(e.pointerId)

    let lastPointerOffset = e.clientX
    let offset = 0
    
    node.addEventListener("touchmove", touchMoveHandler)
    node.addEventListener("mousemove", mouseMoveHandler)
    node.addEventListener("touchend", pointerUpHandler)
    node.addEventListener("mouseup", pointerUpHandler)

    node.style.transition = "none"
    
    function touchMoveHandler(e) {
        let currentPointerOffset = e.touches[0].clientX
        pointerMoveHandlerActions(currentPointerOffset)
    }
    function pointerUpHandler(e) {
        node.removeEventListener("touchmove", touchMoveHandler)
        node.removeEventListener("mousemove", mouseMoveHandler)
        node.removeEventListener("touchend", pointerUpHandler)
        node.removeEventListener("mouseup", pointerUpHandler)
        pointerUpHandlerActions()
    }
    function mouseMoveHandler(e) {
        let currentPointerOffset = e.clientX
        pointerMoveHandlerActions(currentPointerOffset)
    }
    
    function pointerMoveHandlerActions(currentPointerOffset) {
        let additionOffset = currentPointerOffset - lastPointerOffset
        
        if(offset + additionOffset >= 0) {
            setShowedAction("right")
        }

        if(offset + additionOffset < 0) {
            setShowedAction("left")
        }
        
        // if( offset + additionOffset >= node.clientWidth * 0.4 ||
        //     offset + additionOffset <= -node.clientWidth * 0.4) {
        //     return
        // }

        offset += additionOffset
        node.style.left = offset + "px"

        lastPointerOffset = currentPointerOffset

    }
    function pointerUpHandlerActions() {
        node.style.transition = "all .7s ease"

        if(offset > node.clientWidth * 0.25){
            slideNode(rightSideSlideEvent.slideTo)
            rightSideSlideEvent.action()
            return
        }
        if(offset < -node.clientWidth * 0.25){
            slideNode(leftSideSlideEvent.slideTo)
            leftSideSlideEvent.action()
            return
        }
        slideNode("zero")
    }
    async function slideNode(direction) {
        const maxOffset = node.clientWidth

        if(direction === "right") {
            node.style.left = "100%"
            return
        }
        if(direction === "left") {
            node.style.left = "-100%"
            return
        }
        if(direction === "zero") {
            node.style.left = "0"
        }
    }
}