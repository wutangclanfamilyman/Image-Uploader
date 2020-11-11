const appLoaded = () => {
    return {
        type: 'APP_LOADED'
    }
}

const imageLoading = () => {
    return {
        type: 'IMAGE_LOADING'
    }
}

const imageLoaded = (file) => {
    return {
        type: 'IMAGE_LOADED',
        payload: file
    }
}

export {
    appLoaded,
    imageLoaded,
    imageLoading
}