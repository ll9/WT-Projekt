var Store = {
    debug: true,
    state: {
        isLoggedIn: false,
        changedAuth: false
    },
    setMessageAction(newValue) {
        if (this.debug) console.log('setMessageAction triggered with', newValue)
        this.state.isLoggedIn = newValue
    },
    clearMessageAction() {
        if (this.debug) console.log('clearMessageAction triggered')
        this.state.isLoggedIn = ''
    }
}