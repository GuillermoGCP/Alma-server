import { generateError } from '../../../utils/index.js'
import { calendar } from '../../client.js'

const addEvent = async (eventDetails) => {
    try {
        const data = {
            calendarId: process.env.CALENDAR_ID,
            resource: eventDetails,
        }
        const response = await calendar.events.insert(data)

        return response.data
    } catch (error) {
        generateError('Error creating event:', error)
        throw error
    }
}

export default addEvent

// Estructura del objeto a pasar:
// const eventDetails = {
//     summary: 'Team Meeting',
//     location: '123 Main St, Anytown, USA',
//     description: 'Discussing quarterly goals',
//     start: {
//         dateTime: '2024-08-10T10:00:00-07:00',
//         timeZone: 'America/Los_Angeles',
//     },
//     end: {
//         dateTime: '2024-08-10T11:00:00-07:00',
//         timeZone: 'America/Los_Angeles',
//     },
//     attendees: [
//         { email: 'bob@example.com' },
//         { email: 'alice@example.com' },
//     ],
//     reminders: {
//         useDefault: false,
//         overrides: [
//             { method: 'popup', minutes: 10 },
//             { method: 'email', minutes: 24 * 60 },
//         ],
//     },
//     colorId: '11',
//     visibility: 'public',
//     conferenceData: {
//         createRequest: {
//             conferenceSolutionKey: { type: 'hangoutsMeet' },
//         },
//     },
//     guestsCanInviteOthers: true,
//     guestsCanModify: false,
//     guestsCanSeeOtherGuests: true,
// };

//Estructura de la respuesta:
//{
//     "kind": "calendar#event",
//     "etag": "\"etag_string\"",
//     "id": "event_id",
//     "status": "confirmed",
//     "htmlLink": "https://www.google.com/calendar/event?eid=event_id",
//     "created": "2024-08-05T12:34:56.000Z",
//     "updated": "2024-08-05T12:34:56.000Z",
//     "summary": "Event summary",
//     "description": "Event Description",
//     "location": "Event Location",
//     "start": {
//         "dateTime": "2024-08-10T10:00:00-07:00",
//         "timeZone": "America/Los_Angeles"
//     },
//     "end": {
//         "dateTime": "2024-08-10T11:00:00-07:00",
//         "timeZone": "America/Los_Angeles"
//     },
//     "attendees": [
//         {
//             "email": "attendee@example.com",
//             "self": false,
//             "responseStatus": "needsAction"
//         }
//     ],
//     "reminders": {
//         "useDefault": false,
//         "overrides": [
//             {
//                 "method": "popup",
//                 "minutes": 10
//             },
//             {
//                 "method": "email",
//                 "minutes": 24 * 60
//             }
//         ]
//     },
//     "colorId": "11",
//     "visibility": "default",
//     "conferenceData": {
//         "entryPoints": [
//             {
//                 "entryPointType": "video",
//                 "uri": "https://meet.google.com/abc-defg-hij",
//                 "label": "meet.google.com/abc-defg-hij"
//             }
//         ]
//     },
//     "guestsCanInviteOthers": true,
//     "guestsCanModify": false,
//     "guestsCanSeeOtherGuests": true,
//     "creator": {
//         "email": "creator@example.com",
//         "self": true
//     },
//     "organizer": {
//         "email": "organizer@example.com",
//         "self": true
//     },
//     "eventType": "default"
// }
