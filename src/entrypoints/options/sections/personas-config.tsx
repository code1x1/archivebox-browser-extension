export function PersonasConfig() {
    return (
        <div id="personas" role="tabpanel">
            <div>
                <div>
                    <div>
                        <h3>Advanced: Logged-in Archiving</h3>
                        For{' '}
                        <a
                            href="https://github.com/ArchiveBox/ArchiveBox/wiki/Chromium-Install#setting-up-a-chromium-user-profile"
                            style="color: darkblue"
                        >
                            Logged-in Archiving
                        </a>
                        , you must set up one or more{' '}
                        <code>Archiving Profiles</code> by importing the
                        credentials you need from a browser. An{' '}
                        <code>Archiving Profile</code> is ArchiveBox's
                        equivalent to a browser profile, it's a set of cookies
                        or login credentials to the websites you want to
                        capture.
                        <br />
                        <hr />
                        To import cookies from this browser and use them for
                        archiving, click the <code>
                            Export cookies.txt
                        </code>{' '}
                        button on the profile you want to use below. <br />
                        <br />
                        <pre>
                            # save the cookies.txt contents into a text file on
                            your ArchiveBox server, then run: archivebox config
                            --set{' '}
                            <a
                                href="https://github.com/ArchiveBox/ArchiveBox/wiki/Configuration#cookie_file"
                                style="color: darkblue"
                            >
                                COOKIE_FILE
                            </a>
                            =$PWD/cookies.txt # advanced: copy a Chrome user
                            data directory (Profile Path visible on
                            chrome://profile-internals) to the server to use it
                            for logged-in archiving: archivebox config --set{' '}
                            <a
                                href="https://github.com/ArchiveBox/ArchiveBox/wiki/Configuration#chrome_user_data_dir"
                                style="color: darkblue"
                            >
                                CHROME_USER_DATA_DIR
                            </a>
                            =$PWD/chrome-user-data
                        </pre>
                    </div>
                    <div>
                        It's recommended to create{' '}
                        <a
                            href="https://docs.sweeting.me/s/cookie-dilemma"
                            style="color: darkblue"
                        >
                            dedicated separate accounts
                        </a>{' '}
                        for archiving and normal browsing to avoid embedding
                        your personal browsing data + cookies headers into the
                        archives.
                        <br />
                        e.g. if you normally log in to Twitter as{' '}
                        <code>johndoe@example.com</code>, you should not archive
                        with that account, but instead create a new account for
                        archiving like <code>johndoeswitness@example.com</code>.
                    </div>

                    <div>
                        <div>
                            <h5 style="min-width: 150px;">Archiving Profile</h5>
                            <select id="activePersona">
                                <option value="">Select a profile...</option>
                            </select>
                            &nbsp;
                            <div
                                id="personaStats"
                                style="min-width: 150px"
                            ></div>
                            <button id="newPersona" style="min-width: 95px">
                                ➕ &nbsp; New
                            </button>
                        </div>
                        <div>
                            <div>
                                <table id="personaTable">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Domains</th>
                                            <th>Last Used</th>
                                            <th style="width: 50%;">
                                                Settings
                                            </th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div>
                            <h5>Import Browser Cookies to Archiving Profile</h5>
                            <button id="requestCookiesPermission">
                                📥 Load Browser Cookies
                            </button>
                        </div>
                        <div>
                            <div>
                                <div>
                                    <button id="selectAllCookies">☑</button>
                                    <button id="deselectAllCookies">☐</button>
                                </div>
                                <div style="max-width: 950px;">
                                    <span>🔎</span>
                                    <input
                                        type="search"
                                        id="cookieFilter"
                                        placeholder="Filter domains..."
                                    />
                                </div>
                                <button id="importCookies" disabled>
                                    Import Cookies to Active Profile <i></i>
                                </button>
                            </div>

                            <div>
                                <table id="cookieTable">
                                    <thead>
                                        <tr>
                                            <th style="width: 40px;"></th>
                                            <th>Domain</th>
                                            <th style="width: 100px;">
                                                Cookies
                                            </th>
                                            <th>
                                                Export <code>cookies.txt</code>
                                            </th>
                                            <th>Select for archiving</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>

                            <div>
                                <div>
                                    <span>
                                        Selected:{' '}
                                        <span id="selectedCookieCount">0</span>
                                    </span>
                                    <button id="selectAllCookiesBottom">
                                        Select All
                                    </button>
                                    <button id="deselectAllCookiesBottom">
                                        Deselect All
                                    </button>
                                </div>
                                <button id="importCookies" disabled>
                                    Import Cookies to Active Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
