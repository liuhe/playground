function getNodesByXPath(xpath, contextNode){
    let r = document.evaluate(xpath, (contextNode || document), null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null)
    let nodes = []
    for(let n = r.iterateNext(); n; n = r.iterateNext()){
        nodes.push(n)
    }
    return nodes
}

// getNodesByXPath("//nav/div/div/a").map(n=>n.innerText)
