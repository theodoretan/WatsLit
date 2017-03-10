# Usage

Each endpoint corresponds to a specific function which returns a promise that
resolves to the payload and which may require a list of parameters. These
parameters should be passed in as an object. Some functions may accept different
sets of parameters but all valid calls must include exactly the parameters in
the given list (e.g the foodservicesMenu function must either consume no options
or be provided with both the year and week). The output of each function is what
is expected to be returned by the relevant endpoint (this is documented on the
UW api. GET parameters can optionally be passed in as a second argument, see the
code in [README.md](README.md)

## Example

See README.md

# Endpoint Mapping

<table>
<tr><th>endpoint</th><th>function</th><th>parameters</th></tr>
<tr><td>/foodservices/menu</td>
<td>foodservicesMenu</td><td>
None
</td></tr>
<tr><td>/foodservices/{year}/{week}/menu</td>
<td>foodservicesMenu</td><td>
year, week
</td></tr>
<tr><td>/foodservices/notes</td>
<td>foodservicesNotes</td><td>
None
</td></tr>
<tr><td>/foodservices/{year}/{week}/notes</td>
<td>foodservicesNotes</td><td>
year, week
</td></tr>
<tr><td>/foodservices/diets</td>
<td>foodservicesDiets</td><td>
None
</td></tr>
<tr><td>/foodservices/outlets</td>
<td>foodservicesOutlets</td><td>
None
</td></tr>
<tr><td>/foodservices/locations</td>
<td>foodservicesLocations</td><td>
None
</td></tr>
<tr><td>/foodservices/watcard</td>
<td>foodservicesWatcard</td><td>
None
</td></tr>
<tr><td>/foodservices/announcements</td>
<td>foodservicesAnnouncements</td><td>
None
</td></tr>
<tr><td>/foodservices/{year}/{week}/announcements</td>
<td>foodservicesAnnouncements</td><td>
year, week
</td></tr>
<tr><td>/foodservices/products/{product_id}</td>
<td>foodservices</td><td>
product_id
</td></tr>
<tr><td>/foodservices/products/search</td>
<td>foodservicesSearch</td><td>
None
</td></tr>
<tr><td>/courses/{subject}</td>
<td>courses</td><td>
subject
</td></tr>
<tr><td>/courses/{course_id}</td>
<td>courses</td><td>
course_id
</td></tr>
<tr><td>/courses/{subject}/{catalog_number}</td>
<td>courses</td><td>
subject, catalog_number
</td></tr>
<tr><td>/courses/{class_number}/schedule</td>
<td>coursesSchedule</td><td>
class_number
</td></tr>
<tr><td>/courses/{subject}/{catalog_number}/schedule</td>
<td>coursesSchedule</td><td>
subject, catalog_number
</td></tr>
<tr><td>/courses/{subject}/{catalog_number}/prerequisites</td>
<td>coursesPrerequisites</td><td>
subject, catalog_number
</td></tr>
<tr><td>/courses/{subject}/{catalog_number}/examschedule</td>
<td>coursesExamschedule</td><td>
subject, catalog_number
</td></tr>
<tr><td>/events</td>
<td>events</td><td>
None
</td></tr>
<tr><td>/events/{site}</td>
<td>events</td><td>
site
</td></tr>
<tr><td>/events/{site}/{id}</td>
<td>events</td><td>
site, id
</td></tr>
<tr><td>/events/holidays</td>
<td>eventsHolidays</td><td>
None
</td></tr>
<tr><td>/news</td>
<td>news</td><td>
None
</td></tr>
<tr><td>/news/{site}</td>
<td>news</td><td>
site
</td></tr>
<tr><td>/news/{site}/{id}</td>
<td>news</td><td>
site, id
</td></tr>
<tr><td>/weather/current</td>
<td>weatherCurrent</td><td>
None
</td></tr>
<tr><td>/terms/list</td>
<td>termsList</td><td>
None
</td></tr>
<tr><td>/terms/{term_id}/examschedule</td>
<td>termsExamschedule</td><td>
term_id
</td></tr>
<tr><td>/terms/{term_id}/{subject}/schedule</td>
<td>termsSchedule</td><td>
term_id, subject
</td></tr>
<tr><td>/terms/{term_id}/{subject}/{catalog_number}/schedule</td>
<td>termsSchedule</td><td>
term_id, subject, catalog_number
</td></tr>
<tr><td>/terms/{term_id}/infosessions</td>
<td>termsInfosessions</td><td>
term_id
</td></tr>
<tr><td>/resources/tutors</td>
<td>resourcesTutors</td><td>
None
</td></tr>
<tr><td>/resources/printers</td>
<td>resourcesPrinters</td><td>
None
</td></tr>
<tr><td>/resources/infosessions</td>
<td>resourcesInfosessions</td><td>
None
</td></tr>
<tr><td>/resources/goosewatch</td>
<td>resourcesGoosewatch</td><td>
None
</td></tr>
<tr><td>/resources/sites</td>
<td>resourcesSites</td><td>
None
</td></tr>
<tr><td>/codes/units</td>
<td>codesUnits</td><td>
None
</td></tr>
<tr><td>/codes/terms</td>
<td>codesTerms</td><td>
None
</td></tr>
<tr><td>/codes/groups</td>
<td>codesGroups</td><td>
None
</td></tr>
<tr><td>/codes/subjects</td>
<td>codesSubjects</td><td>
None
</td></tr>
<tr><td>/codes/instructions</td>
<td>codesInstructions</td><td>
None
</td></tr>
<tr><td>/buildings/list</td>
<td>buildingsList</td><td>
None
</td></tr>
<tr><td>/buildings/{building_acronym}</td>
<td>buildings</td><td>
building_acronym
</td></tr>
<tr><td>/buildings/{building_acronym}/{room_number}/courses</td>
<td>buildingsCourses</td><td>
building_acronym, room_number
</td></tr>
<tr><td>/api/usage</td>
<td>apiUsage</td><td>
None
</td></tr>
<tr><td>/api/services</td>
<td>apiServices</td><td>
None
</td></tr>
<tr><td>/api/methods</td>
<td>apiMethods</td><td>
None
</td></tr>
<tr><td>/api/versions</td>
<td>apiVersions</td><td>
None
</td></tr>
<tr><td>/api/changelog</td>
<td>apiChangelog</td><td>
None
</td></tr>
<tr><td>/server/time</td>
<td>serverTime</td><td>
None
</td></tr>
<tr><td>/server/codes</td>
<td>serverCodes</td><td>
None
</td></tr>
</table>
