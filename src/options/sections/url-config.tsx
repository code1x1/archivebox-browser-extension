import { TagsModal } from '../modal/tags'

export function UrlConfig() {
    return (
        <div id="urls" role="tabpanel">
            <div>
                <div>
                    <div>
                        <div>
                            <button id="selectAllUrls">
                                ☑ <span id="selectedUrlCount">0</span>
                            </button>
                        </div>
                        <div>
                            <label aria-label="Search" for="filterInput">
                                🔍
                            </label>
                            <input
                                type="search"
                                id="filterInput"
                                placeholder="Search by URL, title, or tags..."
                            />
                        </div>
                        <div>
                            <TagsModal />
                        </div>
                        <div>
                            <button id="downloadCsv">⬇️ CSV</button>
                            <button id="downloadJson">⬇️ JSON</button>
                        </div>
                        &nbsp;
                        <div>
                            <button id="deleteFiltered">🗑️ Delete</button>
                        </div>
                        &nbsp; &nbsp;
                        <div>
                            <button id="syncFiltered">
                                ⬆️ Sync to ArchiveBox
                            </button>
                        </div>
                    </div>
                    <div id="snapshotsList"></div>
                </div>

                <div>
                    <h2>Tags</h2>
                    <div id="tagsList"></div>
                </div>
            </div>
        </div>
    )
}
