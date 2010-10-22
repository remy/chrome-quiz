#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util
import gdata.spreadsheet.text_db
import urllib
import config # contains: email, password, spreadsheet, worksheet

def StringToDictionary(row_data):
  result = {}
  for param in row_data.split('&'):
    name, value = map(urllib.unquote, param.split('='))
    result[name] = value
  return result

class saveUser(webapp.RequestHandler):
    def post(self):
      self.response.headers['Content-Type'] = 'text/plain'
      
      try:
        gd_client = gdata.spreadsheet.service.SpreadsheetsService()
        gd_client.email = config.email
        gd_client.password = config.password
        gd_client.source = 'chrome-quiz'
        gd_client.ProgrammaticLogin()
        entry = gd_client.InsertRow(StringToDictionary(self.request.body), config.spreadsheet, config.worksheet)
        if isinstance(entry, gdata.spreadsheet.SpreadsheetsList):
          self.response.out.write('1')
        else:
          self.response.out.write('0')
      except:
        self.response.out.write('0')
    def get(self):
      self.response.headers['Content-Type'] = 'text/html'
      self.response.out.write('only posts accepted.')      

def main():
    application = webapp.WSGIApplication([('/save', saveUser)], 
                                        debug=True)
    util.run_wsgi_app(application)

if __name__ == '__main__':
    main()
