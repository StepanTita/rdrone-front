export function encodeQueryData(data) {
    const ret = [];
    for (let d in data) {
        if (typeof data[d] === 'object' || typeof data[d] === 'array') {
            for (let arrD in data[d]) {
                ret.push(`${encodeURIComponent(d)}[]=${encodeURIComponent(data[d][arrD])}`)
            }
        } else if (typeof data[d] === 'null' || typeof data[d] === 'undefined') {
            ret.push(encodeURIComponent(d))
        } else {
            ret.push(`${encodeURIComponent(d)}=${encodeURIComponent(data[d])}`)
        }

    }
    return ret.join('&');
}