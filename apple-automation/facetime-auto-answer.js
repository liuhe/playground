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
    /**@type string[] */
	let ncTexts = Automation.getDisplayString(seApp.processes.whose({name:"NotificationCenter"}).windows[0].scrollAreas[0].uiElements.groups.uiElements.name(), true).split(",")
    // 返回的字符串里面前后可能会有奇怪字符，处理一下
    ncTexts = ncTexts.map(t=>t.replaceAll(/[^\x21-\x7E]/ig, ""))

    if(!ncTexts.find(t=>t.indexOf("FaceTime")>=0) || !ncTexts.find(t=>t.indexOf("Accept")>=0)){
        log(`FaceTime Accept window not found: ${ncTexts}`)
        return
    }

    if(!(FACETIME_CALLER_WHITELIST.find(c=>ncTexts.find(t=>{
        if(t.indexOf(c)>=0){
            log(`${t} is calling...`)
            return true
        }
    })))){
        log(`FaceTime caller not in whitelist(${FACETIME_CALLER_WHITELIST}): ${ncTexts}`)
        return
    }

    try{
        seApp.processes.whose({name:"NotificationCenter"}).windows[0].scrollAreas[0].uiElements.groups.buttons.whose({name:"Accept"})[0].click()
        log("Accepted.")

        for(let i = 0; i < 5; ++i){
            delay(3)
            /**@type number[] */
            let position = Automation.getDisplayString(seApp.processes.whose({name:"FaceTime"}).windows[0].position(), true).split(",").map(p=>parseInt(p))
            if(position[1] > 30 && Automation.getDisplayString(seApp.processes.whose({name:"FaceTime"}).windows[0].buttons.whose({subrole:"AXFullScreenButton"}).actions.whose({name:"AXPress"}).name(), true)){
                seApp.processes.whose({name:"FaceTime"}).windows[0].buttons.whose({subrole:"AXFullScreenButton"}).actions.whose({name:"AXPress"})[0].perform()
                log("Window maximized.")
                break
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
