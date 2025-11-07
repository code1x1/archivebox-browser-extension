// import { initializeSnapshotsTab } from './snapshots-tab'
// import { initializeImport } from './import-tab'
// import { initializePersonasTab } from './personas-tab'
// import { initializeCookiesTab } from './cookies-tab'
// import { initializeConfigTab } from './config-tab'

// // Initialize all tabs when options page loads
// document.addEventListener('DOMContentLoaded', () => {
//     initializeSnapshotsTab()
//     initializeImport()
//     initializePersonasTab()
//     initializeCookiesTab()
//     initializeConfigTab()

//     function changeTab() {
//         if (
//             window.location.hash &&
//             window.location.hash !==
//                 document.querySelector('a.nav-link.active').id
//         ) {
//             console.log(
//                 'Changing tab based on URL hash:',
//                 window.location.hash,
//                 `a.nav-link${window.location.hash}`,
//                 document.querySelector(`a.nav-link${window.location.hash}`)
//             )
//             // document.querySelector(`a.nav-link${window.location.hash}`).click();
//         }
//     }
//     // changeTab();
//     window.addEventListener('hashchange', changeTab)

//     var tabEls = document.querySelectorAll('a.nav-link[data-bs-toggle="tab"]')
//     for (const tabEl of tabEls) {
//         tabEl.addEventListener('shown.bs.tab', function (event) {
//             console.log('ArchiveBox tab switched to:', event.target)
//             event.target // newly activated tab
//             event.relatedTarget // previous active tab
//             // window.location.hash = event.target.id;
//         })
//     }
// })

import { render } from 'preact'
import '../style/style.scss'
import { Footer } from '../../footer'
import { Navigation } from '../../navigation'
import { ImportConfig } from './sections/import-config'
import { ServerConfig } from './sections/server-config'
import { PersonasConfig } from './sections/personas-config'
import { UrlConfig } from './sections/url-config'
import { useState } from 'preact/hooks'
import { app } from '../../utils/html'
import { FcDatabase, FcFeedIn, FcManager, FcSettings } from 'react-icons/fc'

export function Options() {
    const [section, setSection] = useState<string>('url')
    return (
        <div>
            <Navigation
                sections={sections}
                active={section}
                onChange={setSection}
            />
            <div>
                {section === 'url' && <UrlConfig />}
                {section === 'server' && <ServerConfig />}
                {section === 'personas' && <PersonasConfig />}
                {section === 'import' && <ImportConfig />}
            </div>
            <Footer />
        </div>
    )
}

const sections: Parameters<typeof Navigation>[0]['sections'] = [
    {
        id: 'url',
        component: <UrlConfig />,
        label: <p>Saved URLs</p>,
        icon: <FcDatabase />,
    },
    {
        id: 'server',
        component: <ServerConfig />,
        label: <p>Server Configuration</p>,
        icon: <FcSettings />,
    },
    {
        id: 'personas',
        component: <PersonasConfig />,
        label: <p>Authentication Profiles</p>,
        icon: <FcManager />,
    },
    {
        id: 'import',
        component: <ImportConfig />,
        label: <p>Bulk Import URLs</p>,
        icon: <FcFeedIn />,
    },
]

render(<Options />, app)
