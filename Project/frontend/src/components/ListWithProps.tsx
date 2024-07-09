import React from 'react'
import { MailingList, Contact } from '../../../shared/types/Types'

interface ListWithPropsProps {
    mailingList: MailingList;
}

interface Email {
    emails: Contact;
}

const ListWithProps: React.FC<ListWithPropsProps> = ({ mailingList: { id, name, emails } }) => {

    return (
        <>
            <div>
                <ul>
                    <li><h3>name: {name}</h3></li>
                    <li><h3>e-mails:</h3></li>
                    <ul>
                        {emails.map(
                            (email, index) => (
                                <li key={index}>{email}</li>
                            )
                        )}
                    </ul>
                </ul>
            </div>
        </>
    )
}

export default ListWithProps;