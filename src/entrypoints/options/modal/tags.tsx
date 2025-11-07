import { createPortal } from 'preact/compat'
import { useState } from 'preact/hooks'
import { app } from '../../../utils/html'

export function TagsModal() {
    const [open, setOpen] = useState(false)
    const onOpen = () => setOpen(true)
    const onClose = () => setOpen(false)
    return (
        <>
            <button onClick={onOpen} id="editTags">
                ✏️ Tags
            </button>

            {open &&
                createPortal(
                    <div tabIndex={-1} className="modal">
                        <div>
                            <div>
                                <div>
                                    <h5>Edit Tags</h5>
                                    <button
                                        type="button"
                                        data-bs-dismiss="modal"
                                    ></button>
                                </div>
                                <div>
                                    <div>
                                        <label>Current Tags</label>
                                        <div id="currentTagsList"></div>
                                    </div>
                                    <div>
                                        <label>Add Tag</label>
                                        <div>
                                            <input
                                                type="text"
                                                id="addTagInput"
                                                placeholder="Type to add tag..."
                                            />
                                            <div id="tagAutocomplete"></div>
                                        </div>
                                    </div>
                                    <small>
                                        Selected snapshots:{' '}
                                        <span id="selectedUrlCountModal">
                                            0
                                        </span>
                                    </small>
                                </div>
                                <div>
                                    <button type="button" onClick={onClose}>
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        id="saveTagChanges"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>,
                    app
                )}
        </>
    )
}
