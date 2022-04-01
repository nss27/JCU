export const isNull = data => data == undefined || data == null || data == ''
export const rootPath = () => {
    switch(window.location.host) {
        case 'nss27.github.io':
            return `${window.location.origin}/JCU`
        default:
            return window.location.origin
    }
}