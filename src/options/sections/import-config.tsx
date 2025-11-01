export function ImportConfig() {
    return (
        <div id="import" role="tabpanel">
            <div>
                <div>
                    <ul role="tablist">
                        <li>
                            <a
                                id="history-tab"
                                data-bs-toggle="pill"
                                href="#history"
                                role="tab"
                            >
                                📜 Import from Browser History
                            </a>
                        </li>
                        <li>
                            <a
                                id="bookmarks-tab"
                                data-bs-toggle="pill"
                                href="#bookmarks"
                                role="tab"
                            >
                                📌 Import from Browser Bookmarks
                            </a>
                        </li>
                    </ul>

                    <div>
                        <div>
                            <div>
                                <div>
                                    <button id="selectAll">
                                        ☑ <span id="selectedCount">0</span>
                                    </button>
                                    <button id="deselectAll">☐</button>
                                </div>
                                <div style="max-width: 600px;">
                                    <input
                                        type="search"
                                        id="importFilter"
                                        placeholder="Filter URLs and titles..."
                                    />
                                    <div>
                                        <input
                                            type="checkbox"
                                            id="showNewOnly"
                                        />
                                        <label for="showNewOnly">
                                            Show new only
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <span>From</span>
                                    <input type="date" id="historyStartDate" />
                                    <span>To</span>
                                    <input type="date" id="historyEndDate" />
                                </div>
                                <div style="max-width: 600px;">
                                    <span>Tags</span>
                                    <input
                                        type="text"
                                        id="importTags"
                                        placeholder="Add tags (comma,separated)"
                                    />
                                    <button id="importSelected">
                                        Import Selected &nbsp; <i></i>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <table id="importTable">
                                    <thead>
                                        <tr>
                                            <th style="width: 40px;">
                                                <input
                                                    type="checkbox"
                                                    id="selectAllHeader"
                                                />
                                            </th>
                                            <th>URL</th>
                                            <th>Title</th>
                                            <th>Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
