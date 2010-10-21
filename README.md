# Configuration

This code should be deployed on a Google App Engine. To get the application writing to the Google Spreadsheet, edit <code>save.py</code> adding the following missing values:

- email
- password
- spreadsheet
- worksheet

Note that <code>spreadsheet</code> IDs looks something like: <code>pk3rIlY3R4RXNEt_7nZw</code>.

<code>worksheet</code> is generally <code>od6</code> - but needs to be checked.

If there are issues completing the update request, the appengine will throw errors.

## Important

The spreadsheet that's written too must include the following header, using these specific titles (and casing):

- name
- code
- datetime
- chrome