import React, { useState, useEffect } from "react"


export default function MailingListEditor() {
    //When rendered, the list will fetch the emails from the 
    //data in that particular spot
    //
    return (
        <>
            <div className="mailing-list-editor-main-body">
                <div className="mailing-list-editor-title-and-edit-btn">
                    <h2>Name of the List</h2>
                    <button>edit</button>
                </div>
                <div className="mailing-list-editor-add-new-contact">
                    <div className="mailing-list-editor-new-contact-input-and-btn">
                        <button>Add new contact</button>
                        <p>HERE FORM WHEN BUTTON CLICKED</p>
                    </div>
                </div>
                <div>
                    <div className="mailing-list-editor-element-list">
                        <ul><li>element 1
                            <button>edit</button>
                            <button>delete</button>
                        </li>
                        </ul>
                    </div>
                    <div className="mailing-list-editor-element-list">
                        <ul><li>element 2
                            <button>edit</button>
                            <button>delete</button>
                        </li>
                        </ul>
                    </div>


                </div>
            </div>
        </>

    )
}
