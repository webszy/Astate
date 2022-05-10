import {setupDevtoolsPlugin} from '@vue/devtools-api'

const initDevtools =   (app,store) => {
    const stateType = 'routing properties'
    const INSPECTOR_ID = 'zState-inspector'
    setupDevtoolsPlugin({
        id: 'org.webszy.zState',
        app,
        label: 'zState',
        packageName: 'zState',
        homepage: 'https://github.com/webszy/zState',
        logo: 'https://vuejs.org/images/icons/favicon-96x96.png',
        componentStateTypes: [
            stateType
        ]
    }, api => {
        // Use the API here
        setInterval(() => {
            api.sendInspectorState(INSPECTOR_ID)
        }, 5000)
        api.addInspector({
            id: INSPECTOR_ID,
            label: 'zState',
            icon: 'collections_bookmark'
        })
        api.on.getInspectorTree((payload, context) => {
            if (payload.inspectorId === INSPECTOR_ID) {
                payload.rootNodes = [{
                    id: 'root',
                    label: 'zState',
                    children: []
                }]
            }
        })
        api.on.getInspectorState((payload, context) => {
            if (payload.nodeId === 'root') {
                const getters = []
                Object.keys(store.getters).forEach(key => {
                    getters.push({
                        key,
                        value:store.getters[key].value
                    })
                })

                const state = []
                Object.keys(store.state).forEach(key => {
                    state.push({
                        key,
                        value:store.state[key],
                        editable: true
                    })
                })

                payload.state = {
                    state,
                    getters
                }
            }

        })
    })

}
export default initDevtools
