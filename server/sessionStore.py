import base64
import os


class SessionStore:

    def __init__(self):
        self.sessionData = {}

    def generateSessionID(self):
        rnum = os.urandom(32)
        rstr = base64.b64encode(rnum).decode("utf-8")
        return rstr

    def createSession(self):
        sessionId = self.generateSessionID()
        self.sessionData[sessionId] = {}
        return sessionId

    def getSession(self,sessionId):
        if sessionId in self.sessionData:
            return self.sessionData[sessionId]
        else:
            return None
        
    