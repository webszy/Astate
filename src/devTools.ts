// @ts-ignore
import {setupDevtoolsPlugin} from '@vue/devtools-api'
import {realState_type} from "./utils";

const initDevtools =   (app:any,store:realState_type) => {
    const stateType = 'routing properties'
    const INSPECTOR_ID = 'OnlyState-inspector'
    setupDevtoolsPlugin({
        id: 'org.webszy.onlystate',
        app,
        label: 'OnlyState',
        packageName: 'OnlyState',
        homepage: 'https://github.com/webszy/only-state',
        logo: 'https://vuejs.org/images/icons/favicon-96x96.png',
        componentStateTypes: [
            stateType
        ]
    }, (api:any) => {
        // Use the API here
        setInterval(() => {
            api.sendInspectorState(INSPECTOR_ID)
        }, 5000)
        api.addInspector({
            id: INSPECTOR_ID,
            label: 'OnlyState',
            icon: 'collections_bookmark'
        })
        api.on.getInspectorTree((payload:any) => {
            if (payload.inspectorId === INSPECTOR_ID) {
                payload.rootNodes = [{
                    id: 'root',
                    label: 'OnlyState',
                    children: []
                }]
            }
        })
        api.on.getInspectorState((payload:any) => {
            if (payload.nodeId === 'root') {
                const getters:any[] = []
                if(store.getters){
                    Object.keys(store.getters).forEach((key:string) => {
                        getters.push({
                            key,
                            value:store.getters[key].value
                        })
                    })
                }

                const state:any[] = []
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
