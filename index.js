let startButton = document.getElementById('start')
var time = {
    hour: 0,
    minute: 0,
    minuteCsec: 0,
    second: 0,
    csecond: 0,
}

var toggleState = 'START';
var startStop = null;
function toggle() {
    let timer = document.getElementById('timer')
    let buttonStart = document.getElementById('start')
    let buttonContinue = document.getElementById('continue')
    let buttonReset = document.getElementById('reset')
    let ghostCard = document.getElementById('ghostCard')

    const controlState = {
        START: function() {
            activateCard() 
            startInterval()
            nextState('PAUSE')
        },
        PAUSE: function() {
            pauseCard()
            stopInterval()
            paused()
        },
        STOP: function() {
            deactivateCard()
            stopInterval()
            clearTimer()
            updateGhost()
            nextState('START')
        }
    }

    const control = controlState[toggleState]

    function activateCard() {
        buttonStart.innerHTML = 'Stop'
        buttonStart.classList.remove('none')
        buttonReset.classList.add('none')
        buttonContinue.classList.add('none')
    }

    function pauseCard() {
        buttonStart.classList.add('none')
        buttonContinue.classList.remove('none')
        buttonReset.classList.remove('none')
    }

    function paused() {
        function handleReset() {
            nextState('STOP')
            removeEventListener()
            controlState[toggleState]()
        }

        function handleContinue() {
            nextState('START')
            removeEventListener()
            controlState[toggleState]()
        }

        function removeEventListener() {
            buttonReset.removeEventListener('click', handleReset)
            buttonContinue.removeEventListener('click', handleContinue)
        }

        buttonContinue.addEventListener('click', handleContinue)
        buttonReset.addEventListener('click', handleReset)
    }

    function deactivateCard() {
        buttonStart.innerHTML = 'Start'
        buttonReset.classList.add('none')
        buttonStart.classList.remove('none')
        buttonContinue.classList.add('none')
    }
    
    function clearTimer() {
        timer.innerHTML = '00:00:00'
        time = {
            hour: 0,
            minute: 0,
            minuteCsec: 0,
            second: 0,
            csecond: 0,
        }
    }
    
    function updateGhost() {
        ghostCard.style.height = `${(time.minuteCsec / 6000)* 100}%`
        ghostCard.style.width = `${(time.minuteCsec / 6000) * 100}%`
    }

    function renderTimer() {
        let hourString = time.hour < 10 ? '0' + time.hour : time.hour
        let minuteString = time.minute < 10 ? '0' + time.minute : time.minute
        let secondString = time.second < 10 ? '0' + time.second : time.second
        let timeString = hourString + ':' + minuteString + ':' + secondString
        
        timer.innerHTML = timeString
    }

    function updateTimer() {
        time.csecond++
        time.minuteCsec++
        updateGhost()

        if (time.csecond == 100) {
            time.csecond = 0
            time.second++
            renderTimer()
        }

        if (time.second == 60) {
            time.second = 0
            time.minute++
            time.minuteCsec = 0
        }
        
        if (time.minute == 60) {   
            time.minute = 0
            time.hour++
        }
        
        if (time.hour == 99)
            clearTimer()
    }

    function startInterval() {
        startStop = window.setInterval(updateTimer, 10) 
    }

    function stopInterval() {
        window.clearInterval(startStop)
        startStop = null
    }

    function nextState(state) {
        toggleState = state
    }

    control()
}

startButton.addEventListener('click', toggle)