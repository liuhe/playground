{
    let min = toMinuteString()
    do{
        checkFaceTime()
        delay(3)
    }while(toMinuteString(new Date(new Date().getTime() + 5000)) === min)
}

function checkFaceTime(){
    const FACETIME_CALLER_WHITELIST = ["+86 138 0013 8000", "test@icloud.com"]

    let seApp = Application("System Events")

    let ncWinCount = seApp.processes.whose({name:"NotificationCenter"}).windows.length
    if(ncWinCount === 0){
        log("no NotificationCenter window.")
        return
    // }else{
    //     log(`ncWin count: ${ncWinCount}`)
    //     dumpUIElementStructure(seApp.processes.whose({name:"NotificationCenter"}).windows[0].uiElements[0], "#")
    }
    let winIdx = makeIndexRangeArray(ncWinCount).find(winIdx=>{
        /**@type string[] */
        let ncTexts = cleanText(seApp.processes.whose({name:"NotificationCenter"}).windows[winIdx].scrollAreas[0].uiElements[0].groups[0].uiElements.name()).split(",")
        // 返回的字符串里面前后可能会有奇怪字符，处理一下
        ncTexts = ncTexts.map(t=>t.replaceAll(/[^\x21-\x7E]/ig, ""))

        if(!ncTexts.find(t=>t.indexOf("FaceTime")>=0) || !ncTexts.find(t=>t.indexOf("Accept")>=0)){
            log(`ncWin#${winIdx} not FaceTime Accept: ${ncTexts}`)
            return
        }

        if(!(FACETIME_CALLER_WHITELIST.find(c=>ncTexts.find(t=>{
            if(t.indexOf(c)>=0){
                log(`ncWin#${winIdx} ${t} is calling...`)
                return true
            }
        })))){
            log(`ncWin#${winIdx} FaceTime caller not in whitelist(${FACETIME_CALLER_WHITELIST}): ${ncTexts}`)
            return
        }

        return true
    })
    if(!(winIdx >= 0)){
        return
    }

    try{
        seApp.processes.whose({name:"NotificationCenter"}).windows[winIdx].scrollAreas[0].uiElements[0].groups[0].buttons.whose({name:"Accept"})[0].click()
        log("Accepted.")

        for(let i = 0; i < 5; ++i){
            delay(3)
            /**@type number[] */
            // let position = Automation.getDisplayString(seApp.processes.whose({name:"FaceTime"}).windows[0].position(), true).split(",").map(p=>parseInt(p))
            // if position[1] > 30 && 
            if(cleanText(seApp.processes.whose({name:"FaceTime"}).windows[0].buttons.whose({subrole:"AXFullScreenButton"}).actions.whose({name:"AXPress"}).name())){
                seApp.processes.whose({name:"FaceTime"}).windows[0].buttons.whose({subrole:"AXFullScreenButton"})[0].click()
                log("Window maximized.")
                break
            }else{
                log("Waiting for window to maximize...")
            }
        }
    }catch(ex){
        log(`error: ${ex}`)
    }
}

// function printStringCharcode(/**@type string*/str){
//     let charcodes = []
//     for(let i = 0; i < str.length; ++i){
//         charcodes.push(str.charCodeAt(i))
//     }
//     log(`${str} codes: ${charcodes}`)
// }

function log(message){
    console.log(`${toSecondString()} ${message}`)
}

function toSecondString(date){
    return new Date((date || new Date()).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 19).replace("T", " ")
}

function toMinuteString(date){
    return toSecondString(date).substring(0, 16)
}

/**@return number[] */
function makeIndexRangeArray(len){
    let arr = []
    for(let i = 0; i < len; ++i){
        arr.push(i)
    }
    return arr
}

function dumpUIElementStructure(/**@type UIElement*/elm, /**@type string*/prefix){
    let desc = cleanText(elm.description())
    let name = cleanText(elm.name())
    if(desc === "text" || desc === "button"){
        log(`${prefix} ${desc} => ${name}`)
    }else{
        log(`${prefix} ${desc} ${name} => ${elm.uiElements.length}`)
        for(let i = 0; i < elm.uiElements.length; ++i){
            dumpUIElementStructure(elm.uiElements[i], prefix + "#")
        }
    }
}

function cleanText(textSpecifier){
    let displayStr = Automation.getDisplayString(textSpecifier, true).replaceAll(/[^\x21-\x7E]/ig, "")
    return displayStr
}
