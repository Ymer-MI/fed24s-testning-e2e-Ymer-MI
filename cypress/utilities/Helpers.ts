export default {
    HTMLEntity: (() => ({
            decode: (str: string) => new DOMParser().parseFromString(str, 'text/html').documentElement.textContent
        })
    )()
}