import React from 'react'
import { MailingList, Contact } from '../../../shared/types/Types'

interface ListWithPropsProps {
    mailingList: MailingList;
}

const ListWithProps: React.FC<ListWithPropsProps> = ({ mailingList: { id, name, emails } }) => {

    return (
        <>
            <div>
                <ul>
                    <li><h3>name: {name}</h3></li>
                    {emails && emails.length > 0 && (
                        <li>
                            <h3>Emails:</h3>
                            <ul>
                                {emails.map((email, index) => (
                                    <li key={index}>{email.email}</li>
                                ))}
                            </ul>
                        </li>
                    )}
                </ul>
            </div>
        </>
    )
}

export default ListWithProps;