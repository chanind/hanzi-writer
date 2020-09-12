const VERSION = "2.0";
const getCharDataUrl = (char: any) => `https://cdn.jsdelivr.net/npm/hanzi-writer-data@${VERSION}/${char}.json`;

export default function defaultCharDataLoader(
    char: string,
    onLoad: (parsedJson: {}) => void,
    onError: (error?: any) => void,
) {
    // load char data from hanziwriter cdn (currently hosted on jsdelivr)
    fetch(getCharDataUrl(char))
        .then((response) => {
            if (!response.ok) {
                Promise.reject(response);
            }
            return response.json();
        })
        .then(onLoad)
        .catch(onError);
}
