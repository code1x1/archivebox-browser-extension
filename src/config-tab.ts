// Config tab initialization and handlers
import browser from 'webextension-polyfill'

import {
    Snapshot,
    updateStatusIndicator,
    getArchiveBoxServerUrl,
    addToArchiveBox,
} from './utils'

export async function initializeConfigTab() {
    const configForm = document.getElementById('configForm')
    const serverUrl = document.getElementById('archivebox_server_url')
    const apiKey = document.getElementById('archivebox_api_key')
    const matchUrls = document.getElementById('match_urls')
    const excludeUrls = document.getElementById('exclude_urls')

    // Load saved values
    const archivebox_server_url = await getArchiveBoxServerUrl()
    const {
        archivebox_api_key = '',
        match_urls = '',
        exclude_urls = '',
        enable_auto_archive = false,
    } = await browser.storage.local.get([
        'archivebox_api_key',
        'match_urls',
        'exclude_urls',
        'enable_auto_archive',
    ])
    console.log(
        'Got config values from storage:',
        archivebox_server_url,
        archivebox_api_key,
        match_urls,
        exclude_urls,
        enable_auto_archive
    )

    // Migrate old config_archiveboxBaseUrl to archivebox_server_url
    const { config_archiveBoxBaseUrl } = await browser.storage.sync.get(
        'config_archiveboxBaseUrl'
    )
    if (config_archiveBoxBaseUrl) {
        await browser.storage.local.set({
            archivebox_server_url: config_archiveBoxBaseUrl,
        })
    }

    serverUrl.value = archivebox_server_url || ''
    apiKey.value = archivebox_api_key || ''
    matchUrls.value = typeof match_urls === 'string' ? match_urls : ''
    excludeUrls.value = typeof exclude_urls === 'string' ? exclude_urls : ''

    // Set the auto-archive toggle state
    const autoArchiveCheckbox = document.getElementById('enable_auto_archive')
    autoArchiveCheckbox.checked = !!enable_auto_archive

    // Server test button handler
    document
        .getElementById('testServer')
        .addEventListener('click', async () => {
            const statusIndicator = document.getElementById('serverStatus')
            const statusText = document.getElementById('serverStatusText')

            // Check if we have permission to access the server
            const permission = await browser.permissions.request({
                permissions: ['cookies'],
                origins: [`${serverUrl.value}/*`],
            })
            if (!permission) {
                alert('Permission denied.')
                return
            }

            // Test request to server.
            try {
                let response = await fetch(`${serverUrl.value}/api/`, {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'omit',
                })

                // fall back to pre-v0.8.0 endpoint for backwards compatibility
                if (response.status === 404) {
                    response = await fetch(`${serverUrl.value}`, {
                        method: 'GET',
                        mode: 'cors',
                        credentials: 'omit',
                    })
                }

                if (response.ok) {
                    updateStatusIndicator(
                        statusIndicator,
                        statusText,
                        true,
                        '✓ Server is reachable'
                    )
                } else {
                    updateStatusIndicator(
                        statusIndicator,
                        statusText,
                        false,
                        `✗ Server error: ${response.status} ${response.statusText}`
                    )
                }
            } catch (err) {
                updateStatusIndicator(
                    statusIndicator,
                    statusText,
                    false,
                    `✗ Connection failed: ${err.message}`
                )
            }
        })

    // API key test button handler
    document
        .getElementById('testApiKey')
        .addEventListener('click', async () => {
            const statusIndicator = document.getElementById('apiKeyStatus')
            const statusText = document.getElementById('apiKeyStatusText')

            try {
                const response = await fetch(
                    `${serverUrl.value}/api/v1/auth/check_api_token`,
                    {
                        method: 'POST',
                        mode: 'cors',
                        credentials: 'omit',
                        body: JSON.stringify({
                            token: apiKey.value,
                        }),
                    }
                )
                const data = await response.json()

                if (data.user_id) {
                    updateStatusIndicator(
                        statusIndicator,
                        statusText,
                        true,
                        `✓ API key is valid: user_id = ${data.user_id}`
                    )
                } else {
                    updateStatusIndicator(
                        statusIndicator,
                        statusText,
                        false,
                        `✗ API key error: ${response.status} ${response.statusText} ${JSON.stringify(data)}`
                    )
                }
            } catch (err) {
                updateStatusIndicator(
                    statusIndicator,
                    statusText,
                    false,
                    `✗ API test failed: ${err.message}`
                )
            }
        })

    // Generate API key button handler
    document.getElementById('generateApiKey').addEventListener('click', () => {
        if (serverUrl.value) {
            window.open(`${serverUrl.value}/admin/api/apitoken/add/`, '_blank')
        } else {
            alert('Please enter a server URL first')
        }
    })

    // Login server button handler
    document.getElementById('loginServer').addEventListener('click', () => {
        if (serverUrl.value) {
            window.open(`${serverUrl.value}/admin`, '_blank')
        }
    })
    document
        .getElementById('loginAdminUILink')
        .addEventListener('click', () => {
            if (serverUrl.value) {
                window.open(`${serverUrl.value}/admin/login/`, '_blank')
            }
        })
    document
        .getElementById('generateApiKeyLink')
        .addEventListener('click', () => {
            if (serverUrl.value) {
                window.open(
                    `${serverUrl.value}/admin/api/apitoken/add/`,
                    '_blank'
                )
            }
        })

    // Special handler for the auto-archive toggle
    autoArchiveCheckbox.addEventListener('change', async () => {
        if (autoArchiveCheckbox.checked) {
            const granted = await browser.permissions.request({
                permissions: ['tabs'],
            })
            if (!granted) {
                autoArchiveCheckbox.checked = false
                alert(
                    'The "tabs" permission is required for auto-archiving. Auto-archiving has been disabled.'
                )
            }
        }

        await browser.storage.local.set({
            enable_auto_archive: autoArchiveCheckbox.checked,
        })
    })

    // Other inputs
    ;[serverUrl, apiKey, matchUrls, excludeUrls].forEach((input) => {
        input.addEventListener('change', async () => {
            await browser.storage.local.set({
                archivebox_server_url: serverUrl.value.replace(/\/$/, ''),
                archivebox_api_key: apiKey.value.trim(),
                match_urls: matchUrls.value,
                exclude_urls: excludeUrls.value,
            })
        })
    })

    // Test URL functionality
    const testUrlInput = document.getElementById('testUrl')
    const testButton = document.getElementById('testAdding')
    const testStatus = document.getElementById('urlStatusText')

    testButton.addEventListener('click', async () => {
        const url = testUrlInput.value.trim()

        if (!url) {
            testStatus.innerHTML = `
        <span></span>
        ⌨️ Please enter a URL to test
      `
            return
        }

        // test if the URL matches the regex match patterns
        let shouldArchive = false
        let matchPattern
        try {
            matchPattern = new RegExp(matchUrls.value || /^$/)
        } catch (error) {
            testStatus.innerHTML = `
        <span></span>
        Error with match pattern: ${error.message}<br/>
      `
            return
        }

        if (matchPattern.test(url)) {
            testStatus.innerHTML = `
        <span></span>
        ➕ URL would be auto-archived when visited<br/>
      `
            shouldArchive = true
        } else {
            testStatus.innerHTML = `
        <span></span>
        ☝ URL does not match the auto-archive pattern (but it can still be saved manually)<br/>
      `
        }

        // test if the URL matches the regex exclude patterns
        let excludePattern
        try {
            excludePattern = new RegExp(excludeUrls.value || /^$/)
            if (excludePattern.test(url)) {
                testStatus.innerHTML = `
        <span></span>
          🚫 URL is excluded from auto-archiving (but it can still be saved manually)<br/>
        `
                shouldArchive = false
            }
        } catch (error) {
            testStatus.innerHTML = `
        <span></span>
        Error with exclude pattern: ${error.message}<br/>
      `
        }

        if (shouldArchive) {
            // Show loading state
            testButton.disabled = true
            testStatus.innerHTML += `
        <span id="inprogress-test">
          &nbsp; &nbsp; <span role="status" aria-hidden="true"></span>
          Submitting...
        </span>
      `

            try {
                const testSnapshot = new Snapshot(
                    url,
                    ['test'],
                    'Test Snapshot'
                )

                document.getElementById('inprogress-test').remove()

                await addToArchiveBox([testSnapshot.url], testSnapshot.tags)

                testStatus.innerHTML += `
          &nbsp; <span></span>
          🚀 URL was submitted and <a href="${serverUrl.value}/" target="_blank">✓ queued for archiving</a> on the ArchiveBox server: <a href="${serverUrl.value}/archive/${testSnapshot.url}" target="_blank">📦 <code>${serverUrl.value}/archive/${testSnapshot.url}</code></a>.
        `
                // Clear the input on success
                testUrlInput.value = ''
            } catch (error) {
                testStatus.innerHTML += `
          <span></span>
          Error: ${error.message}
        `
            } finally {
                testButton.disabled = false
            }
        }
    })

    // Add Enter key support for test URL input
    testUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            testButton.click()
        }
    })
}
