export function useTap(onTap: any) {

    let firstTouchX = 0
    let firstTouchY = 0

    function onTouchStart(e: any) {
        firstTouchX = e.nativeEvent.pageX;
        firstTouchY = e.nativeEvent.pageY;
    }

    function onTouchEnd(e: any) {
        if (firstTouchX === e.nativeEvent.pageX && firstTouchY === e.nativeEvent.pageY) {
            onTap();
        }
    }

    return {onTouchStart, onTouchEnd};
}
