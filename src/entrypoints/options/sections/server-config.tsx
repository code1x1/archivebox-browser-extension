import browser from 'webextension-polyfill'

import { useCallback, useState } from 'preact/hooks'
import { Input } from '../../../components/input'
import { useAsyncEffect } from '../../../hooks/use-async-effect'
import { getArchiveBoxServerUrl, updateStatusIndicator } from '../../../utils'

export function ServerConfig() {
        console.log("2");
    const [archivebox_server_url, setArchivebox_server_url] = useState('')
    const [archivebox_api_key, setArchivebox_api_key] = useState('')
    const [match_urls, setMatch_urls] = useState(INCLUDE_URLS_DEFAULT)
    const [exclude_urls, setExclude_urls] = useState(EXCLUDE_URLS_DEFAULT)
    const [enable_auto_archive, setEnable_auto_archive] = useState(false)
    const [serverStatus, setServerStatus] = useState('')

    useAsyncEffect(async () => {
        console.log("1");
        
        const archivebox_server_url = await getArchiveBoxServerUrl()
        setArchivebox_server_url(archivebox_server_url)
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
        setArchivebox_api_key(archivebox_api_key)
        setMatch_urls(match_urls)
        setExclude_urls(exclude_urls)
        setEnable_auto_archive(enable_auto_archive)
    })

    const testServer = useCallback(async () => {
        // Check if we have permission to access the server
        const permission = await browser.permissions.request({
            permissions: ['cookies'],
            origins: [`${archivebox_server_url}/*`],
        })
        if (!permission) {
            alert('Permission denied.')
            return
        }

        // Test request to server.
        try {
            let response = await fetch(`${archivebox_server_url}/api/`, {
                method: 'GET',
                mode: 'cors',
                credentials: 'omit',
            })

            // fall back to pre-v0.8.0 endpoint for backwards compatibility
            if (response.status === 404) {
                response = await fetch(`${archivebox_server_url}`, {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'omit',
                })
            }

            if (response.ok) {
                setServerStatus('✓ Server is reachable')
            } else {
                setServerStatus(
                    `✗ Server error: ${response.status} ${response.statusText}`
                )
            }
        } catch (err) {
            setServerStatus(`✗ Connection failed: ${err.message}`)
        }
    }, [])

    const loginServer = () => {
        if (archivebox_server_url) {
            window.open(`${archivebox_server_url}/admin/`, '_blank')
        }
    }

    const loginAdminUILink = () => {
        if (archivebox_server_url) {
            window.open(`${archivebox_server_url}/admin/login/`, '_blank')
        }
    }

    return (
        <div id="config" role="tabpanel">
            <div>
                <div>
                    <form id="configForm" novalidate>
                        <div>
                            <label for="archivebox_server_url">
                                <b>📟 ArchiveBox Server URL *</b>
                            </label>
                            <div>
                                <Input
                                    type="url"
                                    id="archivebox_server_url"
                                    placeholder="https://archivebox.example.com"
                                    onChange={setArchivebox_server_url}
                                    value={archivebox_server_url}
                                />
                                <button
                                    type="button"
                                    id="loginServer"
                                    onClick={loginServer}
                                >
                                    ⚙️ ADMIN UI
                                </button>
                                <button
                                    type="button"
                                    id="testServer"
                                    onClick={testServer}
                                >
                                    SAVE
                                    <span id="serverStatus"></span>
                                </button>
                            </div>
                            <div>
                                The base URL of your self-hosted{' '}
                                <a href="https://github.com/ArchiveBox/archivebox#quickstart">
                                    ArchiveBox
                                </a>{' '}
                                server, e.g. <code>http://localhost:8000</code>
                                <br />
                                This extension works by sending URLs from the
                                browser to your remote ArchiveBox server via the{' '}
                                <a href="https://demo.archivebox.io/api/v1/docs">
                                    ArchiveBox REST API
                                </a>
                                .
                                <span id="serverStatusText">
                                    {serverStatus}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label for="archivebox_api_key">
                                <b>🔐 ArchiveBox API Token</b>
                            </label>
                            <div>
                                <Input
                                    type="text"
                                    id="archivebox_api_key"
                                    pattern="^[a-f0-9]{32}$"
                                    placeholder="... abcexamplekey1234 ..."
                                    value={archivebox_api_key}
                                    onChange={setArchivebox_api_key}
                                />
                                <button type="button" id="generateApiKey">
                                    🔑 GENERATE
                                </button>
                                <button type="button" id="testApiKey">
                                    SAVE
                                    <span id="apiKeyStatus"></span>
                                </button>
                            </div>
                            <div>
                                If the server is running ArchiveBox{' '}
                                <code>&gt;= v0.8.5</code>:{' '}
                                <a href="#" id="generateApiKeyLink">
                                    Log In to your Admin UI & generate an API
                                    Token
                                </a>
                                , copy the <code>Token</code> value, set an{' '}
                                <code>Expiration Date</code>{' '}
                                <small>(REQUIRED)</small>, click{' '}
                                <code>Save</code>, then paste the value here.
                                <br />
                                If the server is running ArchiveBox{' '}
                                <code>&lt;= v0.7.3</code>:{' '}
                                <a
                                    href="#"
                                    id="loginAdminUILink"
                                    onClick={loginAdminUILink}
                                >
                                    Log In to your Admin UI
                                </a>{' '}
                                in this browser every 2 weeks{' '}
                                <small>(sorry)</small> and{' '}
                                <i>leave this field blank</i>, it will re-use
                                your admin UI login session.
                                <br />
                                To configure your server to allow submitting
                                URLs{' '}
                                <b>
                                    without requiring a login or API Token
                                </b>{' '}
                                <small>
                                    (
                                    <a href="https://github.com/ArchiveBox/ArchiveBox/wiki/Security-Overview">
                                        SECURITY RISK!
                                    </a>
                                    )
                                </small>
                                , run:{' '}
                                <code>
                                    archivebox config --set{' '}
                                    <a
                                        href="https://github.com/ArchiveBox/ArchiveBox/wiki/Configuration#PUBLIC_ADD_VIEW"
                                        style="color: darkblue"
                                    >
                                        PUBLIC_ADD_VIEW=True
                                    </a>
                                </code>
                                <br />
                                <br />
                                <div>
                                    For detailed instructions and
                                    troubleshooting tips see the{' '}
                                    <a href="https://github.com/ArchiveBox/archivebox-browser-extension#setup">
                                        🧩 ArchiveBox Extension Setup Guide
                                    </a>{' '}
                                    and{' '}
                                    <a href="https://github.com/ArchiveBox/archivebox/wiki/Configuration#public_index--public_snapshots--public_add_view">
                                        🗄️ ArchiveBox Server Config
                                        Documentation
                                    </a>
                                    .
                                </div>
                                <span id="apiKeyStatusText"></span>
                            </div>
                        </div>
                        <br />
                        <hr />
                        <br />
                        <h5>Advanced Users Only: Auto-archive URLs</h5>
                        <div>
                            <Input
                                type="checkbox"
                                id="enable_auto_archive"
                                value={enable_auto_archive}
                                onChange={setEnable_auto_archive}
                            />
                            <label for="enable_auto_archive">
                                Enable automatic archiving
                            </label>
                            <div>
                                When enabled, the extension will automatically
                                archive URLs that match the patterns below.
                            </div>
                        </div>
                        <div>
                            <label for="match_urls">
                                ➕ Auto-archive all visited URLs that match this{' '}
                                <code>regex</code> pattern
                            </label>
                            <div>
                                By default sites are only archived when you
                                click{' '}
                                <img
                                    src="/128.png"
                                    alt="ArchiveBox Extension Icon"
                                    style="vertical-align: middle; margin-right: 2px; width: 16px; "
                                />{' '}
                                <code>Save to ArchiveBox</code>.
                                <br />
                                To archive specific pages automatically whenever
                                they are visited, specify them as a{' '}
                                <a href="https://regexr.com/8d19s">
                                    regex
                                </a>{' '}
                                here.
                            </div>
                            <Input
                                type="text"
                                id="match_urls"
                                value={match_urls}
                                onChange={setMatch_urls}
                                placeholder={INCLUDE_URLS_DEFAULT}
                            />
                            <div>
                                To archive <i>all</i> visited pages (not
                                recommended), set this to: <code>.*</code>
                            </div>
                        </div>

                        <div>
                            <label for="exclude_urls">
                                🚫 Don't auto-archive URLs matching this{' '}
                                <code>regex</code> pattern
                            </label>
                            <Input
                                type="text"
                                id="exclude_urls"
                                value={exclude_urls}
                                onChange={setExclude_urls}
                                placeholder={EXCLUDE_URLS_DEFAULT}
                            />
                            <div>
                                <a href="regexr.com/8d19v">Regex of URLs</a> to
                                never automatically archive (does not prevent
                                adding them manually).
                                <br />
                                Exclude sensitive URLs like your email inbox,
                                forms, corporate documents, banking sites, etc.
                                here to avoid accidentally archiving them.
                            </div>
                        </div>
                        <br />
                        <br />
                        <div>
                            <label for="testUrl">
                                🚀 Test the patterns and try adding a URL
                            </label>
                            <span id="urlStatus" style="display:none;"></span>
                            <div>
                                <input
                                    type="url"
                                    id="testUrl"
                                    placeholder="Enter a URL to test against patterns"
                                    value="https://example.com"
                                />
                                <button type="button" id="testAdding">
                                    TEST ADDING
                                    <span id="addingStatus"></span>
                                </button>
                            </div>
                            <div>
                                <span id="urlStatusText"></span>
                                <span id="addingStatusText"></span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

const EXCLUDE_URLS_DEFAULT =
    '(mail.google.com)|(docs.google.com)|(password)|(login)|(logout)|(signup)|(register)'

const INCLUDE_URLS_DEFAULT =
    '(wikipedia.org)|(archive.org)|(github.com\/ArchiveBox\/ArchiveBox\/$)'
