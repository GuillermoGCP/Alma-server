# Alma Lactancia Server

The project involves developing a website for "Alma Lactancia," a non-profit organization dedicated to supporting and promoting breastfeeding. The site will provide easy access to vital information, educational resources, upcoming events, and support services for mothers and families. Its goal is to enhance the association's outreach and facilitate access to valuable resources and support.

**Scripts**:
<small>npm run dev</small>, to start the project in development mode.

**Stack**: <small>"cors": "^2.8.5", "dotenv": "^16.4.5", "express": "^4.19.2", "googleapis": "^140.0.1", "jsonwebtoken": "^9.0.2", "bcrypt": "^5.1.1",</small>

### Endpoints:

**Important Note: due to the data insertion system in Google API spreadsheets, it is very important that the fields in the json objects are sent in the same order as indicated here.**

**Nota importante: Debido al sistema de inserción de datos en las hojas de cálculo de la API de Google es muy importante que los campos en los objetos json se envíen en el mismo orden que aquí se indica.**

**Activities**
Path to create activities:
Method: post,
Path: `/create-activity`
Required fields (in JSON format):

-   summary: <font color="red">(Required)</font>
-   description: <font color="green">(Optional)</font>
-   start: { <font color="red">(Required)</font>
    dateTime: "2024-08-09T10:00:00+02:00", (Fecha y hora de inicio en formato ISO 8601) <font color="red">(Required)</font>
    timeZone: "Europe/Madrid" <font color="green">(Optional)</font>
    },
    end: { <font color="red">(Required)</font>
-   dateTime: "2024-08-09T12:00:00+02:00", (Fecha y hora de finalización en formato ISO 8601) <font color="red">(Required)</font>
-   timeZone: "Europe/Madrid" <font color="green">(Optional)</font>
    },
-   location: "123 de Michelena, Pontevedra, ES", <font color="green">(Optional)</font>
-   attendees: [ (Lista de asistentes, <font color="green">(Optional)</font>)
    { email: "fulano@example.com" },
    { email: "mengano@example.com" }
    ],
-   reminders: { (Recordatorios del evento <font color="green">(Optional)</font>)
-   useDefault: false, (En este caso, No usar recordatorios por defecto)
-   overrides: [ (Lista de recordatorios personalizados)
    { method: "email", minutes: 1440 }, (En este ejemplo: Enviar email un día antes (1440 minutos))
    { method: "popup", minutes: 10 } (En este ejemplo: Mostrar popup 10 minutos antes del evento)
    ]
    },
-   visibility: "private", (Visibilidad del evento, puede ser 'default', 'public' o 'private') <font color="red">(Required)</font>
-   access: "partners" (Acceso, en este caso para 'socios', puede ser 'partners' o 'free') <font color="red">(Required)</font>

    _All fields are required._

Path to get activities by filter params:
Method: post,
Path: `/get-filtered-activities`
Required fields (in JSON format):

-   id
-   summary
-   description
-   exactDate (custom format: Miércoles, 10 de Septiembre de 2025, 12:00)
-   dateFrom (custom format: Miércoles, 10 de Septiembre de 2025, 12:00)
-   dateUntil (custom format: Miércoles, 10 de Septiembre de 2025, 12:00)
-   location
-   access

    _All fields are optional._

**Forms**
Path to create an dinamic form:
Method: post,
Path: `/create-form`
Required fields (are sent from FormBuilderComponent)

Path to send data to dinamic sheet:
Method: post,
Path: `/submit-form/:sheetName`
Required fields (are sent from FormDisplayComponent)

Path to get all forms:
Method: get,
Path: `/get-all-forms`
(Use by FormDropDownComponent)

Other paths:
Method:patch `/update-form`
Method:delete `/delete-form/:formId/:deleteSheet?/:sheetName?`
Method:get `/get-form/:formId/:publish?`
Method:get `/get-published-form`
Method:get `/unpublish-form`
Method:get `/check-is-published/:formId`

**Collaborators/Teams members**

Route to register a new collaborator/team member:
Method: post,
Path: `/new-collaborator`
Required fields (in JSON format):

-   name <font color="red">(Required)</font>
-   surname <font color="red">(Required)</font>
-   description <font color="red">(Required)</font>
-   role <font color="green">(Optional)</font>
-   collaboratorImage <font color="green">(Optional)</font>
-   team (habrá que enviar un booleano, true para miembros del equipo y false para colaboradores externos)<font color="red">(Required)</font>

Method: patch,
Path: `/update-collaborator/:id/:team`
Required fields (id, team) in params:
Required fields (in JSON format):

-   name
-   surname
-   description
-   role
-   collaboratorImage

    _All JSON fields are optional._

Method: delete,
Path: `/delete-collaborator/:id/:team` (En team habrá que enviar "true" si es miembro o "false" si es colaborador)
Required fields from params.

**Home data**

Route to update home data:
Method: patch,
Path: `/update-home-data`
Required fields (in JSON format):

-   home: {sectionText, imageHome,titleHome} <font color="red">(Required)</font>
-   generalSettings:{logo,linkInstagram,linkFacebok,email} <font color="red">(Required)</font>
-   images: (send in formData object)
    _All JSON fields are optional._

Route to get home data:
Method: get,
Get: `/get-home-data`

**Calendar events**

**Note: Events/activities will be automatically added to the calendar from the server once created from the web form.**
**Nota: Los eventos/actividades se añadirán automáticamente al calendario desde el servidor una vez creados desde el formulario de la web.**

Path to add get list activities:
Method: get,
Path: `/get-calendar-event/:eventId`
Required fields (in params):

Path to delete an event:
Method: delete,
Path: `/delete-calendar-event/:eventId/:delete-from-sheet?`
Required field in params: (delete-from-sheet: true or false)

Path to update an event:
Method: patch,
Path: `/update-calendar-event/:eventId/:update-from-sheet?`
Required eventId field in params:
Required eventDetails object in JSON format (The same object as when an event is created)

_All JSON fields are optional._

Path to add get list activities:
Method: post,
Path: `/list-calendar-events`
Required fields (in JSON format):

-   maxResults: 10 (Número máximo de eventos a devolver)
-   orderBy: 'startTime' (Tambien: 'updated')
-   singleEvents: true
-   timeMin: new Date().toISOString() (La fecha y hora mínima para filtrar los eventos. Solo se devolverán los eventos que comiencen después de esta fecha y hora. En este ejemplo, solo se mostrarán eventos futuros)

    _All fields are required._

**contact**
Path to save contact data:
Method: post,
Path: `/new-contact-message`
Required fields (in JSON format):

-   name
-   surname
-   email
-   subject
-   comments

    _All fields are required._

**experiences**
Method: post,
Path: `/save-experience`
Required fields:

-   text
-   image

    _All fields are required._

Method: post,
Path: `/update-experience`
Required fields:

-   text
-   image

    _All fields are optional._

Method: get,
Path: `/get-all-experiences`

Method: get,
Path: `/get-experience/:id`

**captcha**
Path to save generate captcha:
Method: get,
Path: `/generate-captcha`

Path to save validate captcha:
Method: get,
Path: `/validate-captcha`
Required fields (in JSON format):

-   captcha (el texto del captcha)

### Developer

[Guillermo Cerviño Porto](https://www.linkedin.com/in/guillermocporto/)

[TOC]
